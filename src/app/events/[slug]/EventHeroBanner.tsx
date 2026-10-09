"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { parseImagePosition } from "@/lib/imagePosition";
import { Event } from "@/types";
import { Gamepad2, Trophy, Maximize2 } from "lucide-react";

interface EventHeroBannerProps {
  event: Event;
}

export function EventHeroBanner({ event }: EventHeroBannerProps) {
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  const rawBannerPos = event.bannerImagePosition || event.coverImagePosition || "50% 50%";
  const parsedBanner = parseImagePosition(rawBannerPos);
  const rawBannerSrc = (event.bannerImageUrl || event.coverImageUrl || event.image)!;

  if (!rawBannerSrc) return null;

  // Enhance Cloudinary URLs to serve best possible quality
  let highResBannerSrc = rawBannerSrc;
  if (highResBannerSrc.includes("res.cloudinary.com") && highResBannerSrc.includes("/upload/")) {
    if (!highResBannerSrc.includes("/upload/q_auto") && !highResBannerSrc.includes("/upload/f_auto")) {
      highResBannerSrc = highResBannerSrc.replace("/upload/", "/upload/f_auto,q_auto:best/");
    }
  }

  const isTeam = event.registrationType === "team" || event.type === "gaming";

  // Clamp dynamic aspect ratio to prevent absurd extremes
  const dynamicRatio = aspectRatio ? Math.max(1.2, Math.min(3.2, aspectRatio)) : null;

  return (
    <div
      className={`relative w-full ${
        !dynamicRatio ? "aspect-[16/9] sm:aspect-[21/9] md:aspect-[2.35/1]" : ""
      } min-h-0 sm:min-h-[240px] md:min-h-[280px] max-h-[580px] bg-surface-secondary overflow-hidden flex items-center justify-center group transition-[aspect-ratio] duration-200`}
      style={dynamicRatio ? { aspectRatio: `${dynamicRatio}` } : undefined}
    >
      {/* Ambient background glow for letterboxing or edge blending - always active for cinematic feel */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-2xl opacity-25 dark:opacity-35 scale-110 pointer-events-none"
        style={{ backgroundImage: `url(${highResBannerSrc})` }}
      />

      {/* Crystal clear image with high-res srcset and natural full color */}
      <Image
        src={highResBannerSrc}
        alt={event.title}
        fill
        onLoad={(e) => {
          const img = e.currentTarget;
          if (img.naturalWidth && img.naturalHeight) {
            setAspectRatio(img.naturalWidth / img.naturalHeight);
          }
        }}
        className={
          parsedBanner.isContain
            ? "object-contain relative z-10"
            : "object-contain sm:object-cover relative z-10"
        }
        style={{
          objectPosition: parsedBanner.isContain ? "center" : parsedBanner.objectPosition,
          transform:
            parsedBanner.scaleX !== 1 || parsedBanner.scaleY !== 1
              ? `scale(${parsedBanner.scaleX}, ${parsedBanner.scaleY})`
              : undefined,
        }}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1920px"
        quality={100}
        priority
        unoptimized
      />

      {/* Floating Top Badges */}
      <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 flex flex-wrap items-center gap-1.5 sm:gap-2 z-20 pointer-events-auto">
        <Badge
          variant={
            event.status === "ongoing"
              ? "ongoing"
              : event.status === "scheduled" || event.status === "upcoming"
              ? "upcoming"
              : "past"
          }
          size="sm"
          className="shadow-sm font-bold uppercase tracking-wider text-[10px] sm:text-xs px-2 py-0.5 sm:px-2.5 sm:py-1"
        >
          {event.status === "ongoing"
            ? "LIVE ONGOING"
            : event.status === "scheduled" || event.status === "upcoming"
            ? "UPCOMING"
            : "COMPLETED"}
        </Badge>

        <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold uppercase bg-surface-elevated/95 backdrop-blur-md text-text-primary border border-border-default/80 shadow-sm">
          {event.type}
        </span>

        {isTeam && (
          <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-mono font-bold uppercase bg-indigo-600 text-white shadow-sm flex items-center gap-1">
            <Gamepad2 size={11} className="sm:w-[13px] sm:h-[13px]" />
            <span>Squad Mode</span>
          </span>
        )}
      </div>

      {/* Top Right Full Resolution Button */}
      <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-20 opacity-85 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
        <a
          href={rawBannerSrc}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl bg-black/75 hover:bg-black/90 backdrop-blur-md text-white text-[10px] sm:text-xs font-semibold shadow-lg transition border border-white/20"
          title="Open original high-resolution banner in new tab"
        >
          <Maximize2 size={11} className="sm:w-[13px] sm:h-[13px]" />
          <span className="hidden sm:inline">Full Resolution</span>
        </a>
      </div>

      {/* Floating Prize Badge if provided */}
      {event.prizePool && (
        <div className="absolute bottom-2.5 left-2.5 sm:bottom-4 sm:left-4 flex items-center gap-1.5 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-lg sm:rounded-xl bg-amber-500/95 backdrop-blur-md text-slate-950 font-mono font-black text-[11px] sm:text-sm shadow-md z-20">
          <Trophy size={13} className="sm:w-4 sm:h-4" />
          <span>Prize Pool: {event.prizePool}</span>
        </div>
      )}
    </div>
  );
}
