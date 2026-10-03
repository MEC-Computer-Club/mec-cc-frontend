"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useAccent } from "@/components/AccentProvider";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import {
  Compass,
  Home,
  Info,
  Calendar,
  FolderGit2,
  BookOpen,
  Archive,
  Code2,
  FileText,
  Calculator,
  Users,
  UserPlus,
  Image as ImageIcon,
  Terminal,
  Mail,
  MapPin,
  Heart,
  ChevronRight,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const footerNavigation: {
  explore: NavItem[];
  resources: NavItem[];
  community: NavItem[];
} = {
  explore: [
    { label: "Home", href: "/", icon: Home },
    { label: "About Us", href: "/about", icon: Info },
    { label: "Events", href: "/events", icon: Calendar },
    { label: "Projects", href: "/projects", icon: FolderGit2 },
  ],
  resources: [
    { label: "Questions Archive", href: "/utilities/questions-archive", icon: Archive },
    { label: "CP Hub", href: "/cp-hub", icon: Code2 },
    { label: "Club Blog", href: "/blog", icon: FileText },
    { label: "CGPA Calculator", href: "/utilities/cgpa", icon: Calculator },
  ],
  community: [
    { label: "Join the Club", href: "/join", icon: UserPlus },
    { label: "Executive Panel", href: "/executives", icon: Users },
    { label: "Photo Gallery", href: "/gallery", icon: ImageIcon },
    { label: "Core Developers", href: "/developers", icon: Terminal },
  ],
};

const IconGitHub = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width={16} height={16}>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

const IconFacebook = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width={16} height={16}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const IconLinkedIn = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width={16} height={16}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const IconYouTube = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width={16} height={16}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export function Footer() {
  const pathname = usePathname();
  const { currentVibe } = useAccent();
  const { resolvedTheme } = useTheme();
  const { settings } = useSiteSettings();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  const githubUrl = settings.github_url || "https://github.com";
  const facebookUrl = settings.facebook_url || "https://www.facebook.com/mec.programmingclub";
  const linkedinUrl = settings.linkedin_url || "https://www.linkedin.com/in/mec-computer-club/";
  const youtubeUrl = settings.youtube_url || "https://www.youtube.com/@MECComputerClub";
  const contactEmail = settings.contact_email || "meccomputerclub@gmail.com";
  const clubName = settings.club_name || "MEC Computer Club";
  const clubTagline = settings.club_tagline || "Learn. Build. Collaborate.";

  const socialLinkClass =
    "inline-flex items-center justify-center w-8 h-8 rounded-md bg-transparent text-black border border-black hover:bg-neutral-100 hover:shadow-[3px_3px_0px_0px_black] dark:bg-transparent dark:text-white dark:border-white dark:hover:bg-neutral-900 dark:hover:shadow-[3px_3px_0px_0px_white] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all duration-150 no-underline cursor-pointer";

  const footerLinkClass =
    "text-sm text-text-tertiary no-underline transition-all duration-200 hover:text-text-primary hover:translate-x-1 flex items-center justify-between py-1 group/link";

  const headingClass =
    "flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-text-primary mb-2";

  const linkColumns: { title: string; icon: NavItem["icon"]; items: NavItem[] }[] = [
    { title: "Explore", icon: Compass, items: footerNavigation.explore },
    { title: "Resources", icon: BookOpen, items: footerNavigation.resources },
    { title: "Community", icon: Users, items: footerNavigation.community },
  ];

  return (
    <footer className="bg-surface-secondary border-t border-border-default mt-10 md:mt-16" role="contentinfo">
      {/* ───────────────────────────────────────────────────────────
          Single horizontal row (desktop):
          [ Brand: club | college → tagline → contact ] [ Explore ] [ Resources ] [ Community ]
          ─────────────────────────────────────────────────────────── */}
      <div className="container py-10 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.9fr_1fr_1fr_1fr] gap-x-10 gap-y-8 lg:gap-x-12 items-stretch">
          {/* Part 1: Logo + Contact */}
          <div className="flex flex-col sm:col-span-2 lg:col-span-1">
            {/* Club logo | separator | College (64px row, same height as column headings) */}
            <div className="flex items-center gap-4 h-16 -ml-2">
              <Link
                href="/"
                aria-label={clubName}
                className="flex-shrink-0 transition-transform duration-200 hover:scale-[1.03]"
              >
                <Image
                  src={`/logo-${currentVibe}-light.png`}
                  alt={`${clubName} Logo`}
                  width={170}
                  height={44}
                  className="object-contain block dark:hidden"
                />
                <Image
                  src={`/logo-${currentVibe}-dark.png`}
                  alt={`${clubName} Logo`}
                  width={170}
                  height={44}
                  className="object-contain hidden dark:block"
                />
              </Link>

              <div className="w-[1.5px] h-14 bg-border-default flex-shrink-0 rounded-full" aria-hidden="true" />

              <a
                href="https://mec.ac.bd"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Mymensingh Engineering College (mec.ac.bd)"
                title="Mymensingh Engineering College"
                className="flex-shrink-0 transition-transform duration-200 hover:scale-[1.04]"
              >
                <Image
                  src="/mec-college-logo.png"
                  alt="Mymensingh Engineering College Seal"
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </a>
            </div>

            {/* Body: tagline + contact (starts level with the link lists) */}
            <div className="flex flex-col gap-4 flex-1 mt-4">
              {/* Tagline (aligned below the logo row) */}
              <div className="flex flex-col gap-1.5">
                <span className="font-heading text-lg font-bold text-text-primary leading-tight tracking-tight">
                  {clubTagline}
                </span>
                <span className="text-sm text-text-secondary leading-relaxed max-w-md">
                  A student-led club of the CSE Department, Mymensingh Engineering College.
                </span>
              </div>

              {/* Contact */}
              <div className="flex flex-col gap-2.5">
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-sm font-medium text-text-secondary no-underline hover:text-text-primary flex items-center gap-2.5 transition-all duration-150 hover:translate-x-1 group/contact w-fit leading-snug"
                >
                  <Mail
                    size={14}
                    className="text-accent-primary-hover flex-shrink-0 group-hover/contact:scale-110 transition-transform duration-150"
                  />
                  <span className="truncate">{contactEmail}</span>
                </a>

                <a
                  href="https://www.google.com/maps/search/?api=1&query=Department+of+Computer+Science+and+Engineering+Mymensingh+Engineering+College"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-text-secondary no-underline hover:text-text-primary flex items-start gap-2.5 transition-all duration-150 hover:translate-x-1 leading-snug group/map w-fit"
                >
                  <MapPin
                    size={14}
                    className="text-accent-primary-hover flex-shrink-0 mt-0.5 group-hover/map:scale-110 transition-transform duration-150"
                  />
                  <span>Mymensingh Engineering College, Mymensingh, Bangladesh</span>
                </a>

                <div className="flex gap-2 pt-1">
                  <a href={githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={socialLinkClass}>
                    <IconGitHub />
                  </a>
                  <a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={socialLinkClass}>
                    <IconFacebook />
                  </a>
                  <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={socialLinkClass}>
                    <IconLinkedIn />
                  </a>
                  <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className={socialLinkClass}>
                    <IconYouTube />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Parts 2-4: Explore / Resources / Community */}
          {linkColumns.map(({ title, icon: HeadingIcon, items }) => (
            <div key={title} className="flex flex-col">
              <div className="h-16 flex flex-col justify-center">
                <h4 className={headingClass}>
                  <HeadingIcon size={14} className="text-accent-primary-hover" /> {title}
                </h4>
                <div className="w-8 h-[2px] bg-accent-primary-hover rounded-full" />
              </div>
              <ul className="list-none p-0 m-0 mt-4 flex flex-col gap-2 flex-1 lg:justify-between">
                {items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link href={item.href} className={footerLinkClass}>
                        <div className="flex items-center gap-2.5">
                          <Icon
                            size={14}
                            className="text-text-tertiary group-hover/link:text-accent-primary-hover transition-colors flex-shrink-0"
                          />
                          <span className="transition-colors duration-150 group-hover/link:text-text-primary">
                            {item.label}
                          </span>
                        </div>
                        <ChevronRight
                          size={13}
                          className="opacity-0 -translate-x-1.5 group-hover/link:opacity-85 group-hover/link:translate-x-0 transition-all duration-200 text-accent-primary-hover flex-shrink-0"
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border-default bg-surface-elevated/60 py-4">
        <div className="container flex items-center justify-center text-xs text-text-tertiary text-center">
          <p>© {new Date().getFullYear()} {clubName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
