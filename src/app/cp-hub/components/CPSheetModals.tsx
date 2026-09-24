"use client";

import React, { useState } from "react";
import {
  X,
  Copy,
  Check,
  Lightbulb,
  Code2,
  Video,
  ExternalLink,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import { CPProblem, getRatingColor } from "@/data/cpSheetProblems";

interface HintModalProps {
  problem: CPProblem | null;
  onClose: () => void;
}

export function HintModal({ problem, onClose }: HintModalProps) {
  const [isHintRevealed, setIsHintRevealed] = useState(false);
  const [isTopicsRevealed, setIsTopicsRevealed] = useState(false);

  // Reset revelation state whenever the problem changes
  React.useEffect(() => {
    setIsHintRevealed(false);
    setIsTopicsRevealed(false);
  }, [problem?.id]);

  if (!problem) return null;
  const ratingStyle = getRatingColor(problem.rating);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="hint-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-xl bg-surface-elevated border-2 border-border-brutalist dark:border-border-default rounded-2xl shadow-[6px_6px_0px_var(--accent-primary)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-5 border-b border-border-default bg-surface">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
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
              <h3 id="hint-modal-title" className="text-base sm:text-xl font-bold text-text-primary line-clamp-1 mt-0.5">
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

        {/* Content */}
        <div className="p-5 md:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-400">
              <Sparkles size={16} className="text-amber-400" />
              Algorithmic Intuition &amp; Clue
            </div>

            {isHintRevealed && (
              <button
                onClick={() => setIsHintRevealed(false)}
                className="text-xs font-mono font-medium text-text-secondary hover:text-text-primary flex items-center gap-1 cursor-pointer"
              >
                <EyeOff size={14} /> Hide Hint
              </button>
            )}
          </div>

          {/* Spoiler Protected Hint Card */}
          {!isHintRevealed ? (
            <div className="p-6 text-center rounded-xl bg-surface border-2 border-dashed border-amber-500/30 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/15 text-amber-400 flex items-center justify-center">
                <EyeOff size={22} />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-text-primary uppercase tracking-wider">
                  Hint hidden to prevent spoilers
                </h4>
                <p className="text-xs sm:text-sm text-text-secondary mt-1 max-w-sm mx-auto">
                  Try solving the problem on your own before revealing the hint.
                </p>
              </div>
              <button
                onClick={() => setIsHintRevealed(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/40 text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer"
              >
                <Eye size={16} />
                <span>Reveal Hint</span>
              </button>
            </div>
          ) : (
            <div className="p-4 sm:p-5 rounded-xl bg-surface border border-border-default text-sm sm:text-base text-text-primary leading-relaxed animate-fade-in font-medium">
              {problem.hint ||
                "Think about the constraints and invariants. How does a greedy choice or binary search narrow down the state space?"}
            </div>
          )}

          {/* Associated Topics (Also Spoiler Protected) */}
          {problem.tags && problem.tags.length > 0 && (
            <div className="pt-3 border-t border-border-default/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-text-tertiary">
                  Associated Topics
                </span>
                {isTopicsRevealed && (
                  <button
                    onClick={() => setIsTopicsRevealed(false)}
                    className="text-xs font-mono text-text-secondary hover:text-text-primary flex items-center gap-1 cursor-pointer"
                  >
                    <EyeOff size={13} /> Hide
                  </button>
                )}
              </div>

              {!isTopicsRevealed ? (
                <button
                  onClick={() => setIsTopicsRevealed(true)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-border-default text-xs font-mono font-medium text-text-secondary hover:text-accent-primary transition-colors cursor-pointer"
                >
                  <Eye size={14} />
                  <span>Reveal topics (spoiler)</span>
                </button>
              ) : (
                <div className="flex flex-wrap gap-2 animate-fade-in">
                  {problem.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-xs font-medium px-2.5 py-1 rounded bg-surface border border-border-default text-text-secondary"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-border-default bg-surface/50">
          <a
            href={problem.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-accent-primary hover:underline"
          >
            <span>Open on Codeforces</span>
            <ExternalLink size={15} />
          </a>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs sm:text-sm font-bold rounded-lg bg-surface border border-border-default hover:bg-surface-elevated text-text-primary transition-colors cursor-pointer"
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
  const [copied, setCopied] = useState(false);

  if (!problem) return null;
  const ratingStyle = getRatingColor(problem.rating);
  const code =
    problem.solutionCode?.cpp ||
    `// Solution for ${problem.id} - ${problem.title}\n// Visit: ${problem.url}\n\n#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    // Implementation\n    return 0;\n}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="code-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-2xl bg-surface-elevated border-2 border-border-brutalist dark:border-border-default rounded-2xl shadow-[6px_6px_0px_var(--accent-primary)] overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-5 border-b border-border-default bg-surface">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
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
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold bg-accent-primary text-text-primary hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? "Copied!" : "Copy Code"}</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Close Code Modal"
              className="p-2 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-secondary transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-5 bg-[#0d1117] text-zinc-200 font-mono text-xs sm:text-sm leading-relaxed selection:bg-accent-primary/30">
          <pre className="m-0 whitespace-pre font-mono">
            <code>{code}</code>
          </pre>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-border-default bg-surface">
          <span className="text-xs sm:text-sm text-text-secondary font-mono">
            Language: C++ (GCC 11+)
          </span>
          <a
            href={problem.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-accent-primary hover:underline"
          >
            <span>Submit on Codeforces</span>
            <ExternalLink size={15} />
          </a>
        </div>
      </div>
    </div>
  );
}

interface VideoModalProps {
  problem: CPProblem | null;
  onClose: () => void;
}

export function VideoModal({ problem, onClose }: VideoModalProps) {
  if (!problem) return null;
  const ratingStyle = getRatingColor(problem.rating);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-xl bg-surface-elevated border-2 border-border-brutalist dark:border-border-default rounded-2xl shadow-[6px_6px_0px_var(--accent-primary)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-5 border-b border-border-default bg-surface">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30">
              <Video size={22} />
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
              <h3 id="video-modal-title" className="text-base sm:text-xl font-bold text-text-primary line-clamp-1 mt-0.5">
                {problem.title} — Video Editorial
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Video Modal"
            className="p-2 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-secondary transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Video Body */}
        <div className="p-6 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-inner">
            <Video size={36} />
          </div>

          <div>
            <h4 className="text-base sm:text-lg font-bold text-text-primary mb-1">
              Watch Walkthrough &amp; Video Editorial
            </h4>
            <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
              Step-by-step video analysis for{" "}
              <span className="font-bold text-text-primary">
                {problem.id}: {problem.title}
              </span>{" "}
              explaining edge cases, test inputs, and optimal algorithmic approaches.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={problem.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm sm:text-base shadow-md transition-all hover:scale-[1.02]"
            >
              <Video size={18} />
              <span>Watch on YouTube</span>
              <ExternalLink size={15} />
            </a>
            <a
              href={problem.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-surface border border-border-default hover:bg-surface-elevated text-text-primary font-bold text-sm sm:text-base transition-all"
            >
              <span>View Statement</span>
              <ExternalLink size={15} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
