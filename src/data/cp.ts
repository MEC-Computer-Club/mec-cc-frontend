import { LeaderboardEntry, CPContest, CPResource } from "@/types";
import { API_BASE_URL } from "@/lib/api";

const API_URL = API_BASE_URL;

export const leaderboard: LeaderboardEntry[] = [
];

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
    console.warn("Could not fetch real leaderboard from backend, using fallback:", err);
  }
  return leaderboard;
}



export const contests: CPContest[] = [
];

export const cpResources: CPResource[] = [
];
