"use client";

import React, { useState, useRef, useEffect } from "react";
import { Palette } from "lucide-react";
import { ThemeColorPicker } from "./ThemeColorPicker";
import { useAccent } from "./AccentProvider";

export function ThemePaletteButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentVibe } = useAccent();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Customize theme accent color"
        title="Theme Accent Color"
        className="btn btn--ghost btn--md relative"
        style={{ padding: "var(--space-2)" }}
      >
        <Palette size={19} />
        {/* Subtle accent color pip */}
        <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-accent-primary border border-surface-elevated transition-colors duration-300" />
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Theme color selector"
          className="absolute right-0 top-full mt-2 w-72 p-3 bg-surface-elevated border-2 border-border-brutalist dark:border-border-default rounded-2xl shadow-[4px_4px_0px_var(--border-brutalist)] z-[100] animate-in fade-in zoom-in-95 duration-150"
        >
          <ThemeColorPicker onSelect={() => setIsOpen(false)} />
        </div>
      )}
    </div>
  );
}
