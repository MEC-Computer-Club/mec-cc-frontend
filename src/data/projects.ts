import { Project } from "@/types";
import { getProjectCoverImage, extractProjectRepositories } from "@/lib/projectUtils";
import { API_BASE_URL } from "@/lib/api";

export const projects: Project[] = [];

const API_URL = API_BASE_URL;

function mapBackendProject(p: any): Project {
  const teamMembers = Array.isArray(p.teamMembers)
    ? p.teamMembers.map((m: any) =>
      typeof m === "object" && m ? m.fullName || m.name || "Member" : "Member"
    )
    : Array.isArray(p.team)
      ? p.team
      : p.contributors
        ? p.contributors.map((c: any) => c.fullName || c.name || "Member")
        : ["Club Member"];

  const skills = Array.isArray(p.techStack) && p.techStack.length > 0
    ? p.techStack
    : Array.isArray(p.requiredSkills) && p.requiredSkills.length > 0
      ? p.requiredSkills
      : Array.isArray(p.technologies)
        ? p.technologies
        : ["TypeScript", "React"];

  const repos = extractProjectRepositories(p);
  const coverImage = getProjectCoverImage(p);

  return {
    id: p._id || p.id,
    slug: p.slug || p._id || p.id,
    title: p.title || "Untitled Project",
    description: p.description || "",
    longDescription: p.longDescription || p.description || "",
    department: p.department || "webdev",
    techStack: skills,
    image: coverImage,
    team: teamMembers.length > 0 ? teamMembers : ["Club Member"],
    liveUrl: p.liveDemoLink || p.liveUrl || p.projectUrl || undefined,
    repoUrl: p.githubLink || p.repoUrl || (repos[0]?.url) || undefined,
    repositories: repos,
    githubLinks: p.githubLinks || repos.map((r: any) => r.url),
    status: p.status === "completed" ? "completed" : p.status === "archived" ? "archived" : "in-progress",
    featured: Boolean(p.featured),
    completedDate: p.endDate ? String(p.endDate).slice(0, 7) : p.completedDate,
    createdBy: typeof p.createdBy === "object" ? p.createdBy?._id : p.createdBy,
  };
}

export async function getProjects(): Promise<Project[]> {
  try {
    const res = await fetch(`${API_URL}/api/projects`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      const backendProjects: any[] = data.data || data.projects || [];
      if (backendProjects && backendProjects.length > 0) {
        return backendProjects.map(mapBackendProject);
      }
    }
  } catch (err) {
    console.warn("Could not fetch backend projects:", err);
  }
  return [];
}

export async function getFeaturedProjects(): Promise<Project[]> {
  try {
    const res = await fetch(`${API_URL}/api/projects?featured=true`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      const backendProjects: any[] = data.data || data.projects || [];
      if (backendProjects && backendProjects.length > 0) {
        return backendProjects.map(mapBackendProject);
      }
    }
  } catch (err) {
    console.warn("Could not fetch backend featured projects:", err);
  }
  return [];
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  try {
    const all = await getProjects();
    const found = all.find((p) => p.slug === slug || p.id === slug);
    if (found) return found;
  } catch (err) {
    console.warn("Error looking up project by slug:", err);
  }
  return undefined;
}

export async function getProjectsByDepartment(dept: string): Promise<Project[]> {
  const all = await getProjects();
  return all.filter((p) => p.department === dept);
}
