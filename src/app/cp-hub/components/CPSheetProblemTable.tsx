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
  onOpenVideo: (problem: CPProblem) => void;
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
    <div className="border-2 border-border-brutalist dark:border-border-default rounded-2xl bg-surface-elevated overflow-hidden shadow-[5px_5px_0px_var(--accent-primary)]">
      {/* Table Header */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-border-default bg-surface/90 text-text-secondary font-mono uppercase tracking-wider text-xs sm:text-sm font-bold">
              <th className="py-3.5 px-3 sm:px-4 w-14 text-center">#</th>
              <th className="py-3.5 px-3 sm:px-4 w-32 text-center">Status</th>
              <th className="py-3.5 px-4 min-w-[240px]">Problem</th>
              <th className="py-3.5 px-4 hidden lg:table-cell">Topics</th>
              <th className="py-3.5 px-4 text-right w-52">Editorial &amp; Solutions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default">
            {problems.map((problem) => {
              const isSolved = Boolean(solvedMap[problem.id]);
              const areTagsVisible = showAllTags || Boolean(revealedRowTags[problem.id]);
              const problemRatingStyle = getRatingColor(problem.rating || selectedRating);

              return (
                <tr
                  key={problem.id}
                  className={`group transition-colors ${
                    isSolved
                      ? "bg-emerald-500/10 hover:bg-emerald-500/15"
                      : "hover:bg-surface/80"
                  }`}
                >
                  {/* Index */}
                  <td className="py-3.5 px-3 sm:px-4 text-center font-mono font-extrabold text-xs sm:text-sm text-text-secondary">
                    {problem.order}
                  </td>

                  {/* Solved Status Toggle */}
                  <td className="py-3.5 px-3 sm:px-4 text-center">
                    <button
                      onClick={() => onToggleSolve(problem.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-xs sm:text-sm font-bold transition-all border cursor-pointer ${
                        isSolved
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50 hover:bg-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.25)]"
                          : "bg-surface text-text-secondary border-border-default hover:border-accent-primary hover:text-text-primary"
                      }`}
                    >
                      {isSolved ? (
                        <>
                          <CheckCircle2 size={15} className="text-emerald-400" />
                          <span>Solved</span>
                        </>
                      ) : (
                        <>
                          <Circle size={15} className="opacity-50" />
                          <span>Todo</span>
                        </>
                      )}
                    </button>
                  </td>

                  {/* Problem Name & Codeforces Link */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span
                        className={`font-mono text-xs sm:text-sm font-black px-2.5 py-1 rounded-md border shrink-0 w-fit shadow-xs ${problemRatingStyle.badge}`}
                      >
                        {problem.id}
                      </span>
                      <a
                        href={problem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`font-bold text-sm sm:text-base text-text-primary hover:text-accent-primary transition-colors flex items-center gap-1.5 ${
                          isSolved ? "line-through opacity-75" : ""
                        }`}
                      >
                        <span>{problem.title}</span>
                        <ExternalLink
                          size={14}
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
                  <td className="py-3.5 px-4 hidden lg:table-cell">
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

                  {/* Action Buttons (Hint, Code, Video) */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5 sm:gap-2">
                      {/* Hint Button */}
                      <button
                        onClick={() => onOpenHint(problem)}
                        title="View Algorithmic Hint"
                        className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-400 font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-2xs"
                      >
                        <Lightbulb size={15} className="text-amber-400" />
                        <span className="hidden sm:inline">Hint</span>
                      </button>

                      {/* Code Solution Button */}
                      <button
                        onClick={() => onOpenCode(problem)}
                        title="View Solution Code (C++)"
                        className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-400 font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-2xs"
                      >
                        <Code2 size={15} className="text-cyan-400" />
                        <span className="hidden sm:inline">Code</span>
                      </button>

                      {/* Video Editorial Button */}
                      <button
                        onClick={() => onOpenVideo(problem)}
                        title="Watch Video Editorial"
                        className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-400 font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-2xs"
                      >
                        <Video size={15} className="text-rose-400" />
                        <span className="hidden sm:inline">Video</span>
                      </button>
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
