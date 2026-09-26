export interface Partner {
  id?: string;
  name: string;
  type: string;
  desc: string;
  logoPlaceholder: string;
  logoUrl?: string;
  website?: string;
  isActive?: boolean;
  showOnHome?: boolean;
}

export interface ClubPartner {
  id?: string;
  name: string;
  role: string;
  desc?: string;
  logoPlaceholder?: string;
  logoUrl?: string;
  website?: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
}

export const partners: Partner[] = [];

import { API_BASE_URL } from "@/lib/api";
const API_URL = API_BASE_URL;

export async function getPartners(options?: { forHome?: boolean }): Promise<Partner[]> {
  try {
    const res = await fetch(`${API_URL}/api/sponsors`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      let backendSponsors: any[] = (data.data || data.sponsors || []).filter(
        (s: any) => s.category !== "club_as_partner"
      );

      if (options?.forHome) {
        const hasExplicitHome = backendSponsors.some((s: any) => s.showOnHome === true);
        if (hasExplicitHome) {
          backendSponsors = backendSponsors.filter((s: any) => s.showOnHome === true);
        } else {
          // If no sponsor has been explicitly selected yet, default to active sponsors
          backendSponsors = backendSponsors.filter((s: any) => s.showOnHome !== false && s.isActive !== false);
        }
      }

      if (backendSponsors && backendSponsors.length > 0) {
        return backendSponsors.map((s: any) => {
          let displayType = s.tier || "";
          if (!displayType && Array.isArray(s.sponsorships) && s.sponsorships.length > 0) {
            const firstWithTier = s.sponsorships.find((r: any) => r.tier);
            if (firstWithTier) displayType = firstWithTier.tier;
          }
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
            showOnHome: s.showOnHome ?? false,
          };
        });
      }
    }
  } catch (err) {
    console.warn("Could not fetch backend sponsors:", err);
  }
  return [];
}

export async function getClubPartners(): Promise<ClubPartner[]> {
  try {
    const res = await fetch(`${API_URL}/api/sponsors?category=club_as_partner`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      const items: any[] = (data.data || []).filter(
        (s: any) => s.category === "club_as_partner"
      );
      return items.map((s: any) => ({
        id: String(s._id || s.id),
        name: s.name,
        role: s.role || "Club Partner",
        desc: s.description || "Official partner connection with MEC Computer Club.",
        logoPlaceholder: (s.name || "CP").slice(0, 2).toUpperCase(),
        logoUrl: s.logoUrl || undefined,
        website: s.website || undefined,
        startDate: s.startDate,
        endDate: s.endDate,
        isActive: s.isActive !== false,
      }));
    }
  } catch (err) {
    console.warn("Could not fetch backend club partners:", err);
  }
  return [];
}
