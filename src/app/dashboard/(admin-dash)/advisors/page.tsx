"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRoleGuard } from "@/hooks/useRoleGuard";
import UserAvatarWithFallback from "@/components/ui/shared/UserAvatarWithFallback";
import { DesignationManager } from "@/components/dashboard/legacy/DesignationManager";
import { AdminAddMemberModal } from "@/components/dashboard/legacy/AdminAddMemberModal";
import toast from "react-hot-toast";
import {
  UserCheck,
  ExternalLink,
  Search,
  Plus,
  RefreshCw,
  LayoutGrid,
  List,
  Mail,
  Phone,
  Building,
  Award,
  Users,
  ShieldCheck,
  ChevronRight,
  Loader2,
  X,
  Eye,
  Edit,
} from "lucide-react";
import { capitalizeFirstLetter } from "@/lib/utils";

type AdvisorTab = "directory" | "panel";

interface AdvisorItem {
  _id: string;
  fullName: string;
  email: string;
  imageUrl?: string;
  imagePosition?: string;
  role?: string;
  clubRole?: string;
  designation?: string;
  department?: string;
  session?: string;
  batch?: string;
  studentId?: string;
  contactNumber?: string;
  bio?: string;
  profileStatus?: string;
  socialLinks?: Record<string, string>;
}

export default function AdvisorManagementPage() {
  const { isAllowed, isLoading } = useRoleGuard(["admin", "moderator", "executive", "advisor"]);
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [activeTab, setActiveTab] = useState<AdvisorTab>("directory");
  const [advisors, setAdvisors] = useState<AdvisorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Fetch all advisors from backend
  const fetchAdvisors = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/dashboard/members`, {
        params: {
          filter: "advisor",
          limit: 100,
        },
        withCredentials: true,
      });

      if (res.data?.data?.members) {
        setAdvisors(res.data.data.members);
      }
    } catch (err: any) {
      console.error("Error fetching advisors:", err);
      toast.error("Failed to load advisors list.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAllowed) {
      fetchAdvisors();
    }
  }, [isAllowed, fetchAdvisors]);

  // Filter advisors by search query
  const filteredAdvisors = advisors.filter((adv) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      (adv.fullName || "").toLowerCase().includes(q) ||
      (adv.email || "").toLowerCase().includes(q) ||
      (adv.designation || "").toLowerCase().includes(q) ||
      (adv.department || "").toLowerCase().includes(q)
    );
  });

  if (isLoading || !isAllowed) return null;

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border-default pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-950 dark:bg-indigo-950/60 dark:text-indigo-300 font-mono text-[11px] font-bold tracking-wider uppercase mb-1.5 border border-indigo-300 dark:border-indigo-700/60">
            <UserCheck size={13} />
            Academic Advisory &amp; Mentorship
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
            Advisor Directory &amp; Management
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5 max-w-2xl">
            Manage honorable faculty advisors, academic mentors, panel designations, and directory listings.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/advisors"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-surface-secondary hover:bg-surface-elevated text-text-primary border border-border-default rounded-lg text-xs sm:text-sm font-semibold transition shadow-[2px_2px_0px_0px_var(--border-default)] hover:shadow-md cursor-pointer whitespace-nowrap"
          >
            <span>View Public Page</span>
            <ExternalLink size={14} className="text-accent-primary" />
          </Link>

          {isAdmin && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-text-primary hover:bg-surface-inverse text-white rounded-lg text-xs sm:text-sm font-bold transition shadow-[3px_3px_0px_0px_var(--border-default)] hover:shadow-md whitespace-nowrap cursor-pointer"
              style={{ color: "#fff" }}
            >
              <Plus size={16} />
              <span>Add Advisor</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Neo-Brutalist Tabs ── */}
      <div className="flex items-center gap-2 border-b border-border-default overflow-x-auto no-scrollbar pb-px">
        <button
          type="button"
          onClick={() => setActiveTab("directory")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-all cursor-pointer whitespace-nowrap border-t-2 border-x-2 ${
            activeTab === "directory"
              ? "bg-surface-elevated text-text-primary border-border-brutalist dark:border-border-default shadow-[3px_-2px_0px_0px_var(--border-brutalist)] -mb-px"
              : "border-transparent text-text-secondary hover:text-text-primary hover:bg-surface-secondary/60"
          }`}
        >
          <Users size={16} className={activeTab === "directory" ? "text-accent-primary" : ""} />
          <span>Advisors Directory ({advisors.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("panel")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-all cursor-pointer whitespace-nowrap border-t-2 border-x-2 ${
            activeTab === "panel"
              ? "bg-surface-elevated text-text-primary border-border-brutalist dark:border-border-default shadow-[3px_-2px_0px_0px_var(--border-brutalist)] -mb-px"
              : "border-transparent text-text-secondary hover:text-text-primary hover:bg-surface-secondary/60"
          }`}
        >
          <Award size={16} className={activeTab === "panel" ? "text-accent-primary" : ""} />
          <span>Advisor Panel &amp; Designations</span>
        </button>
      </div>

      {/* ── Tab Content: Advisors Directory ── */}
      {activeTab === "directory" && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-secondary p-3 rounded-xl border border-border-default">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search advisors by name, title, department…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm font-semibold rounded-lg border border-border-default bg-surface-elevated text-text-primary placeholder:font-normal placeholder:text-text-secondary focus:outline-none focus:border-accent-primary focus:shadow-[2px_2px_0px_0px_var(--accent-primary)] transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary p-0.5 rounded cursor-pointer"
                >
                  <X size={13} />
                </button>
              )}
            </div>

            {/* View Mode Toggle & Refresh */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={fetchAdvisors}
                disabled={loading}
                className="p-2 bg-surface-elevated border border-border-default hover:border-accent-primary rounded-lg text-text-secondary hover:text-text-primary transition shadow-xs cursor-pointer disabled:opacity-50"
                title="Refresh advisors"
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              </button>

              <div className="flex items-center border border-border-default rounded-lg overflow-hidden bg-surface-elevated">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-2 transition cursor-pointer ${
                    viewMode === "grid"
                      ? "bg-accent-primary text-accent-primary-text font-bold"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  className={`p-2 transition cursor-pointer ${
                    viewMode === "table"
                      ? "bg-accent-primary text-accent-primary-text font-bold"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                  title="Table View"
                >
                  <List size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Directory Content */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-surface-elevated rounded-xl border border-border-default shadow-[4px_4px_0px_0px_var(--border-default)]">
              <Loader2 size={32} className="animate-spin text-accent-primary mb-3" />
              <p className="text-xs font-semibold text-text-secondary">Loading advisors directory…</p>
            </div>
          ) : filteredAdvisors.length === 0 ? (
            <div className="text-center py-16 bg-surface-elevated rounded-xl border border-dashed border-border-default shadow-[4px_4px_0px_0px_var(--border-default)]">
              <UserCheck size={36} className="mx-auto mb-3 text-text-secondary" />
              <p className="font-semibold text-text-primary text-base">No advisors found</p>
              <p className="text-xs text-text-secondary mt-1">
                {searchQuery
                  ? `No advisors match "${searchQuery}".`
                  : "No advisor profiles registered yet."}
              </p>
            </div>
          ) : viewMode === "grid" ? (
            /* ── Grid View ── */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAdvisors.map((adv) => (
                <div
                  key={adv._id}
                  className="bg-surface-elevated border-2 border-border-default rounded-xl p-5 shadow-[4px_4px_0px_0px_var(--border-default)] hover:shadow-[4px_4px_0px_0px_var(--accent-primary)] hover:border-accent-primary transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Avatar + Name + Title */}
                    <div className="flex items-start gap-3.5 mb-3">
                      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-accent-primary flex-shrink-0 bg-surface-secondary">
                        <UserAvatarWithFallback
                          initialImageUrl={adv.imageUrl}
                          fullName={adv.fullName}
                          imagePosition={adv.imagePosition}
                          w={56}
                          h={56}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold text-text-primary truncate" title={adv.fullName}>
                          {adv.fullName}
                        </h3>
                        <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[11px] font-bold bg-accent-primary/10 text-accent-primary border border-accent-primary/20">
                          {adv.designation || "Faculty Advisor"}
                        </span>
                        {adv.department && (
                          <p className="text-xs text-text-secondary mt-1 flex items-center gap-1">
                            <Building size={12} className="text-text-tertiary flex-shrink-0" />
                            <span className="truncate">{adv.department}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Contact & Meta */}
                    <div className="space-y-1.5 pt-2 border-t border-border-default text-xs text-text-secondary">
                      {adv.email && (
                        <p className="flex items-center gap-1.5 truncate">
                          <Mail size={12} className="text-text-tertiary flex-shrink-0" />
                          <span className="truncate font-mono text-[11px]">{adv.email}</span>
                        </p>
                      )}
                      {adv.contactNumber && (
                        <p className="flex items-center gap-1.5 truncate">
                          <Phone size={12} className="text-text-tertiary flex-shrink-0" />
                          <span className="truncate font-mono text-[11px]">{adv.contactNumber}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="mt-4 pt-3 border-t border-border-default flex items-center justify-between gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        adv.profileStatus === "active"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                      }`}
                    >
                      {adv.profileStatus || "Active"}
                    </span>

                    <Link
                      href={`/dashboard/members/${adv._id}`}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-surface-secondary hover:bg-surface-elevated border border-border-default hover:border-accent-primary rounded-lg text-xs font-bold text-text-primary transition shadow-xs cursor-pointer"
                    >
                      <Eye size={12} />
                      <span>Details</span>
                      <ChevronRight size={12} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* ── Table View ── */
            <div className="overflow-x-auto bg-surface-elevated rounded-xl shadow-[4px_4px_0px_0px_var(--border-default)] border border-border-default">
              <table className="min-w-full divide-y divide-border-default">
                <thead className="bg-surface-secondary">
                  <tr>
                    {["Advisor", "Title / Role", "Department", "Email & Contact", "Status", "Actions"].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-default">
                  {filteredAdvisors.map((adv) => (
                    <tr key={adv._id} className="hover:bg-surface-secondary/40 transition">
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden border border-border-default flex-shrink-0">
                            <UserAvatarWithFallback
                              initialImageUrl={adv.imageUrl}
                              fullName={adv.fullName}
                              imagePosition={adv.imagePosition}
                              w={40}
                              h={40}
                            />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-text-primary">{adv.fullName}</p>
                            <span className="text-[10px] text-text-secondary uppercase">
                              {adv.clubRole || "Advisor"}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-accent-primary/10 text-accent-primary border border-accent-primary/20">
                          {adv.designation || "Faculty Advisor"}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 whitespace-nowrap text-xs text-text-secondary">
                        {adv.department || "Faculty"}
                      </td>

                      <td className="px-5 py-3.5 whitespace-nowrap text-xs text-text-secondary">
                        <p className="font-mono text-[11px]">{adv.email}</p>
                        {adv.contactNumber && (
                          <p className="font-mono text-[10px] text-text-tertiary">{adv.contactNumber}</p>
                        )}
                      </td>

                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            adv.profileStatus === "active"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
                          }`}
                        >
                          {adv.profileStatus || "Active"}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <Link
                          href={`/dashboard/members/${adv._id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-surface-secondary hover:bg-surface-elevated border border-border-default rounded text-xs font-semibold text-text-primary transition"
                        >
                          <Eye size={12} />
                          <span>View Profile</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Tab Content: Advisor Panel & Designations ── */}
      {activeTab === "panel" && (
        <div className="space-y-4">
          <DesignationManager
            category="advisor"
            isAdminUser={isAdmin}
            onRefreshAllData={fetchAdvisors}
          />
        </div>
      )}

      {/* ── Add Advisor Modal ── */}
      <AdminAddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchAdvisors}
      />
    </div>
  );
}
