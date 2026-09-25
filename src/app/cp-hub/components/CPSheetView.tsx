"use client";

import React, { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import {
  CP_SHEET_PROBLEMS,
  CPProblem,
} from "@/data/cpSheetProblems";
import {
  fetchCodeforcesSolved,
  cleanCfHandle,
  normalizeProblemTitle,
  CFUserInfo,
} from "../services/cfSyncService";
import CPSheetSidebar from "./CPSheetSidebar";
import CPSheetTopBar from "./CPSheetTopBar";
import CPSheetProblemTable from "./CPSheetProblemTable";
import { HintModal, CodeModal } from "./CPSheetModals";
import ConfirmationModal from "@/components/ui/shared/ConfirmModal";

const STORAGE_KEY_SOLVED = "mec_cp_sheet_solved_v1";
const STORAGE_KEY_HANDLE = "mec_cp_sheet_cf_handle";
const STORAGE_KEY_SYNC_TIME = "mec_cp_sheet_last_sync";
const STORAGE_KEY_TOTAL_CF = "mec_cp_sheet_total_cf_solved";
const STORAGE_KEY_USER_INFO = "mec_cp_sheet_cf_user_info";

export default function CPSheetView() {
  const { user } = useAuth();

  // Active rating selection
  const [selectedRating, setSelectedRating] = useState<number>(800);

  // Solved state map: { [problemId]: boolean }
  const [solvedMap, setSolvedMap] = useState<Record<string, boolean>>({});

  // Codeforces handle & profile metrics
  const [cfHandle, setCfHandle] = useState<string>("");
  const [totalCfSolved, setTotalCfSolved] = useState<number>(0);
  const [cfUserInfo, setCfUserInfo] = useState<CFUserInfo | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  // Search & Status filters
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"all" | "solved" | "unsolved">("all");
  const [showAllTags, setShowAllTags] = useState<boolean>(false);

  // Modal active states
  const [hintProblem, setHintProblem] = useState<CPProblem | null>(null);
  const [codeProblem, setCodeProblem] = useState<CPProblem | null>(null);

  // Reset confirmation modal state
  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false);

  // Initialize from user profile, localStorage, and immediately live-fetch fresh Codeforces stats
  useEffect(() => {
    try {
      const storedSolved = localStorage.getItem(STORAGE_KEY_SOLVED);
      if (storedSolved) {
        const parsed = JSON.parse(storedSolved);
        if (parsed && typeof parsed === "object") {
          setSolvedMap(parsed);
        }
      }

      const storedTotalCf = localStorage.getItem(STORAGE_KEY_TOTAL_CF);
      if (storedTotalCf) {
        setTotalCfSolved(Number(storedTotalCf));
      }

      const storedUserInfo = localStorage.getItem(STORAGE_KEY_USER_INFO);
      if (storedUserInfo) {
        try {
          setCfUserInfo(JSON.parse(storedUserInfo));
        } catch {}
      }

      // The authenticated user's profile Codeforces handle is authoritative
      const profileHandle = cleanCfHandle(user?.socialLinks?.codeforces || "");
      const storedHandle = cleanCfHandle(localStorage.getItem(STORAGE_KEY_HANDLE) || "");
      const activeHandle = profileHandle || storedHandle;

      if (activeHandle) {
        setCfHandle(activeHandle);
        localStorage.setItem(STORAGE_KEY_HANDLE, activeHandle);

        // Always run dedicated live fetch on mount in the background to ensure 100% fresh data
        handleSyncCodeforces(activeHandle, true);
      }

      const storedTime = localStorage.getItem(STORAGE_KEY_SYNC_TIME);
      if (storedTime) {
        setLastSyncedAt(storedTime);
      }
    } catch (e) {
      console.warn("Could not load CP sheet data from localStorage", e);
    }
  }, [user]);

  // Persist solved state changes
  const saveSolvedMap = (newMap: Record<string, boolean>) => {
    setSolvedMap(newMap);
    try {
      localStorage.setItem(STORAGE_KEY_SOLVED, JSON.stringify(newMap));
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("mec_cp_sheet_updated"));
      }
    } catch (e) {
      console.error("Failed to save solved map to localStorage", e);
    }
  };

  // Toggle solve status manually
  const handleToggleSolve = (problemId: string) => {
    const isCurrentlySolved = Boolean(solvedMap[problemId]);
    const updated = {
      ...solvedMap,
      [problemId]: !isCurrentlySolved,
    };
    saveSolvedMap(updated);

    if (!isCurrentlySolved) {
      toast.success("Problem marked as solved!", { id: "cp-solve-toggle", duration: 1500 });
    }
  };

  // Codeforces Auto-Sync using user's CF handle
  const handleSyncCodeforces = async (targetHandle?: string, isSilent: boolean = false) => {
    const handleToFetch = targetHandle || cfHandle || cleanCfHandle(user?.socialLinks?.codeforces || "");
    const cleaned = cleanCfHandle(handleToFetch);
    if (!cleaned) {
      if (!isSilent) toast.error("Please link your Codeforces handle in your profile to auto-sync.");
      return;
    }

    setIsSyncing(true);
    const toastId = !isSilent ? toast.loading(`Fetching Codeforces submissions for @${cleaned}...`) : undefined;

    try {
      localStorage.setItem(STORAGE_KEY_HANDLE, cleaned);
      setCfHandle(cleaned);

      const result = await fetchCodeforcesSolved(cleaned);

      if (!result.success) {
        if (!isSilent && toastId) toast.error(result.error || "Sync failed", { id: toastId });
        setIsSyncing(false);
        return;
      }

      if (result.totalPlatformSolved) {
        setTotalCfSolved(result.totalPlatformSolved);
        try {
          localStorage.setItem(STORAGE_KEY_TOTAL_CF, String(result.totalPlatformSolved));
        } catch {}
      }

      if (result.userInfo) {
        setCfUserInfo(result.userInfo);
        try {
          localStorage.setItem(STORAGE_KEY_USER_INFO, JSON.stringify(result.userInfo));
        } catch {}
      }

      // Match solved problems with problems in our sheet for his handle
      // 1. Exact ID matching
      const cfSolvedIds = new Set(result.solvedProblemIds);
      const updated: Record<string, boolean> = {};

      for (const p of CP_SHEET_PROBLEMS) {
        if (cfSolvedIds.has(p.id)) {
          updated[p.id] = true;
        }
      }

      // 2. Twin round matching (Div 1 / Div 2 twin rounds or Gym mirrors)
      if (result.solvedSubmissions) {
        for (const sub of result.solvedSubmissions) {
          if (!sub.name || !sub.rating) continue;
          const normSubName = normalizeProblemTitle(sub.name);

          for (const p of CP_SHEET_PROBLEMS) {
            if (!updated[p.id] && p.rating === sub.rating) {
              const normPTitle = normalizeProblemTitle(p.title);
              if (normPTitle === normSubName) {
                const diff = Math.abs(sub.contestId - p.contestId);
                if (diff <= 10 || sub.contestId >= 100000) {
                  updated[p.id] = true;
                }
              }
            }
          }
        }
      }

      const totalSolvedCount = Object.keys(updated).length;
      saveSolvedMap(updated);

      const now = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setLastSyncedAt(now);
      localStorage.setItem(STORAGE_KEY_SYNC_TIME, now);

      if (!isSilent && toastId) {
        toast.success(
          `Synced with Codeforces! ${totalSolvedCount} of ${CP_SHEET_PROBLEMS.length} sheet problems solved for @${cleaned}.`,
          { id: toastId, duration: 4000 }
        );
      }
    } catch (err: any) {
      if (!isSilent && toastId) {
        toast.error("An error occurred during sync.", { id: toastId });
      }
    } finally {
      setIsSyncing(false);
    }
  };

  // Reset all progress
  const confirmResetProgress = () => {
    saveSolvedMap({});
    toast.success("All practice progress has been reset.");
    setIsResetModalOpen(false);
  };

  // Filter problems for the selected rating
  const displayedProblems = useMemo(() => {
    let list = CP_SHEET_PROBLEMS.filter((p) => p.rating === selectedRating);

    // Filter by status
    if (statusFilter === "solved") {
      list = list.filter((p) => solvedMap[p.id]);
    } else if (statusFilter === "unsolved") {
      list = list.filter((p) => !solvedMap[p.id]);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => {
        const titleMatch = p.title.toLowerCase().includes(q);
        const idMatch = p.id.toLowerCase().includes(q);
        const tagMatch = p.tags.some((t) => t.toLowerCase().includes(q));
        return titleMatch || idMatch || tagMatch;
      });
    }

    return list;
  }, [selectedRating, solvedMap, statusFilter, searchQuery]);

  return (
    <section className="container mx-auto px-4 md:px-8 max-w-7xl space-y-6">
      {/* Top Bar with global stats & Codeforces sync */}
      <CPSheetTopBar
        problems={CP_SHEET_PROBLEMS}
        solvedMap={solvedMap}
        cfHandle={cfHandle}
        totalCfSolved={totalCfSolved}
        cfUserInfo={cfUserInfo}
        onSync={() => handleSyncCodeforces(cfHandle, false)}
        isSyncing={isSyncing}
        lastSyncedAt={lastSyncedAt}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onResetProgress={() => setIsResetModalOpen(true)}
        selectedRating={selectedRating}
        showAllTags={showAllTags}
        setShowAllTags={setShowAllTags}
      />

      {/* Main Content: Sidebar + Problem Table */}
      <div className="flex flex-col lg:flex-row items-start gap-6">
        {/* Rating Sidebar (Left) */}
        <CPSheetSidebar
          selectedRating={selectedRating}
          onSelectRating={setSelectedRating}
          solvedMap={solvedMap}
          problems={CP_SHEET_PROBLEMS}
        />

        {/* Problem List (Right) */}
        <div className="flex-1 w-full min-w-0">
          <CPSheetProblemTable
            key={selectedRating}
            problems={displayedProblems}
            solvedMap={solvedMap}
            onToggleSolve={handleToggleSolve}
            onOpenHint={(p) => setHintProblem(p)}
            onOpenCode={(p) => setCodeProblem(p)}
            selectedRating={selectedRating}
            showAllTags={showAllTags}
          />
        </div>
      </div>

      {/* Hint Modal */}
      <HintModal
        problem={hintProblem}
        onClose={() => setHintProblem(null)}
      />

      {/* Solution Code Modal */}
      <CodeModal
        problem={codeProblem}
        onClose={() => setCodeProblem(null)}
      />

      {/* Reset Confirmation Modal */}
      <ConfirmationModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={confirmResetProgress}
        title="Reset All Progress?"
        message="Are you sure you want to reset all marked problems? This will set all solved statuses back to unsolved."
        confirmText="Reset Progress"
        confirmColor="red"
      />
    </section>
  );
}
