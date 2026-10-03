"use client";

import React from "react";
import { Search, X } from "lucide-react";

export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  value: string;
  onChangeValue?: (val: string) => void;
  onClear?: () => void;
  sizeVariant?: "sm" | "md";
  containerClassName?: string;
}

/**
 * Canonical Brutalist SearchInput Component
 * Matches the Option Box (Select) styling:
 * - bg-surface-elevated
 * - border border-black dark:border-border-default
 * - rounded-md
 * - shadow-[2px_2px_0px_var(--accent-primary)]
 * - hover:shadow-[3px_3px_0px_var(--accent-primary)] focus:shadow-[3px_3px_0px_var(--accent-primary)]
 */
export function SearchInput({
  value,
  onChange,
  onChangeValue,
  onClear,
  placeholder = "Search...",
  sizeVariant = "md",
  className = "",
  containerClassName = "",
  disabled = false,
  ...props
}: SearchInputProps) {
  const sizeClass = sizeVariant === "sm" ? "h-9 text-xs pl-9 pr-8" : "h-10 text-sm pl-10 pr-9";
  const iconSize = sizeVariant === "sm" ? 15 : 16;

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChangeValue) {
      onChangeValue("");
    }
  };

  return (
    <div className={`relative w-full ${containerClassName}`}>
      <Search
        size={iconSize}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none shrink-0"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange?.(e);
          onChangeValue?.(e.target.value);
        }}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full rounded-md bg-surface-elevated border border-black dark:border-border-default text-text-primary placeholder:text-text-tertiary font-sans font-medium shadow-[2px_2px_0px_0px_black] dark:shadow-[2px_2px_0px_0px_var(--border-default)] hover:shadow-[3px_3px_0px_0px_var(--accent-primary)] focus:shadow-[3px_3px_0px_0px_var(--accent-primary)] focus:outline-none transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed ${sizeClass} ${className}`}
        {...props}
      />
      {value && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary p-1 rounded cursor-pointer transition-colors"
          title="Clear search"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
