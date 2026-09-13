"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import JSZip from "jszip";
import {
  Upload,
  Sparkles,
  Download,
  Trash2,
  Eye,
  Sliders,
  Shield,
  Layers,
  Check,
  RefreshCw,
  Image as ImageIcon,
  FolderArchive,
  Info,
  ZoomIn,
  Plus,
  ArrowRight,
  Palette,
  Calendar,
  Building,
  Type,
  FileCheck2,
} from "lucide-react";
import { Select, SelectOption } from "@/components/ui/Select";
import {
  WatermarkConfig,
  DEFAULT_WATERMARK_CONFIG,
  renderWatermarkOnCanvas,
  loadImage,
  canvasToBlob,
  downloadCanvasAsJpeg,
  downloadZipArchive,
  ensureFontLoaded,
} from "@/lib/watermarkEngine";
import {
  SigilItem,
  DEFAULT_SIGILS,
  loadCustomSigils,
  saveCustomSigil,
  removeCustomSigil,
} from "@/lib/sigilVault";

interface PhotoItem {
  id: string;
  file?: File;
  name: string;
  originalUrl: string;
  width: number;
  height: number;
  processedUrl?: string;
  processedBlob?: Blob;
  status: "idle" | "processing" | "done" | "error";
  error?: string;
}

const COLOR_PRESETS = [
  { label: "Obsidian", color: "#000000" },
  { label: "Deep Slate", color: "#0A0D14" },
  { label: "Dark Forest", color: "#051A10" },
  { label: "Midnight Indigo", color: "#0A0E24" },
  { label: "Void Crimson", color: "#1D080C" },
];

const PRESET_OPTIONS: SelectOption[] = [
  { value: "balanced", label: "Balanced Standard (Recommended)" },
  { value: "dramatic", label: "Dramatic Obsidian (Heavy Fade)" },
  { value: "subtle", label: "Subtle Ambient (Light Fade)" },
  { value: "tournament", label: "Tournament Focus (Large Titles)" },
];

export function WatermarkForgeClient() {
  // --- State ---
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [config, setConfig] = useState<WatermarkConfig>({
    ...DEFAULT_WATERMARK_CONFIG,
    date: new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(new Date()),
  });

  const [sigils, setSigils] = useState<SigilItem[]>(DEFAULT_SIGILS);
  const [selectedSigilId, setSelectedSigilId] = useState<string>("default-crest");
  const [activePreset, setActivePreset] = useState<string>("balanced");

  const [isProcessingAll, setIsProcessingAll] = useState<boolean>(false);
  const [progress, setProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [showOriginalPreview, setShowOriginalPreview] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  // Refs
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const sigilInputRef = useRef<HTMLInputElement | null>(null);
  const livePreviewTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load custom sigils from localStorage on mount
  useEffect(() => {
    const custom = loadCustomSigils();
    if (custom.length > 0) {
      setSigils([...custom, ...DEFAULT_SIGILS]);
    }
    ensureFontLoaded();
  }, []);

  const selectedPhoto = photos[selectedIndex] || null;
  const selectedSigil = useMemo(
    () => sigils.find((s) => s.id === selectedSigilId) || sigils[0] || null,
    [sigils, selectedSigilId]
  );

  // --- Live Preview Re-render ---
  const updateLivePreview = useCallback(async () => {
    if (!selectedPhoto || !previewCanvasRef.current) return;
    try {
      const sourceImg = await loadImage(selectedPhoto.originalUrl);
      const sigilImg = selectedSigil ? await loadImage(selectedSigil.src) : null;

      await renderWatermarkOnCanvas(
        sourceImg,
        sigilImg,
        config,
        previewCanvasRef.current
      );
    } catch (err) {
      console.error("Failed to render preview canvas:", err);
    }
  }, [selectedPhoto, selectedSigil, config]);

  // Debounced preview update on config or selection change
  useEffect(() => {
    if (livePreviewTimeoutRef.current) clearTimeout(livePreviewTimeoutRef.current);
    livePreviewTimeoutRef.current = setTimeout(() => {
      updateLivePreview();
    }, 40);

    return () => {
      if (livePreviewTimeoutRef.current) clearTimeout(livePreviewTimeoutRef.current);
    };
  }, [updateLivePreview]);

  // --- Photo Upload Handling ---
  const handleFiles = async (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (validFiles.length === 0) {
      toast.error("Please select valid image files (JPG, PNG, WEBP, etc.)");
      return;
    }

    const toastId = toast.loading(`Summoning ${validFiles.length} artifact photos...`);

    const newItems: PhotoItem[] = [];

    for (const file of validFiles) {
      const url = URL.createObjectURL(file);
      try {
        const img = await loadImage(url);
        newItems.push({
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          file,
          name: file.name,
          originalUrl: url,
          width: img.naturalWidth || img.width,
          height: img.naturalHeight || img.height,
          status: "idle",
        });
      } catch (err) {
        console.error("Failed to load image metadata for", file.name, err);
        URL.revokeObjectURL(url);
      }
    }

    if (newItems.length > 0) {
      setPhotos((prev) => {
        const next = [...prev, ...newItems];
        return next;
      });
      toast.success(`Successfully forged ${newItems.length} photos into the anvil!`, {
        id: toastId,
      });
    } else {
      toast.error("Could not read uploaded photos.", { id: toastId });
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Load sample demo image for instant testing
  const loadSamplePhoto = async () => {
    try {
      const toastId = toast.loading("Summoning official sample chronicle...");
      const sampleUrl = "/mec-club-photo.jpg";
      const img = await loadImage(sampleUrl);
      const sampleItem: PhotoItem = {
        id: `sample-${Date.now()}`,
        name: "MEC_Club_Gathering_Sample.jpg",
        originalUrl: sampleUrl,
        width: img.naturalWidth || 1200,
        height: img.naturalHeight || 800,
        status: "idle",
      };
      setPhotos((prev) => [sampleItem, ...prev]);
      setSelectedIndex(0);
      toast.success("Sample chronicle placed on the anvil!", { id: toastId });
    } catch (err) {
      toast.error("Failed to load sample chronicle.");
    }
  };

  const removePhoto = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPhotos((prev) => {
      const itemToRemove = prev.find((p) => p.id === id);
      if (itemToRemove && itemToRemove.originalUrl.startsWith("blob:")) {
        URL.revokeObjectURL(itemToRemove.originalUrl);
      }
      if (itemToRemove && itemToRemove.processedUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(itemToRemove.processedUrl);
      }
      const next = prev.filter((p) => p.id !== id);
      if (selectedIndex >= next.length) {
        setSelectedIndex(Math.max(0, next.length - 1));
      }
      return next;
    });
  };

  const clearAllPhotos = () => {
    photos.forEach((p) => {
      if (p.originalUrl.startsWith("blob:")) URL.revokeObjectURL(p.originalUrl);
      if (p.processedUrl?.startsWith("blob:")) URL.revokeObjectURL(p.processedUrl);
    });
    setPhotos([]);
    setSelectedIndex(0);
    toast.success("Anvil cleared of all artifacts.");
  };

  // --- Custom Sigil Upload ---
  const handleCustomSigilUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Emblem must be a valid image file (PNG with transparency recommended)");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      const cleanName = file.name.replace(/\.[^/.]+$/, "").substring(0, 18);
      const newSigil: SigilItem = {
        id: `custom-${Date.now()}`,
        name: cleanName || "Custom Sigil",
        subtitle: "Custom Forged Emblem",
        src: base64,
        isCustom: true,
      };

      const updated = saveCustomSigil(newSigil);
      setSigils([...updated, ...DEFAULT_SIGILS]);
      setSelectedSigilId(newSigil.id);
      toast.success(`Sigil "${newSigil.name}" enshrined into your vault!`);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleDeleteCustomSigil = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = removeCustomSigil(id);
    setSigils([...updated, ...DEFAULT_SIGILS]);
    if (selectedSigilId === id) {
      setSelectedSigilId("default-crest");
    }
    toast.success("Custom sigil released from vault.");
  };

  // --- Presets ---
  const handlePresetChange = (presetKey: string) => {
    setActivePreset(presetKey);
    switch (presetKey) {
      case "dramatic":
        setConfig((prev) => ({
          ...prev,
          gradientColor: "#000000",
          gradientDepth: 55,
          gradientOpacity: 95,
          fontSizeMultiplier: 1.05,
        }));
        break;
      case "subtle":
        setConfig((prev) => ({
          ...prev,
          gradientColor: "#0A0D14",
          gradientDepth: 32,
          gradientOpacity: 72,
          fontSizeMultiplier: 0.92,
        }));
        break;
      case "tournament":
        setConfig((prev) => ({
          ...prev,
          gradientColor: "#000000",
          gradientDepth: 45,
          gradientOpacity: 90,
          fontSizeMultiplier: 1.25,
        }));
        break;
      case "balanced":
      default:
        setConfig((prev) => ({
          ...prev,
          gradientColor: "#000000",
          gradientDepth: 42,
          gradientOpacity: 88,
          fontSizeMultiplier: 1.0,
        }));
        break;
    }
  };

  // --- Single Photo Inscribe & Download ---
  const inscribeAndDownloadSingle = async (photo: PhotoItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const toastId = toast.loading(`Inscribing ${photo.name}...`);
    try {
      const sourceImg = await loadImage(photo.originalUrl);
      const sigilImg = selectedSigil ? await loadImage(selectedSigil.src) : null;
      const canvas = await renderWatermarkOnCanvas(sourceImg, sigilImg, config);
      const cleanTitle = (config.eventName || "Photo")
        .trim()
        .replace(/[^a-zA-Z0-9_-]/g, "_")
        .replace(/_+/g, "_")
        .substring(0, 30) || "Photo";
      const cleanBase = photo.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_");
      await downloadCanvasAsJpeg(canvas, `MEC_${cleanTitle}_${cleanBase}.jpg`);
      toast.success(`Artifact inscribed and saved!`, { id: toastId });
    } catch (err) {
      console.error("Single export failed:", err);
      toast.error("Failed to inscribe artifact.", { id: toastId });
    }
  };

  // --- Batch Apply to All Photos ---
  const applyWatermarkToAll = async (): Promise<PhotoItem[]> => {
    if (photos.length === 0) {
      toast.error("No artifact photos in the anvil to inscribe!");
      return [];
    }

    setIsProcessingAll(true);
    setProgress({ current: 0, total: photos.length });

    const toastId = toast.loading(`Imbuing sigils onto ${photos.length} photos...`);
    const sigilImg = selectedSigil ? await loadImage(selectedSigil.src) : null;

    const updatedPhotos: PhotoItem[] = [];

    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      setProgress({ current: i + 1, total: photos.length });

      try {
        const sourceImg = await loadImage(photo.originalUrl);
        const canvas = await renderWatermarkOnCanvas(sourceImg, sigilImg, config);
        const blob = await canvasToBlob(canvas, "image/jpeg", 0.93);
        const processedUrl = URL.createObjectURL(blob);

        updatedPhotos.push({
          ...photo,
          processedBlob: blob,
          processedUrl,
          status: "done",
        });
      } catch (err: any) {
        console.error(`Error processing photo ${photo.name}:`, err);
        updatedPhotos.push({
          ...photo,
          status: "error",
          error: err.message || "Failed to inscribe",
        });
      }

      // Allow UI tick
      await new Promise((r) => setTimeout(r, 10));
    }

    setPhotos(updatedPhotos);
    setIsProcessingAll(false);
    toast.success(`All ${photos.length} chronicles inscribed successfully!`, {
      id: toastId,
    });
    return updatedPhotos;
  };

  // --- Batch Export (ZIP Archive) ---
  const handleBatchExportZip = async () => {
    if (photos.length === 0) {
      toast.error("Deposit photos before attempting archive extraction!");
      return;
    }

    setIsExporting(true);
    const toastId = toast.loading("Preparing chronicle archive...");

    try {
      // Ensure all photos have been rendered with current config
      let currentItems = photos;
      const needsRender = photos.some((p) => p.status !== "done" || !p.processedBlob);
      if (needsRender) {
        currentItems = await applyWatermarkToAll();
      }

      const zip = new JSZip();
      const folderName = `MEC_${(config.eventName || "Chronicles").replace(/[^a-zA-Z0-9_-]/g, "_")}`;
      const zipFolder = zip.folder(folderName) || zip;

      currentItems.forEach((photo, idx) => {
        if (photo.processedBlob) {
          const indexPrefix = String(idx + 1).padStart(2, "0");
          const safeName = photo.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_");
          zipFolder.file(`${indexPrefix}_${safeName}_sigil.jpg`, photo.processedBlob);
        }
      });

      toast.loading("Compressing chronicle archive...", { id: toastId });

      const cleanEventName = (config.eventName || "Event")
        .trim()
        .replace(/[^a-zA-Z0-9_-]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_|_$/g, "") || "Chronicles";
      const zipFilename = `MEC_${cleanEventName}_${new Date().toISOString().slice(0, 10)}.zip`;

      await downloadZipArchive(zip, zipFilename);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#84CC16", "#10B981", "#38BDF8", "#F59E0B"],
      });

      toast.success("Chronicle archive exported successfully!", { id: toastId });
    } catch (err) {
      console.error("Batch archive export failed:", err);
      toast.error("Failed to build ZIP archive.", { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-surface-primary text-text-primary pb-24 overflow-x-hidden">
      {/* ===== HERO / RUNE BANNER ===== */}
      <section className="relative pt-8 pb-8 border-b border-border-default overflow-hidden bg-surface-secondary/40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--accent-primary-light)_0%,transparent_60%)] opacity-30 pointer-events-none" />
        <div className="container relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent-primary/40 bg-accent-primary/10 text-xs font-mono font-semibold text-accent-text-on-surface">
              <Sparkles className="w-3.5 h-3.5 text-accent-primary" />
              <span>ARCANE UTILITY // SIGIL FORGE</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-text-tertiary">
              <span className="inline-block w-2 h-2 rounded-full bg-accent-success animate-pulse" />
              <span>CLIENT-SIDE CANVAS ENGINE • 100% PRIVATE</span>
            </div>
          </div>

          <div className="max-w-3xl">
            <h1 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-text-primary mb-3">
              The Sigil Forge
            </h1>
            <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
              Imbue your event chronicles with the official emblem, typography, and metadata of{" "}
              <strong className="text-text-primary">MEC Computer Club</strong> in batch. Clean, high-resolution
              watermarks rendered locally right inside your browser.
            </p>
          </div>
        </div>
      </section>

      {/* ===== MAIN WORKSPACE ===== */}
      <div className="container mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ============================================================
              LEFT / TOP COLUMN: Controls & Metadata Inscription (5 cols)
              ============================================================ */}
          <div className="lg:col-span-5 space-y-6">
            {/* 1. Event Chronicle Parameters */}
            <div className="p-5 sm:p-6 bg-surface-elevated rounded-xl border border-border-default shadow-[4px_4px_0px_var(--accent-primary)]">
              <div className="flex items-center justify-between mb-4 border-b border-border-default pb-3">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4 text-accent-primary" />
                  <h2 className="font-heading font-bold text-base text-text-primary">
                    1. Chronicle Inscription
                  </h2>
                </div>
                <span className="text-[11px] font-mono uppercase text-text-tertiary">Batch Metadata</span>
              </div>

              <div className="space-y-4">
                {/* Event Name */}
                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-text-secondary mb-1.5">
                    Event / Quest Name <span className="text-accent-error">*</span>
                  </label>
                  <input
                    type="text"
                    value={config.eventName}
                    onChange={(e) => setConfig({ ...config, eventName: e.target.value })}
                    placeholder="e.g. MEC Intra Programming Contest 2026"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border-default bg-surface-primary text-text-primary text-sm font-medium focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all"
                  />
                  {/* Quick Preset Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {[
                      "MEC Intra Contest",
                      "ICPC Camp 2026",
                      "WebDev Sprint",
                      "CyberSec CTF",
                    ].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setConfig({ ...config, eventName: tag })}
                        className="text-[11px] px-2 py-0.5 rounded bg-surface-secondary hover:bg-accent-primary-light hover:text-text-primary border border-border-default text-text-tertiary transition-all"
                      >
                        +{tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date & Guild Name in 2 columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono font-semibold uppercase text-text-secondary mb-1.5">
                      Inscription Date
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={config.date}
                        onChange={(e) => setConfig({ ...config, date: e.target.value })}
                        placeholder="e.g. September 2026"
                        className="w-full px-3 py-2 rounded-lg border border-border-default bg-surface-primary text-text-primary text-sm font-medium focus:outline-none focus:border-accent-primary transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold uppercase text-text-secondary mb-1.5">
                      Guild / Club Name
                    </label>
                    <input
                      type="text"
                      value={config.clubName}
                      onChange={(e) => setConfig({ ...config, clubName: e.target.value })}
                      placeholder="MEC Computer Club"
                      className="w-full px-3 py-2 rounded-lg border border-border-default bg-surface-primary text-text-primary text-sm font-medium focus:outline-none focus:border-accent-primary transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Sigil Vault (Monogram Selection & Custom Upload) */}
            <div className="p-5 sm:p-6 bg-surface-elevated rounded-xl border border-border-default shadow-[4px_4px_0px_var(--accent-primary)]">
              <div className="flex items-center justify-between mb-4 border-b border-border-default pb-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-accent-primary" />
                  <h2 className="font-heading font-bold text-base text-text-primary">
                    2. Sigil & Monogram Vault
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => sigilInputRef.current?.click()}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-accent-primary hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Upload Emblem</span>
                </button>
                <input
                  ref={sigilInputRef}
                  type="file"
                  accept="image/png,image/svg+xml,image/jpeg,image/webp"
                  onChange={handleCustomSigilUpload}
                  className="hidden"
                />
              </div>

              {/* Sigil Grid Selector */}
              <div className="grid grid-cols-4 sm:grid-cols-4 gap-2.5">
                {sigils.map((sigil) => {
                  const isSelected = selectedSigilId === sigil.id;
                  return (
                    <div
                      key={sigil.id}
                      onClick={() => setSelectedSigilId(sigil.id)}
                      className={`group relative flex flex-col items-center p-2 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? "border-accent-primary bg-accent-primary/10 shadow-sm"
                          : "border-border-default bg-surface-primary hover:border-text-primary/40"
                      }`}
                    >
                      <div className="relative w-11 h-11 rounded-full bg-surface-elevated p-1 flex items-center justify-center border border-border-default shadow-xs overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={sigil.src}
                          alt={sigil.name}
                          className="w-full h-full object-contain"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-accent-primary/30 flex items-center justify-center">
                            <Check className="w-4 h-4 text-text-primary stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] font-medium text-text-secondary text-center mt-1.5 truncate max-w-full">
                        {sigil.name}
                      </span>

                      {/* Custom delete button */}
                      {sigil.isCustom && (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteCustomSigil(sigil.id, e)}
                          title="Remove custom sigil"
                          className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-accent-error text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Monogram settings */}
              <div className="mt-4 pt-3 border-t border-border-default flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none text-text-secondary">
                  <input
                    type="checkbox"
                    checked={config.showMonogram}
                    onChange={(e) => setConfig({ ...config, showMonogram: e.target.checked })}
                    className="accent-accent-primary w-4 h-4 rounded"
                  />
                  <span>Show Top-Right Circular Seal</span>
                </label>

                {config.showMonogram && (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-text-tertiary">Scale:</span>
                    <input
                      type="range"
                      min="0.7"
                      max="1.4"
                      step="0.05"
                      value={config.monogramSizeMultiplier}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          monogramSizeMultiplier: parseFloat(e.target.value),
                        })
                      }
                      className="w-20 accent-accent-primary cursor-pointer"
                    />
                    <span className="text-[11px] font-mono text-text-secondary w-7 text-right">
                      {Math.round(config.monogramSizeMultiplier * 100)}%
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Style Forge & Gradient Controls */}
            <div className="p-5 sm:p-6 bg-surface-elevated rounded-xl border border-border-default shadow-[4px_4px_0px_var(--accent-primary)]">
              <div className="flex items-center justify-between mb-4 border-b border-border-default pb-3">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-accent-primary" />
                  <h2 className="font-heading font-bold text-base text-text-primary">
                    3. Style & Overlay Calibration
                  </h2>
                </div>
                <span className="text-[11px] font-mono text-text-tertiary">Space Grotesk</span>
              </div>

              <div className="space-y-4">
                {/* Preset Dropdown using custom Select */}
                <div>
                  <label className="block text-xs font-mono font-semibold uppercase text-text-secondary mb-1.5">
                    Overlay Preset
                  </label>
                  <Select
                    value={activePreset}
                    onChange={handlePresetChange}
                    options={PRESET_OPTIONS}
                  />
                </div>

                {/* Font Size Multiplier Slider */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-mono text-text-secondary uppercase">Typography Scale</span>
                    <span className="font-mono text-text-tertiary">
                      {Math.round(config.fontSizeMultiplier * 100)}% (Small ↔ Large)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.7"
                    max="1.5"
                    step="0.05"
                    value={config.fontSizeMultiplier}
                    onChange={(e) =>
                      setConfig({ ...config, fontSizeMultiplier: parseFloat(e.target.value) })
                    }
                    className="w-full accent-accent-primary cursor-pointer"
                  />
                </div>

                {/* Shadow / Gradient Color */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-mono text-text-secondary uppercase">Gradient Base Tint</span>
                    <span className="font-mono text-text-tertiary">{config.gradientColor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5 flex-1">
                      {COLOR_PRESETS.map((preset) => (
                        <button
                          key={preset.color}
                          type="button"
                          onClick={() => setConfig({ ...config, gradientColor: preset.color })}
                          style={{ backgroundColor: preset.color }}
                          title={preset.label}
                          className={`flex-1 h-7 rounded border transition-all ${
                            config.gradientColor.toLowerCase() === preset.color.toLowerCase()
                              ? "border-accent-primary ring-2 ring-accent-primary/40 scale-105"
                              : "border-border-default hover:scale-102"
                          }`}
                        />
                      ))}
                    </div>
                    {/* Native color picker */}
                    <input
                      type="color"
                      value={config.gradientColor}
                      onChange={(e) => setConfig({ ...config, gradientColor: e.target.value })}
                      className="w-8 h-7 p-0 border border-border-default rounded cursor-pointer bg-transparent"
                      title="Custom Color Picker"
                    />
                  </div>
                </div>

                {/* Gradient Depth & Intensity in 2 columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="font-mono text-text-secondary uppercase">Fade Reach</span>
                      <span className="font-mono text-text-tertiary">{config.gradientDepth}%</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="75"
                      step="1"
                      value={config.gradientDepth}
                      onChange={(e) =>
                        setConfig({ ...config, gradientDepth: parseInt(e.target.value, 10) })
                      }
                      className="w-full accent-accent-primary cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="font-mono text-text-secondary uppercase">Fade Intensity</span>
                      <span className="font-mono text-text-tertiary">{config.gradientOpacity}%</span>
                    </div>
                    <input
                      type="range"
                      min="40"
                      max="100"
                      step="1"
                      value={config.gradientOpacity}
                      onChange={(e) =>
                        setConfig({ ...config, gradientOpacity: parseInt(e.target.value, 10) })
                      }
                      className="w-full accent-accent-primary cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================
              RIGHT COLUMN: Live Preview Anvil & Batch Photo Grid (7 cols)
              ============================================================ */}
          <div className="lg:col-span-7 space-y-6">
            {/* Live Sample Preview Anvil */}
            <div className="bg-surface-elevated rounded-xl border border-border-default shadow-[4px_4px_0px_var(--accent-primary)] overflow-hidden">
              <div className="p-4 border-b border-border-default flex flex-wrap items-center justify-between gap-3 bg-surface-secondary/40">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-accent-primary" />
                  <span className="font-heading font-bold text-sm text-text-primary">
                    Live Forge Preview Anvil
                  </span>
                  {selectedPhoto && (
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface-primary border border-border-default text-text-secondary">
                      {selectedPhoto.width} × {selectedPhoto.height} px
                    </span>
                  )}
                </div>

                {selectedPhoto && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onMouseDown={() => setShowOriginalPreview(true)}
                      onMouseUp={() => setShowOriginalPreview(false)}
                      onTouchStart={() => setShowOriginalPreview(true)}
                      onTouchEnd={() => setShowOriginalPreview(false)}
                      className="text-xs px-2.5 py-1 rounded border border-border-default bg-surface-primary hover:bg-surface-secondary text-text-secondary font-medium transition-all"
                    >
                      {showOriginalPreview ? "Peeking Original..." : "Hold to Peek Original"}
                    </button>
                    <button
                      type="button"
                      onClick={() => inscribeAndDownloadSingle(selectedPhoto)}
                      className="text-xs px-2.5 py-1 rounded bg-accent-primary text-white font-bold hover:bg-accent-primary-hover transition-all flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>Export Photo</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Anvil Viewport */}
              <div className="relative min-h-[320px] sm:min-h-[380px] bg-black/90 flex items-center justify-center p-4 overflow-hidden">
                {photos.length === 0 ? (
                  <div className="text-center py-12 px-4 max-w-sm">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-surface-secondary/20 border border-border-default flex items-center justify-center text-text-tertiary">
                      <ImageIcon className="w-8 h-8 opacity-60" />
                    </div>
                    <h3 className="font-heading font-bold text-base text-white mb-1">
                      Anvil is Waiting for Artifacts
                    </h3>
                    <p className="text-xs text-text-tertiary mb-4">
                      Upload event photos below or summon the sample chronicle to inspect live watermarking.
                    </p>
                    <button
                      type="button"
                      onClick={loadSamplePhoto}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-primary text-text-inverse text-xs font-bold hover:bg-accent-primary-hover transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Summon Sample Chronicle</span>
                    </button>
                  </div>
                ) : (
                  <div className="relative max-w-full max-h-[500px] flex items-center justify-center">
                    {/* Live Watermarked Canvas */}
                    <canvas
                      ref={previewCanvasRef}
                      className={`max-w-full max-h-[480px] object-contain rounded shadow-lg transition-opacity duration-150 ${
                        showOriginalPreview ? "opacity-0 absolute" : "opacity-100"
                      }`}
                    />

                    {/* Original Photo Preview (Shown when Peeking) */}
                    {showOriginalPreview && selectedPhoto && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={selectedPhoto.originalUrl}
                        alt="Original"
                        className="max-w-full max-h-[480px] object-contain rounded shadow-lg"
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Status footer for preview */}
              {selectedPhoto && (
                <div className="p-2.5 px-4 bg-surface-secondary/60 border-t border-border-default flex items-center justify-between text-xs text-text-secondary">
                  <span className="truncate max-w-[280px]">
                    Previewing: <strong className="text-text-primary">{selectedPhoto.name}</strong>
                  </span>
                  <span className="font-mono text-[11px] text-accent-text-on-surface">
                    Style: Fade + Split • Space Grotesk
                  </span>
                </div>
              )}
            </div>

            {/* Multi-Photo Upload Dropzone & Batch Thumbnail Grid */}
            <div className="p-5 sm:p-6 bg-surface-elevated rounded-xl border border-border-default shadow-[4px_4px_0px_var(--accent-primary)]">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-border-default pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-accent-primary" />
                  <h2 className="font-heading font-bold text-base text-text-primary">
                    Artifact Queue ({photos.length})
                  </h2>
                </div>
                {photos.length > 0 && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={loadSamplePhoto}
                      className="text-xs text-accent-primary hover:underline font-medium"
                    >
                      + Add Sample
                    </button>
                    <span className="text-text-tertiary">•</span>
                    <button
                      type="button"
                      onClick={clearAllPhotos}
                      className="text-xs text-accent-error hover:underline font-medium"
                    >
                      Clear Queue
                    </button>
                  </div>
                )}
              </div>

              {/* Drag-and-Drop Area */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                  isDragOver
                    ? "border-accent-primary bg-accent-primary/10 scale-[0.99]"
                    : "border-border-default hover:border-accent-primary/60 bg-surface-primary/60 hover:bg-surface-primary"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files) handleFiles(e.target.files);
                    e.target.value = "";
                  }}
                  className="hidden"
                />
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-accent-primary/10 text-accent-primary flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="font-heading font-bold text-sm text-text-primary mb-0.5">
                  Deposit Chronicles or Click to Summon
                </h4>
                <p className="text-xs text-text-secondary">
                  Drag and drop multiple photos here (JPG, PNG, WEBP, HEIC supported)
                </p>
              </div>

              {/* Thumbnail Grid */}
              {photos.length > 0 && (
                <div className="mt-4 space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[340px] overflow-y-auto p-1 pr-1.5 custom-scrollbar">
                    {photos.map((photo, idx) => {
                      const isSelected = selectedIndex === idx;
                      return (
                        <div
                          key={photo.id}
                          onClick={() => setSelectedIndex(idx)}
                          className={`group relative rounded-lg border overflow-hidden cursor-pointer transition-all ${
                            isSelected
                              ? "border-accent-primary ring-2 ring-accent-primary/40 shadow-sm"
                              : "border-border-default hover:border-text-primary/40 bg-surface-primary"
                          }`}
                        >
                          {/* Image preview */}
                          <div className="relative aspect-[4/3] bg-black/40">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={photo.processedUrl || photo.originalUrl}
                              alt={photo.name}
                              className="w-full h-full object-cover"
                            />

                            {/* Status badge */}
                            <div className="absolute top-1 left-1">
                              {photo.status === "done" ? (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-accent-success text-white text-[9px] font-mono font-bold">
                                  ✓ Inscribed
                                </span>
                              ) : photo.status === "processing" ? (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-accent-warning text-white text-[9px] font-mono font-bold animate-pulse">
                                  Forging...
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-mono">
                                  #{idx + 1}
                                </span>
                              )}
                            </div>

                            {/* Quick Action Overlay on hover */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                              <button
                                type="button"
                                title="Download inscribed"
                                onClick={(e) => inscribeAndDownloadSingle(photo, e)}
                                className="w-7 h-7 rounded-full bg-accent-primary text-white flex items-center justify-center hover:scale-110 transition-transform"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                title="Remove photo"
                                onClick={(e) => removePhoto(photo.id, e)}
                                className="w-7 h-7 rounded-full bg-accent-error text-white flex items-center justify-center hover:scale-110 transition-transform"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* File info footer */}
                          <div className="p-1.5 bg-surface-elevated">
                            <p className="text-[11px] font-medium text-text-primary truncate">
                              {photo.name}
                            </p>
                            <p className="text-[10px] font-mono text-text-tertiary">
                              {photo.width} × {photo.height}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Progress bar during batch processing */}
                  {isProcessingAll && (
                    <div className="p-3 bg-surface-secondary rounded-lg border border-border-default space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-text-secondary">
                          Imbuing photos... ({progress.current}/{progress.total})
                        </span>
                        <span className="text-accent-primary font-bold">
                          {Math.round((progress.current / progress.total) * 100)}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-surface-primary rounded-full overflow-hidden border border-border-default">
                        <div
                          className="h-full bg-accent-primary transition-all duration-200"
                          style={{
                            width: `${(progress.current / progress.total) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Batch Action Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                      type="button"
                      disabled={isProcessingAll || photos.length === 0}
                      onClick={applyWatermarkToAll}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border-default bg-surface-secondary hover:bg-surface-secondary/80 text-text-primary text-sm font-bold transition-all disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 ${isProcessingAll ? "animate-spin" : ""}`} />
                      <span>Imbue All ({photos.length})</span>
                    </button>

                    <button
                      type="button"
                      disabled={isExporting || photos.length === 0}
                      onClick={handleBatchExportZip}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-accent-primary hover:bg-accent-primary-hover text-white text-sm font-bold shadow-[2px_2px_0px_#000] transition-all disabled:opacity-50"
                    >
                      <FolderArchive className="w-4 h-4" />
                      <span>{isExporting ? "Archiving..." : "Download Batch (ZIP)"}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ===== FOOTER INFO & CODEX STRIP ===== */}
        <div className="mt-12 p-6 rounded-xl border border-border-default bg-surface-secondary/40">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-text-secondary">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent-primary/10 text-accent-primary flex items-center justify-center shrink-0">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-text-primary mb-1">
                  Full Resolution Preservation
                </h4>
                <p>
                  Images are processed on client-side canvases retaining 100% of their original native pixel resolution and aspect ratios.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent-primary/10 text-accent-primary flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-text-primary mb-1">
                  100% Client-Side Privacy
                </h4>
                <p>
                  Your event photos never leave your device. All rendering and ZIP compression happen strictly within your browser.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent-primary/10 text-accent-primary flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-text-primary mb-1">
                  Official Club Typography
                </h4>
                <p>
                  Engineered with Space Grotesk metrics and dynamic responsive font scaling so text remains razor sharp on 4K cameras and mobile snapshots alike.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WatermarkForgeClient;
