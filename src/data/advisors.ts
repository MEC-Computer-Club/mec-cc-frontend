export interface Advisor {
  id: string;
  name: string;
  role: string;
  academicPost?: string;
  department?: string;
  image: string;
  imagePosition?: string;
  bio?: string;
  socials?: {
    linkedin?: string;
    github?: string;
    email?: string;
    facebook?: string;
  };
}

export const staticAdvisors: Advisor[] = [];

export const advisors = staticAdvisors;

import { API_BASE_URL } from "@/lib/api";

export function getAdvisorDesignationRank(role: string, orderMap?: Record<string, number>): number {
  if (!role) return 999;
  const clean = role.toLowerCase().trim();
  if (orderMap && typeof orderMap[clean] === "number") {
    return orderMap[clean];
  }
  // Try partial match with orderMap keys
  if (orderMap) {
    for (const key of Object.keys(orderMap)) {
      if (clean.includes(key) || key.includes(clean)) {
        return orderMap[key];
      }
    }
  }

  // Canonical fallback hierarchy
  if (clean.includes("patron") || clean.includes("principal")) return 1;
  if (clean.includes("chief advisor") || clean.includes("head of department") || clean.includes("head of dept")) return 2;
  if (clean.includes("technical advisor")) return 3;
  if (clean.includes("faculty advisor") || clean.includes("senior advisor")) return 4;
  if (clean.includes("mentor") || clean.includes("honorary")) return 5;
  if (clean.includes("advisor")) return 6;
  return 100;
}

export async function getAdvisors(): Promise<Advisor[]> {
  const API_URL = API_BASE_URL;
  try {
    // 1. Fetch active designations to build order precedence map
    const orderMap: Record<string, number> = {};
    try {
      const desigRes = await fetch(`${API_URL}/api/designations?category=advisor`, { next: { revalidate: 60 } });
      if (desigRes.ok) {
        const desigData = await desigRes.json();
        const list = desigData.data || [];
        list.forEach((d: any) => {
          if (d.title) {
            orderMap[d.title.toLowerCase().trim()] = d.order ?? 999;
          }
        });
      }
    } catch {
      // ignore
    }

    // 2. Fetch active approved members from DB
    const res = await fetch(`${API_URL}/api/users/profile/active`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      const backendMembers: any[] = data.data || data.members || [];
      const advisorMembers = backendMembers.filter((m: any) => {
        if (m.clubRole === "advisor") return true;
        if (m.clubRole && m.clubRole !== "advisor") return false;
        if (m.designation && (m.designation.toLowerCase().includes("advisor") || m.designation.toLowerCase().includes("patron"))) return true;
        if (m.customRole && (m.customRole.toLowerCase().includes("advisor") || m.customRole.toLowerCase().includes("patron"))) return true;
        return false;
      });

      if (advisorMembers.length > 0) {
        const mapped: Advisor[] = advisorMembers.map((m: any) => ({
          id: m._id || m.id,
          name: m.fullName,
          role: m.designation || m.customRole || "Faculty Advisor",
          academicPost: m.session && m.session !== "Faculty" ? m.session : (m.department ? `Dept. of ${m.department}` : "Faculty"),
          department: m.department || "CSE",
          image: m.imageUrl || "",
          imagePosition: m.imagePosition || "50% 50%",
          bio: m.bio || undefined,
          socials: {
            linkedin: m.socialLinks?.linkedin || undefined,
            github: m.socialLinks?.github || undefined,
            email: m.email || undefined,
            facebook: m.socialLinks?.facebook || undefined,
          },
        }));

        // Sort by precedence rank
        mapped.sort((a, b) => {
          const rankA = getAdvisorDesignationRank(a.role, orderMap);
          const rankB = getAdvisorDesignationRank(b.role, orderMap);
          if (rankA !== rankB) return rankA - rankB;
          return a.name.localeCompare(b.name);
        });

        return mapped;
      }
    }
  } catch (err) {
    console.warn("Could not fetch backend advisors, using static fallback:", err);
  }

  return [];
}
