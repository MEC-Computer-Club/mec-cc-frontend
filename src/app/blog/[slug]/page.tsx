import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { getBlogBySlugFromApi } from "@/lib/api/blog";
import BlogViewClient from "./BlogViewClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlugFromApi(slug);
  if (!post) return { title: "Post Not Found" };

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://meccomputerclub.org");

  const pageUrl = `${baseUrl.replace(/\/+$/, "")}/blog/${post.slug || slug}`;
  const rawImage = (post as any).coverImage || post.image || "/mec-club-photo.jpg";
  const ogImageUrl = rawImage.startsWith("http://") || rawImage.startsWith("https://")
    ? rawImage
    : `${baseUrl.replace(/\/+$/, "")}${rawImage.startsWith("/") ? rawImage : `/${rawImage}`}`;

  return {
    title: `${post.title} | MEC Blog`,
    description: post.excerpt,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: pageUrl,
      siteName: "MEC Computer Club",
      type: "article",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [ogImageUrl],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Fetch from backend
  const post = await getBlogBySlugFromApi(slug);
  if (!post) notFound();

  const isHtml = post.content ? post.content.includes("<") && post.content.includes(">") : false;

  return <BlogViewClient post={post} isHtml={isHtml} />;
}
