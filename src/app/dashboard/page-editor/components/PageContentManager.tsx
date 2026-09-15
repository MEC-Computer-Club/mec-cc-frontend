"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import {
  Save,
  RefreshCw,
  ExternalLink,
  Phone,
  Megaphone,
  Sparkles,
  Home,
  Code2,
  MessageSquare,
  Award,
  BookOpen,
  BarChart3,
  Layers,
  Plus,
  Trash2,
  Users,
  Briefcase,
} from "lucide-react";
import toast from "react-hot-toast";
import { API_BASE_URL } from "@/lib/api";
import FilterSelect from "@/app/dashboard/components/FilterSelect";

const API_BASE = API_BASE_URL;

type TabKey = "home" | "cp-hub" | "contact" | "about" | "sponsor";
const VALID_TABS: TabKey[] = ["home", "cp-hub", "contact", "about", "sponsor"];

const PAGE_OPTIONS = [
  { value: "home", label: "Home Page" },
  { value: "cp-hub", label: "CP Hub Page" },
  { value: "contact", label: "Contact Page" },
  { value: "about", label: "About Page" },
  { value: "sponsor", label: "Corporate Sponsorship Page" },
];

export default function PageContentManager({ initialSection }: { initialSection?: string }) {
  const resolvedInitial: TabKey = initialSection && VALID_TABS.includes(initialSection as TabKey)
    ? (initialSection as TabKey)
    : "home";
  const [activeTab, setActiveTab] = useState<TabKey>(resolvedInitial);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    if (initialSection && VALID_TABS.includes(initialSection as TabKey)) {
      setActiveTab(initialSection as TabKey);
    }
  }, [initialSection]);

  // Home Page Content State
  const [homeContent, setHomeContent] = useState({
    hero: {
      title: "Debug your limits. Build reality.",
      highlightText: "Welcome to the Club.",
      description:
        "MEC Computer Club is where students compete in ICPC, build production software, and grow as developers — not just attend meetings.",
      ctaText: "Become a Member",
      ctaLink: "/join",
    },
    contact: {
      email: "meccomputerclub@gmail.com",
      presidentPhone: "01773-758374",
      generalSecretaryPhone: "01568985672",
      location:
        "Department of CSE, Mymensingh Engineering College, Khagdahar, Mymensingh-2200",
    },
    announcement: {
      enabled: false,
      badge: "Notice",
      text: "Intra-MEC Programming Contest 2026 pre-registration is now open!",
      link: "/events",
    },
    stats: {
      members: "70+",
      segments: "5+",
      events: "12+",
    },
    techTreeEvents: {
      cp: "8+ EVENTS",
      webdev: "5+ EVENTS",
      ml: "3+ EVENTS",
      cybersec: "3+ EVENTS",
      gaming: "3+ EVENTS",
    },
  });

  // CP Hub Content State
  const [cpContent, setCpContent] = useState({
    header: {
      kicker: "Competitive Programming",
      title: "CP Hub",
      description:
        "Leaderboard, curated roadmaps, problem sets, and resources — everything the CP team needs in one place.",
    },
  });

  // Contact Page Content State
  const [contactContent, setContactContent] = useState({
    info: {
      email: "meccomputerclub@gmail.com",
      presidentPhone: "01773-758374",
      generalSecretaryPhone: "01568985672",
      location:
        "Department of CSE, Mymensingh Engineering College, Khagdahar, Mymensingh-2200",
    },
  });

  // About Page Content State
  const [aboutContent, setAboutContent] = useState({
    hero: {
      kicker: "About us",
      title: "Hello World! Meet the Club",
      description:
        'MEC Computer Club exists to give students a structured path from "I\'m interested in CS" to "I\'ve shipped real projects, competed at ICPC, and have something concrete to show for it."',
      subDescription:
        "Founded in 2019, the club started as a small competitive programming group. Today, 70+ members work across specialized departments — Competitive Programming, Web Development, Machine Learning, and Cybersecurity. We run weekly practice sessions, build internal tools, host contests, and send teams to national and regional competitions.",
    },
    departments: {
      sectionKicker: "Departments",
      sectionTitle: "Your Core Functions & Tasks",
      sectionDescription:
        "Each department runs its own activities, projects, and learning tracks.",
      memberCounts: {
        cp: 24,
        webdev: 18,
        ml: 15,
        cybersec: 12,
        gaming: 20,
      } as Record<string, number>,
    },
    milestones: [
      { year: "2019", title: "Founded", description: "Started as a CP study group with 12 members and a shared Google Sheet." },
      { year: "2020", title: "First ICPC participation", description: "Sent our first team to ICPC Asia Dhaka Regional. Didn't place, but learned everything." },
      { year: "2022", title: "Expanded to 4 departments", description: "Added Web Dev, ML/AI, and Cybersecurity panels. Membership grew to 40+." },
      { year: "2024", title: "Built MEC Judge", description: "Launched our own online judge platform. 80+ students used it in the first contest." },
      { year: "2025", title: "70+ members, 3 ICPC teams", description: "Largest year yet. Shipping projects, running workshops, and sending 3 teams to ICPC." },
    ],
  });

  // Corporate Sponsorship Content State
  const [sponsorContent, setSponsorContent] = useState({
    hero: {
      kicker: "Corporate Sponsorship",
      title: "Acquire Top Tech Talent",
      description:
        "150+ active members. Trusted by 15+ companies to deliver battle-tested engineering students before they hit the job market.",
      deckButtonText: "Get the Pitch Deck",
      tiersButtonText: "View Sponsorship Tiers",
    },
    stats: {
      stat1Value: "150+",
      stat1Label: "Active Members",
      stat2Value: "20+",
      stat2Label: "Yearly Events",
      stat3Value: "500+",
      stat3Label: "Participants",
      stat4Value: "15+",
      stat4Label: "Sponsors",
    },
    cta: {
      cycleNotice: "Sponsorship cycle closes Nov 30",
      title: "Ready to collaborate?",
      emailButtonText: "Email Us",
      callButtonText: "Call Us",
    },
  });

  // Fetch content for a page
  const fetchPageContent = async (pageKey: string) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/page-content/${pageKey}`);
      if (res.data?.success && res.data?.data?.sections) {
        const sections = res.data.data.sections;
        if (pageKey === "home") {
          setHomeContent((prev) => ({
            ...prev,
            ...sections,
            hero: { ...prev.hero, ...(sections.hero || {}) },
            contact: { ...prev.contact, ...(sections.contact || {}) },
            announcement: { ...prev.announcement, ...(sections.announcement || {}) },
            stats: { ...prev.stats, ...(sections.stats || {}) },
            techTreeEvents: { ...prev.techTreeEvents, ...(sections.techTreeEvents || {}) },
          }));
        } else if (pageKey === "cp-hub") {
          setCpContent((prev) => ({
            ...prev,
            ...sections,
            header: { ...prev.header, ...(sections.header || {}) },
          }));
        } else if (pageKey === "contact") {
          setContactContent((prev) => ({
            ...prev,
            ...sections,
            info: { ...prev.info, ...(sections.info || {}) },
          }));
        } else if (pageKey === "about") {
          setAboutContent((prev) => ({
            ...prev,
            ...sections,
            hero: { ...prev.hero, ...(sections.hero || {}) },
            departments: {
              ...prev.departments,
              ...(sections.departments || {}),
              memberCounts: { ...prev.departments.memberCounts, ...(sections.departments?.memberCounts || {}) },
            },
            milestones: Array.isArray(sections.milestones) && sections.milestones.length > 0
              ? sections.milestones
              : prev.milestones,
          }));
        } else if (pageKey === "sponsor") {
          setSponsorContent((prev) => ({
            ...prev,
            ...sections,
            hero: { ...prev.hero, ...(sections.hero || {}) },
            stats: { ...prev.stats, ...(sections.stats || {}) },
            cta: { ...prev.cta, ...(sections.cta || {}) },
          }));
        }
      }
    } catch (err) {
      console.warn(`Could not load content for ${pageKey}, using defaults:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageContent(activeTab);
  }, [activeTab]);

  // Save changes
  const handleSave = async () => {
    setSaving(true);
    try {
      let sectionsToSave = {};
      if (activeTab === "home") sectionsToSave = homeContent;
      if (activeTab === "cp-hub") sectionsToSave = cpContent;
      if (activeTab === "contact") sectionsToSave = contactContent;
      if (activeTab === "about") sectionsToSave = aboutContent;
      if (activeTab === "sponsor") sectionsToSave = sponsorContent;

      await axios.put(
        `${API_BASE}/api/page-content/${activeTab}`,
        { sections: sectionsToSave },
        { withCredentials: true }
      );
      toast.success(
        `${activeTab.toUpperCase()} content saved successfully! Changes are live.`
      );
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          "Failed to save page content. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const getLivePageUrl = () => {
    if (activeTab === "home") return "/";
    if (activeTab === "cp-hub") return "/cp-hub";
    if (activeTab === "about") return "/about";
    if (activeTab === "sponsor") return "/collaborate/sponsor";
    return "/contact";
  };

  return (
    <div className="space-y-6 max-w-5xl pb-24">

      {/* Page Selector Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-elevated border border-border-brutalist dark:border-border-default rounded-xl p-4 shadow-[3px_3px_0px_var(--accent-primary)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-primary/10 text-accent-primary flex items-center justify-center font-bold border border-accent-primary/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-text-tertiary block">
              Active Page View
            </span>
            <span className="text-sm sm:text-base font-bold text-text-primary">
              {PAGE_OPTIONS.find((p) => p.value === activeTab)?.label || "Select Page"}
            </span>
          </div>
        </div>

        <div className="w-full sm:w-72">
          <FilterSelect
            value={activeTab}
            onChange={(val) => setActiveTab(val as TabKey)}
            options={PAGE_OPTIONS}
            placeholder="Select page..."
            className="w-full"
          />
        </div>
      </div>

      {/* Main Content Form */}
      {loading ? (
        <div className="p-12 text-center text-text-tertiary flex items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin text-accent-primary" />
          <span>Loading page content...</span>
        </div>
      ) : activeTab === "home" ? (
        <div className="space-y-6">
          {/* 1. Contact & Executive Numbers */}
          <div className="bg-surface-elevated border border-border-brutalist dark:border-border-default rounded-2xl p-5 shadow-[4px_4px_0px_var(--accent-primary)] space-y-4">
            <div className="flex items-center gap-2 border-b border-border-default pb-3">
              <Phone className="w-4 h-4 text-accent-primary" />
              <h2 className="text-base font-bold text-text-primary">
                Contact Numbers &amp; Headquarters
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-text-tertiary mb-1">
                  President Contact Number
                </label>
                <input
                  type="text"
                  value={homeContent.contact.presidentPhone}
                  onChange={(e) =>
                    setHomeContent({
                      ...homeContent,
                      contact: { ...homeContent.contact, presidentPhone: e.target.value },
                    })
                  }
                  placeholder="01773-758374"
                  className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary font-mono text-text-primary"
                />
                <span className="text-[11px] text-text-tertiary">
                  Shown in the Homepage contact card as (President).
                </span>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-text-tertiary mb-1">
                  General Secretary Contact Number
                </label>
                <input
                  type="text"
                  value={homeContent.contact.generalSecretaryPhone}
                  onChange={(e) =>
                    setHomeContent({
                      ...homeContent,
                      contact: {
                        ...homeContent.contact,
                        generalSecretaryPhone: e.target.value,
                      },
                    })
                  }
                  placeholder="01568985672"
                  className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary font-mono text-text-primary"
                />
                <span className="text-[11px] text-text-tertiary">
                  Shown in the Homepage contact card as (General Secretary).
                </span>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-text-tertiary mb-1">
                  Email Contact
                </label>
                <input
                  type="email"
                  value={homeContent.contact.email}
                  onChange={(e) =>
                    setHomeContent({
                      ...homeContent,
                      contact: { ...homeContent.contact, email: e.target.value },
                    })
                  }
                  placeholder="meccomputerclub@gmail.com"
                  className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-text-tertiary mb-1">
                  Campus / Lab Location
                </label>
                <input
                  type="text"
                  value={homeContent.contact.location}
                  onChange={(e) =>
                    setHomeContent({
                      ...homeContent,
                      contact: { ...homeContent.contact, location: e.target.value },
                    })
                  }
                  placeholder="Department of CSE..."
                  className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary"
                />
              </div>
            </div>
          </div>

          {/* 2. Hero Section */}
          <div className="bg-surface-elevated border border-border-brutalist dark:border-border-default rounded-2xl p-5 shadow-[4px_4px_0px_var(--accent-primary)] space-y-4">
            <div className="flex items-center gap-2 border-b border-border-default pb-3">
              <Sparkles className="w-4 h-4 text-accent-primary" />
              <h2 className="text-base font-bold text-text-primary">
                Hero Section
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-text-tertiary mb-1">
                  Main Headline
                </label>
                <input
                  type="text"
                  value={homeContent.hero.title}
                  onChange={(e) =>
                    setHomeContent({
                      ...homeContent,
                      hero: { ...homeContent.hero, title: e.target.value },
                    })
                  }
                  placeholder="Debug your limits. Build reality."
                  className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-text-tertiary mb-1">
                  Highlighted Sub-headline
                </label>
                <input
                  type="text"
                  value={homeContent.hero.highlightText}
                  onChange={(e) =>
                    setHomeContent({
                      ...homeContent,
                      hero: { ...homeContent.hero, highlightText: e.target.value },
                    })
                  }
                  placeholder="Welcome to the Club."
                  className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-text-tertiary mb-1">
                  Description Paragraph
                </label>
                <textarea
                  rows={3}
                  value={homeContent.hero.description}
                  onChange={(e) =>
                    setHomeContent({
                      ...homeContent,
                      hero: { ...homeContent.hero, description: e.target.value },
                    })
                  }
                  placeholder="MEC Computer Club is where students compete in ICPC..."
                  className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-text-tertiary mb-1">
                    Primary CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={homeContent.hero.ctaText}
                    onChange={(e) =>
                      setHomeContent({
                        ...homeContent,
                        hero: { ...homeContent.hero, ctaText: e.target.value },
                      })
                    }
                    placeholder="Become a Member"
                    className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-text-tertiary mb-1">
                    Primary CTA Button Link
                  </label>
                  <input
                    type="text"
                    value={homeContent.hero.ctaLink}
                    onChange={(e) =>
                      setHomeContent({
                        ...homeContent,
                        hero: { ...homeContent.hero, ctaLink: e.target.value },
                      })
                    }
                    placeholder="/join"
                    className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Top Announcement Banner */}
          <div className="bg-surface-elevated border border-border-brutalist dark:border-border-default rounded-2xl p-5 shadow-[4px_4px_0px_var(--accent-primary)] space-y-4">
            <div className="flex items-center justify-between border-b border-border-default pb-3">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-accent-primary" />
                <h2 className="text-base font-bold text-text-primary">
                  Announcement Notice Banner
                </h2>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={homeContent.announcement.enabled}
                  onChange={(e) =>
                    setHomeContent({
                      ...homeContent,
                      announcement: {
                        ...homeContent.announcement,
                        enabled: e.target.checked,
                      },
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-surface-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent-primary"></div>
                <span className="ml-2 text-xs font-bold text-text-primary">
                  {homeContent.announcement.enabled ? "ACTIVE" : "OFF"}
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-text-tertiary mb-1">
                  Badge Label
                </label>
                <input
                  type="text"
                  value={homeContent.announcement.badge}
                  onChange={(e) =>
                    setHomeContent({
                      ...homeContent,
                      announcement: {
                        ...homeContent.announcement,
                        badge: e.target.value,
                      },
                    })
                  }
                  placeholder="Notice"
                  className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-text-tertiary mb-1">
                  Announcement Message
                </label>
                <input
                  type="text"
                  value={homeContent.announcement.text}
                  onChange={(e) =>
                    setHomeContent({
                      ...homeContent,
                      announcement: {
                        ...homeContent.announcement,
                        text: e.target.value,
                      },
                    })
                  }
                  placeholder="e.g. Registration for Contest 2026 is now open!"
                  className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary"
                />
              </div>
            </div>
          </div>

          {/* 4. Hero Counter Stats */}
          <div className="bg-surface-elevated border border-border-brutalist dark:border-border-default rounded-2xl p-5 shadow-[4px_4px_0px_var(--accent-primary)] space-y-4">
            <div className="flex items-center gap-2 border-b border-border-default pb-3">
              <BarChart3 className="w-4 h-4 text-accent-primary" />
              <h2 className="text-base font-bold text-text-primary">
                Hero Counter Stats (Members, Segments, Events)
              </h2>
            </div>
            <p className="text-xs text-text-tertiary">
              Customize the three highlight metrics displayed right beneath the hero action buttons on the home page.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-text-tertiary mb-1">
                  Members Metric
                </label>
                <input
                  type="text"
                  value={homeContent.stats.members}
                  onChange={(e) =>
                    setHomeContent({
                      ...homeContent,
                      stats: { ...homeContent.stats, members: e.target.value },
                    })
                  }
                  placeholder="70+"
                  className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary font-bold font-mono"
                />
                <span className="text-[11px] text-text-tertiary">
                  Label: Members
                </span>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-text-tertiary mb-1">
                  Segments Metric
                </label>
                <input
                  type="text"
                  value={homeContent.stats.segments}
                  onChange={(e) =>
                    setHomeContent({
                      ...homeContent,
                      stats: { ...homeContent.stats, segments: e.target.value },
                    })
                  }
                  placeholder="5+"
                  className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary font-bold font-mono"
                />
                <span className="text-[11px] text-text-tertiary">
                  Label: Segments
                </span>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-text-tertiary mb-1">
                  Events Metric
                </label>
                <input
                  type="text"
                  value={homeContent.stats.events}
                  onChange={(e) =>
                    setHomeContent({
                      ...homeContent,
                      stats: { ...homeContent.stats, events: e.target.value },
                    })
                  }
                  placeholder="12+"
                  className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary font-bold font-mono"
                />
                <span className="text-[11px] text-text-tertiary">
                  Label: Events this year
                </span>
              </div>
            </div>
          </div>

          {/* 5. Tech Tree Domain Event Numbers */}
          <div className="bg-surface-elevated border border-border-brutalist dark:border-border-default rounded-2xl p-5 shadow-[4px_4px_0px_var(--accent-primary)] space-y-4">
            <div className="flex items-center gap-2 border-b border-border-default pb-3">
              <Layers className="w-4 h-4 text-accent-primary" />
              <h2 className="text-base font-bold text-text-primary">
                Tech Tree Domain Event Numbers (&quot;Choose Your Tech Tree&quot;)
              </h2>
            </div>
            <p className="text-xs text-text-tertiary">
              Set the event badge text displayed on each of the 5 tech tree track cards on the home page.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-text-tertiary mb-1">
                  [CP] Competitive Programming
                </label>
                <input
                  type="text"
                  value={homeContent.techTreeEvents.cp}
                  onChange={(e) =>
                    setHomeContent({
                      ...homeContent,
                      techTreeEvents: { ...homeContent.techTreeEvents, cp: e.target.value },
                    })
                  }
                  placeholder="8+ EVENTS"
                  className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-text-tertiary mb-1">
                  [WEB] Web Development
                </label>
                <input
                  type="text"
                  value={homeContent.techTreeEvents.webdev}
                  onChange={(e) =>
                    setHomeContent({
                      ...homeContent,
                      techTreeEvents: { ...homeContent.techTreeEvents, webdev: e.target.value },
                    })
                  }
                  placeholder="5+ EVENTS"
                  className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-text-tertiary mb-1">
                  [ML] Machine Learning &amp; AI
                </label>
                <input
                  type="text"
                  value={homeContent.techTreeEvents.ml}
                  onChange={(e) =>
                    setHomeContent({
                      ...homeContent,
                      techTreeEvents: { ...homeContent.techTreeEvents, ml: e.target.value },
                    })
                  }
                  placeholder="3+ EVENTS"
                  className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-text-tertiary mb-1">
                  [SEC] Cybersecurity
                </label>
                <input
                  type="text"
                  value={homeContent.techTreeEvents.cybersec}
                  onChange={(e) =>
                    setHomeContent({
                      ...homeContent,
                      techTreeEvents: { ...homeContent.techTreeEvents, cybersec: e.target.value },
                    })
                  }
                  placeholder="3+ EVENTS"
                  className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-text-tertiary mb-1">
                  [GAME] Game Dev &amp; Esports
                </label>
                <input
                  type="text"
                  value={homeContent.techTreeEvents.gaming}
                  onChange={(e) =>
                    setHomeContent({
                      ...homeContent,
                      techTreeEvents: { ...homeContent.techTreeEvents, gaming: e.target.value },
                    })
                  }
                  placeholder="3+ EVENTS"
                  className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary font-mono font-bold"
                />
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === "cp-hub" ? (
        <div className="bg-surface-elevated border border-border-brutalist dark:border-border-default rounded-2xl p-5 shadow-[4px_4px_0px_var(--accent-primary)] space-y-4">
          <div className="flex items-center gap-2 border-b border-border-default pb-3">
            <Code2 className="w-4 h-4 text-accent-primary" />
            <h2 className="text-base font-bold text-text-primary">CP Hub Header</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-text-tertiary mb-1">
                Kicker Tag
              </label>
              <input
                type="text"
                value={cpContent.header.kicker}
                onChange={(e) =>
                  setCpContent({
                    ...cpContent,
                    header: { ...cpContent.header, kicker: e.target.value },
                  })
                }
                placeholder="Competitive Programming"
                className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-text-tertiary mb-1">
                Page Title
              </label>
              <input
                type="text"
                value={cpContent.header.title}
                onChange={(e) =>
                  setCpContent({
                    ...cpContent,
                    header: { ...cpContent.header, title: e.target.value },
                  })
                }
                placeholder="CP Hub"
                className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-text-tertiary mb-1">
                Page Description
              </label>
              <textarea
                rows={3}
                value={cpContent.header.description}
                onChange={(e) =>
                  setCpContent({
                    ...cpContent,
                    header: { ...cpContent.header, description: e.target.value },
                  })
                }
                placeholder="Leaderboard, curated roadmaps..."
                className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary"
              />
            </div>

            {/* Quick Links for Achievements and Club Docs */}
            <div className="pt-4 border-t border-border-default grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-border-default bg-surface-secondary flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-sm text-text-primary flex items-center gap-1.5 mb-1">
                    <Award className="w-4 h-4 text-accent-primary" /> Contest Achievements
                  </h4>
                  <p className="text-xs text-text-tertiary mb-3">
                    Add, edit, or delete official team finishes, ICPC regional awards, and contest accolades with live interactive controls.
                  </p>
                </div>
                <Link
                  href="/cp-hub?tab=achievements"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-primary hover:underline"
                >
                  Manage Achievements <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="p-4 rounded-xl border border-border-default bg-surface-secondary flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-sm text-text-primary flex items-center gap-1.5 mb-1">
                    <BookOpen className="w-4 h-4 text-accent-primary" /> Club Docs, Tutorials &amp; PDFs
                  </h4>
                  <p className="text-xs text-text-tertiary mb-3">
                    Publish tutorials, algorithm guides, and upload PDF sheets with embedded reader and download capabilities.
                  </p>
                </div>
                <Link
                  href="/cp-hub?tab=resources"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-accent-primary hover:underline"
                >
                  Manage Club Docs &amp; PDFs <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === "contact" ? (
        <div className="bg-surface-elevated border border-border-brutalist dark:border-border-default rounded-2xl p-5 shadow-[4px_4px_0px_var(--accent-primary)] space-y-4">
          <div className="flex items-center gap-2 border-b border-border-default pb-3">
            <MessageSquare className="w-4 h-4 text-accent-primary" />
            <h2 className="text-base font-bold text-text-primary">
              Contact Page Direct Information
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-text-tertiary mb-1">
                Contact Email
              </label>
              <input
                type="email"
                value={contactContent.info.email}
                onChange={(e) =>
                  setContactContent({
                    ...contactContent,
                    info: { ...contactContent.info, email: e.target.value },
                  })
                }
                placeholder="meccomputerclub@gmail.com"
                className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-text-tertiary mb-1">
                President Phone
              </label>
              <input
                type="text"
                value={contactContent.info.presidentPhone}
                onChange={(e) =>
                  setContactContent({
                    ...contactContent,
                    info: {
                      ...contactContent.info,
                      presidentPhone: e.target.value,
                    },
                  })
                }
                placeholder="01773-758374"
                className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary font-mono text-text-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-text-tertiary mb-1">
                General Secretary Phone
              </label>
              <input
                type="text"
                value={contactContent.info.generalSecretaryPhone}
                onChange={(e) =>
                  setContactContent({
                    ...contactContent,
                    info: {
                      ...contactContent.info,
                      generalSecretaryPhone: e.target.value,
                    },
                  })
                }
                placeholder="01568985672"
                className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary font-mono text-text-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-text-tertiary mb-1">
                Campus Location
              </label>
              <input
                type="text"
                value={contactContent.info.location}
                onChange={(e) =>
                  setContactContent({
                    ...contactContent,
                    info: { ...contactContent.info, location: e.target.value },
                  })
                }
                placeholder="Department of CSE..."
                className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary"
              />
            </div>
          </div>
        </div>
      ) : activeTab === "about" ? (
        /* ── About Page Editor ── */
        <div className="space-y-6">
          {/* Hero Section */}
          <div className="bg-surface-elevated border border-border-brutalist dark:border-border-default rounded-2xl p-5 shadow-[4px_4px_0px_var(--accent-primary)] space-y-4">
            <div className="flex items-center gap-2 border-b border-border-default pb-3">
              <Sparkles className="w-4 h-4 text-accent-primary" />
              <h2 className="text-base font-bold text-text-primary">
                Hero Section
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-text-tertiary mb-1">
                  Kicker Label
                </label>
                <input
                  type="text"
                  value={aboutContent.hero.kicker}
                  onChange={(e) =>
                    setAboutContent({
                      ...aboutContent,
                      hero: { ...aboutContent.hero, kicker: e.target.value },
                    })
                  }
                  placeholder="About us"
                  className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-text-tertiary mb-1">
                  Page Title (H1)
                </label>
                <input
                  type="text"
                  value={aboutContent.hero.title}
                  onChange={(e) =>
                    setAboutContent({
                      ...aboutContent,
                      hero: { ...aboutContent.hero, title: e.target.value },
                    })
                  }
                  placeholder="Hello World! Meet the Club"
                  className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-text-tertiary mb-1">
                Main Description
              </label>
              <textarea
                rows={3}
                value={aboutContent.hero.description}
                onChange={(e) =>
                  setAboutContent({
                    ...aboutContent,
                    hero: { ...aboutContent.hero, description: e.target.value },
                  })
                }
                placeholder="Main paragraph about the club..."
                className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary resize-y"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-text-tertiary mb-1">
                Sub-Description
              </label>
              <textarea
                rows={3}
                value={aboutContent.hero.subDescription}
                onChange={(e) =>
                  setAboutContent({
                    ...aboutContent,
                    hero: { ...aboutContent.hero, subDescription: e.target.value },
                  })
                }
                placeholder="Additional context paragraph..."
                className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary resize-y"
              />
            </div>
          </div>

          {/* Departments Section */}
          <div className="bg-surface-elevated border border-border-brutalist dark:border-border-default rounded-2xl p-5 shadow-[4px_4px_0px_var(--accent-primary)] space-y-4">
            <div className="flex items-center gap-2 border-b border-border-default pb-3">
              <Users className="w-4 h-4 text-accent-primary" />
              <h2 className="text-base font-bold text-text-primary">
                Departments Section
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-text-tertiary mb-1">
                  Section Kicker
                </label>
                <input
                  type="text"
                  value={aboutContent.departments.sectionKicker}
                  onChange={(e) =>
                    setAboutContent({
                      ...aboutContent,
                      departments: { ...aboutContent.departments, sectionKicker: e.target.value },
                    })
                  }
                  placeholder="Departments"
                  className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-text-tertiary mb-1">
                  Section Title
                </label>
                <input
                  type="text"
                  value={aboutContent.departments.sectionTitle}
                  onChange={(e) =>
                    setAboutContent({
                      ...aboutContent,
                      departments: { ...aboutContent.departments, sectionTitle: e.target.value },
                    })
                  }
                  placeholder="Your Core Functions & Tasks"
                  className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-text-tertiary mb-1">
                  Section Subtitle
                </label>
                <input
                  type="text"
                  value={aboutContent.departments.sectionDescription}
                  onChange={(e) =>
                    setAboutContent({
                      ...aboutContent,
                      departments: { ...aboutContent.departments, sectionDescription: e.target.value },
                    })
                  }
                  placeholder="Each department runs its own..."
                  className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary"
                />
              </div>
            </div>

            {/* Member Counts Grid */}
            <div className="pt-3 border-t border-border-default">
              <label className="block text-xs font-mono uppercase tracking-wider text-text-tertiary mb-3">
                Active Members Per Department
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {[
                  { id: "cp", label: "CP" },
                  { id: "webdev", label: "Web Dev" },
                  { id: "ml", label: "ML / AI" },
                  { id: "cybersec", label: "Cybersecurity" },
                  { id: "gaming", label: "Gaming" },
                ].map((dept) => (
                  <div key={dept.id} className="flex flex-col gap-1">
                    <span className="text-[11px] font-bold text-text-secondary truncate">
                      {dept.label}
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={aboutContent.departments.memberCounts[dept.id] || 0}
                      onChange={(e) =>
                        setAboutContent({
                          ...aboutContent,
                          departments: {
                            ...aboutContent.departments,
                            memberCounts: {
                              ...aboutContent.departments.memberCounts,
                              [dept.id]: Number(e.target.value) || 0,
                            },
                          },
                        })
                      }
                      className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary font-mono text-text-primary text-center"
                    />
                  </div>
                ))}
              </div>
              <span className="text-[11px] text-text-tertiary mt-1.5 block">
                These numbers are shown as &quot;X+ Active Members&quot; on each department card on the About page.
              </span>
            </div>
          </div>

          {/* Milestones Section */}
          <div className="bg-surface-elevated border border-border-brutalist dark:border-border-default rounded-2xl p-5 shadow-[4px_4px_0px_var(--accent-primary)] space-y-4">
            <div className="flex items-center justify-between border-b border-border-default pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-accent-primary" />
                <h2 className="text-base font-bold text-text-primary">
                  History Timeline / Milestones
                </h2>
              </div>
              <button
                type="button"
                onClick={() =>
                  setAboutContent({
                    ...aboutContent,
                    milestones: [
                      ...aboutContent.milestones,
                      { year: "", title: "", description: "" },
                    ],
                  })
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-accent-primary bg-accent-primary/10 border border-accent-primary/30 rounded-lg hover:bg-accent-primary/20 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Milestone
              </button>
            </div>

            {aboutContent.milestones.length === 0 && (
              <p className="text-sm text-text-tertiary text-center py-4">
                No milestones yet. Click &quot;Add Milestone&quot; to create one.
              </p>
            )}

            <div className="space-y-3">
              {aboutContent.milestones.map((milestone, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-surface-secondary/70 rounded-xl border border-border-default space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-text-tertiary uppercase tracking-wider">
                      Milestone #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setAboutContent({
                          ...aboutContent,
                          milestones: aboutContent.milestones.filter((_, i) => i !== idx),
                        })
                      }
                      className="p-1.5 text-text-tertiary hover:text-accent-error rounded-lg hover:bg-surface-secondary transition-colors"
                      title="Remove milestone"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-[100px_1fr] gap-3">
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-text-tertiary mb-1">
                        Year
                      </label>
                      <input
                        type="text"
                        value={milestone.year}
                        onChange={(e) => {
                          const updated = [...aboutContent.milestones];
                          updated[idx] = { ...updated[idx], year: e.target.value };
                          setAboutContent({ ...aboutContent, milestones: updated });
                        }}
                        placeholder="2025"
                        className="w-full px-3 py-2 text-sm bg-surface-primary border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary font-mono text-text-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-text-tertiary mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={milestone.title}
                        onChange={(e) => {
                          const updated = [...aboutContent.milestones];
                          updated[idx] = { ...updated[idx], title: e.target.value };
                          setAboutContent({ ...aboutContent, milestones: updated });
                        }}
                        placeholder="Milestone title"
                        className="w-full px-3 py-2 text-sm bg-surface-primary border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-text-tertiary mb-1">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={milestone.description}
                      onChange={(e) => {
                        const updated = [...aboutContent.milestones];
                        updated[idx] = { ...updated[idx], description: e.target.value };
                        setAboutContent({ ...aboutContent, milestones: updated });
                      }}
                      placeholder="What happened this year..."
                      className="w-full px-3 py-2 text-sm bg-surface-primary border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary resize-y"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : activeTab === "sponsor" ? (
        <div className="space-y-6">
          {/* Hero Section */}
          <div className="bg-surface-elevated border border-border-brutalist dark:border-border-default rounded-2xl p-5 shadow-[4px_4px_0px_var(--accent-primary)] space-y-4">
            <div className="flex items-center gap-2 border-b border-border-default pb-3">
              <Briefcase className="w-4 h-4 text-accent-primary" />
              <h2 className="text-base font-bold text-text-primary">
                Hero Section
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-text-tertiary mb-1">
                  Kicker / Tag
                </label>
                <input
                  type="text"
                  value={sponsorContent.hero.kicker}
                  onChange={(e) =>
                    setSponsorContent({
                      ...sponsorContent,
                      hero: { ...sponsorContent.hero, kicker: e.target.value },
                    })
                  }
                  placeholder="Corporate Sponsorship"
                  className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-text-tertiary mb-1">
                  Headline / Title
                </label>
                <input
                  type="text"
                  value={sponsorContent.hero.title}
                  onChange={(e) =>
                    setSponsorContent({
                      ...sponsorContent,
                      hero: { ...sponsorContent.hero, title: e.target.value },
                    })
                  }
                  placeholder="Acquire Top Tech Talent"
                  className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-text-tertiary mb-1">
                Main Description
              </label>
              <textarea
                rows={3}
                value={sponsorContent.hero.description}
                onChange={(e) =>
                  setSponsorContent({
                    ...sponsorContent,
                    hero: { ...sponsorContent.hero, description: e.target.value },
                  })
                }
                placeholder="Overview describing club reach and value to corporate sponsors..."
                className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary resize-y"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-text-tertiary mb-1">
                  Deck CTA Button Text
                </label>
                <input
                  type="text"
                  value={sponsorContent.hero.deckButtonText}
                  onChange={(e) =>
                    setSponsorContent({
                      ...sponsorContent,
                      hero: { ...sponsorContent.hero, deckButtonText: e.target.value },
                    })
                  }
                  placeholder="Get the Pitch Deck"
                  className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-text-tertiary mb-1">
                  Tiers CTA Button Text
                </label>
                <input
                  type="text"
                  value={sponsorContent.hero.tiersButtonText}
                  onChange={(e) =>
                    setSponsorContent({
                      ...sponsorContent,
                      hero: { ...sponsorContent.hero, tiersButtonText: e.target.value },
                    })
                  }
                  placeholder="View Sponsorship Tiers"
                  className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary"
                />
              </div>
            </div>
          </div>

          {/* Trust Strip Statistics */}
          <div className="bg-surface-elevated border border-border-brutalist dark:border-border-default rounded-2xl p-5 shadow-[4px_4px_0px_var(--accent-primary)] space-y-4">
            <div className="flex items-center gap-2 border-b border-border-default pb-3">
              <BarChart3 className="w-4 h-4 text-accent-primary" />
              <h2 className="text-base font-bold text-text-primary">
                Trust Strip Statistics
              </h2>
            </div>
            <p className="text-xs text-text-tertiary">
              Metrics displayed in the trust strip immediately beneath the hero section.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Stat 1 */}
              <div className="p-3 bg-surface-secondary rounded-xl border border-border-default space-y-2">
                <span className="text-[10px] font-mono uppercase text-accent-primary font-bold block">
                  Metric #1
                </span>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-text-tertiary mb-1">
                    Value
                  </label>
                  <input
                    type="text"
                    value={sponsorContent.stats.stat1Value}
                    onChange={(e) =>
                      setSponsorContent({
                        ...sponsorContent,
                        stats: { ...sponsorContent.stats, stat1Value: e.target.value },
                      })
                    }
                    placeholder="150+"
                    className="w-full px-2.5 py-1.5 text-sm bg-surface-primary border border-border-default rounded-lg font-mono font-bold text-text-primary"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-text-tertiary mb-1">
                    Label
                  </label>
                  <input
                    type="text"
                    value={sponsorContent.stats.stat1Label}
                    onChange={(e) =>
                      setSponsorContent({
                        ...sponsorContent,
                        stats: { ...sponsorContent.stats, stat1Label: e.target.value },
                      })
                    }
                    placeholder="Active Members"
                    className="w-full px-2.5 py-1.5 text-xs bg-surface-primary border border-border-default rounded-lg text-text-secondary"
                  />
                </div>
              </div>

              {/* Stat 2 */}
              <div className="p-3 bg-surface-secondary rounded-xl border border-border-default space-y-2">
                <span className="text-[10px] font-mono uppercase text-accent-primary font-bold block">
                  Metric #2
                </span>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-text-tertiary mb-1">
                    Value
                  </label>
                  <input
                    type="text"
                    value={sponsorContent.stats.stat2Value}
                    onChange={(e) =>
                      setSponsorContent({
                        ...sponsorContent,
                        stats: { ...sponsorContent.stats, stat2Value: e.target.value },
                      })
                    }
                    placeholder="20+"
                    className="w-full px-2.5 py-1.5 text-sm bg-surface-primary border border-border-default rounded-lg font-mono font-bold text-text-primary"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-text-tertiary mb-1">
                    Label
                  </label>
                  <input
                    type="text"
                    value={sponsorContent.stats.stat2Label}
                    onChange={(e) =>
                      setSponsorContent({
                        ...sponsorContent,
                        stats: { ...sponsorContent.stats, stat2Label: e.target.value },
                      })
                    }
                    placeholder="Yearly Events"
                    className="w-full px-2.5 py-1.5 text-xs bg-surface-primary border border-border-default rounded-lg text-text-secondary"
                  />
                </div>
              </div>

              {/* Stat 3 */}
              <div className="p-3 bg-surface-secondary rounded-xl border border-border-default space-y-2">
                <span className="text-[10px] font-mono uppercase text-accent-primary font-bold block">
                  Metric #3
                </span>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-text-tertiary mb-1">
                    Value
                  </label>
                  <input
                    type="text"
                    value={sponsorContent.stats.stat3Value}
                    onChange={(e) =>
                      setSponsorContent({
                        ...sponsorContent,
                        stats: { ...sponsorContent.stats, stat3Value: e.target.value },
                      })
                    }
                    placeholder="500+"
                    className="w-full px-2.5 py-1.5 text-sm bg-surface-primary border border-border-default rounded-lg font-mono font-bold text-text-primary"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-text-tertiary mb-1">
                    Label
                  </label>
                  <input
                    type="text"
                    value={sponsorContent.stats.stat3Label}
                    onChange={(e) =>
                      setSponsorContent({
                        ...sponsorContent,
                        stats: { ...sponsorContent.stats, stat3Label: e.target.value },
                      })
                    }
                    placeholder="Participants"
                    className="w-full px-2.5 py-1.5 text-xs bg-surface-primary border border-border-default rounded-lg text-text-secondary"
                  />
                </div>
              </div>

              {/* Stat 4 */}
              <div className="p-3 bg-surface-secondary rounded-xl border border-border-default space-y-2">
                <span className="text-[10px] font-mono uppercase text-accent-primary font-bold block">
                  Metric #4
                </span>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-text-tertiary mb-1">
                    Value
                  </label>
                  <input
                    type="text"
                    value={sponsorContent.stats.stat4Value}
                    onChange={(e) =>
                      setSponsorContent({
                        ...sponsorContent,
                        stats: { ...sponsorContent.stats, stat4Value: e.target.value },
                      })
                    }
                    placeholder="15+"
                    className="w-full px-2.5 py-1.5 text-sm bg-surface-primary border border-border-default rounded-lg font-mono font-bold text-text-primary"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-text-tertiary mb-1">
                    Label
                  </label>
                  <input
                    type="text"
                    value={sponsorContent.stats.stat4Label}
                    onChange={(e) =>
                      setSponsorContent({
                        ...sponsorContent,
                        stats: { ...sponsorContent.stats, stat4Label: e.target.value },
                      })
                    }
                    placeholder="Sponsors"
                    className="w-full px-2.5 py-1.5 text-xs bg-surface-primary border border-border-default rounded-lg text-text-secondary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Closing Call To Action Section */}
          <div className="bg-surface-elevated border border-border-brutalist dark:border-border-default rounded-2xl p-5 shadow-[4px_4px_0px_var(--accent-primary)] space-y-4">
            <div className="flex items-center gap-2 border-b border-border-default pb-3">
              <MessageSquare className="w-4 h-4 text-accent-primary" />
              <h2 className="text-base font-bold text-text-primary">
                Closing Call To Action & Links
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-text-tertiary mb-1">
                  Cycle / Deadline Notice
                </label>
                <input
                  type="text"
                  value={sponsorContent.cta.cycleNotice}
                  onChange={(e) =>
                    setSponsorContent({
                      ...sponsorContent,
                      cta: { ...sponsorContent.cta, cycleNotice: e.target.value },
                    })
                  }
                  placeholder="Sponsorship cycle closes Nov 30"
                  className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-text-tertiary mb-1">
                  Headline
                </label>
                <input
                  type="text"
                  value={sponsorContent.cta.title}
                  onChange={(e) =>
                    setSponsorContent({
                      ...sponsorContent,
                      cta: { ...sponsorContent.cta, title: e.target.value },
                    })
                  }
                  placeholder="Ready to collaborate?"
                  className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-text-tertiary mb-1">
                  Email Button Label
                </label>
                <input
                  type="text"
                  value={sponsorContent.cta.emailButtonText}
                  onChange={(e) =>
                    setSponsorContent({
                      ...sponsorContent,
                      cta: { ...sponsorContent.cta, emailButtonText: e.target.value },
                    })
                  }
                  placeholder="Email Us"
                  className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-text-tertiary mb-1">
                  Call Button Label
                </label>
                <input
                  type="text"
                  value={sponsorContent.cta.callButtonText}
                  onChange={(e) =>
                    setSponsorContent({
                      ...sponsorContent,
                      cta: { ...sponsorContent.cta, callButtonText: e.target.value },
                    })
                  }
                  placeholder="Call Us"
                  className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary"
                />
              </div>
            </div>

            <div className="p-3.5 bg-accent-primary/10 border border-accent-primary/20 rounded-xl flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-accent-primary flex-shrink-0 mt-0.5" />
              <div className="text-xs text-text-secondary">
                <span className="font-bold text-text-primary block mb-0.5">
                  Synchronized with Global Site Settings
                </span>
                The Email and Call action links automatically route directly to the official contact Gmail and phone number defined under{" "}
                <Link href="/dashboard/settings" className="font-bold text-accent-primary underline hover:opacity-80">
                  Global Settings
                </Link>.
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 p-2 bg-surface-elevated/95 backdrop-blur-md border-2 border-border-brutalist dark:border-border-default rounded-2xl shadow-[4px_4px_0px_var(--accent-primary)] transition-all">
        <a
          href={getLivePageUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl border border-border-default bg-surface-secondary text-text-secondary hover:text-accent-primary hover:border-accent-primary transition-all shadow-[2px_2px_0px_rgba(0,0,0,0.06)]"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Live Preview
        </a>

        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl bg-accent-primary text-white hover:bg-accent-primary-hover shadow-[2px_2px_0px_var(--border-brutalist)] active:translate-x-0.5 active:translate-y-0.5 transition-all disabled:opacity-50 cursor-pointer"
        >
          {saving ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}
