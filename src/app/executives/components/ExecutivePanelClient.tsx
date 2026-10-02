"use client";

import React, { useState, useTransition, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProfileCard, ProfileGrid } from "@/components/ui/ProfileCard";
import { CommitteeTermSummary, CommitteeDetail, Executive } from "@/lib/api/executives";
import { Sparkles, Users, History, Loader2, SlidersHorizontal, Check } from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { OptionCard, OptionCardHeader } from "@/components/ui/OptionCard";

interface ExecutivePanelClientProps {
  initialTerms: CommitteeTermSummary[];
  initialCommittee: CommitteeDetail | null;
  initialSelectedTerm: string;
}

/**
 * Format a term code into clean short format like "2025-26"
 */
function formatShortTerm(term: string): string {
  if (!term) return "";
  const match = term.match(/^(\d{4})[-/](\d{2,4})$/);
  if (match) {
    const startYear = match[1];
    const endYear = match[2].length === 4 ? match[2].slice(2) : match[2];
    return `${startYear}-${endYear}`;
  }
  return term;
}

export default function ExecutivePanelClient({
  initialTerms,
  initialCommittee,
  initialSelectedTerm,
}: ExecutivePanelClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedTerm, setSelectedTerm] = useState<string>(initialSelectedTerm);
  const [committee, setCommittee] = useState<CommitteeDetail | null>(initialCommittee);
  const [loading, setLoading] = useState(false);
  const [, startTransition] = useTransition();

  // Dropdown filter popover state
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsFilterDropdownOpen(false);
      }
    };
    if (isFilterDropdownOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isFilterDropdownOpen]);

  // Handle changing the committee term
  const handleTermChange = async (newTerm: string) => {
    if (newTerm === selectedTerm && committee) {
      setIsFilterDropdownOpen(false);
      return;
    }

    setSelectedTerm(newTerm);
    setIsFilterDropdownOpen(false);
    setLoading(true);

    // Update query parameter without full page reload
    startTransition(() => {
      const params = new URLSearchParams(searchParams?.toString() || "");
      params.set("term", newTerm);
      router.replace(`/executives?${params.toString()}`, { scroll: false });
    });

    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/committees/term/${encodeURIComponent(newTerm)}`
      );
      if (res.data?.success && res.data.data) {
        const data = res.data.data;
        setCommittee({
          _id: data._id,
          term: data.term,
          title: data.title,
          isCurrent: data.isCurrent,
          order: data.order,
          session: data.session,
          groupPhotoUrl: data.groupPhotoUrl,
          description: data.description,
          startDate: data.startDate,
          endDate: data.endDate,
          members: (data.members || []).map((m: any) => ({
            id: m.id || m.userId || m._id,
            name: m.name || "Member",
            role: m.role || "Executive Member",
            designationOrder: m.order ?? 99,
            department: m.department || "CSE",
            batch: m.batch || "",
            session: m.session || (m.department ? `${m.department}` : "CSE"),
            image: m.image || m.imageUrl || "",
            imagePosition: m.imagePosition || "50% 50%",
            bio: m.bio || "",
            socials: m.socials || {},
          })),
        });
      }
    } catch (err) {
      console.warn("Failed to load committee term data:", err);
    } finally {
      setLoading(false);
    }
  };

  const isCurrent = committee?.isCurrent ?? true;
  const membersList: Executive[] = committee?.members || [];

  // Determine top visible terms for pill buttons (e.g. top 4)
  const visiblePillTerms = initialTerms.slice(0, 4);

  // If currently selected term is outside the top 4, include it so the active pill is visible
  const isSelectedInPills = visiblePillTerms.some((t) => t.term === selectedTerm);
  const pillsToRender = isSelectedInPills
    ? visiblePillTerms
    : [
        ...visiblePillTerms.slice(0, 3),
        initialTerms.find((t) => t.term === selectedTerm) || initialTerms[0],
      ].filter(Boolean);

  return (
    <>
      {/* ── Top Header Section (Alumni Page Style) ── */}
      <section className="pt-10 md:pt-14 pb-8 md:pb-10 text-center">
        <div className="container mx-auto px-4 md:px-8">
          <div className="inline-flex items-center gap-2 justify-center mb-1">
            <span className="kicker">Leadership &amp; Governance</span>
            {isCurrent ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-accent-primary-light text-accent-primary border border-accent-primary/20">
                <Sparkles className="w-3 h-3" /> Active Term
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                <History className="w-3 h-3" /> Historical Archive
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary my-3">
            Executive Panel
          </h1>
          <p className="text-base sm:text-lg text-text-secondary max-w-[600px] mx-auto">
            {committee?.description ||
              "Meet the dedicated student leaders who govern club operations, organize hackathons, and steer technical initiatives at Mymensingh Engineering College."}
          </p>
        </div>
      </section>

      {/* ── Main Content Section ── */}
      <section className="py-8 md:py-12 bg-surface-secondary min-h-[500px]">
        <div className="container mx-auto px-4 md:px-8 space-y-6">
          {/* ── Pill Buttons & Filter Icon Row ── */}
          <div className="flex items-center justify-center gap-2 flex-wrap pb-2">
            {pillsToRender.map((t) => {
              const isSelected = selectedTerm === t.term;
              const short = formatShortTerm(t.term);
              const label = t.isCurrent ? `${short} (Current)` : short;

              return (
                <Button
                  key={t.term}
                  type="button"
                  onClick={() => handleTermChange(t.term)}
                  variant={isSelected ? "primary" : "secondary"}
                  size="sm"
                >
                  {label}
                </Button>
              );
            })}

            {/* Filter Icon Button with Dropdown for Rest of Terms */}
            <div className="relative" ref={dropdownRef}>
              <Button
                type="button"
                onClick={() => setIsFilterDropdownOpen((prev) => !prev)}
                title="Browse all previous committee sessions"
                variant={isFilterDropdownOpen ? "primary" : "secondary"}
                size="sm"
                className="!px-2.5"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </Button>

              {/* Neo-Brutalist Dropdown for previous terms */}
              {isFilterDropdownOpen && (
                <div className="absolute right-0 mt-2 z-50">
                  <OptionCard className="w-64">
                    <OptionCardHeader title="All Committee Sessions" />
                    <div className="max-h-60 overflow-y-auto divide-y divide-border-default/40">
                      {initialTerms.map((t) => {
                        const isSelected = selectedTerm === t.term;
                        return (
                          <div
                            key={t.term}
                            onClick={() => handleTermChange(t.term)}
                            className={`p-3 text-xs flex items-center justify-between cursor-pointer transition-colors ${
                              isSelected
                                ? "bg-accent-primary-light text-text-primary font-bold dark:bg-accent-primary/20 dark:text-white"
                                : "hover:bg-surface-secondary text-text-primary"
                            }`}
                          >
                            <div>
                              <span className="font-semibold">{t.title || `Tenure ${t.term}`}</span>
                              <span className="text-[11px] text-text-secondary block">
                                {t.term} {t.isCurrent ? "• (Current)" : "• (Archived)"}
                              </span>
                            </div>

                            {isSelected && (
                              <Check className="w-4 h-4 text-accent-primary flex-shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </OptionCard>
                </div>
              )}
            </div>
          </div>
          {/* Group Photo Showcase (if available) */}
          {committee?.groupPhotoUrl && (
            <div className="rounded-2xl overflow-hidden border border-border-default shadow-sm max-h-[380px] relative group">
              <img
                src={committee.groupPhotoUrl}
                alt={`${committee.title} Group Photograph`}
                className="w-full h-full object-cover max-h-[380px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-5">
                <p className="text-white font-bold text-sm tracking-wide">
                  {committee.title} • Official Committee Photograph
                </p>
              </div>
            </div>
          )}

          {/* Rosters / Profile Cards Grid */}
          {loading ? (
            <div className="py-24 text-center space-y-3">
              <Loader2 className="w-8 h-8 mx-auto animate-spin text-accent-primary" />
              <p className="text-sm font-semibold text-text-secondary">
                Loading {selectedTerm} leadership panel...
              </p>
            </div>
          ) : membersList.length === 0 ? (
            <div className="py-16 text-center space-y-3 border-2 border-dashed border-border-default rounded-2xl p-8 bg-surface-primary">
              <Users className="w-10 h-10 mx-auto text-text-secondary opacity-40" />
              <h4 className="font-bold text-base text-text-primary">
                No Committee Members Registered
              </h4>
              <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto">
                No executive profiles have been registered for the {selectedTerm} committee tenure yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-semibold text-text-secondary pb-1">
                <span>
                  Showing <strong className="text-text-primary">{membersList.length}</strong> leaders in {committee?.title || selectedTerm}
                </span>
                {!isCurrent && (
                  <span className="text-[11px] text-accent-primary font-bold">
                    Historical Tenure Record
                  </span>
                )}
              </div>

              <ProfileGrid className="stagger-children">
                {membersList.map((exec) => (
                  <ProfileCard
                    key={`${selectedTerm}-${exec.id}`}
                    slug={exec.id}
                    name={exec.name}
                    role={exec.role}
                    department={exec.department}
                    session={exec.session}
                    batch={exec.batch}
                    category="executive"
                    hideRoleBadges={true}
                    image={exec.image}
                    imagePosition={exec.imagePosition}
                    socials={exec.socials}
                  />
                ))}
              </ProfileGrid>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
