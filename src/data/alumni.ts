import { formatDeptSession } from "@/lib/formatters";
import { groupPeopleByBatch } from "@/lib/batchUtils";

export interface AlumniMember {
  id: string;
  name: string;
  role: string;
  batch?: string;
  session?: string;
  department?: string;
  image?: string;
  imagePosition?: string;
  bio?: string;
  socials?: {
    linkedin?: string;
    github?: string;
    facebook?: string;
    email?: string;
    codeforces?: string;
  };
}

export interface AlumniBatch {
  batchNumber: string;
  year: string;
  members: AlumniMember[];
}

// Static fallback data
export const alumniBatches: AlumniBatch[] = [];

import { API_BASE_URL } from "@/lib/api";

export async function getAlumniMembers(): Promise<AlumniMember[]> {
  const API_URL = API_BASE_URL;
  try {
    const res = await fetch(`${API_URL}/api/users/profile/active`, {
      next: { revalidate: 60 },
    });

    if (res.ok) {
      const data = await res.json();
      const backendMembers: any[] = data.data || data.members || [];

      // Filter only alumni
      const alumniMembers = backendMembers.filter(
        (m: any) => m.clubRole === "alumni" || m.role === "alumni"
      );

      if (alumniMembers.length > 0) {
        return alumniMembers.map((m: any) => ({
          id: m._id || m.id,
          name: m.fullName,
          role:
            m.designation ||
            m.customRole ||
            (m.role === "alumni" ? "Alumni" : "Club Alumni"),
          batch: m.batch || "",
          session: formatDeptSession(m.department, m.session, m.batch) || "",
          department: m.department || "",
          image: m.imageUrl || "",
          imagePosition: m.imagePosition || "50% 50%",
          bio: m.bio || "",
          socials: {
            linkedin: m.socialLinks?.linkedin || undefined,
            github: m.socialLinks?.github || undefined,
            facebook: m.socialLinks?.facebook || undefined,
            codeforces: m.socialLinks?.codeforces || undefined,
            email: m.email || undefined,
          },
        }));
      }
    }
  } catch (err) {
    console.warn("Could not fetch alumni from backend, using static fallback:", err);
  }

  return [];
}

export async function getAlumni(): Promise<AlumniBatch[]> {
  const members = await getAlumniMembers();
  if (members.length > 0) {
    const grouped = groupPeopleByBatch(members);
    return grouped.map((g) => ({
      batchNumber: g.batchNumber,
      year: g.year || "",
      members: g.members.sort((a, b) => a.name.localeCompare(b.name)),
    }));
  }
  return [];
}
