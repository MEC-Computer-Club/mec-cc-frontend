"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";
import { DoorOpen, Loader2, Clock, CheckCircle2, BookOpen } from "lucide-react";
import toast from "react-hot-toast";

interface ClubRoomState {
  status: "open" | "closed";
  openedBy?: string;
  updatedAt?: string;
}

export default function ClubRoomAdminCard() {
  const [data, setData] = useState<ClubRoomState>({ status: "closed" });
  const [isUpdating, setIsUpdating] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/site-settings/public`);
      if (res.data?.clubRoom) {
        setData(res.data.clubRoom);
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleToggle = async () => {
    const nextStatus = data.status === "open" ? "closed" : "open";
    setIsUpdating(true);
    try {
      const res = await axios.patch(
        `${API_BASE_URL}/api/site-settings/club-room`,
        { status: nextStatus },
        { withCredentials: true }
      );
      if (res.data?.clubRoom) {
        setData(res.data.clubRoom);
      } else {
        setData((prev) => ({ ...prev, status: nextStatus }));
      }
      toast.success(
        nextStatus === "open"
          ? "Club room marked as OPEN! Public status updated."
          : "Club room marked as CLOSED. Public status updated."
      );
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update room status");
    } finally {
      setIsUpdating(false);
    }
  };

  const isOpen = data.status === "open";

  const formatOpeningTime = (iso?: string) => {
    if (!iso) return "";
    try {
      const date = new Date(iso);
      const timeStr = date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });
      const today = new Date();
      const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

      return isToday ? timeStr : `${date.toLocaleDateString([], { month: "short", day: "numeric" })}, ${timeStr}`;
    } catch {
      return "";
    }
  };

  const formatTimeAgo = (iso?: string) => {
    if (!iso) return "";
    try {
      const diffMs = Date.now() - new Date(iso).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${Math.floor(diffHours / 24)}d ago`;
    } catch {
      return "";
    }
  };

  return (
    <div
      className={`p-4 sm:p-5 rounded-2xl border-2 transition-all ${
        isOpen
          ? "bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/80 shadow-[4px_4px_0px_#10b981]"
          : "bg-surface-elevated border-border-brutalist dark:border-border-default shadow-[4px_4px_0px_var(--border-brutalist)] dark:shadow-[4px_4px_0px_var(--border-default)]"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left Info */}
        <div className="flex items-start sm:items-center gap-3.5">
          <div
            className={`w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 ${
              isOpen
                ? "bg-emerald-500 text-white border-emerald-600 shadow-[2px_2px_0px_#065f46]"
                : "bg-red-500 text-white border-red-600 shadow-[2px_2px_0px_#991b1b]"
            }`}
          >
            <DoorOpen size={24} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span
                className={`inline-block w-2.5 h-2.5 rounded-full ${
                  isOpen ? "bg-emerald-500 animate-pulse" : "bg-red-500"
                }`}
              />
              <span className="font-mono text-xs font-black uppercase tracking-wider text-text-tertiary">
                Club Room Live Status
              </span>
              <span
                className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-black uppercase tracking-wider border ${
                  isOpen
                    ? "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-700"
                    : "bg-red-100 text-red-900 border-red-300 dark:bg-red-950 dark:text-red-300 dark:border-red-700"
                }`}
              >
                {isOpen ? "OPEN" : "CLOSED"}
              </span>
            </div>

            <div className="text-sm font-semibold text-text-secondary mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
              {isOpen ? (
                <>
                  {data.openedBy && (
                    <span className="inline-flex items-center gap-1.5 text-text-primary">
                      <CheckCircle2 size={13} className="text-emerald-500" />
                      Opened by: <strong>{data.openedBy}</strong>
                    </span>
                  )}
                  {data.updatedAt && (
                    <span className="inline-flex items-center gap-1 text-text-tertiary font-mono text-xs">
                      <Clock size={12} />
                      {formatOpeningTime(data.updatedAt)} ({formatTimeAgo(data.updatedAt)})
                    </span>
                  )}
                </>
              ) : (
                <span className="text-text-tertiary text-xs">
                  Off hours — room is closed. Members will be guided to contact executives if they need access.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Toggle Button & Log Book Link */}
        <div className="flex items-center gap-2.5 self-end sm:self-center">
          <Link
            href="/dashboard/activity-log"
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl font-mono text-xs font-bold bg-surface-secondary hover:bg-surface-primary border border-border-default text-text-primary hover:border-accent-primary transition-all shadow-[2px_2px_0px_var(--border-default)] hover:shadow-[3px_3px_0px_var(--accent-primary)] cursor-pointer"
            title="View Historical Room Log Book"
          >
            <BookOpen size={14} className="text-accent-primary" />
            <span>Log Book</span>
          </Link>

          <button
            type="button"
            disabled={isUpdating || loading}
            onClick={handleToggle}
            className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs font-black uppercase tracking-wider transition-all cursor-pointer border ${
              isOpen
                ? "bg-red-600 hover:bg-red-700 text-white border-red-800 shadow-[3px_3px_0px_#991b1b] hover:-translate-x-0.5 hover:-translate-y-0.5"
                : "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-800 shadow-[3px_3px_0px_#065f46] hover:-translate-x-0.5 hover:-translate-y-0.5"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isUpdating ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Updating...
              </>
            ) : isOpen ? (
              <>
                <DoorOpen size={15} />
                Close Room
              </>
            ) : (
              <>
                <DoorOpen size={15} />
                Open Room
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
