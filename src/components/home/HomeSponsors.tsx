import Image from "next/image";
import Link from "next/link";
import { Partner } from "@/data/partners";
import { Button } from "@/components/ui/Button";
import { ExternalLink } from "lucide-react";
import { getOptimizedImageUrl } from "@/data/gallery";

interface HomeSponsorsProps {
  sponsors: Partner[];
}

export function HomeSponsors({ sponsors }: HomeSponsorsProps) {
  const baseItems = sponsors && sponsors.length > 0 ? sponsors : [];

  // Desktop marquee track (all items)
  const track = baseItems.length < 8 ? [...baseItems, ...baseItems] : baseItems;
  const marqueeItems = [...track, ...track];

  // Mobile dual sliders: partition into even and odd indices so content never duplicates across rows
  const row1 = baseItems.filter((_, idx) => idx % 2 === 0);
  const row2 = baseItems.filter((_, idx) => idx % 2 !== 0);
  // Ensure both rows have items even if total is 1
  const safeRow2 = row2.length > 0 ? row2 : row1;

  const fillMobileTrack = (list: Partner[]) => {
    let t = [...list];
    while (t.length < 6) {
      t = [...t, ...list];
    }
    return [...t, ...t];
  };

  const mobileRow1Items = fillMobileTrack(row1);
  const mobileRow2Items = fillMobileTrack(safeRow2);

  const renderCard = (sponsor: Partner, idx: number | string, isCompact = false) => {
    const isWhiteMonochrome =
      sponsor.name?.toLowerCase().includes("paper") ||
      sponsor.logoUrl?.includes("1777010120574");

    const cardBody = (
      <div className={`group flex items-center gap-3 px-3.5 py-1.5 bg-surface-elevated hover:bg-surface-secondary border-2 border-border-brutalist dark:border-border-default rounded-xl shadow-[3px_3px_0px_0px_var(--border-brutalist)] hover:shadow-[4px_4px_0px_0px_var(--accent-primary)] hover:border-accent-primary hover:-translate-y-0.5 transition-all flex-shrink-0 cursor-pointer ${
        isCompact ? "h-14 min-w-[190px] max-w-[240px]" : "h-16 min-w-[220px] max-w-[280px]"
      }`}>
        {/* Logo Showcase or Monogram */}
        <div className="h-9 w-12 flex items-center justify-center flex-shrink-0 overflow-hidden bg-transparent">
          {sponsor.logoUrl ? (
            <Image
              src={getOptimizedImageUrl(sponsor.logoUrl, 160)}
              alt={sponsor.name}
              width={48}
              height={32}
              className={`max-h-6 max-w-full w-auto object-contain transition-transform duration-200 group-hover:scale-105 ${
                isWhiteMonochrome
                  ? "[html:not(.dark)_&]:brightness-0 [html:not(.dark)_&]:contrast-200 dark:brightness-100"
                  : ""
              }`}
            />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-accent-primary/10 text-accent-primary font-mono font-extrabold text-xs flex items-center justify-center border border-accent-primary/25">
              {sponsor.logoPlaceholder || sponsor.name.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>

        {/* Vertical Divider */}
        <div className="h-6 w-px bg-border-default/60 shrink-0" />

        {/* Sponsor Details */}
        <div className="min-w-0 flex-1 text-left">
          <div className="flex items-center gap-1">
            <span className="font-bold text-xs sm:text-sm text-text-primary group-hover:text-accent-primary transition-colors truncate">
              {sponsor.name}
            </span>
            {sponsor.website && (
              <ExternalLink size={10} className="text-text-tertiary group-hover:text-accent-primary opacity-60 flex-shrink-0" />
            )}
          </div>
          <span className="font-mono text-[9px] font-bold text-accent-primary uppercase tracking-wider block truncate mt-0.5">
            {sponsor.type}
          </span>
        </div>
      </div>
    );

    return sponsor.website ? (
      <a
        key={`${sponsor.name}-${idx}`}
        href={sponsor.website}
        target="_blank"
        rel="noopener noreferrer"
        className="no-underline block flex-shrink-0"
        aria-label={`Visit ${sponsor.name} website`}
      >
        {cardBody}
      </a>
    ) : (
      <div key={`${sponsor.name}-${idx}`} className="flex-shrink-0">
        {cardBody}
      </div>
    );
  };

  return (
    <section className="py-12 md:py-16 bg-surface-primary/60 border-y border-border-default/60 overflow-hidden" id="home-sponsors">
      <div className="container mb-7">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="kicker">Backers &amp; Partners</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
              Powered By Industry Leaders
            </h2>
            <p className="text-xs sm:text-sm text-text-tertiary mt-1">
              Organizations &amp; technology partners actively supporting our events and community.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button href="/collaborate/sponsor" variant="primary" size="sm" id="home-become-sponsor">
              Become a sponsor →
            </Button>
            <Button href="/collaborate/partners" variant="secondary" size="sm" id="home-view-all-sponsors">
              All Partners
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Single-Line Marquee Track */}
      <div className="hidden md:block relative w-full overflow-hidden marquee-mask py-2 select-none">
        <div className="animate-marquee flex items-center gap-4">
          {marqueeItems.map((sponsor, idx) => renderCard(sponsor, idx, false))}
        </div>
      </div>

      {/* Mobile Dual Opposing Sliders (Different content across both rows, opposite directions) */}
      <div className="block md:hidden space-y-3 py-1 select-none marquee-mask">
        {/* Row 1: Right to Left */}
        <div className="relative w-full overflow-hidden">
          <div className="animate-marquee flex items-center gap-3">
            {mobileRow1Items.map((sponsor, idx) => renderCard(sponsor, `m1-${idx}`, true))}
          </div>
        </div>

        {/* Row 2: Left to Right (Reverse direction with different content) */}
        <div className="relative w-full overflow-hidden">
          <div className="animate-marquee-reverse flex items-center gap-3">
            {mobileRow2Items.map((sponsor, idx) => renderCard(sponsor, `m2-${idx}`, true))}
          </div>
        </div>
      </div>
    </section>
  );
}
