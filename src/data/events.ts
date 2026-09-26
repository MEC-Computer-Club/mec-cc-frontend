import { Event } from "@/types";
import { API_BASE_URL } from "@/lib/api";

export const events: Event[] = [];

const API_URL = API_BASE_URL;

export function isEventUpcoming(e: any): boolean {
  if (!e) return false;
  const status = (e.status || "").toLowerCase();
  if (status === "completed" || status === "past" || status === "cancelled") {
    return false;
  }
  if (status === "upcoming" || status === "scheduled" || status === "ongoing") {
    return true;
  }
  if (!e.date || e.date === "TBA") return true;
  const d = new Date(e.date);
  if (isNaN(d.getTime())) return true;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d >= today;
}

export function isEventPast(e: any): boolean {
  return !isEventUpcoming(e);
}

function mapBackendEvent(e: any): Event {
  const eventDate = e.date ? new Date(e.date) : null;
  const isDateValid = eventDate && !isNaN(eventDate.getTime());
  const isUpcoming = isEventUpcoming(e);

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
    image: e.coverImageUrl || e.bannerImageUrl || "/images/events/free-fire.jpg",
    speakers: e.organizer ? [e.organizer] : (e.speakers || []),
    status: isUpcoming ? "upcoming" : "past",
    registrationUrl: e.registrationLink || e.registrationUrl || undefined,
    registrationType: e.registrationType || "individual",
    teamSize: e.teamSize || { min: 1, max: 4 },
    registrationDeadline: e.registrationDeadline ? new Date(e.registrationDeadline).toISOString().split("T")[0] : undefined,
    registrationFee: e.registrationFee ?? 0,
    maxParticipants: e.maxParticipants,
    prizePool: e.prizePool,
    rewards: e.rewards || [],
    schedule: e.schedule || [],
    rules: e.rules || [],
    sponsors: e.eventSponsors || [],
    customHtmlSection: e.customHtmlSection,
    attendeeCount: e.participants?.length ?? (Array.isArray(e.attendees) ? e.attendees.length : (typeof e.attendeeCount === "number" ? e.attendeeCount : 0)),
    tags: e.tags || [],
    linkedForm: e.linkedForm?._id ? String(e.linkedForm._id) : (e.linkedForm ? String(e.linkedForm) : (e.forms && e.forms[0]?._id ? String(e.forms[0]._id) : (e.forms && e.forms[0] ? String(e.forms[0]) : undefined))),
    media: Array.isArray(e.media) ? e.media : [],
    allowParticipationClaims: Boolean(e.allowParticipationClaims),
    participationClaims: Array.isArray(e.participationClaims) ? e.participationClaims : [],
    contributors: Array.isArray(e.contributors) ? e.contributors : [],
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
    return tA - tB; // Earliest/soonest upcoming first
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
    return tB - tA; // Most recent/newest past event first
  });
}

export async function getUpcomingEvents(): Promise<Event[]> {
  try {
    const res = await fetch(`${API_URL}/api/events?sort=asc`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      const backendEvents: any[] = data.data || data.events || [];
      if (backendEvents && backendEvents.length > 0) {
        const mapped = backendEvents.map(mapBackendEvent);
        const upcoming = mapped.filter(isEventUpcoming);
        return sortUpcomingEvents(upcoming);
      }
    }
  } catch (err) {
    console.warn("Could not fetch backend events:", err);
  }
  return [];
}

export async function getPastEvents(): Promise<Event[]> {
  try {
    const res = await fetch(`${API_URL}/api/events?sort=desc`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      const backendEvents: any[] = data.data || data.events || [];
      if (backendEvents && backendEvents.length > 0) {
        const mapped = backendEvents.map(mapBackendEvent);
        const past = mapped.filter(isEventPast);
        return sortPastEvents(past);
      }
    }
  } catch (err) {
    console.warn("Could not fetch backend events:", err);
  }
  return [];
}

export async function getHomeEvents(limit = 5): Promise<Event[]> {
  try {
    const res = await fetch(`${API_URL}/api/events`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      const backendEvents: any[] = data.data || data.events || [];
      if (backendEvents && backendEvents.length > 0) {
        const mapped = backendEvents.map(mapBackendEvent);
        const upcoming = sortUpcomingEvents(mapped.filter(isEventUpcoming));
        const past = sortPastEvents(mapped.filter(isEventPast));
        const combined = [...upcoming, ...past].slice(0, limit);
        return combined;
      }
    }
  } catch (err) {
    console.warn("Could not fetch backend events for home:", err);
  }
  return [];
}

export async function getEventBySlug(slug: string): Promise<Event | undefined> {
  // 1. Try backend lookup first
  try {
    const res = await fetch(`${API_URL}/api/events/${slug}`, { next: { revalidate: 60 } });
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
