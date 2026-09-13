import type { Metadata } from "next";
import { departments } from "@/data/departments";
import { getPageContent } from "@/lib/pageContent";
import { AboutEditButton } from "./components/AboutEditButton";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "About MEC Computer Club | Mission, History & Tech Wings",
  description:
    "Learn about MEC Computer Club at Murari Chand College (MEC), Sylhet. Explore our history from 2019, competitive programming teams, web dev projects, and student tech community.",
  keywords: [
    "About MEC Computer Club",
    "MEC Computer Club history",
    "Murari Chand College tech club",
    "MEC Sylhet computer club",
    "MEC CP team",
    "MEC ICPC",
  ],
  alternates: {
    canonical: "https://meccomputerclub.org/about",
  },
  openGraph: {
    title: "About MEC Computer Club | Mission, History & Tech Wings",
    description:
      "Explore the journey of MEC Computer Club at Murari Chand College, Sylhet — from a 12-person CP group in 2019 to 70+ members shipping production software and competing in ICPC.",
    url: "https://meccomputerclub.org/about",
    images: ["/mec-club-photo.jpg"],
  },
};

const jsonLdAbout = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "name": "About MEC Computer Club",
  "url": "https://meccomputerclub.org/about",
  "description": "History, mission, and department structure of the MEC Computer Club at Murari Chand College, Sylhet.",
  "mainEntity": {
    "@type": "EducationalOrganization",
    "name": "MEC Computer Club",
    "foundingDate": "2019",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Sylhet",
      "addressCountry": "BD"
    }
  }
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

export default async function AboutPage() {
  const content = await getPageContent("about");

  // Hero
  const kicker = content?.hero?.kicker || "About us";
  const title = content?.hero?.title || "Hello World! Meet the Club";
  const description =
    content?.hero?.description ||
    'MEC Computer Club exists to give students a structured path from "I\'m interested in CS" to "I\'ve shipped real projects, competed at ICPC, and have something concrete to show for it."';
  const subDescription =
    content?.hero?.subDescription ||
    "Founded in 2019, the club started as a small competitive programming group. Today, 70+ members work across specialized departments — Competitive Programming, Web Development, Machine Learning, and Cybersecurity. We run weekly practice sessions, build internal tools, host contests, and send teams to national and regional competitions.";

  // Departments section
  const deptKicker = content?.departments?.sectionKicker || "Departments";
  const deptTitle = content?.departments?.sectionTitle || "Your Core Functions & Tasks";
  const deptDescription =
    content?.departments?.sectionDescription ||
    "Each department runs its own activities, projects, and learning tracks.";
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

      {/* ===== Mission Hero ===== */}
      <section
        className="relative flex flex-col justify-center overflow-hidden pt-4 pb-10 sm:pt-6 sm:pb-14 lg:pt-8 lg:pb-16"
        id="about-hero"
      >
        <div className="container">
          <div className="animate-fade-in-up">
            <span className="kicker">{kicker}</span>
            <h1 className="font-heading font-bold text-[clamp(2.2rem,5vw,3.75rem)] leading-[1.1] my-[var(--space-4)] tracking-[-0.03em] max-[768px]:text-[clamp(1.8rem,6.5vw,2.6rem)] max-[768px]:my-[var(--space-3)] max-[480px]:text-[clamp(1.55rem,7vw,2rem)] max-[480px]:leading-[1.15]">
              {title}
            </h1>
            <p className="text-lg text-text-secondary leading-[var(--leading-relaxed)] max-w-[700px] mb-[var(--space-4)] max-[768px]:text-base max-[768px]:max-w-full">
              {description}
            </p>
            <p className="text-base text-text-tertiary leading-[var(--leading-relaxed)] max-w-[700px]">
              {subDescription}
            </p>
          </div>
        </div>
      </section>

      {/* ===== Departments ===== */}
      <section className="py-12 md:py-16 bg-surface-secondary" id="departments">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-[640px] mx-auto mb-10">
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
                  <div className="mt-auto pt-4 border-t border-dashed border-border-default">
                    <span className="font-mono [font-feature-settings:'liga'_0,'calt'_0] text-xs text-accent-primary-hover uppercase font-bold tracking-wider">
                      {dept.memberCount}+ Active Members
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== History Timeline ===== */}
      <section className="py-12 md:py-16">
        <div className="container max-w-[var(--max-width-narrow)] mx-auto px-4 md:px-8">
          <div className="text-center max-w-[640px] mx-auto mb-10">
            <span className="kicker">History</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary mb-3">
              Our Version History (How it started)
            </h2>
          </div>

          <div className="relative pl-6 before:content-[''] before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border-default">
            {milestones.map((item, idx) => (
              <div key={idx} className="relative pb-8 last:pb-0 pl-4">
                <div className="absolute -left-6 top-1.5 w-2.5 h-2.5 rounded-full bg-accent-secondary border-2 border-surface-primary z-10" />
                <div>
                  <span className="font-mono [font-feature-settings:'liga'_0,'calt'_0] text-xs text-accent-primary-hover font-bold uppercase tracking-wider block mb-1">
                    {item.year}
                  </span>
                  <h4 className="text-lg font-bold text-text-primary my-1">
                    {item.title}
                  </h4>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Admin/Moderator floating edit button */}
      <AboutEditButton />
    </>
  );
}
