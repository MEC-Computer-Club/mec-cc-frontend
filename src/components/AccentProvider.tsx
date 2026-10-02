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

const STORAGE_KEY = "mec-cc-accent-vibe";
const ROTATION_INTERVAL = 120_000; // 2 minutes

interface AccentContextValue {
  currentVibe: VibeName;
  setManualVibe: (vibe: VibeName) => void;
  cycleManualVibe: () => void;
  enableAutoMode: () => void;
  isAuto: boolean;
  isManual: boolean;
}

const AccentContext = createContext<AccentContextValue>({ 
  currentVibe: "lime",
  setManualVibe: () => {},
  cycleManualVibe: () => {},
  enableAutoMode: () => {},
  isAuto: false,
  isManual: true,
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
  const [isAuto, setIsAuto] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load saved preference from localStorage on mount
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "auto") {
        setIsAuto(true);
        const randomIndex = Math.floor(Math.random() * VIBE_ORDER.length);
        setVibeIndex(randomIndex);
        return;
      }
      if (saved && VIBE_ORDER.includes(saved as VibeName)) {
        setIsAuto(false);
        setVibeIndex(VIBE_ORDER.indexOf(saved as VibeName));
        return;
      }
    } catch {
      // LocalStorage access restricted or unavailable
    }

    // Default to steady fixed theme without rotation
    setIsAuto(false);
    setVibeIndex(initialIndex);
  }, [initialIndex]);

  const setManualVibe = useCallback((vibe: VibeName) => {
    setIsAuto(false);
    try {
      localStorage.setItem(STORAGE_KEY, vibe);
    } catch {}

    const index = VIBE_ORDER.indexOf(vibe);
    if (index !== -1) {
      setVibeIndex(index);
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const enableAutoMode = useCallback(() => {
    setIsAuto(true);
    try {
      localStorage.setItem(STORAGE_KEY, "auto");
    } catch {}

    // Switch to auto and immediately shuffle
    setVibeIndex((prev) => {
      if (VIBE_ORDER.length <= 1) return 0;
      let nextIndex: number;
      do {
        nextIndex = Math.floor(Math.random() * VIBE_ORDER.length);
      } while (nextIndex === prev);
      return nextIndex;
    });
  }, []);

  const cycleManualVibe = useCallback(() => {
    setIsAuto(false);
    setVibeIndex((prev) => {
      const nextIndex = (prev + 1) % VIBE_ORDER.length;
      const nextVibe = VIBE_ORDER[nextIndex];
      try {
        localStorage.setItem(STORAGE_KEY, nextVibe);
      } catch {}
      return nextIndex;
    });
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const currentVibe = VIBE_ORDER[vibeIndex];
  const mode = (resolvedTheme === "light" ? "light" : "dark") as
    | "light"
    | "dark";

  // Apply accent tokens whenever vibe or mode changes
  const applyTokens = useCallback(() => {
    if (!mounted) return;
    applyAccentTokens(currentVibe, mode);
  }, [currentVibe, mode, mounted]);

  useEffect(() => {
    applyTokens();
  }, [applyTokens]);

  // Rotation interval only active when isAuto is true
  useEffect(() => {
    if (!mounted || !isAuto) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

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
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [mounted, isAuto]);

  return (
    <AccentContext.Provider
      value={{
        currentVibe,
        setManualVibe,
        cycleManualVibe,
        enableAutoMode,
        isAuto,
        isManual: !isAuto,
      }}
    >
      {children}
    </AccentContext.Provider>
  );
}
