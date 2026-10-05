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
  Users,
  CheckCircle2,
  Mail,
  Phone,
} from "lucide-react";
import toast from "react-hot-toast";
import { MecLogoIcon } from "@/components/ui/MecLogoIcon";

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
    `\nOrganized by ${event.organizer || "MEC Computer Club"} 🚀`,
  ]
    .filter(Boolean)
    .join("\n");

  const shareLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(richWhatsAppMessage)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${currentUrlEncoded}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${currentUrlEncoded}`,
  };

  const handleShareClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string, title: string) => {
    const isMobile =
      typeof window !== "undefined" &&
      (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        window.innerWidth < 768);

    if (isMobile) {
      return;
    }

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

  const isMecClub =
    !event.organizerType ||
    event.organizerType === "mec_cc" ||
    event.organizer === "MEC Computer Club" ||
    !event.organizer;

  const registeredCount = typeof event.registeredCount === "number" ? event.registeredCount : 0;
  const maxLimit = typeof event.maxParticipants === "number" && event.maxParticipants > 0 ? event.maxParticipants : null;
  const percentFilled = maxLimit ? Math.min(100, Math.round((registeredCount / maxLimit) * 100)) : null;

  return (
    <div className="space-y-5">
      {/* Registration & Capacity Summary Card */}
      <div className="p-5 sm:p-6 bg-surface-elevated/90 backdrop-blur-sm rounded-2xl border border-border-default/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border-default/60">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-text-tertiary flex items-center gap-1.5">
            <Users size={14} className="text-accent-primary" /> Participation
          </span>
          {event.status === "completed" || event.status === "past" ? (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-500 border border-slate-500/20">
              Completed
            </span>
          ) : (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              {maxLimit && registeredCount >= maxLimit ? "Seats Full" : "Open for Entry"}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-surface-secondary/70 border border-border-default/50">
            <span className="text-[11px] text-text-tertiary font-mono block">Registered</span>
            <span className="text-xl font-extrabold text-text-primary mt-0.5 block">{registeredCount}</span>
          </div>

          <div className="p-3 rounded-xl bg-surface-secondary/70 border border-border-default/50">
            <span className="text-[11px] text-text-tertiary font-mono block">
              {maxLimit ? "Max Capacity" : "Attendees"}
            </span>
            <span className="text-xl font-extrabold text-accent-primary mt-0.5 block">
              {maxLimit ? maxLimit : (event.approvedCount || event.attendeeCount || "Unlimited")}
            </span>
          </div>
        </div>

        {maxLimit !== null && (
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs font-mono text-text-secondary">
              <span>Capacity Progress</span>
              <span className="font-bold text-text-primary">{percentFilled}% ({registeredCount}/{maxLimit})</span>
            </div>
            <div className="w-full h-2 rounded-full bg-surface-secondary overflow-hidden border border-border-default/40">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  percentFilled! >= 100
                    ? "bg-amber-500"
                    : percentFilled! >= 80
                    ? "bg-accent-primary"
                    : "bg-emerald-500"
                }`}
                style={{ width: `${percentFilled}%` }}
              />
            </div>
            <p className="text-[11px] text-text-tertiary">
              {maxLimit - registeredCount > 0
                ? `${maxLimit - registeredCount} seat${maxLimit - registeredCount === 1 ? "" : "s"} remaining`
                : "Maximum capacity reached"}
            </p>
          </div>
        )}
      </div>

      {/* Quick Actions & Calendar Card */}
      <div className="p-5 sm:p-6 bg-surface-elevated/90 backdrop-blur-sm rounded-2xl border border-border-default/80 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-text-primary flex items-center gap-2 uppercase font-mono tracking-wider">
          <CalendarPlus size={16} className="text-accent-primary" /> Event Actions
        </h3>

        <div className="space-y-2.5">
          {calUrl && (
            <a
              href={calUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border-default bg-surface-secondary/70 text-text-primary font-semibold text-xs hover:border-accent-primary hover:text-accent-primary transition shadow-2xs"
            >
              <CalendarPlus size={14} />
              <span>Add to Google Calendar</span>
              <ExternalLink size={12} className="opacity-60" />
            </a>
          )}

          <button
            type="button"
            onClick={handleCopyLink}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border-default bg-surface-secondary/70 text-text-primary font-semibold text-xs hover:border-accent-primary hover:text-accent-primary transition shadow-2xs cursor-pointer"
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            <span>{copied ? "Link Copied!" : "Copy Event Link"}</span>
          </button>

          {registrationUrl && (
            <button
              type="button"
              onClick={handleCopyRegistrationLink}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border-default bg-surface-secondary/70 text-text-primary font-semibold text-xs hover:border-accent-primary hover:text-accent-primary transition shadow-2xs cursor-pointer"
            >
              {regCopied ? <Check size={14} className="text-emerald-500" /> : <ClipboardList size={14} />}
              <span>{regCopied ? "Registration Link Copied!" : "Copy Registration Link"}</span>
            </button>
          )}
        </div>

        {/* Share buttons */}
        <div className="pt-3 border-t border-border-default/60">
          <p className="text-[11px] font-mono text-text-tertiary uppercase tracking-wider mb-2.5 font-bold flex items-center gap-1.5">
            <Share2 size={12} /> Share with Friends
          </p>
          <div className="grid grid-cols-3 gap-2">
            <a
              href={shareLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => handleShareClick(e, shareLinks.whatsapp, "Share on WhatsApp")}
              className="px-2 py-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[11px] text-center border border-emerald-500/25 hover:bg-emerald-500/20 transition cursor-pointer flex items-center justify-center no-underline"
              title="Share formatted event info to WhatsApp"
            >
              WhatsApp
            </a>
            <a
              href={shareLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => handleShareClick(e, shareLinks.facebook, "Share on Facebook")}
              className="px-2 py-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-[11px] text-center border border-blue-500/25 hover:bg-blue-500/20 transition cursor-pointer flex items-center justify-center no-underline"
              title="Share event link to Facebook"
            >
              Facebook
            </a>
            <a
              href={shareLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => handleShareClick(e, shareLinks.linkedin, "Share on LinkedIn")}
              className="px-2 py-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-[11px] text-center border border-indigo-500/25 hover:bg-indigo-500/20 transition cursor-pointer flex items-center justify-center no-underline"
              title="Share event link to LinkedIn"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      {/* Host / Organizer Card */}
      <div className="p-5 sm:p-6 bg-surface-elevated/90 backdrop-blur-sm rounded-2xl border border-border-default/80 shadow-xs">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-text-tertiary mb-3.5 flex items-center gap-1.5">
          <Building size={14} className="text-accent-primary" /> Organized By
        </h3>

        {isMecClub ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-surface-secondary/80 border border-border-default/80 flex items-center justify-center p-1.5 shrink-0 shadow-2xs">
                <MecLogoIcon size={34} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm text-text-primary truncate">MEC Computer Club</h4>
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                </div>
                <p className="text-xs text-text-secondary truncate">
                  {event.department && event.department !== "General"
                    ? `${event.department} Wing`
                    : "Official Student Community"}
                </p>
              </div>
            </div>
            <p className="text-xs text-text-tertiary leading-relaxed">
              Official computing and technology club of Mymensingh Engineering College.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {event.organizerLogoUrl ? (
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-border-default/80 flex items-center justify-center p-1.5 shrink-0 overflow-hidden shadow-2xs">
                  <img
                    src={event.organizerLogoUrl}
                    alt={event.organizer || "Organizer"}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-xl bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center font-black text-sm text-accent-primary shrink-0">
                  {(event.organizer || "OR").slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <h4 className="font-bold text-sm text-text-primary truncate">
                  {event.organizer || "Partner Organization"}
                </h4>
                <p className="text-xs text-text-secondary truncate">
                  External Organizer &bull; Host Partner
                </p>
              </div>
            </div>

            {(event.contactEmail || event.contactPhone) && (
              <div className="pt-2 border-t border-border-default/60 space-y-1 text-xs text-text-secondary">
                {event.contactEmail && (
                  <div className="flex items-center gap-2">
                    <Mail size={13} className="text-text-tertiary shrink-0" />
                    <a href={`mailto:${event.contactEmail}`} className="truncate hover:text-accent-primary">
                      {event.contactEmail}
                    </a>
                  </div>
                )}
                {event.contactPhone && (
                  <div className="flex items-center gap-2">
                    <Phone size={13} className="text-text-tertiary shrink-0" />
                    <a href={`tel:${event.contactPhone}`} className="hover:text-accent-primary">
                      {event.contactPhone}
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
