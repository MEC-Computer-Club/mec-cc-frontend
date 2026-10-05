"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";
import { useAccent } from "@/components/AccentProvider";
import {
  Calendar,
  Send,
  UploadCloud,
  Check,
  FileCheck2,
  AlertCircle,
  Loader2,
  Clock,
  ArrowLeft,
  Home,
  Users,
  Sparkles,
  CheckCircle2,
  Ban,
} from "lucide-react";
import { FormField } from "@/lib/types/form";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

interface FormData {
  _id: string;
  code?: string;
  title: string;
  description?: string;
  eventId?: { _id: string; title: string } | string;
  coverImageUrl?: string;
  startDate?: string;
  endDate?: string;
  closingTime?: string;
  isActive: boolean;
  isClosed?: boolean;
  status?: string;
  allowMultipleSubmissions?: boolean;
  fields: FormField[];
  eventInfo?: {
    eventId: string;
    eventTitle: string;
    eventSlug: string;
    maxParticipants: number | null;
    registeredCount: number;
    isCapacityReached: boolean;
  };
  maxParticipants?: number | null;
  registeredCount?: number;
  isCapacityReached?: boolean;
}

export function checkIsFormClosed(f: FormData | null): boolean {
  if (!f) return true;
  if (
    f.isActive === false ||
    f.isClosed === true ||
    f.status === "closed" ||
    f.isCapacityReached === true
  ) {
    return true;
  }
  if (!f.endDate) return false;

  try {
    if (f.endDate.includes("T")) {
      const d = new Date(f.endDate);
      return !isNaN(d.getTime()) && Date.now() >= d.getTime();
    }

    const parts = f.endDate.trim().split("-");
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const day = parseInt(parts[2], 10);

      let hours = 23;
      let minutes = 59;
      let seconds = 59;

      if (f.closingTime && f.closingTime.trim()) {
        const timeMatch = f.closingTime.trim().match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i);
        if (timeMatch) {
          let h = parseInt(timeMatch[1], 10);
          const m = parseInt(timeMatch[2], 10);
          const s = timeMatch[3] ? parseInt(timeMatch[3], 10) : 0;
          const meridiem = timeMatch[4]?.toUpperCase();

          if (meridiem === "PM" && h < 12) h += 12;
          if (meridiem === "AM" && h === 12) h = 0;

          hours = h;
          minutes = m;
          seconds = s;
        }
      }

      const pad = (n: number) => String(n).padStart(2, "0");
      const isoBst = `${year}-${pad(month)}-${pad(day)}T${pad(hours)}:${pad(minutes)}:${pad(seconds)}+06:00`;
      const deadline = new Date(isoBst);
      if (!isNaN(deadline.getTime())) {
        return Date.now() >= deadline.getTime();
      }
    }
  } catch {}

  return false;
}

export default function PublicFormViewPage() {
  const params = useParams();
  const router = useRouter();
  const formId = params?.id as string;
  const { currentVibe } = useAccent();

  const [form, setForm] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // User input states
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [fileAttachments, setFileAttachments] = useState<Record<string, File>>({});
  const [filePreviews, setFilePreviews] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!formId) return;

    const fetchFormAndUser = async () => {
      setLoading(true);
      try {
        const apiUrl = API_BASE_URL;
        const res = await axios.get(`${apiUrl}/api/forms/${formId}`, { withCredentials: true });
        const formData: FormData = res.data?.data || res.data;
        setForm(formData);

        // If form has a short 6-char code and URL was accessed with ObjectId, silently replace URL in address bar
        if (formData.code && formId !== formData.code) {
          window.history.replaceState(null, "", `/forms/${formData.code}`);
        }

        // Fetch current user profile to auto-fill matching fields
        try {
          const userRes = await axios.get(`${apiUrl}/api/users/me`, { withCredentials: true });
          const user = userRes.data?.user;
          if (user && formData.fields) {
            const prefilled: Record<string, any> = {};
            for (const field of formData.fields) {
              const key = field.name;
              const labelLower = (field.label || "").toLowerCase();
              const nameLower = (field.name || "").toLowerCase();

              // Full Name (exclude team name, father/mother name)
              if (
                (nameLower.includes("name") || labelLower.includes("name")) &&
                !labelLower.includes("team") &&
                !labelLower.includes("father") &&
                !labelLower.includes("mother") &&
                !labelLower.includes("guardian") &&
                user.fullName
              ) {
                prefilled[key] = user.fullName;
              }
              // Email
              else if (
                (nameLower.includes("email") || labelLower.includes("email")) &&
                user.email
              ) {
                prefilled[key] = user.email;
              }
              // Student ID / Roll
              else if (
                (nameLower.includes("studentid") ||
                  nameLower.includes("student_id") ||
                  nameLower.includes("roll") ||
                  labelLower.includes("student id") ||
                  labelLower.includes("student id no") ||
                  labelLower.includes("roll number") ||
                  labelLower.includes("roll no")) &&
                user.studentId
              ) {
                prefilled[key] = user.studentId;
              }
              // Department
              else if (
                (nameLower.includes("dept") ||
                  nameLower.includes("department") ||
                  labelLower.includes("department") ||
                  labelLower.includes("dept")) &&
                user.department
              ) {
                prefilled[key] = user.department;
              }
              // Batch / Session
              else if (
                (nameLower.includes("batch") ||
                  nameLower.includes("session") ||
                  labelLower.includes("batch") ||
                  labelLower.includes("session")) &&
                user.batch
              ) {
                prefilled[key] = user.batch;
              }
              // Phone / Contact
              else if (
                (nameLower.includes("phone") ||
                  nameLower.includes("mobile") ||
                  nameLower.includes("contact") ||
                  labelLower.includes("phone") ||
                  labelLower.includes("mobile") ||
                  labelLower.includes("contact") ||
                  labelLower.includes("whatsapp")) &&
                user.phone
              ) {
                prefilled[key] = user.phone;
              }
            }

            if (Object.keys(prefilled).length > 0) {
              setResponses((prev) => ({ ...prefilled, ...prev }));
            }
          }
        } catch {
          // User is not logged in or session expired, skip prefill
        }
      } catch (err: any) {
        console.error("Error fetching form:", err);
        toast.error("Form not found or is no longer active.");
      } finally {
        setLoading(false);
      }
    };

    fetchFormAndUser();
  }, [formId]);

  const handleInputChange = (fieldName: string, value: any) => {
    setResponses((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleCheckboxToggle = (fieldName: string, optValue: string) => {
    setResponses((prev) => {
      const current = Array.isArray(prev[fieldName]) ? prev[fieldName] : [];
      if (current.includes(optValue)) {
        return { ...prev, [fieldName]: current.filter((v) => v !== optValue) };
      } else {
        return { ...prev, [fieldName]: [...current, optValue] };
      }
    });
  };

  const handleFileSelect = (fieldName: string, file: File) => {
    setFileAttachments((prev) => ({ ...prev, [fieldName]: file }));
    setFilePreviews((prev) => ({ ...prev, [fieldName]: `${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)` }));
  };

  const handleRemoveFile = (fieldName: string) => {
    setFileAttachments((prev) => {
      const next = { ...prev };
      delete next[fieldName];
      return next;
    });
    setFilePreviews((prev) => {
      const next = { ...prev };
      delete next[fieldName];
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    if (checkIsFormClosed(form)) {
      toast.error("This form has reached its deadline and is no longer accepting responses.");
      return;
    }

    // Validate required fields
    for (const field of form.fields) {
      const key = field.name;
      const isFile = field.type === "file";

      if (field.required) {
        if (isFile) {
          if (!fileAttachments[key] && !responses[key]) {
            toast.error(`"${field.label}" is required. Please upload your file.`);
            return;
          }
        } else {
          const val = responses[key];
          if (val === undefined || val === null || (typeof val === "string" && !val.trim()) || (Array.isArray(val) && val.length === 0)) {
            toast.error(`"${field.label}" is required.`);
            return;
          }
        }
      }
    }

    setSubmitting(true);
    const toastId = toast.loading("Submitting response...");

    try {
      const apiUrl = API_BASE_URL;
      const finalResponses: Record<string, any> = { ...responses };

      // Upload any file attachments first to Cloudinary
      for (const [key, file] of Object.entries(fileAttachments)) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await axios.post(`${apiUrl}/api/upload/file?folder=form_submissions`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });

        const fileUrl = uploadRes.data?.url || uploadRes.data?.secure_url;
        finalResponses[key] = fileUrl || file.name;
      }

      // Submit responses to form submission endpoint
      const res = await axios.post(
        `${apiUrl}/api/forms/submit/${form?.code || form?._id || formId}`,
        { responses: finalResponses },
        { withCredentials: true }
      );

      if (res.data?.success || res.status === 201) {
        toast.success("Form submitted successfully!", { id: toastId });
        setSubmitted(true);
      }
    } catch (err: any) {
      console.error("Error submitting form:", err);
      toast.error(err.response?.data?.message || "Failed to submit response. Please try again.", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-secondary/50 flex items-center justify-center p-4">
        <div className="p-8 rounded-2xl bg-surface-elevated border border-border-default shadow-[4px_4px_0px_0px_var(--border-default)] flex items-center gap-3 text-sm font-semibold text-text-primary">
          <Loader2 className="w-5 h-5 animate-spin text-accent-primary" />
          <span>Loading form...</span>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else if (form?.eventInfo?.eventSlug) {
      router.push(`/events/${form.eventInfo.eventSlug}`);
    } else {
      router.push("/");
    }
  };

  if (!form) {
    return (
      <div className="min-h-screen bg-surface-secondary/40 py-8 px-4 sm:px-6 flex flex-col items-center">
        <div className="w-full max-w-md space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-text-secondary pb-1">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center gap-1.5 hover:text-text-primary transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <span className="text-slate-400 dark:text-slate-500 font-medium select-none px-0.5" aria-hidden="true">|</span>
            <Link
              href="/"
              className="flex items-center gap-1.5 hover:text-text-primary transition cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" /> Home
            </Link>
          </div>

          <div className="p-8 rounded-2xl bg-surface-elevated border border-border-default shadow-[6px_6px_0px_0px_var(--border-default)] text-center space-y-4">
            <AlertCircle className="w-12 h-12 mx-auto text-accent-error" />
            <h2 className="text-xl font-black text-text-primary">Form Unavailable</h2>
            <p className="text-xs text-text-secondary">
              This form does not exist or has been closed by the administrators.
            </p>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="px-5 py-2.5 rounded-xl bg-text-primary text-surface-primary text-xs font-semibold hover:bg-surface-inverse transition cursor-pointer"
            >
              Return to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Event title & slug helper
  const eventTitle = typeof form.eventId === "object" ? form.eventId?.title : undefined;
  const eventSlug =
    form.eventInfo?.eventSlug ||
    (typeof form.eventId === "object" ? (form.eventId as any)?.slug : null);
  const isClosed = checkIsFormClosed(form);

  return (
    <div className="min-h-screen bg-surface-secondary/40 py-8 px-4 sm:px-6 flex flex-col items-center">
      {/* ── Main Form Column ── */}
      <div className="w-full max-w-2xl space-y-5">
        {/* Navigation & Header Brand */}
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-text-secondary">
            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-1.5 hover:text-text-primary transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <span className="text-slate-400 dark:text-slate-500 font-medium select-none px-0.5" aria-hidden="true">|</span>
            <Link
              href="/"
              className="flex items-center gap-1.5 hover:text-text-primary transition cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" /> Home
            </Link>
          </div>
          <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-accent-primary bg-accent-primary-light px-2.5 py-0.5 rounded border border-accent-primary/30">
            MEC Computer Club Official
          </span>
        </div>

        {submitted ? (
          /* ── Submission Confirmation Card ── */
          <div className="bg-surface-elevated rounded-2xl border border-border-default shadow-[6px_6px_0px_0px_var(--border-default)] p-8 sm:p-10 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-3xl bg-accent-success/15 border border-accent-success/40 flex items-center justify-center text-accent-success mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-text-primary">
                Response Recorded!
              </h2>
              <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
                Thank you for your submission for <strong className="text-text-primary">{form.title}</strong>. Your response has been securely saved.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setResponses({});
                  setFileAttachments({});
                  setFilePreviews({});
                  setSubmitted(false);
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-border-default bg-surface-primary text-text-primary hover:bg-surface-secondary text-xs font-semibold transition shadow-sm"
              >
                Submit another response
              </button>
              <button
                type="button"
                onClick={() => router.push("/")}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-text-primary text-surface-primary hover:bg-surface-inverse text-xs font-semibold transition shadow-sm"
              >
                Return to Club Home
              </button>
            </div>
          </div>
        ) : isClosed ? (
          /* ── Form Closed / Capacity Reached / Deadline Passed Card ── */
          <div className="bg-surface-elevated rounded-2xl border border-border-default shadow-[6px_6px_0px_0px_var(--border-default)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {form.coverImageUrl ? (
              <div
                className="w-full h-44 sm:h-60 bg-cover bg-center border-b border-border-default opacity-85 grayscale-[30%]"
                style={{ backgroundImage: `url(${form.coverImageUrl})` }}
              />
            ) : (
              <div
                className={`w-full h-3.5 border-b border-border-default ${
                  form.isCapacityReached ? "bg-amber-500" : "bg-accent-error"
                }`}
              />
            )}

            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-2 flex-wrap">
                {form.isCapacityReached ? (
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/30 flex items-center gap-1">
                    <Ban className="w-3 h-3" /> Registration Full
                  </span>
                ) : (
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded border border-rose-500/30">
                    Submissions Closed
                  </span>
                )}
                {form.maxParticipants && form.maxParticipants > 0 && (
                  <span className="text-[11px] font-mono font-semibold text-text-tertiary">
                    Capacity: {form.registeredCount || form.maxParticipants} / {form.maxParticipants}
                  </span>
                )}
                {form.endDate && !form.isCapacityReached && (
                  <span className="text-[11px] font-medium text-text-tertiary flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-accent-error" /> Deadline: {form.endDate} {form.closingTime ? `@ ${form.closingTime} (BST)` : ""}
                  </span>
                )}
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
                  {form.title}
                </h1>
              </div>

              {form.isCapacityReached ? (
                <div className="p-5 rounded-xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 space-y-2">
                  <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Participant Limit Reached</span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    This event has reached its maximum capacity limit of <strong>{form.maxParticipants} participants</strong> ({form.registeredCount || form.maxParticipants} / {form.maxParticipants} seats filled). Therefore, this registration form is no longer accepting new responses.
                  </p>
                </div>
              ) : (
                <div className="p-5 rounded-xl border border-rose-500/30 bg-rose-500/5 dark:bg-rose-950/20 space-y-2">
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>This form is no longer accepting responses</span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    The deadline for this form has reached its end date and time ({form.endDate ? `${form.endDate} ${form.closingTime ? `at ${form.closingTime} (BST)` : ""}` : "closing time"}). If you believe this is an error or require assistance, please contact the MEC Computer Club executive committee.
                  </p>
                </div>
              )}

              {form.description && (
                <div className="space-y-1.5 border-t border-border-default pt-4">
                  <span className="text-xs font-bold text-text-tertiary uppercase tracking-wider">
                    Form Information
                  </span>
                  <p className="text-text-secondary text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                    {form.description}
                  </p>
                </div>
              )}

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                {form.eventInfo?.eventSlug && (
                  <button
                    type="button"
                    onClick={() => router.push(`/events/${form.eventInfo?.eventSlug}`)}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-accent-primary text-text-inverse font-bold text-xs hover:opacity-90 transition shadow-sm cursor-pointer"
                  >
                    View Event Details
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => router.push("/events")}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-border-default bg-surface-primary text-text-primary hover:bg-surface-secondary text-xs font-semibold transition shadow-sm cursor-pointer"
                >
                  View Active Events
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-border-default bg-surface-primary text-text-primary hover:bg-surface-secondary text-xs font-semibold transition shadow-sm cursor-pointer"
                >
                  Return to Homepage
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ── Form Google-Forms Header Card ── */}
            <div className="bg-surface-elevated rounded-2xl border border-border-default shadow-[4px_4px_0px_0px_var(--border-default)] overflow-hidden">
              {form.coverImageUrl ? (
                <div
                  className="w-full h-44 sm:h-60 bg-cover bg-center border-b border-border-default"
                  style={{ backgroundImage: `url(${form.coverImageUrl})` }}
                />
              ) : (
                <div className="w-full h-3.5 bg-accent-primary border-b border-border-default" />
              )}

              <div className="p-6 sm:p-7 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-accent-primary bg-accent-primary-light px-2.5 py-0.5 rounded border border-accent-primary/30">
                      Registration &amp; Questionnaire
                    </span>
                    {form.allowMultipleSubmissions === false && (
                      <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded flex items-center gap-1">
                        1 Response Per Person
                      </span>
                    )}
                  </div>

                  {form.endDate && (
                    <span className="text-[11px] font-medium text-text-tertiary flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Closes: {form.endDate} {form.closingTime ? `@ ${form.closingTime} (BST)` : ""}
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
                  {form.title}
                </h1>

                {form.description ? (
                  <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-line border-t border-border-default pt-3">
                    {form.description}
                  </p>
                ) : (
                  <p className="text-text-tertiary text-xs italic border-t border-border-default pt-3">
                    Please fill out the questions below to submit your details.
                  </p>
                )}

                {/* ── Event Capacity & Registration Progress Widget ── */}
                {form.maxParticipants && form.maxParticipants > 0 && (
                  <div className="p-4 rounded-xl bg-surface-secondary/70 border border-border-default space-y-2.5 mt-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-text-tertiary uppercase tracking-wider flex items-center gap-1.5">
                        <Users size={13} className="text-accent-primary" /> Participation Cap
                      </span>
                      <span className="font-bold text-text-primary shrink-0 whitespace-nowrap">
                        {form.registeredCount || 0} / {form.maxParticipants} Seats
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-surface-primary overflow-hidden border border-border-default/40">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          (form.registeredCount || 0) >= form.maxParticipants
                            ? "bg-amber-500"
                            : (form.registeredCount || 0) / form.maxParticipants >= 0.8
                            ? "bg-accent-primary"
                            : "bg-emerald-500"
                        }`}
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round(((form.registeredCount || 0) / form.maxParticipants) * 100)
                          )}%`,
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-text-secondary">
                      <span>
                        {form.maxParticipants - (form.registeredCount || 0) > 0
                          ? `${form.maxParticipants - (form.registeredCount || 0)} seat${
                              form.maxParticipants - (form.registeredCount || 0) === 1 ? "" : "s"
                            } remaining`
                          : "Event at maximum capacity"}
                      </span>
                      {eventSlug ? (
                        <Link
                          href={`/events/${eventSlug}`}
                          className="font-bold text-accent-primary hover:text-accent-primary-hover hover:underline transition-colors inline-flex items-center gap-1"
                          title="View associated event"
                        >
                          Event &rarr;
                        </Link>
                      ) : (
                        <Link
                          href="/events"
                          className="font-bold text-accent-primary hover:text-accent-primary-hover hover:underline transition-colors inline-flex items-center gap-1"
                          title="View all active events"
                        >
                          Event &rarr;
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Question Cards ── */}
            <div className="space-y-4">
              {form.fields.map((field, idx) => {
                const key = field.name || `field_${idx}`;
                const isFile = field.type === "file";
                const isRadio = field.type === "radio";
                const isCheckbox = field.type === "checkbox";
                const isSelect = field.type === "select";

                return (
                  <div
                    key={idx}
                    className="p-5 sm:p-6 rounded-2xl bg-surface-elevated border border-border-default shadow-[4px_4px_0px_0px_var(--border-default)] space-y-3.5 transition hover:border-accent-primary"
                  >
                    <label className="block text-sm font-semibold text-text-primary">
                      {field.label}{" "}
                      {field.required && <span className="text-accent-error">*</span>}
                    </label>

                    {/* Text / Email / Number */}
                    {["text", "email", "number"].includes(field.type) && (
                      <input
                        type={field.type}
                        required={field.required}
                        placeholder={field.placeholder || "Your answer..."}
                        value={responses[key] || ""}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-border-default bg-surface-primary text-text-primary text-sm focus:outline-none focus:border-accent-primary shadow-sm"
                      />
                    )}

                    {/* Textarea */}
                    {field.type === "textarea" && (
                      <textarea
                        rows={3}
                        required={field.required}
                        placeholder={field.placeholder || "Write your response..."}
                        value={responses[key] || ""}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-border-default bg-surface-primary text-text-primary text-sm focus:outline-none focus:border-accent-primary shadow-sm leading-relaxed"
                      />
                    )}

                    {/* Dropdown Select */}
                    {isSelect && (
                      <Select
                        id={`form-select-${idx}`}
                        value={responses[key] || ""}
                        onChange={(val) => handleInputChange(key, val)}
                        options={[
                          { value: "", label: "Choose an option..." },
                          ...(field.options || []).map((o) => ({
                            value: o.value,
                            label: o.label,
                          })),
                        ]}
                      />
                    )}

                    {/* Radio Choices */}
                    {isRadio && (
                      <div className="space-y-2 pt-1">
                        {(field.options || []).map((opt, oIdx) => {
                          const isSelected = responses[key] === opt.value;
                          return (
                            <div
                              key={oIdx}
                              onClick={() => handleInputChange(key, opt.value)}
                              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${isSelected
                                  ? "bg-accent-primary-light border-accent-primary text-text-primary font-semibold shadow-sm"
                                  : "bg-surface-primary border-border-default text-text-secondary hover:border-accent-primary"
                                }`}
                            >
                              <div
                                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected
                                    ? "border-accent-primary bg-accent-primary"
                                    : "border-border-default"
                                  }`}
                              >
                                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                              </div>
                              <span className="text-xs sm:text-sm">{opt.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Checkbox Choices */}
                    {isCheckbox && (
                      <div className="space-y-2 pt-1">
                        {(field.options || []).map((opt, oIdx) => {
                          const selectedArray: string[] = Array.isArray(responses[key])
                            ? responses[key]
                            : [];
                          const isChecked = selectedArray.includes(opt.value);

                          return (
                            <div
                              key={oIdx}
                              onClick={() => handleCheckboxToggle(key, opt.value)}
                              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${isChecked
                                  ? "bg-accent-primary-light border-accent-primary text-text-primary font-semibold shadow-sm"
                                  : "bg-surface-primary border-border-default text-text-secondary hover:border-accent-primary"
                                }`}
                            >
                              <div
                                className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center ${isChecked
                                    ? "border-accent-primary bg-accent-primary text-white"
                                    : "border-border-default"
                                  }`}
                              >
                                {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <span className="text-xs sm:text-sm">{opt.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* File Upload Dropzone */}
                    {isFile && (
                      <div className="space-y-2">
                        {filePreviews[key] ? (
                          <div className="flex items-center justify-between bg-surface-secondary p-3.5 rounded-xl border border-border-default">
                            <div className="flex items-center gap-2.5 text-xs font-semibold text-text-primary">
                              <FileCheck2 className="w-5 h-5 text-accent-success" />
                              <span>{filePreviews[key]}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(key)}
                              className="text-xs font-semibold text-accent-error hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <label className="border-2 border-dashed border-border-default rounded-xl p-6 bg-surface-primary text-center block cursor-pointer hover:border-accent-primary transition group">
                            <input
                              type="file"
                              accept={field.fileAccept || "*"}
                              className="hidden"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) handleFileSelect(key, f);
                              }}
                            />
                            <UploadCloud className="w-8 h-8 mx-auto text-accent-primary group-hover:scale-110 transition mb-1" />
                            <div className="text-xs font-semibold text-text-primary">
                              <span className="text-accent-primary hover:underline">Click to browse file</span> or drag &amp; drop
                            </div>
                            <p className="text-[11px] text-text-tertiary mt-1">
                              Accepted: {field.fileAccept || "image/*,.pdf"} • Max: {field.maxFileSizeMb || 10}MB
                            </p>
                          </label>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ── Submit Action Card ── */}
            <div className="p-4 sm:p-5 rounded-2xl bg-surface-elevated border border-border-default shadow-[4px_4px_0px_0px_var(--border-default)] flex items-center justify-between gap-4">
              <Link
                href="/"
                className="inline-flex items-center h-9 sm:h-10 opacity-90 hover:opacity-100 transition-opacity"
                title="MEC Computer Club Home"
              >
                <Image
                  src={`/logo-${currentVibe || "lime"}-light.png`}
                  alt="MEC Computer Club"
                  width={160}
                  height={40}
                  className="w-36 sm:w-40 h-auto object-contain block dark:hidden"
                />
                <Image
                  src={`/logo-${currentVibe || "lime"}-dark.png`}
                  alt="MEC Computer Club"
                  width={160}
                  height={40}
                  className="w-36 sm:w-40 h-auto object-contain hidden dark:block"
                />
              </Link>

              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={submitting}
                icon={
                  submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )
                }
              >
                Submit
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
