"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import {
  BarChart3,
  Users,
  Calendar,
  Award,
  FolderGit2,
  Sparkles,
  RotateCcw,
  GraduationCap,
  Activity,
  CheckCircle2,
  Clock,
  Code2,
  Layers,
  TrendingUp,
  PieChart as PieIcon,
  ShieldCheck,
  Building2,
  Wifi,
  WifiOff,
} from "lucide-react";
import Link from "next/link";

interface VisualOverviewData {
  summary: {
    totalMembers: number;
    onlineMembers: number;
    offlineMembers: number;
    activeTodayMembers: number;
    totalEvents: number;
    upcomingEvents: number;
    totalCertificates: number;
    totalProjects: number;
  };
  departments: Array<{ name: string; count: number }>;
  sessions: Array<{ session: string; count: number }>;
  roles: Array<{ role: string; label: string; count: number }>;
  applicationStatus: Array<{ status: string; count: number }>;
  events: {
    total: number;
    upcoming: number;
    recent: Array<{
      _id: string;
      title: string;
      date: string;
      category?: string;
      approvedCount: number;
      pendingCount: number;
      winnersCount: number;
    }>;
  };
  certificates: {
    total: number;
    byType: Array<{ type: string; count: number }>;
  };
  projects: {
    total: number;
    byStatus: Array<{ status: string; count: number }>;
    topTechStack: Array<{ tech: string; count: number }>;
  };
}

export default function VisualOverviewPage() {
  const [data, setData] = useState<VisualOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { user } = useAuth();

  const fetchVisualData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);

    try {
      const res = await axios.get(`${API_BASE_URL}/api/dashboard/visual-overview`, {
        withCredentials: true,
      });
      if (res.data?.success && res.data?.data) {
        setData(res.data.data);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error("Failed to load visual overview analytics:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchVisualData(false);

    // Auto-refresh stats every 45s if user stays on page
    const interval = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        fetchVisualData(true);
      }
    }, 45000);

    return () => clearInterval(interval);
  }, [fetchVisualData]);

  // Calculations for proportions
  const deptTotal = useMemo(() => {
    return (data?.departments || []).reduce((acc, d) => acc + d.count, 0) || 1;
  }, [data]);

  const maxSessionCount = useMemo(() => {
    return Math.max(...(data?.sessions || []).map((s) => s.count), 1);
  }, [data]);

  const rolesTotal = useMemo(() => {
    return (data?.roles || []).reduce((acc, r) => acc + r.count, 0) || 1;
  }, [data]);

  const projectStatusTotal = useMemo(() => {
    return (data?.projects.byStatus || []).reduce((acc, p) => acc + p.count, 0) || 1;
  }, [data]);

  const certTypeTotal = useMemo(() => {
    return (data?.certificates.byType || []).reduce((acc, c) => acc + c.count, 0) || 1;
  }, [data]);

  const onlineRatio = useMemo(() => {
    if (!data?.summary.totalMembers) return 0;
    return Math.round((data.summary.onlineMembers / data.summary.totalMembers) * 100);
  }, [data]);

  // Color schemes for charts
  const DEPT_COLORS: Record<string, { bg: string; text: string; fill: string }> = {
    CSE: { bg: "bg-emerald-500", text: "text-emerald-500", fill: "#10b981" },
    EEE: { bg: "bg-sky-500", text: "text-sky-500", fill: "#0ea5e9" },
    CE: { bg: "bg-amber-500", text: "text-amber-500", fill: "#f59e0b" },
    OTHER: { bg: "bg-purple-500", text: "text-purple-500", fill: "#8b5cf6" },
  };

  const ROLE_COLORS: Record<string, string> = {
    member: "#10b981", // emerald
    executive: "#8b5cf6", // purple
    alumni: "#f59e0b", // amber
    advisor: "#06b6d4", // cyan
  };

  const STATUS_COLORS: Record<string, string> = {
    completed: "bg-emerald-500 text-white",
    in_progress: "bg-sky-500 text-white",
    planning: "bg-amber-500 text-black",
    on_hold: "bg-orange-500 text-white",
    archived: "bg-neutral-500 text-white",
  };

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-default pb-5">
          <div className="space-y-2">
            <div className="h-4 w-32 bg-surface-secondary border border-border-default rounded-md animate-pulse" />
            <div className="h-8 w-64 bg-surface-secondary border border-border-default rounded-lg animate-pulse" />
          </div>
          <div className="h-10 w-28 bg-surface-secondary border border-border-default rounded-xl animate-pulse" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-surface-secondary border border-border-default rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-72 bg-surface-secondary border border-border-default rounded-2xl animate-pulse" />
          <div className="h-72 bg-surface-secondary border border-border-default rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 select-none">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-default pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 dark:bg-emerald-950/70 dark:text-emerald-300 font-mono text-[11px] font-bold tracking-wider uppercase mb-1.5 border border-emerald-300 dark:border-emerald-700/60">
            <BarChart3 size={13} /> Visual Intelligence
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
            Visual Overview
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Real-time data visualization across demographics, live presence, projects, and activities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="hidden sm:inline-block text-[11px] font-mono text-text-tertiary">
              Updated {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
          )}
          <button
            type="button"
            onClick={() => fetchVisualData(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-surface-elevated hover:bg-surface-secondary text-text-primary border-2 border-border-brutalist dark:border-border-default rounded-xl shadow-[3px_3px_0px_0px_var(--border-brutalist)] active:translate-x-0.5 active:translate-y-0.5 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
            title="Refresh analytics data"
          >
            <RotateCcw size={14} className={refreshing ? "animate-spin" : ""} />
            <span>{refreshing ? "Refreshing..." : "Refresh Stats"}</span>
          </button>
        </div>
      </div>

      {/* ── Vital KPI Metric Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Members */}
        <div className="bg-surface-elevated rounded-2xl border-2 border-border-brutalist dark:border-border-default p-4 sm:p-5 shadow-[4px_4px_0px_0px_var(--border-brutalist)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              Total Community
            </span>
            <span className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
              <Users size={17} />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-text-primary">
              {data?.summary.totalMembers ?? 0}
            </span>
            <div className="mt-2 flex items-center gap-2 text-[11px] font-medium text-text-secondary">
              <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {data?.summary.onlineMembers ?? 0} Online
              </span>
              <span>•</span>
              <span>{data?.summary.offlineMembers ?? 0} Offline</span>
            </div>
          </div>
        </div>

        {/* Total Events */}
        <div className="bg-surface-elevated rounded-2xl border-2 border-border-brutalist dark:border-border-default p-4 sm:p-5 shadow-[4px_4px_0px_0px_var(--border-brutalist)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              Club Events
            </span>
            <span className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 flex items-center justify-center">
              <Calendar size={17} />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-text-primary">
              {data?.summary.totalEvents ?? 0}
            </span>
            <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-text-secondary">
              <span className="font-bold text-rose-600 dark:text-rose-400">
                {data?.summary.upcomingEvents ?? 0} Upcoming
              </span>
              <span>competitions &amp; sessions</span>
            </div>
          </div>
        </div>

        {/* Total Certificates */}
        <div className="bg-surface-elevated rounded-2xl border-2 border-border-brutalist dark:border-border-default p-4 sm:p-5 shadow-[4px_4px_0px_0px_var(--border-brutalist)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              Certificates Issued
            </span>
            <span className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center">
              <Award size={17} />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-text-primary">
              {data?.summary.totalCertificates ?? 0}
            </span>
            <div className="mt-2 text-[11px] font-medium text-text-secondary">
              Verified digital credentials awarded
            </div>
          </div>
        </div>

        {/* Total Projects */}
        <div className="bg-surface-elevated rounded-2xl border-2 border-border-brutalist dark:border-border-default p-4 sm:p-5 shadow-[4px_4px_0px_0px_var(--border-brutalist)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              Project Builds
            </span>
            <span className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center">
              <FolderGit2 size={17} />
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-text-primary">
              {data?.summary.totalProjects ?? 0}
            </span>
            <div className="mt-2 text-[11px] font-medium text-text-secondary">
              Active engineering repositories
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 1: Member Demographics & Academic Distribution ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Proportional Distribution */}
        <div className="bg-surface-elevated rounded-2xl border-2 border-border-brutalist dark:border-border-default p-5 sm:p-6 shadow-[4px_4px_0px_0px_var(--border-brutalist)] space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border-default">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600">
                <Building2 size={17} />
              </span>
              <div>
                <h2 className="text-base font-bold text-text-primary">Department Distribution</h2>
                <p className="text-[11px] text-text-secondary">MEC Engineering Department share</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-text-secondary">
              {data?.summary.totalMembers} Total
            </span>
          </div>

          {/* Segmented Proportional Progress Bar */}
          <div className="h-6 w-full rounded-xl overflow-hidden flex border border-border-default bg-surface-secondary shadow-inner">
            {(data?.departments || []).map((dept) => {
              const pct = Math.max(2, Math.round((dept.count / deptTotal) * 100));
              const color = DEPT_COLORS[dept.name.toUpperCase()] || DEPT_COLORS.OTHER;
              return (
                <div
                  key={dept.name}
                  style={{ width: `${pct}%` }}
                  className={`${color.bg} transition-all duration-500 relative group flex items-center justify-center`}
                  title={`${dept.name}: ${dept.count} members (${pct}%)`}
                >
                  {pct >= 12 && (
                    <span className="text-[10px] font-bold text-white tracking-wider font-mono">
                      {dept.name} {pct}%
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Department Breakdown Cards */}
          <div className="grid grid-cols-3 gap-3">
            {(data?.departments || []).map((dept) => {
              const pct = Math.round((dept.count / deptTotal) * 100);
              const color = DEPT_COLORS[dept.name.toUpperCase()] || DEPT_COLORS.OTHER;
              return (
                <div
                  key={dept.name}
                  className="p-3 rounded-xl bg-surface-secondary border border-border-default flex flex-col justify-between"
                >
                  <span className={`text-xs font-bold uppercase tracking-wider ${color.text}`}>
                    {dept.name}
                  </span>
                  <div className="mt-1 flex items-baseline justify-between">
                    <span className="text-xl font-black text-text-primary">{dept.count}</span>
                    <span className="text-xs font-mono font-bold text-text-tertiary">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Academic Session / Batch Cohort Bar Chart */}
        <div className="bg-surface-elevated rounded-2xl border-2 border-border-brutalist dark:border-border-default p-5 sm:p-6 shadow-[4px_4px_0px_0px_var(--border-brutalist)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border-default">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-sky-100 dark:bg-sky-950/50 text-sky-600">
                <GraduationCap size={17} />
              </span>
              <div>
                <h2 className="text-base font-bold text-text-primary">Academic Cohorts</h2>
                <p className="text-[11px] text-text-secondary">Distribution by academic admission session</p>
              </div>
            </div>
            <span className="text-xs font-bold text-text-secondary">Headcount</span>
          </div>

          <div className="space-y-3 pt-1">
            {(data?.sessions || []).slice(0, 5).map((s) => {
              const widthPct = Math.max(8, Math.round((s.count / maxSessionCount) * 100));
              return (
                <div key={s.session} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="font-mono text-text-primary">Session {s.session}</span>
                    <span className="font-mono text-text-secondary">{s.count} members</span>
                  </div>
                  <div className="w-full h-3 rounded-lg bg-surface-secondary border border-border-default overflow-hidden">
                    <div
                      style={{ width: `${widthPct}%` }}
                      className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 rounded-lg transition-all duration-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── SECTION 2: Live Presence, Status & Roles ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Presence Visual Gauge */}
        <div className="bg-surface-elevated rounded-2xl border-2 border-border-brutalist dark:border-border-default p-5 sm:p-6 shadow-[4px_4px_0px_0px_var(--border-brutalist)] flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border-default">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600">
                <Activity size={17} />
              </span>
              <div>
                <h2 className="text-base font-bold text-text-primary">Live Presence</h2>
                <p className="text-[11px] text-text-secondary">Real-time member activity</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>

          {/* Circular Visual Gauge */}
          <div className="flex items-center justify-center py-2">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-surface-secondary"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-emerald-500 transition-all duration-700 ease-out"
                  strokeWidth="10"
                  strokeDasharray={`${onlineRatio * 2.51} 251`}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-text-primary font-mono">{onlineRatio}%</span>
                <span className="text-[10px] font-bold text-text-secondary uppercase">Online</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border-default">
            <div className="p-2.5 rounded-xl bg-surface-secondary flex items-center gap-2">
              <Wifi size={16} className="text-emerald-500 shrink-0" />
              <div>
                <p className="text-[10px] text-text-secondary font-bold">ONLINE NOW</p>
                <p className="text-sm font-black text-text-primary">{data?.summary.onlineMembers ?? 0}</p>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-surface-secondary flex items-center gap-2">
              <WifiOff size={16} className="text-neutral-400 shrink-0" />
              <div>
                <p className="text-[10px] text-text-secondary font-bold">OFFLINE</p>
                <p className="text-sm font-black text-text-primary">{data?.summary.offlineMembers ?? 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Club Role Standing (Donut Chart representation) */}
        <div className="bg-surface-elevated rounded-2xl border-2 border-border-brutalist dark:border-border-default p-5 sm:p-6 shadow-[4px_4px_0px_0px_var(--border-brutalist)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border-default">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-950/50 text-purple-600">
                <ShieldCheck size={17} />
              </span>
              <div>
                <h2 className="text-base font-bold text-text-primary">Role Standing</h2>
                <p className="text-[11px] text-text-secondary">Club tier classification</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-text-secondary">{rolesTotal}</span>
          </div>

          <div className="space-y-3 pt-1">
            {(data?.roles || []).map((r) => {
              const pct = Math.round((r.count / rolesTotal) * 100);
              const hex = ROLE_COLORS[r.role.toLowerCase()] || "#94a3b8";
              return (
                <div key={r.role} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-text-primary flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: hex }} />
                      {r.label}
                    </span>
                    <span className="font-mono text-text-secondary">
                      {r.count} <span className="text-text-tertiary">({pct}%)</span>
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-secondary overflow-hidden">
                    <div
                      style={{ width: `${Math.max(5, pct)}%`, backgroundColor: hex }}
                      className="h-full rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Application Verification Pipeline */}
        <div className="bg-surface-elevated rounded-2xl border-2 border-border-brutalist dark:border-border-default p-5 sm:p-6 shadow-[4px_4px_0px_0px_var(--border-brutalist)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border-default">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/50 text-amber-600">
                <CheckCircle2 size={17} />
              </span>
              <div>
                <h2 className="text-base font-bold text-text-primary">Application Funnel</h2>
                <p className="text-[11px] text-text-secondary">Member approval pipeline</p>
              </div>
            </div>
            <Link
              href="/dashboard/members?tab=pending"
              className="text-xs font-bold text-accent-primary hover:underline"
            >
              Review
            </Link>
          </div>

          <div className="space-y-3 pt-1">
            {(data?.applicationStatus || []).map((s) => {
              const isApproved = s.status === "approved";
              const isPending = s.status === "pending";
              const color = isApproved
                ? "bg-emerald-500"
                : isPending
                ? "bg-amber-500"
                : "bg-rose-500";
              const label = isApproved
                ? "Approved Active"
                : isPending
                ? "Pending Review"
                : "Rejected";

              return (
                <div key={s.status} className="p-3 rounded-xl bg-surface-secondary border border-border-default flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-3 h-3 rounded-full ${color}`} />
                    <span className="text-xs font-bold text-text-primary">{label}</span>
                  </div>
                  <span className="text-base font-black font-mono text-text-primary">{s.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── SECTION 3: Events & Participation Analytics ── */}
      <div className="bg-surface-elevated rounded-2xl border-2 border-border-brutalist dark:border-border-default p-5 sm:p-6 shadow-[4px_4px_0px_0px_var(--border-brutalist)] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-default">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/50 text-rose-600">
              <Calendar size={17} />
            </span>
            <div>
              <h2 className="text-base font-bold text-text-primary">Events &amp; Competitions Overview</h2>
              <p className="text-[11px] text-text-secondary">Participation volumes and approved team counts</p>
            </div>
          </div>
          <Link
            href="/dashboard/manage-events"
            className="text-xs font-bold text-accent-primary hover:underline self-start sm:self-auto"
          >
            Manage Events &rarr;
          </Link>
        </div>

        {/* Recent Events Grid (Latest 5 Events) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(data?.events.recent || []).slice(0, 5).map((evt) => (
            <div
              key={evt._id}
              className="p-4 rounded-xl bg-surface-secondary border border-border-default flex flex-col justify-between gap-3 hover:-translate-y-0.5 transition-transform"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-surface-elevated border border-border-default text-[10px] font-mono font-bold uppercase text-text-secondary">
                    {evt.category || "Event"}
                  </span>
                  <span className="text-[11px] font-mono text-text-tertiary">
                    {new Date(evt.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-text-primary line-clamp-1">{evt.title}</h3>
              </div>

              <div className="pt-2 border-t border-border-default grid grid-cols-3 gap-2 text-center">
                <div className="p-1.5 rounded-lg bg-surface-elevated border border-border-default">
                  <p className="text-[9px] font-bold text-text-tertiary uppercase">Approved</p>
                  <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono">
                    {evt.approvedCount}
                  </p>
                </div>
                <div className="p-1.5 rounded-lg bg-surface-elevated border border-border-default">
                  <p className="text-[9px] font-bold text-text-tertiary uppercase">Pending</p>
                  <p className="text-sm font-black text-amber-600 dark:text-amber-400 font-mono">
                    {evt.pendingCount}
                  </p>
                </div>
                <div className="p-1.5 rounded-lg bg-surface-elevated border border-border-default">
                  <p className="text-[9px] font-bold text-text-tertiary uppercase">Winners</p>
                  <p className="text-sm font-black text-purple-600 dark:text-purple-400 font-mono">
                    {evt.winnersCount}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SECTION 4: Projects & Technical Stack Analytics ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Pipeline Statuses */}
        <div className="bg-surface-elevated rounded-2xl border-2 border-border-brutalist dark:border-border-default p-5 sm:p-6 shadow-[4px_4px_0px_0px_var(--border-brutalist)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border-default">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600">
                <FolderGit2 size={17} />
              </span>
              <div>
                <h2 className="text-base font-bold text-text-primary">Project Lifecycle</h2>
                <p className="text-[11px] text-text-secondary">Status of open source engineering builds</p>
              </div>
            </div>
            <Link
              href="/dashboard/manage-projects"
              className="text-xs font-bold text-accent-primary hover:underline"
            >
              View Projects
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {(data?.projects.byStatus || []).map((p) => {
              const statusKey = p.status.toLowerCase();
              const badgeClass = STATUS_COLORS[statusKey] || "bg-neutral-600 text-white";
              return (
                <div
                  key={p.status}
                  className="p-3 rounded-xl bg-surface-secondary border border-border-default flex flex-col justify-between"
                >
                  <span className={`self-start px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${badgeClass}`}>
                    {p.status.replace("_", " ")}
                  </span>
                  <span className="mt-3 text-2xl font-black font-mono text-text-primary">{p.count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Most Used Technical Stacks */}
        <div className="bg-surface-elevated rounded-2xl border-2 border-border-brutalist dark:border-border-default p-5 sm:p-6 shadow-[4px_4px_0px_0px_var(--border-brutalist)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border-default">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/50 text-amber-600">
                <Code2 size={17} />
              </span>
              <div>
                <h2 className="text-base font-bold text-text-primary">Technologies &amp; Stacks</h2>
                <p className="text-[11px] text-text-secondary">Most frequent libraries and frameworks</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-text-secondary">Top Stacks</span>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {(data?.projects.topTechStack || []).length > 0 ? (
              data?.projects.topTechStack.map((tech) => (
                <div
                  key={tech.tech}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-secondary border border-border-default text-xs font-bold text-text-primary shadow-xs"
                >
                  <span>{tech.tech}</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-accent-primary/20 text-accent-primary-hover text-[10px] font-mono font-black">
                    {tech.count}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-8 text-center w-full text-xs text-text-tertiary">
                No recorded tech stack data yet. Tag technologies in Projects Management.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
