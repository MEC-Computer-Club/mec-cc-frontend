"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Building2,
  GraduationCap,
  BookOpen,
  Award,
  BarChart3,
  Search,
  RotateCcw,
  Clock,
  Sparkles,
  ArrowUpRight,
  Layers,
  Calendar,
  User,
  Activity,
  FileText,
  Filter,
} from "lucide-react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { useRoleGuard } from "@/hooks/useRoleGuard";
import FilterSelect, { FilterOption } from "@/app/dashboard/components/FilterSelect";

interface InstituteDepartmentUsage {
  department: string;
  coverPagePrints: number;
  cgpaCalculations: number;
  total: number;
  lastUsedAt?: string;
}

interface InstituteAnalyticsItem {
  _id?: string;
  name: string;
  usageCount: {
    cgpaCalculations: number;
    coverPagePrints: number;
    total: number;
  };
  departments?: InstituteDepartmentUsage[];
  lastUsedAt: string;
}

interface RecentToolUsageItem {
  _id: string;
  tool: string;
  action: string;
  instituteName: string;
  department?: string;
  session?: string;
  semester?: number;
  userId?: {
    _id: string;
    fullName?: string;
    studentId?: string;
  } | null;
  createdAt: string;
}

interface AnalyticsOverviewResponse {
  summary: {
    totalEvents: number;
    totalPrints: number;
    totalCalculations: number;
  };
  topInstitutes: InstituteAnalyticsItem[];
  recentActivity?: RecentToolUsageItem[];
}

const SORT_OPTIONS: FilterOption[] = [
  { value: "most-total", label: "Most Total Uses" },
  { value: "most-calcs", label: "Most CGPA Calculations" },
  { value: "most-prints", label: "Most Cover Page Prints" },
  { value: "recent", label: "Recently Active" },
  { value: "alphabetical", label: "Alphabetical (A-Z)" },
];

export default function InstituteAnalyticsPage() {
  const { isAllowed, isLoading: guardLoading } = useRoleGuard(["admin", "moderator", "executive"]);

  const [overview, setOverview] = useState<AnalyticsOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("most-total");
  const [activeTab, setActiveTab] = useState<"leaderboard" | "departments" | "realtime">("leaderboard");

  const fetchAnalytics = useCallback(async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      else setRefreshing(true);

      const res = await api.get("/api/analytics/overview");
      if (res.status === "success" && res.data) {
        setOverview(res.data);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load institute analytics");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics(false);
  }, [fetchAnalytics]);

  // Total active institutes count
  const totalInstitutesCount = useMemo(() => {
    return overview?.topInstitutes?.length || 0;
  }, [overview]);

  // Filtered & sorted institutes
  const processedInstitutes = useMemo(() => {
    if (!overview?.topInstitutes) return [];

    let list = [...overview.topInstitutes];

    // Search filter
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      list = list.filter((inst) => {
        const matchesName = inst.name.toLowerCase().includes(q);
        const matchesDept = inst.departments?.some((d) => d.department.toLowerCase().includes(q));
        return matchesName || matchesDept;
      });
    }

    // Sort
    list.sort((a, b) => {
      switch (sortBy) {
        case "most-total":
          return (b.usageCount.total || 0) - (a.usageCount.total || 0);
        case "most-calcs":
          return (b.usageCount.cgpaCalculations || 0) - (a.usageCount.cgpaCalculations || 0);
        case "most-prints":
          return (b.usageCount.coverPagePrints || 0) - (a.usageCount.coverPagePrints || 0);
        case "recent":
          return new Date(b.lastUsedAt || 0).getTime() - new Date(a.lastUsedAt || 0).getTime();
        case "alphabetical":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return list;
  }, [overview, searchQuery, sortBy]);

  // Aggregated department list across all institutes
  const departmentStats = useMemo(() => {
    if (!overview?.topInstitutes) return [];

    const map = new Map<
      string,
      {
        department: string;
        coverPagePrints: number;
        cgpaCalculations: number;
        total: number;
        institutesCount: number;
      }
    >();

    overview.topInstitutes.forEach((inst) => {
      if (inst.departments) {
        inst.departments.forEach((dept) => {
          const deptKey = dept.department || "General";
          if (!map.has(deptKey)) {
            map.set(deptKey, {
              department: deptKey,
              coverPagePrints: 0,
              cgpaCalculations: 0,
              total: 0,
              institutesCount: 0,
            });
          }
          const item = map.get(deptKey)!;
          item.coverPagePrints += dept.coverPagePrints || 0;
          item.cgpaCalculations += dept.cgpaCalculations || 0;
          item.total += dept.total || 0;
          item.institutesCount += 1;
        });
      }
    });

    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, [overview]);

  if (guardLoading) {
    return (
      <div className="p-8 text-center text-text-tertiary font-mono">
        Verifying permissions...
      </div>
    );
  }

  if (!isAllowed) {
    return null;
  }

  return (
    <div className="space-y-6 pb-12">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border-default pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-accent-primary-light text-text-primary font-mono font-bold text-[11px] mb-2 border border-border-default">
            <Building2 size={13} className="text-accent-primary" />
            <span>INSIGHTS & ACADEMIC TOOLS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
            Institute Analytics
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary font-mono mt-1">
            Real-time usage breakdown of academic tools (Cover Page Generator & CGPA Calculator) across universities & colleges
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => fetchAnalytics(true)}
            disabled={refreshing || loading}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-border-default bg-surface-elevated text-xs font-bold text-text-secondary hover:text-text-primary transition shadow-[2px_2px_0px_0px_var(--border-default)] hover:shadow-[3px_3px_0px_0px_var(--accent-primary)] hover:border-accent-primary cursor-pointer active:translate-x-[1px] active:translate-y-[1px]"
          >
            <RotateCcw
              size={13}
              className={`${refreshing ? "animate-spin text-accent-primary" : ""}`}
            />
            <span>{refreshing ? "Refreshing..." : "Refresh Data"}</span>
          </button>
        </div>
      </div>

      {/* ── KPI Summary Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-surface-elevated border border-border-default rounded-xl p-4 shadow-[3px_3px_0px_var(--border-default)]">
          <div className="text-[11px] font-mono font-bold text-text-secondary uppercase">
            Cover Page Prints
          </div>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-text-primary">
              {overview?.summary?.totalPrints || 0}
            </span>
            <BookOpen size={20} className="text-accent-primary opacity-80" />
          </div>
          <p className="text-[10px] text-text-tertiary font-mono mt-1">Exported PDFs & print operations</p>
        </div>

        <div className="bg-surface-elevated border border-border-default rounded-xl p-4 shadow-[3px_3px_0px_var(--border-default)]">
          <div className="text-[11px] font-mono font-bold text-text-secondary uppercase">
            CGPA Calculations
          </div>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-emerald-500">
              {overview?.summary?.totalCalculations || 0}
            </span>
            <Award size={20} className="text-emerald-500 opacity-80" />
          </div>
          <p className="text-[10px] text-text-tertiary font-mono mt-1">GPA & semester computations</p>
        </div>

        <div className="bg-surface-elevated border border-border-default rounded-xl p-4 shadow-[3px_3px_0px_var(--border-default)]">
          <div className="text-[11px] font-mono font-bold text-text-secondary uppercase">
            Total Tool Events
          </div>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-text-primary">
              {overview?.summary?.totalEvents || 0}
            </span>
            <BarChart3 size={20} className="text-sky-500 opacity-80" />
          </div>
          <p className="text-[10px] text-text-tertiary font-mono mt-1">Combined aggregate activity</p>
        </div>

        <div className="bg-surface-elevated border border-border-default rounded-xl p-4 shadow-[3px_3px_0px_var(--border-default)]">
          <div className="text-[11px] font-mono font-bold text-text-secondary uppercase">
            Active Institutions
          </div>
          <div className="mt-1.5 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-text-primary">
              {totalInstitutesCount}
            </span>
            <Building2 size={20} className="text-pink-500 opacity-80" />
          </div>
          <p className="text-[10px] text-text-tertiary font-mono mt-1">Institutions with logged usage</p>
        </div>
      </div>

      {/* ── View Switcher & Controls ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* View Tabs */}
        <div className="inline-flex p-1 rounded-xl bg-surface-secondary border border-border-default shadow-[2px_2px_0px_0px_var(--border-default)]">
          <button
            type="button"
            onClick={() => setActiveTab("leaderboard")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "leaderboard"
                ? "bg-accent-primary text-text-inverse shadow-[2px_2px_0px_0px_var(--border-default)]"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Institutes Leaderboard
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("departments")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "departments"
                ? "bg-accent-primary text-text-inverse shadow-[2px_2px_0px_0px_var(--border-default)]"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Departments Summary
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("realtime")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "realtime"
                ? "bg-accent-primary text-text-inverse shadow-[2px_2px_0px_0px_var(--border-default)]"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Live Activity Feed
          </button>
        </div>

        {/* Search & Sort (Neo-Brutalist FilterSelect) */}
        {activeTab !== "realtime" && (
          <div className="flex items-center gap-2.5 flex-1 max-w-md justify-end">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input
                type="text"
                placeholder="Search institute or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-surface-primary border border-border-default text-text-primary text-xs placeholder:text-text-tertiary focus:outline-none focus:border-accent-primary focus:shadow-[2px_2px_0px_var(--accent-primary)] font-mono"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {activeTab === "leaderboard" && (
              <FilterSelect
                value={sortBy}
                onChange={setSortBy}
                options={SORT_OPTIONS}
                placeholder="Sort by"
              />
            )}
          </div>
        )}
      </div>

      {/* ── TAB 1: INSTITUTES LEADERBOARD ── */}
      {activeTab === "leaderboard" && (
        <div className="border border-border-default rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_var(--border-default)] bg-surface-primary">
          <div className="p-3.5 bg-surface-secondary border-b border-border-default flex items-center justify-between">
            <h3 className="font-mono font-bold text-xs uppercase text-text-primary flex items-center gap-2">
              <Building2 size={15} className="text-accent-primary" /> Active Institutes & Departments
            </h3>
            <span className="text-[11px] font-mono text-text-tertiary">
              Showing {processedInstitutes.length} of {totalInstitutesCount} institutions
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border-default bg-surface-secondary/60 text-text-secondary font-mono uppercase text-[10px]">
                  <th className="p-3.5 w-12 text-center">#</th>
                  <th className="p-3.5">Institute Name & Logged Departments</th>
                  <th className="p-3.5 text-center w-36">Cover Page Prints</th>
                  <th className="p-3.5 text-center w-36">CGPA Calculations</th>
                  <th className="p-3.5 text-center w-28">Total Uses</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default font-mono">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-text-tertiary">
                      <div className="inline-block animate-spin mr-2">⟳</div>
                      Loading institute analytics...
                    </td>
                  </tr>
                ) : processedInstitutes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-text-tertiary">
                      <FileText size={36} className="mx-auto mb-2 opacity-40" />
                      <p className="font-semibold text-text-secondary">No institute records found</p>
                      <p className="text-xs mt-1">
                        {searchQuery ? "Try refining your search keyword" : "Usage will appear here as students use the tools"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  processedInstitutes.map((inst, idx) => (
                    <tr key={inst._id || inst.name} className="hover:bg-surface-secondary/40 transition-colors">
                      <td className="p-3.5 font-bold text-text-tertiary text-center align-top">
                        {idx + 1}
                      </td>
                      <td className="p-3.5 font-bold text-text-primary align-top">
                        <div className="flex items-center gap-2 text-sm">
                          <Building2 size={16} className="text-accent-primary shrink-0" />
                          <span>{inst.name}</span>
                          {idx === 0 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 font-extrabold uppercase">
                              TOP 1
                            </span>
                          )}
                        </div>

                        {/* Department Pills */}
                        {inst.departments && inst.departments.length > 0 && (
                          <div className="mt-2.5 pt-2 border-t border-border-default/60 space-y-1.5">
                            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-tertiary flex items-center gap-1">
                              <GraduationCap size={12} className="text-accent-primary" />
                              Departments with Logged Usage:
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {inst.departments.map((dept, dIdx) => (
                                <div
                                  key={dIdx}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-secondary border border-border-default text-xs font-mono shadow-xs"
                                  title={`Total: ${dept.total} | Calculations: ${dept.cgpaCalculations} | Prints: ${dept.coverPagePrints}`}
                                >
                                  <span className="font-bold text-text-primary">{dept.department}</span>
                                  <span className="px-1.5 py-0.2 rounded bg-accent-primary-light text-text-primary font-bold text-[10px]">
                                    {dept.total} uses
                                  </span>
                                  <span className="text-[10px] text-text-tertiary">
                                    ({dept.cgpaCalculations} calcs, {dept.coverPagePrints} prints)
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="p-3.5 text-center font-bold text-accent-primary align-top text-sm">
                        {inst.usageCount.coverPagePrints || 0}
                      </td>
                      <td className="p-3.5 text-center font-bold text-emerald-500 align-top text-sm">
                        {inst.usageCount.cgpaCalculations || 0}
                      </td>
                      <td className="p-3.5 text-center font-black text-text-primary text-base align-top">
                        {inst.usageCount.total || 0}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 2: DEPARTMENTS SUMMARY ── */}
      {activeTab === "departments" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departmentStats.length === 0 ? (
              <div className="col-span-full p-12 text-center text-text-tertiary bg-surface-elevated border border-border-default rounded-xl">
                No department statistics available
              </div>
            ) : (
              departmentStats.map((dept) => (
                <div
                  key={dept.department}
                  className="bg-surface-elevated border border-border-default rounded-xl p-4 shadow-[3px_3px_0px_var(--border-default)] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded font-black text-xs font-mono bg-accent-primary text-text-inverse">
                      {dept.department}
                    </span>
                    <span className="text-xs font-mono font-bold text-text-tertiary">
                      {dept.institutesCount} {dept.institutesCount === 1 ? "Institute" : "Institutes"}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-border-default flex items-baseline justify-between">
                    <span className="text-xs font-mono text-text-secondary">Total Uses:</span>
                    <span className="text-xl font-black text-text-primary">{dept.total}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                    <div className="p-2 rounded bg-surface-secondary border border-border-default">
                      <div className="text-[10px] text-text-tertiary uppercase">Prints</div>
                      <div className="font-bold text-accent-primary">{dept.coverPagePrints}</div>
                    </div>
                    <div className="p-2 rounded bg-surface-secondary border border-border-default">
                      <div className="text-[10px] text-text-tertiary uppercase">CGPA Calcs</div>
                      <div className="font-bold text-emerald-500">{dept.cgpaCalculations}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── TAB 3: REAL-TIME ACTIVITY STREAM ── */}
      {activeTab === "realtime" && (
        <div className="bg-surface-elevated border border-border-default rounded-xl p-4 shadow-[3px_3px_0px_var(--border-default)] space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-border-default">
            <h3 className="font-mono font-bold text-xs uppercase text-text-primary flex items-center gap-2">
              <Activity size={15} className="text-accent-primary" /> Live Utility Ingest Activity
            </h3>
            <span className="text-[10px] font-mono text-text-tertiary">Latest 15 recorded operations</span>
          </div>

          {!overview?.recentActivity || overview.recentActivity.length === 0 ? (
            <div className="p-8 text-center text-text-tertiary font-mono text-xs">
              No recent tool executions logged yet.
            </div>
          ) : (
            <div className="divide-y divide-border-default">
              {overview.recentActivity.map((act) => (
                <div key={act._id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="font-bold text-text-primary flex items-center gap-1.5">
                        <Building2 size={13} className="text-accent-primary" />
                        {act.instituteName}
                      </span>
                      {act.department && (
                        <span className="px-1.5 py-0.2 rounded bg-surface-secondary border border-border-default text-[10px] font-bold">
                          {act.department}
                        </span>
                      )}
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-extrabold uppercase ${
                          act.tool === "cover_page"
                            ? "bg-accent-primary-light text-text-primary"
                            : "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                        }`}
                      >
                        {act.tool.replace("_", " ")}
                      </span>
                    </div>

                    <div className="text-[11px] text-text-secondary font-mono flex items-center gap-2">
                      <span>Action: <strong>{act.action}</strong></span>
                      {act.userId?.fullName && (
                        <span>• By: {act.userId.fullName} ({act.userId.studentId || "Student"})</span>
                      )}
                    </div>
                  </div>

                  <div className="text-[10px] font-mono text-text-tertiary flex items-center gap-1 shrink-0">
                    <Clock size={11} />
                    <span>{new Date(act.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
