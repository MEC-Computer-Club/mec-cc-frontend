"use client";
import React, { useEffect } from "react";
import {
  Users, ClipboardCheck, Calendar, FileText,
  Zap, MessageSquare, GalleryHorizontal, HardHat,
  LayoutDashboard, PenLine, FolderOpen, DollarSign, Wrench,
  HardDrive, ExternalLink, Image as ImageIcon,
} from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { DashboardStats } from "@/types";
import { CloudinaryUsageStats, fetchCloudinaryStats } from "@/lib/api/cloudinaryStats";
import Link from "next/link";
import { DashboardActivityCard } from "./DashboardActivityCard";

export default function AdminOverview() {
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [mediaStats, setMediaStats] = React.useState<CloudinaryUsageStats | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [recentMessages, setRecentMessages] = React.useState<Array<{
    _id: string;
    subject: string;
    senderName: string;
    senderEmail: string;
    isRead: boolean;
    createdAt: string;
  }>>([]);
  const { user } = useAuth();

  useEffect(() => {
    let isMounted = true;
    const fetchData = async (isSilent = false) => {
      if (!isSilent) setLoading(true);
      try {
        const [statsRes, msgsRes, mediaRes] = await Promise.allSettled([
          axios.get(
            `${API_BASE_URL}/api/dashboard/admin-stats`,
            { withCredentials: true }
          ),
          axios.get(
            `${API_BASE_URL}/api/contact-messages?limit=4`,
            { withCredentials: true }
          ),
          fetchCloudinaryStats(),
        ]);
        if (isMounted) {
          if (statsRes.status === "fulfilled") setStats(statsRes.value.data.data);
          if (msgsRes.status === "fulfilled") setRecentMessages(msgsRes.value.data.data || []);
          if (mediaRes.status === "fulfilled" && mediaRes.value) setMediaStats(mediaRes.value);
        }
      } catch (error) {
        console.error("Error fetching overview data:", error);
      } finally {
        if (isMounted && !isSilent) {
          setLoading(false);
        }
      }
    };

    fetchData(false);

    // Auto-refresh stats and messages every 30 seconds
    const interval = setInterval(() => {
      fetchData(true);
    }, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [user]);

  const quickActions = [
    { href: "/dashboard/manage-events/create-event", icon: Calendar, label: "Create Event" },
    { href: "/dashboard/members?tab=pending", icon: Users, label: "Approve Members" },
    { href: "/dashboard/utilities", icon: Wrench, label: "Utilities" },
    { href: "/dashboard/assets", icon: HardHat, label: "Manage Assets" },
    { href: "/dashboard/overview/home-page-edit", icon: LayoutDashboard, label: "Home Page Editor" },
    { href: "/dashboard/messages", icon: MessageSquare, label: "View Messages" },
    { href: "/dashboard/blogs", icon: PenLine, label: "Write Blog" },
    { href: "/dashboard/manage-projects", icon: FolderOpen, label: "Add Project" },
    { href: "/dashboard/sponsors/create", icon: DollarSign, label: "Add Sponsor" },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-9 w-64 bg-surface-secondary border border-border-default rounded-lg animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-surface-secondary border border-border-default rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Members",
      value: stats?.membership.totalMembers ?? "—",
      icon: Users,
      color: "text-accent-primary",
      link: "/dashboard/members",
    },
    {
      title: "Pending Applications",
      value: stats?.membership.pendingApplications ?? "—",
      icon: ClipboardCheck,
      color: "text-accent-error",
      link: "/dashboard/members?tab=pending",
    },
    {
      title: "Total Events",
      value: stats?.activities.totalEvents ?? "—",
      icon: Calendar,
      color: "text-accent-success",
      link: "/dashboard/manage-events",
    },
    {
      title: "Total Certificates",
      value: stats?.activities.totalCertificates ?? "—",
      icon: FileText,
      color: "text-accent-warning",
      link: "/dashboard/manage-certificates",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="border-b border-border-default pb-4">
        <h2 className="text-2xl sm:text-3xl font-semibold text-text-primary">
          Platform Overview
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          Welcome back, <strong className="text-text-primary">{user?.fullName || user?.email}</strong>
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Inner = (
            <div
              className={`bg-surface-elevated rounded-xl border border-border-default p-4 shadow-[4px_4px_0px_0px_var(--border-default)] flex flex-col gap-3 transition hover:shadow-[6px_6px_0px_0px_var(--border-default)] ${card.link ? "cursor-pointer" : ""}`}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
                  {card.title}
                </p>
                <card.icon size={18} className={card.color} />
              </div>
              <p className="text-3xl font-semibold text-text-primary leading-none">
                {card.value}
              </p>
            </div>
          );

          return card.link ? (
            <Link key={card.title} href={card.link}>
              {Inner}
            </Link>
          ) : (
            <div key={card.title}>{Inner}</div>
          );
        })}
      </div>

      {/* Cloudinary Storage Usage Health Banner */}
      <div className="bg-surface-elevated rounded-xl border-2 border-text-primary dark:border-border-default p-4 shadow-[4px_4px_0px_0px_var(--accent-primary)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-accent-primary/10 border border-accent-primary/30 rounded-xl text-accent-primary shrink-0">
            <HardDrive size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-black text-sm sm:text-base text-text-primary">
                Cloudinary Cloud Storage
              </span>
              <span className="px-2 py-0.5 bg-accent-primary text-black font-mono text-[10px] font-extrabold rounded">
                {mediaStats?.plan || "Free"} Plan
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-0.5 font-mono">
              <strong>{mediaStats?.storage.formatted || "182.0 MB"}</strong> used of{" "}
              {mediaStats?.credits.limit || 25} GB quota ({mediaStats?.credits.percentUsed || 3.44}% consumed) ·{" "}
              <strong>{mediaStats?.objects.totalAssets || 274}</strong> active media files
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="w-36 hidden sm:block">
            <div className="w-full h-2.5 bg-surface-secondary border border-border-default rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-accent-primary rounded-full transition-all"
                style={{ width: `${Math.max(4, mediaStats?.credits.percentUsed || 3.44)}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-text-tertiary block text-right mt-1">
              {mediaStats?.credits.remaining || "24.1"} credits free
            </span>
          </div>

          {process.env.NODE_ENV === "development" && (
            <Link
              href="/dashboard/media"
              className="px-3.5 py-1.5 bg-surface-primary text-text-primary hover:bg-accent-primary hover:text-black border border-border-default rounded-lg text-xs font-bold font-mono transition flex items-center gap-1.5 shrink-0"
            >
              <span>Manage Media</span>
              <ExternalLink size={12} />
            </Link>
          )}
        </div>
      </div>

      {/* Action Center & Recent Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-surface-elevated rounded-xl border border-border-default shadow-[4px_4px_0px_0px_var(--border-default)] p-5">
          <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2 mb-4">
            <Zap size={15} className="text-accent-primary" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex flex-col items-center justify-center gap-2 py-4 px-2 bg-surface-secondary rounded-xl border border-border-default hover:border-accent-primary hover:shadow-[3px_3px_0px_0px_var(--accent-primary)] transition-all group"
              >
                <action.icon
                  size={20}
                  className="text-accent-primary group-hover:scale-110 transition-transform"
                />
                <span className="text-xs font-semibold text-text-secondary text-center leading-tight group-hover:text-text-primary transition-colors">
                  {action.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Activity Section with Tabs */}
        <DashboardActivityCard recentMessages={recentMessages} />
      </div>
    </div>
  );
}
