"use client";

import React from "react";
import {
  CheckCircle2,
  Circle,
  Lightbulb,
  Code2,
  Video,
  ExternalLink,
  Eye,
  EyeOff,
} from "lucide-react";
import { CPProblem, getRatingColor } from "@/data/cpSheetProblems";

interface CPSheetProblemTableProps {
  problems: CPProblem[];
  solvedMap: Record<string, boolean>;
  onToggleSolve: (problemId: string) => void;
  onOpenHint: (problem: CPProblem) => void;
  onOpenCode: (problem: CPProblem) => void;
  onOpenVideo?: (problem: CPProblem) => void;
  selectedRating: number;
  showAllTags?: boolean;
}

export default function CPSheetProblemTable({
  problems,
  solvedMap,
  onToggleSolve,
  onOpenHint,
  onOpenCode,
  onOpenVideo,
  selectedRating,
  showAllTags = false,
}: CPSheetProblemTableProps) {
  const ratingStyle = getRatingColor(selectedRating);
  const [revealedRowTags, setRevealedRowTags] = React.useState<Record<string, boolean>>({});

  const toggleRowTags = (problemId: string) => {
    setRevealedRowTags((prev) => ({
      ...prev,
      [problemId]: !prev[problemId],
    }));
  };

  if (problems.length === 0) {
    return (
      <div className="p-12 text-center bg-surface border-2 border-dashed border-border-default rounded-2xl space-y-3">
        <Code2 className="w-12 h-12 mx-auto text-text-tertiary opacity-60" />
        <h4 className="text-lg font-bold text-text-primary">
          No problems found
        </h4>
        <p className="text-sm text-text-secondary max-w-sm mx-auto">
          No problems match your current search query or status filter for rating {selectedRating}.
        </p>
      </div>
    );
  }

  return (
    <div className="border-2 border-border-brutalist dark:border-border-default rounded-xl sm:rounded-2xl bg-surface-elevated overflow-hidden shadow-[3px_3px_0px_var(--accent-primary)] sm:shadow-[5px_5px_0px_var(--accent-primary)]">
      {/* Table Header */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-border-default bg-surface/90 text-text-secondary font-mono uppercase tracking-wider text-xs sm:text-sm font-bold">
              <th className="py-3 px-1.5 sm:px-3 w-8 sm:w-12 text-center">#</th>
              <th className="py-3 px-1.5 sm:px-3 w-20 sm:w-28 text-center">Status</th>
              <th className="py-3 px-2 sm:px-4 min-w-[160px] sm:min-w-[240px]">Problem</th>
              <th className="py-3 px-4 hidden lg:table-cell">Topics</th>
              <th className="py-3 px-2 sm:px-5 text-right w-28 sm:w-44">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default">
            {problems.map((problem) => {
              const isSolved = Boolean(solvedMap[problem.id]);
              const areTagsVisible = showAllTags || Boolean(revealedRowTags[problem.id]);
              const problemRatingStyle = getRatingColor(problem.rating || selectedRating);

              return (
                <tr
                  key={`${selectedRating}-${problem.id}-${problem.order}`}
                  className={`group transition-colors ${isSolved
                      ? "bg-emerald-500/10 hover:bg-emerald-500/15"
                      : "hover:bg-surface/80"
                    }`}
                >
                  {/* Index */}
                  <td className="py-3 px-1.5 sm:px-3 text-center font-mono font-extrabold text-xs sm:text-sm text-text-secondary">
                    {problem.order}
                  </td>

                  {/* Solved Status Toggle */}
                  <td className="py-3 px-1.5 sm:px-3 text-center">
                    <button
                      onClick={() => onToggleSolve(problem.id)}
                      className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-mono text-[11px] sm:text-xs font-bold transition-all border cursor-pointer ${isSolved
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50 hover:bg-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.25)]"
                          : "bg-surface text-text-secondary border-border-default hover:border-accent-primary hover:text-text-primary"
                        }`}
                    >
                      {isSolved ? (
                        <>
                          <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                          <span>Solved</span>
                        </>
                      ) : (
                        <>
                          <Circle size={14} className="opacity-50 shrink-0" />
                          <span>Todo</span>
                        </>
                      )}
                    </button>
                  </td>

                  {/* Problem Name & Codeforces Link */}
                  <td className="py-3 px-2 sm:px-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2">
                      <span
                        className={`font-mono text-[11px] sm:text-xs font-black px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border shrink-0 w-fit shadow-xs ${problemRatingStyle.badge}`}
                      >
                        {problem.id}
                      </span>
                      <a
                        href={problem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`font-bold text-xs sm:text-sm md:text-base text-text-primary hover:text-accent-primary transition-colors flex items-center gap-1.5 break-words ${isSolved ? "line-through opacity-75" : ""
                          }`}
                      >
                        <span>{problem.title}</span>
                        <ExternalLink
                          size={13}
                          className="opacity-50 group-hover:opacity-100 transition-opacity shrink-0"
                        />
                      </a>
                    </div>

                    {/* Mobile Topics Display */}
                    <div className="mt-1.5 lg:hidden">
                      {areTagsVisible ? (
                        <div className="flex flex-wrap items-center gap-1.5 animate-fade-in">
                          {problem.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs font-mono px-2 py-0.5 rounded bg-surface border border-border-default text-text-secondary"
                            >
                              #{tag}
                            </span>
                          ))}
                          {!showAllTags && (
                            <button
                              onClick={() => toggleRowTags(problem.id)}
                              className="text-xs text-text-tertiary hover:text-text-primary ml-1 cursor-pointer"
                              title="Hide tags"
                            >
                              <EyeOff size={12} />
                            </button>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => toggleRowTags(problem.id)}
                          className="text-xs font-mono font-medium text-text-secondary hover:text-accent-primary inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye size={12} />
                          <span>Show tags</span>
                        </button>
                      )}
                    </div>
                  </td>

                  {/* Topics (Desktop) */}
                  <td className="py-3 px-4 hidden lg:table-cell">
                    {areTagsVisible ? (
                      <div className="flex flex-wrap items-center gap-1.5 max-w-sm animate-fade-in">
                        {problem.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-surface border border-border-default text-text-secondary"
                          >
                            #{tag}
                          </span>
                        ))}
                        {!showAllTags && (
                          <button
                            onClick={() => toggleRowTags(problem.id)}
                            className="p-1 text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
                            title="Hide tags for this problem"
                          >
                            <EyeOff size={13} />
                          </button>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => toggleRowTags(problem.id)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold text-text-secondary hover:text-accent-primary bg-surface/80 hover:bg-surface border border-dashed border-border-default transition-colors cursor-pointer"
                        title="Reveal topic tags (spoiler)"
                      >
                        <Eye size={13} />
                        <span>Reveal tags</span>
                      </button>
                    )}
                  </td>

                  {/* Action Buttons (Logo Only: Hint, Code, Video with Tooltips) */}
                  <td className="py-3 px-2 sm:px-5 text-right">
                    <div className="inline-flex items-center justify-end gap-1.5 sm:gap-2">
                      {/* Hint Button */}
                      <div className="relative group/hint inline-flex justify-center">
                        <button
                          type="button"
                          onClick={() => onOpenHint(problem)}
                          aria-label="View Hint"
                          className="p-1.5 sm:p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-500 dark:text-amber-400 transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 inline-flex items-center justify-center"
                        >
                          <Lightbulb size={16} />
                        </button>
                        <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 hidden sm:flex opacity-0 group-hover/hint:opacity-100 transition-opacity duration-150 flex-col items-center">
                          <span className="px-2.5 py-1 rounded-md bg-zinc-900 dark:bg-zinc-800 text-zinc-100 text-[11px] font-mono font-bold shadow-xl whitespace-nowrap border border-zinc-700">
                            View Hint
                          </span>
                          <span className="w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-zinc-900 dark:border-t-zinc-800" />
                        </div>
                      </div>

                      {/* Code Solution Button */}
                      <div className="relative group/code inline-flex justify-center">
                        <button
                          type="button"
                          onClick={() => onOpenCode(problem)}
                          aria-label="View Solution Code (C++)"
                          className="p-1.5 sm:p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-500 dark:text-cyan-400 transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 inline-flex items-center justify-center"
                        >
                          <Code2 size={16} />
                        </button>
                        <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 hidden sm:flex opacity-0 group-hover/code:opacity-100 transition-opacity duration-150 flex-col items-center">
                          <span className="px-2.5 py-1 rounded-md bg-zinc-900 dark:bg-zinc-800 text-zinc-100 text-[11px] font-mono font-bold shadow-xl whitespace-nowrap border border-zinc-700">
                            View Solution (C++)
                          </span>
                          <span className="w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-zinc-900 dark:border-t-zinc-800" />
                        </div>
                      </div>

                      {/* Video Editorial Button - Directly Redirects to YouTube */}
                      <div className="relative group/video inline-flex justify-center">
                        <a
                          href={problem.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Video Editorial (YouTube)"
                          className="p-1.5 sm:p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-500 dark:text-rose-400 transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 inline-flex items-center justify-center"
                        >
                          <Video size={16} />
                        </a>
                        <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 hidden sm:flex opacity-0 group-hover/video:opacity-100 transition-opacity duration-150 flex-col items-center">
                          <span className="px-2.5 py-1 rounded-md bg-zinc-900 dark:bg-zinc-800 text-zinc-100 text-[11px] font-mono font-bold shadow-xl whitespace-nowrap border border-zinc-700">
                            Video
                          </span>
                          <span className="w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-zinc-900 dark:border-t-zinc-800" />
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
