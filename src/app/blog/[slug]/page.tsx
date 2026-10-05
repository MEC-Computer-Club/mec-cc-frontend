import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { getBlogBySlugFromApi } from "@/lib/api/blog";
import BlogViewClient from "./BlogViewClient";

export const dynamic = "force-dynamic";

import { cleanMetaDescription, getOpenGraphImageUrl } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlugFromApi(slug);
  if (!post) return { title: "Post Not Found" };

  const baseUrl = "https://meccomputerclub.org";
  const pageUrl = `${baseUrl}/blog/${post.slug || slug}`;
  const rawImage = (post as any).coverImage || post.image || "/mec-club-photo.jpg";
  const ogImageUrl = getOpenGraphImageUrl(rawImage);
  const plainDesc = cleanMetaDescription(post.excerpt || (post as any).content, 180);

  return {
    title: `${post.title} | MEC Blog`,
    description: plainDesc,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: post.title,
      description: plainDesc,
      url: pageUrl,
      siteName: "MEC Computer Club",
      type: "article",
      images: [
        {
          url: ogImageUrl,
          secureUrl: ogImageUrl,
          width: 1200,
          height: 630,
          type: "image/jpeg",
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: plainDesc,
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
