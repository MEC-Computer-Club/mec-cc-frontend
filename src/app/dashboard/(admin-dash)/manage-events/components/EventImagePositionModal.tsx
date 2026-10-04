"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Move, Check, RotateCcw } from "lucide-react";
import { parseImagePosition } from "@/lib/imagePosition";

interface EventImagePositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  imageTitle?: string;
  aspectRatio?: "16:9" | "21:9";
  currentPosition?: string;
  onSavePosition: (position: string) => void;
  eventTitle?: string;
  category?: string;
}

export function EventImagePositionModal({
  isOpen,
  onClose,
  imageUrl,
  imageTitle = "Banner Image",
  currentPosition = "50% 50%",
  onSavePosition,
  eventTitle = "Event Title Preview",
  category = "EVENT",
}: EventImagePositionModalProps) {
  const [posX, setPosX] = useState(50);
  const [posY, setPosY] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const previewBoxRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, posX: 50, posY: 50 });

  useEffect(() => {
    if (isOpen) {
      const parsed = parseImagePosition(currentPosition);
      setPosX(parsed.x);
      setPosY(parsed.y);
    }
  }, [isOpen, currentPosition]);

  // Handle pointer down on preview
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!imageUrl) return;
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
    if (!isDraggingRef.current || !previewBoxRef.current) return;
    e.preventDefault();
    const rect = previewBoxRef.current.getBoundingClientRect();
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;

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
    onSavePosition(`${posX}% ${posY}%`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100010] flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[500px] bg-surface-elevated border-2 border-border-brutalist dark:border-border-default rounded-2xl shadow-[6px_6px_0px_var(--accent-primary)] p-3.5 sm:p-4 relative flex flex-col my-auto max-h-[96vh] overflow-y-auto animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-border-default">
          <div className="flex items-center gap-2 min-w-0">
            <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 shrink-0">
              <Move size={15} />
            </span>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-text-primary leading-tight truncate">
                Adjust {imageTitle} Position
              </h2>
              <p className="text-[11px] text-text-secondary leading-tight truncate">
                Drag on the image or use sliders to set the visible focal point.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="w-7 h-7 rounded-lg border border-border-default bg-surface-secondary text-text-secondary hover:text-text-primary hover:bg-surface-tertiary transition flex items-center justify-center cursor-pointer shrink-0"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={14} />
          </button>
        </div>

        {/* Live Preview Viewport */}
        <div className="my-2 flex flex-col items-center">
          <div className="w-full bg-surface-elevated border-2 border-border-brutalist dark:border-border-default rounded-xl overflow-hidden shadow-[3px_3px_0px_var(--accent-primary)] select-none">
            {/* Header pill bar */}
            <div className="flex items-center justify-between px-3 py-1 border-b border-border-default/60 bg-surface-secondary/40 text-[10px]">
              <div className="inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-[0.6rem] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  BANNER &amp; CARD PREVIEW
                </span>
              </div>
              <div className="font-mono text-[0.6rem] font-bold text-text-secondary bg-surface-secondary py-0.5 px-1.5 border border-border-brutalist dark:border-border-default rounded uppercase">
                {category || "EVENT"}
              </div>
            </div>

            {/* Preview Canvas */}
            <div
              ref={previewBoxRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              style={{
                cursor: isDragging ? "grabbing" : "grab",
                touchAction: "none",
              }}
              className="w-full aspect-[16/9] max-h-[220px] relative overflow-hidden bg-slate-950 flex items-center justify-center group"
            >
              {imageUrl ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt={imageTitle}
                    draggable={false}
                    className="w-full h-full object-cover pointer-events-none select-none transition-[object-position] duration-75"
                    style={{
                      objectPosition: `${posX}% ${posY}%`,
                    }}
                  />

                  {/* Composition Grid (Rule of Thirds) */}
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

                  {/* Drag prompt badge */}
                  <div className="absolute bottom-2 px-2.5 py-0.5 bg-black/75 backdrop-blur-sm text-white text-[9px] font-mono font-bold rounded-full pointer-events-none flex items-center gap-1 shadow-sm z-20">
                    <Move size={9} />
                    <span>Drag to reposition focal point</span>
                  </div>
                </>
              ) : (
                <div className="text-xs text-text-tertiary">No image loaded</div>
              )}
            </div>

            {/* Bottom info preview row */}
            <div className="flex items-center justify-between py-1.5 px-3 bg-surface-primary dark:bg-transparent text-xs border-t border-border-default/40 gap-2">
              <span className="font-bold text-xs text-text-primary truncate">
                {eventTitle || "Event Title Preview"}
              </span>
              <span className="text-[10px] font-mono font-bold text-accent-primary shrink-0">
                Focal: {posX}% X, {posY}% Y
              </span>
            </div>
          </div>

          {/* Quick info & Reset */}
          <div className="flex items-center justify-between w-full mt-1.5 px-1">
            <span className="text-[10px] font-mono text-text-secondary">
              Position: <strong className="text-indigo-600 dark:text-indigo-400">{posX}% X, {posY}% Y</strong>
            </span>
            <button
              type="button"
              onClick={() => {
                setPosX(50);
                setPosY(50);
              }}
              className="text-[10px] text-text-tertiary hover:text-text-primary inline-flex items-center gap-1 cursor-pointer transition font-mono"
            >
              <RotateCcw size={10} /> Reset Center (50% 50%)
            </button>
          </div>
        </div>

        {/* Sliders & Presets Controls */}
        <div className="bg-surface-secondary/70 p-2.5 rounded-xl border border-border-default space-y-2 mt-1">
          {/* Row 1: Horizontal (X) and Vertical (Y) side-by-side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Horizontal (X) */}
            <div className="flex items-center gap-2 bg-surface-elevated px-2 py-1.5 rounded-lg border border-border-default">
              <span className="text-[11px] font-bold text-text-secondary w-14 shrink-0">X (Pos):</span>
              <input
                type="range"
                min={0}
                max={100}
                value={posX}
                onChange={(e) => setPosX(Number(e.target.value))}
                className="w-full h-1.5 bg-border-default rounded appearance-none cursor-pointer accent-indigo-600 min-w-0"
              />
              <span className="text-[11px] font-mono font-bold text-text-primary w-8 text-right shrink-0">
                {posX}%
              </span>
            </div>

            {/* Vertical (Y) */}
            <div className="flex items-center gap-2 bg-surface-elevated px-2 py-1.5 rounded-lg border border-border-default">
              <span className="text-[11px] font-bold text-text-secondary w-14 shrink-0">Y (Pos):</span>
              <input
                type="range"
                min={0}
                max={100}
                value={posY}
                onChange={(e) => setPosY(Number(e.target.value))}
                className="w-full h-1.5 bg-border-default rounded appearance-none cursor-pointer accent-indigo-600 min-w-0"
              />
              <span className="text-[11px] font-mono font-bold text-text-primary w-8 text-right shrink-0">
                {posY}%
              </span>
            </div>
          </div>

          {/* Row 2: Alignment Presets */}
          <div className="flex items-center justify-between gap-1 flex-wrap pt-1 border-t border-border-default/50 text-[10px]">
            <span className="font-bold text-text-tertiary uppercase text-[9px]">Align:</span>
            <div className="flex items-center gap-1">
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
                  className={`px-2 py-0.5 font-semibold rounded border transition cursor-pointer ${
                    posX === p.x && posY === p.y
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs"
                      : "bg-surface-elevated text-text-secondary border-border-default hover:border-indigo-400"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2 mt-2.5 pt-2 border-t border-border-default">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-text-secondary hover:text-text-primary border border-border-default hover:bg-surface-secondary transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-[2px_2px_0px_var(--border-brutalist)] cursor-pointer"
          >
            <Check size={13} />
            <span>Apply Position</span>
          </button>
        </div>
      </div>
    </div>
  );
}
