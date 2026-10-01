import { formatDeptSession } from "@/lib/formatters";
import { API_BASE_URL } from "@/lib/api";

export interface Executive {
  id: string;
  name: string;
  role: string;
  designationOrder?: number;
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
    discord?: string;
    codechef?: string;
  };
}

export interface CommitteeTermSummary {
  _id: string;
  term: string;
  title: string;
  isCurrent: boolean;
  order: number;
  session?: string;
  groupPhotoUrl?: string;
  startDate?: string;
  endDate?: string;
  memberCount: number;
}

export interface CommitteeDetail {
  _id: string;
  term: string;
  title: string;
  isCurrent: boolean;
  order: number;
  session?: string;
  groupPhotoUrl?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  members: Executive[];
}

export async function getCommitteeTerms(): Promise<CommitteeTermSummary[]> {
  const API_URL = API_BASE_URL;
  try {
    const res = await fetch(`${API_URL}/api/committees`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      return json.data || [];
    }
  } catch (err) {
    console.warn("Could not fetch committee terms list:", err);
  }
  return [
    {
      _id: "default-current",
      term: "2026-2027",
      title: "Executive Committee 2026–2027",
      isCurrent: true,
      order: 2026,
      session: "2026-2027",
      memberCount: 0,
    },
  ];
}

export async function getCommitteeByTerm(term?: string): Promise<CommitteeDetail | null> {
  const API_URL = API_BASE_URL;
  try {
    const endpoint = term && term.trim() ? `${API_URL}/api/committees/term/${encodeURIComponent(term.trim())}` : `${API_URL}/api/committees/current`;
    const res = await fetch(endpoint, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      const data = json.data;
      if (data) {
        return {
          _id: data._id,
          term: data.term,
          title: data.title,
          isCurrent: data.isCurrent,
          order: data.order,
          session: data.session,
          groupPhotoUrl: data.groupPhotoUrl,
          description: data.description,
          startDate: data.startDate,
          endDate: data.endDate,
          members: (data.members || []).map((m: any) => ({
            id: m.id || m.userId || m._id,
            name: m.name || "Member",
            role: m.role || "Executive Member",
            designationOrder: m.order ?? 99,
            department: m.department || "CSE",
            batch: m.batch || "",
            session: formatDeptSession(m.department, m.session, m.batch) || (m.department ? `${m.department}` : "CSE"),
            image: m.image || m.imageUrl || "",
            imagePosition: m.imagePosition || "50% 50%",
            bio: m.bio || "",
            socials: {
              facebook: m.socials?.facebook || undefined,
              linkedin: m.socials?.linkedin || undefined,
              github: m.socials?.github || undefined,
              discord: m.socials?.discord || undefined,
              codeforces: m.socials?.codeforces || undefined,
              codechef: m.socials?.codechef || undefined,
              email: m.socials?.email || undefined,
            },
          })),
        };
      }
    }
  } catch (err) {
    console.warn("Could not fetch committee details:", err);
  }
  return null;
}

export function getExecutiveDesignationRank(
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

export async function getExecutives(term?: string): Promise<Executive[]> {
  try {
    const committee = await getCommitteeByTerm(term);
    if (committee && committee.members && committee.members.length > 0) {
      return committee.members;
    }
  } catch {}

  const API_URL = API_BASE_URL;
  try {
    const result: Executive[] = [];
    const seenIds = new Set<string>();
    const orderMap: Record<string, number> = {};

    try {
      const desigRes = await fetch(`${API_URL}/api/designations?category=executive`, { cache: "no-store" });
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
              name: m.fullName || m.name || "Member",
              role: desig.title,
              designationOrder: desig.order ?? 999,
              department: m.department,
              session: formatDeptSession(m.department, m.session, m.batch) || (m.department ? `${m.department}` : "CSE"),
              batch: m.batch || "",
              image: m.imageUrl || "",
              imagePosition: m.imagePosition || "50% 50%",
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
        if (result.length > 0) {
          result.sort((a, b) => {
            const rankA = a.designationOrder ?? 999;
            const rankB = b.designationOrder ?? 999;
            if (rankA !== rankB) return rankA - rankB;
            return a.name.localeCompare(b.name);
          });
          return result;
        }
      }
    } catch {}

    try {
      const res = await fetch(`${API_URL}/api/users/profile/active`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const backendMembers: any[] = data.data || data.members || [];
        const execsWithDesignation = backendMembers.filter((m: any) => {
          if (m.clubRole === "advisor" || m.clubRole === "alumni" || m.role === "alumni") return false;
          if (m.clubRole === "executive" && m.designation && m.designation !== "General Member" && m.designation !== "Club Member") return true;
          return false;
        });

        for (const m of execsWithDesignation) {
          const id = m._id || m.id;
          if (seenIds.has(id)) continue;
          seenIds.add(id);
          const role = m.designation || m.customRole || "Executive Member";
          result.push({
            id,
            name: m.fullName,
            role,
            designationOrder: getExecutiveDesignationRank(role, orderMap),
            department: m.department,
            session: formatDeptSession(m.department, m.session, m.batch) || "CSE (21-22)",
            batch: m.batch || "",
            image: m.imageUrl || "",
            imagePosition: m.imagePosition || "50% 50%",
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
    } catch (err) {
      console.warn("Could not fetch active users for executives:", err);
    }

    if (result.length > 0) {
      result.sort((a, b) => {
        const rankA = a.designationOrder ?? getExecutiveDesignationRank(a.role, orderMap);
        const rankB = b.designationOrder ?? getExecutiveDesignationRank(b.role, orderMap);
        if (rankA !== rankB) return rankA - rankB;
        return a.name.localeCompare(b.name);
      });
      return result;
    }
  } catch (err) {
    console.warn("Could not fetch backend executives:", err);
  }
  return [];
}

/** @deprecated Use getExecutives() instead */
export const staticExecutives: Executive[] = [];
