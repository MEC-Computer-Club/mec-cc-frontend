import { BlogPost } from "@/types";

export const blogPosts: BlogPost[] = [

];

import { API_BASE_URL } from "@/lib/api";
const API_URL = API_BASE_URL;

function mapBackendBlog(b: any): BlogPost {
  const authorId =
    b.author?._id ||
    b.author?.id ||
    (typeof b.author === "string" ? b.author : undefined);

  return {
    id: b._id || b.id,
    slug: b.slug || b._id || b.id,
    title: b.title,
    excerpt: b.excerpt || b.summary || (b.content ? b.content.replace(/<[^>]*>/g, "").slice(0, 140) + "..." : ""),
    content: b.content || "",
    author: b.author?.fullName || b.authorName || "Club Member",
    authorId,
    authorImage: b.author?.imageUrl || "",
    date: b.createdAt ? new Date(b.createdAt).toISOString().split("T")[0] : "2025-08-01",
    readTime: b.readTime || Math.max(1, Math.ceil((b.content || "").replace(/<[^>]*>/g, "").split(/\s+/).length / 200)),
    tags: b.tags || [],
    image: b.coverImageUrl || b.image || "",
    coverImagePosition: b.coverImagePosition || "50% 50%",
    views: b.views || 0,
    likesCount: b.likesCount ?? (Array.isArray(b.likes) ? b.likes.length : 0),
    likes: Array.isArray(b.likes)
      ? b.likes.map((l: any) => (typeof l === "string" ? l : l?._id || l?.id))
      : [],
    featured: !!b.featured,
  };
}

export async function getBlogs(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${API_URL}/api/blogs`, { next: { revalidate: 30 } });
    if (res.ok) {
      const data = await res.json();
      const backendBlogs: any[] = data.data || data.blogs || [];
      if (backendBlogs && backendBlogs.length > 0) {
        return [...backendBlogs.map(mapBackendBlog), ...blogPosts];
      }
    }
  } catch (err) {
    console.warn("Could not fetch backend blogs, using static blog posts:", err);
  }
  return blogPosts;
}

export function getBlogBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getFeaturedPosts(): BlogPost[] {
  return blogPosts.filter((p) => p.featured);
}

/** Fetch featured blogs for the home page (at most 3) */
export async function getFeaturedBlogs(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${API_URL}/api/blogs?featured=true&limit=3`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      const backendBlogs: any[] = data.data || data.blogs || [];
      if (backendBlogs && backendBlogs.length > 0) {
        return backendBlogs.map(mapBackendBlog).slice(0, 3);
      }
    }
  } catch (err) {
    console.warn("Could not fetch backend featured blogs, fallback to static:", err);
  }
  const staticFeatured = blogPosts.filter((p) => p.featured);
  if (staticFeatured.length > 0) {
    return staticFeatured.slice(0, 3);
  }
  return blogPosts.slice(0, 3);
}

/** Fetch a single blog by its slug from the backend API */
export async function getBlogBySlugFromApi(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${API_URL}/api/blogs/slug/${slug}`, { next: { revalidate: 30 } });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) {
        return mapBackendBlog(data.data);
      }
    }
  } catch {
    // fall through
  }
  return null;
}

/** Fetch a single blog by its ID from the backend API */
export async function getBlogByIdFromApi(id: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${API_URL}/api/blogs/${id}`, { next: { revalidate: 0 } });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) {
        return mapBackendBlog(data.data);
      }
    }
  } catch {
    // fall through
  }
  return null;
}
