"use client";

import React from "react";
import { useAccent } from "@/components/AccentProvider";
import { VIBE_ORDER, VibeName } from "@/lib/accent-themes";
import { Check, Sparkles } from "lucide-react";

const VIBE_INFO: Record<VibeName, { label: string; color: string }> = {
  lime: { label: "Lime", color: "#84CC16" },
  mint: { label: "Mint", color: "#14B8A6" },
  sky: { label: "Sky", color: "#0EA5E9" },
  amber: { label: "Amber", color: "#F59E0B" },
  rose: { label: "Rose", color: "#F43F5E" },
  violet: { label: "Violet", color: "#8B5CF6" },
  slate: { label: "Slate", color: "#64748B" },
};

interface ThemeColorPickerProps {
  onSelect?: () => void;
  compact?: boolean;
}

export function ThemeColorPicker({ onSelect }: ThemeColorPickerProps) {
  const { currentVibe, setManualVibe, enableAutoMode, isAuto } = useAccent();

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-text-tertiary">
          Theme Color
        </span>
        <button
          type="button"
          onClick={() => {
            enableAutoMode();
            onSelect?.();
          }}
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md font-mono text-[10px] font-bold transition-all cursor-pointer ${
            isAuto
              ? "bg-accent-primary-light dark:bg-accent-primary/20 text-accent-text-on-surface border border-accent-primary/40 font-black shadow-xs"
              : "text-text-tertiary hover:text-accent-primary hover:underline"
          }`}
          title={isAuto ? "Auto rotation active (Click to shuffle)" : "Switch to automatic theme rotation with shuffle"}
        >
          <Sparkles size={11} className={isAuto ? "text-accent-primary" : ""} />
          <span>Auto</span>
          {isAuto && (
            <span className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
          )}
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-start gap-2.5 p-2 bg-surface-secondary rounded-xl border border-border-default">
        {VIBE_ORDER.map((vibe) => {
          const info = VIBE_INFO[vibe];
          const isSelected = currentVibe === vibe;

          return (
            <button
              key={vibe}
              type="button"
              onClick={() => {
                setManualVibe(vibe);
                onSelect?.();
              }}
              title={info.label}
              aria-label={`Select ${info.label} theme`}
              className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center transition-all cursor-pointer border ${
                isSelected
                  ? "ring-2 ring-text-primary ring-offset-2 ring-offset-surface-secondary scale-110 shadow-sm"
                  : "border-black/15 dark:border-white/20 hover:scale-110 opacity-85 hover:opacity-100"
              }`}
              style={{ backgroundColor: info.color }}
            >
              {isSelected && (
                <Check size={11} className="text-white drop-shadow stroke-[3]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
