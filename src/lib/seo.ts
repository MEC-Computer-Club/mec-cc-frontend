/**
 * Shared SEO & OpenGraph Helpers for MEC Computer Club
 * 
 * WhatsApp, Facebook, LinkedIn, Twitter, and iMessage link preview scrapers
 * require:
 * 1. Absolute HTTPS image URLs.
 * 2. Standard JPEG or PNG formats (WhatsApp drops .webp preview images!).
 * 3. Compact file sizes (< 300KB) and 1.91:1 aspect ratio (~1200x630).
 * 4. Clean plain text descriptions without raw HTML markup.
 */

const DEFAULT_FALLBACK_IMAGE = "https://meccomputerclub.org/mec-club-photo.jpg";
const DEFAULT_SITE_URL = "https://meccomputerclub.org";

/**
 * Strips HTML tags and decodes common entities to produce a clean plain-text meta description.
 */
export function cleanMetaDescription(text?: string | null, maxLength = 160): string {
  if (!text || typeof text !== "string") return "";

  const plain = text
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/\s+/g, " ")
    .trim();

  if (plain.length <= maxLength) return plain;

  // Truncate at nearest word boundary
  const sub = plain.substring(0, maxLength);
  const lastSpace = sub.lastIndexOf(" ");
  return (lastSpace > 50 ? sub.substring(0, lastSpace) : sub).trim() + "...";
}

/**
 * Transforms any image (Cloudinary or local) into a social-crawler-ready 1200x630 JPEG URL.
 */
export function getOpenGraphImageUrl(rawImage?: string | null, fallbackUrl = DEFAULT_FALLBACK_IMAGE): string {
  if (!rawImage || typeof rawImage !== "string") {
    return fallbackUrl;
  }

  let img = rawImage.trim();

  // Handle Cloudinary URLs:
  // WhatsApp scrapers reject WebP. We instruct Cloudinary to deliver a 1200x630 JPEG (<100KB).
  if (img.includes("res.cloudinary.com")) {
    const httpIdx = img.indexOf("http");
    if (httpIdx !== -1) {
      img = img.substring(httpIdx);
    } else {
      const domainIdx = img.indexOf("res.cloudinary.com");
      img = "https://" + img.substring(domainIdx);
    }

    if (img.includes("/upload/")) {
      // Remove any existing inline transformations
      const cleanUrl = img.replace(
        /(\/upload\/)([a-z][a-z0-9_,:/]+,|[a-z]+_[a-z0-9_,:/]+\/)/,
        "/upload/"
      );
      // Force .jpg extension
      const jpgUrl = cleanUrl.replace(/\.[a-zA-Z0-9]+$/, ".jpg");
      return jpgUrl.replace(
        "/upload/",
        "/upload/f_jpg,w_1200,h_630,c_fill,g_auto,q_auto:good/"
      );
    }
  }

  // Already a full external HTTP/HTTPS URL
  if (img.startsWith("http://") || img.startsWith("https://")) {
    return img;
  }

  // Relative path (e.g. /mec-club-photo.jpg or public/...)
  const cleanPath = img.startsWith("/") ? img : `/${img}`;
  return `${DEFAULT_SITE_URL}${cleanPath}`;
}
