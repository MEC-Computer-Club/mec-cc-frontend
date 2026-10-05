import { Event } from "@/types";
import { API_BASE_URL } from "@/lib/api";

const API_URL = API_BASE_URL;

export function isEventOngoing(e: any): boolean {
  if (!e) return false;
  const status = (e.status || "").toLowerCase();
  return status === "ongoing";
}

export function isEventUpcoming(e: any): boolean {
  if (!e) return false;
  const status = (e.status || "").toLowerCase();
  if (status === "ongoing" || status === "completed" || status === "past" || status === "cancelled") {
    return false;
  }
  if (status === "upcoming" || status === "scheduled") {
    return true;
  }
  if (!e.date || e.date === "TBA") return true;
  const d = new Date(e.date);
  if (isNaN(d.getTime())) return true;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d >= today;
}

export function isEventCompleted(e: any): boolean {
  if (!e) return false;
  const status = (e.status || "").toLowerCase();
  if (status === "completed" || status === "past") {
    return true;
  }
  if (status === "upcoming" || status === "scheduled" || status === "ongoing") {
    return false;
  }
  if (!e.date || e.date === "TBA") return false;
  const d = new Date(e.date);
  if (isNaN(d.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d < today;
}

export function isEventPast(e: any): boolean {
  return isEventCompleted(e);
}

function mapBackendEvent(e: any): Event {
  const eventDate = e.date ? new Date(e.date) : null;
  const isDateValid = eventDate && !isNaN(eventDate.getTime());
  
  const rawStatus = (e.status || "").toLowerCase();
  let mappedStatus: Event["status"] = "scheduled";
  if (rawStatus === "ongoing") {
    mappedStatus = "ongoing";
  } else if (rawStatus === "completed" || rawStatus === "past") {
    mappedStatus = "completed";
  } else if (rawStatus === "cancelled") {
    mappedStatus = "cancelled";
  } else if (rawStatus === "postponed") {
    mappedStatus = "postponed";
  } else if (rawStatus === "scheduled" || rawStatus === "upcoming") {
    mappedStatus = "scheduled";
  } else {
    mappedStatus = isEventUpcoming(e) ? "scheduled" : "completed";
  }

  return {
    id: e._id ? String(e._id) : String(e.id),
    slug: e.slug || (e._id ? String(e._id) : String(e.id)),
    title: e.title,
    description: e.description || "",
    longDescription: e.longDescription || e.description || "",
    date: isDateValid ? eventDate.toISOString().split("T")[0] : (e.date || "TBA"),
    endDate: e.endDate ? new Date(e.endDate).toISOString().split("T")[0] : undefined,
    time: e.eventTime || e.time || "15:00 - 17:00",
    location: e.location || "MEC Campus",
    onlineLink: e.onlineLink || undefined,
    type: e.category || e.type || "workshop",
    department: e.department || "General",
    image: e.coverImageUrl || e.bannerImageUrl || undefined,
    coverImageUrl: e.coverImageUrl || undefined,
    bannerImageUrl: e.bannerImageUrl || undefined,
    coverImagePosition: e.coverImagePosition || "50% 50%",
    bannerImagePosition: e.bannerImagePosition || "50% 50%",
    speakers: e.organizer ? [e.organizer] : (e.speakers || []),
    status: mappedStatus,
    registrationUrl: e.registrationLink || e.registrationUrl || undefined,
    registrationType: e.registrationType || "individual",
    teamSize: e.teamSize || { min: 1, max: 4 },
    registrationDeadline: e.registrationDeadline ? new Date(e.registrationDeadline).toISOString() : undefined,
    registrationFee: e.registrationFee ?? 0,
    maxParticipants: e.maxParticipants,
    prizePool: e.prizePool,
    rewards: e.rewards || [],
    schedule: e.schedule || [],
    rules: e.rules || [],
    sponsors: e.eventSponsors || [],
    customHtmlSection: e.customHtmlSection,
    attendeeCount: e.participants?.length ?? (Array.isArray(e.attendees) ? e.attendees.length : (typeof e.attendeeCount === "number" ? e.attendeeCount : 0)),
    registeredCount: typeof e.registeredCount === "number" ? e.registeredCount : undefined,
    approvedCount: typeof e.approvedCount === "number"
      ? e.approvedCount
      : (Array.isArray(e.approvedParticipants) && e.approvedParticipants.length > 0
          ? e.approvedParticipants.length
          : (Array.isArray(e.attendees) ? e.attendees.length : (typeof e.attendeeCount === "number" ? e.attendeeCount : 0))),
    pendingCount: typeof e.pendingCount === "number"
      ? e.pendingCount
      : (Array.isArray(e.pendingParticipants) ? e.pendingParticipants.length : 0),
    tags: e.tags || [],
    linkedForm: e.linkedForm?.code || (e.linkedForm?._id ? String(e.linkedForm._id) : (e.linkedForm ? String(e.linkedForm) : (e.forms && e.forms[0]?.code ? String(e.forms[0].code) : (e.forms && e.forms[0]?._id ? String(e.forms[0]._id) : (e.forms && e.forms[0] ? String(e.forms[0]) : undefined))))),
    isFormClosed: Boolean(e.isFormClosed),
    providesCertificate: Boolean(e.providesCertificate),
    media: Array.isArray(e.media) ? e.media : [],
    allowParticipationClaims: Boolean(e.allowParticipationClaims),
    participationClaims: Array.isArray(e.participationClaims) ? e.participationClaims : [],
    contributors: Array.isArray(e.contributors) ? e.contributors : [],
    organizer: e.organizer || "MEC Computer Club",
    organizerType: e.organizerType || (e.organizer && e.organizer !== "MEC Computer Club" ? "other" : "mec_cc"),
    organizerLogoUrl: e.organizerLogoUrl || undefined,
    contactEmail: e.contactEmail || undefined,
    contactPhone: e.contactPhone || undefined,
  };
}

/**
 * Safely parse an event's date into an epoch millisecond timestamp.
 * Returns null if the date is missing, "TBA", or invalid.
 */
export function getEventDateTimestamp(e: { date?: string }): number | null {
  if (!e || !e.date || e.date === "TBA") return null;
  const time = new Date(e.date).getTime();
  if (!isNaN(time)) return time;
  const parsed = Date.parse(e.date);
  return isNaN(parsed) ? null : parsed;
}

/**
 * Sorts upcoming events in ascending chronological order (soonest upcoming event first).
 * Events with TBA or unparseable dates are placed at the end.
 */
export function sortUpcomingEvents(eventsList: Event[]): Event[] {
  return [...eventsList].sort((a, b) => {
    const tA = getEventDateTimestamp(a);
    const tB = getEventDateTimestamp(b);
    if (tA === null && tB === null) return 0;
    if (tA === null) return 1;
    if (tB === null) return -1;
    return tA - tB;
  });
}

/**
 * Sorts past events in descending chronological order (most recent past event first).
 * Events with TBA or unparseable dates are placed at the end.
 */
export function sortPastEvents(eventsList: Event[]): Event[] {
  return [...eventsList].sort((a, b) => {
    const tA = getEventDateTimestamp(a);
    const tB = getEventDateTimestamp(b);
    if (tA === null && tB === null) return 0;
    if (tA === null) return 1;
    if (tB === null) return -1;
    return tB - tA;
  });
}

export async function getOngoingEvents(): Promise<Event[]> {
  try {
    const res = await fetch(`${API_URL}/api/events?sort=asc`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      const backendEvents: any[] = data.data || data.events || [];
      if (backendEvents && backendEvents.length > 0) {
        const publishedOnly = backendEvents.filter((e) => e.isPublished !== false);
        const mapped = publishedOnly.map(mapBackendEvent);
        return sortUpcomingEvents(mapped.filter(isEventOngoing));
      }
    }
  } catch (err) {
    console.warn("Could not fetch backend ongoing events:", err);
  }
  return [];
}

export async function getUpcomingEvents(): Promise<Event[]> {
  try {
    const res = await fetch(`${API_URL}/api/events?sort=asc`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      const backendEvents: any[] = data.data || data.events || [];
      if (backendEvents && backendEvents.length > 0) {
        const publishedOnly = backendEvents.filter((e) => e.isPublished !== false);
        const mapped = publishedOnly.map(mapBackendEvent);
        return sortUpcomingEvents(mapped.filter(isEventUpcoming));
      }
    }
  } catch (err) {
    console.warn("Could not fetch backend events:", err);
  }
  return [];
}

export async function getPastEvents(): Promise<Event[]> {
  try {
    const res = await fetch(`${API_URL}/api/events?sort=desc`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      const backendEvents: any[] = data.data || data.events || [];
      if (backendEvents && backendEvents.length > 0) {
        const publishedOnly = backendEvents.filter((e) => e.isPublished !== false);
        const mapped = publishedOnly.map(mapBackendEvent);
        return sortPastEvents(mapped.filter(isEventCompleted));
      }
    }
  } catch (err) {
    console.warn("Could not fetch backend events:", err);
  }
  return [];
}

export const getCompletedEvents = getPastEvents;

export async function getHomeEvents(limit = 5): Promise<Event[]> {
  try {
    const res = await fetch(`${API_URL}/api/events`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      const backendEvents: any[] = data.data || data.events || [];
      if (backendEvents && backendEvents.length > 0) {
        const publishedOnly = backendEvents.filter((e) => e.isPublished !== false);
        const mapped = publishedOnly.map(mapBackendEvent);
        const ongoing = sortUpcomingEvents(mapped.filter(isEventOngoing));
        const upcoming = sortUpcomingEvents(mapped.filter(isEventUpcoming));
        const past = sortPastEvents(mapped.filter(isEventCompleted));
        return [...ongoing, ...upcoming, ...past].slice(0, limit);
      }
    }
  } catch (err) {
    console.warn("Could not fetch backend events for home:", err);
  }
  return [];
}

export async function getEventBySlug(slug: string): Promise<Event | undefined> {
  try {
    const res = await fetch(`${API_URL}/api/events/${slug}`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data && data.data) {
        return mapBackendEvent(data.data);
      }
    }
  } catch {
    // Ignore
  }
  return undefined;
}
