"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";
import {
  Check,
  X,
  Search,
  Clock,
  UserCheck,
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Copy,
  Mail,
  RefreshCw,
  CheckCircle2,
  Filter,
  FileText,
  User,
  ExternalLink,
} from "lucide-react";
import FilterSelect from "@/app/dashboard/components/FilterSelect";

const API = `${API_BASE_URL}/api`;

interface EnrichedSubmission {
  _id: string;
  formId: any;
  userId?: any;
  responses: Record<string, any>;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  applicantDetails: {
    email: string;
    fullName: string;
    studentId: string;
    department: string;
    batch: string;
    phone: string;
    teamName?: string;
  };
  matchedUser?: {
    _id: string;
    fullName: string;
    email: string;
    studentId?: string;
    department?: string;
    imageUrl?: string;
    role?: string;
    hasAccount: boolean;
  } | null;
  isAttending: boolean;
}

interface EventFormSubmissionsSectionProps {
  eventId: string;
  onSubmissionsUpdated: () => void;
  showToast: (msg: string, type?: "success" | "error") => void;
  onEmailApplicant?: (email: string, name: string) => void;
}

export default function EventFormSubmissionsSection({
  eventId,
  onSubmissionsUpdated,
  showToast,
  onEmailApplicant,
}: EventFormSubmissionsSectionProps) {
  const [submissions, setSubmissions] = useState<EnrichedSubmission[]>([]);
  const [forms, setForms] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters & Search
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [accountFilter, setAccountFilter] = useState<"all" | "account" | "guest">("all");

  // Selection & Actions
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [bulkActionInProgress, setBulkActionInProgress] = useState(false);
  const [rejectModal, setRejectModal] = useState<{
    isOpen: boolean;
    ids: string[];
    applicantName?: string;
    isApprovedMember?: boolean;
  } | null>(null);

  const fetchSubmissions = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await axios.get(`${API}/events/${eventId}/form-submissions`, {
        withCredentials: true,
      });
      if (res.data?.success) {
        setSubmissions(res.data.submissions || []);
        setForms(res.data.forms || []);
        setStats(res.data.stats || { total: 0, pending: 0, approved: 0, rejected: 0 });
      }
    } catch (err: any) {
      console.error("Failed to load event form submissions:", err);
      showToast("Failed to load registration submissions.", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [eventId, showToast]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  // Filtered Submissions
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      // Status filter
      if (statusFilter !== "all" && sub.status !== statusFilter) return false;

      // Account filter
      if (accountFilter === "account" && !sub.matchedUser) return false;
      if (accountFilter === "guest" && sub.matchedUser) return false;

      // Search keyword filter
      if (search.trim()) {
        const q = search.toLowerCase();
        const d = sub.applicantDetails;
        const matchesBasic =
          d.fullName.toLowerCase().includes(q) ||
          d.email.toLowerCase().includes(q) ||
          d.studentId.toLowerCase().includes(q) ||
          d.department.toLowerCase().includes(q) ||
          d.batch.toLowerCase().includes(q) ||
          d.phone.toLowerCase().includes(q) ||
          (d.teamName || "").toLowerCase().includes(q);

        if (matchesBasic) return true;

        // Search within custom form response values
        const matchesResponses = Object.values(sub.responses || {}).some((val) => {
          if (typeof val === "string") return val.toLowerCase().includes(q);
          if (typeof val === "number") return val.toString().includes(q);
          return false;
        });

        return matchesResponses;
      }

      return true;
    });
  }, [submissions, statusFilter, accountFilter, search]);

  // Bulk selection toggles
  const handleToggleSelectAll = () => {
    if (selectedIds.size === filteredSubmissions.length && filteredSubmissions.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredSubmissions.map((s) => s._id)));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Bulk Approve
  const handleBulkApprove = async (specificIds?: string[]) => {
    const idsToApprove = specificIds || Array.from(selectedIds);
    if (idsToApprove.length === 0) return;

    setBulkActionInProgress(true);
    try {
      const res = await axios.post(
        `${API}/events/${eventId}/form-submissions/bulk-approve`,
        { submissionIds: idsToApprove },
        { withCredentials: true }
      );

      if (res.data?.success) {
        showToast(res.data.message || `Approved ${idsToApprove.length} applicants!`, "success");
        setSelectedIds(new Set());
        await fetchSubmissions(true);
        onSubmissionsUpdated();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to approve submissions.", "error");
    } finally {
      setBulkActionInProgress(false);
    }
  };

  // Open Reject Modal
  const openRejectModal = (specificIds?: string[], applicantName?: string, isApprovedMember?: boolean) => {
    const idsToReject = specificIds || Array.from(selectedIds);
    if (idsToReject.length === 0) return;

    setRejectModal({
      isOpen: true,
      ids: idsToReject,
      applicantName: applicantName || (idsToReject.length > 1 ? `${idsToReject.length} selected registrations` : "this applicant"),
      isApprovedMember: isApprovedMember ?? false,
    });
  };

  // Confirm Reject
  const confirmReject = async () => {
    if (!rejectModal || rejectModal.ids.length === 0) return;

    setBulkActionInProgress(true);
    try {
      const res = await axios.post(
        `${API}/events/${eventId}/form-submissions/bulk-reject`,
        { submissionIds: rejectModal.ids },
        { withCredentials: true }
      );

      if (res.data?.success) {
        showToast(res.data.message || `Rejected ${rejectModal.ids.length} submission(s).`, "success");
        setSelectedIds((prev) => {
          const next = new Set(prev);
          rejectModal.ids.forEach((id) => next.delete(id));
          return next;
        });
        setRejectModal(null);
        await fetchSubmissions(true);
        onSubmissionsUpdated();
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to reject submissions.", "error");
    } finally {
      setBulkActionInProgress(false);
    }
  };

  // Quick Approve All Pending
  const handleApproveAllPending = async () => {
    const pendingIds = submissions.filter((s) => s.status === "pending").map((s) => s._id);
    if (pendingIds.length === 0) return;

    if (!confirm(`Approve all ${pendingIds.length} pending registration applicants? This will add them to attendees and link profile activities for registered members.`)) {
      return;
    }

    await handleBulkApprove(pendingIds);
  };

  const handleCopyEmail = (email: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(email);
    showToast(`Copied ${email} to clipboard!`);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-4 sm:p-6 space-y-5">
      {/* ── Section Title & Counters ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Registration Form Responses & Applicants
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              {stats.total} Total
            </span>
            {stats.pending > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 animate-pulse">
                {stats.pending} Pending Review
              </span>
            )}
            {stats.approved > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {stats.approved} Approved
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review applicant form responses, verify student details, and bulk-approve attendees. Approved applicants with website accounts will automatically have this event reflected on their profile.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-shrink-0">
          <button
            type="button"
            onClick={() => fetchSubmissions(true)}
            disabled={refreshing || loading}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
            title="Refresh submissions"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          </button>

          {stats.pending > 0 && (
            <button
              type="button"
              onClick={handleApproveAllPending}
              disabled={bulkActionInProgress}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
              style={{ color: "#FFFFFF" }}
            >
              {bulkActionInProgress ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5" />
              )}
              Approve All Pending ({stats.pending})
            </button>
          )}
        </div>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, student ID, department, or responses..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Pills */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            {(["all", "pending", "approved", "rejected"] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg capitalize transition ${
                  statusFilter === st
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                {st === "all" ? `All (${stats.total})` : `${st}`}
              </button>
            ))}
          </div>

          {/* Account Filter using FilterSelect */}
          <div className="w-44">
            <FilterSelect
              value={accountFilter}
              onChange={(val) => setAccountFilter(val as any)}
              options={[
                { label: "All Applicants", value: "all" },
                { label: "Account Linked", value: "account" },
                { label: "Guest / Non-Member", value: "guest" },
              ]}
              placeholder="Account Status"
            />
          </div>
        </div>
      </div>

      {/* ── Bulk Actions Floating Bar ── */}
      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-xl animate-fade-in text-xs sm:text-sm">
          <div className="flex items-center gap-2 font-bold text-indigo-900 dark:text-indigo-200">
            <UserCheck className="w-4 h-4 text-indigo-600" />
            <span>{selectedIds.size} applicant{selectedIds.size === 1 ? "" : "s"} selected</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleBulkApprove()}
              disabled={bulkActionInProgress}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
              style={{ color: "#FFFFFF" }}
            >
              {bulkActionInProgress ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              Approve Selected
            </button>
            <button
              type="button"
              onClick={() => openRejectModal(Array.from(selectedIds), `${selectedIds.size} selected registrations`)}
              disabled={bulkActionInProgress}
              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition flex items-center gap-1.5 disabled:opacity-50"
              style={{ color: "#FFFFFF" }}
            >
              <X className="w-3.5 h-3.5" /> Reject Selected
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds(new Set())}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Deselect
            </button>
          </div>
        </div>
      )}

      {/* ── Select All Checkbox Row ── */}
      {filteredSubmissions.length > 0 && (
        <div className="flex items-center justify-between px-2 text-xs text-slate-500 font-semibold border-b border-slate-100 dark:border-slate-800 pb-2">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={selectedIds.size === filteredSubmissions.length && filteredSubmissions.length > 0}
              onChange={handleToggleSelectAll}
              className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Select all matching ({filteredSubmissions.length})</span>
          </label>

          <span>Showing {filteredSubmissions.length} of {stats.total} submissions</span>
        </div>
      )}

      {/* ── Submissions Cards List ── */}
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
          <p className="text-sm">Loading registrations and form responses...</p>
        </div>
      ) : filteredSubmissions.length === 0 ? (
        <div className="py-12 text-center text-slate-400 space-y-2">
          <FileText className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 stroke-[1.5]" />
          <p className="text-sm font-semibold">No form responses found.</p>
          <p className="text-xs text-slate-500">
            {stats.total === 0
              ? "No responses have been submitted to the linked event registration form yet."
              : "No responses match the active filters or search keyword."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSubmissions.map((sub) => {
            const isSelected = selectedIds.has(sub._id);
            const isExpanded = expandedId === sub._id;
            const details = sub.applicantDetails;
            const isApproved = sub.status === "approved";
            const isPending = sub.status === "pending";
            const isRejected = sub.status === "rejected";

            return (
              <div
                key={sub._id}
                className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                  isSelected
                    ? "bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-400 dark:border-indigo-600 shadow-sm"
                    : isApproved
                    ? "bg-emerald-50/30 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-800/60"
                    : isPending
                    ? "bg-white dark:bg-slate-900 border-amber-200 dark:border-amber-900/50"
                    : "bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 opacity-75"
                }`}
              >
                {/* Main Card Header */}
                <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleSelect(sub._id)}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 mt-1 cursor-pointer"
                    />

                    {/* Avatar / Initial */}
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 flex-shrink-0 text-sm">
                      {details.fullName ? details.fullName.charAt(0).toUpperCase() : "P"}
                    </div>

                    {/* Details */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                          {details.fullName}
                        </h4>

                        {/* Status Badge */}
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                            isApproved
                              ? "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700"
                              : isPending
                              ? "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700"
                              : "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/40 dark:text-red-300 dark:border-red-700"
                          }`}
                        >
                          {sub.status}
                        </span>

                        {/* Account Linked Indicator */}
                        {sub.matchedUser ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1">
                            <Check className="w-3 h-3 text-blue-600" />
                            Account Linked
                            {sub.matchedUser.role && ` (${sub.matchedUser.role})`}
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                            Guest
                          </span>
                        )}

                        {details.teamName && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                            Squad: {details.teamName}
                          </span>
                        )}
                      </div>

                      {/* Sub-meta */}
                      <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap mt-1">
                        <span className="flex items-center gap-1 font-mono">
                          <Mail className="w-3 h-3 text-slate-400" />
                          {details.email || "No email"}
                          {details.email && (
                            <button
                              type="button"
                              onClick={(e) => handleCopyEmail(details.email, e)}
                              title="Copy email"
                              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          )}
                        </span>

                        {details.studentId && (
                          <span>· ID: <strong className="text-slate-700 dark:text-slate-300">{details.studentId}</strong></span>
                        )}

                        {details.department && (
                          <span>· Dept: <strong className="text-slate-700 dark:text-slate-300">{details.department}</strong></span>
                        )}

                        {details.batch && (
                          <span>· Batch: <strong className="text-slate-700 dark:text-slate-300">{details.batch}</strong></span>
                        )}

                        <span className="text-[11px] text-slate-400">
                          · {new Date(sub.createdAt).toLocaleDateString()} at {new Date(sub.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Expand Toggle */}
                  <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                    {/* Approve button */}
                    {!isApproved && (
                      <button
                        type="button"
                        onClick={() => handleBulkApprove([sub._id])}
                        disabled={bulkActionInProgress}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-1"
                        style={{ color: "#FFFFFF" }}
                      >
                        <Check className="w-3.5 h-3.5" />
                        Approve
                      </button>
                    )}

                    {/* Reject button */}
                    {!isRejected && (
                      <button
                        type="button"
                        onClick={() => openRejectModal([sub._id], details.fullName, isApproved)}
                        disabled={bulkActionInProgress}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 text-xs font-semibold transition flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        Reject
                      </button>
                    )}

                    {/* Direct Email shortcut button */}
                    {details.email && onEmailApplicant && (
                      <button
                        type="button"
                        onClick={() => onEmailApplicant(details.email, details.fullName)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/40 text-xs font-semibold transition flex items-center gap-1"
                        title={`Compose personalized email to ${details.fullName || details.email}`}
                      >
                        <Mail className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Email</span>
                      </button>
                    )}

                    {/* View all answers accordion toggle */}
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : sub._id)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition flex items-center gap-1"
                    >
                      <span>Responses</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* ── Expanded Form Responses Drawer ── */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-3 animate-fade-in text-xs">
                    <div className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-indigo-500" />
                      Detailed Submission Answers
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {Object.entries(sub.responses || {}).map(([key, val]) => {
                        const formattedKey = key
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (c) => c.toUpperCase());
                        const strVal = typeof val === "object" ? JSON.stringify(val) : String(val ?? "—");

                        return (
                          <div
                            key={key}
                            className="p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 space-y-1"
                          >
                            <span className="font-semibold text-slate-500 dark:text-slate-400 block text-[11px]">
                              {formattedKey}:
                            </span>
                            <p className="text-slate-800 dark:text-slate-100 font-medium whitespace-pre-wrap break-words">
                              {strVal}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Reject Confirmation Modal ── */}
      {rejectModal && rejectModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className="w-full max-w-md bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-slate-700 rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_var(--accent-primary)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center">
                  <X className="w-4 h-4 stroke-[2.5]" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Reject Registration
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setRejectModal(null)}
                className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Are you sure you want to reject the registration for{" "}
                <strong className="text-slate-900 dark:text-white font-bold">{rejectModal.applicantName || "this applicant"}</strong>?
              </p>

              {rejectModal.isApprovedMember && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                    Currently Approved Participant
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    This applicant was previously approved. Confirming rejection will remove them from the event attendees and roster, and update their account activity.
                  </p>
                </div>
              )}

              <p className="text-xs text-slate-400 dark:text-slate-500">
                This action will mark the registration submission as <span className="font-bold text-red-600 dark:text-red-400">Rejected</span>.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-2.5 px-5 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
              <button
                type="button"
                onClick={() => setRejectModal(null)}
                disabled={bulkActionInProgress}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-bold transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmReject}
                disabled={bulkActionInProgress}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition flex items-center gap-1.5 disabled:opacity-60"
                style={{ color: "#FFFFFF" }}
              >
                {bulkActionInProgress ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Rejecting...
                  </>
                ) : (
                  <>
                    <X className="w-3.5 h-3.5" />
                    Confirm Rejection
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
