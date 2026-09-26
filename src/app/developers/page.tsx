import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { 
  Code2, 
  Terminal, 
  Layers, 
  Cpu, 
  ExternalLink, 
  GitBranch, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  UserCheck, 
  Heart,
  Globe,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export const revalidate = 120;

export const metadata: Metadata = {
  title: "Core Developers & Engineering Team | MEC Computer Club",
  description:
    "Meet the core developers and student engineers who architected and built the official MEC Computer Club platform at Mymensingh Engineering College.",
  keywords: [
    "MEC Computer Club developers",
    "MEC CC software team",
    "Nasir Ahmed MEC",
    "Tawhid Ahmed MEC",
    "MEC CSE engineers",
    "Mymensingh Engineering College developers",
  ],
  alternates: {
    canonical: "https://meccomputerclub.org/developers",
  },
};

const IconGitHub = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const coreDevelopers = [
  {
    name: "Md. Nasir Ahmed",
    studentId: "210347",
    department: "Department of CSE",
    batch: "5th Batch • Session 2021-2022",
    clubRole: "Finance Secretary",
    devRole: "Lead Full-Stack Architect & Core Maintainer",
    avatarBg: "from-lime-500 to-emerald-600",
    profileUrl: "/profile/210347",
    github: "https://github.com/nasir-ahmed-dev",
    initials: "NA",
    tagline: "Building scalable, high-performance systems and backend architecture for student communities.",
    responsibilities: [
      "End-to-End System Architecture (Next.js 15, Node.js, Express, MongoDB)",
      "Edge Caching, ISR Architecture & Web Performance Optimization",
      "Authentication, RBAC Permissions & Secure Session Management",
      "Competitive Programming Hub & Live Rating Tracker Integration",
      "Database Modeling, RESTful APIs & Data Pipeline Reliability",
    ],
    skills: ["Next.js", "TypeScript", "Node.js", "Express", "MongoDB", "ISR & Turbopack", "Tailwind CSS"],
  },
  {
    name: "Tawhid Ahmed (Abokash)",
    studentId: "210311",
    department: "Department of CSE",
    batch: "5th Batch • Session 2021-2022",
    clubRole: "Creative & Media Executive",
    devRole: "Core Frontend Developer & UI/UX Architect",
    avatarBg: "from-amber-500 to-orange-600",
    profileUrl: "/profile/210311",
    github: "https://github.com/abokash",
    initials: "TA",
    tagline: "Crafting bold Neo-Brutalist interfaces, interactive web utilities, and immersive user experiences.",
    responsibilities: [
      "Neo-Brutalist Design System & Fluid Theme Vibe Engine",
      "Photo Sigil Watermark Studio (Client-side Canvas Image Engine)",
      "Official Cover Page & Lab Report Generator with A4 PDF Engine",
      "Component Library Architecture, Accessibility & Micro-Interactions",
      "Responsive Layouts, Mobile Optimization & Creative Media Assets",
    ],
    skills: ["React 19", "UI/UX Architecture", "Tailwind CSS", "HTML5 Canvas", "Design Systems", "TypeScript"],
  },
];

const techStack = [
  { name: "Next.js 15+", desc: "App Router & ISR Caching", badge: "Framework" },
  { name: "TypeScript", desc: "End-to-End Type Safety", badge: "Language" },
  { name: "Tailwind CSS v4", desc: "Design System & Tokens", badge: "Styling" },
  { name: "Express / Node", desc: "High-Throughput REST APIs", badge: "Backend" },
  { name: "MongoDB", desc: "Document Database", badge: "Storage" },
  { name: "Turbopack", desc: "Instant Builds & Bundling", badge: "Tooling" },
];

export default function DevelopersPage() {
  return (
    <div className="w-full pb-16 md:pb-24">
      {/* ── Hero Header ── */}
      <section className="pt-10 md:pt-14 pb-10 border-b border-border-default bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent-primary-light/20 via-surface-primary to-surface-primary">
        <div className="container max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-primary-light text-accent-primary-text font-mono text-xs font-bold uppercase tracking-wider mb-4 border border-border-default shadow-xs">
            <Terminal size={14} /> MEC-CC // ENGINEERING TEAM
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black font-heading tracking-tight text-text-primary mb-4 leading-tight">
            The Minds Behind <br className="hidden sm:inline" />
            <span className="text-accent-text-on-surface underline decoration-accent-primary decoration-wavy decoration-2">
              the Platform
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Architected, designed, and actively engineered by students of the{" "}
            <strong className="text-text-primary font-bold">Department of Computer Science & Engineering</strong> at{" "}
            <strong className="text-text-primary font-bold">Mymensingh Engineering College</strong>.
          </p>
        </div>
      </section>

      {/* ── Developer Profiles Grid ── */}
      <section className="container max-w-5xl mx-auto px-4 py-12 md:py-16">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="kicker">Core Leadership</span>
          <h2 className="text-2xl sm:text-3xl font-black font-heading text-text-primary">
            Lead Software Architects
          </h2>
          <p className="text-sm sm:text-base text-text-tertiary mt-2">
            The primary contributors responsible for system design, codebase maintenance, and feature development.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {coreDevelopers.map((dev) => (
            <article
              key={dev.studentId}
              className="bg-surface-elevated border-2 border-border-brutalist dark:border-border-default rounded-2xl p-6 sm:p-8 shadow-[6px_6px_0px_var(--border-brutalist)] flex flex-col justify-between transition-transform duration-200 hover:-translate-y-1"
            >
              <div>
                {/* Header Row: Avatar + Info */}
                <div className="flex items-start gap-4 sm:gap-5 mb-5">
                  <div
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${dev.avatarBg} text-white font-heading font-black text-2xl sm:text-3xl flex items-center justify-center shrink-0 border-2 border-border-brutalist dark:border-border-default shadow-[3px_3px_0px_var(--border-brutalist)]`}
                  >
                    {dev.initials}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-xl sm:text-2xl font-black font-heading text-text-primary truncate">
                        {dev.name}
                      </h3>
                      <span className="inline-flex items-center text-accent-primary-hover" title="Verified Core Developer">
                        <CheckCircle2 size={18} />
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-accent-primary-hover font-mono mt-0.5">
                      {dev.devRole}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 mt-2 font-mono text-[11px] text-text-tertiary">
                      <span className="bg-surface-secondary px-2 py-0.5 rounded border border-border-default font-bold text-text-primary">
                        ID: {dev.studentId}
                      </span>
                      <span>{dev.batch}</span>
                    </div>
                  </div>
                </div>

                {/* Tagline */}
                <p className="text-sm text-text-secondary leading-relaxed mb-5 italic border-l-2 border-accent-primary pl-3">
                  &ldquo;{dev.tagline}&rdquo;
                </p>

                {/* Responsibilities & Achievements */}
                <div className="mb-6">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-text-tertiary mb-3 flex items-center gap-1.5">
                    <Layers size={14} className="text-accent-primary" /> Key Contributions
                  </h4>
                  <ul className="space-y-2">
                    {dev.responsibilities.map((resp, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-text-secondary">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-primary shrink-0 mt-1.5" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech Skills Badges */}
                <div className="mb-6">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-text-tertiary mb-2.5 flex items-center gap-1.5">
                    <Cpu size={14} className="text-accent-primary" /> Primary Stack
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {dev.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-surface-secondary text-text-primary border border-border-default"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-5 border-t border-border-default flex items-center justify-between gap-3 mt-2">
                <span className="text-xs font-semibold text-text-tertiary">
                  Club: <strong className="text-text-primary">{dev.clubRole}</strong>
                </span>

                <div className="flex items-center gap-2">
                  {dev.github && (
                    <a
                      href={dev.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-surface-secondary hover:bg-surface-elevated border border-border-default text-text-secondary hover:text-text-primary transition-colors"
                      title="GitHub Profile"
                    >
                      <IconGitHub />
                    </a>
                  )}
                  <Link
                    href={dev.profileUrl}
                    className="inline-flex items-center gap-1 text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-accent-primary hover:bg-accent-primary-hover text-accent-primary-text transition-colors shadow-xs"
                  >
                    View Profile <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Architecture Overview Strip ── */}
      <section className="container max-w-5xl mx-auto px-4 py-8">
        <div className="bg-surface-secondary border-2 border-border-brutalist dark:border-border-default rounded-2xl p-6 sm:p-8 shadow-[4px_4px_0px_var(--border-brutalist)]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="kicker">Stack & Architecture</span>
              <h3 className="text-xl sm:text-2xl font-bold font-heading text-text-primary">
                Built with Modern Engineering Standards
              </h3>
            </div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-text-tertiary bg-surface-primary px-3 py-1.5 rounded-lg border border-border-default">
              <GitBranch size={14} className="text-accent-primary" /> Production Architecture
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {techStack.map((tech) => (
              <div
                key={tech.name}
                className="bg-surface-elevated p-3.5 rounded-xl border border-border-default text-center flex flex-col justify-between"
              >
                <span className="text-[10px] font-mono uppercase font-bold text-accent-primary-hover tracking-wider mb-1">
                  {tech.badge}
                </span>
                <span className="font-bold text-sm text-text-primary">{tech.name}</span>
                <span className="text-[11px] text-text-tertiary leading-tight mt-1">{tech.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Open Source / Contributing Call to Action ── */}
      <section className="container max-w-5xl mx-auto px-4 pt-6">
        <div className="bg-gradient-to-r from-surface-elevated to-surface-secondary border-2 border-border-brutalist dark:border-border-default rounded-2xl p-8 text-center shadow-[6px_6px_0px_var(--border-brutalist)]">
          <div className="w-12 h-12 rounded-xl bg-accent-primary/10 border border-border-default flex items-center justify-center mx-auto mb-4 text-accent-primary-hover">
            <Code2 size={24} />
          </div>

          <h3 className="text-xl sm:text-2xl font-bold font-heading text-text-primary mb-2">
            Want to Build the Future with Us?
          </h3>
          <p className="text-sm sm:text-base text-text-secondary max-w-lg mx-auto mb-6">
            MEC Computer Club projects are built by students, for students. If you are passionate about software engineering, competitive programming, or UI design, reach out and contribute.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button href="/projects" variant="primary" size="md">
              Explore Shipped Projects
            </Button>
            <Button href="/contact" variant="secondary" size="md">
              Get in Touch with the Team
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
