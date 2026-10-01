"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Search,
  RotateCcw,
  User,
  Clock,
  ChevronDown,
  ChevronUp,
  FileText,
  Lock,
  Download,
  Activity,
  Layers,
  Users,
  Award,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import FilterSelect, { FilterOption } from "@/app/dashboard/components/FilterSelect";
import { getAdminLogs, AdminLogEntry } from "@/lib/auditLogger";

export default function DashboardActivityLogPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [logs, setLogs] = useState<AdminLogEntry[]>(() => getAdminLogs());
  const [searchQuery, setSearchQuery] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");
  const [actorFilter, setActorFilter] = useState("all");
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  // Strictly enforce Admin only access for staff activity log
  const isStrictAdmin = user?.role === "admin";

  // Subscribe to live audit log updates
  useEffect(() => {
    setLogs(getAdminLogs());

    const handleUpdate = () => {
      setLogs(getAdminLogs());
    };

    window.addEventListener("mec-admin-log-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("mec-admin-log-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  // Filter options
  const moduleOptions: FilterOption[] = [
    { value: "all", label: "All Modules" },
    { value: "ASSET", label: "Assets & Equipment" },
    { value: "MEMBER", label: "Members & Approvals" },
    { value: "EVENT", label: "Events & Contests" },
    { value: "PAGE", label: "Pages & Content" },
    { value: "SYSTEM", label: "System & Settings" },
  ];

  const actionOptions: FilterOption[] = [
    { value: "all", label: "All Actions" },
    { value: "STATUS_CHANGE", label: "Status Changes" },
    { value: "CREATE", label: "Creations" },
    { value: "UPDATE", label: "Updates" },
    { value: "APPROVE", label: "Approvals" },
    { value: "PUBLISH", label: "Publications" },
    { value: "DELETE", label: "Deletions" },
  ];

  const actorOptions: FilterOption[] = useMemo(() => {
    const actors = Array.from(new Set(logs.map((l) => l.actorName))).filter(Boolean);
    return [
      { value: "all", label: "All Staff" },
      ...actors.map((a) => ({ value: a, label: a })),
    ];
  }, [logs]);

  // Filtered log list
  const filteredLogs = useMemo(() => {
    return logs.filter((entry) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        entry.description.toLowerCase().includes(q) ||
        entry.actorName.toLowerCase().includes(q) ||
        entry.targetTitle.toLowerCase().includes(q) ||
        (entry.formattedDate && entry.formattedDate.toLowerCase().includes(q));

      const matchesModule = moduleFilter === "all" || entry.targetType === moduleFilter;
      const matchesAction = actionFilter === "all" || entry.action === actionFilter;
      const matchesActor = actorFilter === "all" || entry.actorName === actorFilter;

      return matchesSearch && matchesModule && matchesAction && matchesActor;
    });
  }, [logs, searchQuery, moduleFilter, actionFilter, actorFilter]);

  // Toggle diff view
  const toggleExpand = (id: string) => {
    setExpandedLogId((prev) => (prev === id ? null : id));
  };

  // Export logs to JSON
  const handleExportLogs = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredLogs, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `mec-activity-logs-${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // ── Access Denied Screen if user is not strictly an admin ──
  if (!isLoading && (!isAuthenticated || !isStrictAdmin)) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-surface-elevated border-2 border-accent-error rounded-xl p-6 sm:p-8 text-center shadow-[6px_6px_0px_var(--accent-error)]">
          <div className="w-14 h-14 rounded-full bg-accent-error/20 border-2 border-accent-error flex items-center justify-center mx-auto mb-4 text-accent-error">
            <Lock size={28} />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-text-primary mb-2">
            Restricted Admin Area
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mb-6 leading-relaxed">
            The Activity Audit Log is classified and accessible <strong>exclusively by Club Administrators</strong>.
            Moderators and standard members do not have viewing privileges.
          </p>
          <div className="flex flex-col gap-2.5">
            <Link
              href="/dashboard"
              className="w-full py-2.5 rounded-lg bg-accent-primary text-text-inverse font-bold text-xs sm:text-sm border-2 border-border-default shadow-[3px_3px_0px_var(--border-default)] hover:translate-x-0.5 hover:translate-y-0.5 transition block text-center"
            >
              Return to Platform Overview
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border-default pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-accent-primary-light text-text-primary font-mono font-bold text-[11px] mb-2 border border-border-default">
            <Activity size={13} className="text-accent-primary" />
            <span>INSIGHTS & AUDIT LOG</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
            Activity Log
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary font-mono mt-1">
            Immutable tracking of actions performed by Admins and Moderators with previous-version diffs
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExportLogs}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-border-default bg-surface-elevated text-xs font-bold text-text-secondary hover:text-text-primary transition shadow-[2px_2px_0px_0px_var(--border-default)] hover:shadow-[3px_3px_0px_0px_var(--accent-primary)] hover:border-accent-primary cursor-pointer"
          >
            <Download size={14} />
            <span>Export JSON</span>
          </button>

          <div className="flex items-center gap-2.5 bg-surface-elevated border border-border-default rounded-xl p-2.5 shadow-[2px_2px_0px_var(--border-default)]">
            <div className="w-8 h-8 rounded-lg bg-accent-primary text-text-inverse font-black text-xs flex items-center justify-center border border-border-brutalist">
              {user?.fullName?.[0] || "A"}
            </div>
            <div>
              <div className="text-xs font-bold text-text-primary flex items-center gap-1">
                <span>{user?.fullName || "Admin"}</span>
                <span className="text-[9px] font-mono px-1 py-0.2 bg-text-primary text-surface-primary dark:bg-white dark:text-black rounded font-bold uppercase">
                  {user?.role || "ADMIN"}
                </span>
              </div>
              <p className="text-[10px] text-text-tertiary font-mono">{user?.email || "admin@meccomputerclub.org"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Summary Counters ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-surface-elevated border border-border-default rounded-xl p-4 shadow-[3px_3px_0px_var(--border-default)]">
          <span className="text-[11px] font-mono font-bold text-text-secondary uppercase">Total Logged Actions</span>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-text-primary">{logs.length}</span>
            <span className="text-xs font-mono text-text-tertiary">events</span>
          </div>
        </div>

        <div className="bg-surface-elevated border border-border-default rounded-xl p-4 shadow-[3px_3px_0px_var(--border-default)]">
          <span className="text-[11px] font-mono font-bold text-text-secondary uppercase">Asset Status Changes</span>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-text-primary">
              {logs.filter((l) => l.targetType === "ASSET").length}
            </span>
            <span className="text-xs font-mono text-text-tertiary">recorded</span>
          </div>
        </div>

        <div className="bg-surface-elevated border border-border-default rounded-xl p-4 shadow-[3px_3px_0px_var(--border-default)]">
          <span className="text-[11px] font-mono font-bold text-text-secondary uppercase">Member Decisions</span>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-text-primary">
              {logs.filter((l) => l.targetType === "MEMBER").length}
            </span>
            <span className="text-xs font-mono text-text-tertiary">approvals</span>
          </div>
        </div>

        <div className="bg-surface-elevated border border-border-default rounded-xl p-4 shadow-[3px_3px_0px_var(--border-default)]">
          <span className="text-[11px] font-mono font-bold text-text-secondary uppercase">Content & Events</span>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-text-primary">
              {logs.filter((l) => l.targetType === "EVENT" || l.targetType === "PAGE").length}
            </span>
            <span className="text-xs font-mono text-text-tertiary">published</span>
          </div>
        </div>
      </div>

      {/* ── Search & Filter Controls (Neo-Brutalist FilterSelect) ── */}
      <div className="bg-surface-elevated border border-border-default rounded-xl p-4 shadow-[3px_3px_0px_var(--border-default)] flex flex-col md:flex-row gap-3 md:items-center justify-between">
        {/* Search bar */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search logs by staff name, keyword, asset, member, or date..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-surface-primary border border-border-default text-text-primary text-xs sm:text-sm placeholder:text-text-tertiary focus:outline-none focus:border-accent-primary focus:shadow-[2px_2px_0px_var(--accent-primary)]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"
            >
              ✕
            </button>
          )}
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <FilterSelect
            value={moduleFilter}
            onChange={setModuleFilter}
            options={moduleOptions}
            placeholder="Module"
          />

          <FilterSelect
            value={actionFilter}
            onChange={setActionFilter}
            options={actionOptions}
            placeholder="Action"
          />

          <FilterSelect
            value={actorFilter}
            onChange={setActorFilter}
            options={actorOptions}
            placeholder="Staff Member"
          />

          {(searchQuery || moduleFilter !== "all" || actionFilter !== "all" || actorFilter !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setModuleFilter("all");
                setActionFilter("all");
                setActorFilter("all");
              }}
              className="px-3 py-1.5 text-xs font-mono font-bold text-text-secondary hover:text-accent-error transition cursor-pointer flex items-center gap-1"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Log Stream ── */}
      <div className="space-y-3">
        {filteredLogs.length === 0 ? (
          <div className="bg-surface-elevated border border-border-default rounded-xl p-12 text-center text-text-tertiary shadow-[3px_3px_0px_var(--border-default)]">
            <FileText size={40} className="mx-auto mb-2 opacity-40" />
            <p className="font-semibold text-text-secondary">No activity log entries match your filter</p>
            <p className="text-xs mt-1">Try resetting the filters or modifying assets in the dashboard</p>
          </div>
        ) : (
          filteredLogs.map((entry) => {
            const isExpanded = expandedLogId === entry.id;
            const hasDiff = Boolean(entry.diff && entry.diff.length > 0);

            return (
              <div
                key={entry.id}
                className="bg-surface-elevated border border-border-default rounded-xl p-4 sm:p-5 shadow-[3px_3px_0px_var(--border-default)] transition-all hover:border-text-primary"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  {/* Left info */}
                  <div className="space-y-1.5 flex-1">
                    {/* Badge Row */}
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                      {/* Actor Badge */}
                      <span className="inline-flex items-center gap-1.5 font-bold text-text-primary bg-surface-secondary px-2.5 py-0.5 rounded border border-border-default">
                        <User size={13} className="text-text-tertiary" />
                        <span>{entry.actorName}</span>
                        <span
                          className={`text-[9px] px-1 py-0.2 rounded uppercase font-black ${
                            entry.actorRole === "admin"
                              ? "bg-text-primary text-surface-primary dark:bg-white dark:text-black"
                              : "bg-accent-primary text-text-inverse font-extrabold"
                          }`}
                        >
                          {entry.actorRole}
                        </span>
                      </span>

                      {/* Action Chip */}
                      <span
                        className={`px-2 py-0.5 rounded font-extrabold text-[10px] tracking-wider uppercase ${
                          entry.action === "STATUS_CHANGE"
                            ? "bg-accent-primary/25 text-text-primary dark:text-white border border-accent-primary"
                            : entry.action === "APPROVE"
                            ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40"
                            : entry.action === "CREATE"
                            ? "bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/40"
                            : entry.action === "DELETE"
                            ? "bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/40"
                            : "bg-surface-secondary text-text-secondary border border-border-default"
                        }`}
                      >
                        {entry.action.replace("_", " ")}
                      </span>

                      {/* Target Type */}
                      <span className="text-text-tertiary uppercase text-[10px] font-bold">
                        [{entry.targetType}]
                      </span>

                      {/* Timestamp */}
                      <span className="text-text-tertiary text-[11px] flex items-center gap-1 ml-auto sm:ml-0">
                        <Clock size={12} />
                        <span>{entry.formattedDate}</span>
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm font-semibold text-text-primary leading-relaxed pt-0.5">
                      {entry.description}
                    </p>

                    {/* Target preview pill */}
                    <div className="inline-flex items-center gap-1.5 text-xs text-text-secondary font-mono bg-surface-primary px-2 py-1 rounded border border-border-default">
                      <span className="text-text-tertiary">Target:</span>
                      <span className="font-bold text-text-primary">{entry.targetTitle}</span>
                    </div>
                  </div>

                  {/* Diff Inspector Toggle */}
                  {hasDiff && (
                    <button
                      onClick={() => toggleExpand(entry.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition cursor-pointer self-start sm:self-center shrink-0 ${
                        isExpanded
                          ? "bg-text-primary text-surface-primary dark:bg-white dark:text-black"
                          : "bg-surface-secondary hover:bg-surface-primary text-text-secondary border border-border-default"
                      }`}
                    >
                      <span>{isExpanded ? "Hide Version Diff" : "View Previous Version / Diff"}</span>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  )}
                </div>

                {/* ── Expandable Diff Inspector ── */}
                {isExpanded && entry.diff && (
                  <div className="mt-4 pt-4 border-t border-border-default animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="text-xs font-mono font-bold uppercase text-text-secondary mb-2 flex items-center gap-1.5">
                      <RotateCcw size={13} className="text-accent-primary" />
                      <span>Version Change Comparison (Previous vs New)</span>
                    </div>

                    <div className="bg-surface-primary rounded-lg border border-border-default overflow-hidden">
                      <table className="w-full text-left text-xs font-mono border-collapse">
                        <thead>
                          <tr className="bg-surface-secondary border-b border-border-default text-text-tertiary text-[10px] uppercase">
                            <th className="py-2 px-3 font-bold">Field / Property</th>
                            <th className="py-2 px-3 font-bold">Previous Version Value</th>
                            <th className="py-2 px-3 font-bold">New Updated Value</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border-default">
                          {entry.diff.map((d, idx) => (
                            <tr key={idx} className="hover:bg-surface-secondary/40">
                              <td className="py-2.5 px-3 font-bold text-text-primary">{d.field}</td>
                              <td className="py-2.5 px-3">
                                <span className="inline-block px-2 py-0.5 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400 font-semibold line-through decoration-rose-500/60">
                                  {String(d.previousValue ?? "N/A")}
                                </span>
                              </td>
                              <td className="py-2.5 px-3">
                                <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
                                  {String(d.newValue ?? "N/A")}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
