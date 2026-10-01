import { api } from "@/lib/api";

export interface CloudinaryUsageStats {
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
  credits: {
    usage: number;
    limit: number;
    percentUsed: number;
    remaining: number;
  };
}

export async function fetchCloudinaryStats(): Promise<CloudinaryUsageStats | null> {
  try {
    const res: any = await api.get("/api/dashboard/cloudinary-stats");
    return res.data || null;
  } catch (err) {
    console.warn("Could not fetch Cloudinary storage stats:", err);
    return null;
  }
}
