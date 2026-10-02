"use client";

import React, { useState, useMemo } from "react";
import { Event } from "@/types";
import {
  Share2,
  CalendarPlus,
  Check,
  Copy,
  ExternalLink,
  Building,
  ClipboardList,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

interface EventShareSidebarProps {
  event: Event;
}

export function EventShareSidebar({ event }: EventShareSidebarProps) {
  const [copied, setCopied] = useState(false);
  const [regCopied, setRegCopied] = useState(false);

  const registrationUrl = useMemo(() => {
    if (event.linkedForm) {
      if (typeof window !== "undefined") {
        return `${window.location.origin}/forms/${event.linkedForm}`;
      }
      return `/forms/${event.linkedForm}`;
    }
    if (event.registrationUrl) {
      return event.registrationUrl;
    }
    return null;
  }, [event.linkedForm, event.registrationUrl]);

  const handleCopyLink = () => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Event link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyRegistrationLink = () => {
    if (!registrationUrl || typeof window === "undefined") return;
    navigator.clipboard.writeText(registrationUrl);
    setRegCopied(true);
    toast.success("Registration link copied to clipboard!");
    setTimeout(() => setRegCopied(false), 2000);
  };

  const getGoogleCalendarUrl = () => {
    if (!event.date) return null;
    const title = encodeURIComponent(event.title || "MEC Computer Club Event");
    const details = encodeURIComponent(
      `${event.description || ""}\n\nEvent Link: ${typeof window !== "undefined" ? window.location.href : ""}`
    );
    const location = encodeURIComponent(event.location || "MEC Campus");

    // Format dates for Google Calendar (YYYYMMDD)
    const cleanDate = event.date.replace(/-/g, "");
    let dates = `${cleanDate}/${cleanDate}`;
    if (event.endDate) {
      const cleanEndDate = event.endDate.replace(/-/g, "");
      dates = `${cleanDate}/${cleanEndDate}`;
    }

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  };

  const formattedDate = event.date
    ? new Date(event.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const currentHref = typeof window !== "undefined" ? window.location.href : "";
  const currentUrlEncoded = encodeURIComponent(currentHref);

  const richWhatsAppMessage = [
    `*${event.title}*`,
    formattedDate ? `📅 Date: ${formattedDate}${event.time ? ` (${event.time})` : ""}` : "",
    event.location ? `📍 Venue: ${event.location}` : "",
    event.registrationFee !== undefined ? `💳 Fee: ${event.registrationFee === 0 ? "Free" : `৳${event.registrationFee}`}` : "",
    registrationUrl ? `\n📝 Register here: ${registrationUrl}` : "",
    `\n🔗 View Event: ${currentHref}`,
    `\nOrganized by MEC Computer Club 🚀`,
  ]
    .filter(Boolean)
    .join("\n");

  const shareLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(richWhatsAppMessage)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${currentUrlEncoded}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${currentUrlEncoded}`,
  };

  const handleShareClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string, title: string) => {
    // If on a mobile device or small screen, let the browser handle it as a standard link (_blank) or app deep link
    const isMobile =
      typeof window !== "undefined" &&
      (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        window.innerWidth < 768);

    if (isMobile) {
      // Allow default link behavior (opens app or new tab cleanly without popup blocker)
      return;
    }

    // On desktop, open a nice centered popup dialog
    e.preventDefault();
    const width = 640;
    const height = 580;
    const left = Math.max(0, (window.innerWidth - width) / 2 + window.screenX);
    const top = Math.max(0, (window.innerHeight - height) / 2 + window.screenY);
    window.open(
      url,
      title,
      `width=${width},height=${height},left=${left},top=${top},toolbar=0,menubar=0,location=0,status=0,scrollbars=1,resizable=1`
    );
  };

  const calUrl = getGoogleCalendarUrl();

  return (
    <div className="space-y-6">
      {/* Quick Actions & Calendar Card */}
      <div className="p-5 sm:p-6 bg-surface-elevated rounded-2xl border-2 border-border-brutalist shadow-[4px_4px_0px_var(--border-brutalist)] space-y-4">
        <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
          <CalendarPlus size={18} className="text-accent-primary" /> Event Actions
        </h3>

        <div className="space-y-2.5">
          {calUrl && (
            <a
              href={calUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border-default bg-surface-secondary text-text-primary font-bold text-xs hover:border-accent-primary hover:text-accent-primary transition shadow-2xs"
            >
              <CalendarPlus size={15} />
              <span>Add to Google Calendar</span>
              <ExternalLink size={12} className="opacity-60" />
            </a>
          )}

          <button
            type="button"
            onClick={handleCopyLink}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border-default bg-surface-secondary text-text-primary font-bold text-xs hover:border-accent-primary hover:text-accent-primary transition shadow-2xs cursor-pointer"
          >
            {copied ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
            <span>{copied ? "Link Copied!" : "Copy Event Link"}</span>
          </button>

          {/* Copy Registration Link if one is associated */}
          {registrationUrl && (
            <button
              type="button"
              onClick={handleCopyRegistrationLink}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border-default bg-surface-secondary text-text-primary font-bold text-xs hover:border-accent-primary hover:text-accent-primary transition shadow-2xs cursor-pointer"
            >
              {regCopied ? <Check size={15} className="text-emerald-500" /> : <ClipboardList size={15} />}
              <span>{regCopied ? "Registration Link Copied!" : "Copy Registration Link"}</span>
            </button>
          )}
        </div>

        {/* Share buttons */}
        <div className="pt-3 border-t border-border-default">
          <p className="text-[11px] font-mono text-text-tertiary uppercase tracking-wider mb-2 font-bold flex items-center gap-1.5">
            <Share2 size={12} /> Share with Friends
          </p>
          <div className="grid grid-cols-3 gap-2">
            <a
              href={shareLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => handleShareClick(e, shareLinks.whatsapp, "Share on WhatsApp")}
              className="px-2 py-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[11px] text-center border border-emerald-500/30 hover:bg-emerald-500/20 transition cursor-pointer flex items-center justify-center no-underline"
              title="Share formatted event info to WhatsApp"
            >
              WhatsApp
            </a>
            <a
              href={shareLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => handleShareClick(e, shareLinks.facebook, "Share on Facebook")}
              className="px-2 py-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-[11px] text-center border border-blue-500/30 hover:bg-blue-500/20 transition cursor-pointer flex items-center justify-center no-underline"
              title="Share event link to Facebook"
            >
              Facebook
            </a>
            <a
              href={shareLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => handleShareClick(e, shareLinks.linkedin, "Share on LinkedIn")}
              className="px-2 py-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-[11px] text-center border border-indigo-500/30 hover:bg-indigo-500/20 transition cursor-pointer flex items-center justify-center no-underline"
              title="Share event link to LinkedIn"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      {/* Host / Organizer Card */}
      <div className="p-5 sm:p-6 bg-surface-elevated rounded-2xl border-2 border-border-brutalist shadow-[4px_4px_0px_var(--border-brutalist)]">
        <h3 className="text-base font-bold text-text-primary mb-3 flex items-center gap-2">
          <Building size={18} className="text-accent-primary" /> Organized By
        </h3>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-primary/10 border border-accent-primary/30 flex items-center justify-center font-black text-sm text-accent-primary shrink-0">
            MEC
          </div>
          <div>
            <h4 className="font-bold text-sm text-text-primary">MEC Computer Club</h4>
            <p className="text-xs text-text-secondary">
              {event.department && event.department !== "General"
                ? `${event.department} Wing`
                : "Official Student Community"}
            </p>
          </div>
        </div>
        <p className="text-xs text-text-tertiary mt-3 leading-relaxed">
          Questions or inquiries regarding this event? Reach out to club executives or via official social channels.
        </p>
      </div>
    </div>
  );
}
