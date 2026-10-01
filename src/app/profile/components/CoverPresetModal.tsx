"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import {
  Upload,
  X,
  Check,
  Sparkles,
  Move,
  Loader2,
  Plus,
  Trash2,
  Sliders,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
} from "lucide-react";
import {
  fetchAllCoverPresets,
  createCoverPreset,
  deleteCoverPreset,
  builtInCoverPresets,
  CoverPreset,
} from "@/lib/api/coverPresets";
import toast from "react-hot-toast";

interface CoverPresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCoverUrl?: string;
  currentUserRole?: string;
  initialFile?: File | null;
  onSelectPreset: (preset: CoverPreset) => void;
  onUploadFile?: (file: File, position?: string) => Promise<void>;
  onTriggerReposition?: () => void;
  isApplying?: boolean;
  applyingPresetId?: string | null;
}

export function CoverPresetModal({
  isOpen,
  onClose,
  currentCoverUrl,
  currentUserRole,
  initialFile = null,
  onSelectPreset,
  onTriggerReposition,
  applyingPresetId,
  onUploadFile,
}: CoverPresetModalProps) {
  // Preset list state
  const [presets, setPresets] = useState<CoverPreset[]>(builtInCoverPresets);
  const [isLoadingPresets, setIsLoadingPresets] = useState(false);

  // File selection & positioning state
  const [selectedFile, setSelectedFile] = useState<File | null>(initialFile);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Positioning coordinates
  const [posX, setPosX] = useState(50);
  const [posY, setPosY] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const dragContainerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0, posX: 50, posY: 50 });

  // Admin preset upload panel state
  const [showAdminPresetForm, setShowAdminPresetForm] = useState(false);
  const [adminPresetName, setAdminPresetName] = useState("");
  const [adminPresetCategory, setAdminPresetCategory] = useState("Community");
  const [adminPresetDesc, setAdminPresetDesc] = useState("");
  const [adminPresetFile, setAdminPresetFile] = useState<File | null>(null);
  const [adminPresetPreview, setAdminPresetPreview] = useState<string | null>(null);
  const [isPublishingPreset, setIsPublishingPreset] = useState(false);
  const [deletingPresetId, setDeletingPresetId] = useState<string | null>(null);

  const modalFileInputRef = useRef<HTMLInputElement>(null);
  const adminFileInputRef = useRef<HTMLInputElement>(null);

  const isAdminOrMod =
    currentUserRole === "admin" ||
    currentUserRole === "moderator" ||
    currentUserRole === "advisor";

  // Load presets whenever modal opens
  const loadPresets = useCallback(async () => {
    setIsLoadingPresets(true);
    try {
      const data = await fetchAllCoverPresets();
      setPresets(data);
    } catch {
      setPresets(builtInCoverPresets);
    } finally {
      setIsLoadingPresets(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadPresets();
      if (initialFile) {
        setSelectedFile(initialFile);
        const objUrl = URL.createObjectURL(initialFile);
        setPreviewUrl(objUrl);
        setPosX(50);
        setPosY(50);
      }
    } else {
      // Cleanup preview URL on close
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
      setSelectedFile(null);
      setPreviewUrl(null);
      setShowAdminPresetForm(false);
      setAdminPresetFile(null);
      setAdminPresetPreview(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialFile, loadPresets]);

  // Handle local file selection for user's cover banner
  const handleFilePicked = (file: File) => {
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      toast.error("Cover image exceeds 15MB limit.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, WebP).");
      return;
    }

    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    const objUrl = URL.createObjectURL(file);
    setPreviewUrl(objUrl);
    setPosX(50);
    setPosY(50);
  };

  // Drag interaction for positioning the cover image
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      posX,
      posY,
    };
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      posX,
      posY,
    };
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !dragContainerRef.current) return;
      e.preventDefault();
      const rect = dragContainerRef.current.getBoundingClientRect();
      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;

      const percentDeltaX = (deltaX / rect.width) * 100;
      const percentDeltaY = (deltaY / rect.height) * 100;

      const nextX = Math.min(100, Math.max(0, dragStartRef.current.posX - percentDeltaX));
      const nextY = Math.min(100, Math.max(0, dragStartRef.current.posY - percentDeltaY));

      setPosX(Math.round(nextX));
      setPosY(Math.round(nextY));
    },
    [isDragging]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging || !dragContainerRef.current) return;
      const rect = dragContainerRef.current.getBoundingClientRect();
      const deltaX = e.touches[0].clientX - dragStartRef.current.x;
      const deltaY = e.touches[0].clientY - dragStartRef.current.y;

      const percentDeltaX = (deltaX / rect.width) * 100;
      const percentDeltaY = (deltaY / rect.height) * 100;

      const nextX = Math.min(100, Math.max(0, dragStartRef.current.posX - percentDeltaX));
      const nextY = Math.min(100, Math.max(0, dragStartRef.current.posY - percentDeltaY));

      setPosX(Math.round(nextX));
      setPosY(Math.round(nextY));
    },
    [isDragging]
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleDragEnd);
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleDragEnd);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleDragEnd);
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleDragEnd);
      };
    }
  }, [isDragging, handleMouseMove, handleTouchMove, handleDragEnd]);

  // Upload and apply cover with focal position
  const handleConfirmUpload = async () => {
    if (!selectedFile || !onUploadFile) return;

    setIsUploading(true);
    const posString = `${posX}% ${posY}%`;

    try {
      await onUploadFile(selectedFile, posString);
      toast.success("Cover banner uploaded and positioned successfully!");
      onClose();
    } catch (err: any) {
      toast.error(err?.message || "Failed to upload cover banner");
    } finally {
      setIsUploading(false);
    }
  };

  // Reset selected file to choose another or return to presets
  const handleResetFile = () => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  // Admin preset publishing handler
  const handlePublishAdminPreset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminPresetName.trim()) {
      toast.error("Please enter a name for the cover preset.");
      return;
    }
    if (!adminPresetFile) {
      toast.error("Please select an image file for this preset.");
      return;
    }

    setIsPublishingPreset(true);
    try {
      const formData = new FormData();
      formData.append("name", adminPresetName.trim());
      formData.append("category", adminPresetCategory.trim() || "Community");
      formData.append("description", adminPresetDesc.trim());
      formData.append("image", adminPresetFile);

      const newPreset = await createCoverPreset(formData);
      toast.success(`Preset "${newPreset.name}" published for all members!`);

      // Reset form
      setAdminPresetName("");
      setAdminPresetCategory("Community");
      setAdminPresetDesc("");
      setAdminPresetFile(null);
      setAdminPresetPreview(null);
      setShowAdminPresetForm(false);

      // Reload presets
      await loadPresets();
    } catch (err: any) {
      toast.error(err?.message || "Failed to upload cover preset");
    } finally {
      setIsPublishingPreset(false);
    }
  };

  // Admin preset delete handler
  const handleDeletePreset = async (presetId: string, presetName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete preset "${presetName}"?`)) {
      return;
    }

    setDeletingPresetId(presetId);
    try {
      await deleteCoverPreset(presetId);
      toast.success(`Cover preset "${presetName}" removed.`);
      await loadPresets();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete preset");
    } finally {
      setDeletingPresetId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[10000] flex items-center justify-center p-3 sm:p-4 animate-[fadeIn_0.2s_ease_forwards]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[760px] max-h-[92vh] overflow-y-auto bg-surface-elevated border-2 border-text-primary dark:border-border-default rounded-xl shadow-[8px_8px_0px_0px_var(--accent-primary)] p-4 sm:p-6 relative animate-[slideUp_0.25s_cubic-bezier(0.16,1,0.3,1)_forwards]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4 pb-3 border-b-2 border-border-default">
          <div>
            <div className="flex items-center gap-1.5 text-accent-primary font-mono text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles size={14} /> Profile Personalization
            </div>
            <h2 className="font-heading text-lg sm:text-xl font-extrabold text-text-primary m-0">
              {selectedFile ? "Position & Apply Cover Banner" : "Change Profile Cover Banner"}
            </h2>
            <p className="font-body text-xs text-text-secondary mt-0.5">
              {selectedFile
                ? "Drag the banner to set the focal position before applying it to your profile."
                : "Select a cover preset or upload a custom cover from your device."}
            </p>
          </div>
          <button
            type="button"
            className="flex items-center justify-center w-8 h-8 bg-surface-secondary border border-border-default rounded-md text-text-primary cursor-pointer font-extrabold transition-all duration-150 hover:bg-accent-primary-light hover:rotate-90 shrink-0"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            VIEW A: INTERACTIVE POSITIONING (After Selecting an Image)
            ══════════════════════════════════════════════════════════════ */}
        {selectedFile && previewUrl ? (
          <div className="space-y-4">
            {/* 4:1 Aspect Ratio Draggable Preview Container */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-text-primary flex items-center gap-1.5 font-mono">
                  <Move size={14} className="text-accent-primary" /> Drag to Position
                </span>
                <span className="font-mono text-[11px] text-text-tertiary">
                  Focal Point: <strong className="text-accent-primary font-bold">{posX}% {posY}%</strong>
                </span>
              </div>

              <div
                ref={dragContainerRef}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
                className={`w-full aspect-[4/1] min-h-[140px] max-h-[220px] rounded-xl border-2 border-text-primary dark:border-border-default overflow-hidden relative bg-slate-950 select-none shadow-[4px_4px_0px_0px_var(--accent-primary)] ${
                  isDragging ? "cursor-grabbing" : "cursor-grab"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Cover positioning preview"
                  draggable={false}
                  className="w-full h-full object-cover pointer-events-none transition-[object-position] duration-75"
                  style={{ objectPosition: `${posX}% ${posY}%` }}
                />

                {/* Neo-brutalist focal crosshair badge overlay */}
                <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-xs text-white px-2.5 py-1 rounded text-[10px] font-mono font-bold flex items-center gap-1.5 border border-white/20">
                  <Sliders size={12} className="text-accent-primary" />
                  <span>X: {posX}% · Y: {posY}%</span>
                </div>

                <div className="absolute top-2 right-2 bg-accent-primary text-black font-extrabold px-2 py-0.5 rounded text-[10px] font-mono shadow-md">
                  4:1 RATIO PREVIEW
                </div>
              </div>
            </div>

            {/* Quick Position Presets */}
            <div className="p-3 bg-surface-secondary border-2 border-border-default rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text-primary">Quick Alignment Presets</span>
                <span className="text-[11px] text-text-secondary">Or use sliders below for fine adjustment</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPosX(50);
                    setPosY(0);
                  }}
                  className={`px-3 py-1 text-xs font-bold rounded-md border transition cursor-pointer ${
                    posY === 0 && posX === 50
                      ? "bg-accent-primary text-black border-text-primary shadow-[2px_2px_0px_0px_var(--text-primary)]"
                      : "bg-surface-primary text-text-primary border-border-default hover:border-accent-primary"
                  }`}
                >
                  Top (0%)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPosX(50);
                    setPosY(25);
                  }}
                  className={`px-3 py-1 text-xs font-bold rounded-md border transition cursor-pointer ${
                    posY === 25 && posX === 50
                      ? "bg-accent-primary text-black border-text-primary shadow-[2px_2px_0px_0px_var(--text-primary)]"
                      : "bg-surface-primary text-text-primary border-border-default hover:border-accent-primary"
                  }`}
                >
                  Upper (25%)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPosX(50);
                    setPosY(50);
                  }}
                  className={`px-3 py-1 text-xs font-bold rounded-md border transition cursor-pointer ${
                    posY === 50 && posX === 50
                      ? "bg-accent-primary text-black border-text-primary shadow-[2px_2px_0px_0px_var(--text-primary)]"
                      : "bg-surface-primary text-text-primary border-border-default hover:border-accent-primary"
                  }`}
                >
                  Center (50%)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPosX(50);
                    setPosY(75);
                  }}
                  className={`px-3 py-1 text-xs font-bold rounded-md border transition cursor-pointer ${
                    posY === 75 && posX === 50
                      ? "bg-accent-primary text-black border-text-primary shadow-[2px_2px_0px_0px_var(--text-primary)]"
                      : "bg-surface-primary text-text-primary border-border-default hover:border-accent-primary"
                  }`}
                >
                  Lower (75%)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPosX(50);
                    setPosY(100);
                  }}
                  className={`px-3 py-1 text-xs font-bold rounded-md border transition cursor-pointer ${
                    posY === 100 && posX === 50
                      ? "bg-accent-primary text-black border-text-primary shadow-[2px_2px_0px_0px_var(--text-primary)]"
                      : "bg-surface-primary text-text-primary border-border-default hover:border-accent-primary"
                  }`}
                >
                  Bottom (100%)
                </button>
              </div>

              {/* Sliders for precise vertical and horizontal alignment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border-default">
                <div>
                  <div className="flex justify-between text-[11px] font-mono text-text-secondary mb-1">
                    <span>Vertical Offset (Y)</span>
                    <span className="font-bold text-text-primary">{posY}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={posY}
                    onChange={(e) => setPosY(parseInt(e.target.value))}
                    className="w-full accent-accent-primary cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] font-mono text-text-secondary mb-1">
                    <span>Horizontal Offset (X)</span>
                    <span className="font-bold text-text-primary">{posX}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={posX}
                    onChange={(e) => setPosX(parseInt(e.target.value))}
                    className="w-full accent-accent-primary cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t-2 border-border-default">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFile}
                disabled={isUploading}
              >
                Change Photo
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleConfirmUpload}
                  disabled={isUploading}
                  className="px-4"
                >
                  {isUploading ? (
                    <>
                      <Loader2 size={14} className="animate-spin mr-1.5" />
                      Uploading &amp; Saving...
                    </>
                  ) : (
                    <>
                      <Check size={14} className="mr-1.5" />
                      Save &amp; Apply Cover
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* ══════════════════════════════════════════════════════════════
              VIEW B: PRESET BROWSER & CUSTOM UPLOAD
              ══════════════════════════════════════════════════════════════ */
          <div>
            {/* Reposition Current Banner Action (if active) */}
            {currentCoverUrl && onTriggerReposition && (
              <div className="mb-4 p-3 bg-surface-secondary border-2 border-border-default rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-[2px_2px_0px_0px_var(--border-default)]">
                <div>
                  <span className="font-bold text-xs sm:text-sm text-text-primary flex items-center gap-1.5">
                    <Move size={14} className="text-accent-primary" /> Drag &amp; Reposition Active Banner
                  </span>
                  <p className="m-0 text-[11px] text-text-secondary mt-0.5">
                    Want to adjust the focal point of your active banner directly in your profile header?
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    onClose();
                    onTriggerReposition();
                  }}
                  className="shrink-0"
                >
                  <Move size={13} style={{ marginRight: "4px" }} /> Reposition Now
                </Button>
              </div>
            )}

            {/* Custom Cover Upload Dropzone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                const file = e.dataTransfer.files?.[0];
                if (file) handleFilePicked(file);
              }}
              className={`p-4 mb-4 border-2 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3.5 transition-all ${
                isDragOver
                  ? "bg-accent-primary/10 border-accent-primary shadow-[4px_4px_0px_0px_var(--accent-primary)]"
                  : "bg-surface-secondary border-border-default shadow-[3px_3px_0px_0px_var(--border-default)]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-surface-primary border border-border-default rounded-lg text-accent-primary shrink-0">
                  <Upload size={20} />
                </div>
                <div>
                  <span className="font-bold text-xs sm:text-sm text-text-primary flex items-center gap-1.5">
                    Upload Custom Cover Photo
                  </span>
                  <p className="m-0 text-[11px] text-text-secondary mt-0.5 leading-relaxed">
                    Select a photo from your PC or device (PNG, JPG, WebP). You can position and adjust it before saving.
                  </p>
                </div>
              </div>

              <input
                ref={modalFileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFilePicked(file);
                  if (modalFileInputRef.current) modalFileInputRef.current.value = "";
                }}
                className="hidden"
              />

              <Button
                size="sm"
                variant="primary"
                onClick={() => modalFileInputRef.current?.click()}
                className="shrink-0 w-full sm:w-auto"
              >
                <Upload size={13} className="mr-1.5" /> Choose File from PC...
              </Button>
            </div>

            {/* ════ Admin / Moderator Preset Uploader Expandable Card ════ */}
            {isAdminOrMod && (
              <div className="mb-4 border-2 border-accent-primary rounded-xl overflow-hidden bg-surface-secondary shadow-[3px_3px_0px_0px_var(--accent-primary)]">
                <button
                  type="button"
                  onClick={() => setShowAdminPresetForm(!showAdminPresetForm)}
                  className="w-full p-3 bg-accent-primary/10 flex items-center justify-between text-left cursor-pointer hover:bg-accent-primary/15 transition-colors border-none"
                >
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-accent-primary text-black font-mono text-[10px] font-extrabold rounded">
                      ADMIN / MODERATOR
                    </span>
                    <span className="font-heading font-extrabold text-xs sm:text-sm text-text-primary">
                      Upload New Community Preset
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-accent-primary">
                    {showAdminPresetForm ? (
                      <>
                        <span>Close Form</span>
                        <ChevronUp size={16} />
                      </>
                    ) : (
                      <>
                        <span>Add Preset</span>
                        <ChevronDown size={16} />
                      </>
                    )}
                  </div>
                </button>

                {showAdminPresetForm && (
                  <form onSubmit={handlePublishAdminPreset} className="p-4 space-y-3 bg-surface-elevated border-t border-border-default">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-text-primary mb-1">
                          Preset Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={adminPresetName}
                          onChange={(e) => setAdminPresetName(e.target.value)}
                          placeholder="e.g. Winter Hackathon 2026"
                          className="w-full px-2.5 py-1.5 text-xs rounded border border-border-default bg-surface-primary text-text-primary font-mono focus:outline-none focus:border-accent-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-text-primary mb-1">
                          Category
                        </label>
                        <input
                          type="text"
                          value={adminPresetCategory}
                          onChange={(e) => setAdminPresetCategory(e.target.value)}
                          placeholder="e.g. Club Events, Cyberpunk, Minimal"
                          className="w-full px-2.5 py-1.5 text-xs rounded border border-border-default bg-surface-primary text-text-primary font-mono focus:outline-none focus:border-accent-primary"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-text-primary mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        value={adminPresetDesc}
                        onChange={(e) => setAdminPresetDesc(e.target.value)}
                        placeholder="Brief summary displayed under the preset card..."
                        className="w-full px-2.5 py-1.5 text-xs rounded border border-border-default bg-surface-primary text-text-primary font-mono focus:outline-none focus:border-accent-primary"
                      />
                    </div>

                    {/* Image chooser */}
                    <div>
                      <label className="block text-xs font-bold text-text-primary mb-1">
                        Preset Image File (Wide 4:1 recommended) <span className="text-red-500">*</span>
                      </label>
                      <input
                        ref={adminFileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/svg+xml"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setAdminPresetFile(file);
                            setAdminPresetPreview(URL.createObjectURL(file));
                          }
                        }}
                        className="hidden"
                      />

                      <div className="flex items-center gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => adminFileInputRef.current?.click()}
                        >
                          <ImageIcon size={14} className="mr-1.5" />
                          {adminPresetFile ? adminPresetFile.name : "Select Image File..."}
                        </Button>

                        {adminPresetPreview && (
                          <div className="w-24 h-8 rounded border border-border-default overflow-hidden bg-slate-950">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={adminPresetPreview}
                              alt="Preset preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-default">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAdminPresetForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        size="sm"
                        disabled={isPublishingPreset}
                      >
                        {isPublishingPreset ? (
                          <>
                            <Loader2 size={13} className="animate-spin mr-1.5" />
                            Publishing Preset...
                          </>
                        ) : (
                          <>
                            <Plus size={13} className="mr-1.5" />
                            Publish Preset to Library
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Presets Header */}
            <div className="flex items-center justify-between gap-2 mb-2 pb-1 border-b border-dashed border-border-default">
              <span className="font-mono text-xs font-bold text-text-tertiary uppercase tracking-wider">
                Preset Cover Gallery ({presets.length})
              </span>
              <span className="text-[11px] text-text-tertiary">Click any cover to preview and apply</span>
            </div>

            {/* Presets Grid */}
            {isLoadingPresets ? (
              <div className="flex items-center justify-center p-8 text-xs font-mono text-text-secondary gap-2">
                <Loader2 size={16} className="animate-spin text-accent-primary" /> Loading cover presets...
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                {presets.map((preset) => {
                  const isSelected = currentCoverUrl === preset.url;
                  const isApplying = applyingPresetId === preset.id;
                  const isDeleting = deletingPresetId === preset.id;

                  return (
                    <div
                      key={preset.id}
                      className={`group rounded-xl overflow-hidden bg-surface-secondary flex flex-col transition-all duration-150 cursor-pointer ${
                        isSelected
                          ? "border-2 border-accent-primary shadow-[4px_4px_0px_0px_var(--accent-primary)] ring-2 ring-accent-primary/20"
                          : "border-2 border-border-brutalist dark:border-border-default shadow-[3px_3px_0px_0px_var(--border-brutalist)] dark:shadow-[3px_3px_0px_0px_var(--border-default)] hover:shadow-[4px_4px_0px_0px_var(--accent-primary)] hover:-translate-x-0.5 hover:-translate-y-0.5"
                      }`}
                      onClick={() => onSelectPreset(preset)}
                    >
                      {/* Banner Thumbnail */}
                      <div className="w-full h-[95px] relative overflow-hidden bg-slate-950">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={preset.url}
                          alt={preset.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {isSelected && (
                          <div className="absolute top-2 right-2 bg-accent-primary text-black px-2 py-0.5 rounded text-[10px] font-extrabold font-mono flex items-center gap-1 shadow-md">
                            <Check size={12} /> ACTIVE
                          </div>
                        )}
                        {preset.isCustom && (
                          <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-xs text-white px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border border-white/20">
                            COMMUNITY
                          </div>
                        )}
                      </div>

                      {/* Info & Button Bar */}
                      <div className="p-2.5 flex flex-col justify-between flex-1 gap-2 bg-surface-elevated">
                        <div>
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="font-heading font-extrabold text-xs sm:text-sm text-text-primary m-0 truncate">
                              {preset.name}
                            </h4>
                            <span className="text-[9px] text-accent-primary bg-accent-primary/10 border border-accent-primary/30 px-1.5 py-0.2 rounded font-mono font-bold shrink-0">
                              {preset.category}
                            </span>
                          </div>
                          <p className="mt-1 mb-0 text-[11px] text-text-secondary line-clamp-1 leading-snug">
                            {preset.description}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-border-default flex items-center justify-between">
                          <span className="text-[10px] font-mono text-text-tertiary">
                            {preset.isCustom ? "Custom Upload" : "Ratio 4:1 · Built-in"}
                          </span>
                          <div className="flex items-center gap-1.5">
                            {preset.isCustom && isAdminOrMod && (
                              <button
                                type="button"
                                title="Delete preset"
                                disabled={isDeleting}
                                onClick={(e) => handleDeletePreset(preset.id, preset.name, e)}
                                className="p-1 rounded text-red-500 hover:bg-red-500/10 transition cursor-pointer border-none bg-transparent"
                              >
                                {isDeleting ? (
                                  <Loader2 size={13} className="animate-spin" />
                                ) : (
                                  <Trash2 size={13} />
                                )}
                              </button>
                            )}

                            <Button
                              size="sm"
                              variant={isSelected ? "outline" : "primary"}
                              disabled={isApplying}
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectPreset(preset);
                              }}
                              className="h-7 px-2.5 text-xs"
                            >
                              {isApplying ? "Applying..." : isSelected ? "Current" : "Use Cover"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
