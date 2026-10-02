"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { EventCard } from "@/components/ui/Card";
import { Event } from "@/types";
import { sortUpcomingEvents, sortPastEvents } from "@/lib/api/events";
import { Button } from "@/components/ui/Button";
import {
  Layers,
  BookOpen,
  Wrench,
  Trophy,
  Flame,
  Gamepad2,
  Globe,
  Sparkles,
} from "lucide-react";

interface EventsFilterViewProps {
  initialOngoing?: Event[];
  initialUpcoming: Event[];
  initialPast: Event[];
}

const CATEGORIES = [
  { id: "all", label: "All Events", icon: Layers },
  { id: "seminar", label: "Seminars", icon: BookOpen },
  { id: "workshop", label: "Workshops", icon: Wrench },
  { id: "contest", label: "Contests", icon: Trophy },
  { id: "hackathon", label: "Hackathons", icon: Flame },
  { id: "gaming", label: "Gaming", icon: Gamepad2 },
  { id: "conference", label: "Conferences", icon: Globe },
  { id: "social", label: "Social", icon: Sparkles },
];

function matchEventCategory(event: Event, catId: string): boolean {
  if (catId === "all") return true;

  const eventType = (event.type || "").toLowerCase();
  const title = (event.title || "").toLowerCase();
  const tags = (event.tags || []).map((t) => t.toLowerCase());
  const dept = (event.department || "").toLowerCase();

  if (catId === "seminar") {
    return (
      eventType === "seminar" ||
      tags.some((t) => t.includes("seminar")) ||
      title.includes("seminar") ||
      title.includes("guide to") ||
      title.includes("talk")
    );
  }

  if (catId === "workshop") {
    return (
      eventType === "workshop" ||
      tags.some((t) => t.includes("workshop") || t.includes("bootcamp")) ||
      title.includes("workshop") ||
      title.includes("hands-on")
    );
  }

  if (catId === "contest") {
    return (
      eventType === "contest" ||
      eventType === "cp" ||
      tags.some((t) => t.includes("contest") || t.includes("cp") || t.includes("icpc") || t.includes("programming-contest")) ||
      title.includes("contest") ||
      title.includes("icpc") ||
      title.includes("programming contest")
    );
  }

  if (catId === "hackathon") {
    return (
      eventType === "hackathon" ||
      tags.some((t) => t.includes("hack") || t.includes("hackathon")) ||
      title.includes("hackathon")
    );
  }

  if (catId === "gaming") {
    return (
      eventType === "gaming" ||
      dept === "gaming" ||
      dept === "esports" ||
      tags.some((t) => t.includes("gaming") || t.includes("esports") || t.includes("game")) ||
      title.includes("gaming") ||
      title.includes("tournament") ||
      title.includes("esports")
    );
  }

  if (catId === "conference") {
    return (
      eventType === "conference" ||
      tags.some((t) => t.includes("conference") || t.includes("summit")) ||
      title.includes("conference") ||
      title.includes("summit")
    );
  }

  if (catId === "social") {
    return (
      eventType === "social" ||
      tags.some((t) => t.includes("social") || t.includes("meetup") || t.includes("reunion")) ||
      title.includes("social") ||
      title.includes("meetup")
    );
  }

  return eventType === catId || dept === catId || tags.includes(catId);
}

function EventsFilterContent({ initialOngoing = [], initialUpcoming, initialPast }: EventsFilterViewProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlCategory = searchParams.get("category") || searchParams.get("dept") || "all";
  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategory);

  useEffect(() => {
    const catParam = searchParams.get("category") || searchParams.get("dept") || "all";
    if (CATEGORIES.some((c) => c.id === catParam)) {
      setSelectedCategory(catParam);
    }
  }, [searchParams]);

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
    if (catId === "all") {
      router.replace("/events", { scroll: false });
    } else {
      router.replace(`/events?category=${catId}`, { scroll: false });
    }
  };

  const filteredOngoing = useMemo(
    () => sortUpcomingEvents(initialOngoing.filter((e) => matchEventCategory(e, selectedCategory))),
    [initialOngoing, selectedCategory]
  );

  const filteredUpcoming = useMemo(
    () => sortUpcomingEvents(initialUpcoming.filter((e) => matchEventCategory(e, selectedCategory))),
    [initialUpcoming, selectedCategory]
  );

  const filteredPast = useMemo(
    () => sortPastEvents(initialPast.filter((e) => matchEventCategory(e, selectedCategory))),
    [initialPast, selectedCategory]
  );

  const activeCategoryObj = CATEGORIES.find((c) => c.id === selectedCategory);

  return (
    <div>
      {/* Category Pills Filter Bar */}
      <section className="pb-6">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-wrap items-center gap-2 pt-2 pb-4 border-b border-border-default">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              const count =
                cat.id === "all"
                  ? initialOngoing.length + initialUpcoming.length + initialPast.length
                  : initialOngoing.filter((e) => matchEventCategory(e, cat.id)).length +
                    initialUpcoming.filter((e) => matchEventCategory(e, cat.id)).length +
                    initialPast.filter((e) => matchEventCategory(e, cat.id)).length;

              return (
                <Button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  variant={isSelected ? "primary" : "secondary"}
                  size="sm"
                  icon={<Icon size={15} />}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5 text-[11px] font-mono font-bold rounded-full transition-colors ${
                      isSelected
                        ? "bg-white/25 text-white dark:bg-black/25 dark:text-black"
                        : "bg-black/10 text-black dark:bg-white/15 dark:text-white"
                    }`}
                  >
                    {count}
                  </span>
                </Button>
              );
            })}
          </div>

          {selectedCategory !== "all" && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-xs sm:text-sm text-text-secondary">
                Showing events in{" "}
                <span className="font-bold text-text-primary">{activeCategoryObj?.label}</span>
              </div>
              <button
                onClick={() => handleCategorySelect("all")}
                className="text-xs font-bold text-accent-primary hover:underline"
              >
                Clear filter
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Ongoing Events (Happening Now) */}
      {filteredOngoing.length > 0 && (
        <section className="py-8 md:py-10 bg-emerald-500/5 dark:bg-emerald-500/10 border-y border-emerald-500/20" id="ongoing">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
                </span>
                <h2 className="text-2xl font-bold text-text-primary">Happening Now (Ongoing)</h2>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                {filteredOngoing.length} Live
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOngoing.map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      {filteredUpcoming.length > 0 && (
        <section className="py-8 md:py-12" id="upcoming">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-bold text-text-primary">Next in Queue (Upcoming)</h2>
              <span className="text-xs font-mono font-bold text-text-tertiary uppercase">
                {filteredUpcoming.length} Upcoming
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUpcoming.map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Completed Events */}
      {filteredPast.length > 0 && (
        <section className="py-8 md:py-12 bg-surface-secondary/50" id="completed">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-bold text-text-primary">Successfully Executed (Completed Events)</h2>
              <span className="text-xs font-mono font-bold text-text-tertiary uppercase">
                {filteredPast.length} Completed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-90 hover:opacity-100 transition-opacity">
              {filteredPast.map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Global Empty State if all sections are empty */}
      {filteredOngoing.length === 0 && filteredUpcoming.length === 0 && filteredPast.length === 0 && (
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-8 max-w-xl text-center">
            <div className="p-8 rounded-2xl bg-surface-elevated border border-border-default shadow-[4px_4px_0px_0px_var(--border-default)]">
              <p className="font-bold text-lg text-text-primary">No events found</p>
              <p className="text-sm text-text-secondary mt-1">
                There are no {activeCategoryObj?.label ? `"${activeCategoryObj.label}"` : ""} events recorded at this time.
              </p>
              {selectedCategory !== "all" && (
                <button
                  onClick={() => handleCategorySelect("all")}
                  className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-text-primary text-surface-primary rounded-xl font-bold text-xs hover:bg-surface-inverse transition"
                >
                  View All Events
                </button>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default function EventsFilterView(props: EventsFilterViewProps) {
  return (
    <Suspense fallback={<div className="p-12 text-center text-text-tertiary">Loading events...</div>}>
      <EventsFilterContent {...props} />
    </Suspense>
  );
}
