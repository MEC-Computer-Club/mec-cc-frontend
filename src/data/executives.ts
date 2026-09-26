import { formatDeptSession } from "@/lib/formatters";
import { API_BASE_URL } from "@/lib/api";

export interface Executive {
  id: string;
  name: string;
  role: string;
  department?: string;
  systemRole?: string;
  batch?: string;
  session?: string;
  image: string;
  imagePosition?: string;
  bio?: string;
  socials?: {
    linkedin?: string;
    github?: string;
    email?: string;
    facebook?: string;
    codeforces?: string;
  };
}

export const executives: Executive[] = [];
export const staticExecutives = executives;

export function getExecutiveDesignationRank(role: string, orderMap?: Record<string, number>): number {
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
  if (clean === "president") return 1;
  if (clean.includes("general secretary") && !clean.includes("joint") && !clean.includes("assistant")) return 2;
  if (clean.includes("vice president") || clean === "vp") return 3;
  if (clean.includes("joint secretary") || clean.includes("assistant general secretary")) return 4;
  if (clean.includes("organizing secretary")) return 5;
  if (clean.includes("creative") || clean.includes("media")) return 6;
  if (clean.includes("event") || clean.includes("coordinator") || clean.includes("co-ordinator")) return 7;
  if (clean.includes("finance") || clean.includes("treasurer")) return 8;
  if (clean.includes("logistics") || clean.includes("resource")) return 9;
  if (clean.includes("public relations") || clean.includes("pr")) return 10;
  if (clean.includes("competitive programming") || clean.includes("cp lead")) return 11;
  if (clean.includes("web admin") || clean.includes("administrator")) return 12;
  if (clean.includes("web dev") || clean.includes("software")) return 13;
  if (clean.includes("ai") || clean.includes("ml") || clean.includes("machine learning")) return 14;
  if (clean.includes("cyber") || clean.includes("security")) return 15;
  if (clean.includes("executive member") || clean.includes("executive")) return 16;
  return 100;
}

export async function getExecutives(): Promise<Executive[]> {
  const API_URL = API_BASE_URL;
  try {
    // 1. Fetch active designations to build order precedence map
    const orderMap: Record<string, number> = {};
    try {
      const desigRes = await fetch(`${API_URL}/api/designations?category=executive`, { next: { revalidate: 60 } });
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
      const execs = backendMembers.filter((m: any) => {
        // 1. Strictly exclude Advisors
        if (
          m.clubRole === "advisor" ||
          (m.designation && (m.designation.toLowerCase().includes("advisor") || m.designation.toLowerCase().includes("patron"))) ||
          (m.customRole && (m.customRole.toLowerCase().includes("advisor") || m.customRole.toLowerCase().includes("patron")))
        ) {
          return false;
        }

        // 2. Strictly exclude Alumni
        if (m.clubRole === "alumni" || m.role === "alumni") {
          return false;
        }

        // 3. Include only if clubRole === "executive", role === "executive", or has executive designation
        if (m.clubRole === "executive") return true;
        if (m.clubRole && m.clubRole !== "executive") return false;
        if (m.role === "executive") return true;
        if (
          m.customRole &&
          m.customRole.trim().length > 0 &&
          m.customRole !== "Club Member" &&
          m.customRole !== "General Member" &&
          m.role !== "member"
        ) {
          return true;
        }
        return false;
      });
      if (execs.length > 0) {
        const mapped: Executive[] = execs.map((m: any) => ({
          id: m._id || m.id,
          name: m.fullName,
          role:
            m.designation ||
            m.customRole ||
            (m.role === "admin"
              ? "Administrator"
              : m.role === "moderator"
              ? "Moderator"
              : "Executive Member"),
          systemRole: m.role,
          department: m.department,
          session: formatDeptSession(m.department, m.session, m.batch) || "CSE (21-22)",
          batch: m.batch || "",
          image: m.imageUrl || "",
          imagePosition: m.imagePosition || "50% 50%",
          socials: {
            github: m.socialLinks?.github || undefined,
            linkedin: m.socialLinks?.linkedin || undefined,
            facebook: m.socialLinks?.facebook || undefined,
            codeforces: m.socialLinks?.codeforces || undefined,
            email: m.email || undefined,
          },
        }));

        // Sort by precedence rank order
        mapped.sort((a, b) => {
          const rankA = getExecutiveDesignationRank(a.role, orderMap);
          const rankB = getExecutiveDesignationRank(b.role, orderMap);
          if (rankA !== rankB) return rankA - rankB;
          return a.name.localeCompare(b.name);
        });

        return mapped;
      }
    }
  } catch (err) {
    console.warn("Could not fetch backend executives:", err);
  }
  return [];
}
