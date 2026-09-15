export interface Partner {
  id?: string;
  name: string;
  type: string;
  desc: string;
  logoPlaceholder: string;
  logoUrl?: string;
  website?: string;
  isActive?: boolean;
}

export const partners: Partner[] = [];

import { API_BASE_URL } from "@/lib/api";
const API_URL = API_BASE_URL;

export async function getPartners(): Promise<Partner[]> {
  try {
    const res = await fetch(`${API_URL}/api/sponsors`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      const backendSponsors: any[] = data.data || data.sponsors || [];
      if (backendSponsors && backendSponsors.length > 0) {
        return backendSponsors.map((s: any) => {
          let displayType = s.tier || "";
          if (!displayType) {
            if (s.contributionType === "service") displayType = "Service Partner";
            else if (s.contributionType === "in_kind") displayType = "Event Partner";
            else if (s.contributionType === "monetary") displayType = "Official Sponsor";
            else displayType = "Partner";
          }

          return {
            id: String(s._id || s.id),
            name: s.name,
            type: displayType,
            desc: s.notes || s.description || "Official partner of MEC Computer Club.",
            logoPlaceholder: (s.name || "SP").slice(0, 2).toUpperCase(),
            logoUrl: s.logoUrl || undefined,
            website: s.website || undefined,
            isActive: s.isActive !== false,
          };
        });
      }
    }
  } catch (err) {
    console.warn("Could not fetch backend sponsors:", err);
  }
  return [];
}
