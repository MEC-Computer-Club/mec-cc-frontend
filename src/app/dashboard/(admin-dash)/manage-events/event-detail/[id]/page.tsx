"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";
import MultiFileUpload, { UploadedFile } from "@/components/ui/shared/MultiFileUpload";
import {
  ArrowLeft, Calendar, MapPin, Tag, Users, Trophy, Building2,
  Image as ImageIcon, Award, Search, X, Plus, Trash2, Check,
  AlertCircle, Clock, Mail, User, Loader2,
  ExternalLink, Edit, Star, Printer, Eye, Copy, Share2, Sparkles, CheckCircle2,
  FileCheck, ShieldAlert, UserCheck, Play, Video, Maximize2, ClipboardPaste, Film, ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import FilterSelect from "@/app/dashboard/components/FilterSelect";
import { CertificateTemplatePreviewModal } from "@/components/certificates/CertificateTemplatePreviewModal";
import { TemplateItem } from "@/components/certificates/CertificateTemplateCard";
import { interpolateCertificateHtml } from "@/lib/utils/templateInterpolation";
import { getOptimizedImageUrl, getYoutubeEmbedUrl, getYoutubeThumbnail } from "@/lib/api/gallery";
import { API_BASE_URL } from "@/lib/api";
import { useRoleGuard } from "@/hooks/useRoleGuard";
import EventFormSubmissionsSection from "../../components/EventFormSubmissionsSection";
import EventMailingTab from "../../components/EventMailingTab";

const API = `${API_BASE_URL}/api`;

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
export interface ContributorItem {
  _id?: string;
  name: string;
  role: string;
  department?: string;
  studentId?: string;
  email?: string;
  userId?: any;
  avatarUrl?: string;
}

interface UserRef {
  _id: string;
  fullName: string;
  email: string;
  imageUrl?: string;
  studentId?: string;
  department?: string;
  batch?: string;
}

interface PendingParticipant {
  _id: string;
  userId?: UserRef;
  teamName?: string;
  leaderName?: string;
  leaderEmail?: string;
  leaderPhone?: string;
  leaderStudentId?: string;
  inGameId?: string;
  members?: {
    fullName: string;
    studentId?: string;
    email?: string;
    phone?: string;
    inGameId?: string;
    department?: string;
  }[];
  registeredAt: string;
}

interface ApprovedParticipant {
  _id?: string;
  userId?: UserRef;
  fullName: string;
  email: string;
  studentId?: string;
  department?: string;
  phone?: string;
  teamName?: string;
  isCaptain?: boolean;
  approvedAt?: string;
}

interface Winner {
  _id: string;
  teamName?: string;
  members: UserRef[];
  position: string;
  prize?: string;
}

interface EventSponsor {
  _id: string;
  sponsorId: string;
  sponsorName: string;
  logoUrl?: string;
  tier?: string;
}

interface MediaItem {
  _id: string;
  title: string;
  url: string;
  mediaType: "image" | "video";
}

interface Certificate {
  _id: string;
  certificateId: string;
  name: string;
  description?: string;
  type: string;
  position?: string;
  issueDate: string;
  status?: string;
  digitalUrl?: string;
  recipient?: {
    _id?: string;
    fullName: string;
    studentId?: string;
    email?: string;
    department?: string;
    batch?: string;
  };
  recipientName?: string;
  recipientEmail?: string;
  recipientStudentId?: string;
  recipientDepartment?: string;
  template?: TemplateItem;
}

interface EventData {
  _id: string;
  title: string;
  description: string;
  date: string;
  endDate?: string;
  eventTime?: string;
  location: string;
  category: string;
  status: string;
  tags: string[];
  organizer?: string;
  contactEmail?: string;
  coverImageUrl?: string;
  attendees: UserRef[];
  approvedParticipants?: ApprovedParticipant[];
  pendingParticipants: PendingParticipant[];
  approvedCount?: number;
  pendingCount?: number;
  allowParticipationClaims?: boolean;
  participationClaims?: Array<{
    _id: string;
    userId?: UserRef;
    fullName: string;
    email: string;
    studentId?: string;
    department?: string;
    phone?: string;
    role: string;
    notes?: string;
    status: "pending" | "approved" | "rejected";
    claimedAt: string;
    reviewedAt?: string;
  }>;
  contributors?: ContributorItem[];
  winners: Winner[];
  eventSponsors: EventSponsor[];
  media: MediaItem[];
  certificates: Certificate[];
  linkedForm?: any;
}

interface SponsorOption {
  _id: string;
  name: string;
  logoUrl?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants & helpers
// ─────────────────────────────────────────────────────────────────────────────
const TAG_COLORS = [
  "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  "bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300",
  "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300",
];
const tagColor = (t: string) => TAG_COLORS[t.charCodeAt(0) % TAG_COLORS.length];

const TIER_COLORS: Record<string, string> = {
  Gold: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  Silver: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
  Bronze: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  Partner: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
};

const STATUS_COLORS: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  ongoing: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  completed: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  postponed: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
};

const CERT_TYPE_COLORS: Record<string, string> = {
  participation: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  winner: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  completion: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  achievement: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
};

const WINNER_CATEGORIES = ["contest", "hackathon", "gaming", "other"];
const TIERS = ["Gold", "Silver", "Bronze", "Partner"];
const CERT_TYPES = ["participation", "winner", "completion", "achievement"];

function fmtDate(d?: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared sub-components (all at module scope to prevent focus loss)
// ─────────────────────────────────────────────────────────────────────────────

function Toast({ msg, type }: { msg: string; type: "success" | "error" }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl text-sm font-medium
      ${type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
      {type === "success" ? <Check size={15} /> : <AlertCircle size={15} />}
      {msg}
    </div>
  );
}

function Avatar({ user, size = 36, fallbackName }: { user?: UserRef | any; size?: number; fallbackName?: string }) {
  const imageUrl = typeof user === "object" && user !== null ? user.imageUrl || user.avatarUrl : undefined;
  const name =
    (typeof user === "object" && user !== null ? user.fullName || user.name : "") ||
    fallbackName ||
    (typeof user === "string" ? user : "") ||
    "User";
  const initial = (name.trim().charAt(0) || "U").toUpperCase();

  if (imageUrl) {
    return (
      <div
        className="relative flex-shrink-0 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700"
        style={{ width: size, height: size }}
      >
        <Image src={imageUrl} alt={name} fill style={{ objectFit: "cover" }} unoptimized />
      </div>
    );
  }
  return (
    <div
      className="flex-shrink-0 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-semibold select-none"
      style={{ width: size, height: size, fontSize: Math.max(10, size * 0.38) }}
    >
      {initial}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: {
  icon: React.ElementType; label: string; value: number; color: string;
}) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-2xl font-semibold text-slate-900 dark:text-white">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  );
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded-xl ${className}`} />;
}

function SectionCard({ title, children, action }: {
  title: string; children: React.ReactNode; action?: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

function MemberSearch({
  placeholder,
  onSelect,
  disabled,
}: {
  placeholder?: string;
  onSelect: (user: UserRef) => void;
  disabled?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<UserRef | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setResult(null); setError(""); return; }
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API}/users/profile/${encodeURIComponent(q.trim())}`, { withCredentials: true });
      setResult(res.data.data || res.data);
    } catch {
      setResult(null);
      setError("User not found");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setQuery(v);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => search(v), 500);
  };

  const handleSelect = () => {
    if (!result) return;
    onSelect(result);
    setQuery("");
    setResult(null);
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder || "Search by name or student ID…"}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none text-sm disabled:opacity-50"
        />
        {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 animate-spin" />}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {result && (
        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <Avatar user={result} size={32} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">{result.fullName}</p>
            <p className="text-xs text-slate-500 truncate">{result.email}{result.studentId ? ` · ${result.studentId}` : ""}</p>
          </div>
          <button
            type="button"
            onClick={handleSelect}
            className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition"
          >
            <Plus size={12} /> Add
          </button>
        </div>
      )}
    </div>
  );
}

function TabBtn({ active, onClick, children, badge }: {
  active: boolean; onClick: () => void; children: React.ReactNode; badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
        ${active
          ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
          : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"}`}
    >
      {children}
      {badge !== undefined && badge > 0 && (
        <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-semibold">
          {badge}
        </span>
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab 1: Overview
// ─────────────────────────────────────────────────────────────────────────────
function OverviewTab({ event }: { event: EventData }) {
  const isCompleted = event.status === "completed" || event.status === "past";
  const attendanceLabel = isCompleted ? "Attended" : "Attending";

  // Calculate full count of approved participants (both registered users & guest/form applicants)
  const approvedIds = new Set<string>();
  (event.approvedParticipants || []).forEach((p: any) => {
    const key = p.userId?._id || p.userId || p.email || p._id;
    if (key) approvedIds.add(String(key).toLowerCase());
  });
  (event.attendees || []).forEach((u: any) => {
    const key = u._id || u.email;
    if (key) approvedIds.add(String(key).toLowerCase());
  });
  const totalApproved =
    typeof event.approvedCount === "number"
      ? Math.max(event.approvedCount, approvedIds.size)
      : Math.max(approvedIds.size, event.approvedParticipants?.length || 0, event.attendees.length);

  const pendingTotal =
    typeof event.pendingCount === "number"
      ? event.pendingCount
      : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={Users} label={attendanceLabel} value={totalApproved}
          color="bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400" />
        <StatCard icon={Clock} label="Pending" value={pendingTotal}
          color="bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400" />
        <StatCard icon={Award} label="Certificates" value={event.certificates.length}
          color="bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400" />
        <StatCard icon={ImageIcon} label="Media" value={event.media.length}
          color="bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400" />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{event.title}</h2>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[event.status] || "bg-slate-100 text-slate-600"}`}>
                {event.status}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 capitalize">
                {event.category}
              </span>
            </div>
          </div>
          <Link
            href={`/dashboard/manage-events/create-event?edit=${event._id}`}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition flex-shrink-0"
          >
            <Edit size={14} /> Edit Event
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <Calendar size={15} className="text-slate-400 flex-shrink-0" />
            <span>{fmtDate(event.date)}{event.endDate ? ` → ${fmtDate(event.endDate)}` : ""}</span>
          </div>
          {event.eventTime && (
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Clock size={15} className="text-slate-400 flex-shrink-0" />
              <span>{event.eventTime}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <MapPin size={15} className="text-slate-400 flex-shrink-0" />
            <span>{event.location}</span>
          </div>
          {event.organizer && (
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <User size={15} className="text-slate-400 flex-shrink-0" />
              <span>{event.organizer}</span>
            </div>
          )}
          {event.contactEmail && (
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Mail size={15} className="text-slate-400 flex-shrink-0" />
              <span>{event.contactEmail}</span>
            </div>
          )}
        </div>

        {event.description && (
          <div
            className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4 prose prose-sm dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: event.description }}
          />
        )}

        {event.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 border-t border-slate-100 dark:border-slate-800 pt-4">
            {event.tags.map((t) => (
              <span key={t} className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${tagColor(t)}`}>{t}</span>
            ))}
          </div>
        )}
      </div>

      {event.coverImageUrl && (
        <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
          <Image src={event.coverImageUrl} alt={event.title} fill style={{ objectFit: "cover" }} unoptimized />
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab 2: Participants
// ─────────────────────────────────────────────────────────────────────────────
function ParticipantsTab({
  event,
  onApproveClaim,
  onRejectClaim,
  onRemove,
  onAdd,
  onAddNonMember,
  inFlight,
  onRefresh,
  showToast,
  onEmailApplicant,
}: {
  event: EventData;
  onApproveClaim: (claimId: string) => Promise<void>;
  onRejectClaim: (claimId: string) => Promise<void>;
  onRemove: (userId: string) => Promise<void>;
  onAdd: (user: UserRef) => Promise<void>;
  onAddNonMember: (guest: { fullName: string; email: string; studentId?: string; department?: string }) => Promise<void>;
  inFlight: Set<string>;
  onRefresh: () => void;
  showToast: (msg: string, type?: "success" | "error") => void;
  onEmailApplicant?: (email: string, name: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [addMode, setAddMode] = useState<"member" | "guest">("member");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestStudentId, setGuestStudentId] = useState("");
  const [guestDept, setGuestDept] = useState("");
  const [addingGuest, setAddingGuest] = useState(false);

  const participantsList = useMemo(() => {
    if (event.approvedParticipants && event.approvedParticipants.length > 0) {
      return event.approvedParticipants.map((p) => {
        const userObj = p.userId && typeof p.userId === "object" ? p.userId : undefined;
        return {
          id: userObj?._id || (typeof p.userId === "string" ? p.userId : "") || p._id || p.email || Math.random().toString(),
          userId: userObj,
          fullName: p.fullName || userObj?.fullName || p.email || "Participant",
          email: p.email || userObj?.email || "",
          studentId: p.studentId || userObj?.studentId,
          department: p.department || userObj?.department,
          teamName: p.teamName,
          isCaptain: p.isCaptain,
          isGuest: !userObj,
        };
      });
    }
    return (event.attendees || []).map((a) => {
      const userObj = a && typeof a === "object" ? a : undefined;
      return {
        id: userObj?._id || (typeof a === "string" ? a : "") || Math.random().toString(),
        userId: userObj,
        fullName: userObj?.fullName || userObj?.email || "Participant",
        email: userObj?.email || "",
        studentId: userObj?.studentId,
        department: userObj?.department,
        teamName: undefined,
        isCaptain: false,
        isGuest: false,
      };
    });
  }, [event.approvedParticipants, event.attendees]);

  const filtered = useMemo(() => {
    return participantsList.filter((a) =>
      (a.fullName || "").toLowerCase().includes(search.toLowerCase()) ||
      (a.studentId || "").toLowerCase().includes(search.toLowerCase()) ||
      (a.teamName || "").toLowerCase().includes(search.toLowerCase()) ||
      (a.email || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [participantsList, search]);

  const handleAddGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestEmail.trim()) return;
    setAddingGuest(true);
    try {
      await onAddNonMember({
        fullName: guestName.trim(),
        email: guestEmail.trim(),
        studentId: guestStudentId.trim() || undefined,
        department: guestDept.trim() || undefined,
      });
      setGuestName("");
      setGuestEmail("");
      setGuestStudentId("");
      setGuestDept("");
    } finally {
      setAddingGuest(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Registration Form Responses & Bulk Approval ── */}
      <EventFormSubmissionsSection
        eventId={event._id}
        onSubmissionsUpdated={onRefresh}
        showToast={showToast}
        onEmailApplicant={onEmailApplicant}
      />

      {/* ── Participation Claims Section (Archived / Past Event Claims) ── */}
      {event.participationClaims && event.participationClaims.length > 0 && (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-2 text-sm sm:text-base">
              <UserCheck size={18} className="text-emerald-600 dark:text-emerald-400" />
              Participation Claims ({event.participationClaims.filter((c) => c.status === "pending").length} Pending / {event.participationClaims.length} Total)
            </h3>
            <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
              Archived event attendance requests
            </span>
          </div>

          <div className="space-y-3">
            {event.participationClaims.map((claim) => {
              const isPending = claim.status === "pending";
              const isApproved = claim.status === "approved";

              return (
                <div
                  key={claim._id}
                  className={`bg-white dark:bg-slate-900 rounded-xl p-4 border shadow-sm space-y-3 transition-all ${
                    isPending
                      ? "border-amber-300 dark:border-amber-700/60"
                      : isApproved
                      ? "border-emerald-300 dark:border-emerald-700/60"
                      : "border-slate-200 dark:border-slate-800 opacity-70"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      {claim.userId && <Avatar user={claim.userId} fallbackName={claim.fullName} size={40} />}
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            {claim.fullName}
                          </h4>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                              isApproved
                                ? "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700"
                                : isPending
                                ? "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700"
                                : "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/40 dark:text-red-300 dark:border-red-700"
                            }`}
                          >
                            {claim.status}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800">
                            Role: {claim.role}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Claimed {new Date(claim.claimedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 self-end sm:self-auto flex-shrink-0">
                      {isPending ? (
                        <>
                          <button
                            onClick={() => onApproveClaim(claim._id)}
                            disabled={inFlight.has(claim._id)}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition disabled:opacity-50"
                            style={{ color: "#FFFFFF" }}
                          >
                            {inFlight.has(claim._id) ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                            Approve Claim
                          </button>
                          <button
                            onClick={() => onRejectClaim(claim._id)}
                            disabled={inFlight.has(claim._id)}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold transition disabled:opacity-50"
                            style={{ color: "#FFFFFF" }}
                          >
                            <X size={13} /> Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-slate-400 font-mono">
                          Reviewed {claim.reviewedAt ? new Date(claim.reviewedAt).toLocaleDateString() : ""}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div>
                      <span className="text-slate-400">Email: </span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">{claim.email}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Student ID: </span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">{claim.studentId || "—"}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Department: </span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">{claim.department || "—"}</span>
                    </div>
                  </div>

                  {claim.notes && (
                    <div className="text-xs bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                      <span className="font-bold text-slate-500">Proof / Note: </span>
                      <span className="whitespace-pre-wrap">{claim.notes}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <SectionCard
        title={`Approved Participants (${participantsList.length})`}
        action={
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search participants, teams, IDs…"
              className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        }
      >
        {filtered.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">No participants found.</p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {filtered.map((a) => (
              <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 hover:bg-slate-100/60 dark:hover:bg-slate-800 transition">
                {a.userId ? (
                  <Avatar user={a.userId} fallbackName={a.fullName} size={36} />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs text-slate-600 dark:text-slate-300 select-none">
                    {(a.fullName || "U").trim().charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{a.fullName}</p>
                    {a.teamName && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                        Squad: {a.teamName}
                      </span>
                    )}
                    {a.isCaptain && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
                        👑 Captain
                      </span>
                    )}
                    {a.isGuest && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                        Open Participant
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {a.email}
                    {a.studentId ? ` · ID: ${a.studentId}` : ""}
                    {a.department ? ` · ${a.department}` : ""}
                  </p>
                </div>
                <button
                  onClick={() => onRemove(a.id)}
                  disabled={inFlight.has(a.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition disabled:opacity-50"
                  title="Remove participant"
                >
                  {inFlight.has(a.id) ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                </button>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard title="Add Participant Manually">
        <div className="flex gap-2 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">
          <button
            type="button"
            onClick={() => setAddMode("member")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              addMode === "member"
                ? "bg-accent-primary text-white"
                : "bg-surface-secondary text-text-secondary hover:text-text-primary"
            }`}
          >
            Club Member
          </button>
          <button
            type="button"
            onClick={() => setAddMode("guest")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              addMode === "guest"
                ? "bg-accent-primary text-white"
                : "bg-surface-secondary text-text-secondary hover:text-text-primary"
            }`}
          >
            Guest / Non-Member
          </button>
        </div>

        {addMode === "member" ? (
          <div>
            <p className="text-xs text-slate-500 mb-3">Search member by name or student ID to add directly.</p>
            <MemberSearch onSelect={onAdd} />
          </div>
        ) : (
          <form onSubmit={handleAddGuestSubmit} className="space-y-3">
            <p className="text-xs text-slate-500">Add an external or non-member participant (e.g. for open-for-all events).</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Full Name *"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                required
                className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-accent-primary"
              />
              <input
                type="email"
                placeholder="Email Address *"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                required
                className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-accent-primary"
              />
              <input
                type="text"
                placeholder="Student ID / Roll (Optional)"
                value={guestStudentId}
                onChange={(e) => setGuestStudentId(e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-accent-primary"
              />
              <input
                type="text"
                placeholder="Department / Institution (Optional)"
                value={guestDept}
                onChange={(e) => setGuestDept(e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-accent-primary"
              />
            </div>
            <Button size="sm" type="submit" disabled={addingGuest || !guestName.trim() || !guestEmail.trim()}>
              {addingGuest ? <Loader2 size={13} className="animate-spin mr-1" /> : <Plus size={13} className="mr-1" />}
              Add Non-Member Participant
            </Button>
          </form>
        )}
      </SectionCard>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab: Organizers & Volunteers
// ─────────────────────────────────────────────────────────────────────────────

const VOLUNTEER_ROLES = [
  "Lead Organizer",
  "Co-Organizer",
  "Event Volunteer",
  "Technical Coordinator",
  "Logistics & Venue",
  "Stage & Anchoring",
  "Media & Photography",
  "Judge / Evaluator",
  "Mentor / Speaker",
  "Registration & Helpdesk",
  "Other",
];

const ROLE_OPTIONS = VOLUNTEER_ROLES.map((r) => ({ value: r, label: r }));

const ROLE_FILTER_OPTIONS = [
  { value: "all", label: "All Roles" },
  ...VOLUNTEER_ROLES.map((r) => ({ value: r, label: r })),
];

const CERT_FILTER_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "certified", label: "Certified ✓" },
  { value: "uncertified", label: "Not Certified" },
];

const ROLE_BADGE_COLORS: Record<string, string> = {
  "Lead Organizer": "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-700",
  "Co-Organizer": "bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-700",
  "Event Volunteer": "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700",
  "Technical Coordinator": "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700",
  "Logistics & Venue": "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700",
  "Stage & Anchoring": "bg-pink-100 text-pink-800 border-pink-300 dark:bg-pink-900/40 dark:text-pink-300 dark:border-pink-700",
  "Media & Photography": "bg-cyan-100 text-cyan-800 border-cyan-300 dark:bg-cyan-900/40 dark:text-cyan-300 dark:border-cyan-700",
  "Judge / Evaluator": "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-700",
  "Mentor / Speaker": "bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-900/40 dark:text-teal-300 dark:border-teal-700",
  "Registration & Helpdesk": "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-700",
};

const CERT_TYPE_OPTIONS = [
  { value: "appreciation", label: "Certificate of Appreciation" },
  { value: "volunteer", label: "Volunteer Certificate" },
  { value: "organizer", label: "Organizer Certificate" },
];

function findContributorCertificate(c: ContributorItem, certificates: Certificate[]) {
  if (!certificates || certificates.length === 0) return null;
  const cUserId = c.userId ? (typeof c.userId === "string" ? c.userId : c.userId._id) : null;
  const cEmail = (c.email || (typeof c.userId === "object" ? c.userId?.email : "") || "").trim().toLowerCase();
  const cStudentId = (c.studentId || (typeof c.userId === "object" ? c.userId?.studentId : "") || "").trim().toLowerCase();
  const cName = (c.name || "").trim().toLowerCase();

  return certificates.find((cert) => {
    // 1. Match by user ID
    const rUserId = cert.recipient?._id || (typeof cert.recipient === "string" ? cert.recipient : null);
    if (cUserId && rUserId && String(cUserId) === String(rUserId)) return true;

    // 2. Match by student ID
    const rStudentId = (cert.recipientStudentId || cert.recipient?.studentId || "").trim().toLowerCase();
    if (cStudentId && rStudentId && cStudentId === rStudentId) return true;

    // 3. Match by email
    const rEmail = (cert.recipientEmail || cert.recipient?.email || "").trim().toLowerCase();
    if (cEmail && rEmail && cEmail === rEmail) return true;

    // 4. Match by name if volunteer/organizer/appreciation
    const rName = (cert.recipientName || cert.recipient?.fullName || "").trim().toLowerCase();
    if (cName && rName && cName === rName && ["volunteer", "organizer", "appreciation"].includes(cert.type)) {
      return true;
    }

    return false;
  });
}

function VolunteersTab({
  event,
  onRefresh,
  showToast,
}: {
  event: EventData;
  onRefresh: () => Promise<void>;
  showToast: (msg: string, type?: "success" | "error") => void;
}) {
  const contributors = useMemo(() => event.contributors || [], [event.contributors]);
  const [saving, setSaving] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [certFilter, setCertFilter] = useState("all");

  // Add Mode State
  const [addMode, setAddMode] = useState<"member" | "guest">("member");
  const [selectedMember, setSelectedMember] = useState<UserRef | null>(null);
  const [memberRole, setMemberRole] = useState("Event Volunteer");
  const [customMemberRole, setCustomMemberRole] = useState("");

  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestStudentId, setGuestStudentId] = useState("");
  const [guestDept, setGuestDept] = useState("");
  const [guestRole, setGuestRole] = useState("Event Volunteer");
  const [guestCustomRole, setGuestCustomRole] = useState("");
  const [addingGuest, setAddingGuest] = useState(false);

  // Edit Inline Role
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editRole, setEditRole] = useState("Event Volunteer");
  const [editCustomRole, setEditCustomRole] = useState("");

  // Certification Modal State
  const [showCertModal, setShowCertModal] = useState(false);
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [certTemplateId, setCertTemplateId] = useState("");
  const [certTitle, setCertTitle] = useState(`${event.title} - Certificate of Appreciation`);
  const [certType, setCertType] = useState("appreciation");
  const [certIssueDate, setCertIssueDate] = useState(new Date().toISOString().split("T")[0]);
  const [certDesc, setCertDesc] = useState(
    `In sincere recognition and appreciation of invaluable service, dedication, and leadership contributing to the resounding success of ${event.title}.`
  );
  const [selectedContributorKeys, setSelectedContributorKeys] = useState<Set<number>>(new Set());
  const [issuing, setIssuing] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<TemplateItem | null>(null);

  // Fetch certificate templates
  useEffect(() => {
    const fetchTemplates = async () => {
      setLoadingTemplates(true);
      try {
        const res = await axios.get(`${API}/certificate-templates`, { withCredentials: true });
        const list: TemplateItem[] = res.data.data || [];
        setTemplates(list);
        const def = list.find((t) => t.isDefault) || list[0];
        if (def) setCertTemplateId((p) => p || def._id);
      } catch (err) {
        console.warn("Failed to fetch certificate templates:", err);
      } finally {
        setLoadingTemplates(false);
      }
    };
    fetchTemplates();
  }, []);

  // Stats
  const certifiedCount = useMemo(() => {
    return contributors.filter((c) => !!findContributorCertificate(c, event.certificates || [])).length;
  }, [contributors, event.certificates]);
  const uncertifiedCount = contributors.length - certifiedCount;

  // Filtered contributors
  const filteredContributors = useMemo(() => {
    return contributors
      .map((c, idx) => ({ ...c, originalIndex: idx }))
      .filter((c) => {
        const q = search.toLowerCase();
        const matchesSearch =
          !q ||
          c.name.toLowerCase().includes(q) ||
          (c.role || "").toLowerCase().includes(q) ||
          (c.email || "").toLowerCase().includes(q) ||
          (c.studentId || "").toLowerCase().includes(q) ||
          (c.department || "").toLowerCase().includes(q);

        const matchesRole = roleFilter === "all" || c.role === roleFilter;

        const cert = findContributorCertificate(c, event.certificates || []);
        const matchesCert =
          certFilter === "all" ||
          (certFilter === "certified" && !!cert) ||
          (certFilter === "uncertified" && !cert);

        return matchesSearch && matchesRole && matchesCert;
      });
  }, [contributors, search, roleFilter, certFilter, event.certificates]);

  // Save to backend
  const handleSaveContributors = async (newList: ContributorItem[]) => {
    setSaving(true);
    try {
      const payload = newList.map((c) => ({
        userId: c.userId ? (typeof c.userId === "string" ? c.userId : c.userId._id) : undefined,
        name: c.name.trim(),
        role: c.role.trim() || "Event Volunteer",
        department: c.department?.trim() || undefined,
        studentId: c.studentId?.trim() || undefined,
        email: c.email?.trim() || undefined,
        avatarUrl: c.avatarUrl || (typeof c.userId === "object" ? c.userId?.imageUrl : undefined),
      }));

      await axios.put(`${API}/events/${event._id}/contributors`, { contributors: payload }, { withCredentials: true });
      await onRefresh();
      showToast("Organizers & volunteers updated.");
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to update contributors.", "error");
    } finally {
      setSaving(false);
    }
  };

  // Add Member
  const handleAddMember = async () => {
    if (!selectedMember) return;
    const finalRole = memberRole === "Other" ? customMemberRole.trim() || "Event Volunteer" : memberRole;

    const alreadyExists = contributors.some(
      (c) =>
        (c.userId && (c.userId._id === selectedMember._id || c.userId === selectedMember._id)) ||
        (c.studentId && selectedMember.studentId && c.studentId.toLowerCase() === selectedMember.studentId.toLowerCase()) ||
        (c.email && selectedMember.email && c.email.toLowerCase() === selectedMember.email.toLowerCase())
    );

    if (alreadyExists) {
      showToast(`${selectedMember.fullName} is already enlisted.`, "error");
      return;
    }

    const newContributor: ContributorItem = {
      name: selectedMember.fullName,
      userId: selectedMember,
      email: selectedMember.email,
      studentId: selectedMember.studentId,
      department: selectedMember.department,
      avatarUrl: selectedMember.imageUrl,
      role: finalRole,
    };

    await handleSaveContributors([...contributors, newContributor]);
    setSelectedMember(null);
    setCustomMemberRole("");
  };

  // Add Guest
  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestEmail.trim()) return;
    const finalRole = guestRole === "Other" ? guestCustomRole.trim() || "Event Volunteer" : guestRole;

    setAddingGuest(true);
    try {
      const newContributor: ContributorItem = {
        name: guestName.trim(),
        email: guestEmail.trim(),
        studentId: guestStudentId.trim() || undefined,
        department: guestDept.trim() || undefined,
        role: finalRole,
      };

      await handleSaveContributors([...contributors, newContributor]);
      setGuestName("");
      setGuestEmail("");
      setGuestStudentId("");
      setGuestDept("");
      setGuestCustomRole("");
    } finally {
      setAddingGuest(false);
    }
  };

  // Remove Contributor
  const handleRemoveContributor = async (indexToRemove: number) => {
    if (!confirm("Are you sure you want to remove this person from the event organizers/volunteers?")) return;
    const updated = contributors.filter((_, idx) => idx !== indexToRemove);
    await handleSaveContributors(updated);
  };

  // Save Inline Edited Role
  const handleSaveEditRole = async (index: number) => {
    const finalRole = editRole === "Other" ? editCustomRole.trim() || "Event Volunteer" : editRole;
    const updated = contributors.map((c, idx) => (idx === index ? { ...c, role: finalRole } : c));
    await handleSaveContributors(updated);
    setEditingIdx(null);
  };

  // Open Certify Modal
  const openCertifyModal = (selectedIndices?: number[]) => {
    if (selectedIndices && selectedIndices.length > 0) {
      setSelectedContributorKeys(new Set(selectedIndices));
    } else {
      // Default: select uncertified only or all
      const uncertified = contributors
        .map((c, idx) => ({ c, idx }))
        .filter(({ c }) => !findContributorCertificate(c, event.certificates || []))
        .map(({ idx }) => idx);

      if (uncertified.length > 0) {
        setSelectedContributorKeys(new Set(uncertified));
      } else {
        setSelectedContributorKeys(new Set(contributors.map((_, idx) => idx)));
      }
    }
    setCertTitle(`${event.title} - Certificate of Appreciation`);
    setShowCertModal(true);
  };

  // Submit Issue Certificates
  const handleIssueCertificates = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedContributorKeys.size === 0) {
      showToast("Please select at least one recipient.", "error");
      return;
    }
    if (!certTemplateId) {
      showToast("Please select a certificate template.", "error");
      return;
    }

    setIssuing(true);
    try {
      const selectedContributors = contributors.filter((_, idx) => selectedContributorKeys.has(idx));

      const recipients = selectedContributors.map((c) => ({
        userId: c.userId ? (typeof c.userId === "string" ? c.userId : c.userId._id) : undefined,
        name: c.name,
        fullName: c.name,
        email: c.email || (typeof c.userId === "object" ? c.userId?.email : undefined),
        studentId: c.studentId || (typeof c.userId === "object" ? c.userId?.studentId : undefined),
        department: c.department || (typeof c.userId === "object" ? c.userId?.department : undefined),
        type: certType,
        position: c.role,
      }));

      await axios.post(
        `${API}/events/${event._id}/certificates`,
        {
          templateId: certTemplateId,
          name: certTitle.trim(),
          description: certDesc.trim(),
          issueDate: certIssueDate,
          recipients,
        },
        { withCredentials: true }
      );

      await onRefresh();
      showToast(`Successfully issued ${recipients.length} certificates!`);
      setShowCertModal(false);
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to issue certificates.", "error");
    } finally {
      setIssuing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Top Summary & Action Bar ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={Users}
          label="Total Enlisted Team"
          value={contributors.length}
          color="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
        />
        <StatCard
          icon={CheckCircle2}
          label="Certified Organizers / Volunteers"
          value={certifiedCount}
          color="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
        />
        <StatCard
          icon={AlertCircle}
          label="Awaiting Certification"
          value={uncertifiedCount}
          color="bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
        />
      </div>

      {/* ── Action Strip ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <UserCheck size={18} className="text-accent-primary" />
            Organizers &amp; Volunteers Roster
          </h3>
          <p className="text-xs text-slate-500">
            Enlist members &amp; external volunteers who contributed to organizing, managing, or judging this event, and grant official certificates.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant="primary"
            onClick={() => openCertifyModal()}
            disabled={contributors.length === 0}
            className="flex items-center gap-1.5 shadow-[2px_2px_0px_var(--border-brutalist)]"
          >
            <Award size={14} />
            <span>Issue Certificates</span>
          </Button>
        </div>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-surface-secondary/50 p-3 rounded-2xl border border-border-default">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, student ID, department, or role…"
            className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-accent-primary outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Custom Neo-Brutalist FilterSelect for Role */}
          <FilterSelect
            value={roleFilter}
            onChange={setRoleFilter}
            options={ROLE_FILTER_OPTIONS}
            placeholder="Filter Role"
          />

          {/* Custom Neo-Brutalist FilterSelect for Certification Status */}
          <FilterSelect
            value={certFilter}
            onChange={setCertFilter}
            options={CERT_FILTER_OPTIONS}
            placeholder="Filter Certification"
          />
        </div>
      </div>

      {/* ── Contributor Cards List ── */}
      <SectionCard
        title={`Enlisted Organizers & Volunteers (${filteredContributors.length} of ${contributors.length})`}
        action={
          saving && (
            <div className="flex items-center gap-1.5 text-xs text-accent-primary font-mono font-bold">
              <Loader2 size={13} className="animate-spin" /> Saving changes…
            </div>
          )
        }
      >
        {filteredContributors.length === 0 ? (
          <div className="text-center py-12 px-4 space-y-2">
            <Users size={36} className="mx-auto text-slate-400 opacity-60" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {contributors.length === 0 ? "No organizers or volunteers enlisted yet." : "No matching team members found."}
            </p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Use the form below to search and add club members or add guest volunteers for this event.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredContributors.map((c) => {
              const origIdx = c.originalIndex;
              const cert = findContributorCertificate(c, event.certificates || []);
              const isCertified = !!cert;
              const isEditing = editingIdx === origIdx;

              const roleBadgeClass =
                ROLE_BADGE_COLORS[c.role] ||
                "bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";

              return (
                <div
                  key={`${c.name}-${origIdx}`}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between gap-3 hover:border-slate-300 dark:hover:border-slate-700 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      {c.userId ? (
                        <Avatar user={c.userId} fallbackName={c.name} size={42} />
                      ) : (
                        <div className="w-[42px] h-[42px] rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center text-sm flex-shrink-0 select-none">
                          {(c.name || "C").trim().charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                            {c.name}
                          </h4>
                          {c.userId ? (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                              Member
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                              Guest
                            </span>
                          )}
                        </div>

                        {c.email && (
                          <p className="text-xs text-slate-500 truncate mt-0.5">{c.email}</p>
                        )}
                        {(c.studentId || c.department) && (
                          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                            {[c.studentId ? `ID: ${c.studentId}` : "", c.department].filter(Boolean).join(" · ")}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          if (isEditing) {
                            setEditingIdx(null);
                          } else {
                            setEditingIdx(origIdx);
                            setEditRole(VOLUNTEER_ROLES.includes(c.role) ? c.role : "Other");
                            setEditCustomRole(VOLUNTEER_ROLES.includes(c.role) ? "" : c.role);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition"
                        title="Edit Role"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveContributor(origIdx)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                        title="Remove"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Inline Role Editor */}
                  {isEditing ? (
                    <div className="p-3 bg-surface-secondary rounded-lg border border-border-default space-y-2 mt-1">
                      <label className="text-[11px] font-bold text-text-primary block">Update Contributor Role</label>
                      <Select
                        value={editRole}
                        onChange={setEditRole}
                        options={ROLE_OPTIONS}
                      />
                      {editRole === "Other" && (
                        <input
                          type="text"
                          placeholder="Enter custom role title…"
                          value={editCustomRole}
                          onChange={(e) => setEditCustomRole(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-border-default bg-surface-primary text-text-primary outline-none focus:border-accent-primary"
                        />
                      )}
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setEditingIdx(null)}
                          className="px-2.5 py-1 text-xs text-text-secondary hover:text-text-primary"
                        >
                          Cancel
                        </button>
                        <Button size="sm" variant="primary" onClick={() => handleSaveEditRole(origIdx)}>
                          <Check size={12} className="mr-1" /> Save Role
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex-wrap">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold border uppercase tracking-wider ${roleBadgeClass}`}>
                        {c.role}
                      </span>

                      {/* Certification Pill */}
                      {isCertified ? (
                        <div className="flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                            <Check size={12} className="text-emerald-600" />
                            <span>Certified</span>
                          </span>
                          {cert && (
                            <Link
                              href={cert.digitalUrl || `/verify?cert=${cert.certificateId}`}
                              target="_blank"
                              className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
                              title={`View Certificate (${cert.certificateId})`}
                            >
                              <span>{cert.certificateId}</span>
                              <ExternalLink size={10} />
                            </Link>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                            <Clock size={11} /> Not Certified
                          </span>
                          <button
                            type="button"
                            onClick={() => openCertifyModal([origIdx])}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-accent-primary-light hover:bg-accent-primary text-text-primary rounded text-[11px] font-bold border border-accent-primary/40 transition"
                          >
                            <Award size={12} />
                            <span>Certify</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>

      {/* ── Enlist New Organizer / Volunteer Section ── */}
      <SectionCard title="Enlist New Organizer or Volunteer">
        <div className="flex gap-2 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">
          <button
            type="button"
            onClick={() => setAddMode("member")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              addMode === "member"
                ? "bg-accent-primary text-white shadow-sm"
                : "bg-surface-secondary text-text-secondary hover:text-text-primary"
            }`}
          >
            Club Member
          </button>
          <button
            type="button"
            onClick={() => setAddMode("guest")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              addMode === "guest"
                ? "bg-accent-primary text-white shadow-sm"
                : "bg-surface-secondary text-text-secondary hover:text-text-primary"
            }`}
          >
            Guest / External Volunteer
          </button>
        </div>

        {addMode === "member" ? (
          <div className="space-y-4">
            <p className="text-xs text-slate-500">
              Search a registered MEC Computer Club member by full name, student ID, or email:
            </p>

            <MemberSearch
              placeholder="Search club member to enlist…"
              onSelect={(member) => setSelectedMember(member)}
            />

            {selectedMember && (
              <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar user={selectedMember} size={40} />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {selectedMember.fullName}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {selectedMember.email} · ID: {selectedMember.studentId || "—"} · {selectedMember.department || "—"}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedMember(null)}
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-indigo-100 dark:border-indigo-900/60">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                      Assigned Role / Designation *
                    </label>
                    <Select
                      value={memberRole}
                      onChange={setMemberRole}
                      options={ROLE_OPTIONS}
                    />
                  </div>
                  {memberRole === "Other" && (
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                        Custom Role Title *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Stage Host, Head of Security…"
                        value={customMemberRole}
                        onChange={(e) => setCustomMemberRole(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-accent-primary"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-1">
                  <Button size="sm" variant="primary" onClick={handleAddMember} disabled={saving}>
                    {saving ? <Loader2 size={13} className="animate-spin mr-1.5" /> : <Plus size={13} className="mr-1.5" />}
                    Add {selectedMember.fullName} to Team
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleAddGuest} className="space-y-4">
            <p className="text-xs text-slate-500">
              Enlist an external volunteer, judge, guest organizer, or speaker:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-accent-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="e.g. john@example.com"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-accent-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                  Student ID / Roll (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2023-01-04-001"
                  value={guestStudentId}
                  onChange={(e) => setGuestStudentId(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-accent-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                  Department / Institution (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. CSE / MEC"
                  value={guestDept}
                  onChange={(e) => setGuestDept(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-accent-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                  Assigned Role *
                </label>
                <Select
                  value={guestRole}
                  onChange={setGuestRole}
                  options={ROLE_OPTIONS}
                />
              </div>

              {guestRole === "Other" && (
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Custom Role Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Stage Host, Head of Security…"
                    value={guestCustomRole}
                    onChange={(e) => setGuestCustomRole(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-accent-primary"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end pt-1">
              <Button size="sm" type="submit" disabled={addingGuest || !guestName.trim() || !guestEmail.trim()}>
                {addingGuest ? <Loader2 size={13} className="animate-spin mr-1.5" /> : <Plus size={13} className="mr-1.5" />}
                Enlist Guest Volunteer
              </Button>
            </div>
          </form>
        )}
      </SectionCard>

      {/* ── MODAL: Issue Certificates to Organizers & Volunteers ── */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-surface-elevated border-2 border-border-brutalist dark:border-border-default rounded-2xl p-6 w-full max-w-2xl shadow-[8px_8px_0px_var(--accent-primary)] max-h-[90vh] flex flex-col my-auto">
            <div className="flex items-center justify-between pb-4 border-b border-border-default">
              <div className="flex items-center gap-2">
                <Award size={20} className="text-accent-primary" />
                <h3 className="font-heading font-black text-lg text-text-primary">
                  Certify Organizers &amp; Volunteers
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCertModal(false)}
                className="p-1 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-secondary"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleIssueCertificates} className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
              {/* Template Picker */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-text-primary">
                    Certificate Template *
                  </label>
                  {certTemplateId && templates.find((t) => t._id === certTemplateId) && (
                    <button
                      type="button"
                      onClick={() => setPreviewTemplate(templates.find((t) => t._id === certTemplateId) || null)}
                      className="text-xs text-accent-primary hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Eye size={12} /> Preview Template
                    </button>
                  )}
                </div>

                {loadingTemplates ? (
                  <div className="p-3 bg-surface-secondary rounded-xl text-xs text-text-secondary flex items-center gap-2">
                    <Loader2 size={13} className="animate-spin" /> Loading certificate templates…
                  </div>
                ) : (
                  <Select
                    value={certTemplateId}
                    onChange={setCertTemplateId}
                    options={templates.map((t) => ({
                      value: t._id,
                      label: `${t.name}${t.isDefault ? " (Default)" : ""}`,
                    }))}
                    placeholder="Choose a Certificate Template…"
                  />
                )}
              </div>

              {/* Certificate Type & Issue Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-text-primary mb-1 block">
                    Certificate Type *
                  </label>
                  <Select
                    value={certType}
                    onChange={setCertType}
                    options={CERT_TYPE_OPTIONS}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-text-primary mb-1 block">
                    Issue Date *
                  </label>
                  <input
                    type="date"
                    value={certIssueDate}
                    onChange={(e) => setCertIssueDate(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-border-default bg-surface-primary text-xs text-text-primary outline-none focus:border-accent-primary"
                  />
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <label className="text-xs font-bold text-text-primary mb-1 block">
                  Certificate Title *
                </label>
                <input
                  type="text"
                  value={certTitle}
                  onChange={(e) => setCertTitle(e.target.value)}
                  required
                  placeholder="e.g. Spring Hackathon 2026 - Certificate of Appreciation"
                  className="w-full px-3.5 py-2 rounded-xl border border-border-default bg-surface-primary text-xs text-text-primary outline-none focus:border-accent-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-text-primary mb-1 block">
                  Citation Description *
                </label>
                <textarea
                  rows={2}
                  value={certDesc}
                  onChange={(e) => setCertDesc(e.target.value)}
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-border-default bg-surface-primary text-xs text-text-primary outline-none focus:border-accent-primary resize-none"
                />
              </div>

              {/* Recipient Selection Checklist */}
              <div className="space-y-2 pt-2 border-t border-border-default">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="text-xs font-bold text-text-primary">
                    Recipients ({selectedContributorKeys.size} of {contributors.length} selected)
                  </label>
                  <div className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setSelectedContributorKeys(new Set(contributors.map((_, idx) => idx)))}
                      className="text-accent-primary hover:underline font-bold"
                    >
                      Select All
                    </button>
                    <span className="text-text-tertiary">·</span>
                    <button
                      type="button"
                      onClick={() => {
                        const uncertified = contributors
                          .map((c, idx) => ({ c, idx }))
                          .filter(({ c }) => !findContributorCertificate(c, event.certificates || []))
                          .map(({ idx }) => idx);
                        setSelectedContributorKeys(new Set(uncertified));
                      }}
                      className="text-accent-primary hover:underline font-bold"
                    >
                      Uncertified Only
                    </button>
                    <span className="text-text-tertiary">·</span>
                    <button
                      type="button"
                      onClick={() => setSelectedContributorKeys(new Set())}
                      className="text-text-secondary hover:text-text-primary"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="max-h-56 overflow-y-auto space-y-1.5 border border-border-default rounded-xl p-2 bg-surface-secondary/40">
                  {contributors.map((c, idx) => {
                    const isChecked = selectedContributorKeys.has(idx);
                    const cert = findContributorCertificate(c, event.certificates || []);

                    return (
                      <label
                        key={idx}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition text-xs border ${
                          isChecked
                            ? "bg-accent-primary-light border-accent-primary/40 font-semibold"
                            : "bg-surface-primary border-border-default/60 hover:bg-surface-secondary"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              const next = new Set(selectedContributorKeys);
                              if (e.target.checked) next.add(idx);
                              else next.delete(idx);
                              setSelectedContributorKeys(next);
                            }}
                            className="rounded border-border-default text-accent-primary focus:ring-accent-primary"
                          />
                          <div className="min-w-0">
                            <span className="font-bold text-text-primary truncate">{c.name}</span>
                            <span className="text-text-tertiary ml-2 font-mono text-[11px]">({c.role})</span>
                          </div>
                        </div>

                        {cert && (
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 flex-shrink-0">
                            Already Certified
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-border-default flex items-center justify-end gap-2">
                <Button variant="outline" type="button" onClick={() => setShowCertModal(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={issuing || selectedContributorKeys.size === 0 || !certTemplateId}
                  className="shadow-[2px_2px_0px_var(--border-brutalist)]"
                >
                  {issuing ? (
                    <Loader2 size={14} className="animate-spin mr-1.5" />
                  ) : (
                    <Award size={14} className="mr-1.5" />
                  )}
                  Issue {selectedContributorKeys.size} Certificates
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: Certificate Template Preview ── */}
      {previewTemplate && (
        <CertificateTemplatePreviewModal
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab 3: Winners (team-aware)
// ─────────────────────────────────────────────────────────────────────────────
interface DraftTeam {
  teamName: string;
  members: UserRef[];
  position: string;
  prize: string;
}

const EMPTY_DRAFT: DraftTeam = { teamName: "", members: [], position: "", prize: "" };

function WinnersTab({
  event,
  onSave,
  saving,
}: {
  event: EventData;
  onSave: (winners: { teamName?: string; members: string[]; position: string; prize?: string }[]) => Promise<void>;
  saving: boolean;
}) {
  const [teams, setTeams] = useState<(DraftTeam & { id: string })[]>(
    event.winners.map((w, i) => ({
      id: w._id || String(i),
      teamName: w.teamName || "",
      members: w.members || [],
      position: w.position,
      prize: w.prize || "",
    }))
  );
  const [draft, setDraft] = useState<DraftTeam>({ ...EMPTY_DRAFT });

  const setD = (k: keyof DraftTeam, v: string) =>
    setDraft((p) => ({ ...p, [k]: v }));

  const addMemberToDraft = useCallback((user: UserRef) => {
    setDraft((p) => ({
      ...p,
      members: p.members.some((m) => m._id === user._id) ? p.members : [...p.members, user],
    }));
  }, []);

  const removeMemberFromDraft = useCallback((id: string) => {
    setDraft((p) => ({ ...p, members: p.members.filter((m) => m._id !== id) }));
  }, []);

  const addTeam = useCallback(() => {
    if (draft.members.length === 0 || !draft.position.trim()) return;
    setTeams((prev) => [...prev, { ...draft, id: Date.now().toString() }]);
    setDraft({ ...EMPTY_DRAFT });
  }, [draft]);

  const removeTeam = useCallback((id: string) => {
    setTeams((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleSave = useCallback(() => {
    onSave(teams.map(({ teamName, members, position, prize }) => ({
      teamName: teamName || undefined,
      members: members.map((m) => m._id),
      position,
      prize: prize || undefined,
    })));
  }, [teams, onSave]);

  if (!WINNER_CATEGORIES.includes(event.category)) {
    return (
      <div className="text-center py-16 text-slate-400">
        <Trophy size={40} className="mx-auto mb-3 opacity-30" />
        <p className="text-sm">Winners are only available for Contest, Hackathon, and Other categories.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl p-4 text-sm text-blue-800 dark:text-blue-300">
        <strong>How to mark winners:</strong> Each winner entry is a <em>team</em> — it can have 1 or more members.
        Search and add all team members, set the position (e.g. "1st Place"), optionally name the team and add a prize,
        then click <strong>Add Team to Winners List</strong>. Repeat for each placing. Click <strong>Save Winners</strong> when done.
      </div>

      <SectionCard title={`Winner Teams (${teams.length})`}>
        {teams.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">No winners set yet.</p>
        ) : (
          <div className="space-y-3">
            {teams.map((team) => (
              <div key={team.id} className="bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 rounded-full text-xs font-semibold">
                      <Trophy size={11} /> {team.position}
                    </span>
                    {team.teamName && (
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{team.teamName}</span>
                    )}
                    {team.prize && (
                      <span className="text-xs text-slate-500 dark:text-slate-400">· {team.prize}</span>
                    )}
                  </div>
                  <button
                    onClick={() => removeTeam(team.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition flex-shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {team.members.map((m) => (
                    <div key={m._id} className="flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-700 text-xs">
                      <Avatar user={m} size={18} />
                      <span className="font-medium text-slate-700 dark:text-slate-300">{m.fullName}</span>
                      {m.studentId && <span className="text-slate-400">({m.studentId})</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard title="Add Winner Team">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              value={draft.position}
              onChange={(e) => setD("position", e.target.value)}
              placeholder="Position * (e.g. 1st Place)"
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <input
              type="text"
              value={draft.teamName}
              onChange={(e) => setD("teamName", e.target.value)}
              placeholder="Team name (optional)"
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <input
              type="text"
              value={draft.prize}
              onChange={(e) => setD("prize", e.target.value)}
              placeholder="Prize (optional)"
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {draft.members.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 self-center mr-1">
                Team ({draft.members.length}):
              </span>
              {draft.members.map((m) => (
                <span key={m._id} className="inline-flex items-center gap-1 px-2.5 py-1 bg-white dark:bg-slate-800 rounded-full border border-indigo-200 dark:border-indigo-800 text-xs font-medium text-slate-700 dark:text-slate-300">
                  <Avatar user={m} size={16} />
                  {m.fullName}
                  <button onClick={() => removeMemberFromDraft(m._id)} className="ml-0.5 text-slate-400 hover:text-red-500 transition">
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div>
            <p className="text-xs text-slate-500 mb-2">Search and add all team members before clicking "Add Team":</p>
            <MemberSearch placeholder="Search member by name or student ID…" onSelect={addMemberToDraft} />
          </div>

          <button
            onClick={addTeam}
            disabled={draft.members.length === 0 || !draft.position.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition disabled:opacity-50"
          >
            <Plus size={14} /> Add Team to Winners List
          </button>
        </div>
      </SectionCard>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold text-sm transition disabled:opacity-60"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
          {saving ? "Saving…" : "Save Winners"}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab 4: Sponsors
// ─────────────────────────────────────────────────────────────────────────────
function SponsorsTab({
  event,
  onAdd,
  onRemove,
  inFlight,
}: {
  event: EventData;
  onAdd: (sponsorId: string, sponsorName: string, logoUrl: string, tier: string) => Promise<void>;
  onRemove: (sponsorId: string) => Promise<void>;
  inFlight: Set<string>;
}) {
  const [allSponsors, setAllSponsors] = useState<SponsorOption[]>([]);
  const [sponsorSearch, setSponsorSearch] = useState("");
  const [selectedSponsor, setSelectedSponsor] = useState<SponsorOption | null>(null);
  const [tier, setTier] = useState("Gold");
  const [dropOpen, setDropOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    axios.get(`${API}/sponsors`, { withCredentials: true })
      .then((r: any) => setAllSponsors(r.data.data || []))
      .catch(() => { });
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = allSponsors.filter((s) =>
    s.name.toLowerCase().includes(sponsorSearch.toLowerCase())
  );

  const handleAdd = async () => {
    if (!selectedSponsor) return;
    setAdding(true);
    await onAdd(selectedSponsor._id, selectedSponsor.name, selectedSponsor.logoUrl || "", tier);
    setSelectedSponsor(null);
    setSponsorSearch("");
    setAdding(false);
  };

  return (
    <div className="space-y-6">
      <SectionCard title={`Event Sponsors (${event.eventSponsors.length})`}>
        {event.eventSponsors.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">No sponsors added yet.</p>
        ) : (
          <div className="space-y-3">
            {event.eventSponsors.map((s) => (
              <div key={s._id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                {s.logoUrl ? (
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 flex-shrink-0">
                    <Image src={s.logoUrl} alt={s.sponsorName} fill style={{ objectFit: "contain" }} unoptimized />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                    <Building2 size={18} className="text-slate-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{s.sponsorName}</p>
                  {s.tier && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TIER_COLORS[s.tier] || "bg-slate-100 text-slate-600"}`}>
                      {s.tier}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => onRemove(s.sponsorId)}
                  disabled={inFlight.has(s.sponsorId)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition disabled:opacity-50"
                >
                  {inFlight.has(s.sponsorId) ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                </button>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard title="Add Sponsor">
        <div className="space-y-3">
          <div ref={dropRef} className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={selectedSponsor ? selectedSponsor.name : sponsorSearch}
                onChange={(e) => { setSponsorSearch(e.target.value); setSelectedSponsor(null); setDropOpen(true); }}
                onFocus={() => setDropOpen(true)}
                placeholder="Search sponsors…"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            {dropOpen && filtered.length > 0 && (
              <div className="absolute z-50 mt-1 w-full bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl max-h-48 overflow-y-auto">
                {filtered.map((s) => (
                  <button
                    key={s._id}
                    type="button"
                    onClick={() => { setSelectedSponsor(s); setSponsorSearch(""); setDropOpen(false); }}
                    className="w-full text-left px-4 py-2.5 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 flex items-center gap-3 transition"
                  >
                    {s.logoUrl ? (
                      <div className="relative w-7 h-7 rounded overflow-hidden flex-shrink-0">
                        <Image src={s.logoUrl} alt={s.name} fill style={{ objectFit: "contain" }} unoptimized />
                      </div>
                    ) : (
                      <Building2 size={16} className="text-slate-400 flex-shrink-0" />
                    )}
                    <span className="text-sm text-slate-800 dark:text-slate-100">{s.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedSponsor && (
            <div className="flex items-center gap-2 p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-sm">
              <Building2 size={14} className="text-indigo-500" />
              <span className="font-medium text-indigo-700 dark:text-indigo-300">{selectedSponsor.name}</span>
              <button onClick={() => setSelectedSponsor(null)} className="ml-auto text-slate-400 hover:text-red-500 transition">
                <X size={14} />
              </button>
            </div>
          )}

          <div className="flex gap-3">
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {TIERS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <button
              onClick={handleAdd}
              disabled={!selectedSponsor || adding}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition disabled:opacity-50"
            >
              {adding ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Add
            </button>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab 5: Media Gallery (uses MultiFileUpload + Video Player + Lightbox Modal)
// ─────────────────────────────────────────────────────────────────────────────
function MediaTab({
  event,
  onUpload,
  onRemove,
  inFlight,
}: {
  event: EventData;
  onUpload: (files: UploadedFile[]) => Promise<void>;
  onRemove: (mediaId: string) => Promise<void>;
  inFlight: Set<string>;
}) {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [addingVideo, setAddingVideo] = useState(false);
  const [uploadResults, setUploadResults] = useState<{ name: string; ok: boolean }[]>([]);
  const [activeMedia, setActiveMedia] = useState<MediaItem | null>(null);

  const handleUploaded = useCallback(async (files: UploadedFile[]) => {
    setUploadResults([]);
    await onUpload(files);
    setUploadResults(files.map((f) => ({ name: f.originalName, ok: true })));
  }, [onUpload]);

  const handleAddVideo = async () => {
    if (!videoUrl.trim()) return;
    setAddingVideo(true);

    const isYt = !!getYoutubeEmbedUrl(videoUrl.trim());
    let defaultTitle = "Video";
    if (isYt) defaultTitle = "YouTube Video";

    await onUpload([{
      url: videoUrl.trim(),
      public_id: "",
      mediaType: "video",
      originalName: videoTitle.trim() || defaultTitle,
    }]);
    setVideoUrl("");
    setVideoTitle("");
    setAddingVideo(false);
  };

  const previewYtEmbed = getYoutubeEmbedUrl(videoUrl.trim());
  const previewYtThumb = previewYtEmbed ? getYoutubeThumbnail(videoUrl.trim()) : null;

  return (
    <div className="space-y-6">
      {/* Lightbox / Video Player Modal */}
      {activeMedia && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in"
          onClick={() => setActiveMedia(null)}
        >
          <div
            className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
              <div className="min-w-0 pr-4">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {getYoutubeEmbedUrl(activeMedia.url)
                      ? "YouTube Video"
                      : activeMedia.mediaType === "video"
                      ? "Video"
                      : "Image"}
                  </span>
                  <h3 className="font-semibold text-sm sm:text-base text-slate-800 dark:text-slate-100 truncate">
                    {activeMedia.title || "Gallery Media"}
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <a
                  href={activeMedia.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  title="Open original in new tab"
                >
                  <ExternalLink size={16} />
                </a>
                <button
                  onClick={() => {
                    onRemove(activeMedia._id);
                    setActiveMedia(null);
                  }}
                  disabled={inFlight.has(activeMedia._id)}
                  className="p-2 rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition disabled:opacity-50"
                  title="Delete from gallery"
                >
                  <Trash2 size={16} />
                </button>
                <button
                  onClick={() => setActiveMedia(null)}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
                  title="Close modal"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Media Body */}
            <div className="relative bg-black flex items-center justify-center min-h-[300px] max-h-[70vh] overflow-hidden">
              {getYoutubeEmbedUrl(activeMedia.url) ? (
                <div className="w-full aspect-video max-h-[70vh]">
                  <iframe
                    src={`${getYoutubeEmbedUrl(activeMedia.url)}?autoplay=1&rel=0`}
                    title={activeMedia.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : activeMedia.mediaType === "video" ? (
                <video
                  src={activeMedia.url}
                  controls
                  autoPlay
                  className="w-full max-h-[70vh] object-contain"
                />
              ) : (
                <div className="relative w-full h-[65vh]">
                  <Image
                    src={getOptimizedImageUrl(activeMedia.url, 1600)}
                    alt={activeMedia.title}
                    fill
                    className="object-contain"
                    priority
                    unoptimized={!activeMedia.url.includes("cloudinary.com")}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      <SectionCard title={`Media Gallery (${event.media.length})`}>
        {event.media.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">
            No media in this gallery yet. Use the uploader below or paste a video link to add media.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
            {event.media.map((m) => {
              const ytEmbed = getYoutubeEmbedUrl(m.url);
              const ytThumb = ytEmbed ? getYoutubeThumbnail(m.url) : null;
              const isVideo = m.mediaType === "video" || !!ytEmbed;

              return (
                <div
                  key={m._id}
                  onClick={() => setActiveMedia(m)}
                  className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 aspect-video bg-slate-900 cursor-pointer shadow-xs hover:shadow-md hover:border-indigo-400 transition-all duration-200"
                >
                  {/* Top media badge */}
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-sm border border-white/20 text-white text-[10px] font-semibold flex items-center gap-1 z-10 pointer-events-none">
                    {ytEmbed ? (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        <span>YouTube</span>
                      </>
                    ) : isVideo ? (
                      <>
                        <Video size={11} className="text-indigo-400" />
                        <span>Video</span>
                      </>
                    ) : (
                      <>
                        <ImageIcon size={11} className="text-emerald-400" />
                        <span>Photo</span>
                      </>
                    )}
                  </div>

                  {/* Thumbnail / Media render */}
                  {ytThumb ? (
                    <div className="relative w-full h-full">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={ytThumb}
                        alt={m.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/35 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="w-11 h-11 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play size={18} className="fill-current ml-0.5" />
                        </div>
                      </div>
                    </div>
                  ) : isVideo ? (
                    <div className="relative w-full h-full bg-slate-950 flex items-center justify-center">
                      <video
                        src={m.url}
                        preload="metadata"
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="w-11 h-11 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play size={18} className="fill-current ml-0.5" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Image
                      src={getOptimizedImageUrl(m.url, 400)}
                      alt={m.title}
                      fill
                      style={{ objectFit: "cover" }}
                      className="group-hover:scale-105 transition-transform duration-300"
                      unoptimized={!m.url.includes("cloudinary.com")}
                    />
                  )}

                  {/* Hover action overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2.5">
                    <div className="flex justify-end gap-1.5 pt-1 pr-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemove(m._id);
                        }}
                        disabled={inFlight.has(m._id)}
                        className="p-1.5 bg-red-600/90 hover:bg-red-600 rounded-lg text-white transition disabled:opacity-50 shadow-sm"
                        title="Delete media"
                      >
                        {inFlight.has(m._id) ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <Trash2 size={13} />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-white text-xs">
                      <p className="truncate font-medium flex-1 pr-2">{m.title}</p>
                      <span className="text-[10px] font-mono text-indigo-300 flex items-center gap-0.5 shrink-0">
                        View <Maximize2 size={10} />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>

      {/* Upload images/videos via MultiFileUpload */}
      <SectionCard title="Upload Images & Videos">
        <p className="text-xs text-slate-500 mb-4">
          Drag & drop images from your computer or web (Facebook, Google, etc.), paste with <strong>Ctrl+V</strong>, or browse files. Images are automatically compressed to WebP and uploaded to Cloudinary.
        </p>
        <MultiFileUpload
          onUploaded={handleUploaded}
          folder="event_media"
          accept="image/*,video/*"
          maxFiles={20}
        />
        {uploadResults.length > 0 && (
          <div className="mt-3 space-y-1">
            {uploadResults.map((r, i) => (
              <div
                key={i}
                className={`flex items-center gap-2 text-xs ${
                  r.ok ? "text-green-600 dark:text-green-400" : "text-red-500"
                }`}
              >
                {r.ok ? <Check size={12} /> : <AlertCircle size={12} />}
                {r.name} {r.ok ? "added to gallery" : "failed"}
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Add video URL (YouTube / Vimeo / Direct Video) */}
      <SectionCard title="Add Video Link">
        <p className="text-xs text-slate-500 mb-3">
          Paste a YouTube, Vimeo, or direct video URL (.mp4) to display it with video playback in the gallery.
        </p>
        <div className="space-y-3">
          <input
            type="text"
            value={videoTitle}
            onChange={(e) => setVideoTitle(e.target.value)}
            placeholder="Video title (optional - e.g. Prize Giving Ceremony)"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <div className="flex gap-2">
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=… or https://youtu.be/…"
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button
              type="button"
              onClick={async () => {
                try {
                  const text = await navigator.clipboard.readText();
                  if (text) setVideoUrl(text.trim());
                } catch {
                  // Ignore clipboard permission errors
                }
              }}
              className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center gap-1 shrink-0 transition"
              title="Paste URL from clipboard"
            >
              <ClipboardPaste size={13} />
              <span>Paste</span>
            </button>
            <button
              type="button"
              onClick={handleAddVideo}
              disabled={!videoUrl.trim() || addingVideo}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition disabled:opacity-50 shrink-0"
            >
              {addingVideo ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Add Video
            </button>
          </div>

          {/* Live YouTube Preview */}
          {previewYtThumb && (
            <div className="flex items-center gap-3 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/30 transition-all">
              <div className="relative w-24 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-slate-900 border border-emerald-300 dark:border-emerald-700">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewYtThumb}
                  alt="YouTube Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xs">
                    <Play size={10} className="fill-current ml-0.5" />
                  </div>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 size={13} /> Valid YouTube Video detected
                </p>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  Will be added to the gallery with full thumbnail & embedded playback
                </p>
              </div>
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tab 6: Certificates & Credentials Hub
// ─────────────────────────────────────────────────────────────────────────────
const TYPE_OPTIONS = [
  { value: "participation", label: "Participation" },
  { value: "winner", label: "Winner / Champion" },
  { value: "completion", label: "Completion" },
  { value: "achievement", label: "Achievement" },
  { value: "appreciation", label: "Appreciation" },
  { value: "other", label: "Other" },
];

const TYPE_FILTER_OPTIONS = [
  { value: "all", label: "All Types" },
  { value: "participation", label: "Participation" },
  { value: "winner", label: "Winner" },
  { value: "completion", label: "Completion" },
  { value: "achievement", label: "Achievement" },
  { value: "appreciation", label: "Appreciation" },
];

const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "valid", label: "Valid" },
  { value: "revoked", label: "Revoked" },
];

function CertificatesTab({
  event,
  onRefresh,
  showToast,
}: {
  event: EventData;
  onRefresh: () => Promise<void>;
  showToast: (msg: string, type?: "success" | "error") => void;
}) {
  // Templates state
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<TemplateItem | null>(null);

  // Filters & Search
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modals state
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showWinnersModal, setShowWinnersModal] = useState(false);
  const [showSingleModal, setShowSingleModal] = useState(false);
  const [printTargetCerts, setPrintTargetCerts] = useState<Certificate[] | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Form states - Bulk
  const [bulkTemplateId, setBulkTemplateId] = useState("");
  const [bulkTitle, setBulkTitle] = useState(`${event.title} - Certificate of Participation`);
  const [bulkType, setBulkType] = useState("participation");
  const [bulkDate, setBulkDate] = useState(new Date().toISOString().split("T")[0]);
  const [bulkDesc, setBulkDesc] = useState(`In recognition of active participation and dedication in ${event.title}.`);
  const [selectedParticipantKeys, setSelectedParticipantKeys] = useState<Set<string>>(new Set());
  const [issuingBulk, setIssuingBulk] = useState(false);

  // Form states - Winners
  const [winnerTemplateId, setWinnerTemplateId] = useState("");
  const [winnerTitle, setWinnerTitle] = useState(`${event.title} - Certificate of Excellence`);
  const [winnerDate, setWinnerDate] = useState(new Date().toISOString().split("T")[0]);
  const [winnerDesc, setWinnerDesc] = useState(`For extraordinary skill, innovation, and outstanding performance in ${event.title}.`);
  const [selectedWinnerKeys, setSelectedWinnerKeys] = useState<Set<string>>(new Set());
  const [issuingWinners, setIssuingWinners] = useState(false);

  // Form states - Single
  const [singleTemplateId, setSingleTemplateId] = useState("");
  const [singleRecipientMode, setSingleRecipientMode] = useState<"existing" | "manual">("existing");
  const [singleSelectedKey, setSingleSelectedKey] = useState("");
  const [singleManualName, setSingleManualName] = useState("");
  const [singleManualEmail, setSingleManualEmail] = useState("");
  const [singleManualStudentId, setSingleManualStudentId] = useState("");
  const [singleManualDept, setSingleManualDept] = useState("");
  const [singleTitle, setSingleTitle] = useState(`${event.title} - Certificate of Recognition`);
  const [singleType, setSingleType] = useState("participation");
  const [singlePosition, setSinglePosition] = useState("");
  const [singleDate, setSingleDate] = useState(new Date().toISOString().split("T")[0]);
  const [singleDesc, setSingleDesc] = useState("");
  const [issuingSingle, setIssuingSingle] = useState(false);

  // Fetch certificate templates
  useEffect(() => {
    const fetchTemplates = async () => {
      setLoadingTemplates(true);
      try {
        const res = await axios.get(`${API}/certificate-templates`, { withCredentials: true });
        const list: TemplateItem[] = res.data.data || [];
        setTemplates(list);

        const def = list.find((t) => t.isDefault) || list[0];
        if (def) {
          setBulkTemplateId((p) => p || def._id);
          setWinnerTemplateId((p) => p || def._id);
          setSingleTemplateId((p) => p || def._id);
        }
      } catch (err) {
        console.warn("Failed to load certificate templates", err);
      } finally {
        setLoadingTemplates(false);
      }
    };
    fetchTemplates();
  }, []);

  // Unified approved participants list
  const approvedList = useMemo(() => {
    if (event.approvedParticipants && event.approvedParticipants.length > 0) {
      return event.approvedParticipants.map((p, idx) => ({
        key: p.userId?._id || p.studentId || p.email || `p-${idx}`,
        userId: p.userId?._id,
        fullName: p.fullName,
        email: p.email,
        studentId: p.studentId || "",
        department: p.department || "",
        teamName: p.teamName,
        isCaptain: p.isCaptain,
      }));
    }
    return event.attendees.map((a) => ({
      key: a._id,
      userId: a._id,
      fullName: a.fullName,
      email: a.email,
      studentId: a.studentId || "",
      department: a.department || "",
      teamName: undefined,
      isCaptain: false,
    }));
  }, [event.approvedParticipants, event.attendees]);

  // Initial populate of bulk selection
  useEffect(() => {
    if (approvedList.length > 0 && selectedParticipantKeys.size === 0) {
      setSelectedParticipantKeys(new Set(approvedList.map((p) => p.key)));
    }
  }, [approvedList, selectedParticipantKeys.size]);

  // Winners list flattened
  const flatWinnersList = useMemo(() => {
    const items: {
      key: string;
      userId: string;
      fullName: string;
      studentId: string;
      email: string;
      position: string;
      teamName?: string;
    }[] = [];

    event.winners.forEach((w, wIdx) => {
      w.members.forEach((m, mIdx) => {
        items.push({
          key: `${w._id || wIdx}-${m._id || mIdx}`,
          userId: m._id,
          fullName: m.fullName,
          studentId: m.studentId || "",
          email: m.email,
          position: w.position,
          teamName: w.teamName,
        });
      });
    });
    return items;
  }, [event.winners]);

  // Initial populate of winner selection
  useEffect(() => {
    if (flatWinnersList.length > 0 && selectedWinnerKeys.size === 0) {
      setSelectedWinnerKeys(new Set(flatWinnersList.map((w) => w.key)));
    }
  }, [flatWinnersList, selectedWinnerKeys.size]);

  // Filtered issued certificates
  const filteredCertificates = useMemo(() => {
    return event.certificates.filter((c) => {
      const recipientName = c.recipient?.fullName || c.recipientName || "";
      const matchesSearch =
        !search.trim() ||
        recipientName.toLowerCase().includes(search.toLowerCase().trim()) ||
        c.certificateId.toLowerCase().includes(search.toLowerCase().trim()) ||
        c.name.toLowerCase().includes(search.toLowerCase().trim());

      const matchesType = typeFilter === "all" || c.type === typeFilter;
      const matchesStatus = statusFilter === "all" || (c.status || "valid") === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [event.certificates, search, typeFilter, statusFilter]);

  // Template select options
  const templateOptions = useMemo(() => {
    return templates.map((t) => ({
      value: t._id,
      label: `${t.name}${t.isDefault ? " (Default)" : ""} [${t.type.toUpperCase()}]`,
    }));
  }, [templates]);

  // Handle Delete Certificate
  const handleDeleteCert = async (certId: string) => {
    if (!confirm("Are you sure you want to permanently delete this certificate?")) return;
    try {
      await axios.delete(`${API}/certificates/${certId}`, { withCredentials: true });
      showToast("Certificate deleted successfully.");
      await onRefresh();
    } catch {
      showToast("Failed to delete certificate.", "error");
    }
  };

  // Handle Bulk Issuance
  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const chosen = approvedList.filter((p) => selectedParticipantKeys.has(p.key));
    if (chosen.length === 0) {
      showToast("Please select at least one participant.", "error");
      return;
    }

    setIssuingBulk(true);
    try {
      await axios.post(
        `${API}/certificates/bulk`,
        {
          associatedEventId: event._id,
          name: bulkTitle.trim(),
          description: bulkDesc.trim(),
          type: bulkType,
          templateId: bulkTemplateId || undefined,
          issueDate: bulkDate,
          recipients: chosen.map((p) => ({
            userId: p.userId,
            fullName: p.fullName,
            email: p.email,
            studentId: p.studentId,
            department: p.department,
            type: bulkType,
          })),
        },
        { withCredentials: true }
      );
      showToast(`Successfully issued ${chosen.length} certificates!`);
      setShowBulkModal(false);
      await onRefresh();
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to bulk issue certificates.", "error");
    } finally {
      setIssuingBulk(false);
    }
  };

  // Handle Winners Issuance
  const handleWinnersSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const chosen = flatWinnersList.filter((w) => selectedWinnerKeys.has(w.key));
    if (chosen.length === 0) {
      showToast("Please select at least one winner.", "error");
      return;
    }

    setIssuingWinners(true);
    try {
      await axios.post(
        `${API}/certificates/bulk`,
        {
          associatedEventId: event._id,
          name: winnerTitle.trim(),
          description: winnerDesc.trim(),
          type: "winner",
          templateId: winnerTemplateId || undefined,
          issueDate: winnerDate,
          recipients: chosen.map((w) => ({
            userId: w.userId,
            fullName: w.fullName,
            email: w.email,
            studentId: w.studentId,
            position: w.position,
            type: "winner",
          })),
        },
        { withCredentials: true }
      );
      showToast(`Issued credentials to ${chosen.length} winners!`);
      setShowWinnersModal(false);
      await onRefresh();
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to issue winner certificates.", "error");
    } finally {
      setIssuingWinners(false);
    }
  };

  // Handle Single Issuance
  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIssuingSingle(true);
    try {
      let recipientPayload: any = {};
      if (singleRecipientMode === "existing") {
        const p = approvedList.find((x) => x.key === singleSelectedKey);
        if (!p) {
          showToast("Please select an existing recipient.", "error");
          setIssuingSingle(false);
          return;
        }
        recipientPayload = {
          recipientId: p.userId,
          recipientName: p.fullName,
          recipientEmail: p.email,
          recipientStudentId: p.studentId,
          recipientDepartment: p.department,
        };
      } else {
        if (!singleManualName.trim() || !singleManualEmail.trim()) {
          showToast("Please enter recipient name and email.", "error");
          setIssuingSingle(false);
          return;
        }
        recipientPayload = {
          recipientName: singleManualName.trim(),
          recipientEmail: singleManualEmail.trim(),
          recipientStudentId: singleManualStudentId.trim() || undefined,
          recipientDepartment: singleManualDept.trim() || undefined,
        };
      }

      await axios.post(
        `${API}/certificates`,
        {
          associatedEventId: event._id,
          name: singleTitle.trim(),
          type: singleType,
          position: singlePosition.trim() || undefined,
          description: singleDesc.trim() || undefined,
          templateId: singleTemplateId || undefined,
          issueDate: singleDate,
          ...recipientPayload,
        },
        { withCredentials: true }
      );

      showToast("Certificate issued successfully!");
      setShowSingleModal(false);
      setSingleManualName("");
      setSingleManualEmail("");
      setSingleManualStudentId("");
      setSingleManualDept("");
      await onRefresh();
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to issue certificate.", "error");
    } finally {
      setIssuingSingle(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Metric Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border border-border-default bg-surface-elevated shadow-sm">
          <span className="text-xs text-text-secondary font-mono block mb-1">Total Issued</span>
          <div className="text-2xl font-black text-text-primary flex items-center gap-1.5">
            <Award size={22} className="text-accent-primary" />
            {event.certificates.length}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border-default bg-surface-elevated shadow-sm">
          <span className="text-xs text-text-secondary font-mono block mb-1">Participants</span>
          <div className="text-2xl font-black text-text-primary flex items-center gap-1.5">
            <Users size={22} className="text-blue-500" />
            {approvedList.length}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border-default bg-surface-elevated shadow-sm">
          <span className="text-xs text-text-secondary font-mono block mb-1">Winners Defined</span>
          <div className="text-2xl font-black text-text-primary flex items-center gap-1.5">
            <Trophy size={22} className="text-amber-500" />
            {flatWinnersList.length}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border-default bg-surface-elevated shadow-sm">
          <span className="text-xs text-text-secondary font-mono block mb-1">Templates Ready</span>
          <div className="text-2xl font-black text-text-primary flex items-center gap-1.5">
            <Sparkles size={22} className="text-purple-500" />
            {templates.length}
          </div>
        </div>
      </div>

      {/* Main Hub Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-elevated p-4 rounded-2xl border-2 border-border-brutalist shadow-[4px_4px_0px_var(--border-brutalist)]">
        <div>
          <h2 className="text-base font-black text-text-primary">Event Certificate Issuance Hub</h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Issue credentials to all participants or contest winners, and batch print certificates.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="primary"
            onClick={() => setPrintTargetCerts(event.certificates)}
            disabled={event.certificates.length === 0}
            title={event.certificates.length === 0 ? "No certificates issued to print" : "Print all certificates"}
          >
            <Printer size={15} className="mr-1.5" />
            Print All Certificates ({event.certificates.length})
          </Button>

          <Button
            variant="secondary"
            onClick={() => setShowBulkModal(true)}
            disabled={approvedList.length === 0}
          >
            <Users size={14} className="mr-1.5" />
            Bulk Issue
          </Button>

          <Button
            variant="outline"
            onClick={() => setShowWinnersModal(true)}
            disabled={event.winners.length === 0}
            title={event.winners.length === 0 ? "Define winners in Winners tab first" : "Issue to contest winners"}
          >
            <Trophy size={14} className="mr-1.5" />
            Issue to Winners
          </Button>

          <Button
            variant="outline"
            onClick={() => setShowSingleModal(true)}
          >
            <Plus size={14} className="mr-1.5" />
            Single Issue
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-surface-secondary/40 p-3 rounded-xl border border-border-default">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by recipient or certificate ID…"
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-border-default bg-surface-elevated text-xs text-text-primary outline-none focus:border-accent-primary"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-36">
            <FilterSelect
              value={typeFilter}
              onChange={setTypeFilter}
              options={TYPE_FILTER_OPTIONS}
              placeholder="Filter by type"
            />
          </div>

          <div className="w-36">
            <FilterSelect
              value={statusFilter}
              onChange={setStatusFilter}
              options={STATUS_FILTER_OPTIONS}
              placeholder="Filter by status"
            />
          </div>
        </div>
      </div>

      {/* Certificate Registry Cards */}
      <SectionCard title={`Issued Certificates (${filteredCertificates.length})`}>
        {filteredCertificates.length === 0 ? (
          <div className="text-center py-12">
            <Award size={40} className="mx-auto text-text-secondary/40 mb-3" />
            <p className="text-sm font-bold text-text-primary">No certificates match your query</p>
            <p className="text-xs text-text-secondary mt-1 max-w-sm mx-auto">
              Use the bulk or winner issuance buttons above to generate certified credentials for this event.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredCertificates.map((c) => {
              const recipientName = c.recipient?.fullName || c.recipientName || "Participant";
              const recipientId = c.recipient?.studentId || c.recipientStudentId;
              const verifyUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/verify?cert=${c.certificateId}`;

              return (
                <div
                  key={c._id}
                  className="bg-surface-elevated p-4 rounded-xl border border-border-default hover:border-accent-primary/60 transition-all shadow-sm flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="min-w-0">
                        <h4 className="text-sm font-black text-text-primary truncate">{recipientName}</h4>
                        <p className="text-xs text-text-secondary truncate">
                          {recipientId ? `ID: ${recipientId} · ` : ""}
                          {c.name}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {c.position && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            ★ {c.position}
                          </span>
                        )}
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${CERT_TYPE_COLORS[c.type] || "bg-slate-100 text-slate-700"}`}>
                          {c.type}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] font-mono text-text-secondary mt-2">
                      <span className="bg-surface-secondary px-2 py-0.5 rounded border border-border-default font-bold text-accent-primary">
                        {c.certificateId}
                      </span>
                      <span>Issued {fmtDate(c.issueDate)}</span>
                    </div>
                  </div>

                  {/* Actions Bar on card */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-border-default text-xs">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setPrintTargetCerts([c])}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-border-default hover:bg-accent-primary hover:text-white transition font-medium text-[11px]"
                        title="Print Certificate"
                      >
                        <Printer size={12} /> Print
                      </button>

                      <a
                        href={verifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-2.5 py-1 rounded-md border border-border-default hover:bg-surface-secondary text-text-secondary hover:text-text-primary transition font-medium text-[11px]"
                        title="Open Public Verification Link"
                      >
                        <ExternalLink size={12} /> Verify
                      </a>

                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(verifyUrl);
                          showToast("Verification link copied!");
                        }}
                        className="p-1 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition"
                        title="Copy Verification URL"
                      >
                        <Copy size={12} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteCert(c._id)}
                      className="p-1 rounded-md text-text-secondary hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                      title="Delete Certificate"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>

      {/* ── MODAL 1: Bulk Issue ── */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-surface-elevated rounded-2xl border-2 border-border-brutalist shadow-[8px_8px_0px_var(--accent-primary)] flex flex-col overflow-hidden max-h-[90vh]">
            <div className="p-4 border-b-2 border-border-brutalist bg-surface-secondary flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] font-bold text-accent-primary uppercase tracking-wider block">Bulk Issuance</span>
                <h3 className="text-base font-black text-text-primary">Issue Certificates to Participants</h3>
              </div>
              <button
                onClick={() => setShowBulkModal(false)}
                className="p-1.5 rounded-lg border border-border-default hover:bg-surface-elevated text-text-secondary"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleBulkSubmit} className="p-5 overflow-y-auto space-y-4">
              {/* Template picker */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-text-primary">Certificate Template *</label>
                  {bulkTemplateId && (
                    <button
                      type="button"
                      onClick={() => {
                        const t = templates.find((x) => x._id === bulkTemplateId);
                        if (t) setPreviewTemplate(t);
                      }}
                      className="text-[11px] font-bold text-accent-primary hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Eye size={12} /> Preview Template
                    </button>
                  )}
                </div>
                <Select
                  value={bulkTemplateId}
                  onChange={setBulkTemplateId}
                  options={templateOptions}
                  placeholder="Select certificate template..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-text-primary mb-1 block">Certificate Title *</label>
                  <input
                    type="text"
                    value={bulkTitle}
                    onChange={(e) => setBulkTitle(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 rounded-lg border border-border-default bg-surface-primary text-xs text-text-primary outline-none focus:border-accent-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-text-primary mb-1 block">Award Type *</label>
                  <Select
                    value={bulkType}
                    onChange={setBulkType}
                    options={TYPE_OPTIONS}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-text-primary mb-1 block">Issue Date *</label>
                  <input
                    type="date"
                    value={bulkDate}
                    onChange={(e) => setBulkDate(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 rounded-lg border border-border-default bg-surface-primary text-xs text-text-primary outline-none focus:border-accent-primary"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-text-primary mb-1 block">Citation / Description</label>
                  <textarea
                    rows={2}
                    value={bulkDesc}
                    onChange={(e) => setBulkDesc(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-border-default bg-surface-primary text-xs text-text-primary outline-none focus:border-accent-primary resize-none"
                  />
                </div>
              </div>

              {/* Participant selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-text-primary">
                    Recipients ({selectedParticipantKeys.size} of {approvedList.length} selected)
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedParticipantKeys(new Set(approvedList.map((p) => p.key)))}
                      className="text-[11px] font-bold text-accent-primary hover:underline cursor-pointer"
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedParticipantKeys(new Set())}
                      className="text-[11px] font-bold text-text-secondary hover:underline cursor-pointer"
                    >
                      Deselect All
                    </button>
                  </div>
                </div>

                <div className="max-h-48 overflow-y-auto border border-border-default rounded-xl p-2 space-y-1.5 bg-surface-primary">
                  {approvedList.map((p) => {
                    const isChecked = selectedParticipantKeys.has(p.key);
                    return (
                      <label
                        key={p.key}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition text-xs ${
                          isChecked ? "bg-accent-primary/10 border border-accent-primary/30" : "hover:bg-surface-secondary"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              const next = new Set(selectedParticipantKeys);
                              if (e.target.checked) next.add(p.key);
                              else next.delete(p.key);
                              setSelectedParticipantKeys(next);
                            }}
                            className="rounded border-border-default text-accent-primary focus:ring-accent-primary"
                          />
                          <div>
                            <span className="font-bold text-text-primary block">{p.fullName}</span>
                            <span className="text-[10px] text-text-secondary">
                              {p.studentId ? `ID: ${p.studentId} · ` : ""}{p.email}
                            </span>
                          </div>
                        </div>

                        {p.teamName && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300">
                            {p.teamName}
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-border-default flex items-center justify-end gap-2">
                <Button variant="outline" type="button" onClick={() => setShowBulkModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" disabled={issuingBulk || selectedParticipantKeys.size === 0}>
                  {issuingBulk ? <Loader2 size={14} className="animate-spin mr-1.5" /> : <Award size={14} className="mr-1.5" />}
                  Issue {selectedParticipantKeys.size} Certificates
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 2: Issue to Winners ── */}
      {showWinnersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-surface-elevated rounded-2xl border-2 border-border-brutalist shadow-[8px_8px_0px_var(--accent-primary)] flex flex-col overflow-hidden max-h-[90vh]">
            <div className="p-4 border-b-2 border-border-brutalist bg-surface-secondary flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] font-bold text-amber-500 uppercase tracking-wider block">Winner Awards</span>
                <h3 className="text-base font-black text-text-primary">Issue Credentials to Contest Winners</h3>
              </div>
              <button
                onClick={() => setShowWinnersModal(false)}
                className="p-1.5 rounded-lg border border-border-default hover:bg-surface-elevated text-text-secondary"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleWinnersSubmit} className="p-5 overflow-y-auto space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-text-primary">Certificate Template *</label>
                  {winnerTemplateId && (
                    <button
                      type="button"
                      onClick={() => {
                        const t = templates.find((x) => x._id === winnerTemplateId);
                        if (t) setPreviewTemplate(t);
                      }}
                      className="text-[11px] font-bold text-accent-primary hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Eye size={12} /> Preview Template
                    </button>
                  )}
                </div>
                <Select
                  value={winnerTemplateId}
                  onChange={setWinnerTemplateId}
                  options={templateOptions}
                  placeholder="Select certificate template..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-text-primary mb-1 block">Certificate Title *</label>
                  <input
                    type="text"
                    value={winnerTitle}
                    onChange={(e) => setWinnerTitle(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 rounded-lg border border-border-default bg-surface-primary text-xs text-text-primary outline-none focus:border-accent-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-text-primary mb-1 block">Issue Date *</label>
                  <input
                    type="date"
                    value={winnerDate}
                    onChange={(e) => setWinnerDate(e.target.value)}
                    required
                    className="w-full px-3.5 py-2 rounded-lg border border-border-default bg-surface-primary text-xs text-text-primary outline-none focus:border-accent-primary"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-text-primary mb-1 block">Citation / Description</label>
                  <textarea
                    rows={2}
                    value={winnerDesc}
                    onChange={(e) => setWinnerDesc(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-border-default bg-surface-primary text-xs text-text-primary outline-none focus:border-accent-primary resize-none"
                  />
                </div>
              </div>

              {/* Winners Checklist */}
              <div>
                <label className="text-xs font-bold text-text-primary mb-2 block">
                  Select Winners ({selectedWinnerKeys.size} of {flatWinnersList.length})
                </label>
                <div className="max-h-52 overflow-y-auto border border-border-default rounded-xl p-2 space-y-1.5 bg-surface-primary">
                  {flatWinnersList.map((w) => {
                    const isChecked = selectedWinnerKeys.has(w.key);
                    return (
                      <label
                        key={w.key}
                        className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition text-xs ${
                          isChecked ? "bg-amber-50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-800" : "hover:bg-surface-secondary"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              const next = new Set(selectedWinnerKeys);
                              if (e.target.checked) next.add(w.key);
                              else next.delete(w.key);
                              setSelectedWinnerKeys(next);
                            }}
                            className="rounded border-border-default text-amber-500 focus:ring-amber-500"
                          />
                          <div>
                            <span className="font-bold text-text-primary block">{w.fullName}</span>
                            <span className="text-[10px] text-text-secondary">
                              {w.teamName ? `Squad: ${w.teamName} · ` : ""}{w.email}
                            </span>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          ★ {w.position}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-border-default flex items-center justify-end gap-2">
                <Button variant="outline" type="button" onClick={() => setShowWinnersModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" disabled={issuingWinners || selectedWinnerKeys.size === 0}>
                  {issuingWinners ? <Loader2 size={14} className="animate-spin mr-1.5" /> : <Trophy size={14} className="mr-1.5" />}
                  Issue to {selectedWinnerKeys.size} Winners
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 3: Single Issue ── */}
      {showSingleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl bg-surface-elevated rounded-2xl border-2 border-border-brutalist shadow-[8px_8px_0px_var(--accent-primary)] flex flex-col overflow-hidden max-h-[90vh]">
            <div className="p-4 border-b-2 border-border-brutalist bg-surface-secondary flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] font-bold text-accent-primary uppercase tracking-wider block">Single Issuance</span>
                <h3 className="text-base font-black text-text-primary">Issue Individual Certificate</h3>
              </div>
              <button
                onClick={() => setShowSingleModal(false)}
                className="p-1.5 rounded-lg border border-border-default hover:bg-surface-elevated text-text-secondary"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSingleSubmit} className="p-5 overflow-y-auto space-y-4">
              {/* Recipient Source Mode */}
              <div className="flex gap-2 border-b border-border-default pb-2">
                <button
                  type="button"
                  onClick={() => setSingleRecipientMode("existing")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    singleRecipientMode === "existing" ? "bg-accent-primary text-white" : "bg-surface-secondary text-text-secondary"
                  }`}
                >
                  Event Participant
                </button>
                <button
                  type="button"
                  onClick={() => setSingleRecipientMode("manual")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    singleRecipientMode === "manual" ? "bg-accent-primary text-white" : "bg-surface-secondary text-text-secondary"
                  }`}
                >
                  Guest / Non-Member
                </button>
              </div>

              {singleRecipientMode === "existing" ? (
                <div>
                  <label className="text-xs font-bold text-text-primary mb-1 block">Select Attendee *</label>
                  <Select
                    value={singleSelectedKey}
                    onChange={setSingleSelectedKey}
                    options={approvedList.map((p) => ({
                      value: p.key,
                      label: `${p.fullName} (${p.studentId || p.email})`,
                    }))}
                    placeholder="Choose an approved attendee..."
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-text-primary mb-1 block">Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. John Doe"
                      value={singleManualName}
                      onChange={(e) => setSingleManualName(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-border-default bg-surface-primary text-xs text-text-primary outline-none focus:border-accent-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-text-primary mb-1 block">Email Address *</label>
                    <input
                      type="email"
                      placeholder="e.g. john@example.com"
                      value={singleManualEmail}
                      onChange={(e) => setSingleManualEmail(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-border-default bg-surface-primary text-xs text-text-primary outline-none focus:border-accent-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-text-primary mb-1 block">Student ID / Roll (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. 2021331501"
                      value={singleManualStudentId}
                      onChange={(e) => setSingleManualStudentId(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border-default bg-surface-primary text-xs text-text-primary outline-none focus:border-accent-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-text-primary mb-1 block">Department / Institution (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. CSE"
                      value={singleManualDept}
                      onChange={(e) => setSingleManualDept(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-border-default bg-surface-primary text-xs text-text-primary outline-none focus:border-accent-primary"
                    />
                  </div>
                </div>
              )}

              {/* Template Picker */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-text-primary">Certificate Template *</label>
                  {singleTemplateId && (
                    <button
                      type="button"
                      onClick={() => {
                        const t = templates.find((x) => x._id === singleTemplateId);
                        if (t) setPreviewTemplate(t);
                      }}
                      className="text-[11px] font-bold text-accent-primary hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Eye size={12} /> Preview Template
                    </button>
                  )}
                </div>
                <Select
                  value={singleTemplateId}
                  onChange={setSingleTemplateId}
                  options={templateOptions}
                  placeholder="Select certificate template..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-text-primary mb-1 block">Certificate Title *</label>
                  <input
                    type="text"
                    value={singleTitle}
                    onChange={(e) => setSingleTitle(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-border-default bg-surface-primary text-xs text-text-primary outline-none focus:border-accent-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-text-primary mb-1 block">Award Type *</label>
                  <Select
                    value={singleType}
                    onChange={setSingleType}
                    options={TYPE_OPTIONS}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-text-primary mb-1 block">Position / Rank (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. 1st Place, Best Innovator"
                    value={singlePosition}
                    onChange={(e) => setSinglePosition(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border-default bg-surface-primary text-xs text-text-primary outline-none focus:border-accent-primary"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-text-primary mb-1 block">Issue Date *</label>
                  <input
                    type="date"
                    value={singleDate}
                    onChange={(e) => setSingleDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-border-default bg-surface-primary text-xs text-text-primary outline-none focus:border-accent-primary"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-text-primary mb-1 block">Citation Description</label>
                  <textarea
                    rows={2}
                    value={singleDesc}
                    onChange={(e) => setSingleDesc(e.target.value)}
                    placeholder="Citation description..."
                    className="w-full px-3 py-2 rounded-lg border border-border-default bg-surface-primary text-xs text-text-primary outline-none focus:border-accent-primary resize-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-border-default flex items-center justify-end gap-2">
                <Button variant="outline" type="button" onClick={() => setShowSingleModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit" disabled={issuingSingle}>
                  {issuingSingle ? <Loader2 size={14} className="animate-spin mr-1.5" /> : <Award size={14} className="mr-1.5" />}
                  Issue Certificate
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 4: Print All / Batch Printable Sheets Modal ── */}
      {mounted && printTargetCerts && typeof document !== "undefined" && createPortal(
        <div id="cert-print-portal" className="fixed inset-0 z-[100] flex flex-col bg-black/90 backdrop-blur-md overflow-hidden print:static print:inset-auto print:overflow-visible print:bg-white print:h-auto print:w-full print:block">
          {/* Printable style overrides */}
          <style dangerouslySetInnerHTML={{
            __html: `
              @media print {
                @page {
                  size: landscape;
                  margin: 0;
                }
                html, body {
                  background: #FFFFFF !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  overflow: visible !important;
                  height: auto !important;
                  min-height: 100% !important;
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
                /* Hide everything in the page except the print portal */
                body > :not(#cert-print-portal) {
                  display: none !important;
                  visibility: hidden !important;
                  height: 0 !important;
                  max-height: 0 !important;
                  overflow: hidden !important;
                }
                #cert-print-portal {
                  display: block !important;
                  position: static !important;
                  inset: auto !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  width: 100vw !important;
                  height: auto !important;
                  background: #FFFFFF !important;
                  overflow: visible !important;
                }
                #cert-print-portal,
                #cert-print-portal * {
                  visibility: visible !important;
                }
                #printable-certificates-hub {
                  position: static !important;
                  left: auto !important;
                  top: auto !important;
                  width: 100vw !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  background: #FFFFFF !important;
                  display: block !important;
                }
                .print-cert-sheet {
                  box-sizing: border-box !important;
                  width: 100vw !important;
                  height: 100vh !important;
                  max-width: 100vw !important;
                  max-height: 100vh !important;
                  aspect-ratio: auto !important;
                  margin: 0 !important;
                  padding: 8mm 12mm !important;
                  box-shadow: none !important;
                  border-radius: 0 !important;
                  page-break-inside: avoid !important;
                  break-inside: avoid !important;
                  overflow: hidden !important;
                  display: flex !important;
                  flex-direction: column !important;
                  justify-content: space-between !important;
                  background: #FFFFFF !important;
                }
                .print-cert-sheet:not(:last-child) {
                  page-break-after: always !important;
                  break-after: page !important;
                }
                .print-cert-sheet:last-child {
                  page-break-after: avoid !important;
                  break-after: avoid !important;
                }
              }
            `
          }} />

          {/* Modal Header Controls (Hidden during print) */}
          <div className="p-4 bg-surface-elevated border-b-2 border-border-brutalist flex items-center justify-between z-10 print:hidden">
            <div>
              <span className="font-mono text-[10px] font-bold text-accent-primary uppercase tracking-wider block">Batch Printing Mode</span>
              <h2 className="text-base font-black text-text-primary">
                Print Certificates ({printTargetCerts.length} page{printTargetCerts.length !== 1 ? "s" : ""})
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="primary"
                onClick={() => window.print()}
                className="cursor-pointer"
              >
                <Printer size={16} className="mr-1.5" />
                Print / Save PDF
              </Button>

              <button
                type="button"
                onClick={() => setPrintTargetCerts(null)}
                className="p-2 rounded-lg border border-border-default hover:bg-surface-secondary text-text-secondary cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Printable Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-900/60 print:p-0 print:bg-white print:overflow-visible print:h-auto print:block">
            <div id="printable-certificates-hub" className="max-w-4xl mx-auto space-y-8 print:space-y-0 print:max-w-none print:w-full print:m-0 print:p-0">
              {printTargetCerts.map((c, index) => {
                const recipientName = c.recipient?.fullName || c.recipientName || "Participant";
                const studentId = c.recipient?.studentId || c.recipientStudentId || "";
                const department = c.recipient?.department || c.recipientDepartment || "";
                const verifyUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/verify?cert=${c.certificateId}`;

                if (c.template?.type === "html" && c.template.htmlContent) {
                  const html = interpolateCertificateHtml(c.template.htmlContent, {
                    recipient_name: recipientName,
                    student_id: studentId,
                    department: department,
                    event_title: event.title,
                    certificate_title: c.name,
                    certificate_id: c.certificateId,
                    issue_date: fmtDate(c.issueDate),
                    position: c.position || (c.type === "winner" ? "Winner" : undefined),
                    description: c.description || `In recognition of active participation and dedication in ${event.title}.`,
                    verification_url: verifyUrl,
                  });

                  return (
                    <div
                      key={c._id}
                      className="print-cert-sheet w-full aspect-[1.414/1] bg-white rounded-xl overflow-hidden border-2 border-slate-300 shadow-xl print:border-none print:shadow-none print:rounded-none"
                    >
                      <iframe
                        title={c.certificateId}
                        srcDoc={html}
                        sandbox="allow-same-origin"
                        className="w-full h-full border-none"
                      />
                    </div>
                  );
                }

                // Visual Preset Fallback
                return (
                  <div
                    key={c._id}
                    className="print-cert-sheet w-full aspect-[1.414/1] bg-white text-slate-900 rounded-xl p-8 sm:p-12 text-center relative flex flex-col justify-between overflow-hidden shadow-2xl border-4 print:border-4 print:shadow-none print:rounded-none"
                    style={{
                      backgroundColor: "#FFFFFF",
                      color: "#0F172A",
                      borderColor: c.template?.primaryColor || "#0F766E",
                      borderStyle: c.template?.borderStyle === "classic-ornate" ? "double" : "solid",
                      borderWidth: c.template?.borderStyle === "none" ? "0px" : c.template?.borderStyle === "classic-ornate" ? "8px" : "4px",
                      boxShadow: c.template?.borderStyle === "neo-brutalist" ? `8px 8px 0px ${c.template.primaryColor || "#0F766E"}` : undefined,
                      backgroundImage: c.template?.backgroundUrl ? `url(${c.template.backgroundUrl})` : undefined,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    {/* Header */}
                    <div>
                      <div
                        className="flex items-center justify-center gap-2 mb-2"
                        style={{ color: c.template?.primaryColor || "#0F766E" }}
                      >
                        <Award size={26} />
                        <span className="font-mono text-xs font-black tracking-widest uppercase">
                          {c.template?.headerSubtitle || "MYMENSINGH ENGINEERING COLLEGE COMPUTER CLUB"}
                        </span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase mb-1">
                        {c.name}
                      </h3>
                      {c.position ? (
                        <span className="inline-block text-xs font-mono font-extrabold uppercase px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-300">
                          ★ {c.position}
                        </span>
                      ) : (
                        <span className="inline-block text-xs font-mono font-bold uppercase px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                          {c.type.toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* Recipient Details */}
                    <div className="my-4 py-4 border-t-2 border-b-2 border-dashed border-slate-300">
                      <span className="text-xs font-mono text-slate-400 uppercase tracking-widest block mb-1">
                        {c.template?.presentationText || "PROUDLY PRESENTED TO"}
                      </span>
                      <h4 className="text-2xl sm:text-3xl font-black" style={{ color: c.template?.primaryColor || "#0F766E" }}>
                        {recipientName}
                      </h4>
                      {(studentId || department) && (
                        <p className="text-xs sm:text-sm font-mono text-slate-600 mt-1">
                          {studentId ? <>Student ID: <strong className="text-slate-900">{studentId}</strong></> : null}
                          {department ? <> &bull; Dept. of {department}</> : null}
                        </p>
                      )}
                      <p className="text-xs sm:text-sm text-slate-600 italic mt-2 max-w-lg mx-auto">
                        &ldquo;{c.description || `In recognition of active participation, dedication, and valued contribution to ${event.title}.`}&rdquo;
                      </p>
                    </div>

                    {/* Event info */}
                    <div className="text-xs font-mono text-slate-600">
                      Event: <strong className="text-slate-900">{event.title}</strong>
                    </div>

                    {/* Signatures & Verification */}
                    <div className="pt-4 border-t border-slate-200 flex items-end justify-between font-mono text-xs">
                      <div className="text-center">
                        <div className="w-28 sm:w-36 border-t-2 border-slate-900 mx-auto pt-1 font-bold text-slate-900 line-clamp-1">
                          President
                        </div>
                        <div className="text-[10px] text-slate-400">MEC Computer Club</div>
                      </div>

                      <div className="text-center">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&margin=0&data=${encodeURIComponent(verifyUrl)}`}
                          alt="Verification QR"
                          className="w-14 h-14 mx-auto border border-slate-300 p-1 bg-white"
                        />
                        <span className="block font-bold text-slate-900 text-[10px] mt-1">{c.certificateId}</span>
                      </div>

                      <div className="text-center">
                        <div className="w-28 sm:w-36 border-t-2 border-slate-900 mx-auto pt-1 font-bold text-slate-900 line-clamp-1">
                          Faculty Advisor
                        </div>
                        <div className="text-[10px] text-slate-400">MEC</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ── MODAL 5: Certificate Template Preview Modal ── */}
      {previewTemplate && (
        <CertificateTemplatePreviewModal
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page Component
// ─────────────────────────────────────────────────────────────────────────────
type TabId = "overview" | "participants" | "volunteers" | "winners" | "sponsors" | "media" | "certificates" | "mailing";

export default function EventDetailPage() {
  const { isAllowed, isLoading: guardLoading } = useRoleGuard(["admin", "moderator", "executive"]);
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [inFlight, setInFlight] = useState<Set<string>>(new Set());
  const [winnerSaving, setWinnerSaving] = useState(false);
  const [mailingPrefill, setMailingPrefill] = useState<{
    audience: "approved_participants" | "pending_registrants" | "volunteers" | "sponsors" | "all" | "custom";
    customEmails: string;
    deliveryMethod: "bcc" | "cc" | "individual";
  } | null>(null);

  const showToast = useCallback((msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const handleEmailApplicant = useCallback((email: string, name: string) => {
    setMailingPrefill({
      audience: "custom",
      customEmails: email,
      deliveryMethod: "individual",
    });
    setActiveTab("mailing");
    showToast(`Composing personalized email for ${name || email}`);
  }, [showToast]);

  const addInFlight = useCallback((key: string) =>
    setInFlight((s) => new Set(s).add(key)), []);
  const removeInFlight = useCallback((key: string) =>
    setInFlight((s) => { const n = new Set(s); n.delete(key); return n; }), []);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchEvent = useCallback(async () => {
    try {
      const [resEvent, resCerts] = await Promise.all([
        axios.get(`${API}/events/${id}`, { withCredentials: true }),
        axios.get(`${API}/certificates/event/${id}`, { withCredentials: true }).catch(() => ({ data: { data: [] } })),
      ]);
      const raw = resEvent.data.data;
      const certs = resCerts.data.data && resCerts.data.data.length > 0 ? resCerts.data.data : raw.certificates || [];

      setEvent({
        ...raw,
        attendees: raw.attendees || [],
        approvedParticipants: raw.approvedParticipants || [],
        pendingParticipants: raw.pendingParticipants || [],
        winners: raw.winners || [],
        eventSponsors: raw.eventSponsors || [],
        media: raw.media || [],
        certificates: certs,
        tags: raw.tags || [],
        contributors: raw.contributors || [],
      });
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message || `Server error (${err.response?.status})`
        : "Failed to load event.";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  }, [id, showToast]);

  useEffect(() => { fetchEvent(); }, [fetchEvent]);

  // ── Participant handlers ──────────────────────────────────────────────────
  const handleApprove = useCallback(async (targetId: string) => {
    addInFlight(targetId);
    try {
      await axios.patch(`${API}/events/${id}/participants/${targetId}/approve`, {}, { withCredentials: true });
      await fetchEvent();
      showToast("Approved and confirmation email sent!");
    } catch {
      showToast("Failed to approve.", "error");
    } finally {
      removeInFlight(targetId);
    }
  }, [id, addInFlight, removeInFlight, showToast, fetchEvent]);

  const handleReject = useCallback(async (targetId: string) => {
    addInFlight(targetId);
    try {
      await axios.patch(`${API}/events/${id}/participants/${targetId}/reject`, {}, { withCredentials: true });
      await fetchEvent();
      showToast("Registration rejected.");
    } catch {
      showToast("Failed to reject.", "error");
    } finally {
      removeInFlight(targetId);
    }
  }, [id, addInFlight, removeInFlight, showToast, fetchEvent]);

  const handleApproveClaim = useCallback(async (claimId: string) => {
    addInFlight(claimId);
    try {
      await axios.patch(`${API}/events/${id}/claims/${claimId}/approve`, {}, { withCredentials: true });
      await fetchEvent();
      showToast("Participation claim approved and member added to attendees!");
    } catch {
      showToast("Failed to approve claim.", "error");
    } finally {
      removeInFlight(claimId);
    }
  }, [id, addInFlight, removeInFlight, showToast, fetchEvent]);

  const handleRejectClaim = useCallback(async (claimId: string) => {
    addInFlight(claimId);
    try {
      await axios.patch(`${API}/events/${id}/claims/${claimId}/reject`, {}, { withCredentials: true });
      await fetchEvent();
      showToast("Participation claim rejected.");
    } catch {
      showToast("Failed to reject claim.", "error");
    } finally {
      removeInFlight(claimId);
    }
  }, [id, addInFlight, removeInFlight, showToast, fetchEvent]);

  const handleRemoveAttendee = useCallback(async (userId: string) => {
    addInFlight(userId);
    try {
      await axios.delete(`${API}/events/${id}/participants/${userId}`, { withCredentials: true });
      await fetchEvent();
      showToast("Attendee removed.");
    } catch {
      showToast("Failed to remove.", "error");
    } finally {
      removeInFlight(userId);
    }
  }, [id, addInFlight, removeInFlight, showToast, fetchEvent]);

  const handleAddAttendee = useCallback(async (user: UserRef) => {
    addInFlight(user._id);
    try {
      await axios.post(`${API}/events/${id}/participants/add`, { userIds: [user._id] }, { withCredentials: true });
      await fetchEvent();
      showToast(`${user.fullName} added as attendee.`);
    } catch {
      showToast("Failed to add attendee.", "error");
    } finally {
      removeInFlight(user._id);
    }
  }, [id, addInFlight, removeInFlight, showToast, fetchEvent]);

  const handleAddNonMemberAttendee = useCallback(async (guest: {
    fullName: string;
    email: string;
    studentId?: string;
    department?: string;
  }) => {
    try {
      await axios.post(
        `${API}/events/${id}/participants/add`,
        { nonMembers: [guest] },
        { withCredentials: true }
      );
      await fetchEvent();
      showToast(`${guest.fullName} added as participant.`);
    } catch {
      showToast("Failed to add non-member participant.", "error");
    }
  }, [id, fetchEvent, showToast]);

  // ── Winners handler ───────────────────────────────────────────────────────
  const handleSaveWinners = useCallback(async (
    winners: { teamName?: string; members: string[]; position: string; prize?: string }[]
  ) => {
    setWinnerSaving(true);
    try {
      await axios.put(`${API}/events/${id}/winners`, { winners }, { withCredentials: true });
      await fetchEvent();
      showToast("Winners saved.");
    } catch {
      showToast("Failed to save winners.", "error");
    } finally {
      setWinnerSaving(false);
    }
  }, [id, fetchEvent, showToast]);

  // ── Sponsor handlers ──────────────────────────────────────────────────────
  const handleAddSponsor = useCallback(async (
    sponsorId: string, sponsorName: string, logoUrl: string, tier: string
  ) => {
    addInFlight(sponsorId);
    try {
      await axios.post(`${API}/events/${id}/sponsors`, { sponsorId, sponsorName, logoUrl, tier }, { withCredentials: true });
      setEvent((prev) => prev ? {
        ...prev,
        eventSponsors: [...prev.eventSponsors, { _id: sponsorId, sponsorId, sponsorName, logoUrl, tier }],
      } : prev);
      showToast("Sponsor added.");
    } catch {
      showToast("Failed to add sponsor.", "error");
    } finally {
      removeInFlight(sponsorId);
    }
  }, [id, addInFlight, removeInFlight, showToast]);

  const handleRemoveSponsor = useCallback(async (sponsorId: string) => {
    addInFlight(sponsorId);
    try {
      await axios.delete(`${API}/events/${id}/sponsors/${sponsorId}`, { withCredentials: true });
      setEvent((prev) => prev ? {
        ...prev,
        eventSponsors: prev.eventSponsors.filter((s) => s.sponsorId !== sponsorId),
      } : prev);
      showToast("Sponsor removed.");
    } catch {
      showToast("Failed to remove sponsor.", "error");
    } finally {
      removeInFlight(sponsorId);
    }
  }, [id, addInFlight, removeInFlight, showToast]);

  // ── Media handlers ────────────────────────────────────────────────────────
  const handleUploadMedia = useCallback(async (files: UploadedFile[]) => {
    for (const file of files) {
      const mediaId = `upload-${Date.now()}-${Math.random()}`;
      addInFlight(mediaId);
      try {
        const res = await axios.post(
          `${API}/events/${id}/media`,
          {
            url: file.url,
            title: file.originalName,
            mediaType: file.mediaType,
            publicId: file.public_id,
          },
          { withCredentials: true }
        );
        const newItem: MediaItem = res.data.data || {
          _id: mediaId,
          url: file.url,
          title: file.originalName,
          mediaType: file.mediaType,
        };
        setEvent((prev) => prev ? { ...prev, media: [...prev.media, newItem] } : prev);
      } catch {
        showToast(`Failed to save ${file.originalName}.`, "error");
      } finally {
        removeInFlight(mediaId);
      }
    }
    if (files.length > 0) showToast(`${files.length} item${files.length !== 1 ? "s" : ""} added to gallery.`);
  }, [id, addInFlight, removeInFlight, showToast]);

  const handleRemoveMedia = useCallback(async (mediaId: string) => {
    addInFlight(mediaId);
    try {
      await axios.delete(`${API}/events/${id}/media/${mediaId}`, { withCredentials: true });
      setEvent((prev) => prev ? { ...prev, media: prev.media.filter((m) => m._id !== mediaId) } : prev);
      showToast("Media removed.");
    } catch {
      showToast("Failed to remove media.", "error");
    } finally {
      removeInFlight(mediaId);
    }
  }, [id, addInFlight, removeInFlight, showToast]);

  const isWinnerNeeded = useMemo(() => {
    if (!event) return false;
    return WINNER_CATEGORIES.includes(event.category) || (event.winners && event.winners.length > 0);
  }, [event]);

  useEffect(() => {
    if (activeTab === "winners" && !isWinnerNeeded) {
      setActiveTab("overview");
    }
  }, [activeTab, isWinnerNeeded]);

  const TABS: { id: TabId; label: string; icon: React.ElementType }[] = useMemo(() => [
    { id: "overview", label: "Overview", icon: Tag },
    { id: "participants", label: "Participants", icon: Users },
    { id: "volunteers", label: "Organizers", icon: UserCheck },
    ...(isWinnerNeeded ? [{ id: "winners" as TabId, label: "Winners", icon: Trophy }] : []),
    { id: "sponsors", label: "Sponsors", icon: Building2 },
    { id: "media", label: "Media", icon: ImageIcon },
    { id: "certificates", label: "Certificates", icon: Award },
    { id: "mailing", label: "Email", icon: Mail },
  ], [isWinnerNeeded]);

  if (guardLoading || !isAllowed) return null;

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20" />)}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <AlertCircle size={40} className="mx-auto mb-3 text-red-400" />
        <p className="text-slate-500">Event not found.</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className={`${activeTab === "mailing" ? "max-w-7xl" : "max-w-5xl"} mx-auto px-4 sm:px-6 py-8 space-y-6 transition-all duration-300`}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-500"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white truncate">{event.title}</h1>
          <p className="text-xs text-slate-500 capitalize">{event.category} · {event.status}</p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
        <div className="flex min-w-max">
          {TABS.map(({ id: tabId, label, icon: Icon }) => (
            <TabBtn
              key={tabId}
              active={activeTab === tabId}
              onClick={() => setActiveTab(tabId)}
              badge={
                tabId === "participants"
                  ? (event.pendingCount || undefined)
                  : tabId === "volunteers"
                  ? (event.contributors?.length || undefined)
                  : undefined
              }
            >
              <Icon size={14} />
              {label}
            </TabBtn>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {activeTab === "overview" && <OverviewTab event={event} />}

      {activeTab === "participants" && (
        <ParticipantsTab
          event={event}
          onApproveClaim={handleApproveClaim}
          onRejectClaim={handleRejectClaim}
          onRemove={handleRemoveAttendee}
          onAdd={handleAddAttendee}
          onAddNonMember={handleAddNonMemberAttendee}
          inFlight={inFlight}
          onRefresh={fetchEvent}
          showToast={showToast}
          onEmailApplicant={handleEmailApplicant}
        />
      )}

      {activeTab === "volunteers" && (
        <VolunteersTab
          event={event}
          onRefresh={fetchEvent}
          showToast={showToast}
        />
      )}

      {activeTab === "winners" && (
        <WinnersTab
          event={event}
          onSave={handleSaveWinners}
          saving={winnerSaving}
        />
      )}

      {activeTab === "sponsors" && (
        <SponsorsTab
          event={event}
          onAdd={handleAddSponsor}
          onRemove={handleRemoveSponsor}
          inFlight={inFlight}
        />
      )}

      {activeTab === "media" && (
        <MediaTab
          event={event}
          onUpload={handleUploadMedia}
          onRemove={handleRemoveMedia}
          inFlight={inFlight}
        />
      )}

      {activeTab === "certificates" && (
        <CertificatesTab
          event={event}
          onRefresh={fetchEvent}
          showToast={showToast}
        />
      )}

      {activeTab === "mailing" && (
        <EventMailingTab
          event={event}
          showToast={showToast}
          initialAudience={mailingPrefill?.audience}
          initialCustomEmails={mailingPrefill?.customEmails}
          initialDeliveryMethod={mailingPrefill?.deliveryMethod}
        />
      )}

      {/* Toast */}
      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </div>
  );
}
