"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Loader2, Search } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

export interface SuggestionItem {
  id?: string;
  _id?: string;
  primary: string;
  secondary?: string;
  meta?: string;
  raw: any;
}

interface AutoSuggestInputProps {
  value: string;
  onChange: (val: string) => void;
  onSelect: (item: any) => void;
  placeholder?: string;
  searchEndpoint: string; // e.g. "/api/courses/search" or "/api/instructors/search"
  department?: string;
  formatSuggestion: (item: any) => { primary: string; secondary?: string; meta?: string };
  disabled?: boolean;
  className?: string;
  id?: string;
}

export const AutoSuggestInput: React.FC<AutoSuggestInputProps> = ({
  value,
  onChange,
  onSelect,
  placeholder,
  searchEndpoint,
  department = "CSE",
  formatSuggestion,
  disabled = false,
  className = "",
  id,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch suggestions with debounce
  const fetchSuggestions = useCallback(
    async (query: string) => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams();
        if (query.trim()) params.append("q", query.trim());
        if (department) params.append("department", department);

        const url = `${API_BASE_URL}${searchEndpoint}?${params.toString()}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch suggestions");
        const json = await res.json();

        if (json.status === "success" && Array.isArray(json.data)) {
          const formatted: SuggestionItem[] = json.data.map((item: any) => {
            const { primary, secondary, meta } = formatSuggestion(item);
            return {
              id: item._id || item.id,
              primary,
              secondary,
              meta,
              raw: item,
            };
          });
          setSuggestions(formatted);
          setIsOpen(formatted.length > 0);
        } else {
          setSuggestions([]);
          setIsOpen(false);
        }
      } catch (err) {
        console.error("AutoSuggest error:", err);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    },
    [searchEndpoint, department, formatSuggestion]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);
    setHighlightedIndex(-1);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!val.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(val);
    }, 300);
  };

  const handleFocus = () => {
    if (value.trim() && suggestions.length > 0) {
      setIsOpen(true);
    } else if (value.trim()) {
      fetchSuggestions(value);
    }
  };

  const handleSelect = (item: SuggestionItem) => {
    onSelect(item.raw);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === "ArrowDown" && value.trim()) {
        fetchSuggestions(value);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        handleSelect(suggestions[highlightedIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          className={
            className ||
            "w-full px-3 py-2 text-base sm:text-sm bg-surface-primary border border-border-default rounded-md focus:outline-none focus:ring-1 focus:ring-accent-primary focus:border-accent-primary transition-colors text-text-primary placeholder:text-text-muted"
          }
        />
        <div className="absolute right-2.5 flex items-center pointer-events-none text-text-muted">
          {isLoading ? (
            <Loader2 size={15} className="animate-spin text-accent-primary" />
          ) : (
            <Search size={14} className="opacity-40" />
          )}
        </div>
      </div>

      {/* Suggestion Dropdown adhering strictly to Neo-Brutalist Select Guidelines */}
      {isOpen && suggestions.length > 0 && (
        <div
          className="absolute z-50 left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-[var(--surface-primary)] border border-[var(--text-primary)] dark:border-[var(--border-default)] rounded-[var(--radius-md)] shadow-[4px_4px_0px_0px_var(--accent-primary)] overflow-hidden"
          style={{
            boxShadow: "4px 4px 0px 0px var(--accent-primary)",
          }}
        >
          <ul className="m-0 p-0 list-none">
            {suggestions.map((item, idx) => {
              const isHighlighted = idx === highlightedIndex;
              return (
                <li
                  key={item.id || idx}
                  onMouseDown={(e) => {
                    e.preventDefault(); // prevent blur
                    handleSelect(item);
                  }}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  className={`flex items-center justify-between cursor-pointer text-left transition-colors ${
                    idx < suggestions.length - 1 ? "border-b border-[var(--border-default)]" : ""
                  } ${
                    isHighlighted
                      ? "bg-[var(--accent-primary-light)] text-[var(--text-primary)] font-bold dark:bg-[color-mix(in_srgb,var(--accent-primary)_25%,var(--surface-primary))] dark:text-white"
                      : "text-[var(--text-primary)] hover:bg-[var(--accent-primary-light)] dark:hover:bg-[color-mix(in_srgb,var(--accent-primary)_25%,var(--surface-primary))] dark:hover:text-white"
                  }`}
                  style={{
                    padding: "7px 12px",
                  }}
                >
                  <div className="flex flex-col min-w-0 flex-1 pr-2">
                    <span className="text-xs font-semibold truncate leading-snug">{item.primary}</span>
                    {item.secondary && (
                      <span className="text-[11px] opacity-75 truncate leading-tight mt-0.5">
                        {item.secondary}
                      </span>
                    )}
                  </div>
                  {item.meta && (
                    <span className="shrink-0 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[var(--surface-secondary)] border border-[var(--border-default)] text-[var(--text-secondary)]">
                      {item.meta}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};
