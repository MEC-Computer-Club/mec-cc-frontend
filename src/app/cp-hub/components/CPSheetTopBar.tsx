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
import { CFUserInfo } from "../services/cfSyncService";

interface CPSheetTopBarProps {
  problems: CPProblem[];
  solvedMap: Record<string, boolean>;
  cfHandle: string;
  totalCfSolved?: number;
  cfUserInfo?: CFUserInfo | null;
  setCfHandle?: (val: string) => void;
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
  totalCfSolved,
  cfUserInfo,
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

  return (
    <div className="space-y-5">
      {/* Top Banner: Global Stats & Codeforces Profile Sync */}
      <div className="p-6 md:p-7 bg-surface-elevated border-2 border-border-brutalist dark:border-border-default rounded-2xl shadow-[5px_5px_0px_var(--accent-primary)] space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: Overall Solved Counter (Self Solve Count) */}
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

            <div className="flex flex-wrap items-center gap-3.5 sm:gap-4">
              <div className="text-3xl sm:text-4xl font-black font-mono text-text-primary tracking-tight">
                {totalSolved}{" "}
                <span className="text-base sm:text-lg font-medium text-text-tertiary">
                  / {totalCount} Sheet Solved
                </span>
              </div>

              {totalCfSolved && totalCfSolved > 0 ? (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface border border-border-default shadow-xs">
                  <span className="text-xs font-mono text-text-tertiary">All-Time CF:</span>
                  <span className="font-mono text-sm sm:text-base font-black text-accent-primary">
                    {totalCfSolved.toLocaleString()} solved
                  </span>
                </div>
              ) : null}

              <span className="font-mono text-xs sm:text-sm font-black px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 shadow-xs">
                {overallPercent}% Completed
              </span>
            </div>

            <p className="text-sm text-text-secondary leading-relaxed max-w-2xl">
              Curated Codeforces problems modeled after competitive programming ladders. Your accepted submissions are automatically tracked and marked.
            </p>
          </div>

          {/* Right: Codeforces Profile & Quick Sync Badge (No manual input) */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-surface p-3.5 sm:px-4 sm:py-3 rounded-xl border border-border-default shadow-xs self-start lg:self-center">
            {cfHandle ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono text-text-tertiary">CF:</span>
                    <a
                      href={`https://codeforces.com/profile/${cfHandle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs sm:text-sm font-bold text-accent-primary hover:underline inline-flex items-center gap-1"
                      title="View Codeforces profile"
                    >
                      @{cfHandle}
                      <ExternalLink size={12} className="opacity-70 shrink-0" />
                    </a>
                  </div>
                  {cfUserInfo?.rating ? (
                    <span className="font-mono text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded-md bg-accent-primary/10 text-accent-primary border border-accent-primary/20">
                      {cfUserInfo.rating} {cfUserInfo.rank ? `(${cfUserInfo.rank})` : ""}
                    </span>
                  ) : null}
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={onSync}
                    disabled={isSyncing}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-accent-primary !text-accent-primary-text hover:bg-accent-primary-hover disabled:opacity-50 transition-all shrink-0 cursor-pointer shadow-xs"
                  >
                    <RefreshCw
                      size={13}
                      className={isSyncing ? "animate-spin shrink-0" : "shrink-0"}
                    />
                    <span>{isSyncing ? "Syncing..." : "Sync CF"}</span>
                  </button>

                  {lastSyncedAt && (
                    <span className="text-[11px] font-mono text-text-tertiary shrink-0">
                      Synced: {lastSyncedAt}
                    </span>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 text-xs font-mono text-text-secondary">
                <span>Link Codeforces handle in your profile to auto-sync</span>
              </div>
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
              className="h-full bg-accent-primary transition-all duration-500 rounded-full"
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
                  ? "bg-accent-primary !text-accent-primary-text shadow-xs"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("unsolved")}
              className={`px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-black transition-colors cursor-pointer ${
                statusFilter === "unsolved"
                  ? "bg-accent-primary !text-accent-primary-text shadow-xs"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Unsolved
            </button>
            <button
              onClick={() => setStatusFilter("solved")}
              className={`px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-black transition-colors cursor-pointer ${
                statusFilter === "solved"
                  ? "bg-accent-primary !text-accent-primary-text shadow-xs"
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
