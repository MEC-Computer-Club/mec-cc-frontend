import { LeaderboardEntry, CPContest, CPResource } from "@/types";
import { API_BASE_URL } from "@/lib/api";

const API_URL = API_BASE_URL;

export const leaderboard: LeaderboardEntry[] = [];

export async function getClubLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const res = await fetch(`${API_URL}/api/users/public/leaderboard`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        return json.data.filter((entry: LeaderboardEntry) => {
          const desig = (entry.designation || "").toLowerCase();
          const batch = (entry.batch || "").toLowerCase();
          if (desig.includes("advisor") || desig.includes("patron") || desig.includes("principal")) return false;
          if (batch === "faculty") return false;
          return true;
        });
      }
    }
  } catch (err) {
    console.warn("Could not fetch real leaderboard from backend:", err);
  }
  return [];
}

export const contests: CPContest[] = [];

export const cpResources: CPResource[] = [
  {
    id: "r1",
    title: "Binary Search — Complete Guide",
    type: "tutorial",
    difficulty: "beginner",
    url: "#",
    tags: ["binary-search", "fundamentals"],
    author: "Rafi Islam",
    date: "2025-09-05",
  },
  {
    id: "r2",
    title: "Dynamic Programming: From Zero to Hero",
    type: "tutorial",
    difficulty: "intermediate",
    url: "#",
    tags: ["dynamic-programming", "algorithms"],
    author: "Nusrat Jahan",
    date: "2025-08-20",
  },
  {
    id: "r3",
    title: "Intra-MEC Contest 2025 — Editorial",
    type: "editorial",
    difficulty: "intermediate",
    url: "#",
    tags: ["contest", "editorial"],
    author: "Nusrat Jahan",
    date: "2025-09-01",
  },
  {
    id: "r4",
    title: "Graph Theory Problem Set (30 problems)",
    type: "problem-set",
    difficulty: "intermediate",
    url: "#",
    tags: ["graphs", "bfs", "dfs", "shortest-path"],
    author: "Tanvir Hasan",
  },
  {
    id: "r5",
    title: "Segment Trees Crash Course",
    type: "tutorial",
    difficulty: "advanced",
    url: "#",
    tags: ["data-structures", "segment-tree"],
    author: "Nusrat Jahan",
    date: "2025-07-15",
  },
];
