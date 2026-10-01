"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import UserAvatarWithFallback from "@/components/ui/shared/UserAvatarWithFallback";
import FilterSelect, { FilterOption } from "@/app/dashboard/components/FilterSelect";
import { logAdminActivity } from "@/lib/auditLogger";
import toast from "react-hot-toast";
import {
  GraduationCap,
  Briefcase,
  Search,
  Plus,
  Download,
  RotateCcw,
  Sparkles,
  LayoutGrid,
  List,
  Eye,
  Edit3,
  ExternalLink,
  Loader2,
  X,
  Award,
  Calendar,
  UserMinus,
} from "lucide-react";

export interface AlumniMember {
  _id: string;
  fullName: string;
  imageUrl?: string;
  imagePosition?: string;
  email: string;
  role?: string;
  clubRole?: string;
  studentId?: string;
  department?: string;
  session?: string;
  batch?: string;
  isGraduated?: boolean;
  passingYear?: number | null;
  designation?: string;
  contactNumber?: string;
  bio?: string;
  socialLinks?: Record<string, string>;
  applicationStatus?: string;
  profileStatus?: string;
  activityCounts?: number;
}

/**
 * Normalizes any session string, batch string, or student ID into standard "YYYY-YY" session format.
 */
export function getMemberSession(m: { session?: string; batch?: string; studentId?: string }): string {
  if (m.session && m.session.trim()) {
    const s = m.session.trim().replace(/^Session:\s*/i, "").replace(/Session\s*/i, "");
    const match = s.match(/(\d{4}|\d{2})\s*[-/]\s*(\d{4}|\d{2})/);
    if (match) {
      const start = match[1].length === 2 ? `20${match[1]}` : match[1];
      const end = match[2].length === 4 ? match[2].slice(-2) : match[2];
      return `${start}-${end}`;
    }
    return s;
  }
  if (m.batch) {
    const match = m.batch.match(/(\d{4}|\d{2})\s*[-/]\s*(\d{4}|\d{2})/);
    if (match) {
      const start = match[1].length === 2 ? `20${match[1]}` : match[1];
      const end = match[2].length === 4 ? match[2].slice(-2) : match[2];
      return `${start}-${end}`;
    }
  }
  if (m.studentId) {
    const idMatch = m.studentId.trim().match(/^(\d{2})\d{4,}/);
    if (idMatch) {
      const yr = parseInt(idMatch[1], 10);
      if (yr >= 10 && yr <= 35) {
        return `20${yr}-${(yr + 1).toString().padStart(2, "0")}`;
      }
    }
  }
  return "";
}

const BASE_SESSION_OPTIONS: FilterOption[] = [
  { value: "all", label: "All Sessions" },
  { value: "2024-25", label: "Session 2024-25" },
  { value: "2023-24", label: "Session 2023-24" },
  { value: "2022-23", label: "Session 2022-23" },
  { value: "2021-22", label: "Session 2021-22" },
  { value: "2020-21", label: "Session 2020-21" },
  { value: "2019-20", label: "Session 2019-20" },
  { value: "2018-19", label: "Session 2018-19" },
  { value: "2017-18", label: "Session 2017-18" },
  { value: "2016-17", label: "Session 2016-17" },
  { value: "2015-16", label: "Session 2015-16" },
];

const DEPT_OPTIONS: FilterOption[] = [
  { value: "all", label: "All Departments" },
  { value: "CSE", label: "CSE — Computer Science" },
  { value: "EEE", label: "EEE — Electrical" },
  { value: "ME", label: "ME — Mechanical" },
  { value: "CE", label: "CE — Civil" },
];

const BATCH_OPTIONS: FilterOption[] = [
  { value: "all", label: "All Batches" },
  { value: "1st", label: "1st Batch" },
  { value: "2nd", label: "2nd Batch" },
  { value: "3rd", label: "3rd Batch" },
  { value: "4th", label: "4th Batch" },
  { value: "5th", label: "5th Batch" },
  { value: "6th", label: "6th Batch" },
  { value: "7th", label: "7th Batch" },
  { value: "8th", label: "8th Batch" },
  { value: "9th", label: "9th Batch" },
  { value: "10th", label: "10th Batch" },
  { value: "11th", label: "11th Batch" },
  { value: "12th", label: "12th Batch" },
];

const CAREER_OPTIONS: FilterOption[] = [
  { value: "all", label: "All Careers" },
  { value: "employed", label: "Has Career / Company" },
  { value: "seeking", label: "Seeking Opportunities" },
];

export default function AlumniManagementPage() {
  const { user: currentUser } = useAuth();
  const currentRole = String(currentUser?.role || "").toLowerCase();
  const currentClubRole = String(currentUser?.clubRole || "").toLowerCase();
  const isAdvisor = currentRole === "advisor" || currentClubRole === "advisor";
  const isAdmin = currentRole === "admin";

  const [alumniList, setAlumniList] = useState<AlumniMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSession, setSelectedSession] = useState("all");
  const [selectedDept, setSelectedDept] = useState("all");
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [selectedCareer, setSelectedCareer] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isGradModalOpen, setIsGradModalOpen] = useState(false);
  const [editingAlumni, setEditingAlumni] = useState<AlumniMember | null>(null);
  const [viewingAlumni, setViewingAlumni] = useState<AlumniMember | null>(null);
  const [deletingAlumni, setDeletingAlumni] = useState<AlumniMember | null>(null);

  // Fetch Alumni members: explicitly request tab=all so backend does not default to pending applications
  const fetchAlumni = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/dashboard/members?tab=all&filter=alumni&limit=500`,
        { withCredentials: true }
      );
      if (res.data?.success && Array.isArray(res.data.data?.members)) {
        setAlumniList(res.data.data.members);
      } else {
        // Fallback: fetch active members and filter for alumni or graduated
        const fallbackRes = await axios.get(
          `${API_BASE_URL}/api/dashboard/members?tab=all&limit=500`,
          { withCredentials: true }
        );
        const members: AlumniMember[] = fallbackRes.data?.data?.members || [];
        const alumniOnly = members.filter(
          (m) => m.clubRole === "alumni" || m.role === "alumni" || m.isGraduated
        );
        setAlumniList(alumniOnly);
      }
    } catch (err) {
      console.error("Failed to fetch alumni:", err);
      toast.error("Failed to load alumni list");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlumni();
  }, [fetchAlumni]);

  // Dynamically compile session options based on database records
  const sessionOptions = useMemo<FilterOption[]>(() => {
    const discovered = new Set<string>();
    alumniList.forEach((a) => {
      const s = getMemberSession(a);
      if (s) discovered.add(s);
    });

    const standard = ["2024-25", "2023-24", "2022-23", "2021-22", "2020-21", "2019-20", "2018-19", "2017-18", "2016-17", "2015-16"];
    const all = Array.from(new Set([...standard, ...Array.from(discovered)])).sort().reverse();

    return [
      { value: "all", label: "All Sessions" },
      ...all.map((s) => ({ value: s, label: `Session ${s}` })),
    ];
  }, [alumniList]);

  // Filtered Alumni computation
  const filteredAlumni = useMemo(() => {
    return alumniList.filter((alumni) => {
      // Search filter
      const q = searchQuery.toLowerCase().trim();
      const nameMatch = alumni.fullName?.toLowerCase().includes(q);
      const idMatch = alumni.studentId?.toLowerCase().includes(q);
      const emailMatch = alumni.email?.toLowerCase().includes(q);
      const desigMatch = alumni.designation?.toLowerCase().includes(q);
      const bioMatch = alumni.bio?.toLowerCase().includes(q);
      const sessionMatch = (alumni.session || "").toLowerCase().includes(q);

      if (q && !(nameMatch || idMatch || emailMatch || desigMatch || bioMatch || sessionMatch)) {
        return false;
      }

      // Session filter (Primary unifying cohort)
      if (selectedSession !== "all") {
        const s = getMemberSession(alumni).toLowerCase();
        if (!s.includes(selectedSession.toLowerCase())) return false;
      }

      // Department filter
      if (selectedDept !== "all") {
        if ((alumni.department || "").toUpperCase() !== selectedDept.toUpperCase()) {
          return false;
        }
      }

      // Batch filter
      if (selectedBatch !== "all") {
        const b = (alumni.batch || "").toLowerCase();
        if (!b.includes(selectedBatch.toLowerCase())) return false;
      }

      // Career filter
      if (selectedCareer === "employed") {
        const hasCompany =
          Boolean(alumni.designation && alumni.designation !== "Alumni") ||
          Boolean(alumni.bio && (alumni.bio.includes("@") || alumni.bio.includes("Engineer")));
        if (!hasCompany) return false;
      }

      return true;
    });
  }, [alumniList, searchQuery, selectedSession, selectedDept, selectedBatch, selectedCareer]);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = alumniList.length;
    const employed = alumniList.filter(
      (a) =>
        (a.designation && a.designation !== "Alumni") ||
        (a.bio && (a.bio.includes("@") || a.bio.includes("at") || a.bio.includes("Engineer")))
    ).length;
    const latestGrads = alumniList.filter((a) => {
      const year = a.passingYear || (a.session?.includes("2020") ? 2024 : 0);
      return year >= 2024;
    }).length;
    const mentors = alumniList.filter(
      (a) => a.designation?.toLowerCase().includes("mentor") || a.designation?.toLowerCase().includes("advisor")
    ).length;

    return { total, employed, latestGrads, mentors };
  }, [alumniList]);

  // Export CSV
  const handleExportCSV = () => {
    if (filteredAlumni.length === 0) {
      toast.error("No alumni records to export");
      return;
    }

    const headers = [
      "Full Name",
      "Student ID",
      "Email",
      "Department",
      "Session",
      "Batch",
      "Passing Year",
      "Designation / Role",
      "Contact Number",
    ];

    const rows = filteredAlumni.map((a) => [
      `"${a.fullName || ""}"`,
      `"${a.studentId || ""}"`,
      `"${a.email || ""}"`,
      `"${a.department || ""}"`,
      `"${a.session || getMemberSession(a) || ""}"`,
      `"${a.batch || ""}"`,
      `"${a.passingYear || ""}"`,
      `"${(a.designation || "Alumni").replace(/"/g, '""')}"`,
      `"${a.contactNumber || ""}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `MEC_CC_Alumni_Directory_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Alumni directory exported successfully");
  };

  // Revert Alumni back to Member (safer than permanent delete)
  const handleRevertToMember = async () => {
    if (!deletingAlumni) return;
    try {
      await axios.patch(
        `${API_BASE_URL}/api/users/admin/update/${deletingAlumni._id}`,
        {
          role: "member",
          clubRole: "member",
          isGraduated: false,
          passingYear: null,
          designation:
            deletingAlumni.designation &&
            !deletingAlumni.designation.toLowerCase().includes("alumni")
              ? deletingAlumni.designation
              : "General Member",
        },
        { withCredentials: true }
      );
      logAdminActivity({
        actorName: currentUser?.fullName || "Admin",
        actorEmail: currentUser?.email,
        actorRole: (currentUser?.role as any) || "admin",
        action: "UPDATE",
        targetType: "MEMBER",
        targetTitle: deletingAlumni.fullName,
        description: `${currentUser?.fullName || "Admin"} reverted alumni ${deletingAlumni.fullName} back to member role`,
      });
      toast.success(`${deletingAlumni.fullName} reverted to Member successfully`);
      setAlumniList((prev) => prev.filter((a) => a._id !== deletingAlumni._id));
      setDeletingAlumni(null);
      // Refresh list to update counters accurately
      fetchAlumni();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to revert alumni");
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-default pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 font-mono text-[11px] font-bold tracking-wider uppercase mb-1.5 border border-amber-300 dark:border-amber-700/60">
            <GraduationCap size={13} />
            Alumni &amp; Career Network
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
            Alumni Management
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5 max-w-2xl">
            Track, celebrate, and engage MEC Computer Club graduates across all departments and academic sessions.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-secondary hover:bg-surface-elevated text-text-secondary hover:text-text-primary border-2 border-border-brutalist dark:border-border-default text-xs font-bold shadow-[2px_2px_0px_0px_var(--border-brutalist)] transition cursor-pointer"
          >
            <Download size={14} />
            Export CSV
          </button>

          {isAdmin && (
            <button
              type="button"
              onClick={() => setIsGradModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-100 text-amber-950 hover:bg-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:hover:bg-amber-900/60 border-2 border-border-brutalist dark:border-border-default text-xs font-bold shadow-[2px_2px_0px_0px_var(--border-brutalist)] transition cursor-pointer"
            >
              <GraduationCap size={15} />
              Graduate by Session
            </button>
          )}

          {!isAdvisor && (
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 text-white hover:bg-amber-600 border-2 border-amber-700 text-xs font-bold shadow-[3px_3px_0px_0px_var(--border-brutalist)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <Plus size={15} />
              Add Alumni
            </button>
          )}
        </div>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-elevated rounded-2xl border-2 border-border-brutalist dark:border-border-default p-4 shadow-[4px_4px_0px_0px_var(--border-brutalist)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              Total Alumni
            </span>
            <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center">
              <GraduationCap size={17} />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-text-primary">
              {stats.total}
            </span>
            <p className="text-[11px] text-text-tertiary mt-0.5">
              Verified Club Alumni
            </p>
          </div>
        </div>

        <div className="bg-surface-elevated rounded-2xl border-2 border-border-brutalist dark:border-border-default p-4 shadow-[4px_4px_0px_0px_var(--border-brutalist)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              Employed in Tech
            </span>
            <span className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 flex items-center justify-center">
              <Briefcase size={17} />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-text-primary">
              {stats.employed}
            </span>
            <p className="text-[11px] text-text-tertiary mt-0.5">
              With Recorded Roles
            </p>
          </div>
        </div>

        <div className="bg-surface-elevated rounded-2xl border-2 border-border-brutalist dark:border-border-default p-4 shadow-[4px_4px_0px_0px_var(--border-brutalist)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              Recent Cohorts
            </span>
            <span className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
              <Sparkles size={17} />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-text-primary">
              {stats.latestGrads}
            </span>
            <p className="text-[11px] text-text-tertiary mt-0.5">
              Class of 2024–2026
            </p>
          </div>
        </div>

        <div className="bg-surface-elevated rounded-2xl border-2 border-border-brutalist dark:border-border-default p-4 shadow-[4px_4px_0px_0px_var(--border-brutalist)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              Advisors / Mentors
            </span>
            <span className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center">
              <Award size={17} />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-text-primary">
              {stats.mentors}
            </span>
            <p className="text-[11px] text-text-tertiary mt-0.5">
              Club Mentors &amp; Guides
            </p>
          </div>
        </div>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="bg-surface-elevated rounded-2xl border-2 border-border-brutalist dark:border-border-default p-4 shadow-[4px_4px_0px_0px_var(--border-brutalist)] space-y-3.5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative w-full sm:max-w-md">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary"
              size={15}
            />
            <input
              type="text"
              placeholder="Search by name, student ID, session, company, or role…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-surface-secondary border border-border-default rounded-xl text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-primary"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* View Mode Toggle & Total Count */}
          <div className="flex items-center justify-between w-full sm:w-auto gap-3">
            <span className="text-xs text-text-tertiary font-mono">
              Showing <strong className="text-text-primary">{filteredAlumni.length}</strong> of {alumniList.length}
            </span>
            <div className="flex items-center p-1 bg-surface-secondary border border-border-default rounded-xl gap-0.5">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === "table"
                    ? "bg-accent-primary text-text-primary font-bold shadow-xs"
                    : "text-text-secondary hover:text-text-primary"
                }`}
                title="Table View"
              >
                <List size={15} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === "grid"
                    ? "bg-accent-primary text-text-primary font-bold shadow-xs"
                    : "text-text-secondary hover:text-text-primary"
                }`}
                title="Grid Card View"
              >
                <LayoutGrid size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Dropdowns with Session as Primary Cohort Filter */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border-default/60">
          <div className="w-40 sm:w-44">
            <FilterSelect
              options={sessionOptions}
              value={selectedSession}
              onChange={(val) => setSelectedSession(val)}
              className="w-full"
            />
          </div>

          <div className="w-40 sm:w-44">
            <FilterSelect
              options={DEPT_OPTIONS}
              value={selectedDept}
              onChange={(val) => setSelectedDept(val)}
              className="w-full"
            />
          </div>

          <div className="w-36 sm:w-40">
            <FilterSelect
              options={BATCH_OPTIONS}
              value={selectedBatch}
              onChange={(val) => setSelectedBatch(val)}
              className="w-full"
            />
          </div>

          <div className="w-44 sm:w-48">
            <FilterSelect
              options={CAREER_OPTIONS}
              value={selectedCareer}
              onChange={(val) => setSelectedCareer(val)}
              className="w-full"
            />
          </div>

          {(searchQuery ||
            selectedSession !== "all" ||
            selectedDept !== "all" ||
            selectedBatch !== "all" ||
            selectedCareer !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedSession("all");
                setSelectedDept("all");
                setSelectedBatch("all");
                setSelectedCareer("all");
              }}
              className="inline-flex items-center gap-1 text-xs font-bold text-accent-primary hover:underline ml-auto cursor-pointer"
            >
              <RotateCcw size={12} />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* ── Content View (Table / Cards) ── */}
      {loading ? (
        <div className="py-24 text-center bg-surface-elevated rounded-2xl border-2 border-border-brutalist dark:border-border-default shadow-[4px_4px_0px_0px_var(--border-brutalist)]">
          <Loader2 className="w-8 h-8 animate-spin text-accent-primary mx-auto mb-2" />
          <p className="text-xs text-text-secondary font-semibold">
            Loading alumni records…
          </p>
        </div>
      ) : filteredAlumni.length === 0 ? (
        <div className="py-20 px-4 text-center bg-surface-elevated rounded-2xl border-2 border-dashed border-border-default">
          <GraduationCap className="w-12 h-12 text-accent-primary mx-auto mb-3 opacity-60" />
          <h3 className="text-lg font-bold text-text-primary mb-1">
            No Alumni Records Found
          </h3>
          <p className="text-xs text-text-secondary max-w-md mx-auto mb-4">
            {searchQuery || selectedSession !== "all" || selectedDept !== "all" || selectedBatch !== "all"
              ? "No alumni match your current search or filter criteria. Try adjusting the filters above."
              : "No members have been marked as alumni yet. You can directly add an alumni or promote a graduating session cohort."}
          </p>
          <div className="flex items-center justify-center gap-2">
            {!isAdvisor && (
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 bg-accent-primary text-text-primary rounded-xl font-bold text-xs border border-border-brutalist shadow-[2px_2px_0px_0px_var(--border-brutalist)] hover:translate-x-px hover:translate-y-px transition cursor-pointer"
              >
                + Register Alumni
              </button>
            )}
            {isAdmin && (
              <button
                type="button"
                onClick={() => setIsGradModalOpen(true)}
                className="px-4 py-2 bg-surface-secondary text-text-primary rounded-xl font-bold text-xs border border-border-default hover:bg-surface-elevated transition cursor-pointer"
              >
                Graduate by Session
              </button>
            )}
          </div>
        </div>
      ) : viewMode === "table" ? (
        /* ── Table View ── */
        <div className="bg-surface-elevated rounded-2xl border-2 border-border-brutalist dark:border-border-default shadow-[4px_4px_0px_0px_var(--border-brutalist)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b-2 border-border-brutalist dark:border-border-default bg-surface-secondary/70">
                  <th className="py-3 px-4 font-bold text-text-primary uppercase tracking-wider text-[11px]">
                    Alumni Member
                  </th>
                  <th className="py-3 px-4 font-bold text-text-primary uppercase tracking-wider text-[11px]">
                    Session &amp; Academic Info
                  </th>
                  <th className="py-3 px-4 font-bold text-text-primary uppercase tracking-wider text-[11px]">
                    Career / Designation
                  </th>
                  <th className="py-3 px-4 font-bold text-text-primary uppercase tracking-wider text-[11px]">
                    Status
                  </th>
                  <th className="py-3 px-4 font-bold text-text-primary uppercase tracking-wider text-[11px] text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default/60">
                {filteredAlumni.map((alumni) => {
                  const sessionVal = alumni.session || getMemberSession(alumni);
                  return (
                    <tr
                      key={alumni._id}
                      className="hover:bg-surface-secondary/40 transition-colors group"
                    >
                      {/* Alumni info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <UserAvatarWithFallback
                            initialImageUrl={alumni.imageUrl}
                            imagePosition={alumni.imagePosition}
                            fullName={alumni.fullName}
                            className="w-10 h-10 rounded-xl border border-border-default shrink-0 shadow-xs"
                          />
                          <div className="min-w-0">
                            <Link
                              href={`/profile/${alumni._id}`}
                              className="font-bold text-text-primary group-hover:text-accent-primary transition-colors truncate block text-sm"
                            >
                              {alumni.fullName}
                            </Link>
                            <div className="flex items-center gap-2 text-text-tertiary font-mono text-[11px] mt-0.5">
                              <span>{alumni.studentId || "ALM"}</span>
                              <span>&bull;</span>
                              <span className="truncate max-w-[150px]">{alumni.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Academic & Session info */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-text-primary text-xs">
                              {alumni.department || "CSE"}
                            </span>
                            {sessionVal && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                                Session {sessionVal}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-text-tertiary">
                            <span>{alumni.batch || "Alumni"}</span>
                            <span>&bull;</span>
                            <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                              {alumni.passingYear ? `Passing: ${alumni.passingYear}` : "Graduated"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Career info */}
                      <td className="py-3.5 px-4 max-w-xs">
                        {alumni.designation && alumni.designation !== "Alumni" ? (
                          <div>
                            <span className="font-bold text-text-primary block truncate">
                              {alumni.designation}
                            </span>
                            {alumni.bio && (
                              <span className="text-[11px] text-text-tertiary truncate block">
                                {alumni.bio}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-text-tertiary italic">
                            No industry role recorded
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/60">
                          Graduated
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setViewingAlumni(alumni)}
                            className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition cursor-pointer"
                            title="View Full Profile"
                          >
                            <Eye size={15} />
                          </button>
                          {!isAdvisor && (
                            <button
                              type="button"
                              onClick={() => setEditingAlumni(alumni)}
                              className="p-1.5 rounded-lg text-text-secondary hover:text-accent-primary hover:bg-surface-secondary transition cursor-pointer"
                              title="Edit Career Info"
                            >
                              <Edit3 size={15} />
                            </button>
                          )}
                          <Link
                            href={`/profile/${alumni._id}`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-text-secondary hover:text-accent-primary hover:bg-surface-secondary transition"
                            title="Open Public Profile"
                          >
                            <ExternalLink size={15} />
                          </Link>
                          {isAdmin && (
                            <button
                              type="button"
                              onClick={() => setDeletingAlumni(alumni)}
                              className="p-1.5 rounded-lg text-text-secondary hover:text-amber-600 hover:bg-amber-500/10 transition cursor-pointer"
                              title="Revert to Member"
                            >
                              <UserMinus size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ── Grid Card View ── */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAlumni.map((alumni) => {
            const sessionVal = alumni.session || getMemberSession(alumni);
            return (
              <div
                key={alumni._id}
                className="bg-surface-elevated rounded-2xl border-2 border-border-brutalist dark:border-border-default p-4 shadow-[4px_4px_0px_0px_var(--border-brutalist)] flex flex-col justify-between group hover:-translate-y-0.5 transition-all"
              >
                <div>
                  {/* Top card row */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <UserAvatarWithFallback
                      initialImageUrl={alumni.imageUrl}
                      imagePosition={alumni.imagePosition}
                      fullName={alumni.fullName}
                      className="w-12 h-12 rounded-xl border border-border-default shrink-0 shadow-xs"
                    />
                    <div className="flex flex-col items-end gap-1">
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-950 dark:bg-amber-950/60 dark:text-amber-300 font-mono text-[10px] font-bold border border-amber-300 dark:border-amber-700/60">
                        {alumni.passingYear ? `Passing: ${alumni.passingYear}` : "Graduated"}
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-mono font-bold text-text-primary">
                          {alumni.department || "CSE"}
                        </span>
                        {sessionVal && (
                          <span className="text-[10px] font-mono text-text-tertiary">
                            &bull; {sessionVal}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Name & Title */}
                  <h3 className="text-base font-bold text-text-primary group-hover:text-accent-primary transition-colors truncate mb-1">
                    {alumni.fullName}
                  </h3>

                  {/* Career Callout */}
                  <div className="p-2.5 bg-surface-secondary rounded-xl border border-border-default/60 mb-3 text-xs">
                    <div className="flex items-center gap-1.5 text-text-primary font-bold truncate">
                      <Briefcase size={13} className="text-accent-primary shrink-0" />
                      <span className="truncate">
                        {alumni.designation && alumni.designation !== "Alumni"
                          ? alumni.designation
                          : "Alumni Member"}
                      </span>
                    </div>
                    {alumni.bio && (
                      <p className="text-[11px] text-text-tertiary line-clamp-2 mt-1 leading-relaxed">
                        {alumni.bio}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer row */}
                <div className="pt-3 border-t border-border-default/60 flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] text-text-tertiary truncate">
                    ID: {alumni.studentId || "ALM"}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setViewingAlumni(alumni)}
                      className="p-1 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition cursor-pointer"
                      title="View Full Profile"
                    >
                      <Eye size={15} />
                    </button>
                    {!isAdvisor && (
                      <button
                        type="button"
                        onClick={() => setEditingAlumni(alumni)}
                        className="p-1 rounded-lg text-text-secondary hover:text-accent-primary hover:bg-surface-secondary transition cursor-pointer"
                        title="Edit Career Info"
                      >
                        <Edit3 size={15} />
                      </button>
                    )}
                    <Link
                      href={`/profile/${alumni._id}`}
                      target="_blank"
                      className="p-1 rounded-lg text-text-secondary hover:text-accent-primary hover:bg-surface-secondary transition"
                      title="Open Public Profile"
                    >
                      <ExternalLink size={15} />
                    </Link>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => setDeletingAlumni(alumni)}
                        className="p-1 rounded-lg text-text-secondary hover:text-amber-600 hover:bg-amber-500/10 transition cursor-pointer"
                        title="Revert to Member"
                      >
                        <UserMinus size={15} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── MODAL 1: ADD ALUMNI ── */}
      {isAddModalOpen && (
        <AddAlumniModal
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => {
            setIsAddModalOpen(false);
            fetchAlumni();
          }}
          currentUser={currentUser}
        />
      )}

      {/* ── MODAL 2: BATCH GRADUATION BY SESSION ── */}
      {isGradModalOpen && (
        <BatchGraduationModal
          onClose={() => setIsGradModalOpen(false)}
          onSuccess={() => {
            setIsGradModalOpen(false);
            fetchAlumni();
          }}
          currentUser={currentUser}
        />
      )}

      {/* ── MODAL 3: EDIT ALUMNI CAREER ── */}
      {editingAlumni && (
        <EditAlumniModal
          alumni={editingAlumni}
          onClose={() => setEditingAlumni(null)}
          onSuccess={() => {
            setEditingAlumni(null);
            fetchAlumni();
          }}
          currentUser={currentUser}
        />
      )}

      {/* ── MODAL 4: VIEW ALUMNI PROFILE ── */}
      {viewingAlumni && (
        <ViewAlumniModal
          alumni={viewingAlumni}
          onClose={() => setViewingAlumni(null)}
          onEdit={
            !isAdvisor
              ? () => {
                  const target = viewingAlumni;
                  setViewingAlumni(null);
                  setEditingAlumni(target);
                }
              : undefined
          }
        />
      )}

      {/* ── MODAL 5: DELETE CONFIRMATION ── */}
      {deletingAlumni && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-surface-elevated border-2 border-border-brutalist dark:border-border-default rounded-2xl max-w-sm w-full p-5 shadow-[6px_6px_0px_0px_var(--border-brutalist)]">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/50 text-amber-600">
                <UserMinus size={18} />
              </span>
              <h3 className="text-base font-bold text-text-primary">Revert to Member?</h3>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed mb-1">
              This will change{" "}
              <strong className="text-text-primary font-bold">
                {deletingAlumni.fullName}
              </strong>
              's role from <span className="font-bold text-amber-600">Alumni</span> back to{" "}
              <span className="font-bold text-accent-primary">Member</span>.
            </p>
            <p className="text-[11px] text-text-tertiary mb-4">
              Their account and profile data will be preserved. You can re-upgrade them to alumni later.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingAlumni(null)}
                className="px-3.5 py-1.5 rounded-xl border border-border-default text-xs font-bold hover:bg-surface-secondary cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRevertToMember}
                className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Revert to Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MODAL 1: ADD ALUMNI COMPONENT
───────────────────────────────────────────────────────────── */
function AddAlumniModal({
  onClose,
  onSuccess,
  currentUser,
}: {
  onClose: () => void;
  onSuccess: () => void;
  currentUser: any;
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    studentId: `ALM-${Date.now().toString().slice(-4)}`,
    department: "CSE",
    session: "2019-20",
    batch: "8th Batch",
    passingYear: String(new Date().getFullYear()),
    designation: "Software Engineer",
    contactNumber: "",
    bio: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim()) {
      toast.error("Name and Email are required");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${API_BASE_URL}/api/users/admin/create-member`,
        {
          ...formData,
          role: "alumni",
          clubRole: "alumni",
          isGraduated: true,
          passingYear: Number(formData.passingYear) || undefined,
        },
        { withCredentials: true }
      );

      logAdminActivity({
        actorName: currentUser?.fullName || "Admin",
        actorEmail: currentUser?.email,
        actorRole: (currentUser?.role as any) || "admin",
        action: "CREATE",
        targetType: "MEMBER",
        targetTitle: formData.fullName,
        description: `${currentUser?.fullName || "Admin"} added new alumni: ${formData.fullName} (Session ${formData.session}, ${formData.department})`,
      });

      toast.success("Alumni member registered successfully!");
      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create alumni");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-surface-elevated border-2 border-border-brutalist dark:border-border-default rounded-2xl max-w-lg w-full p-6 shadow-[6px_6px_0px_0px_var(--border-brutalist)] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-border-default pb-3 mb-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="text-amber-500" size={20} />
            <h2 className="text-base font-bold text-text-primary">
              Register New Alumni
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-text-tertiary hover:text-text-primary cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-text-secondary block mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="e.g. Tanvir Rahman"
              className="w-full px-3 py-2 bg-surface-secondary border border-border-default rounded-xl focus:outline-none focus:border-accent-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-text-secondary block mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="alumni@example.com"
                className="w-full px-3 py-2 bg-surface-secondary border border-border-default rounded-xl focus:outline-none focus:border-accent-primary"
              />
            </div>
            <div>
              <label className="font-bold text-text-secondary block mb-1">
                Student ID / Alumni ID
              </label>
              <input
                type="text"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                className="w-full px-3 py-2 bg-surface-secondary border border-border-default rounded-xl focus:outline-none focus:border-accent-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="font-bold text-text-secondary block mb-1">
                Department
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="CSE / EEE / CE"
                className="w-full px-3 py-2 bg-surface-secondary border border-border-default rounded-xl focus:outline-none focus:border-accent-primary"
              />
            </div>
            <div>
              <label className="font-bold text-text-secondary block mb-1">
                Academic Session
              </label>
              <input
                type="text"
                value={formData.session}
                onChange={(e) => setFormData({ ...formData, session: e.target.value })}
                placeholder="e.g. 2019-20"
                className="w-full px-3 py-2 bg-surface-secondary border border-border-default rounded-xl font-mono focus:outline-none focus:border-accent-primary"
              />
            </div>
            <div>
              <label className="font-bold text-text-secondary block mb-1">
                Dept Batch
              </label>
              <input
                type="text"
                value={formData.batch}
                onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                placeholder="e.g. 8th Batch"
                className="w-full px-3 py-2 bg-surface-secondary border border-border-default rounded-xl focus:outline-none focus:border-accent-primary"
              />
            </div>
            <div>
              <label className="font-bold text-text-secondary block mb-1">
                Passing Year
              </label>
              <input
                type="number"
                value={formData.passingYear}
                onChange={(e) => setFormData({ ...formData, passingYear: e.target.value })}
                placeholder="2024"
                className="w-full px-3 py-2 bg-surface-secondary border border-border-default rounded-xl font-mono focus:outline-none focus:border-accent-primary"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-text-secondary block mb-1">
              Current Job Title &amp; Company
            </label>
            <input
              type="text"
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              placeholder="e.g. Software Engineer @ Google or Founder @ TechStartup"
              className="w-full px-3 py-2 bg-surface-secondary border border-border-default rounded-xl focus:outline-none focus:border-accent-primary"
            />
          </div>

          <div>
            <label className="font-bold text-text-secondary block mb-1">
              Contact Number / WhatsApp
            </label>
            <input
              type="text"
              value={formData.contactNumber}
              onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
              placeholder="+88017xxxxxxxx"
              className="w-full px-3 py-2 bg-surface-secondary border border-border-default rounded-xl focus:outline-none focus:border-accent-primary"
            />
          </div>

          <div>
            <label className="font-bold text-text-secondary block mb-1">
              Career Highlights / Bio
            </label>
            <textarea
              rows={2}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Key accomplishments, former club leadership, tech stack…"
              className="w-full px-3 py-2 bg-surface-secondary border border-border-default rounded-xl focus:outline-none focus:border-accent-primary"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-border-default">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border-default font-bold hover:bg-surface-secondary cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-accent-primary text-text-primary font-bold border border-border-brutalist shadow-[2px_2px_0px_0px_var(--border-brutalist)] hover:opacity-95 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
            >
              {loading && <Loader2 size={13} className="animate-spin" />}
              Save Alumni
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MODAL 2: BATCH GRADUATION BY ACADEMIC SESSION COMPONENT
   Solves multi-department cohort graduation where different departments
   have different batch numbers for the exact same graduating session.
───────────────────────────────────────────────────────────── */
function BatchGraduationModal({
  onClose,
  onSuccess,
  currentUser,
}: {
  onClose: () => void;
  onSuccess: () => void;
  currentUser: any;
}) {
  const [loading, setLoading] = useState(false);
  const [fetchingMembers, setFetchingMembers] = useState(true);
  const [candidates, setCandidates] = useState<AlumniMember[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [targetSessionFilter, setTargetSessionFilter] = useState("all");
  const [targetDeptFilter, setTargetDeptFilter] = useState("all");
  const [searchFilter, setSearchFilter] = useState("");
  const [passingYear, setPassingYear] = useState(String(new Date().getFullYear()));

  // Fetch regular active members who are eligible to graduate (explicitly tab=all)
  useEffect(() => {
    async function loadMembers() {
      setFetchingMembers(true);
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/dashboard/members?tab=all&filter=all&limit=500`,
          { withCredentials: true }
        );
        const all: AlumniMember[] = res.data?.data?.members || [];
        // Only active members who aren't already graduated / alumni
        const activeOnly = all.filter(
          (m) => m.clubRole !== "alumni" && m.role !== "alumni" && !m.isGraduated
        );
        setCandidates(activeOnly);
      } catch (err) {
        console.error("Failed to load candidates for graduation:", err);
        toast.error("Failed to load active members list");
      } finally {
        setFetchingMembers(false);
      }
    }
    loadMembers();
  }, []);

  // Dynamically extract all available sessions from the loaded candidate members
  const modalSessionOptions = useMemo<FilterOption[]>(() => {
    const discovered = new Set<string>();
    candidates.forEach((c) => {
      const s = getMemberSession(c);
      if (s) discovered.add(s);
    });

    const standard = ["2024-25", "2023-24", "2022-23", "2021-22", "2020-21", "2019-20", "2018-19", "2017-18"];
    const all = Array.from(new Set([...standard, ...Array.from(discovered)])).sort().reverse();

    return [
      { value: "all", label: "All Academic Sessions" },
      ...all.map((s) => ({ value: s, label: `Session ${s}` })),
    ];
  }, [candidates]);

  // Handle Session selection and auto-suggest the appropriate 4-year engineering passing year
  const handleSessionChange = (sess: string) => {
    setTargetSessionFilter(sess);
    if (sess !== "all") {
      const match = sess.match(/(\d{4})/);
      if (match) {
        const startYr = parseInt(match[1], 10);
        // In Bangladesh 4-year engineering, Session 2019-20 graduates in 2024
        setPassingYear(String(startYr + 4));
      }
    }
  };

  const displayedCandidates = useMemo(() => {
    return candidates.filter((c) => {
      // Session filter
      if (targetSessionFilter !== "all") {
        const s = getMemberSession(c).toLowerCase();
        if (!s.includes(targetSessionFilter.toLowerCase())) return false;
      }

      // Department filter
      if (targetDeptFilter !== "all") {
        if ((c.department || "").toUpperCase() !== targetDeptFilter.toUpperCase()) {
          return false;
        }
      }

      // Search filter
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase().trim();
        const matchName = c.fullName?.toLowerCase().includes(q);
        const matchId = c.studentId?.toLowerCase().includes(q);
        const matchEmail = c.email?.toLowerCase().includes(q);
        if (!matchName && !matchId && !matchEmail) return false;
      }

      return true;
    });
  }, [candidates, targetSessionFilter, targetDeptFilter, searchFilter]);

  const toggleSelectAll = () => {
    if (selectedIds.size === displayedCandidates.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(displayedCandidates.map((c) => c._id)));
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleGraduateBatch = async () => {
    if (selectedIds.size === 0) {
      toast.error("Please select at least one member to graduate");
      return;
    }

    setLoading(true);
    let successCount = 0;
    try {
      const year = Number(passingYear) || new Date().getFullYear();

      for (const id of Array.from(selectedIds)) {
        const member = candidates.find((c) => c._id === id);
        const sessionToSave = targetSessionFilter !== "all"
          ? targetSessionFilter
          : (member ? getMemberSession(member) || member.session : undefined);

        await axios.patch(
          `${API_BASE_URL}/api/users/admin/update/${id}`,
          {
            clubRole: "alumni",
            role: "alumni",
            isGraduated: true,
            passingYear: year,
            ...(sessionToSave ? { session: sessionToSave } : {}),
          },
          { withCredentials: true }
        );
        successCount++;
      }

      const cohortDesc = targetSessionFilter !== "all" ? `Session ${targetSessionFilter}` : "Selected Cohort";
      logAdminActivity({
        actorName: currentUser?.fullName || "Admin",
        actorEmail: currentUser?.email,
        actorRole: (currentUser?.role as any) || "admin",
        action: "STATUS_CHANGE",
        targetType: "MEMBER",
        targetTitle: `${successCount} members`,
        description: `${currentUser?.fullName || "Admin"} graduated ${successCount} members to Alumni - ${cohortDesc} (Passing: ${year})`,
      });

      toast.success(
        `Successfully graduated ${successCount} member${successCount > 1 ? "s" : ""} to Alumni!`
      );
      onSuccess();
    } catch (err: any) {
      toast.error("Some members could not be updated. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-surface-elevated border-2 border-border-brutalist dark:border-border-default rounded-2xl max-w-xl w-full p-6 shadow-[6px_6px_0px_0px_var(--border-brutalist)] max-h-[92vh] flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border-default pb-3 mb-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="text-amber-500" size={22} />
              <div>
                <h2 className="text-base font-bold text-text-primary leading-none">
                  Graduate Members by Academic Session
                </h2>
                <p className="text-[11px] text-text-tertiary mt-1">
                  MEC departments share the same academic session despite differing department batch numbers.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 text-text-tertiary hover:text-text-primary cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Filters: Session, Department, Passing Year */}
          <div className="space-y-3 mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-text-secondary block mb-1">
                  Academic Session *
                </label>
                <FilterSelect
                  options={modalSessionOptions}
                  value={targetSessionFilter}
                  onChange={handleSessionChange}
                  className="w-full"
                />
              </div>

              <div>
                <label className="font-bold text-text-secondary block mb-1">
                  Department
                </label>
                <FilterSelect
                  options={DEPT_OPTIONS}
                  value={targetDeptFilter}
                  onChange={(val) => setTargetDeptFilter(val)}
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-text-secondary block mb-1">
                  Search Candidate Member
                </label>
                <div className="relative">
                  <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
                  <input
                    type="text"
                    placeholder="Search by name or student ID…"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-surface-secondary border border-border-default rounded-xl font-mono text-xs focus:outline-none focus:border-accent-primary"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-text-secondary block mb-1">
                  Target Passing Year
                </label>
                <input
                  type="number"
                  value={passingYear}
                  onChange={(e) => setPassingYear(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-secondary border border-border-default rounded-xl font-mono text-xs focus:outline-none focus:border-accent-primary"
                />
              </div>
            </div>
          </div>

          {/* Member candidate checklist */}
          <div className="border border-border-default rounded-xl overflow-hidden mb-4">
            <div className="p-2.5 bg-surface-secondary/80 border-b border-border-default flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5">
                <span>Eligible Candidates ({displayedCandidates.length})</span>
                {targetSessionFilter !== "all" && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 font-mono text-[10px] font-bold border border-amber-500/30">
                    Session {targetSessionFilter}
                  </span>
                )}
              </span>
              <button
                type="button"
                onClick={toggleSelectAll}
                className="text-accent-primary hover:underline cursor-pointer"
              >
                {selectedIds.size === displayedCandidates.length && displayedCandidates.length > 0
                  ? "Deselect All"
                  : "Select All"}
              </button>
            </div>

            <div className="max-h-52 overflow-y-auto divide-y divide-border-default/50 p-1.5 space-y-1">
              {fetchingMembers ? (
                <div className="py-10 text-center text-xs text-text-tertiary">
                  <Loader2 size={18} className="animate-spin mx-auto mb-1.5 text-accent-primary" />
                  Loading candidate members from active roster…
                </div>
              ) : displayedCandidates.length === 0 ? (
                <div className="py-8 text-center text-xs text-text-tertiary px-4">
                  <p className="font-semibold text-text-secondary mb-1">No active members found</p>
                  <p className="text-[11px]">
                    {targetSessionFilter !== "all"
                      ? `No non-alumni members match Session "${targetSessionFilter}". Try selecting "All Academic Sessions".`
                      : "All registered members have already graduated or no active members are found."}
                  </p>
                </div>
              ) : (
                displayedCandidates.map((m) => {
                  const sess = getMemberSession(m) || m.session || "N/A";
                  const isChecked = selectedIds.has(m._id);
                  return (
                    <label
                      key={m._id}
                      className={`flex items-center gap-3 p-2 rounded-xl border transition-all cursor-pointer ${
                        isChecked
                          ? "bg-accent-primary/10 border-accent-primary"
                          : "bg-surface-secondary/40 border-border-default/50 hover:bg-surface-secondary"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSelect(m._id)}
                        className="rounded accent-accent-primary w-4 h-4 cursor-pointer shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="font-bold text-text-primary text-xs truncate">
                            {m.fullName}
                          </p>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-surface-elevated text-text-secondary border border-border-default">
                            {m.department || "Dept"}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                            Session {sess}
                          </span>
                        </div>
                        <p className="text-[10px] text-text-tertiary font-mono mt-0.5">
                          ID: {m.studentId || "N/A"} {m.batch ? `• Batch: ${m.batch}` : ""} • {m.email}
                        </p>
                      </div>
                    </label>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-border-default flex items-center justify-between">
          <span className="text-xs font-semibold text-text-secondary">
            <strong className="text-text-primary">{selectedIds.size}</strong> member{selectedIds.size === 1 ? "" : "s"} selected for graduation
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border-default font-bold text-xs hover:bg-surface-secondary cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleGraduateBatch}
              disabled={loading || selectedIds.size === 0}
              className="px-4 py-2 rounded-xl bg-amber-200 text-amber-950 hover:bg-amber-300 font-bold text-xs border border-border-brutalist shadow-[2px_2px_0px_0px_var(--border-brutalist)] hover:opacity-95 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
            >
              {loading && <Loader2 size={13} className="animate-spin" />}
              Graduate Selected &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MODAL 3: EDIT ALUMNI CAREER COMPONENT
───────────────────────────────────────────────────────────── */
function EditAlumniModal({
  alumni,
  onClose,
  onSuccess,
  currentUser,
}: {
  alumni: AlumniMember;
  onClose: () => void;
  onSuccess: () => void;
  currentUser: any;
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    designation: alumni.designation || "Alumni",
    department: alumni.department || "CSE",
    session: alumni.session || getMemberSession(alumni) || "2019-20",
    batch: alumni.batch || "",
    passingYear: alumni.passingYear ? String(alumni.passingYear) : "2024",
    contactNumber: alumni.contactNumber || "",
    bio: alumni.bio || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.patch(
        `${API_BASE_URL}/api/users/admin/update/${alumni._id}`,
        {
          ...formData,
          passingYear: formData.passingYear ? Number(formData.passingYear) : undefined,
          isGraduated: true,
          clubRole: "alumni",
          role: "alumni",
        },
        { withCredentials: true }
      );

      logAdminActivity({
        actorName: currentUser?.fullName || "Admin",
        actorEmail: currentUser?.email,
        actorRole: (currentUser?.role as any) || "admin",
        action: "UPDATE",
        targetType: "MEMBER",
        targetTitle: alumni.fullName,
        description: `${currentUser?.fullName || "Admin"} updated alumni academic & career info for ${alumni.fullName}`,
      });

      toast.success("Alumni profile updated successfully!");
      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update alumni");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-surface-elevated border-2 border-border-brutalist dark:border-border-default rounded-2xl max-w-md w-full p-6 shadow-[6px_6px_0px_0px_var(--border-brutalist)]">
        <div className="flex items-center justify-between border-b border-border-default pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Edit3 className="text-accent-primary" size={18} />
            <h2 className="text-base font-bold text-text-primary">
              Edit Career &amp; Academic Info
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-text-tertiary hover:text-text-primary cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-text-secondary block mb-1">
              Current Job Title &amp; Company
            </label>
            <input
              type="text"
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              placeholder="e.g. Senior Software Engineer @ Pathao"
              className="w-full px-3 py-2 bg-surface-secondary border border-border-default rounded-xl focus:outline-none focus:border-accent-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-text-secondary block mb-1">
                Department
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 bg-surface-secondary border border-border-default rounded-xl focus:outline-none focus:border-accent-primary"
              />
            </div>
            <div>
              <label className="font-bold text-text-secondary block mb-1">
                Academic Session
              </label>
              <input
                type="text"
                value={formData.session}
                onChange={(e) => setFormData({ ...formData, session: e.target.value })}
                placeholder="e.g. 2019-20"
                className="w-full px-3 py-2 bg-surface-secondary border border-border-default rounded-xl font-mono focus:outline-none focus:border-accent-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-text-secondary block mb-1">
                Department Batch
              </label>
              <input
                type="text"
                value={formData.batch}
                onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                className="w-full px-3 py-2 bg-surface-secondary border border-border-default rounded-xl focus:outline-none focus:border-accent-primary"
              />
            </div>
            <div>
              <label className="font-bold text-text-secondary block mb-1">
                Passing Year
              </label>
              <input
                type="number"
                value={formData.passingYear}
                onChange={(e) => setFormData({ ...formData, passingYear: e.target.value })}
                className="w-full px-3 py-2 bg-surface-secondary border border-border-default rounded-xl font-mono focus:outline-none focus:border-accent-primary"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-text-secondary block mb-1">
              Contact Number
            </label>
            <input
              type="text"
              value={formData.contactNumber}
              onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
              className="w-full px-3 py-2 bg-surface-secondary border border-border-default rounded-xl focus:outline-none focus:border-accent-primary"
            />
          </div>

          <div>
            <label className="font-bold text-text-secondary block mb-1">
              Bio / Achievements
            </label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3 py-2 bg-surface-secondary border border-border-default rounded-xl focus:outline-none focus:border-accent-primary"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-border-default">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border-default font-bold hover:bg-surface-secondary cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-xl bg-accent-primary text-text-primary font-bold border border-border-brutalist shadow-[2px_2px_0px_0px_var(--border-brutalist)] hover:opacity-95 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
            >
              {loading && <Loader2 size={13} className="animate-spin" />}
              Update Alumni
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MODAL 4: VIEW ALUMNI DETAIL DRAWER COMPONENT
───────────────────────────────────────────────────────────── */
function ViewAlumniModal({
  alumni,
  onClose,
  onEdit,
}: {
  alumni: AlumniMember;
  onClose: () => void;
  onEdit?: () => void;
}) {
  const sessionVal = alumni.session || getMemberSession(alumni);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-surface-elevated border-2 border-border-brutalist dark:border-border-default rounded-2xl max-w-lg w-full p-6 shadow-[6px_6px_0px_0px_var(--border-brutalist)] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-border-default pb-3 mb-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="text-amber-500" size={20} />
            <h2 className="text-base font-bold text-text-primary">
              Alumni Profile Details
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-text-tertiary hover:text-text-primary cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Profile Card Header */}
        <div className="flex items-center gap-4 p-4 bg-surface-secondary rounded-2xl border border-border-default mb-4">
          <UserAvatarWithFallback
            initialImageUrl={alumni.imageUrl}
            imagePosition={alumni.imagePosition}
            fullName={alumni.fullName}
            className="w-16 h-16 rounded-2xl border-2 border-border-default shrink-0 shadow-sm"
          />
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-text-primary truncate">
              {alumni.fullName}
            </h3>
            <p className="text-xs font-semibold text-accent-primary truncate">
              {alumni.designation || "Club Alumni"}
            </p>
            <p className="text-[11px] font-mono text-text-tertiary mt-0.5">
              ID: {alumni.studentId || "N/A"} &bull; {alumni.department || "CSE"}
            </p>
          </div>
        </div>

        {/* Detail specs */}
        <div className="grid grid-cols-2 gap-3 text-xs mb-4">
          <div className="p-3 bg-surface-secondary/60 rounded-xl border border-border-default/60">
            <span className="text-[10px] uppercase font-bold text-text-tertiary block mb-1">
              Academic Session
            </span>
            <p className="font-bold text-text-primary">
              {sessionVal ? `Session ${sessionVal}` : "N/A"}
            </p>
          </div>

          <div className="p-3 bg-surface-secondary/60 rounded-xl border border-border-default/60">
            <span className="text-[10px] uppercase font-bold text-text-tertiary block mb-1">
              Department &amp; Batch
            </span>
            <p className="font-bold text-text-primary">
              {alumni.department || "CSE"} &bull; {alumni.batch || "Alumni"}
            </p>
          </div>

          <div className="p-3 bg-surface-secondary/60 rounded-xl border border-border-default/60">
            <span className="text-[10px] uppercase font-bold text-text-tertiary block mb-1">
              Passing Year
            </span>
            <p className="font-bold text-text-primary">
              {alumni.passingYear || "Graduated"}
            </p>
          </div>

          <div className="p-3 bg-surface-secondary/60 rounded-xl border border-border-default/60">
            <span className="text-[10px] uppercase font-bold text-text-tertiary block mb-1">
              Email Address
            </span>
            <p className="font-bold text-text-primary truncate">
              {alumni.email || "N/A"}
            </p>
          </div>

          <div className="p-3 bg-surface-secondary/60 rounded-xl border border-border-default/60 col-span-2">
            <span className="text-[10px] uppercase font-bold text-text-tertiary block mb-1">
              Contact Number / WhatsApp
            </span>
            <p className="font-bold text-text-primary truncate">
              {alumni.contactNumber || "N/A"}
            </p>
          </div>
        </div>

        {alumni.bio && (
          <div className="p-3.5 bg-surface-secondary/60 rounded-xl border border-border-default/60 mb-4 text-xs">
            <span className="text-[10px] uppercase font-bold text-text-tertiary block mb-1">
              Bio &amp; Achievements
            </span>
            <p className="text-text-secondary leading-relaxed">
              {alumni.bio}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-border-default">
          <Link
            href={`/profile/${alumni._id}`}
            target="_blank"
            className="text-xs font-bold text-accent-primary hover:underline flex items-center gap-1"
          >
            Open Public Profile <ExternalLink size={12} />
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl border border-border-default text-xs font-bold hover:bg-surface-secondary cursor-pointer"
            >
              Close
            </button>
            {onEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="px-4 py-1.5 rounded-xl bg-accent-primary text-text-primary text-xs font-bold border border-border-brutalist shadow-[2px_2px_0px_0px_var(--border-brutalist)] cursor-pointer"
              >
                Edit Career Info
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
