"use client";

import React, { useState, useRef, useEffect } from "react";
import { Palette } from "lucide-react";
import { ThemeColorPicker } from "./ThemeColorPicker";
import { useAccent } from "./AccentProvider";

export interface ThemePaletteButtonProps {
  className?: string;
}

export function ThemePaletteButton({ className }: ThemePaletteButtonProps = {}) {
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
        title="Customize Theme Color"
        className={
          className ||
          "relative inline-flex items-center justify-center w-9 h-9 rounded-md border border-border-default bg-surface-elevated text-text-secondary shadow-none hover:bg-surface-secondary hover:text-text-primary hover:border-text-primary dark:hover:border-accent-primary hover:shadow-[3px_3px_0px_0px_var(--text-primary)] dark:hover:shadow-[3px_3px_0px_0px_var(--accent-primary)] dark:hover:text-white hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-150 cursor-pointer group flex-shrink-0"
        }
      >
        <Palette size={17} className="group-hover:rotate-12 transition-transform duration-200" />
        {/* Subtle accent color pip */}
        <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-accent-primary border border-surface-elevated transition-colors duration-300" />
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Theme color selector"
          style={{ zIndex: 1000 }}
          className="absolute right-0 top-full mt-2 w-72 p-3 bg-surface-elevated border border-black dark:border-border-default rounded-xl shadow-[4px_4px_0px_var(--accent-primary)] z-[1000] animate-in fade-in zoom-in-95 duration-150"
        >
          <ThemeColorPicker onSelect={() => setIsOpen(false)} />
        </div>
      )}
    </div>
  );
}
