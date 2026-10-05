"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Event } from "@/types";
import { LayoutDashboard, Edit3, ShieldAlert, ArrowRight } from "lucide-react";

interface EventAdminToolbarProps {
  event: Event;
}

export function EventAdminToolbar({ event }: EventAdminToolbarProps) {
  const { user, loading } = useAuth();

  if (loading || !user) return null;

  const isStaff = user.role === "admin" || user.role === "moderator";
  if (!isStaff) return null;

  const eventId = event.id || (event as any)._id;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:px-4 sm:py-2.5 rounded-2xl bg-surface-elevated border border-accent-primary/40 shadow-xs">
      <div className="flex items-center gap-2.5 text-xs text-text-primary">
        <div className="w-2.5 h-2.5 rounded-full bg-accent-primary animate-pulse shrink-0" />
        <span className="font-mono uppercase font-bold text-accent-primary tracking-wider">
          {user.role === "admin" ? "Admin Controls" : "Moderator Controls"}
        </span>
        <span className="hidden sm:inline text-text-tertiary">&bull;</span>
        <span className="hidden sm:inline text-text-secondary text-xs">
          Direct management access for &ldquo;{event.title}&rdquo;
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href={`/dashboard/manage-events/event-detail/${eventId}`}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-accent-primary text-text-inverse font-mono font-bold text-xs shadow-xs hover:opacity-90 transition active:scale-95"
          title="Open complete event management page with submissions, attendees, certificates & mailing"
        >
          <LayoutDashboard size={14} />
          <span>Manage Event in Dashboard</span>
          <ArrowRight size={12} className="opacity-80" />
        </Link>

        <Link
          href={`/dashboard/manage-events/create-event?edit=${eventId}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-secondary border border-border-default text-text-primary font-mono font-semibold text-xs hover:border-accent-primary hover:text-accent-primary transition active:scale-95 shadow-2xs"
          title="Edit event details, schedule, prizes, guidelines and rules"
        >
          <Edit3 size={13} />
          <span>Edit Event</span>
        </Link>
      </div>
    </div>
  );
}
