import type { Metadata } from "next";
import { API_BASE_URL } from "@/lib/api";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  let title = "Member Profile | MEC Computer Club";
  let description = "View member profile and achievements at MEC Computer Club, Mymensingh Engineering College.";
  let avatarUrl = "/mec-club-photo.jpg";

  try {
    const res = await fetch(`${API_BASE_URL}/api/users/profile/${encodeURIComponent(id)}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      const member = json?.data || json;
      if (member) {
        const name = member.fullName || member.name || "Member";
        const role = member.customRole || member.designation || member.clubRole || "Club Member";
        const dept = member.department ? ` - ${member.department}` : "";
        title = `${name} (${role}${dept}) | MEC Computer Club`;
        if (member.bio) {
          description = member.bio;
        } else {
          description = `${name}'s member profile at MEC Computer Club.`;
        }
        if (member.imageUrl) {
          avatarUrl = member.imageUrl;
        }
      }
    }
  } catch {
    // Fall back to defaults on failure
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://meccomputerclub.org");

  const pageUrl = `${baseUrl.replace(/\/+$/, "")}/profile/${id}`;
  const ogImageUrl =
    avatarUrl.startsWith("http://") || avatarUrl.startsWith("https://")
      ? avatarUrl
      : `${baseUrl.replace(/\/+$/, "")}${avatarUrl.startsWith("/") ? avatarUrl : `/${avatarUrl}`}`;

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
      type: "profile",
      images: [
        {
          url: ogImageUrl,
          width: 800,
          height: 800,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
