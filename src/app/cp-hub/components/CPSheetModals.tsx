"use client";

import React from "react";
import {
  X,
  Lightbulb,
  Code2,
  Sparkles,
} from "lucide-react";
import { CPProblem, getRatingColor } from "@/data/cpSheetProblems";
import MonokaiCodeViewer from "./MonokaiCodeViewer";

interface HintModalProps {
  problem: CPProblem | null;
  onClose: () => void;
}

export function HintModal({ problem, onClose }: HintModalProps) {
  if (!problem) return null;
  const ratingStyle = getRatingColor(problem.rating);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="hint-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-lg bg-surface-elevated border-2 border-border-brutalist dark:border-border-default rounded-2xl shadow-[6px_6px_0px_var(--accent-primary)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-5 border-b border-border-default bg-surface">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-500 dark:text-amber-400 border border-amber-500/30">
              <Lightbulb size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded border ${ratingStyle.badge}`}
                >
                  {problem.rating}
                </span>
                <span className="font-mono text-sm font-bold text-text-secondary">
                  {problem.id}
                </span>
              </div>
              <h3 id="hint-modal-title" className="text-base sm:text-lg font-bold text-text-primary line-clamp-1 mt-0.5">
                {problem.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Hint Modal"
            className="p-2 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-secondary transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Direct Hint Content - No Spoiler Barrier, No Redundant Links */}
        <div className="p-5 md:p-6 space-y-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            <Sparkles size={16} />
            Algorithmic Intuition &amp; Clue
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-surface border border-border-default text-sm sm:text-base text-text-primary leading-relaxed font-medium">
            {problem.hint ||
              "Think about the constraints and invariants. How does a greedy choice or binary search narrow down the state space?"}
          </div>
        </div>

        {/* Clean Footer */}
        <div className="flex items-center justify-end p-4 border-t border-border-default bg-surface">
          <button
            onClick={onClose}
            className="px-6 py-2 text-xs sm:text-sm font-bold rounded-lg bg-accent-primary text-text-primary hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

interface CodeModalProps {
  problem: CPProblem | null;
  onClose: () => void;
}

export function CodeModal({ problem, onClose }: CodeModalProps) {
  if (!problem) return null;
  const ratingStyle = getRatingColor(problem.rating);
  const code =
    problem.solutionCode?.cpp ||
    `// Solution for ${problem.id} - ${problem.title}\n// Visit: ${problem.url}\n\n#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    // Implementation\n    return 0;\n}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="code-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-4xl bg-surface-elevated border-2 border-border-brutalist dark:border-border-default rounded-2xl shadow-[6px_6px_0px_var(--accent-primary)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-5 border-b border-border-default bg-surface">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-500 dark:text-cyan-400 border border-cyan-500/30">
              <Code2 size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded border ${ratingStyle.badge}`}
                >
                  {problem.rating}
                </span>
                <span className="font-mono text-sm font-bold text-text-secondary">
                  {problem.id}
                </span>
              </div>
              <h3 id="code-modal-title" className="text-base sm:text-xl font-bold text-text-primary line-clamp-1 mt-0.5">
                {problem.title} (C++)
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Code Modal"
            className="p-2 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-secondary transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Monokai Theme Syntax Highlighted Editor */}
        <div className="flex-1 overflow-hidden p-3 sm:p-4 bg-[#1e1f1c]">
          <MonokaiCodeViewer
            code={code}
            problemId={problem.id}
            language="C++ (GCC 11+)"
          />
        </div>
      </div>
    </div>
  );
}

interface VideoModalProps {
  problem: CPProblem | null;
  onClose: () => void;
}

// Kept for backward compatibility if imported elsewhere, but video redirects directly
export function VideoModal({ problem }: VideoModalProps) {
  if (!problem) return null;
  return null;
}
