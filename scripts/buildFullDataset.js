const fs = require('fs');
const path = require('path');

async function main() {
  console.log('Loading scratch_problems and matched problems...');
  const scratch = require('../scratch_problems.json');
  const matched = require('../cp_matched_problems.json');

  // Map file names to matched problem
  // scratch[rating] has the file names in order
  const fileToProblem = new Map();
  const ratings = ['800', '900', '1000', '1100', '1200', '1300', '1400', '1500', '1600'];

  // Match each problem in matched to its rating and file
  let matchedIndex = 0;
  ratings.forEach(r => {
    const files = scratch[r] || [];
    const problemsForRating = matched.filter(p => p.rating === Number(r));
    files.forEach((f, idx) => {
      if (idx < problemsForRating.length) {
        fileToProblem.set(`${r}/${f}`, problemsForRating[idx]);
      }
    });
  });

  console.log('Fetching solution codes in parallel batches...');
  const filesList = [];
  ratings.forEach(r => {
    const files = scratch[r] || [];
    files.forEach(f => {
      filesList.push({ rating: r, file: f });
    });
  });

  const codesMap = new Map();
  const BATCH_SIZE = 20;

  for (let i = 0; i < filesList.length; i += BATCH_SIZE) {
    const batch = filesList.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async ({ rating, file }) => {
        const url = `https://raw.githubusercontent.com/Tejas-Santosh-Nalawade/CP-31-Sheet/main/${rating}/${encodeURIComponent(file)}`;
        try {
          const res = await fetch(url);
          if (res.ok) {
            const text = await res.text();
            codesMap.set(`${rating}/${file}`, text.trim());
          }
        } catch (e) {
          console.warn('Failed to fetch:', url);
        }
      })
    );
    process.stdout.write(`Fetched ${Math.min(i + BATCH_SIZE, filesList.length)} / ${filesList.length}\r`);
  }
  console.log('\nAll codes fetched!');

  // Common hints generator based on topics and problem properties
  function generateHint(p) {
    const t = p.title.toLowerCase();
    const tags = p.tags || [];

    if (p.id === '1903A') return 'If k >= 2, you can swap any two adjacent elements by reversing a size-2 subarray, which allows bubble sorting any permutation. If k = 1, can you reorder elements at all?';
    if (p.id === '1901A') return 'Calculate distances between consecutive gas stations. Note that travelling from the last station to x and turning back requires double the distance between the last station and x.';
    if (p.id === '1900A') return "Look for three consecutive empty cells '...'. With three dots, you can create infinite water in just 2 moves. If no three dots exist, count the individual empty cells.";
    if (p.id === '1899A') return 'Vanya wins if (n - 1) or (n + 1) is divisible by 3, which happens whenever n % 3 != 0. Otherwise, Vova can always counter Vanya and win.';
    if (p.id === '1896A') return 'Notice that the first element a[1] can never be swapped because an index i must satisfy 1 < i < n. If a[1] is not 1, is it ever possible to sort the array?';
    if (p.id === '1890A') return 'An array can be made good if and only if it consists of at most 2 distinct elements, and their frequencies differ by at most 1.';
    if (p.id === '1904A') return 'Generate all 8 knight-like moves relative to the King and Queen. Count how many positions are reachable from both.';
    if (p.id === '1883B') return 'In any palindrome, at most one character can have an odd frequency. Count how many characters have odd counts in the string.';
    if (p.id === '1875A') return 'Use each tool greedily whenever the timer is about to run out or immediately when it avoids capping past max capacity.';
    if (p.id === '1913B') return "Count the total number of '0's and '1's available in the string. Greedily pair each prefix character with the opposite digit from the pool.";
    if (p.id === '1883C') return 'For k = 2, 3, or 5, you just need a number divisible by k. For k = 4, either two even numbers or one number congruent to 0 or 3 mod 4 will minimize operations.';
    if (p.id === '1876A') return 'Greedily hire the resident with the cheapest sharing cost who still has remaining sharing capacity to notify others.';

    if (tags.includes('greedy')) return `Consider an optimal local choice: how does sorting or scanning the elements from left to right reduce redundant states?`;
    if (tags.includes('binary search')) return `Check if the predicate is monotonic. Can you binary search the answer or check feasibility with an O(N) validator?`;
    if (tags.includes('two pointers')) return `Maintain two pointers or a sliding window. When expanding or shrinking the interval, how does the condition change?`;
    if (tags.includes('dp')) return `Define the subproblem dp[i]: what state transitions determine the answer for the prefix or suffix?`;
    if (tags.includes('math') || tags.includes('number theory')) return `Analyze the parity, prime factors, or modular arithmetic properties of the inputs.`;
    if (tags.includes('bitmasks')) return `Analyze the bits independently. How do bitwise operations affect each column or power of 2?`;
    if (tags.includes('graphs') || tags.includes('dfs and similar')) return `Model the relationships as graph edges and consider BFS/DFS connectivity or bipartite properties.`;
    return `Observe the smallest or largest elements first, and see what invariants remain unchanged after each operation.`;
  }

  // Build full problems array
  const fullProblems = [];
  ratings.forEach(r => {
    const files = scratch[r] || [];
    const problemsForRating = matched.filter(p => p.rating === Number(r));
    files.forEach((f, idx) => {
      if (idx < problemsForRating.length) {
        const p = problemsForRating[idx];
        const code = codesMap.get(`${r}/${f}`) || '';
        fullProblems.push({
          id: p.id,
          contestId: p.contestId,
          index: p.index,
          title: p.title,
          rating: p.rating,
          order: p.order,
          url: p.url,
          tags: p.tags,
          hint: generateHint(p),
          videoUrl: `https://www.youtube.com/results?search_query=codeforces+${p.id}+${encodeURIComponent(p.title)}+editorial`,
          solutionCode: {
            cpp: code,
          },
        });
      }
    });
  });

  const outputTsPath = path.resolve(__dirname, '../src/data/cpSheetProblems.ts');

  const fileContent = `/**
 * TLE-31 Competitive Programming Practice Sheet Dataset
 * Curated Codeforces problems across ratings 800 to 1600.
 */

export interface CPProblem {
  id: string; // e.g. "1903A"
  contestId: number;
  index: string;
  title: string;
  rating: number;
  order: number;
  url: string;
  tags: string[];
  hint: string;
  videoUrl: string;
  solutionCode?: {
    cpp?: string;
    python?: string;
  };
}

export const CP_SHEET_PROBLEMS: CPProblem[] = ${JSON.stringify(fullProblems, null, 2)};

export const RATINGS_LIST = [800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600] as const;
export type CPRating = (typeof RATINGS_LIST)[number];

export function getProblemsByRating(rating: number): CPProblem[] {
  return CP_SHEET_PROBLEMS.filter((p) => p.rating === rating);
}

export function getAllRatings(): number[] {
  return [...RATINGS_LIST];
}

export function getRatingColor(rating: number): {
  text: string;
  bg: string;
  border: string;
  badge: string;
  label: string;
} {
  if (rating < 1200) {
    return {
      text: "text-zinc-400 dark:text-zinc-300",
      bg: "bg-zinc-500/10",
      border: "border-zinc-500/30",
      badge: "bg-zinc-700/20 text-zinc-300 border-zinc-600/30",
      label: "Newbie",
    };
  }
  if (rating < 1400) {
    return {
      text: "text-emerald-500 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      label: "Pupil",
    };
  }
  if (rating < 1600) {
    return {
      text: "text-cyan-500 dark:text-cyan-400",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/30",
      badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
      label: "Specialist",
    };
  }
  return {
    text: "text-blue-500 dark:text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    badge: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    label: "Expert",
  };
}
`;

  fs.writeFileSync(outputTsPath, fileContent, 'utf8');
  console.log(`Successfully generated ${outputTsPath} with ${fullProblems.length} problems!`);
}

main().catch(console.error);
