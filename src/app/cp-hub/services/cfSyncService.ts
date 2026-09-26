/**
 * Codeforces Sync Service
 * Fetches user submissions from the public Codeforces API and returns
 * the set of solved problem IDs (e.g., ["1903A", "1901A", ...]).
 */

export interface SolvedSubmissionInfo {
  id: string;
  contestId: number;
  index: string;
  name: string;
  rating?: number;
}

export interface CFUserInfo {
  rating?: number;
  maxRating?: number;
  rank?: string;
  maxRank?: string;
  avatar?: string;
  titlePhoto?: string;
  firstName?: string;
  organization?: string;
}

export interface CFSyncResult {
  success: boolean;
  handle: string;
  totalSubmissionsFetched: number;
  totalPlatformSolved: number;
  solvedProblemIds: string[];
  solvedSubmissions?: SolvedSubmissionInfo[];
  userInfo?: CFUserInfo;
  matchedInSheetCount?: number;
  error?: string;
}

/**
 * Normalizes a problem title for robust cross-contest / twin-round matching.
 * e.g., "Copil Copac Draws Trees" -> "copilcopacdrawstrees"
 */
export function normalizeProblemTitle(title: string): string {
  if (!title) return "";
  return title.toLowerCase().replace(/[^a-z0-9]/g, "");
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
 * Fetch all accepted submissions and user profile info for the given Codeforces handle.
 */
export async function fetchCodeforcesSolved(rawHandle: string): Promise<CFSyncResult> {
  const handle = cleanCfHandle(rawHandle);
  if (!handle) {
    return {
      success: false,
      handle: "",
      totalSubmissionsFetched: 0,
      totalPlatformSolved: 0,
      solvedProblemIds: [],
      error: "Please enter a valid Codeforces handle.",
    };
  }

  try {
    const [statusRes, infoRes] = await Promise.all([
      fetch(`https://codeforces.com/api/user.status?handle=${encodeURIComponent(handle)}&from=1&count=5000`),
      fetch(`https://codeforces.com/api/user.info?handles=${encodeURIComponent(handle)}`).catch(() => null),
    ]);

    if (!statusRes.ok) {
      if (statusRes.status === 400 || statusRes.status === 404) {
        return {
          success: false,
          handle,
          totalSubmissionsFetched: 0,
          totalPlatformSolved: 0,
          solvedProblemIds: [],
          error: `Codeforces handle "${handle}" not found. Please check spelling.`,
        };
      }
      throw new Error(`Codeforces API responded with HTTP status ${statusRes.status}`);
    }

    const data = await statusRes.json();
    if (data.status !== "OK") {
      return {
        success: false,
        handle,
        totalSubmissionsFetched: 0,
        totalPlatformSolved: 0,
        solvedProblemIds: [],
        error: data.comment || "Failed to retrieve submissions from Codeforces.",
      };
    }

    let userInfo: CFUserInfo | undefined = undefined;
    if (infoRes && infoRes.ok) {
      try {
        const infoData = await infoRes.json();
        if (infoData.status === "OK" && Array.isArray(infoData.result) && infoData.result.length > 0) {
          const u = infoData.result[0];
          userInfo = {
            rating: u.rating,
            maxRating: u.maxRating,
            rank: u.rank,
            maxRank: u.maxRank,
            avatar: u.avatar,
            titlePhoto: u.titlePhoto,
            firstName: u.firstName,
            organization: u.organization,
          };
        }
      } catch {
        // Ignore user.info parsing failure
      }
    }

    const solvedSet = new Set<string>();
    const solvedSubmissions: SolvedSubmissionInfo[] = [];
    const submissions = Array.isArray(data.result) ? data.result : [];

    for (const sub of submissions) {
      if (sub.verdict === "OK" && sub.problem?.contestId && sub.problem?.index) {
        const contestId = Number(sub.problem.contestId);
        const index = String(sub.problem.index).toUpperCase();
        const id = `${contestId}${index}`;
        if (!solvedSet.has(id)) {
          solvedSet.add(id);
          solvedSubmissions.push({
            id,
            contestId,
            index,
            name: sub.problem.name || "",
            rating: typeof sub.problem.rating === "number" ? sub.problem.rating : undefined,
          });
        }
      }
    }

    return {
      success: true,
      handle,
      totalSubmissionsFetched: submissions.length,
      totalPlatformSolved: solvedSet.size,
      solvedProblemIds: Array.from(solvedSet),
      solvedSubmissions,
      userInfo,
    };
  } catch (err: any) {
    return {
      success: false,
      handle,
      totalSubmissionsFetched: 0,
      totalPlatformSolved: 0,
      solvedProblemIds: [],
      error:
        err?.message ||
        "Failed to connect to Codeforces. The API might be busy or network is offline.",
    };
  }
}
