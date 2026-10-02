"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  ExternalLink,
  Layers,
  Plus,
  Shield,
  Trash2,
  CheckCircle2,
  MoreVertical,
  Pencil,
  GitPullRequest,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import AddContributorModal, {
  Developer,
  FeatureItem,
} from "./AddContributorModal";

// Custom GitHub Icon
const IconGitHub = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const INITIAL_DEVELOPERS: Developer[] = [
  {
    name: "Md. Nasir Ahmed",
    role: "Lead Full-Stack Architect & Core Maintainer",
    id: "210347",
    department: "Department of CSE",
    batch: "5th Batch",
    session: "2021-2022",
    featuresWorkedOn: [
      {
        title: "Competitive Programming Hub",
        desc: "Automated Codeforces & AtCoder profile rating sync, live contest tracker, and collegiate leaderboard.",
      },
      {
        title: "Core System Architecture",
        desc: "Full-stack Next.js 15 App Router, Node.js, Express REST API layer, and MongoDB schema design.",
      },
      {
        title: "Dynamic Theme & Vibe Engine",
        desc: "Multi-color aesthetic system with synchronized vibe rotation, light/dark mode tokens, and state preservation.",
      },
      {
        title: "Auth & Security Permissions",
        desc: "Secure session management, JWT tokens, and fine-grained Role-Based Access Control (RBAC).",
      },
    ],
    profileUrl: "/profile/210347",
    github: "https://github.com/nasir-ahmed-dev",
    initials: "NA",
    avatarBg: "from-lime-500 via-emerald-500 to-teal-600",
  },
  {
    name: "Tawhid Ahmed (Abokash)",
    role: "Core Frontend Developer & UI/UX Architect",
    id: "210311",
    department: "Department of CSE",
    batch: "5th Batch",
    session: "2021-2022",
    featuresWorkedOn: [
      {
        title: "Neo-Brutalist Design System",
        desc: "Club-wide design tokens, dynamic theme vibe color engine, and cohesive component library.",
      },
      {
        title: "Photo Sigil Watermark Studio",
        desc: "Client-side HTML5 Canvas engine for instant photo watermarking, logo overlays, and student media branding.",
      },
      {
        title: "Official Cover Page Generator",
        desc: "Automated vector A4 PDF cover page and lab report generation utility for engineering coursework.",
      },
      {
        title: "Responsive UI & Micro-Interactions",
        desc: "Mobile-first accessible component layouts, dynamic animations, and creative digital assets.",
      },
    ],
    profileUrl: "/profile/210311",
    github: "https://github.com/abokash",
    initials: "TA",
    avatarBg: "from-amber-500 via-orange-500 to-rose-600",
  },
];

const LOCAL_STORAGE_KEY = "mec_cc_platform_contributors";

function DevelopersContent() {
  const { user, isAdmin } = useAuth();
  const searchParams = useSearchParams();

  // Admin / Moderator permission check
  // Supports active AuthContext role OR ?admin=true preview mode
  const canManage = Boolean(
    isAdmin ||
    user?.role === "admin" ||
    user?.role === "moderator" ||
    searchParams.get("admin") === "true"
  );

  const [developers, setDevelopers] = useState<Developer[]>(INITIAL_DEVELOPERS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editingDev, setEditingDev] = useState<Developer | null>(null);

  // Close 3-dot menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-dropdown-menu="true"]')) {
        setOpenMenuId(null);
      }
    };
    if (openMenuId) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [openMenuId]);

  // Load any stored custom contributors on client mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const hasInitialDev = parsed.some((d) =>
              INITIAL_DEVELOPERS.some((init) => init.id === d.id)
            );
            if (hasInitialDev) {
              setDevelopers(parsed);
            } else {
              setDevelopers([...INITIAL_DEVELOPERS, ...parsed]);
            }
          }
        }
      } catch {
        // ignore JSON parse error
      }
    }
  }, []);

  // Save custom added contributors
  const handleAddDeveloper = (newDev: Developer) => {
    const updated = [...developers, newDev];
    setDevelopers(updated);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
    }

    setNotification(`Successfully added ${newDev.name} as platform contributor!`);
    setTimeout(() => setNotification(null), 5000);
  };

  // Update existing contributor
  const handleUpdateDeveloper = (updatedDev: Developer) => {
    const updated = developers.map((d) =>
      d.id === updatedDev.id ? updatedDev : d
    );
    setDevelopers(updated);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
    }

    setNotification(`Updated contributor profile for ${updatedDev.name}.`);
    setTimeout(() => setNotification(null), 4000);
    setEditingDev(null);
  };

  // Remove a contributor
  const handleRemoveDeveloper = (id: string, name?: string) => {
    if (
      !window.confirm(
        `Are you sure you want to remove ${name || "this contributor"}?`
      )
    )
      return;
    const updated = developers.filter((d) => d.id !== id);
    setDevelopers(updated);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
    }

    setNotification("Contributor removed.");
    setTimeout(() => setNotification(null), 4000);
    setOpenMenuId(null);
  };

  return (
    <div className="w-full pb-20 md:pb-28">
      {/* ── Page Hero Header ── */}
      <section className="pt-10 md:pt-14 pb-8 md:pb-12 border-b border-border-default bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent-primary-light/15 via-surface-primary to-surface-primary">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[4px] bg-black text-white dark:bg-white dark:text-black font-mono text-xs font-bold uppercase tracking-wider mb-4 border border-black dark:border-white">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>100% In-House Architecture • Powered by Club Nodes</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight text-black dark:text-text-primary mb-3">
            The Minds Behind the Platform
          </h1>
          <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            From terminal to production, every pixel and query is crafted with care. Built, maintained, and actively evolved by student developers of{" "}
            <strong className="text-black dark:text-text-primary font-bold">
              MEC Computer Club
            </strong>
            , Department of CSE at{" "}
            <strong className="text-black dark:text-text-primary font-bold">
              Mymensingh Engineering College
            </strong>
            .
          </p>
        </div>
      </section>

      {/* ── Admin / Moderator Action Bar (Only visible for admin & moderator) ── */}
      {canManage && (
        <div className="container max-w-5xl mx-auto px-4 pt-6">
          <div className="p-3 sm:p-4 rounded-md bg-surface-secondary/70 border-2 border-border-brutalist dark:border-border-default flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-md bg-black text-white dark:bg-white dark:text-black flex items-center justify-center shrink-0">
                <Shield size={14} />
              </span>
              <div>
                <span className="font-mono text-xs font-bold text-text-primary uppercase tracking-wider block">
                  Maintainer Controls
                </span>
                <span className="text-[11px] text-text-secondary">
                  Visible only to website Administrators & Moderators
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setEditingDev(null);
                setIsAddModalOpen(true);
              }}
              className="w-full sm:w-auto h-10 px-4 rounded-md bg-black text-white dark:bg-white dark:text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-black dark:border-white transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_var(--accent-primary)] active:translate-y-0 cursor-pointer shrink-0"
              id="admin-add-contributor-btn"
            >
              <Plus size={15} />
              <span>Add Contributor</span>
            </button>
          </div>
        </div>
      )}

      {/* ── Success Toast Notification ── */}
      {notification && (
        <div className="container max-w-5xl mx-auto px-4 pt-4">
          <div className="p-3 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-mono text-xs font-bold flex items-center gap-2">
            <CheckCircle2 size={15} />
            <span>{notification}</span>
          </div>
        </div>
      )}

      {/* ── Developer Cards Section (Max 2 per row, centered if 1) ── */}
      <section className="container max-w-5xl mx-auto px-4 pt-8 md:pt-12 pb-14 md:pb-20">
        <div className="flex flex-wrap justify-center gap-6 md:gap-7 w-full items-stretch">
          {developers.map((dev, idx) => {
            const deptClean = dev.department.replace(/^Department of\s+/i, "").trim();
            let batchClean = dev.batch.replace(/\s*Batch$/i, "").trim();
            if (batchClean.toUpperCase().startsWith(`${deptClean.toUpperCase()}-`)) {
              batchClean = batchClean.slice(deptClean.length + 1).trim();
            } else if (batchClean.toUpperCase().startsWith(deptClean.toUpperCase())) {
              batchClean = batchClean.slice(deptClean.length).replace(/^[-\s]+/, "").trim();
            }
            const deptBatchDisplay = `${deptClean}-${batchClean}`;
            const featuresText = dev.featuresWorkedOn?.map((f) => f.title).join(", ") || "";

            return (
              <article
                key={`${dev.id}-${idx}`}
                className="w-full lg:w-[calc(50%-14px)] text-inherit no-underline transition-all duration-200 group relative flex"
                id={`developer-${dev.id}`}
              >
                <div className="flex flex-col sm:flex-row items-stretch w-full h-full bg-surface-elevated border-[1.5px] border-border-brutalist dark:border-border-default rounded-xl overflow-hidden transition-shadow duration-200 hover:shadow-[6px_6px_0px_var(--accent-primary)]">
                  {/* Left: Square Photo matching Card Height */}
                  <div className="w-full sm:w-52 md:w-56 lg:w-60 aspect-square sm:aspect-square sm:self-stretch shrink-0 relative bg-surface-secondary border-b-[1.5px] sm:border-b-0 sm:border-r-[1.5px] border-border-brutalist dark:border-border-default overflow-hidden flex items-center justify-center">
                    {dev.photo ? (
                      <Image
                        src={dev.photo}
                        alt={dev.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized={dev.photo.startsWith("http")}
                      />
                    ) : (
                      <div
                        className={`w-full h-full bg-gradient-to-br ${dev.avatarBg} text-white font-heading font-black text-3xl sm:text-4xl flex items-center justify-center select-none group-hover:scale-105 transition-transform duration-300`}
                      >
                        {dev.initials}
                      </div>
                    )}
                  </div>

                  {/* Right: Content Beside Photo */}
                  <div className="flex-1 min-w-0 p-4 sm:p-5 flex flex-col justify-between">
                    <div>
                      {/* Top: Name & Maintainer Action */}
                      <div className="flex items-start justify-between gap-2">
                        <h3
                          className="font-black text-2xl sm:text-3xl md:text-[1.85rem] text-black dark:text-text-primary group-hover:text-accent-primary transition-colors leading-tight truncate"
                          title={dev.name}
                        >
                          {dev.name}
                        </h3>

                        {canManage && (
                          <div className="relative shrink-0" data-dropdown-menu="true">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenuId(openMenuId === dev.id ? null : dev.id);
                              }}
                              className="w-7 h-7 rounded-md flex items-center justify-center text-text-tertiary hover:text-text-primary hover:bg-surface-secondary cursor-pointer"
                              aria-label="Options"
                            >
                              <MoreVertical size={16} />
                            </button>
                            {openMenuId === dev.id && (
                              <div className="absolute right-0 top-full mt-1 z-50 w-32 bg-surface-elevated border-[1.5px] border-text-primary dark:border-border-default rounded-md shadow-[3px_3px_0px_var(--accent-primary)] overflow-hidden p-0 animate-in fade-in duration-100">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    setEditingDev(dev);
                                    setIsAddModalOpen(true);
                                  }}
                                  className="w-full flex items-center px-3 py-2 text-xs font-semibold text-text-secondary hover:bg-accent-primary-light hover:text-text-primary border-b border-border-default/60 cursor-pointer"
                                >
                                  <Pencil size={12} className="mr-2 opacity-70" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveDeveloper(dev.id, dev.name)}
                                  className="w-full flex items-center px-3 py-2 text-xs font-semibold text-text-secondary hover:bg-red-500/10 hover:text-accent-error cursor-pointer"
                                >
                                  <Trash2 size={12} className="mr-2 text-red-500 opacity-80" />
                                  <span>Delete</span>
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Below Name: Role */}
                      <p className="font-mono text-xs font-bold text-accent-primary uppercase tracking-wider mt-1 line-clamp-1">
                        {dev.role}
                      </p>

                      {/* Then: Distinct Batch & Session Placement */}
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-[4px] bg-text-primary text-surface-primary font-mono text-[11px] font-extrabold uppercase tracking-wide">
                          {deptBatchDisplay}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-[4px] bg-surface-secondary text-text-primary border border-black dark:border-white/50 font-mono text-[11px] font-semibold">
                          {dev.session.replace(/20(\d{2})-20(\d{2})/, "20$1-$2")}
                        </span>
                      </div>

                      {/* Then: Redesigned Contribution Segment (Strictly 2 lines total: Title + 1-line content) */}
                      <div className="mt-3 p-2.5 sm:p-3 rounded-md bg-surface-secondary/70 dark:bg-surface-secondary/40 border border-border-default border-l-[3.5px] border-l-accent-primary">
                        {/* Line 1: Title & More Count */}
                        <div className="flex items-center justify-between gap-1.5 mb-1">
                          <div className="flex items-center gap-1.5">
                            <Layers size={13} className="text-accent-primary shrink-0" />
                            <span className="font-mono text-[10px] font-extrabold uppercase tracking-widest text-text-primary">
                              Contributions
                            </span>
                          </div>
                          {dev.featuresWorkedOn.length > 1 && (
                            <span className="font-mono text-[10px] text-text-tertiary font-bold tracking-wider">
                              +{dev.featuresWorkedOn.length - 1} more
                            </span>
                          )}
                        </div>

                        {/* Line 2: Exactly 1 line of features */}
                        <p
                          className="text-xs text-text-secondary leading-normal truncate font-medium"
                          title={dev.featuresWorkedOn.map((f) => f.title).join(", ")}
                        >
                          {dev.featuresWorkedOn.map((feat, i) => (
                            <span key={i}>
                              <span className="font-semibold text-text-primary hover:text-accent-primary transition-colors">
                                {feat.title}
                              </span>
                              {i < dev.featuresWorkedOn.length - 1 && (
                                <span className="text-text-tertiary mr-1.5 font-normal">,</span>
                              )}
                            </span>
                          ))}
                        </p>
                      </div>
                    </div>

                    {/* Bottom: Two Buttons Side by Side */}
                    <div className="mt-4 pt-3 border-t border-border-default/60 flex items-center gap-2">
                      <Link
                        href={dev.profileUrl}
                        className="flex-1 h-9 px-3 rounded-md bg-black text-white dark:bg-white dark:text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 border border-black dark:border-white transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_var(--accent-primary)] whitespace-nowrap"
                      >
                        <span>View Profile</span>
                        <ArrowRight size={13} />
                      </Link>
                      {dev.github && (
                        <a
                          href={dev.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 sm:flex-initial h-9 px-3 rounded-md bg-transparent text-text-primary border border-text-primary dark:border-border-default hover:bg-surface-secondary font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_var(--text-primary)] dark:hover:shadow-[3px_3px_0px_var(--accent-primary)] whitespace-nowrap"
                        >
                          <IconGitHub className="w-3.5 h-3.5" />
                          <span>GitHub</span>
                          <ExternalLink size={11} className="opacity-60" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ── Section Separator Line ── */}
      <div className="container max-w-5xl mx-auto px-4">
        <div className="w-full border-t border-border-default/80 dark:border-border-default" />
      </div>

      {/* ── Contributor Node Invitation CTA Card ── */}
      <section className="container max-w-5xl mx-auto px-4 pt-12 md:pt-16 pb-12 md:pb-16">
        <div className="p-6 sm:p-8 md:p-9 rounded-2xl bg-white dark:bg-surface-elevated border-[1.5px] border-black dark:border-white/30 flex flex-col gap-6 relative overflow-hidden">
          {/* Top meta strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="font-mono text-xs font-bold text-accent-primary uppercase tracking-wider">
                // OPEN CALL FOR CLUB MEMBERS
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-text-tertiary">
              <GitPullRequest size={13} className="text-accent-primary shrink-0" />
              <span>Welcoming contributions from all batches</span>
            </div>
          </div>

          {/* Heading & Copy */}
          <div className="space-y-2 max-w-3xl">
            <h3 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-text-primary">
              Every member is a node. Leave your mark on the codebase.
            </h3>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
              Have an idea for a student utility or spotted an issue? Fork our open-source repositories, submit your pull request, and join the platform maintainer roster.
            </p>
          </div>

          {/* Bottom Row: Interactive Steps Roadmap on left + GitHub Action on right */}
          <div className="pt-4 border-t border-border-default/70 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs font-semibold">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface-secondary text-text-primary border border-border-default hover:border-black dark:hover:border-white transition-colors cursor-default">
                <span className="text-accent-primary font-bold">01.</span>
                <span>Fork Repository</span>
              </div>
              <span className="text-text-tertiary font-bold">→</span>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface-secondary text-text-primary border border-border-default hover:border-black dark:hover:border-white transition-colors cursor-default">
                <span className="text-accent-primary font-bold">02.</span>
                <span>Build Feature</span>
              </div>
              <span className="text-text-tertiary font-bold">→</span>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface-secondary text-text-primary border border-border-default hover:border-black dark:hover:border-white transition-colors cursor-default">
                <span className="text-accent-primary font-bold">03.</span>
                <span>Submit PR</span>
              </div>
            </div>

            {/* Direct Action Button */}
            <a
              href="https://github.com/meccomputerclub/mec-cc-frontend"
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 px-5 rounded-md bg-black text-white dark:bg-white dark:text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-black dark:border-white transition-all hover:-translate-y-0.5 hover:shadow-[3.5px_3.5px_0px_var(--accent-primary)] shrink-0 whitespace-nowrap self-start md:self-auto"
            >
              <span>Contribute on GitHub</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* ── Add / Edit Contributor Modal ── */}
      <AddContributorModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingDev(null);
        }}
        onAdd={handleAddDeveloper}
        editData={editingDev}
        onUpdate={handleUpdateDeveloper}
      />
    </div>
  );
}

export default function DevelopersClient() {
  return (
    <Suspense fallback={<div className="min-h-screen py-20 text-center font-mono text-xs text-text-tertiary">Loading developers...</div>}>
      <DevelopersContent />
    </Suspense>
  );
}
