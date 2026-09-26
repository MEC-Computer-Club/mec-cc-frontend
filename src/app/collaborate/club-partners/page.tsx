export const revalidate = 60;

import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getClubPartners } from "@/data/partners";
import { Button } from "@/components/ui/Button";
import {
  ExternalLink,
  Globe,
  Award,
  Calendar,
  CheckCircle,
  Building2,
  Handshake,
  ArrowRight,
} from "lucide-react";
import { getOptimizedImageUrl } from "@/data/gallery";

export const metadata: Metadata = {
  title: "Club & Community Partners | MEC Computer Club",
  description:
    "Discover national hackathons, university clubs, and tech summits where MEC Computer Club is connected as an official Club Partner, Community Partner, or Co-Organizer.",
};

export default async function ClubPartnersPage() {
  const clubPartners = await getClubPartners();

  const activePartners = clubPartners.filter((p) => p.isActive);
  const concludedPartners = clubPartners.filter((p) => !p.isActive);

  const formatDateRange = (start?: string, end?: string) => {
    if (!start && !end) return null;
    const startStr = start
      ? new Date(start).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "";
    const endStr = end
      ? new Date(end).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "";
    if (startStr && endStr) return `${startStr} – ${endStr}`;
    return startStr || endStr;
  };

  return (
    <main className="min-h-screen py-12 sm:py-16">
      <div className="container">
        {/* Page Header */}
        <div className="text-center max-w-[740px] mx-auto mb-10">
          <span className="kicker">Collaborate</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-text-primary mb-3">
            Club &amp; Community Partners
          </h1>
          <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
            MEC Computer Club actively collaborates with university clubs, national hackathons,
            and tech summits across Bangladesh. Explore our official network of external
            partnerships.
          </p>
        </div>

        {/* Partners Grid */}
        {clubPartners.length === 0 ? (
          <div className="text-center py-20 bg-surface-elevated rounded-2xl border-2 border-dashed border-border-default max-w-xl mx-auto px-6">
            <Globe size={48} className="text-accent-primary mx-auto mb-4 opacity-80" />
            <h2 className="text-xl font-bold text-text-primary mb-2">
              No Club Partners Listed Yet
            </h2>
            <p className="text-sm text-text-secondary mb-6 leading-relaxed">
              We are finalizing partnerships for the upcoming season. If your club or event wants
              to collaborate with MEC Computer Club, get in touch with us!
            </p>
            <Button href="/contact?subject=Club%20Partnership" id="partner-invite-cta">
              Invite MEC CC as Partner →
            </Button>
          </div>
        ) : (
          <div className="space-y-12 max-w-7xl mx-auto">
            {/* Active Partners */}
            {activePartners.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <CheckCircle size={20} className="text-accent-success" />
                  <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
                    Active Partners
                  </h2>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-accent-success/15 text-accent-success border border-accent-success/30">
                    {activePartners.length} Ongoing
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activePartners.map((partner) => {
                    const dateRange = formatDateRange(partner.startDate, partner.endDate);
                    return (
                      <div
                        key={partner.id || partner.name}
                        className="flex flex-col justify-between p-6 bg-surface-elevated border-2 border-border-default rounded-2xl shadow-[4px_4px_0px_0px_var(--border-default)] hover:shadow-[6px_6px_0px_0px_var(--accent-primary)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200 group"
                      >
                        <div>
                          {/* Top bar with Role badge & Logo */}
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex items-center gap-3">
                              {partner.logoUrl ? (
                                <div className="w-14 h-14 rounded-xl border border-border-default p-2 flex items-center justify-center bg-white dark:bg-slate-900 overflow-hidden flex-shrink-0">
                                  <Image
                                    src={getOptimizedImageUrl(partner.logoUrl, 160)}
                                    alt={partner.name}
                                    width={48}
                                    height={48}
                                    className="max-h-10 max-w-full object-contain"
                                  />
                                </div>
                              ) : (
                                <div className="w-14 h-14 rounded-xl bg-accent-primary-light border border-accent-primary/25 text-accent-primary font-mono font-extrabold text-xl flex items-center justify-center flex-shrink-0 shadow-[2px_2px_0px_0px_var(--accent-primary)]">
                                  {partner.logoPlaceholder ||
                                    partner.name.slice(0, 2).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <h3 className="text-lg font-bold text-text-primary group-hover:text-accent-primary transition-colors">
                                  {partner.name}
                                </h3>
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 mt-1 rounded-md bg-accent-primary-light text-text-primary border border-accent-primary/30">
                                  <Award size={12} className="text-accent-primary" />
                                  MEC CC as: {partner.role}
                                </span>
                              </div>
                            </div>

                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-accent-success/15 text-accent-success border border-accent-success/30 flex-shrink-0">
                              Active
                            </span>
                          </div>

                          {/* Date Range */}
                          {dateRange && (
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary mb-3">
                              <Calendar size={13} className="text-accent-primary" />
                              <span>{dateRange}</span>
                            </div>
                          )}

                          {/* Description */}
                          <p className="text-sm text-text-secondary leading-relaxed bg-surface-secondary/40 p-3 rounded-xl border border-border-default/60 mb-4">
                            {partner.desc}
                          </p>
                        </div>

                        {/* External Link */}
                        {partner.website && (
                          <div className="pt-3 border-t border-border-default/60 flex items-center justify-between">
                            <span className="text-xs text-text-tertiary font-semibold">
                              Official Website / Event Link
                            </span>
                            <a
                              href={partner.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-primary hover:underline"
                            >
                              <span>Explore</span>
                              <ExternalLink size={13} />
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Past Club Partners */}
            {concludedPartners.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Building2 size={20} className="text-text-secondary" />
                  <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
                    Past Club Partners
                  </h2>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-surface-secondary text-text-secondary border border-border-default">
                    {concludedPartners.length} Concluded
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {concludedPartners.map((partner) => {
                    const dateRange = formatDateRange(partner.startDate, partner.endDate);
                    return (
                      <div
                        key={partner.id || partner.name}
                        className="flex flex-col justify-between p-6 bg-surface-elevated border-2 border-border-default rounded-2xl opacity-85 hover:opacity-100 shadow-[3px_3px_0px_0px_var(--border-default)] transition"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex items-center gap-3">
                              {partner.logoUrl ? (
                                <div className="w-12 h-12 rounded-xl border border-border-default p-2 flex items-center justify-center bg-white dark:bg-slate-900 overflow-hidden flex-shrink-0">
                                  <Image
                                    src={getOptimizedImageUrl(partner.logoUrl, 120)}
                                    alt={partner.name}
                                    width={40}
                                    height={40}
                                    className="max-h-8 max-w-full object-contain"
                                  />
                                </div>
                              ) : (
                                <div className="w-12 h-12 rounded-xl bg-surface-secondary border border-border-default text-text-secondary font-mono font-bold text-base flex items-center justify-center flex-shrink-0">
                                  {partner.logoPlaceholder ||
                                    partner.name.slice(0, 2).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <h3 className="text-base font-bold text-text-primary">
                                  {partner.name}
                                </h3>
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-text-secondary mt-0.5">
                                  <Award size={12} />
                                  MEC CC as: {partner.role}
                                </span>
                              </div>
                            </div>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-surface-secondary text-text-secondary border border-border-default flex-shrink-0">
                              Concluded
                            </span>
                          </div>

                          {dateRange && (
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary mb-2">
                              <Calendar size={12} className="text-text-secondary" />
                              <span>{dateRange}</span>
                            </div>
                          )}

                          <p className="text-xs text-text-secondary leading-relaxed mb-4">
                            {partner.desc}
                          </p>
                        </div>

                        {partner.website && (
                          <div className="pt-2 border-t border-border-default/60 flex items-center justify-end">
                            <a
                              href={partner.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-bold text-accent-primary hover:underline"
                            >
                              <span>Official Link</span>
                              <ExternalLink size={12} />
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom CTA / Invite Section */}
        <div className="mt-16 p-8 sm:p-10 bg-surface-elevated rounded-2xl border-2 border-border-default shadow-[6px_6px_0px_0px_var(--border-default)] max-w-3xl mx-auto text-center">
          <Handshake size={36} className="mx-auto text-accent-primary mb-3" />
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            Organizing an Event or Representing a Tech Club?
          </h2>
          <p className="text-sm sm:text-base text-text-secondary max-w-xl mx-auto mb-6 leading-relaxed">
            Invite MEC Computer Club as your official Club Partner, Community Partner, or
            Co-Organizer. We connect events with passionate competitive programmers, hackathon
            participants, and student builders.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              href="/contact?subject=Club%20Partnership"
              id="cta-invite-mec-partner"
              className="w-full sm:w-auto"
            >
              <span>Connect with Our Executive Board</span>
              <ArrowRight size={15} />
            </Button>
            <Button
              href="/collaborate/sponsor"
              variant="secondary"
              id="cta-become-sponsor"
              className="w-full sm:w-auto"
            >
              Sponsorship Opportunities
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
