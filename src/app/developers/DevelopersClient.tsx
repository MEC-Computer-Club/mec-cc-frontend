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
          <span className="kicker">Core Leadership & Maintainers</span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight text-black dark:text-text-primary mb-3">
            The Minds Behind the Platform
          </h1>
          <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Architected, designed, and actively engineered by student developers of the{" "}
            <strong className="text-black dark:text-text-primary font-bold">
              Department of Computer Science & Engineering
            </strong>{" "}
            at{" "}
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

      {/* ── Core Developers Section (Option 1 Layout) ── */}
      <section className="container max-w-5xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {developers.map((dev, idx) => (
            <article
              key={`${dev.id}-${idx}`}
              className="flex flex-col w-full h-full bg-surface-elevated border border-border-brutalist dark:border-border-default rounded-xl overflow-hidden transition-all duration-200 hover:shadow-[6px_6px_0px_var(--accent-primary)] hover:-translate-x-0.5 hover:-translate-y-0.5 no-underline text-inherit group relative"
              id={`developer-${dev.id}`}
            >
              {/* 1. Header Meta Bar */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-border-default/60 bg-surface-secondary/40">
                <div className="inline-flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
                  <span className="font-mono text-[0.7rem] font-extrabold tracking-wider uppercase text-accent-text-on-surface dark:text-accent-primary">
                    CORE ARCHITECT
                  </span>
                </div>
                <div className="font-mono text-xs font-bold text-text-primary bg-surface-secondary py-0.5 px-2.5 border border-border-brutalist dark:border-border-default rounded-sm">
                  ID: {dev.id}
                </div>
              </div>

              {/* 2. Unified Profile & Credentials Block */}
              <div className="p-6 pb-4">
                <div className="flex items-start sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {/* Portrait Photo / Avatar */}
                    <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-xl bg-surface-secondary border border-border-brutalist dark:border-border-default shrink-0 overflow-hidden relative shadow-xs flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      {dev.photo ? (
                        <Image
                          src={dev.photo}
                          alt={dev.name}
                          fill
                          className="object-cover"
                          unoptimized={dev.photo.startsWith("http")}
                        />
                      ) : (
                        <div
                          className={`w-full h-full bg-gradient-to-br ${dev.avatarBg} text-white font-heading font-black text-2xl sm:text-3xl flex items-center justify-center select-none`}
                        >
                          {dev.initials}
                        </div>
                      )}
                    </div>

                    {/* Primary Identity Info */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className="font-bold text-xl sm:text-2xl text-black dark:text-text-primary group-hover:text-accent-primary-hover transition-colors leading-tight truncate"
                        title={dev.name}
                      >
                        {dev.name}
                      </h3>
                      <p className="font-mono text-xs font-semibold text-accent-primary-hover uppercase tracking-wider mt-1 line-clamp-1">
                        {dev.role}
                      </p>

                      {/* Academic Credentials Badges */}
                      <div className="mt-2.5 flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
                        <span className="px-2 py-0.5 rounded-sm bg-surface-secondary text-text-primary border border-border-default font-semibold">
                          {dev.department}
                        </span>
                        <span className="px-2 py-0.5 rounded-sm bg-surface-secondary text-text-secondary border border-border-default">
                          {dev.batch}
                        </span>
                        <span className="px-2 py-0.5 rounded-sm bg-surface-secondary text-text-tertiary border border-border-default">
                          {dev.session}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 3-Dot Options Action Menu (Right Mid of Profile Section) */}
                  {canManage && (
                    <div
                      className="relative shrink-0 self-center"
                      data-dropdown-menu="true"
                    >
                      {/* Borderless 3-Dot Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === dev.id ? null : dev.id);
                        }}
                        className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors cursor-pointer ${
                          openMenuId === dev.id
                            ? "bg-surface-secondary text-text-primary"
                            : "text-text-tertiary hover:text-text-primary hover:bg-surface-secondary/80"
                        }`}
                        aria-label="Contributor options"
                        title="Options (Edit & Delete)"
                      >
                        <MoreVertical size={18} />
                      </button>

                      {/* Compact Dropdown Menu (rounded-md, zero-padding for full row hover coverage) */}
                      {openMenuId === dev.id && (
                        <div
                          className="absolute right-0 top-full mt-1.5 z-50 w-36 bg-surface-elevated border-[1.5px] border-text-primary dark:border-border-default rounded-md shadow-[3px_3px_0px_0px_var(--accent-primary)] overflow-hidden animate-in fade-in zoom-in-95 duration-150 p-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setOpenMenuId(null);
                              setEditingDev(dev);
                              setIsAddModalOpen(true);
                            }}
                            className="w-full flex items-center px-3.5 py-2.5 text-xs font-semibold text-text-secondary border-b border-border-default/60 transition-colors text-left hover:bg-accent-primary-light hover:text-text-primary hover:font-bold dark:hover:bg-[color-mix(in_srgb,var(--accent-primary)_25%,var(--surface-primary))] dark:hover:text-white cursor-pointer group"
                          >
                            <Pencil
                              size={13}
                              className="mr-2.5 shrink-0 opacity-70 group-hover:opacity-100"
                            />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              handleRemoveDeveloper(dev.id, dev.name);
                            }}
                            className="w-full flex items-center px-3.5 py-2.5 text-xs font-semibold text-text-secondary transition-colors text-left hover:bg-red-500/10 hover:text-accent-error dark:hover:text-red-400 hover:font-bold cursor-pointer group"
                          >
                            <Trash2
                              size={13}
                              className="mr-2.5 shrink-0 text-red-500 opacity-80 group-hover:opacity-100"
                            />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Features Worked On (Unboxed, Scannable Typographic List) */}
              <div className="px-6 py-4 flex-1 border-t border-border-default/60">
                <div className="flex items-center gap-2 mb-3">
                  <Layers size={14} className="text-accent-primary" />
                  <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-text-primary">
                    Features Worked On
                  </h4>
                </div>

                <ul className="space-y-3">
                  {dev.featuresWorkedOn.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-primary shrink-0 mt-1.5" />
                      <div className="leading-snug">
                        <strong className="text-text-primary font-bold">
                          {feat.title}
                        </strong>
                        {feat.desc ? (
                          <>
                            <span>: </span>
                            <span className="text-text-secondary">{feat.desc}</span>
                          </>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 4. Action Buttons (View Profile + GitHub Link) */}
              <div className="p-4 sm:p-6 pt-4 border-t border-border-default/60 flex flex-row items-center gap-2 sm:gap-2.5 bg-surface-secondary/20">
                <Link
                  href={dev.profileUrl}
                  className="flex-1 h-10 px-3 sm:px-4 rounded-md bg-black text-white dark:bg-white dark:text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-black dark:border-white transition-all hover:bg-neutral-800 dark:hover:bg-neutral-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_var(--accent-primary)] active:translate-x-0 active:translate-y-0 active:shadow-none whitespace-nowrap"
                >
                  <span>View Profile</span>
                  <ArrowRight size={13} />
                </Link>

                {dev.github && (
                  <a
                    href={dev.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial h-10 px-3 sm:px-4 rounded-md bg-transparent text-black border border-black hover:bg-neutral-100 hover:shadow-[3px_3px_0px_black] dark:bg-transparent dark:text-white dark:border-white dark:hover:bg-neutral-900 dark:hover:shadow-[3px_3px_0px_white] font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none whitespace-nowrap"
                  >
                    <IconGitHub className="w-4 h-4" />
                    <span>GitHub</span>
                    <ExternalLink size={12} className="opacity-60" />
                  </a>
                )}
              </div>
            </article>
          ))}
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
