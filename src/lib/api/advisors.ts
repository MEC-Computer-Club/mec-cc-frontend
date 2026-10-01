import { API_BASE_URL } from "@/lib/api";

export interface Advisor {
  id: string;
  name: string;
  role: string;
  wing?: string;
  designationOrder?: number;
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
    codeforces?: string;
    discord?: string;
    codechef?: string;
  };
}

export function getAdvisorDesignationRank(
  role: string,
  orderMap?: Record<string, number>
): number {
  if (!role) return 999;
  const clean = role.toLowerCase().trim();
  if (orderMap && typeof orderMap[clean] === "number") return orderMap[clean];
  if (orderMap) {
    for (const key of Object.keys(orderMap)) {
      if (clean.includes(key) || key.includes(clean)) return orderMap[key];
    }
  }
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
    const result: Advisor[] = [];
    const seenIds = new Set<string>();
    const orderMap: Record<string, number> = {};

    try {
      const desigRes = await fetch(
        `${API_URL}/api/designations?category=advisor`,
        { cache: "no-store" }
      );
      if (desigRes.ok) {
        const desigData = await desigRes.json();
        const designations: any[] = desigData.data || [];

        for (const desig of designations) {
          if (desig.title) orderMap[desig.title.toLowerCase().trim()] = desig.order ?? 999;
          const members: any[] = desig.assignedMembers || [];
          for (const m of members) {
            const id = m._id || m.id;
            if (!id || seenIds.has(id)) continue;
            seenIds.add(id);
            result.push({
              id,
              name: m.fullName || m.name || "Advisor",
              role: desig.title,
              wing: desig.wing || undefined,
              designationOrder: desig.order ?? 999,
              academicPost:
                m.session && m.session !== "Faculty"
                  ? m.session
                  : m.department
                  ? `Dept. of ${m.department}`
                  : "Faculty",
              department: m.department || "CSE",
              image: m.imageUrl || "",
              imagePosition: m.imagePosition || "50% 50%",
              bio: m.bio || undefined,
              socials: {
                facebook: m.socialLinks?.facebook || undefined,
                linkedin: m.socialLinks?.linkedin || undefined,
                github: m.socialLinks?.github || undefined,
                codeforces: m.socialLinks?.codeforces || undefined,
                discord: m.socialLinks?.discord || undefined,
                codechef: m.socialLinks?.codechef || undefined,
                email: m.email || undefined,
              },
            });
          }
        }
      }
    } catch {
      // Ignore designation fetch error, proceed to active users
    }

    try {
      const res = await fetch(`${API_URL}/api/users/profile/active`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const backendMembers: any[] = data.data || data.members || [];
        const unassignedAdvisors = backendMembers.filter((m: any) => {
          const id = m._id || m.id;
          if (!id || seenIds.has(id)) return false;
          if (m.clubRole === "advisor") return true;
          if (m.clubRole && m.clubRole !== "advisor") return false;
          if (m.designation && (m.designation.toLowerCase().includes("advisor") || m.designation.toLowerCase().includes("patron"))) return true;
          if (m.customRole && (m.customRole.toLowerCase().includes("advisor") || m.customRole.toLowerCase().includes("patron"))) return true;
          return false;
        });

        for (const m of unassignedAdvisors) {
          const id = m._id || m.id;
          seenIds.add(id);
          const role = m.designation || m.customRole || "Faculty Advisor";
          result.push({
            id,
            name: m.fullName,
            role,
            designationOrder: getAdvisorDesignationRank(role, orderMap),
            academicPost:
              m.session && m.session !== "Faculty"
                ? m.session
                : m.department
                ? `Dept. of ${m.department}`
                : "Faculty",
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
          });
        }
      }
    } catch (err) {
      console.warn("Could not fetch active users for advisors:", err);
    }

    if (result.length > 0) {
      result.sort((a, b) => {
        const rankA = a.designationOrder ?? getAdvisorDesignationRank(a.role, orderMap);
        const rankB = b.designationOrder ?? getAdvisorDesignationRank(b.role, orderMap);
        if (rankA !== rankB) return rankA - rankB;
        return a.name.localeCompare(b.name);
      });
      return result;
    }
  } catch (err) {
    console.warn("Could not fetch backend advisors:", err);
  }
  return [];
}

/** @deprecated Use getAdvisors() instead */
export const staticAdvisors: Advisor[] = [];
