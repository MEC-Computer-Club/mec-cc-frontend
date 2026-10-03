"use client";

import { useState, useEffect, useMemo } from "react";
import { Sparkles, X, BookOpen, GraduationCap, Calendar, Layers, Loader2 } from "lucide-react";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { InstituteSelector } from "./InstituteSelector";
import { getAvailableDepartmentsForCollege } from "@/lib/api/syllabusCourses";

interface QuickFillModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentInstitute: string;
  currentDepartment: string;
  currentSession: string;
  currentSemester: string;
  availableSessions?: string[];
  onApply: (params: {
    institute: string;
    department: string;
    session: string;
    semester: string;
  }) => Promise<void>;
}

const SEMESTERS = [
  { value: "1", label: "1st Semester (1st Year 1st Sem)" },
  { value: "2", label: "2nd Semester (1st Year 2nd Sem)" },
  { value: "3", label: "3rd Semester (2nd Year 1st Sem)" },
  { value: "4", label: "4th Semester (2nd Year 2nd Sem)" },
  { value: "5", label: "5th Semester (3rd Year 1st Sem)" },
  { value: "6", label: "6th Semester (3rd Year 2nd Sem)" },
  { value: "7", label: "7th Semester (4th Year 1st Sem)" },
  { value: "8", label: "8th Semester (4th Year 2nd Sem)" },
];

export function QuickFillModal({
  isOpen,
  onClose,
  currentInstitute,
  currentDepartment,
  currentSession,
  currentSemester,
  availableSessions = ["2021-22"],
  onApply,
}: QuickFillModalProps) {
  const [institute, setInstitute] = useState<string>(currentInstitute);
  const [department, setDepartment] = useState<string>(currentDepartment);
  const [sessionsList, setSessionsList] = useState<string[]>(availableSessions);
  const [session, setSession] = useState<string>(currentSession || "2021-22");
  const [semester, setSemester] = useState<string>(currentSemester);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      setInstitute(currentInstitute || "Mymensingh Engineering College");
    }
  }, [isOpen, currentInstitute]);

  // Dynamically filter departments based on the chosen college
  const availableDepartments = useMemo(() => {
    return getAvailableDepartmentsForCollege(institute);
  }, [institute]);

  // Auto-switch department if current department is not offered at the selected college
  useEffect(() => {
    if (!availableDepartments.some((d) => d.value === department)) {
      if (availableDepartments.length > 0) {
        setDepartment(availableDepartments[0].value);
      }
    }
  }, [availableDepartments, department]);

  // Fetch available sessions dynamically where changes/courses exist
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/courses/sessions?department=${department}`)
      .then((r) => r.json())
      .then((res) => {
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          setSessionsList(res.data);
          if (!res.data.includes(session)) {
            setSession(res.data[0]);
          }
        }
      })
      .catch(() => {});
  }, [department]);

  const sessionOptions = useMemo(() => {
    return sessionsList.map((s) => ({
      value: s,
      label: s === "default" ? "Default / Baseline Syllabus" : `Session ${s}`,
    }));
  }, [sessionsList]);

  if (!isOpen) return null;

  const handleApply = async () => {
    setSubmitting(true);
    try {
      await onApply({
        institute: institute.trim() || "Mymensingh Engineering College",
        department,
        session,
        semester,
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4 pt-16 sm:pt-20 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div
        className="w-full max-w-lg bg-surface-primary border border-black dark:border-border-default rounded-md shadow-[6px_6px_0px_0px_black] dark:shadow-[6px_6px_0px_0px_var(--border-default)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-surface-secondary border-b border-black dark:border-border-default flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-accent-primary-light border border-black dark:border-border-default flex items-center justify-center text-accent-primary shadow-[2px_2px_0px_0px_black] dark:shadow-[2px_2px_0px_0px_var(--border-default)]">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="font-heading font-black text-base sm:text-lg text-text-primary uppercase tracking-tight">
                Quick Fill Academic Info
              </h2>
              <p className="text-xs text-text-secondary font-mono">
                Engineering syllabus &amp; semester courses
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md border border-black dark:border-border-default bg-surface-elevated hover:bg-surface-elevated text-text-secondary hover:text-text-primary shadow-[2px_2px_0px_0px_black] dark:shadow-[2px_2px_0px_0px_var(--border-default)] hover:shadow-[2px_2px_0px_0px_var(--accent-primary)] transition-all cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Institute Selection */}
          <div>
            <InstituteSelector
              selectedInstitute={institute}
              onInstituteChange={setInstitute}
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-xs font-mono font-bold text-text-secondary uppercase mb-1.5 flex items-center gap-1.5">
              <GraduationCap size={14} className="text-accent-primary" />
              Department
            </label>
            <Select
              value={department}
              onChange={(val) => setDepartment(val)}
              options={availableDepartments}
              placeholder="Select department..."
            />
            {institute.toLowerCase().includes("barishal") && (
              <p className="text-[11px] text-text-muted font-mono mt-1">
                ℹ️ Barishal Engineering College does not offer CSE.
              </p>
            )}
            {(institute.toLowerCase().includes("niter") ||
              institute.toLowerCase().includes("shyamoli") ||
              institute.toLowerCase().includes("shaymoli")) && (
              <p className="text-[11px] text-text-muted font-mono mt-1">
                ℹ️ Civil Engineering (CE) is not offered at this institution.
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Session */}
            <div>
              <label className="block text-xs font-mono font-bold text-text-secondary uppercase mb-1.5 flex items-center gap-1.5">
                <Calendar size={14} className="text-accent-primary" />
                Session
              </label>
              <Select
                value={session}
                onChange={(val) => setSession(val)}
                options={sessionOptions}
                placeholder="Select session..."
              />
            </div>

            {/* Semester */}
            <div>
              <label className="block text-xs font-mono font-bold text-text-secondary uppercase mb-1.5 flex items-center gap-1.5">
                <Layers size={14} className="text-accent-primary" />
                Semester
              </label>
              <Select
                value={semester}
                onChange={(val) => setSemester(val)}
                options={SEMESTERS}
                placeholder="Select semester..."
              />
            </div>
          </div>

          <div className="p-3 bg-surface-secondary/60 rounded-md border border-black dark:border-border-default text-xs font-mono text-text-muted flex items-start gap-2 shadow-[2px_2px_0px_0px_black] dark:shadow-[2px_2px_0px_0px_var(--border-default)]">
            <BookOpen size={16} className="text-accent-primary shrink-0 mt-0.5" />
            <span>
              Official engineering syllabus courses and credits will be loaded automatically.
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-surface-secondary border-t border-black dark:border-border-default flex items-center justify-end gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleApply}
            disabled={submitting}
            icon={submitting ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
          >
            {submitting ? "Fetching..." : "Apply & Load Courses"}
          </Button>
        </div>
      </div>
    </div>
  );
}
