"use client";

import { X, Award, CheckCircle2, Calculator } from "lucide-react";
import { GradeScale } from "@/lib/api/syllabusCourses";
import { Button } from "@/components/ui/Button";

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
        className="w-full max-w-lg bg-surface-primary border border-black dark:border-border-default rounded-md shadow-[6px_6px_0px_0px_black] dark:shadow-[6px_6px_0px_0px_var(--border-default)] overflow-hidden flex flex-col max-h-[85vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-black dark:border-border-default bg-surface-secondary flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-md bg-accent-primary-light border border-black dark:border-border-default flex items-center justify-center text-accent-primary shadow-[2px_2px_0px_0px_black] dark:shadow-[2px_2px_0px_0px_var(--border-default)]">
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
            className="p-1.5 rounded-md border border-black dark:border-border-default bg-surface-elevated hover:bg-surface-elevated text-text-secondary hover:text-text-primary shadow-[2px_2px_0px_0px_black] dark:shadow-[2px_2px_0px_0px_var(--border-default)] hover:shadow-[2px_2px_0px_0px_var(--accent-primary)] transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto">
          {/* Formula Callout */}
          <div className="p-3 rounded-md bg-surface-elevated border border-black dark:border-border-default flex items-start gap-3 shadow-[2px_2px_0px_0px_black] dark:shadow-[2px_2px_0px_0px_var(--border-default)]">
            <Calculator size={18} className="text-accent-primary shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <span className="font-bold text-text-primary block font-mono">GPA Formula:</span>
              <p className="text-text-secondary">
                GPA = &Sigma; (Course Credit &times; Grade Point) &divide; &Sigma; (Course Credit)
              </p>
            </div>
          </div>

          {/* Scales Table */}
          <div className="border border-black dark:border-border-default rounded-md overflow-hidden shadow-[2px_2px_0px_0px_black] dark:shadow-[2px_2px_0px_0px_var(--border-default)]">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-surface-secondary text-text-secondary font-mono font-bold uppercase text-[11px] border-b border-black dark:border-border-default">
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
          <div className="p-3 rounded-md bg-accent-primary-light dark:bg-accent-primary/10 border border-black dark:border-border-default text-xs text-text-primary flex items-start gap-2.5 shadow-[2px_2px_0px_0px_black] dark:shadow-[2px_2px_0px_0px_var(--border-default)]">
            <CheckCircle2 size={16} className="text-accent-primary shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Passing Grade:</strong> The minimum passing grade is{" "}
              <strong>D (2.00)</strong> with at least 40% marks. Any course with less than
              40% marks is graded <strong>F (0.00)</strong> and must be cleared according to regulations.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-black dark:border-border-default bg-surface-secondary flex justify-end">
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
