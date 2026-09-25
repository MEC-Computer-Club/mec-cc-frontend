"use client";

import React, { useState } from "react";
import {
  Trophy,
  RefreshCw,
  Search,
  CheckCircle2,
  Circle,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Eye,
  EyeOff,
} from "lucide-react";
import { CPProblem } from "@/data/cpSheetProblems";

interface CPSheetTopBarProps {
  problems: CPProblem[];
  solvedMap: Record<string, boolean>;
  cfHandle: string;
  setCfHandle: (val: string) => void;
  onSync: () => void;
  isSyncing: boolean;
  lastSyncedAt: string | null;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  statusFilter: "all" | "solved" | "unsolved";
  setStatusFilter: (val: "all" | "solved" | "unsolved") => void;
  onResetProgress: () => void;
  selectedRating: number;
  showAllTags: boolean;
  setShowAllTags: (val: boolean) => void;
}

export default function CPSheetTopBar({
  problems,
  solvedMap,
  cfHandle,
  setCfHandle,
  onSync,
  isSyncing,
  lastSyncedAt,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  onResetProgress,
  selectedRating,
  showAllTags,
  setShowAllTags,
}: CPSheetTopBarProps) {
  const totalCount = problems.length;
  const totalSolved = problems.filter((p) => solvedMap[p.id]).length;
  const overallPercent =
    totalCount > 0 ? Math.round((totalSolved / totalCount) * 100) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSyncing) {
      onSync();
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Banner: Global Stats & Codeforces Auto-Sync */}
      <div className="p-6 md:p-7 bg-surface-elevated border-2 border-border-brutalist dark:border-border-default rounded-2xl shadow-[5px_5px_0px_var(--accent-primary)] space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: Overall Solved Counter */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="p-2 rounded-xl bg-accent-primary/15 text-accent-primary border border-accent-primary/30 shadow-xs">
                <Trophy size={20} />
              </span>
              <h2 className="font-heading text-xl sm:text-2xl font-black text-text-primary tracking-tight">
                CP Practice Sheet
              </h2>
              <span className="font-mono text-xs sm:text-sm px-3 py-1 rounded-full bg-accent-primary/20 text-accent-primary font-black border border-accent-primary/40 shadow-xs">
                Ratings 800 – 1900
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-3.5">
              <div className="text-3xl sm:text-4xl font-black font-mono text-text-primary tracking-tight">
                {totalSolved}{" "}
                <span className="text-base sm:text-lg font-medium text-text-tertiary">
                  / {totalCount} Solved
                </span>
              </div>
              <span className="font-mono text-xs sm:text-sm font-black px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 shadow-xs">
                {overallPercent}% Completed
              </span>
            </div>

            <p className="text-sm text-text-secondary leading-relaxed max-w-2xl">
              Curated Codeforces problems modeled after competitive programming ladders. Track progress, review hints &amp; solutions, or auto-sync your accepted solves.
            </p>
          </div>

          {/* Right: Codeforces Sync Form */}
          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center gap-3 bg-surface p-3.5 rounded-xl border border-border-default shadow-xs">
            <form onSubmit={handleSubmit} className="flex items-center gap-2 flex-1">
              <div className="relative flex-1 min-w-[200px]">
                <input
                  type="text"
                  value={cfHandle}
                  onChange={(e) => setCfHandle(e.target.value)}
                  placeholder="Codeforces handle..."
                  className="w-full px-3.5 py-2.5 text-sm font-mono rounded-lg bg-surface-elevated border border-border-default focus:border-accent-primary focus:outline-none text-text-primary placeholder:text-text-tertiary font-medium"
                />
              </div>
              <button
                type="submit"
                disabled={isSyncing || !cfHandle.trim()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-black bg-accent-primary text-text-primary hover:opacity-95 disabled:opacity-50 transition-all shrink-0 shadow-xs cursor-pointer"
              >
                <RefreshCw
                  size={16}
                  className={isSyncing ? "animate-spin" : ""}
                />
                <span>{isSyncing ? "Syncing..." : "Auto Fetch"}</span>
              </button>
            </form>

            {lastSyncedAt && (
              <span className="text-xs font-mono text-text-tertiary shrink-0 sm:pl-1">
                Last synced: {lastSyncedAt}
              </span>
            )}
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-mono text-text-secondary font-medium">
            <span>Overall Ladder Progress</span>
            <span className="font-bold text-text-primary">
              {totalSolved} of {totalCount} ({overallPercent}%)
            </span>
          </div>
          <div className="w-full h-3 bg-surface-secondary rounded-full overflow-hidden border border-border-default shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-accent-primary via-emerald-400 to-emerald-500 transition-all duration-500 rounded-full"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 bg-surface border border-border-default rounded-xl">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${selectedRating} problems by name, ID (e.g. 1903A), or tag...`}
            className="w-full pl-9 pr-3.5 py-2 text-sm font-mono rounded-lg bg-surface-elevated border border-border-default focus:border-accent-primary focus:outline-none text-text-primary placeholder:text-text-tertiary font-medium"
          />
        </div>

        {/* Status Filters & Options */}
        <div className="flex items-center gap-2.5 flex-wrap justify-between sm:justify-end">
          <div className="flex items-center p-0.5 rounded-lg bg-surface-elevated border border-border-default shadow-xs">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-black transition-colors cursor-pointer ${
                statusFilter === "all"
                  ? "bg-accent-primary text-text-primary shadow-xs"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("unsolved")}
              className={`px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-black transition-colors cursor-pointer ${
                statusFilter === "unsolved"
                  ? "bg-accent-primary text-text-primary shadow-xs"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Unsolved
            </button>
            <button
              onClick={() => setStatusFilter("solved")}
              className={`px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-black transition-colors cursor-pointer ${
                statusFilter === "solved"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Solved
            </button>
          </div>

          {/* Toggle Problem Tags Visibility */}
          <button
            onClick={() => setShowAllTags(!showAllTags)}
            title={showAllTags ? "Hide problem topic tags (prevent spoilers)" : "Show all problem topic tags"}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-bold border transition-colors cursor-pointer ${
              showAllTags
                ? "bg-accent-primary/15 border-accent-primary/40 text-accent-primary"
                : "bg-surface-elevated border-border-default text-text-tertiary hover:text-text-primary"
            }`}
          >
            {showAllTags ? <Eye size={15} /> : <EyeOff size={15} />}
            <span className="hidden sm:inline">
              {showAllTags ? "Tags Shown" : "Tags Hidden"}
            </span>
          </button>

          <button
            onClick={onResetProgress}
            title="Reset All Solved Status"
            className="p-2 rounded-lg text-text-tertiary hover:text-red-500 hover:bg-surface-elevated transition-colors border border-transparent hover:border-border-default cursor-pointer"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
