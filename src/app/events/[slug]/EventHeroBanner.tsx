"use client";

import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { parseImagePosition } from "@/lib/imagePosition";
import { Event } from "@/types";
import { Gamepad2, Trophy, Maximize2 } from "lucide-react";

interface EventHeroBannerProps {
  event: Event;
}

export function EventHeroBanner({ event }: EventHeroBannerProps) {
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

  return (
    <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] md:aspect-[2.35/1] min-h-[260px] max-h-[580px] bg-surface-secondary overflow-hidden flex items-center justify-center group">
      {/* Ambient background glow if image is contained or letterboxed */}
      {(parsedBanner.isContain || parsedBanner.scaleX < 1) && (
        <div
          className="absolute inset-0 bg-cover bg-center blur-2xl opacity-25 scale-110 pointer-events-none"
          style={{ backgroundImage: `url(${highResBannerSrc})` }}
        />
      )}

      {/* Crystal clear image with high-res srcset and natural full color */}
      <Image
        src={highResBannerSrc}
        alt={event.title}
        fill
        className={parsedBanner.isContain ? "object-contain relative z-10" : "object-cover"}
        style={{
          objectPosition: parsedBanner.objectPosition,
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
      <div className="absolute top-4 left-4 sm:top-5 sm:left-5 flex flex-wrap items-center gap-2 z-20 pointer-events-auto">
        <Badge
          variant={
            event.status === "ongoing"
              ? "ongoing"
              : event.status === "scheduled" || event.status === "upcoming"
              ? "upcoming"
              : "past"
          }
          size="md"
          className="shadow-sm font-bold uppercase tracking-wider"
        >
          {event.status === "ongoing"
            ? "LIVE ONGOING"
            : event.status === "scheduled" || event.status === "upcoming"
            ? "UPCOMING"
            : "COMPLETED"}
        </Badge>

        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-surface-elevated/95 backdrop-blur-md text-text-primary border border-border-default/80 shadow-sm">
          {event.type}
        </span>

        {isTeam && (
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase bg-indigo-600 text-white shadow-sm flex items-center gap-1.5">
            <Gamepad2 size={13} /> Squad Mode
          </span>
        )}
      </div>

      {/* Top Right Full Resolution Button */}
      <div className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <a
          href={rawBannerSrc}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/75 hover:bg-black/90 backdrop-blur-md text-white text-xs font-semibold shadow-lg transition border border-white/20"
          title="Open original high-resolution banner in new tab"
        >
          <Maximize2 size={13} />
          <span>Full Resolution</span>
        </a>
      </div>

      {/* Floating Prize Badge if provided */}
      {event.prizePool && (
        <div className="absolute bottom-4 left-4 sm:bottom-5 sm:left-5 flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500/95 backdrop-blur-md text-slate-950 font-mono font-black text-xs sm:text-sm shadow-md z-20">
          <Trophy size={16} />
          <span>Prize Pool: {event.prizePool}</span>
        </div>
      )}
    </div>
  );
}
