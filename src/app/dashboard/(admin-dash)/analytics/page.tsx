"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";
import FilterSelect from "@/app/dashboard/components/FilterSelect";
import { formatCompactNumber } from "@/lib/formatters";
import {
  Activity,
  Globe,
  Users,
  Clock,
  Code2,
  TrendingUp,
  RotateCcw,
  Smartphone,
  Monitor,
  Tablet,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
  Layers,
  ArrowUpRight,
  Zap,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import ConfirmationModal from "@/components/ui/shared/ConfirmModal";

interface PageStat {
  path: string;
  views: number;
  totalSeconds: number;
  avgSeconds: number;
  avgDurationFormatted: string;
  percentage: number;
}

interface CallerItem {
  caller: string;
  hits: number;
  percentage: number;
}

interface ApiEndpointStat {
  method: string;
  route: string;
  totalHits: number;
  avgLatencyMs: number;
  maxLatencyMs: number;
  statusBuckets: {
    s2xx: number;
    s3xx: number;
    s4xx: number;
    s5xx: number;
  };
  callers: CallerItem[];
}

interface DailyTrendItem {
  date: string;
  views: number;
  uniqueVisitors: number;
  sessions: number;
}

interface AnalyticsDashboardData {
  timeRange: string;
  summary: {
    totalPageViews: number;
    uniqueVisitors: number;
    totalSessions: number;
    totalApiHits: number;
    avgDwellTimeSeconds: number;
    avgDwellTimeFormatted: string;
    bounceRate: number;
  };
  dailyTrend: DailyTrendItem[];
  topPages: PageStat[];
  devices: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  browsers: Record<string, number>;
  os: Record<string, number>;
  referrers: Record<string, number>;
  topApiEndpoints: ApiEndpointStat[];
}

const TIME_RANGE_OPTIONS = [
  { value: "24h", label: "Last 24 Hours" },
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "90d", label: "Last 90 Days" },
];

export default function AnalyticsDashboardPage() {
  const { user, isAdmin } = useAuth();
  const canClear =
    isAdmin ||
    user?.role === "admin" ||
    user?.clubRole === "executive";

  const [data, setData] = useState<AnalyticsDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState("7d");
  const [expandedRoutes, setExpandedRoutes] = useState<Record<string, boolean>>({});
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "web" | "api">("all");
  const [clearModalOpen, setClearModalOpen] = useState(false);
  const [clearing, setClearing] = useState(false);

  const fetchAnalytics = useCallback(
    async (isSilent = false) => {
      if (!isSilent) setLoading(true);
      else setRefreshing(true);

      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/analytics/site-overview?range=${timeRange}`,
          { withCredentials: true }
        );
        if (res.data?.status === "success" && res.data?.data) {
          setData(res.data.data);
          setLastUpdated(new Date());
        }
      } catch (err) {
        console.error("Failed to load site analytics:", err);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [timeRange]
  );

  useEffect(() => {
    fetchAnalytics(false);
  }, [fetchAnalytics]);

  const handleClearAnalytics = async () => {
    setClearing(true);
    try {
      await axios.delete(`${API_BASE_URL}/api/analytics/site-overview`, {
        withCredentials: true,
      });
      setClearModalOpen(false);
      await fetchAnalytics(false);
    } catch (err) {
      console.error("Failed to clear site analytics:", err);
    } finally {
      setClearing(false);
    }
  };

  const toggleRouteExpand = (key: string) => {
    setExpandedRoutes((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Device calculations
  const totalDeviceCount = useMemo(() => {
    if (!data?.devices) return 1;
    return (data.devices.desktop || 0) + (data.devices.mobile || 0) + (data.devices.tablet || 0) || 1;
  }, [data]);

  // Max views in daily trend for proportional bar height
  const maxTrendViews = useMemo(() => {
    if (!data?.dailyTrend || data.dailyTrend.length === 0) return 1;
    return Math.max(...data.dailyTrend.map((d) => Math.max(d.views, d.uniqueVisitors)), 1);
  }, [data]);

  // Total referrers count for percentage
  const totalReferrersCount = useMemo(() => {
    if (!data?.referrers) return 1;
    return Object.values(data.referrers).reduce((a, b) => a + b, 0) || 1;
  }, [data]);

  const getMethodBadgeClass = (method: string) => {
    switch (method.toUpperCase()) {
      case "GET":
        return "bg-sky-500/10 text-sky-500 border-sky-500/30";
      case "POST":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/30";
      case "PUT":
      case "PATCH":
        return "bg-amber-500/10 text-amber-500 border-amber-500/30";
      case "DELETE":
        return "bg-rose-500/10 text-rose-500 border-rose-500/30";
      default:
        return "bg-indigo-500/10 text-indigo-500 border-indigo-500/30";
    }
  };

  const getLatencyBadgeClass = (ms: number) => {
    if (ms < 120) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/30";
    if (ms < 350) return "text-amber-500 bg-amber-500/10 border-amber-500/30";
    return "text-rose-500 bg-rose-500/10 border-rose-500/30";
  };

  return (
    <div className="space-y-8 pb-14 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-border-default pb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-surface-elevated border-2 border-text-primary dark:border-border-default shadow-[3px_3px_0px_0px_var(--accent-primary)]">
              <Activity className="h-6 w-6 text-accent-primary animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-text-primary">
                Site & API Analytics
              </h1>
              <p className="text-xs md:text-sm text-text-secondary mt-0.5">
                Privacy-first site traffic, engagement dwell times, and backend API caller attribution.
              </p>
            </div>
          </div>
        </div>

        {/* Actions & Filters */}
        <div className="flex items-center flex-wrap gap-2.5">
          <FilterSelect
            value={timeRange}
            onChange={(val) => setTimeRange(val)}
            options={TIME_RANGE_OPTIONS}
            placeholder="Select range"
          />

          <button
            type="button"
            onClick={() => fetchAnalytics(true)}
            disabled={refreshing || loading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-default bg-surface-elevated text-xs font-bold text-text-secondary hover:text-text-primary transition shadow-[2px_2px_0px_0px_var(--border-default)] hover:shadow-[3px_3px_0px_0px_var(--accent-primary)] hover:border-accent-primary active:translate-x-[1px] active:translate-y-[1px]"
          >
            <RotateCcw
              size={13}
              className={`${refreshing ? "animate-spin text-accent-primary" : ""}`}
            />
            <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
          </button>

          {canClear && (
            <button
              type="button"
              onClick={() => setClearModalOpen(true)}
              disabled={clearing || loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 text-xs font-bold text-rose-500 hover:bg-rose-500 hover:text-white transition shadow-[2px_2px_0px_0px_rgba(244,63,94,0.3)] hover:shadow-[3px_3px_0px_0px_rgba(244,63,94,0.6)] active:translate-x-[1px] active:translate-y-[1px]"
              title="Reset all site and API analytics metrics"
            >
              <Trash2 size={13} />
              <span>Clear Data</span>
            </button>
          )}
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="inline-flex p-1 rounded-xl bg-surface-secondary border border-border-default shadow-[2px_2px_0px_0px_var(--border-default)]">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "all"
                ? "bg-accent-primary text-text-inverse shadow-[2px_2px_0px_0px_var(--border-default)]"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            All Metrics
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("web")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "web"
                ? "bg-accent-primary text-text-inverse shadow-[2px_2px_0px_0px_var(--border-default)]"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Web Traffic & Dwell
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("api")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "api"
                ? "bg-accent-primary text-text-inverse shadow-[2px_2px_0px_0px_var(--border-default)]"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            API Hit & Caller Attribution
          </button>
        </div>

        {lastUpdated && (
          <span className="text-[11px] font-mono text-text-muted flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Synced: {lastUpdated.toLocaleTimeString()}
          </span>
        )}
      </div>

      {loading && !data ? (
        /* Loading Skeleton */
        <div className="space-y-6 animate-pulse">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-28 rounded-xl bg-surface-elevated border border-border-default"
              />
            ))}
          </div>
          <div className="h-64 rounded-xl bg-surface-elevated border border-border-default" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-72 rounded-xl bg-surface-elevated border border-border-default" />
            <div className="h-72 rounded-xl bg-surface-elevated border border-border-default" />
          </div>
        </div>
      ) : (
        <>
          {/* Top Key Metrics Banner (KPIs) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Page Views */}
            <div className="p-4 rounded-xl bg-surface-elevated border-2 border-border-default shadow-[3px_3px_0px_0px_var(--border-default)] hover:shadow-[4px_4px_0px_0px_var(--accent-primary)] hover:border-accent-primary transition group">
              <div className="flex items-center justify-between text-text-secondary mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Page Views</span>
                <Globe className="h-4 w-4 text-sky-400 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-2xl font-black tracking-tight text-text-primary" title={(data?.summary.totalPageViews || 0).toLocaleString()}>
                {formatCompactNumber(data?.summary.totalPageViews || 0)}
              </div>
              <p className="text-[11px] text-text-secondary mt-1 font-medium">
                Total site impressions
              </p>
            </div>

            {/* Unique Visitors */}
            <div className="p-4 rounded-xl bg-surface-elevated border-2 border-border-default shadow-[3px_3px_0px_0px_var(--border-default)] hover:shadow-[4px_4px_0px_0px_var(--accent-primary)] hover:border-accent-primary transition group">
              <div className="flex items-center justify-between text-text-secondary mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Unique Visitors</span>
                <Users className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-2xl font-black tracking-tight text-text-primary" title={(data?.summary.uniqueVisitors || 0).toLocaleString()}>
                {formatCompactNumber(data?.summary.uniqueVisitors || 0)}
              </div>
              <p className="text-[11px] text-text-secondary mt-1 font-medium">
                Zero-PII daily hashed
              </p>
            </div>

            {/* Visit Sessions */}
            <div className="p-4 rounded-xl bg-surface-elevated border-2 border-border-default shadow-[3px_3px_0px_0px_var(--border-default)] hover:shadow-[4px_4px_0px_0px_var(--accent-primary)] hover:border-accent-primary transition group">
              <div className="flex items-center justify-between text-text-secondary mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Sessions</span>
                <Activity className="h-4 w-4 text-amber-400 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-2xl font-black tracking-tight text-text-primary" title={(data?.summary.totalSessions || 0).toLocaleString()}>
                {formatCompactNumber(data?.summary.totalSessions || 0)}
              </div>
              <p className="text-[11px] text-text-secondary mt-1 font-medium">
                30-min browsing visits
              </p>
            </div>

            {/* Avg Dwell Time */}
            <div className="p-4 rounded-xl bg-surface-elevated border-2 border-border-default shadow-[3px_3px_0px_0px_var(--border-default)] hover:shadow-[4px_4px_0px_0px_var(--accent-primary)] hover:border-accent-primary transition group">
              <div className="flex items-center justify-between text-text-secondary mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Avg Dwell Time</span>
                <Clock className="h-4 w-4 text-indigo-400 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-2xl font-black tracking-tight text-text-primary">
                {data?.summary.avgDwellTimeFormatted || "0s"}
              </div>
              <p className="text-[11px] text-text-secondary mt-1 font-medium">
                Active tab duration
              </p>
            </div>

            {/* Bounce Rate */}
            <div className="p-4 rounded-xl bg-surface-elevated border-2 border-border-default shadow-[3px_3px_0px_0px_var(--border-default)] hover:shadow-[4px_4px_0px_0px_var(--accent-primary)] hover:border-accent-primary transition group">
              <div className="flex items-center justify-between text-text-secondary mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Bounce Rate</span>
                <TrendingUp className="h-4 w-4 text-rose-400 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-2xl font-black tracking-tight text-text-primary">
                {data?.summary.bounceRate || 0}%
              </div>
              <p className="text-[11px] text-text-secondary mt-1 font-medium">
                Single-page sessions
              </p>
            </div>

            {/* API Requests */}
            <div className="p-4 rounded-xl bg-surface-elevated border-2 border-border-default shadow-[3px_3px_0px_0px_var(--border-default)] hover:shadow-[4px_4px_0px_0px_var(--accent-primary)] hover:border-accent-primary transition group">
              <div className="flex items-center justify-between text-text-secondary mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">API Requests</span>
                <Code2 className="h-4 w-4 text-fuchsia-400 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-2xl font-black tracking-tight text-text-primary" title={(data?.summary.totalApiHits || 0).toLocaleString()}>
                {formatCompactNumber(data?.summary.totalApiHits || 0)}
              </div>
              <p className="text-[11px] text-text-secondary mt-1 font-medium">
                Tracked API invocations
              </p>
            </div>
          </div>

          {/* Section 1: Traffic Volume Trend */}
          {(activeTab === "all" || activeTab === "web") && (
            <div className="p-6 rounded-2xl bg-surface-elevated border-2 border-text-primary dark:border-border-default shadow-[4px_4px_0px_0px_var(--accent-primary)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h3 className="text-lg font-black text-text-primary flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-accent-primary" />
                    Daily Traffic & Visitor Trend
                  </h3>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Comparison between Total Page Views and Unique Daily Visitors.
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-accent-primary"></span>
                    <span className="text-text-secondary">Page Views</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-sky-500"></span>
                    <span className="text-text-secondary">Unique Visitors</span>
                  </div>
                </div>
              </div>

              {/* Trend Chart Bars */}
              <div className="space-y-4">
                <div className="grid grid-cols-7 sm:grid-cols-14 md:grid-cols-30 gap-2 items-end min-h-[160px] pt-6 pb-2 border-b border-border-default overflow-x-auto">
                  {(data?.dailyTrend || []).map((day) => {
                    const viewHeightPercent = Math.max(
                      8,
                      Math.round((day.views / maxTrendViews) * 100)
                    );
                    const visitorHeightPercent = Math.max(
                      8,
                      Math.round((day.uniqueVisitors / maxTrendViews) * 100)
                    );

                    return (
                      <div
                        key={day.date}
                        className="flex-1 min-w-[28px] flex flex-col items-center gap-1.5 group relative"
                      >
                        {/* Tooltip on hover */}
                        <div className="absolute -top-14 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-surface-primary border border-border-default rounded-md px-2 py-1 shadow-[2px_2px_0px_0px_var(--border-default)] text-[10px] whitespace-nowrap z-20">
                          <div className="font-bold text-text-primary">{day.date}</div>
                          <div className="text-accent-primary">Views: {formatCompactNumber(day.views)}</div>
                          <div className="text-sky-400">Visitors: {formatCompactNumber(day.uniqueVisitors)}</div>
                        </div>

                        {/* Bar pair */}
                        <div className="w-full flex items-end justify-center gap-1 h-36">
                          <div
                            style={{ height: `${viewHeightPercent}%` }}
                            className="w-2.5 sm:w-3 bg-accent-primary rounded-t-sm transition-all duration-300 hover:brightness-110"
                          />
                          <div
                            style={{ height: `${visitorHeightPercent}%` }}
                            className="w-2.5 sm:w-3 bg-sky-500 rounded-t-sm transition-all duration-300 hover:brightness-110"
                          />
                        </div>

                        <span className="text-[10px] font-mono text-text-muted transform -rotate-45 origin-top-left mt-2 truncate w-8">
                          {day.date.slice(5)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Section 2: Top Visited Pages & Engagement Table */}
          {(activeTab === "all" || activeTab === "web") && (
            <div className="p-6 rounded-2xl bg-surface-elevated border-2 border-text-primary dark:border-border-default shadow-[4px_4px_0px_0px_var(--accent-primary)]">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-lg font-black text-text-primary flex items-center gap-2">
                    <Globe className="h-5 w-5 text-accent-primary" />
                    Top Visited Pages & Time Spent
                  </h3>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Ranked site routes with view volume, traffic share, and active dwell time.
                  </p>
                </div>
              </div>

              {(!data?.topPages || data.topPages.length === 0) ? (
                <div className="p-8 text-center text-text-secondary font-medium">
                  No public web traffic recorded for this period yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b-2 border-border-default text-text-secondary uppercase tracking-wider font-bold">
                        <th className="py-3 px-3">Page Route</th>
                        <th className="py-3 px-3">Views</th>
                        <th className="py-3 px-3">Traffic Share</th>
                        <th className="py-3 px-3">Avg Active Dwell</th>
                        <th className="py-3 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-default font-medium">
                      {data.topPages.map((page, idx) => (
                        <tr
                          key={page.path}
                          className="hover:bg-surface-secondary/40 transition-colors"
                        >
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[11px] font-bold text-accent-primary bg-accent-primary/10 border border-accent-primary/20 px-1.5 py-0.5 rounded">
                                #{idx + 1}
                              </span>
                              <span className="font-mono font-bold text-text-primary">
                                {page.path}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-3 font-bold text-text-primary" title={page.views.toLocaleString()}>
                            {formatCompactNumber(page.views)}
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2 w-36">
                              <div className="flex-1 h-2 rounded-full bg-surface-secondary overflow-hidden">
                                <div
                                  className="h-full bg-accent-primary rounded-full transition-all duration-300"
                                  style={{ width: `${Math.min(100, page.percentage)}%` }}
                                />
                              </div>
                              <span className="text-[11px] font-mono text-text-secondary">
                                {page.percentage}%
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-surface-secondary border border-border-default text-text-primary font-mono">
                              <Clock size={11} className="text-accent-primary" />
                              {page.avgDurationFormatted || "0s"}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <Link
                              href={page.path}
                              target="_blank"
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-text-secondary hover:text-accent-primary transition"
                            >
                              <span>Visit</span>
                              <ExternalLink size={12} />
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

          {/* Section 3: Audience Tech & Referrals Grid */}
          {(activeTab === "all" || activeTab === "web") && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Devices */}
              <div className="p-5 rounded-2xl bg-surface-elevated border-2 border-text-primary dark:border-border-default shadow-[4px_4px_0px_0px_var(--accent-primary)] space-y-4">
                <h4 className="text-sm font-black text-text-primary flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-accent-primary" />
                  Device Breakdown
                </h4>
                <div className="space-y-3">
                  {[
                    {
                      label: "Mobile",
                      icon: Smartphone,
                      count: data?.devices.mobile || 0,
                      color: "bg-emerald-500",
                    },
                    {
                      label: "Desktop",
                      icon: Monitor,
                      count: data?.devices.desktop || 0,
                      color: "bg-sky-500",
                    },
                    {
                      label: "Tablet",
                      icon: Tablet,
                      count: data?.devices.tablet || 0,
                      color: "bg-amber-500",
                    },
                  ].map((dev) => {
                    const pct = Math.round((dev.count / totalDeviceCount) * 100) || 0;
                    return (
                      <div key={dev.label} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="flex items-center gap-1.5 text-text-secondary">
                            <dev.icon size={13} className="text-text-primary" />
                            {dev.label}
                          </span>
                          <span className="font-mono text-text-primary" title={dev.count.toLocaleString()}>
                            {formatCompactNumber(dev.count)} ({pct}%)
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-surface-secondary overflow-hidden">
                          <div
                            className={`h-full ${dev.color} rounded-full transition-all duration-300`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Operating Systems & Browsers */}
              <div className="p-5 rounded-2xl bg-surface-elevated border-2 border-text-primary dark:border-border-default shadow-[4px_4px_0px_0px_var(--accent-primary)] space-y-4">
                <h4 className="text-sm font-black text-text-primary flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-accent-primary" />
                  Top Browsers
                </h4>
                <div className="space-y-2.5">
                  {Object.entries(data?.browsers || {}).length === 0 ? (
                    <p className="text-xs text-text-muted">No browser data yet</p>
                  ) : (
                    Object.entries(data?.browsers || {})
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 5)
                      .map(([browser, count]) => {
                        const totalB =
                          Object.values(data?.browsers || {}).reduce((a, b) => a + b, 0) || 1;
                        const pct = Math.round((count / totalB) * 100) || 0;
                        return (
                          <div
                            key={browser}
                            className="flex items-center justify-between text-xs font-semibold p-2 rounded-lg bg-surface-secondary/40 border border-border-default"
                          >
                            <span className="text-text-primary">{browser}</span>
                            <span className="font-mono text-text-secondary" title={count.toLocaleString()}>
                              {formatCompactNumber(count)} ({pct}%)
                            </span>
                          </div>
                        );
                      })
                  )}
                </div>
              </div>

              {/* Referrers */}
              <div className="p-5 rounded-2xl bg-surface-elevated border-2 border-text-primary dark:border-border-default shadow-[4px_4px_0px_0px_var(--accent-primary)] space-y-4">
                <h4 className="text-sm font-black text-text-primary flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-accent-primary" />
                  Acquisition Sources
                </h4>
                <div className="space-y-2.5">
                  {Object.entries(data?.referrers || {}).length === 0 ? (
                    <p className="text-xs text-text-muted">No referral data yet</p>
                  ) : (
                    Object.entries(data?.referrers || {})
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 5)
                      .map(([source, count]) => {
                        const pct = Math.round((count / totalReferrersCount) * 100) || 0;
                        return (
                          <div
                            key={source}
                            className="flex items-center justify-between text-xs font-semibold p-2 rounded-lg bg-surface-secondary/40 border border-border-default"
                          >
                            <span className="text-text-primary font-bold">{source}</span>
                            <span className="font-mono text-accent-primary font-bold" title={count.toLocaleString()}>
                              {formatCompactNumber(count)} ({pct}%)
                            </span>
                          </div>
                        );
                      })
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Section 4: Backend API Hit Tracking & Caller Source Attribution */}
          {(activeTab === "all" || activeTab === "api") && (
            <div className="p-6 rounded-2xl bg-surface-elevated border-2 border-text-primary dark:border-border-default shadow-[4px_4px_0px_0px_var(--accent-primary)] space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black text-text-primary flex items-center gap-2">
                    <Code2 className="h-5 w-5 text-accent-primary" />
                    Backend API Hit Tracking & Caller Source Attribution
                  </h3>
                  <p className="text-xs text-text-secondary mt-0.5">
                    See exactly which frontend pages trigger each API endpoint to scale and optimize specifically.
                  </p>
                </div>
                <div className="text-xs font-bold text-text-secondary bg-surface-secondary px-3 py-1.5 rounded-lg border border-border-default">
                  Total Endpoints Monitored: {data?.topApiEndpoints?.length || 0}
                </div>
              </div>

              {(!data?.topApiEndpoints || data.topApiEndpoints.length === 0) ? (
                <div className="p-8 text-center text-text-secondary font-medium">
                  No API requests tracked in this period yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {data.topApiEndpoints.map((endpoint) => {
                    const key = `${endpoint.method}:::${endpoint.route}`;
                    const isExpanded = !!expandedRoutes[key];

                    return (
                      <div
                        key={key}
                        className="rounded-xl border-2 border-border-default bg-surface-primary overflow-hidden transition shadow-[2px_2px_0px_0px_var(--border-default)] hover:border-accent-primary"
                      >
                        {/* Endpoint Row Header */}
                        <div
                          onClick={() => toggleRouteExpand(key)}
                          className="flex flex-col md:flex-row md:items-center justify-between p-4 gap-3 cursor-pointer select-none hover:bg-surface-secondary/30 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`px-2.5 py-1 rounded-md text-[11px] font-black tracking-wider border font-mono ${getMethodBadgeClass(
                                endpoint.method
                              )}`}
                            >
                              {endpoint.method}
                            </span>
                            <span className="font-mono text-sm font-bold text-text-primary break-all">
                              {endpoint.route}
                            </span>
                          </div>

                          <div className="flex items-center flex-wrap gap-4 text-xs">
                            {/* Hit Count */}
                            <div className="flex items-center gap-1.5 font-bold" title={endpoint.totalHits.toLocaleString()}>
                              <span className="text-text-secondary font-medium">Hits:</span>
                              <span className="font-mono text-text-primary">
                                {formatCompactNumber(endpoint.totalHits)}
                              </span>
                            </div>

                            {/* Average Latency */}
                            <div className="flex items-center gap-1.5">
                              <span className="text-text-secondary font-medium">Avg:</span>
                              <span
                                className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${getLatencyBadgeClass(
                                  endpoint.avgLatencyMs
                                )}`}
                              >
                                {endpoint.avgLatencyMs}ms
                              </span>
                            </div>

                            {/* Status Buckets */}
                            <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold">
                              {endpoint.statusBuckets.s2xx > 0 && (
                                <span className="text-emerald-500" title={endpoint.statusBuckets.s2xx.toLocaleString()}>
                                  {formatCompactNumber(endpoint.statusBuckets.s2xx)} ok
                                </span>
                              )}
                              {endpoint.statusBuckets.s4xx > 0 && (
                                <span className="text-amber-500" title={endpoint.statusBuckets.s4xx.toLocaleString()}>
                                  {formatCompactNumber(endpoint.statusBuckets.s4xx)} 4xx
                                </span>
                              )}
                              {endpoint.statusBuckets.s5xx > 0 && (
                                <span className="text-rose-500" title={endpoint.statusBuckets.s5xx.toLocaleString()}>
                                  {formatCompactNumber(endpoint.statusBuckets.s5xx)} err
                                </span>
                              )}
                            </div>

                            {/* Expand Indicator Button */}
                            <button
                              type="button"
                              className="flex items-center gap-1 text-[11px] font-bold text-accent-primary bg-accent-primary/10 border border-accent-primary/20 px-2.5 py-1 rounded-md hover:bg-accent-primary hover:text-text-inverse transition"
                            >
                              <span>{isExpanded ? "Hide Callers" : "View Callers"}</span>
                              {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                            </button>
                          </div>
                        </div>

                        {/* Caller Attribution Drawer / Accordion */}
                        {isExpanded && (
                          <div className="p-4 bg-surface-secondary/40 border-t-2 border-border-default space-y-3 animate-in fade-in duration-150">
                            <div className="flex items-center justify-between text-xs font-bold text-text-secondary">
                              <span className="flex items-center gap-1.5">
                                <Layers size={13} className="text-accent-primary" />
                                Caller Source Breakdown for {endpoint.route}
                              </span>
                              <span title={endpoint.totalHits.toLocaleString()}>
                                Total Hits: {formatCompactNumber(endpoint.totalHits)}
                              </span>
                            </div>

                            {(!endpoint.callers || endpoint.callers.length === 0) ? (
                              <p className="text-xs text-text-muted">No caller data captured yet.</p>
                            ) : (
                              <div className="space-y-2">
                                {endpoint.callers.map((caller) => (
                                  <div
                                    key={caller.caller}
                                    className="p-3 rounded-lg bg-surface-elevated border border-border-default flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="w-2 h-2 rounded-full bg-accent-primary"></span>
                                      <span className="font-mono text-xs font-bold text-text-primary">
                                        {caller.caller}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-3 w-full sm:w-auto">
                                      <div className="flex-1 sm:w-36 h-2 rounded-full bg-surface-secondary overflow-hidden">
                                        <div
                                          className="h-full bg-accent-primary rounded-full transition-all duration-300"
                                          style={{ width: `${caller.percentage}%` }}
                                        />
                                      </div>
                                      <span className="font-mono text-xs font-bold text-text-primary" title={caller.hits.toLocaleString()}>
                                        {formatCompactNumber(caller.hits)} hits
                                      </span>
                                      <span className="text-[11px] font-mono text-text-secondary w-12 text-right">
                                        ({caller.percentage}%)
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Privacy & Safety Note */}
          <div className="p-4 rounded-xl bg-surface-elevated border border-border-default flex items-start gap-3 text-xs text-text-secondary">
            <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-text-primary">
                Privacy, Performance & GDPR Compliance
              </span>
              <p>
                Zero personal identities or raw IP addresses are saved. Unique daily visitors are computed via an anonymous daily salted hash (<code className="font-mono text-accent-primary">SHA-256(Date + IP + UserAgent)</code>). Active dwell time pauses automatically when tabs are hidden and uses lightweight background beacons.
              </p>
            </div>
          </div>
        </>
      )}

      {/* Clear Analytics Confirmation Modal */}
      <ConfirmationModal
        isOpen={clearModalOpen}
        onClose={() => setClearModalOpen(false)}
        onConfirm={handleClearAnalytics}
        title="Clear Site Analytics"
        message="Are you sure you want to completely clear all site traffic and API analytics? All historical counts will be wiped so you can observe fresh telemetry."
        confirmText={clearing ? "Clearing..." : "Clear Analytics"}
        cancelText="Cancel"
        loading={clearing}
        confirmColor="red"
      />
    </div>
  );
}
