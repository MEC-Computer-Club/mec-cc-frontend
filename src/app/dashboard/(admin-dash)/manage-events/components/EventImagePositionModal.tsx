"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { X, Move, Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface EventImagePositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string | null;
  imageTitle: string; // e.g. "Cover Image" or "Banner / Hero Image"
  aspectRatio: "16:9" | "21:9";
  currentPosition?: string; // e.g. "50% 50%"
  onSavePosition: (position: string) => void;
}

export function EventImagePositionModal({
  isOpen,
  onClose,
  imageUrl,
  imageTitle,
  aspectRatio,
  currentPosition = "50% 50%",
  onSavePosition,
}: EventImagePositionModalProps) {
  // Parse initial position
  const parsePos = useCallback((posStr?: string) => {
    if (!posStr) return { x: 50, y: 50 };
    const parts = posStr.trim().split(/\s+/);
    const x = parseFloat(parts[0]) || 50;
    const y = parseFloat(parts[1] || parts[0]) || 50;
    return {
      x: Math.min(100, Math.max(0, x)),
      y: Math.min(100, Math.max(0, y)),
    };
  }, []);

  const [posX, setPosX] = useState(50);
  const [posY, setPosY] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const previewBoxRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, posX: 50, posY: 50 });

  useEffect(() => {
    if (isOpen) {
      const { x, y } = parsePos(currentPosition);
      setPosX(x);
      setPosY(y);
    }
  }, [isOpen, currentPosition, parsePos]);

  // Handle pointer down on the preview canvas
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

    // Moving pointer right/down shifts the view to reveal right/bottom (increases percentage)
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
    const finalPos = `${posX}% ${posY}%`;
    onSavePosition(finalPos);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[100010] flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[620px] bg-surface-elevated border-2 border-border-brutalist dark:border-border-default rounded-2xl shadow-[8px_8px_0px_var(--accent-primary)] p-5 sm:p-6 relative flex flex-col max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-150"
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
                Adjust {imageTitle} Positioning
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">
                Drag on the image or adjust sliders to frame the focal point.
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

        {/* Viewport Frame */}
        <div className="my-4 flex flex-col items-center">
          <div
            ref={previewBoxRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            style={{
              cursor: imageUrl ? (isDragging ? "grabbing" : "grab") : "default",
              touchAction: "none",
            }}
            className={`w-full ${
              aspectRatio === "21:9" ? "aspect-[21/9]" : "aspect-[16/9]"
            } max-h-[300px] rounded-xl border-2 border-border-brutalist dark:border-border-default overflow-hidden relative select-none bg-surface-secondary flex items-center justify-center shadow-inner group`}
          >
            {imageUrl ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt={imageTitle}
                  draggable={false}
                  className="pointer-events-none select-none w-full h-full object-cover transition-[object-position] duration-75"
                  style={{
                    objectPosition: `${posX}% ${posY}%`,
                  }}
                />

                {/* Composition Grid Overlay (Rule of Thirds) */}
                <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-30 group-hover:opacity-60 transition-opacity">
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

                {/* Aspect Ratio Badge */}
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-white font-mono text-[10px] font-bold pointer-events-none">
                  {aspectRatio === "21:9" ? "21:9 Hero Banner" : "16:9 Event Card"}
                </div>

                {/* Drag Prompt Tooltip */}
                <div className="absolute bottom-2.5 px-2.5 py-1 bg-black/75 backdrop-blur-sm text-white text-[11px] font-mono font-bold rounded-full pointer-events-none flex items-center gap-1.5 shadow-sm">
                  <Move size={11} />
                  <span>Drag image to reposition</span>
                </div>
              </>
            ) : (
              <div className="text-xs text-text-tertiary">No image loaded</div>
            )}
          </div>

          <div className="flex items-center justify-between w-full mt-2 px-1">
            <span className="text-[11px] font-mono font-bold text-text-secondary">
              Focal Point: <strong className="text-indigo-600 dark:text-indigo-400">{posX}% X, {posY}% Y</strong>
            </span>
            <button
              type="button"
              onClick={() => {
                setPosX(50);
                setPosY(50);
              }}
              className="text-[11px] text-text-tertiary hover:text-text-primary inline-flex items-center gap-1 cursor-pointer transition"
            >
              <RotateCcw size={11} /> Reset Center
            </button>
          </div>
        </div>

        {/* Sliders & Presets */}
        <div className="space-y-3 bg-surface-secondary/70 p-3.5 rounded-xl border border-border-default">
          {/* Horizontal Slider */}
          <div className="grid grid-cols-[85px_1fr_45px] items-center gap-2">
            <label className="text-xs font-bold text-text-secondary">Horizontal (X)</label>
            <input
              type="range"
              min={0}
              max={100}
              value={posX}
              onChange={(e) => setPosX(Number(e.target.value))}
              className="w-full h-1.5 bg-border-default rounded appearance-none cursor-pointer accent-indigo-600"
            />
            <span className="text-xs font-mono font-bold text-text-primary text-right">{posX}%</span>
          </div>

          {/* Vertical Slider */}
          <div className="grid grid-cols-[85px_1fr_45px] items-center gap-2">
            <label className="text-xs font-bold text-text-secondary">Vertical (Y)</label>
            <input
              type="range"
              min={0}
              max={100}
              value={posY}
              onChange={(e) => setPosY(Number(e.target.value))}
              className="w-full h-1.5 bg-border-default rounded appearance-none cursor-pointer accent-indigo-600"
            />
            <span className="text-xs font-mono font-bold text-text-primary text-right">{posY}%</span>
          </div>

          {/* Quick Presets */}
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
            <span>Apply Positioning</span>
          </button>
        </div>
      </div>
    </div>
  );
}
