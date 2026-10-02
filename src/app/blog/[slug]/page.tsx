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
  return { title: `${post.title} | MEC Blog`, description: post.excerpt };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Fetch from backend
  const post = await getBlogBySlugFromApi(slug);
  if (!post) notFound();

  const isHtml = post.content ? post.content.includes("<") && post.content.includes(">") : false;

  return <BlogViewClient post={post} isHtml={isHtml} />;
}
