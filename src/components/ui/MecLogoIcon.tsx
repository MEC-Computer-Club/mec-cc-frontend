"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useAccent } from "@/components/AccentProvider";

interface MecLogoIconProps {
  size?: number;
  className?: string;
  priority?: boolean;
}

/**
 * Reusable official MEC Computer Club PC logo icon.
 * Dynamically resolves the active accent vibe (lime, sky, amber, etc.)
 * and color theme (dark vs light), exactly matching the collapsed dashboard sidebar.
 */
export function MecLogoIcon({
  size = 32,
  className = "",
  priority = false,
}: MecLogoIconProps) {
  const { resolvedTheme } = useTheme();
  const { currentVibe } = useAccent();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const theme = mounted && resolvedTheme === "dark" ? "dark" : "light";
  const vibe = currentVibe || "lime";
  const src = `/logo-icon-${vibe}-${theme}.png`;

  return (
    <Image
      src={src}
      alt="MEC Computer Club Logo"
      width={size}
      height={size}
      className={`object-contain shrink-0 ${className}`}
      unoptimized
      priority={priority}
    />
  );
}
