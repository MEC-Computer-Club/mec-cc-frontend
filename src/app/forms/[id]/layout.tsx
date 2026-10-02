import type { Metadata } from "next";
import { API_BASE_URL } from "@/lib/api";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  let title = "Form | MEC Computer Club";
  let description = "Fill out this form hosted by MEC Computer Club, Mymensingh Engineering College.";
  let coverImageUrl = "/mec-club-photo.jpg";

  try {
    const res = await fetch(`${API_BASE_URL}/api/forms/${encodeURIComponent(id)}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      const form = json?.data || json;
      if (form) {
        if (form.title) title = `${form.title} | MEC Computer Club`;
        if (form.description) description = form.description;
        if (form.coverImageUrl) coverImageUrl = form.coverImageUrl;
      }
    }
  } catch {
    // Fall back to defaults on network/lookup failure
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://meccomputerclub.org");

  const pageUrl = `${baseUrl.replace(/\/+$/, "")}/forms/${id}`;
  const ogImageUrl =
    coverImageUrl.startsWith("http://") || coverImageUrl.startsWith("https://")
      ? coverImageUrl
      : `${baseUrl.replace(/\/+$/, "")}${coverImageUrl.startsWith("/") ? coverImageUrl : `/${coverImageUrl}`}`;

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "MEC Computer Club",
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default function FormLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
