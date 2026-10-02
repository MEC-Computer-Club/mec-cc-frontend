export const revalidate = 60;

import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getPartners } from "@/lib/api/partners";
import { Button } from "@/components/ui/Button";
import { ExternalLink, Handshake } from "lucide-react";
import { getOptimizedImageUrl } from "@/lib/api/gallery";

export const metadata: Metadata = {
  title: "Our Partners & Sponsors | MEC Computer Club",
  description: "Meet the organizations and companies that support MEC Computer Club.",
};

function getPartnerBadgeStyle(type: string): string {
  const lower = (type || "").toLowerCase().trim();

  // Title / Platinum / Diamond Sponsor
  if (lower.includes("title") || lower.includes("platinum") || lower.includes("diamond")) {
    return "bg-purple-100 text-purple-950 border-purple-400 dark:bg-purple-950/70 dark:text-purple-300 dark:border-purple-600 shadow-[1px_1px_0px_0px_rgba(147,51,234,0.35)]";
  }

  // Gold Sponsor
  if (lower.includes("gold")) {
    return "bg-amber-100 text-amber-950 border-amber-400 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-500 shadow-[1px_1px_0px_0px_rgba(245,158,11,0.4)]";
  }

  // Silver Sponsor
  if (lower.includes("silver")) {
    return "bg-slate-200 text-slate-900 border-slate-400 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-500 shadow-[1px_1px_0px_0px_rgba(100,116,139,0.35)]";
  }

  // Bronze Sponsor
  if (lower.includes("bronze") || lower.includes("copper")) {
    return "bg-orange-100 text-orange-950 border-orange-400 dark:bg-orange-950/70 dark:text-orange-300 dark:border-orange-600 shadow-[1px_1px_0px_0px_rgba(234,88,12,0.35)]";
  }

  // Service / Cloud / Hosting / Platform Partner
  if (
    lower.includes("service") ||
    lower.includes("cloud") ||
    lower.includes("platform") ||
    lower.includes("hosting") ||
    lower.includes("tech")
  ) {
    return "bg-sky-100 text-sky-950 border-sky-400 dark:bg-sky-950/70 dark:text-sky-300 dark:border-sky-600 shadow-[1px_1px_0px_0px_rgba(14,165,233,0.35)]";
  }

  // Food / Snack / Beverage Partner
  if (lower.includes("food") || lower.includes("snack") || lower.includes("beverage")) {
    return "bg-rose-100 text-rose-950 border-rose-400 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-600 shadow-[1px_1px_0px_0px_rgba(244,63,94,0.35)]";
  }

  // Media / Outreach / Promotional
  if (lower.includes("media") || lower.includes("promotional")) {
    return "bg-pink-100 text-pink-950 border-pink-400 dark:bg-pink-950/70 dark:text-pink-300 dark:border-pink-600 shadow-[1px_1px_0px_0px_rgba(236,72,153,0.35)]";
  }

  // Partner / Club Partner / Community / Official Partner (default)
  return "bg-emerald-100 text-emerald-950 border-emerald-400 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-600 shadow-[1px_1px_0px_0px_rgba(16,185,129,0.35)]";
}

export default async function PartnersPage() {
  const partnerList = await getPartners();

  return (
    <main className="min-h-screen py-12 sm:py-16">
      <div className="container">
        {/* Page Header */}
        <div className="text-center max-w-[680px] mx-auto mb-12">
          <span className="kicker">Collaborate</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-text-primary mb-3">
            Our Partners &amp; Sponsors
          </h1>
          <p className="text-base sm:text-lg text-text-tertiary">
            We are immensely grateful to the forward-thinking companies and organizations that empower our students, sponsor our contests, and mentor our members.
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {partnerList.map((partner, i) => {
            const isWhiteMonochrome =
              partner.name?.toLowerCase().includes("paper") ||
              partner.logoUrl?.includes("1777010120574");

            const CardContent = (
              <div className="flex flex-col justify-between h-full p-6 bg-surface-elevated border border-black dark:border-border-default rounded-xl transition-shadow duration-200 hover:shadow-[4px_4px_0px_var(--accent-primary)] group text-center">
                <div>
                  {/* Logo Container */}
                  <div className="relative h-20 w-full flex items-center justify-center p-2 mb-4 overflow-hidden bg-transparent">
                    {partner.logoUrl ? (
                      <Image
                        src={getOptimizedImageUrl(partner.logoUrl, 360)}
                        alt={partner.name}
                        width={180}
                        height={70}
                        className={`max-h-12 max-w-[85%] w-auto object-contain transition-transform duration-300 group-hover:scale-105 ${
                          isWhiteMonochrome
                            ? "[html:not(.dark)_&]:brightness-0 [html:not(.dark)_&]:contrast-200 dark:brightness-100"
                            : ""
                        }`}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-accent-primary/10 text-accent-primary font-mono font-extrabold text-base flex items-center justify-center border border-accent-primary/25">
                        {partner.logoPlaceholder || partner.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Badge */}
                  <span
                    className={`font-mono text-xs font-bold py-1 px-3 rounded-full border uppercase tracking-wider inline-block mb-2.5 transition-colors ${getPartnerBadgeStyle(
                      partner.type
                    )}`}
                  >
                    {partner.type}
                  </span>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-text-primary group-hover:text-accent-primary transition-colors mb-2">
                    {partner.name}
                  </h2>

                  {/* Description */}
                  <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">
                    {partner.desc}
                  </p>
                </div>

                {/* Footer Link if available */}
                {partner.website && (
                  <div className="mt-4 pt-3 border-t border-border-default/60 flex items-center justify-center gap-1 text-xs font-mono font-bold text-accent-primary group-hover:underline">
                    <span>Visit Website</span>
                    <ExternalLink size={12} />
                  </div>
                )}
              </div>
            );

            return partner.website ? (
              <a
                key={partner.id || `${partner.name}-${i}`}
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline text-left block h-full"
                aria-label={`Visit ${partner.name} website`}
              >
                {CardContent}
              </a>
            ) : (
              <div key={partner.id || `${partner.name}-${i}`} className="block h-full">
                {CardContent}
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 p-8 bg-surface-secondary/60 rounded-2xl border border-dashed border-border-default max-w-xl mx-auto">
          <Handshake size={32} className="mx-auto text-accent-primary mb-2 opacity-80" />
          <h3 className="text-lg font-bold text-text-primary mb-1">Want to collaborate with MEC Computer Club?</h3>
          <p className="text-sm text-text-tertiary mb-4">
            Partner with us to reach talented engineering students, sponsor events, and host tech workshops.
          </p>
          <Button href="/collaborate/sponsor" id="partners-become-sponsor">
            Become a Sponsor →
          </Button>
        </div>
      </div>
    </main>
  );
}
