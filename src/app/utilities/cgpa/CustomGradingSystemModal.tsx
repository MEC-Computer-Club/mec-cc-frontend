"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2, Check, RotateCcw, SlidersHorizontal } from "lucide-react";
import { GradeScale, DEFAULT_GRADING_SCALES } from "@/data/syllabusCourses";
import { toast } from "react-hot-toast";

interface CustomGradingSystemModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentScales: GradeScale[];
  onApplyCustomSystem: (scales: GradeScale[]) => void;
}

export function CustomGradingSystemModal({
  isOpen,
  onClose,
  currentScales,
  onApplyCustomSystem,
}: CustomGradingSystemModalProps) {
  const [scales, setScales] = useState<GradeScale[]>([]);

  useEffect(() => {
    if (isOpen) {
      setScales(currentScales?.length > 0 ? [...currentScales] : [...DEFAULT_GRADING_SCALES]);
    }
  }, [isOpen, currentScales]);

  if (!isOpen) return null;

  const handleBracketChange = (
    index: number,
    field: keyof GradeScale,
    val: string | number
  ) => {
    setScales((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: typeof val === "string" ? val : Number(val),
      };
      return updated;
    });
  };

  const handleAddBracket = () => {
    setScales((prev) => [
      ...prev,
      { minMarks: 0, maxMarks: 0, letterGrade: "X", gradePoint: 0.0, remarks: "" },
    ]);
  };

  const handleRemoveBracket = (index: number) => {
    if (scales.length <= 2) {
      toast.error("Grading scale must have at least 2 brackets");
      return;
    }
    setScales((prev) => prev.filter((_, i) => i !== index));
  };

  const handleResetToDefault = () => {
    setScales([...DEFAULT_GRADING_SCALES]);
    toast.success("Reset brackets to official DU Technology Unit scale.");
  };

  const handleApplyLocally = () => {
    // Validate brackets
    for (let i = 0; i < scales.length; i++) {
      const s = scales[i];
      if (!s.letterGrade.trim()) {
        toast.error(`Row ${i + 1}: Letter grade cannot be empty`);
        return;
      }
      if (isNaN(s.gradePoint) || s.gradePoint < 0 || s.gradePoint > 4.0) {
        toast.error(`Row ${i + 1}: Grade point must be between 0.00 and 4.00`);
        return;
      }
    }

    onApplyCustomSystem(scales);
    toast.success("Applied custom scale locally for this session!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 pt-16 sm:pt-20 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
      <div
        className="w-full max-w-xl bg-surface-primary border border-border-brutalist dark:border-border-default rounded-2xl shadow-[6px_6px_0px_var(--border-brutalist)] dark:shadow-[6px_6px_0px_var(--border-default)] overflow-hidden flex flex-col max-h-[85vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-border-brutalist dark:border-border-default bg-surface-secondary/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-accent-primary/10 border border-border-brutalist dark:border-border-default flex items-center justify-center text-accent-primary shadow-[2px_2px_0px_var(--border-brutalist)]">
              <SlidersHorizontal size={18} />
            </div>
            <div>
              <h3 className="font-heading font-black text-base sm:text-lg text-text-primary">
                Apply Different Scale Locally
              </h3>
              <p className="text-xs font-mono text-text-secondary">
                Adjust grade points or letter ranges in memory for your current calculation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-border-default hover:bg-surface-elevated text-text-tertiary hover:text-text-primary transition-colors"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 font-sans">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-text-secondary">
              Grade Point Brackets ({scales.length})
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetToDefault}
                className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-text-secondary hover:text-accent-primary transition-colors"
                title="Reset back to official DU Technology Unit values"
              >
                <RotateCcw size={12} />
                <span>Reset to Default</span>
              </button>
              <button
                type="button"
                onClick={handleAddBracket}
                className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-accent-primary hover:underline transition-colors"
              >
                <Plus size={13} />
                <span>Add Bracket</span>
              </button>
            </div>
          </div>

          <div className="border border-border-default rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-secondary/70 text-text-secondary font-mono font-bold uppercase text-[10px] border-b border-border-default">
                <tr>
                  <th className="py-2 px-2.5">Letter</th>
                  <th className="py-2 px-2.5">Min %</th>
                  <th className="py-2 px-2.5">Max %</th>
                  <th className="py-2 px-2.5">Grade Pt</th>
                  <th className="py-2 px-2 text-center w-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default font-mono">
                {scales.map((s, idx) => (
                  <tr key={idx} className="hover:bg-surface-secondary/30 transition-colors">
                    <td className="py-1.5 px-2">
                      <input
                        type="text"
                        value={s.letterGrade}
                        onChange={(e) =>
                          handleBracketChange(idx, "letterGrade", e.target.value.toUpperCase())
                        }
                        className="w-14 px-2 py-1 text-xs font-bold rounded border border-border-default bg-surface-primary text-text-primary text-center focus:border-accent-primary focus:outline-none"
                        maxLength={3}
                      />
                    </td>
                    <td className="py-1.5 px-2">
                      <input
                        type="number"
                        step="0.01"
                        value={s.minMarks}
                        onChange={(e) =>
                          handleBracketChange(idx, "minMarks", parseFloat(e.target.value) || 0)
                        }
                        className="w-16 px-2 py-1 text-xs rounded border border-border-default bg-surface-primary text-text-primary text-center focus:border-accent-primary focus:outline-none"
                      />
                    </td>
                    <td className="py-1.5 px-2">
                      <input
                        type="number"
                        step="0.01"
                        value={s.maxMarks}
                        onChange={(e) =>
                          handleBracketChange(idx, "maxMarks", parseFloat(e.target.value) || 0)
                        }
                        className="w-16 px-2 py-1 text-xs rounded border border-border-default bg-surface-primary text-text-primary text-center focus:border-accent-primary focus:outline-none"
                      />
                    </td>
                    <td className="py-1.5 px-2">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="4.00"
                        value={s.gradePoint}
                        onChange={(e) =>
                          handleBracketChange(idx, "gradePoint", parseFloat(e.target.value) || 0)
                        }
                        className="w-16 px-2 py-1 text-xs font-bold rounded border border-border-default bg-surface-primary text-accent-primary text-center focus:border-accent-primary focus:outline-none"
                      />
                    </td>
                    <td className="py-1.5 px-2 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveBracket(idx)}
                        disabled={scales.length <= 2}
                        className="p-1 text-text-tertiary hover:text-red-500 disabled:opacity-30 transition-colors"
                        title="Delete bracket"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-[11px] font-mono text-text-muted">
            ℹ️ Changes are stored locally in your current browser session and will immediately recalculate your GPA and CGPA.
          </p>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-border-default bg-surface-secondary/40 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="px-3.5 py-2 rounded-xl border border-border-default bg-surface-primary hover:bg-surface-elevated text-xs font-mono font-bold text-text-secondary hover:text-text-primary transition-all"
          >
            Reset
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border-default bg-surface-primary hover:bg-surface-elevated text-xs font-mono font-bold text-text-secondary hover:text-text-primary transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApplyLocally}
              className="px-4 py-2 rounded-xl bg-accent-primary hover:bg-accent-primary-hover text-white text-xs font-mono font-bold shadow-[2px_2px_0px_var(--border-brutalist)] active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center gap-1.5"
            >
              <Check size={14} />
              <span>Apply Locally</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
