import { api } from "@/lib/api";

export interface MediaEntityReference {
  type: "user" | "event" | "blog" | "form" | "project" | "sponsor" | "cover_preset" | "media_gallery" | "certificate";
  id: string;
  title: string;
  usage: string;
  dashboardUrl?: string;
  publicUrl?: string;
}

export interface CloudinaryUsageStats {
  unconfigured?: boolean;
  plan: string;
  lastUpdated: string;
  storage: {
    bytes: number;
    formatted: string;
    credits: number;
  };
  bandwidth: {
    bytes: number;
    formatted: string;
    credits: number;
  };
  objects: {
    totalAssets: number;
  };
  transformations: {
    usage: number;
    credits: number;
  };
  credits: {
    usage: number;
    limit: number;
    percentUsed: number;
    remaining: number;
  };
  databaseReferences?: {
    totalEntitiesWithMedia: number;
    breakdown: {
      users: number;
      events: number;
      blogs: number;
      forms: number;
      projects: number;
      sponsors: number;
      presets: number;
      gallery: number;
    };
  };
  rateLimit: {
    remaining: number;
    allowed: number;
    resetAt: string;
  };
}

export interface CloudinaryFolder {
  name: string;
  path: string;
  parent?: string;
}

export interface CloudinaryResource {
  assetId: string;
  publicId: string;
  folder: string;
  filename: string;
  format: string;
  resourceType: "image" | "video" | "raw";
  width?: number;
  height?: number;
  aspectRatio?: number;
  bytes: number;
  formattedSize: string;
  url: string;
  secureUrl: string;
  createdAt: string;
  uploadedAt: string;
  linkedEntities?: MediaEntityReference[];
  isLinked?: boolean;
  linkCount?: number;
}

export interface GetResourcesParams {
  folder?: string;
  search?: string;
  resourceType?: "all" | "image" | "video" | "raw";
  linkStatus?: "all" | "linked" | "unlinked";
  nextCursor?: string | null;
  maxResults?: number;
  sortBy?: "created_at" | "bytes";
  sortDir?: "asc" | "desc";
}

/**
 * Transforms a full Cloudinary URL to an on-demand, highly optimized WebP thumbnail.
 * Reduces bandwidth from ~5MB to ~15KB per image, preventing large downloads.
 */
export function getOptimizedThumbnailUrl(url: string, width = 360, height = 240, crop = "fill"): string {
  if (!url || typeof url !== "string" || !url.includes("res.cloudinary.com")) return url;
  if (url.includes("/upload/c_") || url.includes("/upload/w_") || url.includes("/upload/f_auto")) return url;
  return url.replace("/upload/", `/upload/c_${crop},w_${width},h_${height},g_auto,f_auto,q_auto/`);
}

export async function fetchMediaStats(): Promise<CloudinaryUsageStats> {
  const res: any = await api.get("/api/media-manager/stats");
  return res.data;
}

export async function fetchMediaFolders(): Promise<CloudinaryFolder[]> {
  const res: any = await api.get("/api/media-manager/folders");
  return res.data || [];
}

export async function fetchMediaResources(params: GetResourcesParams = {}): Promise<{
  resources: CloudinaryResource[];
  totalCount: number;
  nextCursor: string | null;
  totalResolvedLinked?: number;
  totalResolvedUnlinked?: number;
}> {
  const query = new URLSearchParams();
  if (params.folder) query.set("folder", params.folder);
  if (params.search) query.set("search", params.search);
  if (params.resourceType && params.resourceType !== "all") query.set("resourceType", params.resourceType);
  if (params.linkStatus && params.linkStatus !== "all") query.set("linkStatus", params.linkStatus);
  if (params.nextCursor) query.set("nextCursor", params.nextCursor);
  if (params.maxResults) query.set("maxResults", String(params.maxResults));
  if (params.sortBy) query.set("sortBy", params.sortBy);
  if (params.sortDir) query.set("sortDir", params.sortDir);

  const res: any = await api.get(`/api/media-manager/resources?${query.toString()}`);
  return {
    resources: res?.data?.resources || [],
    totalCount: res?.data?.totalCount || 0,
    nextCursor: res?.data?.nextCursor || null,
    totalResolvedLinked: res?.data?.totalResolvedLinked,
    totalResolvedUnlinked: res?.data?.totalResolvedUnlinked,
  };
}

export async function uploadMediaFile(file: File, folder: string): Promise<any> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const res: any = await api.upload(`/api/media-manager/upload?folder=${encodeURIComponent(folder)}`, formData, {
    method: "POST",
  });
  return res.data;
}

export async function deleteMediaResource(
  publicId: string,
  permanent = false,
  resourceType = "image"
): Promise<void> {
  const query = new URLSearchParams({
    publicId,
    permanent: String(permanent),
    resourceType,
  });
  await api.delete(`/api/media-manager/resource?${query.toString()}`, {
    body: JSON.stringify({ publicId, permanent, resourceType }),
    headers: { "Content-Type": "application/json" },
  });
}

export async function deleteBulkMediaResources(publicIds: string[]): Promise<any> {
  return await api.delete("/api/media-manager/resource", {
    body: JSON.stringify({ publicIds }),
    headers: { "Content-Type": "application/json" },
  });
}

export async function createMediaFolder(folderPath: string): Promise<any> {
  const res: any = await api.post("/api/media-manager/folders", { folderPath });
  return res.data;
}

export async function restoreMediaResource(
  publicId: string,
  targetFolder?: string,
  resourceType = "image"
): Promise<{ success: boolean; message: string; data?: { restoredPublicId: string; targetFolder: string; url: string; secure_url: string } }> {
  const res: any = await api.post("/api/media-manager/restore", {
    publicId,
    targetFolder,
    resourceType,
  });
  return res;
}

