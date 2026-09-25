/**
 * Codeforces Sync Service
 * Fetches user submissions from the public Codeforces API and returns
 * the set of solved problem IDs (e.g., ["1903A", "1901A", ...]).
 */

export interface CFSyncResult {
  success: boolean;
  handle: string;
  totalSubmissionsFetched: number;
  solvedProblemIds: string[];
  matchedInSheetCount?: number;
  error?: string;
}

/**
 * Extracts clean handle from raw username or full profile URL.
 * e.g. "https://codeforces.com/profile/tourist" -> "tourist"
 */
export function cleanCfHandle(rawHandleOrUrl: string): string {
  if (!rawHandleOrUrl) return "";
  let clean = rawHandleOrUrl.trim();
  clean = clean.replace(/^https?:\/\/(www\.)?codeforces\.com\/profile\//i, "");
  clean = clean.replace(/[/?#].*$/, "").trim();
  return clean;
}

/**
 * Fetch all accepted submissions for the given Codeforces handle.
 */
export async function fetchCodeforcesSolved(rawHandle: string): Promise<CFSyncResult> {
  const handle = cleanCfHandle(rawHandle);
  if (!handle) {
    return {
      success: false,
      handle: "",
      totalSubmissionsFetched: 0,
      solvedProblemIds: [],
      error: "Please enter a valid Codeforces handle.",
    };
  }

  try {
    const response = await fetch(
      `https://codeforces.com/api/user.status?handle=${encodeURIComponent(handle)}&from=1&count=5000`
    );

    if (!response.ok) {
      if (response.status === 400 || response.status === 404) {
        return {
          success: false,
          handle,
          totalSubmissionsFetched: 0,
          solvedProblemIds: [],
          error: `Codeforces handle "${handle}" not found. Please check spelling.`,
        };
      }
      throw new Error(`Codeforces API responded with HTTP status ${response.status}`);
    }

    const data = await response.json();
    if (data.status !== "OK") {
      return {
        success: false,
        handle,
        totalSubmissionsFetched: 0,
        solvedProblemIds: [],
        error: data.comment || "Failed to retrieve submissions from Codeforces.",
      };
    }

    const solvedSet = new Set<string>();
    const submissions = Array.isArray(data.result) ? data.result : [];

    for (const sub of submissions) {
      if (sub.verdict === "OK" && sub.problem?.contestId && sub.problem?.index) {
        const id = `${sub.problem.contestId}${sub.problem.index.toUpperCase()}`;
        solvedSet.add(id);
      }
    }

    return {
      success: true,
      handle,
      totalSubmissionsFetched: submissions.length,
      solvedProblemIds: Array.from(solvedSet),
    };
  } catch (err: any) {
    return {
      success: false,
      handle,
      totalSubmissionsFetched: 0,
      solvedProblemIds: [],
      error:
        err?.message ||
        "Failed to connect to Codeforces. The API might be busy or network is offline.",
    };
  }
}
