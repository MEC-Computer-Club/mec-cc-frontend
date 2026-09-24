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
  Building,
  Type,
  FileCheck2,
  ExternalLink,
} from "lucide-react";
import { Select, SelectOption } from "@/components/ui/Select";
import {
  WatermarkConfig,
  FontCombination,
  DEFAULT_WATERMARK_CONFIG,
  renderWatermarkOnCanvas,
  loadImage,
  evictImageCache,
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

const FONT_STYLE_OPTIONS: SelectOption[] = [
  { value: "website", label: "Signature (General Sans + JetBrains Mono)" },
  { value: "space", label: "Space Brutalist (Space Grotesk + JetBrains Mono)" },
  { value: "clean", label: "Clean Modernist (General Sans Minimal)" },
];

export function WatermarkForgeClient() {
  // --- State ---
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [config, setConfig] = useState<WatermarkConfig>({
    ...DEFAULT_WATERMARK_CONFIG,
    bottomOffsetMultiplier: 0.5,
    date: new Intl.DateTimeFormat("en-US", { day: "numeric", month: "long", year: "numeric" }).format(new Date()),
  });

  const [sigils, setSigils] = useState<SigilItem[]>(DEFAULT_SIGILS);
  const [selectedSigilId, setSelectedSigilId] = useState<string>("mcc-sigil");
  const [selectedSigil2Id, setSelectedSigil2Id] = useState<string>("mec-seal");
  const [activeControlTab, setActiveControlTab] = useState<"event" | "sigil" | "style">("event");

  const [progress, setProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [showOriginalPreview, setShowOriginalPreview] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  // Refs
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const sigilInputRef = useRef<HTMLInputElement | null>(null);
  const sigil2InputRef = useRef<HTMLInputElement | null>(null);
  const livePreviewTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Always-current config ref — lets updateLivePreview read fresh config
  // without being listed as a useCallback dependency (avoids function
  // recreation on every keystroke / slider drag).
  const configRef = useRef<WatermarkConfig>(config);
  configRef.current = config;
  // Monotonically-incrementing generation counter. Each render attempt claims
  // a generation; if a newer render has started by the time an async step
  // completes, the stale render bails out immediately.
  const renderGenRef = useRef<number>(0);

  // Load custom sigils from localStorage on mount
  useEffect(() => {
    const custom = loadCustomSigils();
    const validCustom = custom.filter((s) => s.isCustom);
    setSigils([...validCustom, ...DEFAULT_SIGILS]);
    setSelectedSigilId("mcc-sigil");
    setSelectedSigil2Id("mec-seal");
    ensureFontLoaded();
  }, []);

  const selectedPhoto = photos[selectedIndex] || null;
  const selectedSigil = useMemo(
    () => sigils.find((s) => s.id === selectedSigilId) || sigils[0] || null,
    [sigils, selectedSigilId]
  );
  const selectedSigil2 = useMemo(
    () =>
      sigils.find((s) => s.id === selectedSigil2Id) ||
      sigils.find((s) => s.id === "mec-seal") ||
      sigils[1] ||
      sigils[0] ||
      null,
    [sigils, selectedSigil2Id]
  );

  // Compute contextual config for logo tinting:
  // - MEC Emblem: Always original colors (never tinted white/black)
  // - MCC Emblem: Monochrome only (default white; fallback if original was set)
  // - Custom uploads: User choice of Original / White / Black
  const getEffectiveConfig = useCallback(
    (baseConfig: WatermarkConfig, s1: SigilItem | null, s2: SigilItem | null): WatermarkConfig => ({
      ...baseConfig,
      monogramColor:
        s1?.id === "mec-seal"
          ? "original"
          : s1?.id === "mcc-sigil" && baseConfig.monogramColor === "original"
          ? "#FFFFFF"
          : baseConfig.monogramColor,
      secondLogoColor:
        s2?.id === "mec-seal"
          ? "original"
          : s2?.id === "mcc-sigil" && (!baseConfig.secondLogoColor || baseConfig.secondLogoColor === "original")
          ? "#FFFFFF"
          : baseConfig.secondLogoColor || "original",
    }),
    []
  );

  // --- Live Preview Re-render ---
  // updateLivePreview intentionally omits `config` from its dependency array.
  // Instead it reads the always-current `configRef.current` value. This keeps
  // the function reference stable across config changes so the debounce effect
  // below can list `config` directly — giving us the correct trigger behaviour
  // while avoiding the thundering-herd of function recreations that caused
  // the original sluggishness.
  const updateLivePreview = useCallback(async () => {
    if (!selectedPhoto || !previewCanvasRef.current) return;
    // Claim a render generation. If another render starts before we finish
    // an async step, ours is stale and we return early.
    const gen = ++renderGenRef.current;
    try {
      // loadImage is now cached — repeat calls are ~0ms.
      const sourceImg = await loadImage(selectedPhoto.originalUrl);
      if (gen !== renderGenRef.current) return; // stale, newer render queued

      const sigilImg = selectedSigil ? await loadImage(selectedSigil.src) : null;
      if (gen !== renderGenRef.current) return; // stale

      const sigil2Img =
        configRef.current.showSecondLogo && selectedSigil2
          ? await loadImage(selectedSigil2.src)
          : null;
      if (gen !== renderGenRef.current) return; // stale

      const effectiveConfig = getEffectiveConfig(
        configRef.current,
        selectedSigil,
        selectedSigil2
      );

      await renderWatermarkOnCanvas(
        sourceImg,
        sigilImg,
        effectiveConfig, // always latest config with contextual color guards
        previewCanvasRef.current,
        sigil2Img
      );
    } catch (err) {
      console.error("Failed to render preview canvas:", err);
    }
  }, [selectedPhoto, selectedSigil, selectedSigil2, getEffectiveConfig]); // config intentionally excluded

  // Debounced preview update.
  // Watches config, selectedPhoto, selectedSigil, and selectedSigil2 directly
  // so any change triggers a re-render. 180ms gives fast typists a comfortable
  // window before the canvas updates.
  useEffect(() => {
    if (livePreviewTimeoutRef.current) clearTimeout(livePreviewTimeoutRef.current);
    livePreviewTimeoutRef.current = setTimeout(updateLivePreview, 180);
    return () => {
      if (livePreviewTimeoutRef.current) clearTimeout(livePreviewTimeoutRef.current);
    };
  }, [config, selectedPhoto, selectedSigil, selectedSigil2, updateLivePreview]);

  // --- Photo Upload Handling ---
  const handleFiles = async (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (validFiles.length === 0) {
      toast.error("Please select valid image files (JPG, PNG, WEBP, etc.)");
      return;
    }

    const toastId = toast.loading(`Uploading ${validFiles.length} photos...`);

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
      toast.success(`Added ${newItems.length} photos to queue!`, {
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
      const toastId = toast.loading("Loading sample photo...");
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
      toast.success("Sample photo loaded!", { id: toastId });
    } catch (err) {
      toast.error("Failed to load sample photo.");
    }
  };

  const removePhoto = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPhotos((prev) => {
      const itemToRemove = prev.find((p) => p.id === id);
      if (itemToRemove && itemToRemove.originalUrl.startsWith("blob:")) {
        evictImageCache(itemToRemove.originalUrl); // remove from decode cache
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
      if (p.originalUrl.startsWith("blob:")) {
        evictImageCache(p.originalUrl);
        URL.revokeObjectURL(p.originalUrl);
      }
      if (p.processedUrl?.startsWith("blob:")) URL.revokeObjectURL(p.processedUrl);
    });
    setPhotos([]);
    setSelectedIndex(0);
    toast.success("All photos cleared.");
  };

  // --- Custom Sigil Upload ---
  const handleCustomSigilUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Logo must be a valid image file (PNG or SVG with transparency recommended)");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      const cleanName = file.name.replace(/\.[^/.]+$/, "").substring(0, 18);
      const newSigil: SigilItem = {
        id: `custom-${Date.now()}`,
        name: cleanName || "Custom Logo",
        subtitle: "",
        src: base64,
        isCustom: true,
      };

      const updated = saveCustomSigil(newSigil);
      setSigils([...updated, ...DEFAULT_SIGILS]);
      setSelectedSigilId(newSigil.id);
      // Automatically display uploaded logo in its authentic full colors by default!
      setConfig((prev) => ({
        ...prev,
        showMonogram: true,
        monogramColor: "original",
      }));
      toast.success(`Logo "${newSigil.name}" added in original colors!`);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleCustomSigil2Upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Logo must be a valid image file (PNG or SVG with transparency recommended)");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      const cleanName = file.name.replace(/\.[^/.]+$/, "").substring(0, 18);
      const newSigil: SigilItem = {
        id: `custom-${Date.now()}`,
        name: cleanName || "Secondary Logo",
        subtitle: "",
        src: base64,
        isCustom: true,
      };

      const updated = saveCustomSigil(newSigil);
      setSigils([...updated, ...DEFAULT_SIGILS]);
      setSelectedSigil2Id(newSigil.id);
      setConfig((prev) => ({
        ...prev,
        showSecondLogo: true,
        secondLogoColor: "original",
      }));
      toast.success(`Secondary Logo "${newSigil.name}" added!`);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleDeleteCustomSigil = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = removeCustomSigil(id);
    const validCustom = updated.filter((s) => s.isCustom);
    setSigils([...validCustom, ...DEFAULT_SIGILS]);
    if (selectedSigilId === id) {
      setSelectedSigilId("mcc-sigil");
      setConfig((prev) => ({ ...prev, monogramColor: "#FFFFFF" }));
    }
    if (selectedSigil2Id === id) {
      setSelectedSigil2Id("mec-seal");
      setConfig((prev) => ({ ...prev, secondLogoColor: "original" }));
    }
    toast.success("Custom logo removed.");
  };



  // --- Single Photo Inscribe & Download ---
  const inscribeAndDownloadSingle = async (photo: PhotoItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const toastId = toast.loading(`Watermarking ${photo.name}...`);
    try {
      const sourceImg = await loadImage(photo.originalUrl);
      const sigilImg = selectedSigil ? await loadImage(selectedSigil.src) : null;
      const sigil2Img =
        config.showSecondLogo && selectedSigil2 ? await loadImage(selectedSigil2.src) : null;
      const effectiveConfig = getEffectiveConfig(config, selectedSigil, selectedSigil2);
      const canvas = await renderWatermarkOnCanvas(
        sourceImg,
        sigilImg,
        effectiveConfig,
        undefined,
        sigil2Img
      );
      const cleanTitle = (config.eventName || "Photo")
        .trim()
        .replace(/[^a-zA-Z0-9_-]/g, "_")
        .replace(/_+/g, "_")
        .substring(0, 30) || "Photo";
      const cleanBase = photo.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_");
      await downloadCanvasAsJpeg(canvas, `MEC_${cleanTitle}_${cleanBase}.jpg`);
      toast.success(`Photo downloaded successfully!`, { id: toastId });
    } catch (err) {
      console.error("Single export failed:", err);
      toast.error("Failed to export photo.", { id: toastId });
    }
  };

  // --- Streamlined Batch Export (Direct Single-Click ZIP Archive) ---
  const handleBatchExportZip = async () => {
    if (photos.length === 0) {
      toast.error("Upload photos before downloading ZIP archive!");
      return;
    }

    setIsExporting(true);
    setProgress({ current: 0, total: photos.length });
    const toastId = toast.loading(`Preparing batch archive for ${photos.length} photos...`);

    try {
      const sigilImg = selectedSigil ? await loadImage(selectedSigil.src) : null;
      const sigil2Img =
        config.showSecondLogo && selectedSigil2 ? await loadImage(selectedSigil2.src) : null;
      const zip = new JSZip();
      const cleanEventName = (config.eventName || "Event")
        .trim()
        .replace(/[^a-zA-Z0-9_-]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_|_$/g, "") || "Watermarked";
      const folderName = `MEC_${cleanEventName}`;
      const zipFolder = zip.folder(folderName) || zip;

      // Reusable offscreen canvas across iterations to prevent memory leaks/bloat
      const reuseCanvas = document.createElement("canvas");

      const effectiveConfig = getEffectiveConfig(config, selectedSigil, selectedSigil2);

      for (let i = 0; i < photos.length; i++) {
        const photo = photos[i];
        setProgress({ current: i + 1, total: photos.length });

        try {
          const sourceImg = await loadImage(photo.originalUrl);
          await renderWatermarkOnCanvas(sourceImg, sigilImg, effectiveConfig, reuseCanvas, sigil2Img);
          const blob = await canvasToBlob(reuseCanvas, "image/jpeg", 0.93);

          const indexPrefix = String(i + 1).padStart(2, "0");
          const safeName = photo.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_");
          zipFolder.file(`${indexPrefix}_${safeName}_watermarked.jpg`, blob);

          // Mark photo badge as done without clogging browser memory with 30-50 Blobs
          setPhotos((prev) => {
            const next = [...prev];
            if (next[i]) {
              next[i] = { ...next[i], status: "done" };
            }
            return next;
          });
        } catch (err) {
          console.error(`Error watermarking photo ${photo.name}:`, err);
        }

        // Allow UI tick to keep progress bar and spinner responsive
        await new Promise((r) => setTimeout(r, 10));
      }

      toast.loading("Compressing ZIP archive...", { id: toastId });

      const zipFilename = `MEC_${cleanEventName}_${new Date().toISOString().slice(0, 10)}.zip`;
      await downloadZipArchive(zip, zipFilename);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#D4F429", "#10B981", "#00E5FF", "#F59E0B"],
      });

      toast.success(`Exported all ${photos.length} photos in ZIP!`, { id: toastId });
    } catch (err) {
      console.error("Batch archive export failed:", err);
      toast.error("Failed to build ZIP archive.", { id: toastId });
    } finally {
      setIsExporting(false);
      setProgress({ current: 0, total: 0 });
    }
  };

  return (
    <div className="w-full min-h-screen bg-surface-primary text-text-primary pb-24 overflow-x-clip">
      {/* ===== HERO / RUNE BANNER ===== */}
      <section className="relative pt-4 pb-4 sm:pt-8 sm:pb-8 border-b border-border-default overflow-hidden bg-surface-secondary/40">
        <div className="container relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2 sm:mb-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-accent-primary/40 bg-accent-primary/10 text-xs font-mono font-semibold text-accent-text-on-surface">
              <Sparkles className="w-3.5 h-3.5 text-accent-primary" />
              <span>OFFICIAL TOOL // WATERMARK STUDIO</span>
            </div>
            <div className="hidden sm:flex items-center gap-3 text-xs font-mono text-text-tertiary">
              <span className="inline-block w-2 h-2 rounded-full bg-accent-success animate-pulse" />
              <span>CLIENT-SIDE CANVAS ENGINE • 100% PRIVATE</span>
            </div>
          </div>

          <div className="max-w-3xl">
            <h1 className="font-heading font-bold text-2xl sm:text-4xl lg:text-5xl tracking-tight text-text-primary mb-1.5 sm:mb-3">
              Event Watermark Studio
            </h1>
            <p className="text-xs sm:text-base text-text-secondary leading-relaxed line-clamp-2 sm:line-clamp-none">
              Add official <strong className="text-text-primary">MEC Computer Club</strong> branding, logos, and event details to your photos in batch. Fast, clean, high-resolution watermarks rendered locally in your browser.
            </p>
          </div>
        </div>
      </section>

      {/* ===== MAIN WORKSPACE ===== */}
      <div className="container mt-3 sm:mt-6 lg:mt-8">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-start pb-28 lg:pb-0">

          {/* ============================================================
              LEFT COLUMN: Controls & Metadata Inscription (5 cols on desktop, 3rd on mobile)
              ============================================================ */}
          <div className="contents lg:block lg:col-span-5 space-y-4">
            <div className="order-3 w-full space-y-4">
              {/* MASTER CUSTOMIZE STUDIO PANEL */}
              <div className="bg-surface-elevated rounded-xl border border-black shadow-[4px_4px_0px_var(--accent-primary)] overflow-hidden flex flex-col">
              
              {/* Studio Header Bar */}
              <div className="p-4 border-b border-border-default flex items-center justify-between bg-surface-secondary/40">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-accent-primary/15 border border-accent-primary/30 flex items-center justify-center text-accent-primary shadow-xs">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-heading font-bold text-sm sm:text-base text-text-primary tracking-tight">
                        Customize Overlay
                      </h2>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-accent-primary/15 text-accent-text-on-surface font-semibold border border-accent-primary/30">
                        STUDIO
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-primary dark:bg-white/[0.05] border border-border-default dark:border-white/10 text-text-secondary">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
                    <span>Real-time</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setConfig({
                        ...DEFAULT_WATERMARK_CONFIG,
                        date: new Intl.DateTimeFormat("en-US", { day: "numeric", month: "long", year: "numeric" }).format(new Date()),
                      });
                      toast.success("Settings reset to defaults");
                    }}
                    title="Reset all settings to default"
                    className="p-1.5 rounded-lg border border-border-default dark:border-white/10 bg-surface-primary dark:bg-white/[0.04] text-text-tertiary hover:text-text-primary hover:border-accent-primary transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Segmented Tab Switcher (Full Width Pill Bar) */}
              <div className="p-2 border-b border-border-default dark:border-white/10 bg-surface-primary/40 dark:bg-black/20">
                <div className="grid grid-cols-3 gap-1.5 bg-surface-secondary/70 dark:bg-[#07090e] p-1 rounded-xl border border-border-default/50 dark:border-white/5">
                  {/* Tab 1: Event Info */}
                  <button
                    type="button"
                    onClick={() => setActiveControlTab("event")}
                    className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs transition-all cursor-pointer select-none ${
                      activeControlTab === "event"
                        ? "bg-surface-elevated dark:bg-white/[0.12] text-text-primary shadow-sm border border-border-default dark:border-white/20 font-bold"
                        : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated/40 font-medium"
                    }`}
                  >
                    <Type className={`w-3.5 h-3.5 ${activeControlTab === "event" ? "text-accent-primary" : "text-text-tertiary"}`} />
                    <span>Event Info</span>
                    {config.eventName ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-primary shadow-[0_0_6px_var(--accent-primary)]" />
                    ) : null}
                  </button>

                  {/* Tab 2: Logo Vault */}
                  <button
                    type="button"
                    onClick={() => setActiveControlTab("sigil")}
                    className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs transition-all cursor-pointer select-none ${
                      activeControlTab === "sigil"
                        ? "bg-surface-elevated dark:bg-white/[0.12] text-text-primary shadow-sm border border-border-default dark:border-white/20 font-bold"
                        : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated/40 font-medium"
                    }`}
                  >
                    <Shield className={`w-3.5 h-3.5 ${activeControlTab === "sigil" ? "text-accent-primary" : "text-text-tertiary"}`} />
                    <span>Logo Vault</span>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full ${
                      config.showMonogram
                        ? "bg-accent-primary/20 text-accent-text-on-surface border border-accent-primary/30"
                        : "bg-surface-secondary text-text-tertiary"
                    }`}>
                      {config.showMonogram ? "ON" : "OFF"}
                    </span>
                  </button>

                  {/* Tab 3: Style & FX */}
                  <button
                    type="button"
                    onClick={() => setActiveControlTab("style")}
                    className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs transition-all cursor-pointer select-none ${
                      activeControlTab === "style"
                        ? "bg-surface-elevated dark:bg-white/[0.12] text-text-primary shadow-sm border border-border-default dark:border-white/20 font-bold"
                        : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated/40 font-medium"
                    }`}
                  >
                    <Sliders className={`w-3.5 h-3.5 ${activeControlTab === "style" ? "text-accent-primary" : "text-text-tertiary"}`} />
                    <span>Style & FX</span>
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-black/30 shadow-xs"
                      style={{ backgroundColor: config.gradientColor }}
                      title={`Tint: ${config.gradientColor}`}
                    />
                  </button>
                </div>
              </div>

              {/* Tab Contents Area with Consistent Padding & Animations */}
              <div className="p-4 sm:p-5">
                {/* ============================================================
                    TAB 1: EVENT INFO
                    ============================================================ */}
                {activeControlTab === "event" && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    {/* Event Title & Subtitle Card (Stacked Vertically) */}
                    <div className="bg-surface-primary dark:bg-[#0f121d] rounded-xl border border-border-default/80 dark:border-white/10 p-4 space-y-4 shadow-xs">
                      {/* Event Title (Top) */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold uppercase tracking-wider text-text-secondary">
                          Event Title
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={config.eventName}
                            onChange={(e) => setConfig({ ...config, eventName: e.target.value })}
                            placeholder="Enter Event Title"
                            className="w-full px-3.5 py-2.5 rounded-lg border border-border-default dark:border-white/15 bg-surface-elevated dark:bg-black/40 text-text-primary text-sm font-medium focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all pr-8"
                          />
                          {config.eventName && (
                            <button
                              type="button"
                              onClick={() => setConfig({ ...config, eventName: "" })}
                              title="Clear event title"
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sm text-text-tertiary hover:text-text-primary cursor-pointer px-1"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Subtitle (Directly at bottom of Title) */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold uppercase tracking-wider text-text-secondary">
                          Subtitle <span className="text-[10px] font-normal text-text-tertiary lowercase">(optional)</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={config.subtitle !== undefined ? config.subtitle : (config.clubName || "")}
                            onChange={(e) =>
                              setConfig({ ...config, subtitle: e.target.value, clubName: e.target.value })
                            }
                            placeholder="Enter subtitle (optional)"
                            className="w-full px-3.5 py-2.5 rounded-lg border border-border-default dark:border-white/15 bg-surface-elevated dark:bg-black/40 text-text-primary text-sm font-medium focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all pr-8"
                          />
                          {(config.subtitle || config.clubName) && (
                            <button
                              type="button"
                              onClick={() => setConfig({ ...config, subtitle: "", clubName: "" })}
                              title="Clear subtitle"
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sm text-text-tertiary hover:text-text-primary cursor-pointer px-1"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Inscription Date Card */}
                    <div className="bg-surface-primary dark:bg-[#0f121d] rounded-xl border border-border-default/80 dark:border-white/10 p-4 space-y-3 shadow-xs">
                      <div className="space-y-1.5">
                        <label className="text-xs font-mono font-bold uppercase tracking-wider text-text-secondary">
                          Date
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={config.date}
                            onChange={(e) => setConfig({ ...config, date: e.target.value })}
                            placeholder="e.g. September 18, 2026"
                            className="w-full px-3.5 py-2.5 rounded-lg border border-border-default dark:border-white/15 bg-surface-elevated dark:bg-black/40 text-text-primary text-sm font-medium focus:outline-none focus:border-accent-primary focus:ring-1 focus:ring-accent-primary transition-all pr-8"
                          />
                          {config.date && (
                            <button
                              type="button"
                              onClick={() => setConfig({ ...config, date: "" })}
                              title="Clear date"
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sm text-text-tertiary hover:text-text-primary cursor-pointer px-1"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Quick Date Presets */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-border-default/60 dark:border-white/5">
                        <span className="text-[10px] font-mono text-text-tertiary mr-0.5">Quick:</span>
                        <button
                          type="button"
                          onClick={() => {
                            const today = new Intl.DateTimeFormat("en-US", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }).format(new Date());
                            setConfig({ ...config, date: today });
                          }}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-secondary dark:bg-white/[0.04] border border-border-default/80 dark:border-white/10 text-text-secondary hover:text-text-primary hover:border-accent-primary transition-all cursor-pointer"
                        >
                          Today
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const d = new Date();
                            d.setDate(d.getDate() - 1);
                            const yest = new Intl.DateTimeFormat("en-US", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }).format(d);
                            setConfig({ ...config, date: yest });
                          }}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-secondary dark:bg-white/[0.04] border border-border-default/80 dark:border-white/10 text-text-secondary hover:text-text-primary hover:border-accent-primary transition-all cursor-pointer"
                        >
                          Yesterday
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const monthOnly = new Intl.DateTimeFormat("en-US", {
                              month: "long",
                              year: "numeric",
                            }).format(new Date());
                            setConfig({ ...config, date: monthOnly });
                          }}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-secondary dark:bg-white/[0.04] border border-border-default/80 dark:border-white/10 text-text-secondary hover:text-text-primary hover:border-accent-primary transition-all cursor-pointer"
                        >
                          Month & Year
                        </button>
                        {selectedPhoto?.file?.lastModified && (
                          <button
                            type="button"
                            onClick={() => {
                              const photoDate = new Date(selectedPhoto.file!.lastModified);
                              const formatted = new Intl.DateTimeFormat("en-US", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }).format(photoDate);
                              setConfig({ ...config, date: formatted });
                            }}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent-primary/10 border border-accent-primary/30 text-accent-text-on-surface hover:bg-accent-primary/20 transition-all font-bold cursor-pointer"
                          >
                            From Photo EXIF
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Step 1 Footer Action */}
                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-text-tertiary">
                        Step 1 of 3
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveControlTab("sigil")}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-surface-secondary dark:bg-white/[0.08] hover:bg-accent-primary hover:text-black border border-border-default dark:border-white/15 text-xs font-bold text-text-primary transition-all cursor-pointer"
                      >
                        <span>Next: Logo Vault</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* ============================================================
                    TAB 2: LOGO VAULT
                    ============================================================ */}
                {activeControlTab === "sigil" && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    {/* Primary Logo (Logo 1) Section */}
                    <div className="bg-surface-primary dark:bg-[#0f121d] rounded-xl border border-border-default/80 dark:border-white/10 p-4 space-y-3 shadow-xs">
                      <div className="flex items-center justify-between pb-1 border-b border-border-default/60 dark:border-white/10">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-accent-primary" />
                          <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-text-primary">
                            Primary Logo (Logo 1)
                          </h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => sigilInputRef.current?.click()}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-accent-primary hover:underline bg-accent-primary/10 border border-accent-primary/30 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Upload Custom</span>
                        </button>
                        <input
                          ref={sigilInputRef}
                          type="file"
                          accept="image/png,image/svg+xml,image/jpeg,image/webp"
                          onChange={handleCustomSigilUpload}
                          className="hidden"
                        />
                      </div>

                      {/* Sigil Grid Selector 1 */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {sigils.map((sigil) => {
                          const isSelected = selectedSigilId === sigil.id;
                          return (
                            <div
                              key={sigil.id}
                              onClick={() => {
                                setSelectedSigilId(sigil.id);
                                if (sigil.id === "mcc-sigil") {
                                  setConfig((prev) => ({ ...prev, monogramColor: "#FFFFFF" }));
                                } else {
                                  setConfig((prev) => ({ ...prev, monogramColor: "original" }));
                                }
                              }}
                              className={`group relative flex flex-col items-center p-2 rounded-xl border cursor-pointer transition-all ${
                                isSelected
                                  ? "border-accent-primary bg-accent-primary/10 shadow-sm ring-1 ring-accent-primary/50"
                                  : "border-border-default/80 dark:border-white/10 bg-surface-primary dark:bg-[#0e121e] hover:border-text-primary/40 hover:bg-surface-elevated"
                              }`}
                            >
                              <div
                                className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg p-1.5 flex items-center justify-center border border-border-default/80 dark:border-white/10 shadow-inner overflow-hidden transition-colors ${
                                  isSelected && config.monogramColor === "#000000" && sigil.id !== "mec-seal"
                                    ? "bg-neutral-800"
                                    : "bg-[#07090f]"
                                }`}
                              >
                                {sigil.id === "mec-seal" ? (
                                  <img
                                    src={sigil.src}
                                    alt={sigil.name}
                                    className="w-full h-full object-contain pointer-events-none"
                                  />
                                ) : sigil.id === "mcc-sigil" ? (
                                  <div
                                    className="w-full h-full transition-colors duration-200"
                                    style={{
                                      maskImage: `url(${sigil.src})`,
                                      WebkitMaskImage: `url(${sigil.src})`,
                                      maskSize: "contain",
                                      WebkitMaskSize: "contain",
                                      maskRepeat: "no-repeat",
                                      WebkitMaskRepeat: "no-repeat",
                                      maskPosition: "center",
                                      WebkitMaskPosition: "center",
                                      backgroundColor:
                                        isSelected && config.monogramColor === "#000000"
                                          ? "#000000"
                                          : "#FFFFFF",
                                    }}
                                  />
                                ) : isSelected && config.monogramColor !== "original" ? (
                                  <div
                                    className="w-full h-full transition-colors duration-200"
                                    style={{
                                      maskImage: `url(${sigil.src})`,
                                      WebkitMaskImage: `url(${sigil.src})`,
                                      maskSize: "contain",
                                      WebkitMaskSize: "contain",
                                      maskRepeat: "no-repeat",
                                      WebkitMaskRepeat: "no-repeat",
                                      maskPosition: "center",
                                      WebkitMaskPosition: "center",
                                      backgroundColor:
                                        config.monogramColor === "#000000" ? "#000000" : "#FFFFFF",
                                    }}
                                  />
                                ) : (
                                  <img
                                    src={sigil.src}
                                    alt={sigil.name}
                                    className="w-full h-full object-contain pointer-events-none"
                                  />
                                )}
                                {isSelected && (
                                  <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-accent-primary flex items-center justify-center shadow-xs">
                                    <Check className="w-2.5 h-2.5 text-[#05050f] stroke-[3]" />
                                  </div>
                                )}
                              </div>
                              <span className="text-[11px] font-semibold text-text-primary text-center mt-1.5 truncate max-w-full">
                                {sigil.name}
                              </span>

                              {/* Custom delete button */}
                              {sigil.isCustom && (
                                <button
                                  type="button"
                                  onClick={(e) => handleDeleteCustomSigil(sigil.id, e)}
                                  title="Remove custom sigil"
                                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-accent-error text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-xs cursor-pointer"
                                >
                                  ×
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Logo 1 Color Switcher */}
                      <div className="flex items-center justify-between pt-2.5 border-t border-border-default/60 dark:border-white/10">
                        <div className="flex items-center gap-1.5">
                          <Palette className="w-3.5 h-3.5 text-accent-primary" />
                          <span className="text-xs font-mono font-bold uppercase tracking-wider text-text-secondary">
                            Logo 1 Color
                          </span>
                        </div>
                        {selectedSigil?.id === "mec-seal" ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono bg-surface-secondary/80 dark:bg-black/40 text-text-secondary border border-border-default/80 dark:border-white/10 select-none">
                            <span className="w-2 h-2 rounded-full bg-gradient-to-tr from-rose-500 via-amber-400 to-cyan-400 border border-white/30 shrink-0" />
                            <span>Original Only</span>
                          </div>
                        ) : selectedSigil?.id === "mcc-sigil" ? (
                          <div className="inline-flex items-center bg-surface-secondary/80 dark:bg-black/50 p-0.5 rounded-lg border border-border-default/80 dark:border-white/10">
                            {[
                              { id: "#FFFFFF", label: "White", dot: "bg-white border-black/30" },
                              { id: "#000000", label: "Black", dot: "bg-black border-white/30" },
                            ].map((opt) => {
                              const isActive =
                                config.monogramColor.toUpperCase() === opt.id.toUpperCase() ||
                                (opt.id === "#FFFFFF" && config.monogramColor === "original");
                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() => setConfig({ ...config, monogramColor: opt.id })}
                                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono transition-all cursor-pointer ${
                                    isActive
                                      ? "bg-surface-elevated dark:bg-white/20 text-text-primary font-bold shadow-xs border border-border-default dark:border-white/20"
                                      : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated/40"
                                  }`}
                                  title={`Set Logo 1 to ${opt.label}`}
                                >
                                  <span className={`w-2 h-2 rounded-full border shrink-0 ${opt.dot}`} />
                                  <span>{opt.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="inline-flex items-center bg-surface-secondary/80 dark:bg-black/50 p-0.5 rounded-lg border border-border-default/80 dark:border-white/10">
                            {[
                              { id: "original", label: "Original", dot: "bg-gradient-to-tr from-rose-500 via-amber-400 to-cyan-400 border-white/30" },
                              { id: "#FFFFFF", label: "White", dot: "bg-white border-black/30" },
                              { id: "#000000", label: "Black", dot: "bg-black border-white/30" },
                            ].map((opt) => {
                              const isActive =
                                opt.id === "original"
                                  ? config.monogramColor === "original"
                                  : config.monogramColor.toUpperCase() === opt.id.toUpperCase();
                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() => setConfig({ ...config, monogramColor: opt.id })}
                                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono transition-all cursor-pointer ${
                                    isActive
                                      ? "bg-surface-elevated dark:bg-white/20 text-text-primary font-bold shadow-xs border border-border-default dark:border-white/20"
                                      : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated/40"
                                  }`}
                                  title={`Set Logo 1 to ${opt.label}`}
                                >
                                  <span className={`w-2 h-2 rounded-full border shrink-0 ${opt.dot}`} />
                                  <span>{opt.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Secondary Logo (Logo 2 - Optional) Card */}
                    <div className="bg-surface-primary dark:bg-[#0f121d] rounded-xl border border-border-default/80 dark:border-white/10 p-4 space-y-3 shadow-xs">
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer select-none text-text-primary font-semibold text-xs">
                          <input
                            type="checkbox"
                            checked={config.showSecondLogo}
                            onChange={(e) =>
                              setConfig((prev) => ({ ...prev, showSecondLogo: e.target.checked }))
                            }
                            className="accent-accent-primary w-4 h-4 rounded cursor-pointer"
                          />
                          <span>Enable 2nd Logo</span>
                        </label>
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                            config.showSecondLogo
                              ? "bg-accent-primary/20 text-accent-text-on-surface border border-accent-primary/30"
                              : "bg-surface-secondary text-text-tertiary"
                          }`}
                        >
                          {config.showSecondLogo ? "ENABLED" : "OFF"}
                        </span>
                      </div>

                      {config.showSecondLogo && (
                        <div className="pt-2 border-t border-border-default/60 dark:border-white/10 space-y-3 animate-in fade-in duration-150">
                          <div className="flex items-center justify-end">
                            <button
                              type="button"
                              onClick={() => sigil2InputRef.current?.click()}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent-primary hover:underline bg-accent-primary/10 border border-accent-primary/30 px-2 py-0.5 rounded transition-all cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Upload Logo 2</span>
                            </button>
                            <input
                              ref={sigil2InputRef}
                              type="file"
                              accept="image/png,image/svg+xml,image/jpeg,image/webp"
                              onChange={handleCustomSigil2Upload}
                              className="hidden"
                            />
                          </div>

                          {/* Sigil Grid Selector 2 */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                            {sigils.map((sigil) => {
                              const isSelected2 = selectedSigil2Id === sigil.id;
                              return (
                                <div
                                  key={`sigil2-${sigil.id}`}
                                  onClick={() => {
                                    setSelectedSigil2Id(sigil.id);
                                    if (sigil.id === "mcc-sigil") {
                                      setConfig((prev) => ({ ...prev, secondLogoColor: "#FFFFFF" }));
                                    } else {
                                      setConfig((prev) => ({ ...prev, secondLogoColor: "original" }));
                                    }
                                  }}
                                  className={`group relative flex flex-col items-center p-2 rounded-xl border cursor-pointer transition-all ${
                                    isSelected2
                                      ? "border-accent-primary bg-accent-primary/10 shadow-sm ring-1 ring-accent-primary/50"
                                      : "border-border-default/80 dark:border-white/10 bg-surface-primary dark:bg-[#0e121e] hover:border-text-primary/40 hover:bg-surface-elevated"
                                  }`}
                                >
                                  <div
                                    className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg p-1.5 flex items-center justify-center border border-border-default/80 dark:border-white/10 shadow-inner overflow-hidden transition-colors ${
                                      isSelected2 && config.secondLogoColor === "#000000" && sigil.id !== "mec-seal"
                                        ? "bg-neutral-800"
                                        : "bg-[#07090f]"
                                    }`}
                                  >
                                    {sigil.id === "mec-seal" ? (
                                      <img
                                        src={sigil.src}
                                        alt={sigil.name}
                                        className="w-full h-full object-contain pointer-events-none"
                                      />
                                    ) : sigil.id === "mcc-sigil" ? (
                                      <div
                                        className="w-full h-full transition-colors duration-200"
                                        style={{
                                          maskImage: `url(${sigil.src})`,
                                          WebkitMaskImage: `url(${sigil.src})`,
                                          maskSize: "contain",
                                          WebkitMaskSize: "contain",
                                          maskRepeat: "no-repeat",
                                          WebkitMaskRepeat: "no-repeat",
                                          maskPosition: "center",
                                          WebkitMaskPosition: "center",
                                          backgroundColor:
                                            isSelected2 && config.secondLogoColor === "#000000"
                                              ? "#000000"
                                              : "#FFFFFF",
                                        }}
                                      />
                                    ) : isSelected2 && config.secondLogoColor && config.secondLogoColor !== "original" ? (
                                      <div
                                        className="w-full h-full transition-colors duration-200"
                                        style={{
                                          maskImage: `url(${sigil.src})`,
                                          WebkitMaskImage: `url(${sigil.src})`,
                                          maskSize: "contain",
                                          WebkitMaskSize: "contain",
                                          maskRepeat: "no-repeat",
                                          WebkitMaskRepeat: "no-repeat",
                                          maskPosition: "center",
                                          WebkitMaskPosition: "center",
                                          backgroundColor:
                                            config.secondLogoColor === "#000000" ? "#000000" : "#FFFFFF",
                                        }}
                                      />
                                    ) : (
                                      <img
                                        src={sigil.src}
                                        alt={sigil.name}
                                        className="w-full h-full object-contain pointer-events-none"
                                      />
                                    )}
                                    {isSelected2 && (
                                      <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-accent-primary flex items-center justify-center shadow-xs">
                                        <Check className="w-2.5 h-2.5 text-[#05050f] stroke-[3]" />
                                      </div>
                                    )}
                                  </div>
                                  <span className="text-[11px] font-semibold text-text-primary text-center mt-1.5 truncate max-w-full">
                                    {sigil.name}
                                  </span>

                                  {/* Custom delete button */}
                                  {sigil.isCustom && (
                                    <button
                                      type="button"
                                      onClick={(e) => handleDeleteCustomSigil(sigil.id, e)}
                                      title="Remove custom sigil"
                                      className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-accent-error text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-xs cursor-pointer"
                                    >
                                      ×
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* Smartly Compact Contextual Color Switcher for Logo 2 */}
                          <div className="flex items-center justify-between pt-2.5 border-t border-border-default/60 dark:border-white/10">
                            <div className="flex items-center gap-1.5">
                              <Palette className="w-3.5 h-3.5 text-accent-primary" />
                              <span className="text-xs font-mono font-bold uppercase tracking-wider text-text-secondary">
                                Logo 2 Color
                              </span>
                            </div>
                            {selectedSigil2?.id === "mec-seal" ? (
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono bg-surface-secondary/80 dark:bg-black/40 text-text-secondary border border-border-default/80 dark:border-white/10 select-none">
                                <span className="w-2 h-2 rounded-full bg-gradient-to-tr from-rose-500 via-amber-400 to-cyan-400 border border-white/30 shrink-0" />
                                <span>Original Only</span>
                              </div>
                            ) : selectedSigil2?.id === "mcc-sigil" ? (
                              <div className="inline-flex items-center bg-surface-secondary/80 dark:bg-black/50 p-0.5 rounded-lg border border-border-default/80 dark:border-white/10">
                                {[
                                  { id: "#FFFFFF", label: "White", dot: "bg-white border-black/30" },
                                  { id: "#000000", label: "Black", dot: "bg-black border-white/30" },
                                ].map((opt) => {
                                  const isActive =
                                    (config.secondLogoColor || "").toUpperCase() === opt.id.toUpperCase() ||
                                    (opt.id === "#FFFFFF" && (!config.secondLogoColor || config.secondLogoColor === "original"));
                                  return (
                                    <button
                                      key={opt.id}
                                      type="button"
                                      onClick={() => setConfig({ ...config, secondLogoColor: opt.id })}
                                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono transition-all cursor-pointer ${
                                        isActive
                                          ? "bg-surface-elevated dark:bg-white/20 text-text-primary font-bold shadow-xs border border-border-default dark:border-white/20"
                                          : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated/40"
                                      }`}
                                      title={`Set Logo 2 to ${opt.label}`}
                                    >
                                      <span className={`w-2 h-2 rounded-full border shrink-0 ${opt.dot}`} />
                                      <span>{opt.label}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="inline-flex items-center bg-surface-secondary/80 dark:bg-black/50 p-0.5 rounded-lg border border-border-default/80 dark:border-white/10">
                                {[
                                  { id: "original", label: "Original", dot: "bg-gradient-to-tr from-rose-500 via-amber-400 to-cyan-400 border-white/30" },
                                  { id: "#FFFFFF", label: "White", dot: "bg-white border-black/30" },
                                  { id: "#000000", label: "Black", dot: "bg-black border-white/30" },
                                ].map((opt) => {
                                  const isActive =
                                    opt.id === "original"
                                      ? !config.secondLogoColor || config.secondLogoColor === "original"
                                      : (config.secondLogoColor || "").toUpperCase() === opt.id.toUpperCase();
                                  return (
                                    <button
                                      key={opt.id}
                                      type="button"
                                      onClick={() => setConfig({ ...config, secondLogoColor: opt.id })}
                                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono transition-all cursor-pointer ${
                                        isActive
                                          ? "bg-surface-elevated dark:bg-white/20 text-text-primary font-bold shadow-xs border border-border-default dark:border-white/20"
                                          : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated/40"
                                      }`}
                                      title={`Set Logo 2 to ${opt.label}`}
                                    >
                                      <span className={`w-2 h-2 rounded-full border shrink-0 ${opt.dot}`} />
                                      <span>{opt.label}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Logo Display & Size Card */}
                    <div className="bg-surface-primary dark:bg-[#0f121d] rounded-xl border border-border-default/80 dark:border-white/10 p-4 space-y-3.5 shadow-xs">
                      {/* Monogram Toggle Switch */}
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer select-none text-text-primary font-semibold text-xs">
                          <input
                            type="checkbox"
                            checked={config.showMonogram}
                            onChange={(e) => setConfig({ ...config, showMonogram: e.target.checked })}
                            className="accent-accent-primary w-4 h-4 rounded cursor-pointer"
                          />
                          <span>Display Primary Logo in Badge</span>
                        </label>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          config.showMonogram
                            ? "bg-accent-primary/20 text-accent-text-on-surface border border-accent-primary/30"
                            : "bg-surface-secondary text-text-tertiary"
                        }`}>
                          {config.showMonogram ? "VISIBLE" : "HIDDEN"}
                        </span>
                      </div>

                      {/* Monogram Scale Slider */}
                      <div className="space-y-1.5 pt-2 border-t border-border-default/60 dark:border-white/10">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-text-secondary uppercase">
                            Logo Height
                          </span>
                          <span className="text-[11px] font-mono text-text-primary font-bold bg-surface-elevated dark:bg-black/40 px-2 py-0.5 rounded border border-border-default dark:border-white/15">
                            {Math.round(config.monogramSizeMultiplier * 100)}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0.4"
                          max="1.2"
                          step="0.05"
                          value={config.monogramSizeMultiplier}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              monogramSizeMultiplier: parseFloat(e.target.value),
                            })
                          }
                          className="w-full accent-accent-primary cursor-pointer"
                        />
                        {/* Quick Sizes */}
                        <div className="flex items-center gap-1.5 flex-wrap pt-1">
                          {[
                            { label: "Adaptive (80%)", val: 0.8 },
                            { label: "Subtle (60%)", val: 0.6 },
                            { label: "Full (100%)", val: 1.0 },
                          ].map((preset) => (
                            <button
                              key={preset.label}
                              type="button"
                              onClick={() => setConfig({ ...config, monogramSizeMultiplier: preset.val })}
                              className={`px-2 py-0.5 text-[10px] font-mono rounded border transition-all cursor-pointer ${
                                Math.abs(config.monogramSizeMultiplier - preset.val) < 0.04
                                  ? "bg-accent-primary text-black font-bold border-accent-primary shadow-xs"
                                  : "bg-surface-elevated dark:bg-black/30 text-text-secondary border-border-default/80 dark:border-white/10 hover:text-text-primary"
                              }`}
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Step 2 Footer Navigation */}
                    <div className="pt-2 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setActiveControlTab("event")}
                        className="text-xs font-semibold text-text-secondary hover:text-text-primary transition-all cursor-pointer"
                      >
                        ← Back: Event Info
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveControlTab("style")}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-surface-secondary dark:bg-white/[0.08] hover:bg-accent-primary hover:text-black border border-border-default dark:border-white/15 text-xs font-bold text-text-primary transition-all cursor-pointer"
                      >
                        <span>Next: Style & FX</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* ============================================================
                    TAB 3: STYLE & FX
                    ============================================================ */}
                {activeControlTab === "style" && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    {/* Typography Style Card */}
                    <div className="bg-surface-primary dark:bg-[#0f121d] rounded-xl border border-border-default/80 dark:border-white/10 p-4 space-y-3 shadow-xs">
                      <div>
                        <div className="mb-1.5">
                          <label className="text-xs font-mono font-bold uppercase tracking-wider text-text-secondary">
                            Typography Pairing
                          </label>
                        </div>
                        <Select
                          value={config.fontStyle}
                          onChange={(val) =>
                            setConfig({ ...config, fontStyle: val as FontCombination })
                          }
                          options={FONT_STYLE_OPTIONS}
                        />
                      </div>
                    </div>

                    {/* Apple Liquid Glass Optics Card */}
                    <div className="bg-surface-primary dark:bg-[#0f121d] rounded-xl border border-border-default/80 dark:border-white/10 p-4 space-y-3.5 shadow-xs animate-in fade-in duration-150">
                        <div className="flex items-center justify-between pb-1 border-b border-border-default/60 dark:border-white/10">
                          <div className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-accent-primary" />
                            <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-text-primary">
                              Liquid Glass Mode
                            </h3>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent-primary/20 text-accent-text-on-surface font-bold border border-accent-primary/30">
                            GLASS ENGINE
                          </span>
                        </div>

                        {/* Glass Mode Variant (Dark / Frosted) */}
                        <div>
                          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-text-secondary mb-1.5">
                            Glass Theme Variant
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              {
                                id: "dark",
                                label: "Dark Glass",
                                badge: "Default",
                                apply: () => setConfig({ ...config, glassTheme: "dark" }),
                                active: (config.glassTheme === "dark" || config.glassTheme === "obsidian" || !config.glassTheme),
                              },
                              {
                                id: "frosted",
                                label: "Frosted Glass",
                                badge: "Diffusion",
                                apply: () => setConfig({ ...config, glassTheme: "frosted" }),
                                active: config.glassTheme === "frosted",
                              },
                            ].map((p) => (
                              <button
                                key={p.id}
                                type="button"
                                onClick={p.apply}
                                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                                  p.active
                                    ? "border-accent-primary bg-accent-primary/10 font-bold shadow-xs ring-1 ring-accent-primary/40"
                                    : "border-border-default/80 dark:border-white/10 bg-surface-elevated dark:bg-black/30 hover:border-text-primary/30 text-text-secondary"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-text-primary font-bold">{p.label}</span>
                                  <span className="text-[8px] font-mono uppercase px-1 py-0.2 rounded bg-accent-primary/20 text-accent-text-on-surface font-bold">
                                    {p.badge}
                                  </span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* 2025 Optical Physics Suite: Displacement, Chromatic Aberration & Refraction Mode */}
                        <div className="pt-3 border-t border-border-default/60 dark:border-white/10 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold uppercase tracking-wider text-text-secondary">
                              Liquid Glass Refraction Optics
                            </span>
                            <span className="text-[10px] font-mono text-accent-primary font-bold">
                              DISPLACEMENT MAP
                            </span>
                          </div>

                          {/* Refraction Mode Selection */}
                          <div>
                            <div className="flex justify-between items-center text-xs mb-1.5">
                              <span className="font-mono text-text-secondary uppercase">Refraction Map Mode</span>
                              <span className="font-mono text-text-primary font-bold text-[10px] uppercase bg-surface-elevated dark:bg-black/40 px-1.5 py-0.2 rounded border border-border-default dark:border-white/15">
                                {config.refractionMode || "prominent"}
                              </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              {[
                                { id: "prominent", label: "Prominent", badge: "Default" },
                                { id: "standard", label: "Standard", badge: "Subtle" },
                                { id: "polar", label: "Polar", badge: "Radial" },
                              ].map((m) => {
                                const isCur = (config.refractionMode || "prominent") === m.id;
                                return (
                                  <button
                                    key={m.id}
                                    type="button"
                                    onClick={() => setConfig({ ...config, refractionMode: m.id as any })}
                                    className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                                      isCur
                                        ? "border-accent-primary bg-accent-primary/10 ring-1 ring-accent-primary/30 font-bold"
                                        : "border-border-default/80 dark:border-white/10 bg-surface-secondary dark:bg-white/[0.03] text-text-secondary"
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-[11px] font-bold text-text-primary">{m.label}</span>
                                      <span className="text-[8px] font-mono uppercase px-1 rounded bg-accent-primary/20 text-accent-text-on-surface">
                                        {m.badge}
                                      </span>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Chromatic Aberration Customizer Slider */}
                          <div className="space-y-1.5 pt-1">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-mono text-text-secondary uppercase">Chromatic Aberration</span>
                              <span className="font-mono text-text-primary font-bold text-[11px] bg-surface-elevated dark:bg-black/40 px-2 py-0.5 rounded border border-border-default dark:border-white/15">
                                {(config.aberrationIntensity ?? 4).toFixed(1)}
                              </span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="8"
                              step="0.5"
                              value={config.aberrationIntensity ?? 4}
                              onChange={(e) =>
                                setConfig({
                                  ...config,
                                  aberrationIntensity: parseFloat(e.target.value),
                                })
                              }
                              className="w-full accent-accent-primary cursor-pointer"
                            />
                          </div>

                          {/* Displacement Scale Slider */}
                          <div className="space-y-1.5 pt-1">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-mono text-text-secondary uppercase">Displacement Scale</span>
                              <span className="font-mono text-text-primary font-bold text-[11px] bg-surface-elevated dark:bg-black/40 px-2 py-0.5 rounded border border-border-default dark:border-white/15">
                                {config.displacementScale ?? 50}px
                              </span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="80"
                              step="1"
                              value={config.displacementScale ?? 50}
                              onChange={(e) =>
                                setConfig({
                                  ...config,
                                  displacementScale: parseInt(e.target.value, 10),
                                })
                              }
                              className="w-full accent-accent-primary cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>


                    {/* Step 3 Footer Navigation */}
                    <div className="pt-2 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setActiveControlTab("sigil")}
                        className="text-xs font-semibold text-text-secondary hover:text-text-primary transition-all cursor-pointer"
                      >
                        ← Back: Logo Vault
                      </button>
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-accent-text-on-surface bg-accent-primary/10 border border-accent-primary/30 px-2.5 py-1 rounded-lg">
                        <Check className="w-3 h-3 text-accent-primary" />
                        <span>Live Preview Synced</span>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================
            RIGHT COLUMN: Live Preview Anvil & Batch Photo Grid (7 cols on desktop)
            ============================================================ */}
        <div className="contents lg:block lg:col-span-7 space-y-6">

          {/* 1. Live Photo Preview Card (1st on mobile sticky, static on laptop) */}
          <div className="order-1 w-full bg-surface-elevated rounded-xl border border-black shadow-[4px_4px_0px_var(--accent-primary)] overflow-hidden sticky top-[var(--nav-height,64px)] lg:static lg:top-auto z-30 lg:z-auto">
            <div className="p-2.5 sm:p-4 border-b border-border-default flex items-center justify-between gap-2 bg-surface-secondary/40">
              <div className="flex items-center gap-2 min-w-0">
                <Eye className="w-4 h-4 text-accent-primary shrink-0" />
                <span className="font-heading font-bold text-xs sm:text-sm text-text-primary truncate">
                  Live Photo Preview
                </span>
                {selectedPhoto && (
                  <span className="text-[10px] sm:text-[11px] font-mono px-1.5 py-0.5 rounded bg-surface-primary border border-border-default text-text-secondary shrink-0">
                    {selectedPhoto.width} × {selectedPhoto.height} px
                  </span>
                )}
              </div>

              {selectedPhoto && (
                <div className="hidden sm:flex items-center gap-2">
                  <button
                    type="button"
                    onMouseDown={() => setShowOriginalPreview(true)}
                    onMouseUp={() => setShowOriginalPreview(false)}
                    onTouchStart={() => setShowOriginalPreview(true)}
                    onTouchEnd={() => setShowOriginalPreview(false)}
                    className="text-xs px-2.5 py-1 rounded border border-border-default bg-surface-primary hover:bg-surface-secondary text-text-secondary font-medium transition-all cursor-pointer select-none"
                  >
                    {showOriginalPreview ? "Viewing Original..." : "Hold to View Original"}
                  </button>
                  <button
                    type="button"
                    onClick={() => inscribeAndDownloadSingle(selectedPhoto)}
                    className="text-xs px-2.5 py-1 rounded bg-accent-primary text-black font-bold hover:bg-accent-primary-hover transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download Photo</span>
                  </button>
                </div>
              )}
            </div>

            {/* Anvil Viewport (Compact max-height on mobile so controls remain visible underneath) */}
            <div className="relative min-h-[190px] max-h-[32vh] sm:min-h-[280px] sm:max-h-[44vh] lg:min-h-[380px] lg:max-h-[500px] bg-black/90 flex items-center justify-center p-2 sm:p-4 overflow-hidden">
              {photos.length === 0 ? (
                <div className="text-center py-6 px-3 sm:py-12 sm:px-4 max-w-sm">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3 rounded-full bg-surface-secondary/20 border border-border-default flex items-center justify-center text-text-tertiary">
                    <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8 opacity-60" />
                  </div>
                  <h3 className="font-heading font-bold text-sm sm:text-base text-white mb-1">
                    No Photo Selected
                  </h3>
                  <p className="text-xs text-text-tertiary mb-3 sm:mb-4">
                    Upload event photos below or load a sample photo to test the watermark.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={loadSamplePhoto}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-primary text-black text-xs font-bold hover:bg-accent-primary-hover transition-all cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Load Sample Photo</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex sm:hidden items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-secondary border border-border-default text-text-primary text-xs font-medium hover:bg-surface-elevated transition-all cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5 text-accent-primary" />
                      <span>Upload Photo</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative max-w-full max-h-[30vh] sm:max-h-[42vh] lg:max-h-[500px] flex items-center justify-center">
                  {/* Live Watermarked Canvas */}
                  <canvas
                    ref={previewCanvasRef}
                    className={`max-w-full max-h-[28vh] sm:max-h-[40vh] lg:max-h-[480px] object-contain rounded shadow-lg transition-opacity duration-150 ${
                      showOriginalPreview ? "opacity-0 absolute" : "opacity-100"
                    }`}
                  />

                  {/* Original Photo Preview (Shown when Peeking) */}
                  {showOriginalPreview && selectedPhoto && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={selectedPhoto.originalUrl}
                      alt="Original"
                      className="max-w-full max-h-[28vh] sm:max-h-[40vh] lg:max-h-[480px] object-contain rounded shadow-lg"
                    />
                  )}
                </div>
              )}
            </div>

            {/* Status footer for preview - hidden on mobile to conserve screen height */}
            {selectedPhoto && (
              <div className="hidden sm:flex p-2.5 px-4 bg-surface-secondary/60 border-t border-border-default items-center justify-between text-xs text-text-secondary">
                <span className="truncate max-w-[280px]">
                  Previewing: <strong className="text-text-primary">{selectedPhoto.name}</strong>
                </span>
                <span className="font-mono text-[11px] text-accent-text-on-surface font-semibold">
                  Apple Liquid Glass • Frosted Capsule
                </span>
              </div>
            )}
          </div>

          {/* 2. Mobile Filmstrip Reel (2nd on mobile, hidden on desktop) */}
          <div className="order-2 w-full lg:hidden bg-surface-elevated rounded-xl border border-black p-2 shadow-[2px_2px_0px_#000]">
            <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar py-0.5">
              {/* Quick Add Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center shrink-0 w-14 h-14 rounded-lg border-2 border-dashed border-accent-primary/60 bg-accent-primary/5 hover:bg-accent-primary/10 text-accent-primary transition-all active:scale-95 cursor-pointer"
                title="Add photo"
              >
                <Upload className="w-4 h-4 mb-0.5" />
                <span className="text-[9px] font-bold">+ Add</span>
              </button>

              {/* Photo Thumbnails */}
              {photos.map((photo, idx) => {
                const isSelected = selectedIndex === idx;
                return (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => setSelectedIndex(idx)}
                    className={`relative shrink-0 w-14 h-14 rounded-lg border-2 overflow-hidden transition-all active:scale-95 cursor-pointer ${
                      isSelected
                        ? "border-accent-primary ring-2 ring-accent-primary/50 shadow-sm"
                        : "border-border-default opacity-75 hover:opacity-100"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.processedUrl || photo.originalUrl}
                      alt={photo.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-black/75 py-0.2 text-center">
                      <span className="text-[8px] font-mono text-white block truncate px-0.5">
                        #{idx + 1}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent-primary shadow-[0_0_6px_var(--accent-primary)] animate-pulse" />
                    )}
                  </button>
                );
              })}

              {photos.length === 0 && (
                <button
                  type="button"
                  onClick={loadSamplePhoto}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-secondary border border-border-default text-text-secondary text-xs shrink-0 active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-accent-primary" />
                  <span>Load Sample Photo</span>
                </button>
              )}
            </div>
          </div>

          {/* 3. Multi-Photo Upload Dropzone & Batch Thumbnail Grid (4th on mobile) */}
          <div className="order-4 w-full p-5 sm:p-6 bg-surface-elevated rounded-xl border border-black shadow-[4px_4px_0px_var(--accent-primary)]">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-border-default pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-accent-primary" />
                  <h2 className="font-heading font-bold text-base text-text-primary">
                    Photo Queue ({photos.length})
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
                      Clear All
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
                  Drag & Drop Photos Here, or Click to Browse
                </h4>
                <p className="text-xs text-text-secondary">
                  Supports multiple images (JPG, PNG, WEBP)
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
                                  ✓ Ready
                                </span>
                              ) : photo.status === "processing" ? (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-accent-warning text-white text-[9px] font-mono font-bold animate-pulse">
                                  Processing...
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

                  {/* Progress bar during batch processing & archiving */}
                  {isExporting && progress.total > 0 && (
                    <div className="p-3 bg-surface-secondary rounded-lg border border-border-default space-y-1.5 animate-fadeIn">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-text-secondary">
                          Watermarking & Archiving... ({progress.current}/{progress.total})
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

                  {/* Action Button: Single Photo Download or Multi-Photo ZIP Archive */}
                  <div className="pt-2">
                    <button
                      type="button"
                      disabled={isExporting || photos.length === 0}
                      onClick={() => {
                        if (photos.length > 1) {
                          handleBatchExportZip();
                        } else if (selectedPhoto) {
                          inscribeAndDownloadSingle(selectedPhoto);
                        }
                      }}
                      className="w-full inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-accent-primary hover:bg-accent-primary-hover text-black text-sm font-bold shadow-[2px_2px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0 cursor-pointer"
                    >
                      {photos.length > 1 ? (
                        isExporting ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin text-black" />
                            <span>
                              {progress.total > 0
                                ? `Watermarking & Archiving (${progress.current}/${progress.total})...`
                                : "Compressing ZIP Archive..."}
                            </span>
                          </>
                        ) : (
                          <>
                            <FolderArchive className="w-4 h-4 text-black" />
                            <span>Download All Photos as ZIP ({photos.length})</span>
                          </>
                        )
                      ) : (
                        <>
                          <Download className="w-4 h-4 text-black" />
                          <span>Download Photo</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ============================================================
              CHILD 5: Mobile Sticky Bottom Action Bar (lg:hidden)
              ============================================================ */}
          <div className="order-5 lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-elevated/95 backdrop-blur-md border-t border-black p-3 shadow-[0_-4px_16px_rgba(0,0,0,0.2)]">
            <div className="container max-w-lg mx-auto flex items-center gap-3">
              <button
                type="button"
                disabled={!selectedPhoto}
                onMouseDown={() => setShowOriginalPreview(true)}
                onMouseUp={() => setShowOriginalPreview(false)}
                onTouchStart={() => setShowOriginalPreview(true)}
                onTouchEnd={() => setShowOriginalPreview(false)}
                className="flex-1 py-2.5 px-3 rounded-xl border border-border-default bg-surface-secondary text-text-primary text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all disabled:opacity-40 select-none cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-accent-primary" />
                <span>{showOriginalPreview ? "Viewing Original..." : "Hold to Peek"}</span>
              </button>

              {photos.length > 1 ? (
                <button
                  type="button"
                  disabled={isExporting || photos.length === 0}
                  onClick={handleBatchExportZip}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-accent-primary hover:bg-accent-primary-hover text-black text-xs font-bold shadow-[2px_2px_0px_#000] flex items-center justify-center gap-1.5 active:scale-95 transition-all disabled:opacity-40 cursor-pointer"
                >
                  {isExporting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-black" />
                      <span>{progress.total > 0 ? `Exporting (${progress.current}/${progress.total})...` : "Packaging ZIP..."}</span>
                    </>
                  ) : (
                    <>
                      <FolderArchive className="w-3.5 h-3.5 text-black" />
                      <span>Download All as ZIP ({photos.length})</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  disabled={!selectedPhoto}
                  onClick={() => selectedPhoto && inscribeAndDownloadSingle(selectedPhoto)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-accent-primary hover:bg-accent-primary-hover text-black text-xs font-bold shadow-[2px_2px_0px_#000] flex items-center justify-center gap-1.5 active:scale-95 transition-all disabled:opacity-40 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-black" />
                  <span>Download Photo</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ===== FOOTER INFO & CODEX STRIP ===== */}
        <div className="mt-12 p-6 rounded-xl border border-black bg-surface-secondary/40">
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
