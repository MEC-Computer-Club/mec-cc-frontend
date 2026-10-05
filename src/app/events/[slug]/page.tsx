export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getEventBySlug } from "@/lib/api/events";
import { parseImagePosition } from "@/lib/imagePosition";
import { EventRegisterButton } from "./EventRegisterButton";
import { EventParticipationClaim } from "./EventParticipationClaim";
import { EventMediaGallery } from "./EventMediaGallery";
import { EventShareSidebar } from "./EventShareSidebar";
import { EventAdminToolbar } from "./EventAdminToolbar";
import { EventHeroBanner } from "./EventHeroBanner";
import { MecLogoIcon } from "@/components/ui/MecLogoIcon";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Trophy,
  Gift,
  Building2,
  FileText,
  CheckCircle2,
  Gamepad2,
  ShieldCheck,
  Award,
  Sparkles,
  Ticket,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

function formatEventDeadline(dStr: string) {
  const d = new Date(dStr);
  if (isNaN(d.getTime())) return dStr;
  const hasTime = dStr.includes("T") && !dStr.endsWith("T00:00:00.000Z");
  if (hasTime) {
    return (
      d.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZone: "Asia/Dhaka",
      }) + " (BST)"
    );
  }
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: "Event Not Found" };

  const eventTitle = `${event.title} | MEC Computer Club`;
  const eventDescription =
    event.description ||
    `Join ${event.title} organized by MEC Computer Club, Mymensingh Engineering College.`;

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://meccomputerclub.org");

  const pageUrl = `${baseUrl.replace(/\/+$/, "")}/events/${event.slug || slug}`;

  const rawImage = event.coverImageUrl || event.bannerImageUrl || event.image || "/mec-club-photo.jpg";
  const ogImageUrl = rawImage.startsWith("http://") || rawImage.startsWith("https://")
    ? rawImage
    : `${baseUrl.replace(/\/+$/, "")}${rawImage.startsWith("/") ? rawImage : `/${rawImage}`}`;

  return {
    title: eventTitle,
    description: eventDescription,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: event.title,
      description: eventDescription,
      url: pageUrl,
      siteName: "MEC Computer Club",
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: event.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description: eventDescription,
      images: [ogImageUrl],
    },
  };
}

export default async function EventDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }> | { [key: string]: string | string[] | undefined };
}) {
  const { slug } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const success = resolvedSearchParams.success;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const isTeam = event.registrationType === "team" || event.type === "gaming";

  const isMecClub =
    !event.organizerType ||
    event.organizerType === "mec_cc" ||
    event.organizer === "MEC Computer Club" ||
    !event.organizer;

  const registeredCount = typeof event.registeredCount === "number" ? event.registeredCount : 0;
  const maxLimit = typeof event.maxParticipants === "number" && event.maxParticipants > 0 ? event.maxParticipants : null;
  const percentFilled = maxLimit ? Math.min(100, Math.round((registeredCount / maxLimit) * 100)) : null;

  return (
    <article className="py-8 md:py-14 min-h-screen bg-surface-primary">
      <div className="container max-w-[var(--max-width)] mx-auto px-4 sm:px-6 md:px-8 space-y-8 md:space-y-10">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-text-tertiary">
          <Link href="/" className="hover:text-text-primary transition">Home</Link>
          <ChevronRight size={13} className="opacity-50" />
          <Link href="/events" className="hover:text-text-primary transition">Events</Link>
          <ChevronRight size={13} className="opacity-50" />
          <span className="text-text-secondary truncate max-w-[200px] sm:max-w-md">{event.title}</span>
        </nav>

        {/* Success Alert if routed back */}
        {success === "true" && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-700 dark:text-emerald-300 text-sm font-semibold flex items-center justify-center gap-2 shadow-xs">
            <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
            <span>Registration Successful! Your entry has been submitted for approval.</span>
          </div>
        )}

        {/* Admin & Moderator Direct Dashboard Access */}
        <EventAdminToolbar event={event} />

        {/* ── 1. Hero Showcase Container (High-Res Banner & Lightbox) ── */}
        <div className="rounded-3xl border border-border-default/70 bg-surface-elevated overflow-hidden shadow-sm">
          <EventHeroBanner event={event} />

          {/* ── Event Title & Core Header Info ── */}
          <div className="p-6 sm:p-8 md:p-10 space-y-6">
            
            {/* Organizer Pill & Department Tag */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-surface-secondary/80 border border-border-default/80 shadow-2xs">
                {isMecClub ? (
                  <>
                    <div className="w-5 h-5 relative shrink-0 flex items-center justify-center">
                      <MecLogoIcon size={20} />
                    </div>
                    <span className="font-semibold text-xs text-text-primary">MEC Computer Club</span>
                    <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                  </>
                ) : (
                  <>
                    {event.organizerLogoUrl ? (
                      <img
                        src={event.organizerLogoUrl}
                        alt={event.organizer || "Organizer"}
                        className="w-5 h-5 rounded-md object-contain shrink-0"
                      />
                    ) : (
                      <Building2 size={14} className="text-accent-primary shrink-0" />
                    )}
                    <span className="font-semibold text-xs text-text-primary">
                      {event.organizer || "External Partner"}
                    </span>
                  </>
                )}
              </div>

              {event.department && event.department !== "General" && (
                <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-lg bg-surface-secondary text-text-secondary border border-border-default/60">
                  {event.department} Wing
                </span>
              )}
            </div>

            {/* Event Title */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-text-primary leading-[1.18]">
              {event.title}
            </h1>

            {/* ── Unified Modern Metadata Ribbon (Replaced harsh chunky boxes) ── */}
            <div className="rounded-2xl bg-surface-secondary/70 border border-border-default/80 p-4 sm:p-5 shadow-2xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-border-default/60">
                
                {/* 1. Date & Time */}
                <div className="flex flex-col gap-1.5 sm:pr-4">
                  <span className="font-mono text-[11px] text-text-tertiary uppercase tracking-wider font-bold flex items-center gap-1.5">
                    <Calendar size={14} className="text-accent-primary" /> Schedule
                  </span>
                  <div className="text-sm font-semibold text-text-primary">{formattedDate}</div>
                  <div className="text-xs text-text-secondary flex items-center gap-1">
                    <Clock size={12} className="text-text-tertiary" /> {event.time}
                  </div>
                </div>

                {/* 2. Venue / Location */}
                <div className="flex flex-col gap-1.5 pt-3 sm:pt-0 sm:px-4">
                  <span className="font-mono text-[11px] text-text-tertiary uppercase tracking-wider font-bold flex items-center gap-1.5">
                    <MapPin size={14} className="text-accent-primary" /> Location &amp; Venue
                  </span>
                  <div className="text-sm font-semibold text-text-primary truncate" title={event.location}>
                    {event.location}
                  </div>
                  {event.onlineLink ? (
                    <a
                      href={event.onlineLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-accent-primary hover:underline flex items-center gap-1"
                    >
                      <span>Join Virtual Room</span>
                      <ExternalLink size={11} />
                    </a>
                  ) : (
                    <span className="text-xs text-text-tertiary font-mono">In-Person Session</span>
                  )}
                </div>

                {/* 3. Registration Capacity & Numbers */}
                <div className="flex flex-col gap-1.5 pt-3 sm:pt-0 sm:px-4">
                  <span className="font-mono text-[11px] text-text-tertiary uppercase tracking-wider font-bold flex items-center gap-1.5">
                    <Users size={14} className="text-accent-primary" /> Participation &amp; Limit
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-text-primary">
                      {registeredCount} Registered
                    </span>
                    {maxLimit && (
                      <span className="text-xs font-mono text-text-tertiary">
                        / {maxLimit} Limit
                      </span>
                    )}
                  </div>
                  {maxLimit ? (
                    <div className="space-y-1">
                      <div className="w-full h-1.5 rounded-full bg-surface-primary overflow-hidden border border-border-default/40">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            percentFilled! >= 100
                              ? "bg-amber-500"
                              : percentFilled! >= 80
                              ? "bg-accent-primary"
                              : "bg-emerald-500"
                          }`}
                          style={{ width: `${percentFilled}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-text-secondary block">
                        {maxLimit - registeredCount > 0
                          ? `${maxLimit - registeredCount} seats available`
                          : "Event at maximum capacity"}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-text-secondary">
                      {event.status === "completed" || event.status === "past"
                        ? `${event.approvedCount || event.attendeeCount || 0} Attended`
                        : "Open capacity &bull; No cap"}
                    </span>
                  )}
                </div>

                {/* 4. Entry Fee & Format */}
                <div className="flex flex-col gap-1.5 pt-3 sm:pt-0 sm:pl-4">
                  <span className="font-mono text-[11px] text-text-tertiary uppercase tracking-wider font-bold flex items-center gap-1.5">
                    <Ticket size={14} className="text-accent-primary" /> Entry Fee &amp; Mode
                  </span>
                  <div className="text-sm font-semibold text-text-primary">
                    {event.registrationFee ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
                        {event.registrationFee} BDT
                      </span>
                    ) : (
                      <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
                        Free Registration
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-text-secondary">
                    {isTeam
                      ? `Squad Mode (${event.teamSize?.min || 1}-${event.teamSize?.max || 4} Members)`
                      : "Individual Participation"}
                  </div>
                </div>

              </div>
            </div>

            {/* ── Registration Call To Action Bar ── */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border-default/60">
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-text-secondary">
                {event.registrationDeadline && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-secondary border border-border-default/60">
                    <span className="text-text-tertiary">Deadline:</span>
                    <strong className="text-text-primary">{formatEventDeadline(event.registrationDeadline)}</strong>
                  </div>
                )}
                {maxLimit && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-secondary border border-border-default/60">
                    <span className="text-text-tertiary">Max Cap:</span>
                    <strong className="text-text-primary">{maxLimit} Seats</strong>
                  </div>
                )}
              </div>

              <div>
                {event.status === "upcoming" || event.status === "scheduled" || event.status === "ongoing" ? (
                  <EventRegisterButton event={event} />
                ) : (
                  <EventParticipationClaim event={event} />
                )}
              </div>
            </div>

          </div>
        </div>

        {/* ── 2. Two-Column Details & Schedule ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* About this Event Card */}
            <section className="p-6 sm:p-8 bg-surface-elevated rounded-3xl border border-border-default/70 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-border-default/60">
                <h2 className="text-xl sm:text-2xl font-bold text-text-primary flex items-center gap-2.5">
                  <FileText size={22} className="text-accent-primary" /> About this Event
                </h2>
                {event.type && (
                  <span className="text-xs font-mono font-bold uppercase px-3 py-1 rounded-full bg-surface-secondary text-text-secondary border border-border-default/50">
                    {event.type}
                  </span>
                )}
              </div>

              {(() => {
                const content = event.longDescription || event.description || "";
                const isHtml = /<[a-z][\s\S]*>/i.test(content);
                if (isHtml) {
                  return (
                    <div
                      className="prose prose-slate dark:prose-invert max-w-none text-text-secondary leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  );
                }
                return (
                  <div className="text-base leading-relaxed text-text-secondary whitespace-pre-line space-y-4">
                    {content}
                  </div>
                );
              })()}

              {event.tags && event.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-4 border-t border-border-default/60">
                  {event.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-xs py-1 px-3 bg-surface-secondary border border-border-default/60 rounded-full text-text-secondary hover:text-text-primary transition"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </section>

            {/* Rules & Guidelines Card */}
            {event.rules && event.rules.length > 0 && (
              <section className="p-6 sm:p-8 bg-surface-elevated rounded-3xl border border-border-default/70 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-border-default/60">
                  <h2 className="text-xl sm:text-2xl font-bold text-text-primary flex items-center gap-2.5">
                    <ShieldCheck size={22} className="text-accent-primary" /> Guidelines &amp; Code of Conduct
                  </h2>
                </div>
                <div className="space-y-3">
                  {event.rules.map((rule, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-secondary/50 border border-border-default/50">
                      <CheckCircle2 size={17} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-sm leading-relaxed text-text-secondary">{rule}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Rewards & Prizes Section */}
            {((event.rewards && event.rewards.length > 0) || event.prizePool) && (
              <section className="p-6 sm:p-8 bg-surface-elevated rounded-3xl border border-border-default/70 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-border-default/60">
                  <h2 className="text-xl sm:text-2xl font-bold text-text-primary flex items-center gap-2.5">
                    <Trophy size={22} className="text-amber-500" /> Rewards &amp; Podium
                  </h2>
                  {event.prizePool && (
                    <span className="font-mono font-bold text-xs px-3.5 py-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25 rounded-full">
                      Pool: {event.prizePool}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {event.rewards && event.rewards.length > 0 ? (
                    event.rewards.map((r, i) => (
                      <div
                        key={i}
                        className={`p-5 rounded-2xl border text-center transition-all ${
                          i === 0
                            ? "bg-amber-500/10 border-amber-500/40 shadow-xs"
                            : i === 1
                            ? "bg-slate-200/40 dark:bg-slate-800/40 border-slate-300 dark:border-slate-700 shadow-xs"
                            : "bg-orange-500/10 border-orange-500/40 shadow-xs"
                        }`}
                      >
                        <div className="w-11 h-11 rounded-full flex items-center justify-center mx-auto mb-2 text-xl font-black bg-surface-elevated shadow-xs border border-border-default/50">
                          {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
                        </div>
                        <h3 className="font-bold text-sm text-text-primary mb-1">{r.position}</h3>
                        <p className="font-mono text-sm font-extrabold text-accent-primary">{r.prize}</p>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 p-6 rounded-2xl bg-surface-secondary/70 border border-border-default/70 text-center">
                      <Gift size={30} className="text-accent-primary mx-auto mb-2" />
                      <p className="font-bold text-text-primary text-base">Prize Pool: {event.prizePool}</p>
                      <p className="text-xs text-text-secondary mt-1 max-w-md mx-auto">
                        Exciting cash rewards, official certificates, and exclusive crests for top performing contenders!
                      </p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Event Schedule Timeline */}
            {event.schedule && event.schedule.length > 0 && (
              <section className="p-6 sm:p-8 bg-surface-elevated rounded-3xl border border-border-default/70 shadow-sm space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-border-default/60">
                  <h2 className="text-xl sm:text-2xl font-bold text-text-primary flex items-center gap-2.5">
                    <Clock size={22} className="text-accent-primary" /> Session Timeline
                  </h2>
                </div>
                <div className="relative border-l-2 border-border-default/80 ml-3 sm:ml-4 space-y-6">
                  {event.schedule.map((item, idx) => (
                    <div key={idx} className="relative pl-6 sm:pl-8">
                      <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-accent-primary border-2 border-surface-elevated shadow-xs" />
                      <span className="inline-block px-2.5 py-0.5 rounded-md bg-surface-secondary text-text-secondary font-mono text-xs font-bold mb-1 border border-border-default/50">
                        {item.time}
                      </span>
                      <h3 className="text-base font-bold text-text-primary">{item.title}</h3>
                      {item.description && (
                        <p className="text-sm text-text-secondary mt-1">{item.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Custom HTML Section (if present) */}
            {event.customHtmlSection && (
              <section className="p-6 sm:p-8 bg-surface-elevated rounded-3xl border border-border-default/70 shadow-sm space-y-4">
                <h2 className="text-xl font-bold text-text-primary">Event Updates &amp; Highlights</h2>
                <div
                  className="prose dark:prose-invert max-w-none text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: event.customHtmlSection }}
                />
              </section>
            )}

            {/* Event Media Gallery (Photos & Videos) */}
            {event.media && event.media.length > 0 && (
              <EventMediaGallery media={event.media} eventTitle={event.title} />
            )}
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6 lg:sticky lg:top-24 h-fit">
            
            {/* Quick Actions & Calendar / Share Card */}
            <EventShareSidebar event={event} />

            {/* Event Contributors & Organizing Team */}
            {event.contributors && event.contributors.length > 0 && (
              <div className="p-5 sm:p-6 bg-surface-elevated/90 backdrop-blur-sm rounded-2xl border border-border-default/80 shadow-xs space-y-4">
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-text-tertiary flex items-center gap-1.5">
                  <Users size={14} className="text-accent-primary" /> Organizing Crew
                </h2>
                <div className="space-y-2.5">
                  {event.contributors.map((contrib, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-surface-secondary/70 rounded-xl border border-border-default/50 flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center font-bold text-xs text-accent-primary shrink-0">
                        {contrib.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-text-primary truncate">{contrib.name}</p>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="inline-block text-[11px] font-semibold text-accent-primary">
                            {contrib.role}
                          </span>
                          {contrib.department && (
                            <>
                              <span className="text-text-tertiary text-[10px]">&bull;</span>
                              <span className="text-[11px] text-text-secondary truncate">
                                {contrib.department}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Event Sponsors & Partners */}
            {event.sponsors && event.sponsors.length > 0 && (
              <div className="p-5 sm:p-6 bg-surface-elevated/90 backdrop-blur-sm rounded-2xl border border-border-default/80 shadow-xs space-y-4">
                <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-text-tertiary flex items-center gap-1.5">
                  <Building2 size={14} className="text-accent-primary" /> Sponsors &amp; Partners
                </h2>
                <div className="space-y-2.5">
                  {event.sponsors.map((s, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-surface-secondary/70 rounded-xl border border-border-default/50 flex items-center gap-3"
                    >
                      {s.logoUrl ? (
                        <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-white border border-border-default/60 shrink-0">
                          <Image src={s.logoUrl} alt={s.sponsorName} fill className="object-contain p-1" unoptimized />
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-surface-elevated border border-border-default/60 flex items-center justify-center font-bold text-xs text-text-secondary shrink-0">
                          {s.sponsorName.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-bold text-sm text-text-primary truncate">{s.sponsorName}</p>
                        <span className="inline-block text-[10px] font-mono uppercase font-bold text-accent-primary">
                          {s.tier || "Partner"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certificate Notice */}
            {event.providesCertificate && (
              <div className="p-5 bg-surface-secondary/70 rounded-2xl border border-border-default/70 text-xs text-text-secondary space-y-2 shadow-2xs">
                <div className="flex items-center gap-2 text-text-primary font-bold">
                  <Award size={16} className="text-accent-primary" /> Verified Credentials
                </div>
                <p className="leading-relaxed">
                  All approved attendees and podium finishers receive official, verifiable digital certificates from MEC Computer Club.
                </p>
              </div>
            )}

          </div>
        </div>

        {/* Back Link */}
        <div className="pt-6 border-t border-border-default/60">
          <Button href="/events" variant="ghost" className="rounded-xl">
            &larr; Back to all events
          </Button>
        </div>
      </div>
    </article>
  );
}
