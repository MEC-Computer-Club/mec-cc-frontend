"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Move,
  Check,
  RotateCcw,
  Maximize2,
  Calendar,
  MapPin,
  Sparkles,
  ZoomIn,
  ZoomOut,
  Maximize,
} from "lucide-react";
import { parseImagePosition, formatImagePosition } from "@/lib/imagePosition";

interface EventImagePositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  imageTitle: string; // e.g. "Cover Image" or "Banner / Hero Image"
  aspectRatio: "16:9" | "21:9";
  currentPosition?: string; // e.g. "50% 50%" or "50% 50% zoom:-25" or "contain"
  onSavePosition: (position: string) => void;
  eventTitle?: string;
  category?: string;
}

export function EventImagePositionModal({
  isOpen,
  onClose,
  imageUrl,
  imageTitle,
  aspectRatio,
  currentPosition = "50% 50%",
  onSavePosition,
  eventTitle = "Event Title Preview",
  category = "EVENT",
}: EventImagePositionModalProps) {
  const [posX, setPosX] = useState(50);
  const [posY, setPosY] = useState(50);
  const [zoom, setZoom] = useState(0); // -50% to +100%
  const [lockHeight, setLockHeight] = useState(true); // Keeps height 100% full while width shrinks
  const [fitMode, setFitMode] = useState<"cover" | "contain">("cover");
  const [isDragging, setIsDragging] = useState(false);

  const previewBoxRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, posX: 50, posY: 50 });

  useEffect(() => {
    if (isOpen) {
      const parsed = parseImagePosition(currentPosition);
      setPosX(parsed.x);
      setPosY(parsed.y);
      setZoom(parsed.zoom);
      setLockHeight(parsed.lockHeight);
      setFitMode(parsed.isContain ? "contain" : "cover");
    }
  }, [isOpen, currentPosition]);

  // Handle pointer down on the preview canvas
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!imageUrl || fitMode === "contain") return;
    e.preventDefault();
    try {
      (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    } catch {}
    isDraggingRef.current = true;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      posX,
      posY,
    };
  };

  // Handle pointer move during drag
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !previewBoxRef.current || fitMode === "contain") return;
    e.preventDefault();
    const rect = previewBoxRef.current.getBoundingClientRect();
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

    // Moving pointer shifts focal point in opposite direction to reveal edge
    const deltaX = (dx / rect.width) * 100;
    const deltaY = (dy / rect.height) * 100;

    const nextX = Math.min(100, Math.max(0, dragStartRef.current.posX - deltaX));
    const nextY = Math.min(100, Math.max(0, dragStartRef.current.posY - deltaY));

    setPosX(Math.round(nextX));
    setPosY(Math.round(nextY));
  };

  // Handle pointer release
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = false;
    setIsDragging(false);
    try {
      (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  // Handle mouse wheel zoom on preview canvas
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (fitMode === "contain") return;
    e.preventDefault();
    const delta = e.deltaY < 0 ? 5 : -5;
    setZoom((prev) => Math.min(100, Math.max(-50, prev + delta)));
  };

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleApply = () => {
    const finalPos = formatImagePosition(posX, posY, zoom, fitMode === "contain", lockHeight);
    onSavePosition(finalPos);
    onClose();
  };

  if (!isOpen) return null;

  const isCover = aspectRatio === "16:9" || imageTitle.toLowerCase().includes("cover");
  const scale = Math.max(0.3, Math.min(3, 1 + zoom / 100));
  const scaleX = scale;
  const scaleY = lockHeight && zoom <= 0 ? 1 : scale;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100010] flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[640px] bg-surface-elevated border-2 border-border-brutalist dark:border-border-default rounded-2xl shadow-[8px_8px_0px_var(--accent-primary)] p-5 sm:p-6 relative flex flex-col max-h-[94vh] overflow-y-auto animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3 pb-3.5 border-b border-border-default">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Move size={18} />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-text-primary">
                Adjust {imageTitle} Display & Zoom
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">
                {isCover
                  ? "Real Event Card preview. Height stays 100% full while width shrinks inward."
                  : "Wide Banner Hero preview. Align focal point and scale for header."}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="w-8 h-8 rounded-lg border border-border-default bg-surface-secondary text-text-secondary hover:text-text-primary hover:bg-surface-tertiary transition flex items-center justify-center cursor-pointer"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Display Mode Switcher & "Fit Whole Image" Button */}
        <div className="mt-4 flex items-center justify-between gap-2 p-1.5 bg-surface-secondary/80 rounded-xl border border-border-default flex-wrap">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setFitMode("cover")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                fitMode === "cover"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-surface-elevated text-text-secondary hover:text-text-primary border border-border-default"
              }`}
            >
              <Move size={13} />
              <span>Fill & Reposition (Cover)</span>
            </button>
            <button
              type="button"
              onClick={() => setFitMode("contain")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                fitMode === "contain"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-surface-elevated text-text-secondary hover:text-text-primary border border-border-default"
              }`}
            >
              <Maximize2 size={13} />
              <span>Fit Whole Image</span>
            </button>
          </div>

          <div className="text-[11px] font-mono text-text-secondary px-2">
            {fitMode === "contain" ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold inline-flex items-center gap-1">
                <Check size={12} /> Whole image displayed
              </span>
            ) : (
              <span>
                Focal:{" "}
                <strong className="text-indigo-600 dark:text-indigo-400">
                  {posX}% X, {posY}% Y
                </strong>
                {zoom !== 0 && (
                  <span
                    className={`ml-1.5 font-bold ${
                      zoom < 0 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"
                    }`}
                  >
                    ({zoom > 0 ? `+${zoom}%` : `${zoom}%`})
                  </span>
                )}
              </span>
            )}
          </div>
        </div>

        {/* Viewport Frame */}
        <div className="my-4 flex flex-col items-center">
          {isCover ? (
            /* ══════════════════════════════════════════════════════════
               COVER IMAGE: REAL EVENT CARD PREVIEW (h-44 container)
               ══════════════════════════════════════════════════════════ */
            <div className="w-full max-w-[380px] bg-surface-elevated border-2 border-border-brutalist dark:border-border-default rounded-xl overflow-hidden shadow-[6px_6px_0px_var(--accent-primary)] select-none">
              {/* Card Top Header */}
              <div className="flex items-center justify-between px-3.5 py-1.5 border-b border-border-default/60 bg-surface-secondary/40">
                <div className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-mono text-[0.65rem] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    UPCOMING
                  </span>
                </div>
                <div className="font-mono text-[0.65rem] font-bold text-text-secondary bg-surface-secondary py-0.5 px-2 border border-border-brutalist dark:border-border-default rounded uppercase">
                  {category || "EVENT"}
                </div>
              </div>

              {/* Card Cover Image Viewport (Exact h-44 = 176px from Card.tsx) */}
              <div
                ref={previewBoxRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onWheel={handleWheel}
                style={{
                  cursor: fitMode === "cover" ? (isDragging ? "grabbing" : "grab") : "default",
                  touchAction: "none",
                }}
                className="w-full h-44 relative overflow-hidden bg-slate-950 flex items-center justify-center border-b border-border-default group relative"
              >
                {imageUrl ? (
                  <>
                    {/* Subtle blurred backdrop for uncropped contain mode or shrunk width */}
                    {(fitMode === "contain" || zoom < 0) && (
                      <img
                        src={imageUrl}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover blur-md opacity-35 scale-110 pointer-events-none select-none"
                      />
                    )}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageUrl}
                      alt={imageTitle}
                      draggable={false}
                      className={`pointer-events-none select-none max-w-full max-h-full transition-[object-position,transform] duration-75 ${
                        fitMode === "contain"
                          ? "object-contain relative z-10"
                          : "w-full h-full object-cover"
                      }`}
                      style={{
                        objectPosition: fitMode === "contain" ? "center" : `${posX}% ${posY}%`,
                        transform:
                          fitMode === "contain"
                            ? undefined
                            : zoom !== 0
                            ? `scale(${scaleX}, ${scaleY})`
                            : undefined,
                      }}
                    />

                    {/* Composition Grid (Rule of Thirds) when in cover mode */}
                    {fitMode === "cover" && (
                      <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-30 group-hover:opacity-60 transition-opacity z-20">
                        <div className="border-r border-b border-dashed border-white/70" />
                        <div className="border-r border-b border-dashed border-white/70" />
                        <div className="border-b border-dashed border-white/70" />
                        <div className="border-r border-b border-dashed border-white/70" />
                        <div className="border-r border-b border-dashed border-white/70" />
                        <div className="border-b border-dashed border-white/70" />
                        <div className="border-r border-dashed border-white/70" />
                        <div className="border-r border-dashed border-white/70" />
                        <div />
                      </div>
                    )}

                    {/* Mode Tag Badge */}
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/75 backdrop-blur-sm text-white font-mono text-[9px] font-bold pointer-events-none z-20">
                      {fitMode === "contain"
                        ? "WHOLE IMAGE (FIT)"
                        : zoom !== 0
                        ? `WIDTH ${zoom > 0 ? `+${zoom}%` : `${zoom}%`}${lockHeight ? " (FULL HEIGHT)" : ""}`
                        : "CARD VIEW (h-44)"}
                    </div>

                    {/* Drag prompt tooltip */}
                    {fitMode === "cover" && (
                      <div className="absolute bottom-2 px-2.5 py-1 bg-black/75 backdrop-blur-sm text-white text-[10px] font-mono font-bold rounded-full pointer-events-none flex items-center gap-1.5 shadow-sm z-20">
                        <Move size={10} />
                        <span>Drag to reposition • Scroll to zoom</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-xs text-text-tertiary">No image loaded</div>
                )}
              </div>

              {/* Realistic Card Body Mockup */}
              <div className="flex flex-row items-stretch bg-surface-primary dark:bg-transparent">
                <div className="flex flex-col items-center py-3 px-3 min-w-[56px] text-text-primary border-r border-border-default/40">
                  <span className="font-bold text-[10px] tracking-wider leading-tight text-text-secondary">
                    OCT
                  </span>
                  <span className="font-bold text-xl leading-none">28</span>
                </div>
                <div className="flex flex-col p-3 flex-1 gap-1 min-w-0">
                  <div className="font-bold text-sm leading-tight text-text-primary truncate">
                    {eventTitle || "Event Title Preview"}
                  </div>
                  <div className="flex items-center gap-1 font-mono text-[10px] text-text-tertiary uppercase truncate">
                    <MapPin size={10} className="opacity-60 flex-shrink-0" />
                    <span>MEC Campus / Auditorium</span>
                  </div>
                  <div className="flex items-center justify-between mt-1 pt-2 border-t border-border-default/40 text-[10px] font-mono font-bold">
                    <span className="text-text-primary">64 ATTENDING</span>
                    <span className="text-accent-primary">DETAILS →</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ══════════════════════════════════════════════════════════
               BANNER IMAGE: HERO BANNER PREVIEW (aspect-[21/9] container)
               ══════════════════════════════════════════════════════════ */
            <div className="w-full bg-surface-elevated border-2 border-border-brutalist dark:border-border-default rounded-xl overflow-hidden shadow-[6px_6px_0px_var(--accent-primary)] select-none">
              <div
                ref={previewBoxRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onWheel={handleWheel}
                style={{
                  cursor: fitMode === "cover" ? (isDragging ? "grabbing" : "grab") : "default",
                  touchAction: "none",
                }}
                className="w-full aspect-[21/9] max-h-[260px] relative overflow-hidden bg-slate-950 flex items-center justify-center group"
              >
                {imageUrl ? (
                  <>
                    {/* Blurred backdrop for contain mode or shrunk zoom */}
                    {(fitMode === "contain" || zoom < 0) && (
                      <img
                        src={imageUrl}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full object-cover blur-lg opacity-35 scale-110 pointer-events-none select-none"
                      />
                    )}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageUrl}
                      alt={imageTitle}
                      draggable={false}
                      className={`pointer-events-none select-none max-w-full max-h-full transition-[object-position,transform] duration-75 ${
                        fitMode === "contain"
                          ? "object-contain relative z-10"
                          : "w-full h-full object-cover"
                      }`}
                      style={{
                        objectPosition: fitMode === "contain" ? "center" : `${posX}% ${posY}%`,
                        transform:
                          fitMode === "contain"
                            ? undefined
                            : zoom !== 0
                            ? `scale(${scaleX}, ${scaleY})`
                            : undefined,
                      }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/30 pointer-events-none z-15" />

                    {/* Composition Grid (Rule of Thirds) when in cover mode */}
                    {fitMode === "cover" && (
                      <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-30 group-hover:opacity-60 transition-opacity z-20">
                        <div className="border-r border-b border-dashed border-white/70" />
                        <div className="border-r border-b border-dashed border-white/70" />
                        <div className="border-b border-dashed border-white/70" />
                        <div className="border-r border-b border-dashed border-white/70" />
                        <div className="border-r border-b border-dashed border-white/70" />
                        <div className="border-b border-dashed border-white/70" />
                        <div className="border-r border-dashed border-white/70" />
                        <div className="border-r border-dashed border-white/70" />
                        <div />
                      </div>
                    )}

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 pointer-events-none z-20">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-500 text-white shadow">
                        UPCOMING
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-surface-elevated text-text-primary border border-border-default shadow">
                        {category || "WORKSHOP"}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/75 backdrop-blur-sm text-white font-mono text-[9px] font-bold pointer-events-none z-20">
                      {fitMode === "contain"
                        ? "WHOLE BANNER (FIT)"
                        : zoom !== 0
                        ? `WIDTH ${zoom > 0 ? `+${zoom}%` : `${zoom}%`}${lockHeight ? " (FULL HEIGHT)" : ""}`
                        : "21:9 HERO BANNER"}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between pointer-events-none z-20">
                      <div className="text-white drop-shadow max-w-[70%]">
                        <h4 className="font-extrabold text-sm sm:text-base leading-tight truncate">
                          {eventTitle || "Event Banner Hero Title"}
                        </h4>
                        <p className="text-[10px] text-white/80 font-mono mt-0.5">
                          Wide event page header display
                        </p>
                      </div>
                      {fitMode === "cover" && (
                        <div className="px-2.5 py-1 bg-black/80 backdrop-blur-sm text-white text-[10px] font-mono font-bold rounded-full flex items-center gap-1.5 shadow">
                          <Move size={10} />
                          <span>Drag to frame</span>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-xs text-text-tertiary">No banner loaded</div>
                )}
              </div>
            </div>
          )}

          {/* Reset button bar */}
          <div className="flex items-center justify-between w-full mt-2 px-1">
            <span className="text-[11px] font-mono text-text-secondary">
              {fitMode === "contain" ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  ✓ Whole image is preserved without any cropping
                </span>
              ) : (
                <span>
                  Focal:{" "}
                  <strong className="text-indigo-600 dark:text-indigo-400">
                    {posX}% X, {posY}% Y
                  </strong>
                  {" • "}
                  Width:{" "}
                  <strong
                    className={
                      zoom < 0
                        ? "text-amber-600 dark:text-amber-400"
                        : zoom > 0
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-text-primary"
                    }
                  >
                    {Math.round(scaleX * 100)}%
                  </strong>
                  {lockHeight && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold ml-1">
                      (Height: 100% Full)
                    </span>
                  )}
                </span>
              )}
            </span>
            <button
              type="button"
              onClick={() => {
                setFitMode("cover");
                setPosX(50);
                setPosY(50);
                setZoom(0);
                setLockHeight(true);
              }}
              className="text-[11px] text-text-tertiary hover:text-text-primary inline-flex items-center gap-1 cursor-pointer transition"
            >
              <RotateCcw size={11} /> Reset Center & Zoom
            </button>
          </div>
        </div>

        {/* Sliders & Presets (available in Cover mode) */}
        {fitMode === "cover" ? (
          <div className="space-y-3 bg-surface-secondary/70 p-3.5 rounded-xl border border-border-default">
            {/* Horizontal Slider */}
            <div className="grid grid-cols-[90px_1fr_50px] items-center gap-2">
              <label className="text-xs font-bold text-text-secondary">Horizontal (X)</label>
              <input
                type="range"
                min={0}
                max={100}
                value={posX}
                onChange={(e) => setPosX(Number(e.target.value))}
                className="w-full h-1.5 bg-border-default rounded appearance-none cursor-pointer accent-indigo-600"
              />
              <span className="text-xs font-mono font-bold text-text-primary text-right">
                {posX}%
              </span>
            </div>

            {/* Vertical Slider */}
            <div className="grid grid-cols-[90px_1fr_50px] items-center gap-2">
              <label className="text-xs font-bold text-text-secondary">Vertical (Y)</label>
              <input
                type="range"
                min={0}
                max={100}
                value={posY}
                onChange={(e) => setPosY(Number(e.target.value))}
                className="w-full h-1.5 bg-border-default rounded appearance-none cursor-pointer accent-indigo-600"
              />
              <span className="text-xs font-mono font-bold text-text-primary text-right">
                {posY}%
              </span>
            </div>

            {/* Width Shrink & Zoom Slider */}
            <div className="grid grid-cols-[90px_1fr_50px] items-center gap-2 pt-1 border-t border-border-default/60">
              <div className="flex flex-col">
                <label className="text-xs font-bold text-text-secondary flex items-center gap-1">
                  <ZoomIn size={12} className="text-indigo-600 dark:text-indigo-400" />
                  <span>Width Scale</span>
                </label>
                <span className="text-[9px] text-text-tertiary">(-% shrinks width)</span>
              </div>
              <div className="flex items-center gap-2">
                <ZoomOut size={13} className="text-text-tertiary flex-shrink-0" />
                <input
                  type="range"
                  min={-50}
                  max={100}
                  step={1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-1.5 bg-border-default rounded appearance-none cursor-pointer accent-indigo-600"
                />
                <ZoomIn size={13} className="text-text-tertiary flex-shrink-0" />
              </div>
              <span
                className={`text-xs font-mono font-bold text-right ${
                  zoom < 0
                    ? "text-amber-600 dark:text-amber-400"
                    : zoom > 0
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-text-primary"
                }`}
              >
                {zoom > 0 ? `+${zoom}%` : `${zoom}%`}
              </span>
            </div>

            {/* Lock Height Full Toggle Bar */}
            <div className="flex items-center justify-between gap-2 py-1.5 px-2 bg-surface-elevated rounded-lg border border-border-default/80">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-text-primary">Height:</span>
                <span className="text-[11px] text-text-secondary">
                  {lockHeight
                    ? "Locked 100% full (no top/bottom gaps)"
                    : "Proportional zoom"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setLockHeight(!lockHeight)}
                className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border ${
                  lockHeight
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                    : "bg-surface-secondary text-text-secondary hover:text-text-primary border-border-default"
                }`}
              >
                <Check size={12} className={lockHeight ? "opacity-100" : "opacity-0"} />
                <span>Keep Height Full (100%)</span>
              </button>
            </div>

            {/* Quick Zoom Presets */}
            <div className="pt-2 border-t border-border-default flex items-center justify-between flex-wrap gap-2">
              <span className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">
                Width Presets:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { label: "Shrink -40%", val: -40 },
                  { label: "Shrink -20%", val: -20 },
                  { label: "Fit 0%", val: 0 },
                  { label: "Zoom +20%", val: 20 },
                  { label: "Zoom +40%", val: 40 },
                ].map((z) => (
                  <button
                    key={z.label}
                    type="button"
                    onClick={() => setZoom(z.val)}
                    className={`px-2 py-0.5 text-[11px] font-mono font-semibold rounded-md border transition cursor-pointer ${
                      zoom === z.val
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs"
                        : "bg-surface-elevated text-text-secondary border-border-default hover:text-text-primary hover:border-indigo-400"
                    }`}
                  >
                    {z.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Align Presets */}
            <div className="pt-2 border-t border-border-default flex items-center justify-between flex-wrap gap-2">
              <span className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">
                Quick Align:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { label: "Top", x: 50, y: 0 },
                  { label: "Center", x: 50, y: 50 },
                  { label: "Bottom", x: 50, y: 100 },
                  { label: "Left", x: 0, y: 50 },
                  { label: "Right", x: 100, y: 50 },
                ].map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => {
                      setPosX(p.x);
                      setPosY(p.y);
                    }}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md border transition cursor-pointer ${
                      posX === p.x && posY === p.y
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-surface-elevated text-text-primary border-border-default hover:border-indigo-400"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <Sparkles size={16} className="flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>
              <strong>Fit Whole Image enabled:</strong> The complete picture is displayed without
              any edges being cropped out. Letterboxing is styled automatically to fit the container.
            </span>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 mt-5 pt-3.5 border-t border-border-default">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-text-secondary hover:text-text-primary border border-border-default hover:bg-surface-secondary transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-[2px_2px_0px_var(--border-brutalist)] cursor-pointer"
          >
            <Check size={14} />
            <span>Apply Positioning & Scale</span>
          </button>
        </div>
      </div>
    </div>
  );
}
