export type GalleryItem = {
  id: string;
  title: string;
  type: "image" | "video";
  url: string;
  thumbnailUrl?: string;
  event: string;
  eventSlug?: string;
  date: string; // YYYY-MM-DD for sorting
  isYoutube?: boolean;
};

export function getYoutubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([\w-]{11})/i
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export function getYoutubeThumbnail(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([\w-]{11})/i
  );
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
}

export function getCleanMediaTitle(title?: string, event?: string): string {
  if (!title) return event || "Gallery Media";
  if (/\.(jpe?g|png|webp|gif|svg|mp4|mov|avi|mkv|webm)$/i.test(title.trim())) {
    return event || "Gallery Media";
  }
  return title;
}

/**
 * Transforms Cloudinary media URLs on the fly for lightweight, responsive delivery.
 * Automatically injects WebP/AVIF format and responsive max width.
 */
export function getOptimizedImageUrl(url?: string | null, width = 800): string {
  if (!url) return "/mec-club-photo.jpg";
  // If Cloudinary URL and not already transformed
  if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
    if (url.includes("/upload/f_auto") || url.includes("/upload/w_") || url.includes("/upload/q_")) {
      return url;
    }
    return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width},c_limit/`);
  }
  return url;
}

export const rawGalleryItems: GalleryItem[] = [];
export const galleryItems: GalleryItem[] = [];

import { API_BASE_URL } from "@/lib/api";
const API_URL = API_BASE_URL;

export async function getGalleryItems(): Promise<GalleryItem[]> {
  try {
    const res = await fetch(`${API_URL}/api/events/media/gallery`, { next: { revalidate: 60 } });
    if (res.ok) {
      const json = await res.json();
      const backendMedia: any[] = json?.data || [];
      if (backendMedia.length > 0) {
        const liveItems: GalleryItem[] = backendMedia.map((m: any) => {
          const isYt = Boolean(getYoutubeEmbedUrl(m.url));
          const isVid = m.mediaType === "video" || isYt;
          const ytThumb = isYt ? getYoutubeThumbnail(m.url) : null;
          const eventTitle = m.relatedEvent?.title || "MEC CC Event";
          const eventSlug = m.relatedEvent?.slug || m.relatedEvent?._id;
          const dateStr = m.relatedEvent?.date
            ? new Date(m.relatedEvent.date).toISOString().split("T")[0]
            : m.createdAt
            ? new Date(m.createdAt).toISOString().split("T")[0]
            : "2025-01-01";

          return {
            id: String(m._id || m.id),
            title: m.title || eventTitle,
            type: isVid ? "video" : "image",
            url: m.url,
            thumbnailUrl: ytThumb || (isVid ? undefined : m.url),
            event: eventTitle,
            eventSlug: eventSlug ? String(eventSlug) : undefined,
            date: dateStr,
            isYoutube: isYt,
          };
        });

        // Only return backend media sorted by date descending
        return liveItems.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      }
    }
  } catch (err) {
    console.warn("Could not fetch live gallery items from backend:", err);
  }

  return [];
}

export async function getHomeGalleryItems(limit = 5): Promise<GalleryItem[]> {
  const allItems = await getGalleryItems();
  try {
    const res = await fetch(`${API_URL}/api/page`, { next: { revalidate: 60 } });
    if (res.ok) {
      const json = await res.json();
      const featuredIds: string[] = json?.data?.featuredData?.gallery || [];
      if (featuredIds.length > 0) {
        const selected = allItems.filter((item) => featuredIds.includes(item.id));
        if (selected.length > 0) {
          const remaining = allItems.filter((item) => !featuredIds.includes(item.id));
          return [...selected, ...remaining].slice(0, limit);
        }
      }
    }
  } catch (err) {
    console.warn("Could not fetch featured gallery items from backend:", err);
  }

  return allItems.slice(0, limit);
}

