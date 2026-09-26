"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Trophy,
  Award,
  ExternalLink,
  User,
  Flame,
  Zap,
  Target,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { LeaderboardEntry } from "@/types";
import FilterSelect from "@/app/dashboard/components/FilterSelect";
import { CP_SHEET_PROBLEMS } from "@/data/cpSheetProblems";
import { useAuth } from "@/context/AuthContext";
import { cleanCfHandle } from "../services/cfSyncService";

interface LeaderboardTableProps {
  initialEntries: LeaderboardEntry[];
}

export default function LeaderboardTable({ initialEntries }: LeaderboardTableProps) {
  const { user } = useAuth();
  const [leaderboardMode, setLeaderboardMode] = useState<"cpsheet" | "cf">("cpsheet");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"sheetSolved" | "rating" | "solved" | "name">("sheetSolved");

  // Local user sync state
  const [userSheetSolved, setUserSheetSolved] = useState<number>(0);
  const [userHandle, setUserHandle] = useState<string>("");

  const totalSheetProblems = CP_SHEET_PROBLEMS.length;

  // Read current user's local CP sheet progress and Codeforces handle
  useEffect(() => {
    const syncLocalProgress = () => {
      try {
        const storedSolved = localStorage.getItem("mec_cp_sheet_solved_v1");
        if (storedSolved) {
          const parsed = JSON.parse(storedSolved);
          // Exactly match sheet problems to guarantee 100% parity with Problemset tab
          const count = CP_SHEET_PROBLEMS.filter((p) => parsed[p.id]).length;
          setUserSheetSolved(count);
        } else {
          setUserSheetSolved(0);
        }

        const authCf = cleanCfHandle(user?.socialLinks?.codeforces || "");
        const storedHandle = cleanCfHandle(localStorage.getItem("mec_cp_sheet_cf_handle") || "");
        // If user is authenticated, their profile CF handle takes precedence; otherwise use stored practice handle
        setUserHandle(authCf || storedHandle);
      } catch (e) {
        console.warn("Could not read local solved progress", e);
      }
    };

    syncLocalProgress();
    window.addEventListener("storage", syncLocalProgress);
    window.addEventListener("mec_cp_sheet_updated", syncLocalProgress);
    return () => {
      window.removeEventListener("storage", syncLocalProgress);
      window.removeEventListener("mec_cp_sheet_updated", syncLocalProgress);
    };
  }, [user]);

  // Combine and enrich entries:
  // 1. Authenticate and uniquely match at most ONE active user
  // 2. Identify and update active user's entry with their exact local sheet solves
  // 3. If user is active/logged-in/has handle and not in initialEntries, inject their row
  const entriesWithSheet = useMemo(() => {
    const userId = user?._id || user?.id;
    const authCf = cleanCfHandle(user?.socialLinks?.codeforces || "").toLowerCase();
    const authName = (user?.fullName || (user as any)?.name || "").trim().toLowerCase();
    const guestHandle = !user ? cleanCfHandle(userHandle).toLowerCase() : "";

    // Find strictly ONE matching member index for the active visitor
    let matchedIndex = -1;
    if (userId) {
      matchedIndex = initialEntries.findIndex((e) => e.userId && e.userId === userId);
    }
    if (matchedIndex === -1 && authCf) {
      matchedIndex = initialEntries.findIndex(
        (e) => cleanCfHandle(e.handle).toLowerCase() === authCf
      );
    }
    if (matchedIndex === -1 && authName) {
      matchedIndex = initialEntries.findIndex(
        (e) => (e.name || "").trim().toLowerCase() === authName
      );
    }
    if (matchedIndex === -1 && guestHandle) {
      matchedIndex = initialEntries.findIndex(
        (e) => cleanCfHandle(e.handle).toLowerCase() === guestHandle
      );
    }

    const enriched = initialEntries.map((e, idx) => {
      const isThisUser = idx === matchedIndex;
      let sheetSolved = e.sheetSolved ?? 0;

      // Enforce sheet cap
      sheetSolved = Math.min(sheetSolved, totalSheetProblems);

      // If this row belongs to the current user, synchronize with exact local sheet solved count
      if (isThisUser && userSheetSolved > 0) {
        sheetSolved = userSheetSolved;
      }

      return {
        ...e,
        sheetSolved,
        sheetTotal: totalSheetProblems,
        isCurrentUser: isThisUser,
      };
    });

    // If current visitor has solved sheet problems or has a handle/logged-in, but isn't on leaderboard yet:
    if (matchedIndex === -1 && (userSheetSolved > 0 || guestHandle || user)) {
      const activeName = user?.fullName || (user as any)?.name || userHandle || "You (Current Visitor)";
      const activeHandle = userHandle || (user?.email ? user.email.split("@")[0] : "you");

      enriched.push({
        rank: 999,
        name: activeName,
        handle: activeHandle,
        hasCfHandle: Boolean(activeHandle && activeHandle !== "you"),
        platform: "Codeforces",
        rating: (user as any)?.cpStats?.cfRating || 0,
        solved: Math.max((user as any)?.cpStats?.cfSolved || 0, userSheetSolved),
        sheetSolved: userSheetSolved,
        sheetTotal: totalSheetProblems,
        avatar: user?.imageUrl || (user as any)?.avatar,
        designation: user?.designation || "Member",
        batch: user?.batch,
        profileUrl: userId ? `/members/${userId}` : undefined,
        isCurrentUser: true,
      });
    }

    return enriched;
  }, [initialEntries, totalSheetProblems, userSheetSolved, userHandle, user]);

  // Filter options
  const filterOptions = [
    { value: "all", label: "All Members", count: entriesWithSheet.length },
    {
      value: "rated",
      label: "Codeforces Rated",
      count: entriesWithSheet.filter((e) => e.rating > 0).length,
    },
    {
      value: "has_cf",
      label: "Has CF Handle",
      count: entriesWithSheet.filter((e) => e.hasCfHandle).length,
    },
  ];

  const sortOptions = [
    { value: "sheetSolved", label: "Sort: Sheet Solved (High → Low)" },
    { value: "rating", label: "Sort: CF Rating (High → Low)" },
    { value: "solved", label: "Sort: Total Solved (High → Low)" },
    { value: "name", label: "Sort: Name (A → Z)" },
  ];

  // Top stats for CF and Sheet
  const topRated = useMemo(() => {
    const rated = [...entriesWithSheet].filter((e) => e.rating > 0).sort((a, b) => b.rating - a.rating);
    return rated[0];
  }, [entriesWithSheet]);

  const topSolver = useMemo(() => {
    const solved = [...entriesWithSheet].filter((e) => e.solved > 0).sort((a, b) => b.solved - a.solved);
    return solved[0];
  }, [entriesWithSheet]);

  const topSheetSolver = useMemo(() => {
    const sorted = [...entriesWithSheet]
      .filter((e) => (e.sheetSolved || 0) > 0)
      .sort((a, b) => (b.sheetSolved || 0) - (a.sheetSolved || 0));
    return sorted[0];
  }, [entriesWithSheet]);

  const totalProblemsSolved = useMemo(() => {
    return entriesWithSheet.reduce((acc, curr) => acc + (curr.solved || 0), 0);
  }, [entriesWithSheet]);

  const totalSheetSolves = useMemo(() => {
    return entriesWithSheet.reduce((acc, curr) => acc + (curr.sheetSolved || 0), 0);
  }, [entriesWithSheet]);

  // Filtered and sorted entries
  const filteredEntries = useMemo(() => {
    const activeSort = leaderboardMode === "cpsheet" && sortBy === "rating" ? "sheetSolved" : sortBy;

    return entriesWithSheet
      .filter((entry) => {
        // Category filter
        if (categoryFilter === "rated" && (!entry.rating || entry.rating <= 0)) {
          return false;
        }
        if (categoryFilter === "has_cf" && !entry.hasCfHandle) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const nameMatch = entry.name.toLowerCase().includes(q);
          const handleMatch = entry.handle.toLowerCase().includes(q);
          const desigMatch = entry.designation?.toLowerCase().includes(q) || false;
          const batchMatch = entry.batch?.toLowerCase().includes(q) || false;
          return nameMatch || handleMatch || desigMatch || batchMatch;
        }

        return true;
      })
      .sort((a, b) => {
        if (activeSort === "sheetSolved") {
          const diff = (b.sheetSolved || 0) - (a.sheetSolved || 0);
          if (diff !== 0) return diff;
          return b.rating - a.rating;
        }
        if (activeSort === "rating") {
          if (b.rating !== a.rating) return b.rating - a.rating;
          return (b.solved || 0) - (a.solved || 0);
        }
        if (activeSort === "solved") {
          if ((b.solved || 0) !== (a.solved || 0)) return (b.solved || 0) - (a.solved || 0);
          return b.rating - a.rating;
        }
        return a.name.localeCompare(b.name);
      });
  }, [entriesWithSheet, categoryFilter, searchQuery, sortBy, leaderboardMode]);

  // Vibrant Tier Styles
  const getTierColor = (tier?: string) => {
    const t = tier?.toLowerCase() || "";
    if (t.includes("grandmaster")) return "text-rose-400 bg-rose-500/15 border-rose-500/40 shadow-[0_0_8px_rgba(244,63,94,0.3)] font-bold";
    if (t.includes("master")) return "text-amber-400 bg-amber-500/15 border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.3)] font-bold";
    if (t.includes("candidate")) return "text-purple-400 bg-purple-500/15 border-purple-500/40 shadow-[0_0_8px_rgba(168,85,247,0.3)] font-bold";
    if (t.includes("expert")) return "text-blue-400 bg-blue-500/15 border-blue-500/40 shadow-[0_0_8px_rgba(59,130,246,0.3)] font-bold";
    if (t.includes("specialist")) return "text-cyan-400 bg-cyan-500/15 border-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.3)] font-bold";
    if (t.includes("pupil")) return "text-emerald-400 bg-emerald-500/15 border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.3)] font-bold";
    if (t.includes("newbie")) return "text-slate-300 bg-slate-500/15 border-slate-500/40 font-bold";
    return "text-text-tertiary bg-surface-secondary border-border-default";
  };

  return (
    <div className="space-y-6">
      {/* Mode Switcher Banner */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 sm:p-5 bg-surface-elevated border-2 border-border-brutalist dark:border-border-default rounded-2xl shadow-[5px_5px_0px_var(--accent-primary)]">
        <div>
          <h3 className="font-heading text-lg sm:text-xl font-bold text-text-primary flex items-center gap-2">
            <span>Competitive Programming Leaderboard</span>
          </h3>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Compare club rankings across curated Codeforces practice sheets (800–1900) and overall contest ratings.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1.5 rounded-xl bg-surface border-2 border-border-default shrink-0">
          <button
            onClick={() => {
              setLeaderboardMode("cpsheet");
              setSortBy("sheetSolved");
            }}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${leaderboardMode === "cpsheet"
                ? "bg-accent-primary !text-accent-primary-text shadow-[2px_2px_0px_var(--border-brutalist)] font-black"
                : "text-text-secondary hover:text-text-primary font-bold"
              }`}
          >
            <Zap size={16} className={leaderboardMode === "cpsheet" ? "!text-accent-primary-text" : "text-accent-primary"} />
            <span>CP Sheet Ladder</span>
          </button>
          <button
            onClick={() => {
              setLeaderboardMode("cf");
              setSortBy("rating");
            }}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${leaderboardMode === "cf"
                ? "bg-accent-primary !text-accent-primary-text shadow-[2px_2px_0px_var(--border-brutalist)] font-black"
                : "text-text-secondary hover:text-text-primary font-bold"
              }`}
          >
            <Trophy size={16} className={leaderboardMode === "cf" ? "!text-accent-primary-text" : "text-amber-500"} />
            <span>Global Codeforces</span>
          </button>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {leaderboardMode === "cpsheet" ? (
          <>
            <div className="bg-surface-elevated border-2 border-border-brutalist dark:border-border-default rounded-xl p-4 shadow-[4px_4px_0px_var(--accent-primary)] flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-accent-primary/20 text-accent-primary flex items-center justify-center shrink-0 border border-accent-primary/40 shadow-xs">
                <Zap className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <span className="text-xs uppercase tracking-wider font-mono font-bold text-text-tertiary block">
                  Top Sheet Solver
                </span>
                <span className="font-black text-text-primary text-base sm:text-lg truncate block">
                  {topSheetSolver ? `${topSheetSolver.name} (${topSheetSolver.sheetSolved}/${totalSheetProblems})` : "N/A"}
                </span>
              </div>
            </div>

            <div className="bg-surface-elevated border-2 border-border-brutalist dark:border-border-default rounded-xl p-4 shadow-[4px_4px_0px_var(--accent-primary)] flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/40 shadow-xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <span className="text-xs uppercase tracking-wider font-mono font-bold text-text-tertiary block">
                  Total Sheet Solves
                </span>
                <span className="font-black text-text-primary text-base sm:text-lg truncate block">
                  {totalSheetSolves.toLocaleString()} Solved
                </span>
              </div>
            </div>

            <div className="bg-surface-elevated border-2 border-border-brutalist dark:border-border-default rounded-xl p-4 shadow-[4px_4px_0px_var(--accent-primary)] flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/40 shadow-xs">
                <Target className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <span className="text-xs uppercase tracking-wider font-mono font-bold text-text-tertiary block">
                  Practice Sheet Scope
                </span>
                <span className="font-black text-text-primary text-base sm:text-lg truncate block">
                  {totalSheetProblems} Curated Problems
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-surface-elevated border-2 border-border-brutalist dark:border-border-default rounded-xl p-4 shadow-[4px_4px_0px_var(--accent-primary)] flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-400/40 shadow-xs">
                <Trophy className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <span className="text-xs uppercase tracking-wider font-mono font-bold text-text-tertiary block">
                  Top Rated Member
                </span>
                <span className="font-black text-text-primary text-base sm:text-lg truncate block">
                  {topRated ? `${topRated.name} (${topRated.rating})` : "N/A"}
                </span>
              </div>
            </div>

            <div className="bg-surface-elevated border-2 border-border-brutalist dark:border-border-default rounded-xl p-4 shadow-[4px_4px_0px_var(--accent-primary)] flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/40 shadow-xs">
                <Flame className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <span className="text-xs uppercase tracking-wider font-mono font-bold text-text-tertiary block">
                  Top Problem Solver
                </span>
                <span className="font-black text-text-primary text-base sm:text-lg truncate block">
                  {topSolver ? `${topSolver.name} (${topSolver.solved} solved)` : "N/A"}
                </span>
              </div>
            </div>

            <div className="bg-surface-elevated border-2 border-border-brutalist dark:border-border-default rounded-xl p-4 shadow-[4px_4px_0px_var(--accent-primary)] flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/40 shadow-xs">
                <Award className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <span className="text-xs uppercase tracking-wider font-mono font-bold text-text-tertiary block">
                  Total Problems Solved
                </span>
                <span className="font-black text-text-primary text-base sm:text-lg truncate block">
                  {totalProblemsSolved.toLocaleString()} All-Time
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Visitor Sheet Solved Synchronized Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm shadow-xs">
        <div className="flex items-center gap-3">
          <span className="p-2 rounded-xl bg-emerald-500 text-black font-extrabold shadow-xs shrink-0">
            <Zap size={16} />
          </span>
          <div>
            <span className="font-black text-text-primary">Your Practice Progress: </span>
            <span className="font-mono font-black text-emerald-400 text-sm sm:text-base">
              {userSheetSolved}
            </span>{" "}
            of <span className="font-mono font-bold">{totalSheetProblems}</span> curated problems solved (
            {Math.round((userSheetSolved / totalSheetProblems) * 100)}%).
            {userSheetSolved > 0 ? (
              <span className="ml-1 text-text-secondary">
                Your ranking is highlighted below on the scoreboard!
              </span>
            ) : (
              <span className="ml-1 text-text-secondary">
                Head over to the Practice Sheet tab to mark or sync your solves.
              </span>
            )}
          </div>
        </div>
        <Link
          href="/cp-hub?tab=problem-sets"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-emerald-500/40 font-bold text-emerald-400 hover:bg-emerald-500/20 transition-all shrink-0 text-xs sm:text-sm"
        >
          <span>Open Practice Sheet</span>
          <ExternalLink size={13} />
        </Link>
      </div>

      {/* Search & Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-text-secondary absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search member, handle, designation..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-surface-elevated border-2 border-border-brutalist dark:border-border-default rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-primary font-sans text-text-primary placeholder:text-text-tertiary"
          />
        </div>

        {/* Filter and Sort Dropdowns */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <FilterSelect
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={filterOptions}
            placeholder="Filter Category"
          />

          <FilterSelect
            value={sortBy}
            onChange={(v) => setSortBy(v as any)}
            options={sortOptions}
            placeholder="Sort by"
          />
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="w-full bg-surface-elevated border-2 border-border-brutalist dark:border-border-default rounded-2xl overflow-hidden shadow-[5px_5px_0px_var(--border-brutalist)] dark:shadow-[5px_5px_0px_var(--border-default)] transition-all duration-200">
        {/* Table Header */}
        {leaderboardMode === "cpsheet" ? (
          <div className="grid grid-cols-[36px_1fr_75px_58px] sm:grid-cols-[55px_1.7fr_1.1fr_120px_120px_80px_50px] p-2.5 sm:p-3.5 sm:px-5 bg-surface-secondary font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-text-secondary border-b-2 border-border-default">
            <span>#</span>
            <span>Member</span>
            <span className="hidden sm:inline">Handle</span>
            <span className="text-right">Sheet Solved</span>
            <span className="hidden sm:inline text-right">Ladder %</span>
            <span className="text-right">CF Rating</span>
            <span className="hidden sm:inline text-right">Profile</span>
          </div>
        ) : (
          <div className="grid grid-cols-[36px_1fr_70px_58px] sm:grid-cols-[55px_1.8fr_1.2fr_95px_85px_55px] p-2.5 sm:p-3.5 sm:px-5 bg-surface-secondary font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-text-secondary border-b-2 border-border-default">
            <span>#</span>
            <span>Member</span>
            <span className="hidden sm:inline">Handle</span>
            <span className="text-right">Rating</span>
            <span className="text-right">CF Solved</span>
            <span className="hidden sm:inline text-right">Profile</span>
          </div>
        )}

        {/* Rows */}
        {filteredEntries.length === 0 ? (
          <div className="p-12 text-center text-text-secondary text-sm sm:text-base font-medium">
            No club members match your search or filter.
          </div>
        ) : (
          filteredEntries.map((entry, index) => {
            const actualRank = index + 1;
            const isTop1 = actualRank === 1;
            const isTop2 = actualRank === 2;
            const isTop3 = actualRank === 3;
            const isCurrentUser = (entry as any).isCurrentUser;

            const avatarSrc =
              entry.imageUrl ||
              entry.avatar ||
              `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(entry.name)}&backgroundColor=transparent`;

            const sheetPct =
              totalSheetProblems > 0
                ? Math.min(100, Math.round(((entry.sheetSolved || 0) / totalSheetProblems) * 100))
                : 0;

            if (leaderboardMode === "cpsheet") {
              return (
                <div
                  key={entry.userId || entry.handle || actualRank}
                  className={`grid grid-cols-[36px_1fr_75px_58px] sm:grid-cols-[55px_1.7fr_1.1fr_120px_120px_80px_50px] p-2.5 sm:p-3.5 sm:px-5 border-t border-border-default items-center transition-colors hover:bg-surface-secondary/70 ${isCurrentUser
                      ? "border-l-4 border-l-accent-primary bg-accent-primary/10 shadow-inner"
                      : isTop1
                        ? "border-l-4 border-l-amber-400 bg-amber-400/10"
                        : isTop2
                          ? "border-l-4 border-l-slate-400 bg-slate-400/10"
                          : isTop3
                            ? "border-l-4 border-l-amber-600 bg-amber-600/10"
                            : ""
                    }`}
                >
                  {/* Rank */}
                  <div className="flex items-center font-mono font-black">
                    {isTop1 ? (
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-amber-400 text-black text-xs font-black shadow-xs">
                        #1
                      </span>
                    ) : isTop2 ? (
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-xs font-black shadow-xs">
                        #2
                      </span>
                    ) : isTop3 ? (
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-amber-700/25 text-amber-800 dark:text-amber-300 border border-amber-600/40 text-xs font-black shadow-xs">
                        #3
                      </span>
                    ) : (
                      <span className="text-text-secondary text-xs sm:text-base font-bold">#{actualRank}</span>
                    )}
                  </div>

                  {/* Member Name & Avatar */}
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden shrink-0 border-2 border-border-default bg-surface-secondary">
                      <img
                        src={avatarSrc}
                        alt={entry.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(entry.name)}&backgroundColor=transparent`;
                        }}
                      />
                    </div>
                    <div className="min-w-0 truncate">
                      <div className="flex items-center gap-1.5 truncate">
                        {entry.profileUrl ? (
                          <Link
                            href={entry.profileUrl}
                            className="font-bold text-text-primary hover:text-accent-primary transition-colors truncate block text-sm sm:text-base"
                          >
                            {entry.name}
                          </Link>
                        ) : (
                          <span className="font-bold text-text-primary truncate block text-sm sm:text-base">
                            {entry.name}
                          </span>
                        )}
                        {isCurrentUser && (
                          <span className="px-1.5 py-0.5 rounded bg-accent-primary !text-accent-primary-text font-mono text-[10px] font-black uppercase tracking-wider shrink-0 shadow-2xs">
                            YOU
                          </span>
                        )}
                      </div>

                      {/* Mobile: inline handle */}
                      <div className="sm:hidden flex items-center gap-1 font-mono text-xs text-text-secondary truncate mt-0.5">
                        <span className="text-accent-primary font-bold truncate">@{entry.handle}</span>
                      </div>

                      {/* Desktop: designation & batch */}
                      <div className="hidden sm:flex items-center gap-1.5 text-xs text-text-tertiary truncate mt-0.5">
                        {entry.designation && <span className="font-medium">{entry.designation}</span>}
                        {entry.designation && entry.batch && <span>•</span>}
                        {entry.batch && <span>{entry.batch}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Desktop Handle */}
                  <div className="hidden sm:block min-w-0 pr-2">
                    {entry.hasCfHandle ? (
                      <a
                        href={`https://codeforces.com/profile/${entry.handle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs sm:text-sm text-accent-primary hover:underline inline-flex items-center gap-1 truncate max-w-full font-bold"
                        title={`Open Codeforces: ${entry.handle}`}
                      >
                        @{entry.handle}
                        <ExternalLink className="w-3 h-3 opacity-60 shrink-0" />
                      </a>
                    ) : (
                      <span className="font-mono text-xs sm:text-sm text-text-tertiary truncate">
                        {entry.handle}
                      </span>
                    )}
                  </div>

                  {/* Sheet Solved Count (Exact parity with Problemset tab) */}
                  <div className="text-right">
                    <span className="font-mono font-black text-sm sm:text-lg text-emerald-400">
                      {entry.sheetSolved || 0}
                    </span>
                    <span className="text-[11px] sm:text-xs font-mono text-text-secondary font-bold">
                      {" "}/ {totalSheetProblems}
                    </span>
                  </div>

                  {/* Ladder Progress Bar (Desktop) */}
                  <div className="hidden sm:flex items-center justify-end gap-2 text-right">
                    <div className="w-20 h-2 sm:h-2.5 bg-surface rounded-full overflow-hidden border border-border-default/60">
                      <div
                        className="h-full bg-accent-primary transition-all duration-500"
                        style={{ width: `${sheetPct}%` }}
                      />
                    </div>
                    <span className="font-mono text-xs sm:text-sm font-bold text-text-secondary w-9">
                      {sheetPct}%
                    </span>
                  </div>

                  {/* CF Rating */}
                  <div className="text-right font-mono font-black text-xs sm:text-base text-text-primary">
                    {entry.rating > 0 ? entry.rating : "—"}
                  </div>

                  {/* Profile Link */}
                  <div className="hidden sm:block text-right">
                    {entry.profileUrl ? (
                      <Link
                        href={entry.profileUrl}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-border-default bg-surface-secondary text-text-secondary hover:text-accent-primary hover:border-accent-primary transition-colors"
                        title="View Member Profile"
                      >
                        <User className="w-4 h-4" />
                      </Link>
                    ) : null}
                  </div>
                </div>
              );
            }

            // Standard "cf" mode row
            return (
              <div
                key={entry.userId || entry.handle || actualRank}
                className={`grid grid-cols-[36px_1fr_70px_58px] sm:grid-cols-[55px_1.8fr_1.2fr_95px_85px_55px] p-2.5 sm:p-3.5 sm:px-5 border-t border-border-default items-center transition-colors hover:bg-surface-secondary/70 ${isCurrentUser
                    ? "border-l-4 border-l-accent-primary bg-accent-primary/10 shadow-inner"
                    : isTop1
                      ? "border-l-4 border-l-amber-400 bg-amber-400/10"
                      : isTop2
                        ? "border-l-4 border-l-slate-400 bg-slate-400/10"
                        : isTop3
                          ? "border-l-4 border-l-amber-600 bg-amber-600/10"
                          : ""
                  }`}
              >
                {/* Rank */}
                <div className="flex items-center font-mono font-black">
                  {isTop1 ? (
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-amber-400 text-black text-xs font-black shadow-xs">
                      #1
                    </span>
                  ) : isTop2 ? (
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-xs font-black shadow-xs">
                      #2
                    </span>
                  ) : isTop3 ? (
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-amber-700/25 text-amber-800 dark:text-amber-300 border border-amber-600/40 text-xs font-black shadow-xs">
                      #3
                    </span>
                  ) : (
                    <span className="text-text-secondary text-xs sm:text-base font-bold">#{actualRank}</span>
                  )}
                </div>

                {/* Member Name & Avatar */}
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden shrink-0 border-2 border-border-default bg-surface-secondary">
                    <img
                      src={avatarSrc}
                      alt={entry.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(entry.name)}&backgroundColor=transparent`;
                      }}
                    />
                  </div>
                  <div className="min-w-0 truncate">
                    <div className="flex items-center gap-1.5 truncate">
                      {entry.profileUrl ? (
                        <Link
                          href={entry.profileUrl}
                          className="font-bold text-text-primary hover:text-accent-primary transition-colors truncate block text-sm sm:text-base"
                        >
                          {entry.name}
                        </Link>
                      ) : (
                        <span className="font-bold text-text-primary truncate block text-sm sm:text-base">
                          {entry.name}
                        </span>
                      )}
                      {isCurrentUser && (
                        <span className="px-1.5 py-0.5 rounded bg-accent-primary !text-accent-primary-text font-mono text-[10px] font-black uppercase tracking-wider shrink-0 shadow-2xs">
                          YOU
                        </span>
                      )}
                    </div>

                    {/* Mobile: inline handle & tier */}
                    <div className="sm:hidden flex items-center gap-1 font-mono text-xs text-text-secondary truncate mt-0.5">
                      <span className="text-accent-primary font-bold truncate">@{entry.handle}</span>
                      {entry.tier && (
                        <span className="uppercase text-[10px] font-extrabold text-accent-primary">({entry.tier})</span>
                      )}
                    </div>

                    {/* Desktop: designation & batch */}
                    <div className="hidden sm:flex items-center gap-1.5 text-xs text-text-tertiary truncate mt-0.5">
                      {entry.designation && <span className="font-medium">{entry.designation}</span>}
                      {entry.designation && entry.batch && <span>•</span>}
                      {entry.batch && <span>{entry.batch}</span>}
                    </div>
                  </div>
                </div>

                {/* Desktop Handle & Tier Column */}
                <div className="hidden sm:block min-w-0 pr-2">
                  {entry.hasCfHandle ? (
                    <div className="flex flex-col items-start gap-1">
                      <a
                        href={`https://codeforces.com/profile/${entry.handle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs sm:text-sm text-accent-primary hover:underline inline-flex items-center gap-1 truncate max-w-full font-bold"
                        title={`Open Codeforces: ${entry.handle}`}
                      >
                        @{entry.handle}
                        <ExternalLink className="w-3 h-3 opacity-60 shrink-0" />
                      </a>
                      {entry.tier && (
                        <span
                          className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${getTierColor(
                            entry.tier
                          )}`}
                        >
                          {entry.tier}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-start gap-1">
                      <span className="font-mono text-xs sm:text-sm text-text-tertiary truncate">
                        {entry.handle}
                      </span>
                      <span className="text-[10px] font-bold text-text-tertiary uppercase">
                        Unrated
                      </span>
                    </div>
                  )}
                </div>

                {/* CF Rating */}
                <div className="text-right">
                  <span
                    className={`font-mono font-black text-xs sm:text-base ${entry.rating > 0 ? "text-accent-primary" : "text-text-tertiary font-normal"
                      }`}
                  >
                    {entry.rating > 0 ? entry.rating : "—"}
                  </span>
                  {entry.maxRating && entry.maxRating > entry.rating ? (
                    <span className="block text-[10px] font-mono text-text-tertiary font-bold">
                      max: {entry.maxRating}
                    </span>
                  ) : null}
                </div>

                {/* CF Solved (All-Time) with Sheet Solved Sub-badge */}
                <div className="text-right">
                  <span className="font-mono font-black text-text-primary text-xs sm:text-base block">
                    {entry.solved > 0 ? entry.solved : 0}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-mono text-emerald-400 font-bold block">
                    {entry.sheetSolved || 0} sheet
                  </span>
                </div>

                {/* Action Link to Profile (Desktop only) */}
                <div className="hidden sm:block text-right">
                  {entry.profileUrl ? (
                    <Link
                      href={entry.profileUrl}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-border-default bg-surface-secondary text-text-secondary hover:text-accent-primary hover:border-accent-primary transition-colors"
                      title="View Member Profile"
                    >
                      <User className="w-4 h-4" />
                    </Link>
                  ) : null}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
