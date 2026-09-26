"use client";

import { X, Award, CheckCircle2, Calculator } from "lucide-react";
import { GradeScale } from "@/data/syllabusCourses";

interface GradingSystemModalProps {
  isOpen: boolean;
  onClose: () => void;
  scales: GradeScale[];
}

export function GradingSystemModal({
  isOpen,
  onClose,
  scales,
}: GradingSystemModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 pt-16 sm:pt-20 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
      <div
        className="w-full max-w-lg bg-surface-primary border border-border-brutalist dark:border-border-default rounded-2xl shadow-[6px_6px_0px_var(--border-brutalist)] dark:shadow-[6px_6px_0px_var(--border-default)] overflow-hidden flex flex-col max-h-[85vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-border-brutalist dark:border-border-default bg-surface-secondary/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-accent-primary/10 border border-border-brutalist dark:border-border-default flex items-center justify-center text-accent-primary shadow-[2px_2px_0px_var(--border-brutalist)]">
              <Award size={18} />
            </div>
            <div>
              <h3 className="font-heading font-black text-base sm:text-lg text-text-primary">
                Official Grading Scale
              </h3>
              <p className="text-xs font-mono text-accent-primary font-bold">
                DU Technology Unit Standard
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
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto">
          {/* Formula Callout */}
          <div className="p-3 rounded-xl bg-surface-elevated border border-border-default flex items-start gap-3">
            <Calculator size={18} className="text-accent-primary shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold text-text-primary block font-mono">GPA Formula:</span>
              <p className="text-text-secondary">
                GPA = &Sigma; (Course Credit &times; Grade Point) &divide; &Sigma; (Course Credit)
              </p>
            </div>
          </div>

          {/* Scales Table */}
          <div className="border border-border-default rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-surface-secondary/60 text-text-secondary font-mono font-bold uppercase text-[11px] border-b border-border-default">
                <tr>
                  <th className="py-2.5 px-3">Marks Range</th>
                  <th className="py-2.5 px-3">Letter Grade</th>
                  <th className="py-2.5 px-3 text-right">Grade Point</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default font-medium">
                {scales.map((s, idx) => {
                  const isTop = s.gradePoint >= 3.75;
                  const isFail = s.gradePoint === 0;

                  return (
                    <tr
                      key={idx}
                      className={
                        isFail
                          ? "bg-red-500/5 text-red-500 font-bold"
                          : isTop
                          ? "bg-accent-primary/5 text-text-primary font-bold"
                          : "text-text-secondary"
                      }
                    >
                      <td className="py-2 px-3 font-mono">
                        {s.minMarks >= 80
                          ? "80% and Above"
                          : s.minMarks === 0
                          ? "Less Than 40%"
                          : `${s.minMarks}% to < ${Math.ceil(s.maxMarks)}%`}
                      </td>
                      <td className="py-2 px-3 font-mono text-sm font-black">
                        {s.letterGrade}
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-bold">
                        {s.gradePoint.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Passing requirements */}
          <div className="p-3 rounded-xl bg-accent-primary-light dark:bg-accent-primary/10 border border-accent-primary/20 text-xs text-text-primary flex items-start gap-2.5">
            <CheckCircle2 size={16} className="text-accent-primary shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Passing Grade:</strong> The minimum passing grade is{" "}
              <strong>D (2.00)</strong> with at least 40% marks. Any course with less than
              40% marks is graded <strong>F (0.00)</strong> and must be cleared according to regulations.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border-default bg-surface-secondary/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-surface-primary border border-border-brutalist dark:border-border-default text-xs font-bold font-mono text-text-primary shadow-[2px_2px_0px_var(--border-brutalist)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
