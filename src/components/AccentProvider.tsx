"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { useTheme } from "next-themes";
import {
  VIBE_ORDER,
  applyAccentTokens,
  type VibeName,
} from "@/lib/accent-themes";

const ROTATION_INTERVAL = 120_000; // 2 minutes

interface AccentContextValue {
  currentVibe: VibeName;
  setManualVibe: (vibe: VibeName) => void;
  cycleManualVibe: () => void;
  isManual: boolean;
}

const AccentContext = createContext<AccentContextValue>({ 
  currentVibe: "lime",
  setManualVibe: () => {},
  cycleManualVibe: () => {},
  isManual: false
});

export function useAccent() {
  return useContext(AccentContext);
}

export function AccentProvider({
  children,
  initialVibe = "lime",
}: {
  children: React.ReactNode;
  initialVibe?: VibeName;
}) {
  const initialIndex = Math.max(0, VIBE_ORDER.indexOf(initialVibe));
  const [vibeIndex, setVibeIndex] = useState(initialIndex);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isManual, setIsManual] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const setManualVibe = useCallback((vibe: VibeName) => {
    setIsManual(true);
    const index = VIBE_ORDER.indexOf(vibe);
    if (index !== -1) {
      setVibeIndex(index);
    }
  }, []);

  const cycleManualVibe = useCallback(() => {
    setIsManual(true);
    setVibeIndex((prev) => {
      if (VIBE_ORDER.length <= 1) return 0;
      let nextIndex: number;
      do {
        nextIndex = Math.floor(Math.random() * VIBE_ORDER.length);
      } while (nextIndex === prev);
      return nextIndex;
    });
  }, []);

  const currentVibe = VIBE_ORDER[vibeIndex];
  const mode = (resolvedTheme === "light" ? "light" : "dark") as
    | "light"
    | "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  // Apply accent tokens whenever vibe or mode changes
  const applyTokens = useCallback(() => {
    if (!mounted) return;
    applyAccentTokens(currentVibe, mode);
  }, [currentVibe, mode, mounted]);

  useEffect(() => {
    applyTokens();
  }, [applyTokens]);

  // Start the 2-minute rotation interval with random, non-sequential transitions
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setVibeIndex((prev) => {
        if (VIBE_ORDER.length <= 1) return 0;
        let nextIndex: number;
        do {
          nextIndex = Math.floor(Math.random() * VIBE_ORDER.length);
        } while (nextIndex === prev);
        return nextIndex;
      });
    }, ROTATION_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <AccentContext.Provider value={{ currentVibe, setManualVibe, cycleManualVibe, isManual }}>
      {children}
    </AccentContext.Provider>
  );
}
