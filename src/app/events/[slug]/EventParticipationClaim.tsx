"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  CheckCircle2, Clock, Send, X, Sparkles, UserCheck
} from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Select } from "@/components/ui/Select";
import { Event, ParticipationClaim } from "@/types";
import toast from "react-hot-toast";

interface EventParticipationClaimProps {
  event: Event;
}

const ROLE_OPTIONS = [
  { value: "Participant", label: "General Participant / Attendee" },
  { value: "Volunteer", label: "Volunteer / Organizing Helper" },
  { value: "Speaker", label: "Speaker / Workshop Mentor" },
  { value: "Contestant", label: "Contestant / Competitor" },
  { value: "Organizer", label: "Event Organizer / Coordinator" },
  { value: "Other", label: "Other Role" },
];

export function EventParticipationClaim({ event }: EventParticipationClaimProps) {
  const { user, isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);
  const eventId = event.id || (event as any)._id;

  const [claim, setClaim] = useState<ParticipationClaim | null>(null);
  const [isAttendee, setIsAttendee] = useState(false);
  const [, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states with profile autofill benefits
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  const [department, setDepartment] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("Participant");
  const [notes, setNotes] = useState("");

  // Rule 1: past events only
  const today = new Date();
  const eventDate = event.date ? new Date(event.date) : null;
  const isPast =
    (eventDate && eventDate < today) ||
    event.status === "past" ||
    (event as any).status === "completed";

  // Lock body scroll when modal is open (HOOK MUST BE AT TOP LEVEL)
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [modalOpen]);

  const fetchMyClaim = useCallback(async () => {
    if (!eventId) return;

    // Check localStorage for guest submission state first
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(`mec_event_claim_${eventId}`);
        if (stored) {
          const parsed = JSON.parse(stored);
          setClaim((prev) => prev || (parsed as ParticipationClaim));
        }
      } catch {
        // ignore
      }
    }

    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/events/${eventId}/my-claim`, {
        withCredentials: true,
      });
      if (res.data?.success) {
        if (res.data.data) {
          setClaim(res.data.data);
        }
        setIsAttendee(Boolean(res.data.isAttendee));
      }
    } catch {
      // Ignored if user has no claim or error
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, eventId]);

  useEffect(() => {
    fetchMyClaim();
  }, [fetchMyClaim]);

  // Autofill user profile info when opening modal
  useEffect(() => {
    if (user && modalOpen) {
      setFullName((prev) => prev || user.fullName || "");
      setEmail((prev) => prev || user.email || "");
      setStudentId((prev) => prev || user.studentId || "");
      setDepartment((prev) => prev || user.department || "");
      setPhone((prev) => prev || (user as any).phone || (user as any).contactNumber || "");
    }
  }, [user, modalOpen]);

  // ALL HOOKS ARE ABOVE. Early returns happen only below this line:

  // If not past event or claims not allowed, do not render
  if (!isPast || !event.allowParticipationClaims) {
    return null;
  }

  const handleSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      toast.error("Full Name and Email Address are required.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/events/${eventId}/claim-participation`,
        {
          fullName: fullName.trim(),
          email: email.trim(),
          studentId: studentId.trim(),
          department: department.trim(),
          phone: phone.trim(),
          role,
          notes: notes.trim(),
        },
        { withCredentials: true }
      );

      if (res.data?.success) {
        toast.success(res.data.message || "Claim submitted successfully!");
        setModalOpen(false);

        // Store claim in local state and localStorage so guest users also see pending status
        const localClaimData: ParticipationClaim = {
          role,
          status: "pending",
          claimedAt: new Date().toISOString(),
          fullName: fullName.trim(),
          email: email.trim(),
        } as any;
        setClaim(localClaimData);

        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(`mec_event_claim_${eventId}`, JSON.stringify(localClaimData));
          } catch {
            // ignore
          }
        }

        await fetchMyClaim();
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to submit claim. Please try again.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // State 1: Officially verified attendee
  if (isAttendee || claim?.status === "approved") {
    return (
      <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-emerald-500/10 border-2 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold text-sm shadow-[3px_3px_0px_#10B981]">
        <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400" />
        <span>Verified Participant ✓</span>
      </div>
    );
  }

  // State 2: Claim is submitted and pending review
  if (claim?.status === "pending") {
    return (
      <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-amber-500/10 border-2 border-amber-500 text-amber-800 dark:text-amber-300 font-semibold text-xs sm:text-sm shadow-[3px_3px_0px_#F59E0B]">
        <Clock size={17} className="text-amber-600 dark:text-amber-400 shrink-0" />
        <span>Participation Claim Under Review ({claim.role || "Participant"})</span>
      </div>
    );
  }

  // State 3: Anyone can claim (logged in or guest / unauthenticated)
  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm border-2 border-border-brutalist shadow-[4px_4px_0px_0px_var(--border-brutalist)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_var(--border-brutalist)] transition-all"
          style={{ color: "#FFFFFF" }}
        >
          <CheckCircle2 size={18} />
          {claim?.status === "rejected" ? "Re-submit Participation Claim" : "I Participated in this Event"}
        </button>

        {claim?.status === "rejected" && (
          <span className="text-xs text-red-500 font-medium">
            (Your previous claim was not approved. You can submit updated proof.)
          </span>
        )}
      </div>

      {/* ── Participation Claim Modal ── */}
      {modalOpen && mounted && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setModalOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-lg bg-surface-elevated rounded-2xl border-2 border-border-brutalist shadow-[6px_6px_0px_0px_var(--border-brutalist)] overflow-hidden z-10 my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-default bg-surface-secondary">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-text-primary">
                    Claim Event Participation
                  </h3>
                  <p className="text-xs text-text-secondary truncate max-w-[280px]">
                    {event.title}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleSubmitClaim} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                {user ? (
                  <>
                    <strong className="font-bold flex items-center gap-1.5 mb-0.5">
                      <UserCheck size={14} className="text-emerald-600" /> Archive Verification:
                    </strong>
                    Your profile details have been autofilled below. Please review them, choose your participation role, and submit your claim for club admin verification.
                  </>
                ) : (
                  <>
                    <strong className="font-bold flex items-center gap-1.5 mb-0.5">
                      <Sparkles size={14} className="text-emerald-600" /> Archive Verification:
                    </strong>
                    Enter your name and contact details below to claim your participation in this past event. Our club admins will review and verify your record.
                  </>
                )}
              </div>

              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-text-primary">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-3.5 py-2 rounded-xl border border-border-default bg-surface-secondary text-text-primary text-sm outline-none focus:border-accent-primary"
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-text-primary">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2 rounded-xl border border-border-default bg-surface-secondary text-text-primary text-sm outline-none focus:border-accent-primary"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-text-primary">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+8801XXXXXXXXX"
                    className="w-full px-3.5 py-2 rounded-xl border border-border-default bg-surface-secondary text-text-primary text-sm outline-none focus:border-accent-primary"
                  />
                </div>
              </div>

              {/* Student ID & Department */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-text-primary">
                    Student ID
                  </label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="e.g. 190104"
                    className="w-full px-3.5 py-2 rounded-xl border border-border-default bg-surface-secondary text-text-primary text-sm outline-none focus:border-accent-primary"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-text-primary">
                    Department
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. CSE / EEE / CE"
                    className="w-full px-3.5 py-2 rounded-xl border border-border-default bg-surface-secondary text-text-primary text-sm outline-none focus:border-accent-primary"
                  />
                </div>
              </div>

              {/* Participation Role */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-text-primary">
                  Participation Role / Contribution <span className="text-red-500">*</span>
                </label>
                <Select
                  value={role}
                  onChange={setRole}
                  options={ROLE_OPTIONS}
                />
              </div>

              {/* Optional Notes / Proof */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-text-primary">
                  Notes or Proof Link (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Google Drive link to certificate/photo, team name, or additional details to help admins verify your claim…"
                  className="w-full px-3.5 py-2 rounded-xl border border-border-default bg-surface-secondary text-text-primary text-xs outline-none focus:border-accent-primary resize-none"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-default">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-text-secondary hover:bg-surface-secondary transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-[3px_3px_0px_0px_var(--border-brutalist)] transition-all disabled:opacity-50"
                  style={{ color: "#FFFFFF" }}
                >
                  <Send size={13} />
                  {submitting ? "Submitting Claim…" : "Submit Claim"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
