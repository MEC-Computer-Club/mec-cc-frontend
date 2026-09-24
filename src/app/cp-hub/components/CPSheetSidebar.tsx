"use client";

import React from "react";
import {
  RATINGS_LIST,
  getRatingColor,
  CPProblem,
} from "@/data/cpSheetProblems";
import { CheckCircle2, Flame } from "lucide-react";

interface CPSheetSidebarProps {
  selectedRating: number;
  onSelectRating: (rating: number) => void;
  solvedMap: Record<string, boolean>;
  problems: CPProblem[];
}

export default function CPSheetSidebar({
  selectedRating,
  onSelectRating,
  solvedMap,
  problems,
}: CPSheetSidebarProps) {
  // Pre-calculate statistics per rating
  const statsByRating = RATINGS_LIST.map((rating) => {
    const problemsForRating = problems.filter((p) => p.rating === rating);
    const total = problemsForRating.length;
    const solved = problemsForRating.filter((p) => solvedMap[p.id]).length;
    const percent = total > 0 ? Math.round((solved / total) * 100) : 0;
    const colorStyle = getRatingColor(rating);

    return {
      rating,
      total,
      solved,
      percent,
      colorStyle,
    };
  });

  return (
    <>
      {/* Mobile Horizontal Rating Tabs (Sticky on small screens) */}
      <div className="md:hidden w-full overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-2 min-w-max">
          {statsByRating.map((stat) => {
            const isSelected = selectedRating === stat.rating;
            const isAllSolved = stat.total > 0 && stat.solved === stat.total;

            return (
              <button
                key={stat.rating}
                onClick={() => onSelectRating(stat.rating)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-bold transition-all border cursor-pointer ${
                  isSelected
                    ? "bg-surface-elevated border-accent-primary text-text-primary shadow-[2px_2px_0px_var(--accent-primary)] -translate-y-0.5"
                    : "bg-surface border-border-default text-text-secondary hover:text-text-primary"
                }`}
              >
                <span className={stat.colorStyle.text}>{stat.rating}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    isAllSolved
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-surface-elevated text-text-tertiary"
                  }`}
                >
                  {stat.solved}/{stat.total}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop Vertical Sidebar */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 space-y-3">
        <div className="p-4 bg-surface-elevated border-2 border-border-brutalist dark:border-border-default rounded-2xl shadow-[4px_4px_0px_var(--accent-primary)]">
          <div className="flex items-center gap-2 mb-1.5">
            <Flame size={20} className="text-accent-primary" />
            <h3 className="font-heading text-base font-bold text-text-primary uppercase tracking-wider">
              Rating Ladders
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            Select a Codeforces rating bracket to practice targeted problems.
          </p>
        </div>

        <nav className="space-y-2" aria-label="Ratings Sidebar">
          {statsByRating.map((stat) => {
            const isSelected = selectedRating === stat.rating;
            const isAllSolved = stat.total > 0 && stat.solved === stat.total;

            return (
              <button
                key={stat.rating}
                onClick={() => onSelectRating(stat.rating)}
                className={`w-full group flex flex-col p-3.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  isSelected
                    ? "bg-surface-elevated border-accent-primary shadow-[4px_4px_0px_var(--accent-primary)] -translate-x-0.5 -translate-y-0.5"
                    : "bg-surface border-border-default hover:bg-surface-elevated hover:border-border-brutalist/50 text-text-secondary"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-mono text-base font-black ${stat.colorStyle.text}`}
                    >
                      ★ {stat.rating}
                    </span>
                    <span className="text-xs uppercase font-bold text-text-tertiary">
                      {stat.colorStyle.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isAllSolved && (
                      <CheckCircle2 size={16} className="text-emerald-400" />
                    )}
                    <span
                      className={`font-mono text-xs sm:text-sm font-bold px-2 py-0.5 rounded ${
                        isAllSolved
                          ? "bg-emerald-500/20 text-emerald-400"
                          : isSelected
                          ? "bg-accent-primary/10 text-accent-primary"
                          : "bg-surface text-text-tertiary"
                      }`}
                    >
                      {stat.solved}/{stat.total}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-surface rounded-full overflow-hidden border border-border-default/60">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isAllSolved
                        ? "bg-emerald-500"
                        : isSelected
                        ? "bg-accent-primary"
                        : "bg-text-tertiary/40"
                    }`}
                    style={{ width: `${stat.percent}%` }}
                  />
                </div>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
