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
} from "../services/cfSyncService";
import CPSheetSidebar from "./CPSheetSidebar";
import CPSheetTopBar from "./CPSheetTopBar";
import CPSheetProblemTable from "./CPSheetProblemTable";
import { HintModal, CodeModal, VideoModal } from "./CPSheetModals";
import ConfirmationModal from "@/components/ui/shared/ConfirmModal";

const STORAGE_KEY_SOLVED = "mec_cp_sheet_solved_v1";
const STORAGE_KEY_HANDLE = "mec_cp_sheet_cf_handle";
const STORAGE_KEY_SYNC_TIME = "mec_cp_sheet_last_sync";

export default function CPSheetView() {
  const { user } = useAuth();

  // Active rating selection
  const [selectedRating, setSelectedRating] = useState<number>(800);

  // Solved state map: { [problemId]: boolean }
  const [solvedMap, setSolvedMap] = useState<Record<string, boolean>>({});

  // Codeforces handle & sync
  const [cfHandle, setCfHandle] = useState<string>("");
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  // Search & Status filters
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"all" | "solved" | "unsolved">("all");
  const [showAllTags, setShowAllTags] = useState<boolean>(false);

  // Modal active states
  const [hintProblem, setHintProblem] = useState<CPProblem | null>(null);
  const [codeProblem, setCodeProblem] = useState<CPProblem | null>(null);
  const [videoProblem, setVideoProblem] = useState<CPProblem | null>(null);

  // Reset confirmation modal state
  const [isResetModalOpen, setIsResetModalOpen] = useState<boolean>(false);

  // Initialize from localStorage and user profile
  useEffect(() => {
    try {
      const storedSolved = localStorage.getItem(STORAGE_KEY_SOLVED);
      if (storedSolved) {
        setSolvedMap(JSON.parse(storedSolved));
      }

      const storedHandle = localStorage.getItem(STORAGE_KEY_HANDLE);
      if (storedHandle) {
        setCfHandle(storedHandle);
      } else if (user?.socialLinks?.codeforces) {
        const extracted = cleanCfHandle(user.socialLinks.codeforces);
        if (extracted) {
          setCfHandle(extracted);
        }
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

  // Codeforces Auto-Sync
  const handleSyncCodeforces = async () => {
    const cleaned = cleanCfHandle(cfHandle);
    if (!cleaned) {
      toast.error("Please enter a valid Codeforces handle.");
      return;
    }

    setIsSyncing(true);
    const toastId = toast.loading(`Fetching Codeforces submissions for ${cleaned}...`);

    try {
      // Save entered handle
      localStorage.setItem(STORAGE_KEY_HANDLE, cleaned);

      const result = await fetchCodeforcesSolved(cleaned);

      if (!result.success) {
        toast.error(result.error || "Sync failed", { id: toastId });
        setIsSyncing(false);
        return;
      }

      // Match solved problems with problems in our sheet
      const cfSolvedSet = new Set(result.solvedProblemIds);
      const sheetIds = new Set(CP_SHEET_PROBLEMS.map((p) => p.id));

      let newlySolvedCount = 0;
      const updated = { ...solvedMap };

      cfSolvedSet.forEach((id) => {
        if (sheetIds.has(id)) {
          if (!updated[id]) {
            newlySolvedCount++;
          }
          updated[id] = true;
        }
      });

      saveSolvedMap(updated);

      const now = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setLastSyncedAt(now);
      localStorage.setItem(STORAGE_KEY_SYNC_TIME, now);

      toast.success(
        `Synced with Codeforces! ${newlySolvedCount} new problems marked solved.`,
        { id: toastId, duration: 4000 }
      );
    } catch (err: any) {
      toast.error("An error occurred during sync.", { id: toastId });
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
        setCfHandle={setCfHandle}
        onSync={handleSyncCodeforces}
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
      <div className="flex flex-col md:flex-row items-start gap-6">
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
            problems={displayedProblems}
            solvedMap={solvedMap}
            onToggleSolve={handleToggleSolve}
            onOpenHint={(p) => setHintProblem(p)}
            onOpenCode={(p) => setCodeProblem(p)}
            onOpenVideo={(p) => setVideoProblem(p)}
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

      {/* Video Editorial Modal */}
      <VideoModal
        problem={videoProblem}
        onClose={() => setVideoProblem(null)}
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
