import type { Metadata } from "next";
import Link from "next/link";
import { departments } from "@/data/departments";
import { getPageContent } from "@/lib/pageContent";
import { AboutEditButton } from "./components/AboutEditButton";
import {
  Users,
  Trophy,
  Code2,
  Terminal,
  Sparkles,
  ArrowRight,
  BookOpen,
  Calendar,
  Layers,
  HeartHandshake,
  CheckCircle2,
} from "lucide-react";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "About MEC Computer Club | Mission, History & Tech Wings",
  description:
    "Learn about MEC Computer Club at Mymensingh Engineering College (MEC), Mymensingh. Explore our history from 2019, competitive programming teams, web dev projects, and student tech community.",
  keywords: [
    "About MEC Computer Club",
    "MEC Computer Club history",
    "Mymensingh Engineering College tech club",
    "MEC Mymensingh computer club",
    "MEC CP team",
    "MEC ICPC",
  ],
  alternates: {
    canonical: "https://meccomputerclub.org/about",
  },
  openGraph: {
    title: "About MEC Computer Club | Mission, History & Tech Wings",
    description:
      "Explore the journey of MEC Computer Club at Mymensingh Engineering College, Mymensingh — from a 12-person CP group in 2019 to 70+ members shipping production software and competing in ICPC.",
    url: "https://meccomputerclub.org/about",
    images: ["/mec-club-photo.jpg"],
  },
};

const jsonLdAbout = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "name": "About MEC Computer Club",
  "url": "https://meccomputerclub.org/about",
  "description": "History, mission, and department structure of the MEC Computer Club at Mymensingh Engineering College, Mymensingh.",
  "mainEntity": {
    "@type": "EducationalOrganization",
    "name": "MEC Computer Club",
    "foundingDate": "2019",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Mymensingh",
      "addressCountry": "BD",
    },
  },
};

// Fallback defaults (used when API hasn't been seeded yet)
const DEFAULT_MILESTONES = [
  {
    year: "2019",
    title: "Founded",
    description: "Started as a CP study group with 12 members and a shared Google Sheet.",
  },
  {
    year: "2020",
    title: "First ICPC participation",
    description: "Sent our first team to ICPC Asia Dhaka Regional. Didn't place, but learned everything.",
  },
  {
    year: "2022",
    title: "Expanded to 4 departments",
    description: "Added Web Dev, ML/AI, and Cybersecurity panels. Membership grew to 40+.",
  },
  {
    year: "2024",
    title: "Built MEC Judge",
    description: "Launched our own online judge platform. 80+ students used it in the first contest.",
  },
  {
    year: "2025",
    title: "70+ members, 3 ICPC teams",
    description: "Largest year yet. Shipping projects, running workshops, and sending 3 teams to ICPC.",
  },
];

const CORE_VALUES = [
  {
    number: "01",
    title: "Learn Without Barriers",
    description:
      "No prerequisites, no gatekeeping. From complete beginners writing their first loop to senior students mastering dynamic programming, everyone has a clear runway.",
    icon: BookOpen,
  },
  {
    number: "02",
    title: "Build Real Software",
    description:
      "We don't limit ourselves to code snippets. Our members build real-world systems, campus platforms like MEC Judge, club portals, and open-source tools.",
    icon: Terminal,
  },
  {
    number: "03",
    title: "Share & Lift Together",
    description:
      "Senior members actively mentor juniors, host regular upsolving circles, and publish documentation so every generation goes further than the last.",
    icon: HeartHandshake,
  },
];

export default async function AboutPage() {
  const content = await getPageContent("about");

  // Hero
  const kicker = content?.hero?.kicker || "About Us";
  const title = content?.hero?.title || "Hello World! Meet the Club";
  const description =
    content?.hero?.description ||
    'MEC Computer Club exists to give students a structured path from "I\'m interested in CS" to "I\'ve shipped real projects, competed at ICPC, and have something concrete to show for it."';
  const subDescription =
    content?.hero?.subDescription ||
    "Founded in 2019, the club started as a small competitive programming group. Today, 70+ members work across specialized departments — Competitive Programming, Web Development, Machine Learning, and Cybersecurity. We run weekly practice sessions, build internal tools, host contests, and send teams to national and regional competitions.";

  // Departments section
  const deptKicker = content?.departments?.sectionKicker || "Departments";
  const deptTitle = content?.departments?.sectionTitle || "Our Tech Wings & Specialized Panels";
  const deptDescription =
    content?.departments?.sectionDescription ||
    "Each department runs its own curated roadmaps, weekly practice sessions, and collaborative projects.";
  const memberCounts: Record<string, number> = content?.departments?.memberCounts || {};

  // Merge API member counts over static department data
  const mergedDepartments = departments.map((dept) => ({
    ...dept,
    memberCount:
      memberCounts[dept.id] !== undefined ? memberCounts[dept.id] : dept.memberCount,
  }));

  // Milestones
  const milestones: { year: string; title: string; description: string }[] =
    content?.milestones && Array.isArray(content.milestones) && content.milestones.length > 0
      ? content.milestones
      : DEFAULT_MILESTONES;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdAbout) }}
      />

      {/* ===== 1. Mission Hero (Consistent max-w-6xl Width) ===== */}
      <section
        className="relative flex flex-col justify-center overflow-hidden pt-6 pb-10 sm:pt-10 sm:pb-14 lg:pt-12 lg:pb-16"
        id="about-hero"
      >
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Narrative Column (7 cols) */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              {/* Pill kicker badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-secondary border border-border-default mb-4 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
                <span className="font-mono [font-feature-settings:'liga'_0,'calt'_0] text-xs font-bold text-text-secondary uppercase tracking-wider">
                  {kicker} • Est. 2019
                </span>
              </div>

              <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] text-text-primary tracking-tight leading-[1.12] mb-5">
                {title.includes("Meet the Club") ? (
                  <>
                    Hello World! <br className="hidden sm:inline" />
                    <span className="text-accent-primary-hover">Meet the Club.</span>
                  </>
                ) : (
                  title
                )}
              </h1>

              <p className="text-base sm:text-lg font-medium text-text-secondary leading-relaxed mb-6 max-w-xl">
                {description}
              </p>

              {/* Quick Action Navigation Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-primary text-accent-primary-text font-heading text-sm font-bold border-2 border-text-primary dark:border-border-default shadow-[3px_3px_0px_var(--border-brutalist)] hover:shadow-[5px_5px_0px_var(--border-brutalist)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                >
                  <span>Join Club</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/cp-hub"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-elevated text-text-primary font-heading text-sm font-bold border-2 border-text-primary dark:border-border-default shadow-[3px_3px_0px_var(--border-brutalist)] hover:bg-surface-secondary hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                >
                  <Code2 className="h-4 w-4 text-accent-primary" />
                  <span>Explore CP Hub</span>
                </Link>
                <Link
                  href="/our-people"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-elevated text-text-secondary hover:text-text-primary font-heading text-sm font-bold border border-border-default hover:bg-surface-secondary transition-all"
                >
                  <Users className="h-4 w-4" />
                  <span>Meet Leadership</span>
                </Link>
              </div>
            </div>

            {/* Right Story Card Column (5 cols) */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-surface-elevated border-2 border-border-brutalist dark:border-border-default p-6 sm:p-7 shadow-[5px_5px_0px_0px_var(--border-default)]">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-border-default">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-text-primary">
                    <Terminal className="h-4 w-4 text-accent-primary" />
                    <span>about_us.ts</span>
                  </div>
                  <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-full bg-surface-secondary border border-border-default text-text-tertiary">
                    Mymensingh Engineering College
                  </span>
                </div>

                <p className="text-sm text-text-secondary leading-relaxed mb-5">
                  {subDescription}
                </p>

                <div className="pt-3 border-t border-border-default/80 flex items-center justify-between text-xs font-mono text-text-tertiary">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-accent-success" />
                    <span>Active Community</span>
                  </span>
                  <span className="text-accent-primary-hover font-bold">Learn • Build • Share</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 2. Impact / At A Glance Bar (Consistent max-w-6xl Width) ===== */}
      <section className="py-6 border-y border-border-default bg-surface-elevated/60 backdrop-blur-xs">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-4 sm:p-5 rounded-2xl bg-surface-primary border border-border-default flex flex-col items-center text-center shadow-xs">
              <span className="font-heading text-3xl sm:text-4xl font-extrabold text-accent-primary mb-1">
                70+
              </span>
              <span className="font-heading text-sm font-bold text-text-primary mb-0.5">
                Active Members
              </span>
              <span className="text-xs text-text-tertiary">Across 5 departments</span>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-surface-primary border border-border-default flex flex-col items-center text-center shadow-xs">
              <span className="font-heading text-3xl sm:text-4xl font-extrabold text-accent-primary mb-1">
                3 Teams
              </span>
              <span className="font-heading text-sm font-bold text-text-primary mb-0.5">
                ICPC Regionals
              </span>
              <span className="text-xs text-text-tertiary">Competing nationally</span>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-surface-primary border border-border-default flex flex-col items-center text-center shadow-xs">
              <span className="font-heading text-3xl sm:text-4xl font-extrabold text-accent-primary mb-1">
                15+
              </span>
              <span className="font-heading text-sm font-bold text-text-primary mb-0.5">
                Contests &amp; Jams
              </span>
              <span className="text-xs text-text-tertiary">Organized per year</span>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-surface-primary border border-border-default flex flex-col items-center text-center shadow-xs">
              <span className="font-heading text-3xl sm:text-4xl font-extrabold text-accent-primary mb-1">
                100%
              </span>
              <span className="font-heading text-sm font-bold text-text-primary mb-0.5">
                Student Led
              </span>
              <span className="text-xs text-text-tertiary">Peer-driven education</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 3. Core Philosophy & Values (Consistent max-w-6xl Width) ===== */}
      <section className="py-14 sm:py-20">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="text-center max-w-[640px] mx-auto mb-12">
            <span className="kicker">Our Culture</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary mb-3">
              Learn. Build. Share.
            </h2>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
              We operate on three foundational principles that turn curious beginners into confident engineers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CORE_VALUES.map((val) => {
              const IconComp = val.icon;
              return (
                <div
                  key={val.number}
                  className="relative p-6 sm:p-7 rounded-2xl bg-surface-elevated border-2 border-border-brutalist dark:border-border-default shadow-[4px_4px_0px_0px_var(--border-default)] hover:shadow-[6px_6px_0px_0px_var(--accent-primary)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex flex-col"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-surface-secondary border border-border-default flex items-center justify-center text-accent-primary">
                      <IconComp className="h-6 w-6" />
                    </div>
                    <span className="font-mono text-xs font-bold text-text-tertiary px-2.5 py-1 rounded-full bg-surface-secondary border border-border-default">
                      PILLAR {val.number}
                    </span>
                  </div>

                  <h3 className="font-heading text-xl font-bold text-text-primary mb-2.5">
                    {val.title}
                  </h3>

                  <p className="text-sm text-text-secondary leading-relaxed flex-1">
                    {val.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== 4. Departments / Tech Wings (Consistent max-w-6xl Width) ===== */}
      <section className="py-14 sm:py-20 bg-surface-secondary" id="departments">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="text-center max-w-[640px] mx-auto mb-12">
            <span className="kicker">{deptKicker}</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary mb-3">
              {deptTitle}
            </h2>
            <p className="text-base sm:text-lg text-text-tertiary">
              {deptDescription}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
            {mergedDepartments.map((dept) => (
              <div
                key={dept.id}
                className="group flex-1 basis-[320px] max-w-[500px] flex flex-col bg-surface-elevated border border-border-brutalist dark:border-border-default rounded-2xl p-6 transition-all duration-200 hover:border-border-brutalist hover:shadow-[6px_6px_0px_var(--accent-primary)] hover:-translate-x-[2px] hover:-translate-y-[2px]"
              >
                <div className="w-14 h-14 flex items-center justify-center bg-surface-secondary rounded-xl mb-4 border border-border-brutalist dark:border-border-default font-mono [font-feature-settings:'liga'_0,'calt'_0] text-xs font-bold text-text-primary transition-all duration-200 group-hover:bg-accent-primary group-hover:text-text-inverse group-hover:border-accent-primary group-hover:scale-110 group-hover:-rotate-6">
                  {dept.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-text-primary mb-2 transition-colors duration-150 group-hover:text-accent-primary">
                    {dept.name}
                  </h3>
                  <p className="text-sm sm:text-base leading-relaxed text-text-secondary mb-4">
                    {dept.description}
                  </p>
                </div>
                {dept.memberCount && (
                  <div className="mt-auto pt-4 border-t border-dashed border-border-default flex items-center justify-between">
                    <span className="font-mono [font-feature-settings:'liga'_0,'calt'_0] text-xs text-accent-primary-hover uppercase font-bold tracking-wider">
                      {dept.memberCount}+ Active Members
                    </span>
                    {dept.id === "cp" && (
                      <Link
                        href="/cp-hub"
                        className="text-xs font-bold text-accent-primary hover:underline inline-flex items-center gap-1"
                      >
                        <span>Roadmaps</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 5. Version History Timeline ===== */}
      <section className="py-14 sm:py-20">
        <div className="container max-w-[var(--max-width-narrow)] mx-auto px-4 md:px-8">
          <div className="text-center max-w-[640px] mx-auto mb-12">
            <span className="kicker">History</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary mb-3">
              Our Version History (How It Started)
            </h2>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
              From a small study circle in 2019 to an active collegiate engineering organization.
            </p>
          </div>

          <div className="relative pl-6 sm:pl-8 max-w-2xl mx-auto">
            {milestones.map((item, idx) => {
              const isLast = idx === milestones.length - 1;
              return (
                <div key={idx} className="relative pb-10 last:pb-2 pl-7 sm:pl-8">
                  {/* Vertical connecting line to next item */}
                  {!isLast && (
                    <div
                      className="absolute left-[7px] top-2.5 bottom-0 w-[2px] pointer-events-none"
                      style={{ backgroundColor: "var(--border-default)" }}
                      aria-hidden="true"
                    />
                  )}

                  {/* Clean Accent Dot Node centered precisely on vertical line */}
                  <div
                    className="absolute left-[2px] top-1.5 w-3 h-3 rounded-full border-2 border-surface-primary shadow-xs z-10"
                    style={{ backgroundColor: "var(--accent-primary)" }}
                    aria-hidden="true"
                  />

                  <div>
                    <span
                      className="font-mono [font-feature-settings:'liga'_0,'calt'_0] text-xs font-bold uppercase tracking-wider block mb-1"
                      style={{ color: "var(--accent-primary-hover)" }}
                    >
                      {item.year}
                    </span>
                    <h3 className="font-heading text-lg sm:text-xl font-bold text-text-primary my-1">
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== 6. Leadership & Advisors Preview ===== */}
      <section className="py-14 sm:py-20 bg-surface-secondary border-t border-border-default">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl text-center">
          <div className="p-8 sm:p-10 rounded-3xl bg-surface-elevated border-2 border-border-brutalist dark:border-border-default shadow-[4px_4px_0px_0px_var(--border-default)]">
            <span className="kicker">People Behind The Club</span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary mb-3">
              Guided by Faculty, Run by Students
            </h2>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-xl mx-auto mb-6">
              Our club is mentored by faculty advisors from Mymensingh Engineering College and steered by an elected executive committee of passionate students across all years.
            </p>
            <Link
              href="/our-people"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-primary text-text-primary font-heading text-sm font-bold border border-border-default shadow-xs hover:border-accent-primary hover:bg-surface-secondary transition-all"
            >
              <Users className="h-4 w-4 text-accent-primary" />
              <span>View Executive Committee &amp; Advisors</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Admin/Moderator floating edit button */}
      <AboutEditButton />
    </>
  );
}


