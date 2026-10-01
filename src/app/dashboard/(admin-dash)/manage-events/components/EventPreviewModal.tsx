"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  LayoutGrid,
  FileText,
  Calendar,
  Clock,
  MapPin,
  Users,
  Trophy,
  Gift,
  Gamepad2,
  Move,
  CheckCircle2,
  Tag,
  Share2,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { EventCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface EventPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: {
    title: string;
    description: string;
    longDescription?: string;
    category: string;
    status: string;
    registrationType: string;
    teamSizeMin?: number;
    teamSizeMax?: number;
    date: string;
    endDate?: string;
    eventTime?: string;
    location: string;
    onlineLink?: string;
    registrationLink?: string;
    registrationDeadline?: string;
    maxParticipants?: string | number;
    registrationFee?: string | number;
    coverImageUrl?: string;
    bannerImageUrl?: string;
    coverImagePosition?: string;
    bannerImagePosition?: string;
    organizer?: string;
    contactEmail?: string;
    contactPhone?: string;
    prizePool?: string;
    tags?: string[];
    rewards?: Array<{ position: string; prize: string }>;
    schedule?: Array<{ time: string; title: string; description: string }>;
    rules?: string[];
    contributors?: Array<{ name: string; role: string; department?: string }>;
    customHtmlSection?: string;
    allowParticipationClaims?: boolean;
    linkedForm?: string;
  };
  coverFile?: File | null;
  bannerFile?: File | null;
  onOpenPositioner?: (type: "cover" | "banner") => void;
}

export function EventPreviewModal({
  isOpen,
  onClose,
  event,
  coverFile,
  bannerFile,
  onOpenPositioner,
}: EventPreviewModalProps) {
  const [viewMode, setViewMode] = useState<"card" | "detail">("card");
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);

  // Sync object URLs for local File previews
  useEffect(() => {
    let cUrl: string | null = null;
    let bUrl: string | null = null;

    if (coverFile) {
      cUrl = URL.createObjectURL(coverFile);
      setCoverUrl(cUrl);
    } else {
      setCoverUrl(event.coverImageUrl || null);
    }

    if (bannerFile) {
      bUrl = URL.createObjectURL(bannerFile);
      setBannerUrl(bUrl);
    } else {
      setBannerUrl(event.bannerImageUrl || null);
    }

    return () => {
      if (cUrl) URL.revokeObjectURL(cUrl);
      if (bUrl) URL.revokeObjectURL(bUrl);
    };
  }, [coverFile, bannerFile, event.coverImageUrl, event.bannerImageUrl]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Active cover and banner references
  const effectiveCover = coverUrl || bannerUrl || "";
  const effectiveBanner = bannerUrl || coverUrl || "";

  const isTeam = event.registrationType === "team" || event.category === "gaming";
  const isPast = event.status === "completed" || event.status === "past";

  const formattedDate = event.date
    ? new Date(event.date).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Date to be announced";

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-[99999] flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl bg-surface-elevated border-2 border-border-brutalist dark:border-border-default rounded-2xl shadow-[8px_8px_0px_var(--accent-primary)] flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-border-default bg-surface-secondary/70 shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold">
              <Sparkles size={16} />
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-text-primary">
                Event Live Preview
              </h2>
              <p className="text-[11px] text-text-secondary hidden sm:block">
                See how your event appears on cards and the full detail page with custom image positions.
              </p>
            </div>
          </div>

          {/* Segmented View Switcher */}
          <div className="flex items-center gap-1 p-1 bg-surface-primary border border-border-brutalist dark:border-border-default rounded-xl shadow-xs">
            <button
              type="button"
              onClick={() => setViewMode("card")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === "card"
                  ? "bg-accent-primary text-accent-primary-text shadow-xs"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <LayoutGrid size={13} />
              <span>Card View</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("detail")}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === "detail"
                  ? "bg-accent-primary text-accent-primary-text shadow-xs"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <FileText size={13} />
              <span>Detailed View</span>
            </button>
          </div>

          <button
            type="button"
            className="w-8 h-8 rounded-lg border border-border-default bg-surface-primary text-text-secondary hover:text-text-primary hover:bg-surface-tertiary transition flex items-center justify-center cursor-pointer shrink-0"
            onClick={onClose}
            aria-label="Close Preview"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-surface-primary/50">
          {viewMode === "card" ? (
            /* ══════════════════════════════════════════════════════
               CARD VIEW PREVIEW
               ══════════════════════════════════════════════════════ */
            <div className="flex flex-col items-center justify-center py-6 sm:py-10 space-y-6">
              <div className="text-center max-w-md space-y-1">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Exact Homepage &amp; Events List Card
                </span>
                <p className="text-xs text-text-tertiary">
                  This is the exact component rendered in the Homepage event queue and `/events` directory.
                </p>
              </div>

              {/* Exact EventCard in Container */}
              <div className="w-full max-w-[420px] shadow-sm">
                <EventCard
                  title={event.title || "Sample Event Title (Enter Title in Form)"}
                  description={
                    event.description ||
                    "Event description summary will be displayed here in card preview..."
                  }
                  date={event.date || new Date().toISOString()}
                  time={event.eventTime || "10:00 AM"}
                  location={event.location || "MEC Campus Auditorium"}
                  type={event.category || "workshop"}
                  status={isPast ? "past" : "upcoming"}
                  image={effectiveCover}
                  coverImageUrl={effectiveCover}
                  coverImagePosition={event.coverImagePosition || "50% 50%"}
                  slug="preview"
                  attendeeCount={0}
                  linkedForm={event.linkedForm}
                  registrationUrl={event.registrationLink}
                />
              </div>

              {/* Quick Image Positioning Bar */}
              <div className="w-full max-w-[420px] p-3 rounded-xl border border-border-default bg-surface-secondary/80 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-text-tertiary">Cover Focal:</span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {event.coverImagePosition || "50% 50%"}
                  </span>
                </div>
                {onOpenPositioner && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenPositioner("cover");
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-2xs cursor-pointer"
                  >
                    <Move size={12} />
                    <span>Adjust Cover Position</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* ══════════════════════════════════════════════════════
               DETAILED VIEW PREVIEW
               ══════════════════════════════════════════════════════ */
            <div className="max-w-4xl mx-auto space-y-8 py-2 sm:py-4">
              {/* Quick positioning shortcut for Banner */}
              <div className="p-3 rounded-xl border border-border-default bg-surface-secondary/80 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-text-tertiary">Hero Banner Focal:</span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {event.bannerImagePosition || "50% 50%"}
                  </span>
                </div>
                {onOpenPositioner && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenPositioner("banner");
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-2xs cursor-pointer"
                  >
                    <Move size={12} />
                    <span>Adjust Banner Position</span>
                  </button>
                )}
              </div>

              {/* ── 1. Hero Header Banner ── */}
              <div className="relative rounded-2xl border-2 border-border-brutalist bg-surface-elevated overflow-hidden shadow-[6px_6px_0px_var(--border-brutalist)]">
                {effectiveBanner ? (
                  <div className="relative w-full h-48 sm:h-72 md:h-80 bg-surface-secondary overflow-hidden border-b-2 border-border-brutalist">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={effectiveBanner}
                      alt={event.title || "Banner Preview"}
                      className="w-full h-full object-cover"
                      style={{
                        objectPosition: event.bannerImagePosition || event.coverImagePosition || "50% 50%",
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2 pointer-events-none">
                      <Badge variant={isPast ? "past" : "upcoming"} size="md">
                        {isPast ? "past" : "upcoming"}
                      </Badge>
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-surface-elevated text-text-primary border border-border-default shadow-sm">
                        {event.category || "workshop"}
                      </span>
                      {isTeam && (
                        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-indigo-600 text-white shadow-sm flex items-center gap-1">
                          <Gamepad2 size={13} /> Squad Mode
                        </span>
                      )}
                    </div>

                    {/* Prize Pool Badge */}
                    {event.prizePool && (
                      <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-mono font-black text-sm sm:text-base shadow-[3px_3px_0px_#000] pointer-events-none">
                        <Trophy size={18} />
                        <span>Prize Pool: {event.prizePool}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-36 bg-surface-secondary flex items-center justify-center text-text-tertiary text-xs font-mono border-b-2 border-border-brutalist">
                    No banner or cover image set
                  </div>
                )}

                <div className="p-6 sm:p-8">
                  <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-text-primary mb-4 leading-tight">
                    {event.title || "Your Event Title Will Appear Here"}
                  </h1>

                  {/* Metadata Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-surface-secondary rounded-xl border border-border-default mb-6">
                    <div className="flex flex-col gap-1">
                      <span className="font-mono text-xs text-text-tertiary uppercase tracking-wider font-semibold flex items-center gap-1">
                        <Calendar size={13} className="text-accent-primary" /> Date
                      </span>
                      <span className="font-semibold text-text-primary text-sm truncate">
                        {formattedDate}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-mono text-xs text-text-tertiary uppercase tracking-wider font-semibold flex items-center gap-1">
                        <Clock size={13} className="text-accent-primary" /> Time
                      </span>
                      <span className="font-semibold text-text-primary text-sm truncate">
                        {event.eventTime || "TBA"}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-mono text-xs text-text-tertiary uppercase tracking-wider font-semibold flex items-center gap-1">
                        <MapPin size={13} className="text-accent-primary" /> Location
                      </span>
                      <span className="font-semibold text-text-primary text-sm truncate">
                        {event.location || "MEC Campus"}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-mono text-xs text-text-tertiary uppercase tracking-wider font-semibold flex items-center gap-1">
                        <Users size={13} className="text-accent-primary" /> Format
                      </span>
                      <span className="font-semibold text-text-primary text-sm truncate">
                        {isTeam
                          ? `Team (${event.teamSizeMin || 1}-${event.teamSizeMax || 4} Players)`
                          : "Individual Entry"}
                      </span>
                    </div>
                  </div>

                  {/* Registration CTA Area */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border-default">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-text-secondary">
                        Entry Fee:{" "}
                        <strong className="text-emerald-600 dark:text-emerald-400 font-bold">
                          {event.registrationFee && Number(event.registrationFee) > 0
                            ? `${event.registrationFee} BDT`
                            : "FREE Entry"}
                        </strong>
                      </span>
                      {event.registrationDeadline && (
                        <>
                          <span className="text-text-tertiary">&bull;</span>
                          <span className="font-mono text-xs text-text-secondary">
                            Deadline: <strong>{event.registrationDeadline}</strong>
                          </span>
                        </>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled
                      className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-accent-primary text-accent-primary-text border border-border-brutalist shadow-[2px_2px_0px_var(--border-brutalist)] opacity-85 cursor-default"
                    >
                      {isPast ? "Event Completed" : "Register Now (Live Button)"}
                    </button>
                  </div>
                </div>
              </div>

              {/* ── 2. Details Two-Column Layout ── */}
              <div className="space-y-6">
                {/* Description Card */}
                <div className="p-6 bg-surface-elevated rounded-2xl border-2 border-border-brutalist shadow-[4px_4px_0px_var(--border-brutalist)]">
                  <h3 className="text-lg font-bold text-text-primary mb-3 flex items-center gap-2">
                    <FileText size={18} className="text-accent-primary" /> About this Event
                  </h3>
                  <div className="text-sm leading-relaxed text-text-secondary whitespace-pre-line">
                    {event.description || "Enter event description in the form to preview it here."}
                  </div>

                  {event.tags && event.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-border-default">
                      {event.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-xs py-1 px-3 bg-surface-secondary border border-border-default rounded-full text-text-secondary"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Rewards & Prizes Section */}
                {((event.rewards && event.rewards.length > 0) || event.prizePool) && (
                  <div className="p-6 bg-surface-elevated rounded-2xl border-2 border-border-brutalist shadow-[4px_4px_0px_var(--border-brutalist)]">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                        <Trophy size={18} className="text-amber-500" /> Rewards &amp; Prize Pool
                      </h3>
                      {event.prizePool && (
                        <span className="font-mono font-extrabold text-xs px-3 py-1 bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded-full">
                          Total: {event.prizePool}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {event.rewards && event.rewards.length > 0 ? (
                        event.rewards.map((r, i) => (
                          <div
                            key={i}
                            className={`p-4 rounded-xl border-2 text-center ${
                              i === 0
                                ? "bg-amber-500/10 border-amber-500 shadow-[3px_3px_0px_#F59E0B]"
                                : i === 1
                                ? "bg-slate-200/50 dark:bg-slate-800/50 border-slate-400 shadow-[3px_3px_0px_#94A3B8]"
                                : "bg-orange-500/10 border-orange-400 shadow-[3px_3px_0px_#FB923C]"
                            }`}
                          >
                            <div className="text-xl mb-1">{i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}</div>
                            <h4 className="font-bold text-xs text-text-primary mb-1">
                              {r.position || `Podium #${i + 1}`}
                            </h4>
                            <p className="font-mono text-sm font-extrabold text-accent-primary">
                              {r.prize || "Award & Certificate"}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-3 p-4 rounded-xl bg-surface-secondary border border-border-default text-center">
                          <Gift size={24} className="text-accent-primary mx-auto mb-1" />
                          <p className="font-bold text-text-primary text-sm">Prize Pool: {event.prizePool}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Schedule Timeline */}
                {event.schedule && event.schedule.length > 0 && (
                  <div className="p-6 bg-surface-elevated rounded-2xl border-2 border-border-brutalist shadow-[4px_4px_0px_var(--border-brutalist)]">
                    <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                      <Clock size={18} className="text-teal-500" /> Event Timeline
                    </h3>
                    <div className="space-y-3">
                      {event.schedule.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-4 p-3.5 rounded-xl border border-border-default bg-surface-secondary/50"
                        >
                          <span className="px-2.5 py-1 rounded bg-indigo-50 dark:bg-indigo-950/50 font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 shrink-0">
                            {item.time || "Time"}
                          </span>
                          <div>
                            <h4 className="text-sm font-bold text-text-primary">
                              {item.title || "Session Title"}
                            </h4>
                            {item.description && (
                              <p className="text-xs text-text-secondary mt-0.5">{item.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contributors */}
                {event.contributors && event.contributors.length > 0 && (
                  <div className="p-6 bg-surface-elevated rounded-2xl border-2 border-border-brutalist shadow-[4px_4px_0px_var(--border-brutalist)]">
                    <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                      <Users size={18} className="text-indigo-500" /> Key Organizers &amp; Contributors
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {event.contributors.map((c, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-xl border border-border-default bg-surface-secondary/50 flex items-center gap-3"
                        >
                          <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                            {c.name ? c.name.charAt(0).toUpperCase() : "U"}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-text-primary truncate">
                              {c.name || "Contributor Name"}
                            </h4>
                            <p className="text-[11px] text-text-secondary truncate">
                              {c.role || "Organizer"}
                              {c.department && ` • ${c.department}`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Custom HTML section preview */}
                {event.customHtmlSection && (
                  <div className="p-6 bg-surface-elevated rounded-2xl border-2 border-border-brutalist shadow-[4px_4px_0px_var(--border-brutalist)] space-y-2">
                    <h3 className="text-sm font-bold text-text-tertiary uppercase tracking-wider">
                      Custom HTML Section Preview
                    </h3>
                    <div
                      className="prose dark:prose-invert max-w-none text-xs"
                      dangerouslySetInnerHTML={{ __html: event.customHtmlSection }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-border-default bg-surface-secondary/70 flex items-center justify-between shrink-0">
          <span className="text-xs text-text-tertiary font-mono">
            {viewMode === "card"
              ? "Card Preview: 16:9 Cover"
              : "Detailed View: Full Page Banner & Content"}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-bold text-text-primary bg-surface-elevated border border-border-default hover:bg-surface-secondary transition cursor-pointer"
          >
            Done Previewing
          </button>
        </div>
      </div>
    </div>
  );
}
