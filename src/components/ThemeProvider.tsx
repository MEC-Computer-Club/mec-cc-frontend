"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { AccentProvider } from "./AccentProvider";

// Suppress the React 19 false positive warning from next-themes
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const orig = console.error;
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === "string" && args[0].includes("Encountered a script tag")) return;
    orig.apply(console, args);
  };
}

import type { VibeName } from "@/lib/accent-themes";

export function ThemeProvider({
  children,
  initialVibe,
}: {
  children: React.ReactNode;
  initialVibe?: VibeName;
}) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="mec-cc-theme"
    >
      <AccentProvider initialVibe={initialVibe}>{children}</AccentProvider>
    </NextThemesProvider>
  );
}

