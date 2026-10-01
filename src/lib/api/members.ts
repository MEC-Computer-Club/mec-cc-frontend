import { formatDeptSession } from "@/lib/formatters";
import { API_BASE_URL } from "@/lib/api";

export interface Member {
  id: string;
  name: string;
  role: string;
  department?: string;
  systemRole?: string;
  batch?: string;
  session?: string;
  image?: string;
  imagePosition?: string;
  socials?: {
    github?: string;
    linkedin?: string;
    facebook?: string;
    codeforces?: string;
    discord?: string;
    codechef?: string;
    email?: string;
  };
}

export async function getActiveMembers(): Promise<Member[]> {
  const API_URL = API_BASE_URL;
  try {
    const res = await fetch(`${API_URL}/api/users/profile/active`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      const backendMembers: any[] = data.data || data.members || [];
      const generalMembers = backendMembers.filter((m: any) => {
        if (
          m.clubRole === "advisor" ||
          (m.designation && (m.designation.toLowerCase().includes("advisor") || m.designation.toLowerCase().includes("patron"))) ||
          (m.customRole && (m.customRole.toLowerCase().includes("advisor") || m.customRole.toLowerCase().includes("patron")))
        ) {
          return false;
        }
        if (m.clubRole === "alumni" || m.role === "alumni") return false;
        if (m.clubRole === "executive") return false;
        return true;
      });

      return generalMembers.map((m: any) => ({
        id: m._id || m.id,
        name: m.fullName,
        role: m.customRole || m.designation || "Club Member",
        department: m.department,
        session: formatDeptSession(m.department, m.session, m.batch) || "CSE (21-22)",
        batch: m.batch || `${m.department || "CSE"}`,
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
      }));
    }
  } catch (err) {
    console.warn("Could not fetch backend members:", err);
  }
  return [];
}
