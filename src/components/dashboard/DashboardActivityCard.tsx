"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { getAdminLogs, AdminLogEntry } from "@/lib/auditLogger";
import { API_BASE_URL } from "@/lib/api";

export interface DashboardActivityItem {
  id: string;
  category: "messages" | "approvals" | "roles" | "other";
  title: string;
  subtitle: string;
  date: string;
  rawDate: number;
  dotColor: string;
  href?: string;
}

interface DashboardActivityCardProps {
  recentMessages?: Array<{
    _id: string;
    subject: string;
    senderName: string;
    senderEmail: string;
    isRead: boolean;
    createdAt: string;
  }>;
}

type TabType = "all" | "messages" | "approvals";

const TABS: { key: TabType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "messages", label: "Messages" },
  { key: "approvals", label: "Approvals" },
];

export function DashboardActivityCard({ recentMessages = [] }: DashboardActivityCardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [auditLogs, setAuditLogs] = useState<AdminLogEntry[]>([]);

  useEffect(() => {
    // 1. Initial local load
    try {
      const logs = getAdminLogs();
      setAuditLogs(logs || []);
    } catch {
      setAuditLogs([]);
    }

    // 2. Fetch remote MongoDB audit logs
    axios
      .get(`${API_BASE_URL}/api/audit-logs?limit=20`, { withCredentials: true })
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data.logs)) {
          const mappedLogs: AdminLogEntry[] = res.data.logs.map((item: any) => ({
            id: item._id || item.id,
            timestamp: item.timestamp || item.createdAt,
            formattedDate: new Date(item.timestamp || item.createdAt).toLocaleDateString(),
            actorName: item.actorName || "Admin",
            actorEmail: item.actorEmail,
            actorRole: item.actorRole || "admin",
            action: item.action,
            targetType: item.targetType,
            targetTitle: item.targetTitle,
            description: item.description,
            diff: item.diff || [],
          }));
          const localLogs = getAdminLogs();
          const existing = new Set(mappedLogs.map((l) => l.id));
          setAuditLogs([...mappedLogs, ...localLogs.filter((l) => !existing.has(l.id))]);
        }
      })
      .catch(() => {
        // Fallback to local
      });
  }, []);

  const formatDate = (isoString?: string | number): string => {
    if (!isoString) return "";
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return "";
      return `${d.getMonth() + 1}/${d.getDate()}`;
    } catch {
      return "";
    }
  };

  const allActivities = useMemo(() => {
    const items: DashboardActivityItem[] = [];

    // 1. Map recent contact messages
    recentMessages.forEach((msg) => {
      items.push({
        id: `msg-${msg._id}`,
        category: "messages",
        title: msg.subject ? (msg.subject.length > 32 ? `${msg.subject.slice(0, 32)}…` : msg.subject) : "Contact form submitted",
        subtitle: `From ${msg.senderName || msg.senderEmail || "Guest"}`,
        date: formatDate(msg.createdAt) || "Recent",
        rawDate: new Date(msg.createdAt).getTime() || Date.now(),
        dotColor: "bg-amber-500",
        href: `/dashboard/messages?id=${msg._id}`,
      });
    });

    // 2. Map audit logs
    auditLogs.forEach((log) => {
      let category: DashboardActivityItem["category"] = "other";
      let dotColor = "bg-blue-500";
      let href = "/dashboard/activity-log";

      if (log.action === "APPROVE" || log.action === "REJECT" || log.targetType === "MEMBER") {
        category = "approvals";
        dotColor = "bg-indigo-500";
        href = "/dashboard/members?tab=pending";
      } else if (log.targetType === "INVITATION") {
        category = "roles";
        dotColor = "bg-amber-500";
        href = "/dashboard/roles-and-invitation";
      } else if (log.targetType === "CLUB_ROOM") {
        category = "other";
        dotColor = log.action === "ROOM_OPEN" ? "bg-emerald-500" : "bg-rose-500";
        href = "/dashboard/activity-log";
      } else if (log.description?.toLowerCase().includes("promoted") || log.description?.toLowerCase().includes("role") || log.targetType === "SYSTEM") {
        category = "roles";
        dotColor = "bg-emerald-500";
        href = "/dashboard/roles-and-invitation";
      }

      items.push({
        id: `log-${log.id}`,
        category,
        title: log.description ? (log.description.length > 40 ? `${log.description.slice(0, 40)}…` : log.description) : `${log.action} on ${log.targetTitle}`,
        subtitle: `by ${log.actorName || "Admin"}`,
        date: formatDate(log.timestamp) || "Recent",
        rawDate: new Date(log.timestamp).getTime() || Date.now(),
        dotColor,
        href,
      });
    });

    return items.sort((a, b) => b.rawDate - a.rawDate);
  }, [recentMessages, auditLogs]);

  const filteredActivities = useMemo(() => {
    if (activeTab === "all") return allActivities;
    return allActivities.filter((item) => item.category === activeTab);
  }, [allActivities, activeTab]);

  return (
    <div className="bg-surface-elevated rounded-2xl border-2 border-border-brutalist dark:border-border-default shadow-[4px_4px_0px_0px_var(--border-brutalist)] p-5 flex flex-col justify-between h-full">
      <div>
        {/* Header: Title + View all link */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <h3 className="text-base sm:text-lg font-bold text-text-primary">
            Activity
          </h3>
          <Link
            href="/dashboard/activity-log"
            className="text-xs font-semibold text-accent-primary hover:underline transition-colors shrink-0"
          >
            View all →
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-surface-secondary/70 rounded-xl border border-border-default/60 mb-4 overflow-x-auto scrollbar-none">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-surface-elevated text-text-primary shadow-xs border border-border-default"
                    : "text-text-tertiary hover:text-text-primary hover:bg-surface-elevated/50"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Activity Items */}
        <div className="space-y-1">
          {filteredActivities.length === 0 ? (
            <p className="text-xs text-text-tertiary py-8 text-center font-medium">
              No recent {activeTab !== "all" ? activeTab : "activity"}
            </p>
          ) : (
            filteredActivities.slice(0, 4).map((item) => (
              <Link
                key={item.id}
                href={item.href || "/dashboard/activity-log"}
                className="group block p-2 rounded-xl hover:bg-surface-secondary/70 transition-colors"
              >
                <div className="flex items-start gap-2.5">
                  <span
                    className={`w-2 h-2 rounded-full ${item.dotColor} mt-1.5 shrink-0`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs sm:text-sm font-bold text-text-primary group-hover:text-accent-primary transition-colors truncate">
                        {item.title}
                      </p>
                      <span className="text-[11px] font-mono text-text-tertiary shrink-0">
                        {item.date}
                      </span>
                    </div>
                    <p className="text-xs text-text-tertiary truncate mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
