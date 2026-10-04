"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { api, API_BASE_URL } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRoleGuard } from "@/hooks/useRoleGuard";
import FilterSelect, { FilterOption } from "@/app/dashboard/components/FilterSelect";
import EmailTemplatesManager from "@/components/dashboard/EmailTemplatesManager";
import EmailRoutingSettings from "@/components/dashboard/EmailRoutingSettings";
import ClubRoomAdminCard from "@/components/dashboard/ClubRoomAdminCard";
import toast from "react-hot-toast";
import {
  ShieldCheck,
  Mail,
  MailCheck,
  Building2,
  Megaphone,
  Save,
  RefreshCw,
  Send,
  Eye,
  Code,
  Copy,
  Check,
  Bell,
  Trash2,
  AlertCircle,
  Sparkles,
  ExternalLink,
  Loader2,
  X,
  Phone,
  Globe,
  Share2,
  GraduationCap,
  Info,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";

type AdminTab = "email-templates" | "email-routing" | "site-settings" | "broadcasts";

interface EmailTemplateItem {
  key: string;
  title: string;
  category: "authentication" | "membership" | "invitations" | "administrative";
  description: string;
  defaultSubject: string;
  subject: string;
  html: string;
  isCustomized: boolean;
  variables: { name: string; description: string; sample: string }[];
}

interface SiteSetting {
  key: string;
  value: string;
  label: string;
  description?: string;
}

interface BroadcastItem {
  _id: string;
  title: string;
  message: string;
  recipientRole?: string;
  priority: "normal" | "high" | "urgent";
  link?: string;
  actionLabel?: string;
  createdAt: string;
}

export default function AdministrationPage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") as AdminTab | null;
  const [activeTab, setActiveTab] = useState<AdminTab>(() => {
    if (initialTab && ["email-templates", "email-routing", "site-settings", "broadcasts"].includes(initialTab)) {
      return initialTab;
    }
    return "email-templates";
  });
  const { isAllowed, isLoading } = useRoleGuard(["admin", "moderator", "executive"]);
  const { user } = useAuth();
  const isAdmin = String(user?.role || "").toLowerCase() === "admin";

  useEffect(() => {
    const tab = searchParams.get("tab") as AdminTab | null;
    if (tab && ["email-templates", "email-routing", "site-settings", "broadcasts"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tab);
      window.history.replaceState({}, "", url.toString());
    }
  };

  if (isLoading || !isAllowed) return null;

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="border-b border-border-default pb-5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-300 font-mono text-[11px] font-bold tracking-wider uppercase mb-1.5 border border-emerald-300 dark:border-emerald-700/60">
          <ShieldCheck size={13} />
          System Command Center
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
          Administration
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-0.5 max-w-2xl">
          Configure transactional email templates, manage email routing, update global club parameters, and dispatch announcements across the platform.
        </p>
      </div>

      {/* ── Club Room Operations Control ── */}
      <ClubRoomAdminCard />

      {/* ── Neo-Brutalist Tabs ── */}
      <div className="flex items-center gap-2 border-b border-border-default overflow-x-auto no-scrollbar pb-px">
        <button
          type="button"
          onClick={() => handleTabChange("email-templates")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-all cursor-pointer whitespace-nowrap border-t-2 border-x-2 ${
            activeTab === "email-templates"
              ? "bg-surface-elevated text-text-primary border-border-brutalist dark:border-border-default shadow-[3px_-2px_0px_0px_var(--border-brutalist)] -mb-px"
              : "border-transparent text-text-secondary hover:text-text-primary hover:bg-surface-secondary/60"
          }`}
        >
          <Mail size={16} className={activeTab === "email-templates" ? "text-accent-primary" : ""} />
          Email Templates
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("email-routing")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-all cursor-pointer whitespace-nowrap border-t-2 border-x-2 ${
            activeTab === "email-routing"
              ? "bg-surface-elevated text-text-primary border-border-brutalist dark:border-border-default shadow-[3px_-2px_0px_0px_var(--border-brutalist)] -mb-px"
              : "border-transparent text-text-secondary hover:text-text-primary hover:bg-surface-secondary/60"
          }`}
        >
          <MailCheck size={16} className={activeTab === "email-routing" ? "text-accent-primary" : ""} />
          Email Routing
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("site-settings")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-all cursor-pointer whitespace-nowrap border-t-2 border-x-2 ${
            activeTab === "site-settings"
              ? "bg-surface-elevated text-text-primary border-border-brutalist dark:border-border-default shadow-[3px_-2px_0px_0px_var(--border-brutalist)] -mb-px"
              : "border-transparent text-text-secondary hover:text-text-primary hover:bg-surface-secondary/60"
          }`}
        >
          <Building2 size={16} className={activeTab === "site-settings" ? "text-accent-primary" : ""} />
          Site &amp; Club Information
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("broadcasts")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-all cursor-pointer whitespace-nowrap border-t-2 border-x-2 ${
            activeTab === "broadcasts"
              ? "bg-surface-elevated text-text-primary border-border-brutalist dark:border-border-default shadow-[3px_-2px_0px_0px_var(--border-brutalist)] -mb-px"
              : "border-transparent text-text-secondary hover:text-text-primary hover:bg-surface-secondary/60"
          }`}
        >
          <Megaphone size={16} className={activeTab === "broadcasts" ? "text-accent-primary" : ""} />
          Broadcasts &amp; Announcements
        </button>
      </div>

      {/* ── Content View ── */}
      <div>
        {activeTab === "email-templates" && <EmailTemplatesTab currentUser={user} isAdmin={isAdmin} />}
        {activeTab === "email-routing" && <EmailRoutingSettings readOnly={!isAdmin} />}
        {activeTab === "site-settings" && <SiteSettingsTab isAdmin={isAdmin} />}
        {activeTab === "broadcasts" && <BroadcastsTab currentUser={user} isAdmin={isAdmin} />}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   TAB 1: EMAIL TEMPLATES VISUAL CUSTOMIZER & PREVIEWER
───────────────────────────────────────────────────────────── */
function EmailTemplatesTab({ currentUser, isAdmin }: { currentUser: any; isAdmin: boolean }) {
  return <EmailTemplatesManager currentUser={currentUser} isAdmin={isAdmin} />;
}

/* ─────────────────────────────────────────────────────────────
   TAB 3: SITE & CLUB INFORMATION SETTINGS
───────────────────────────────────────────────────────────── */
const DEFAULT_SITE_SETTINGS: SiteSetting[] = [
  { key: "club_name", value: "MEC Computer Club", label: "Club Name", description: "Official name displayed site-wide." },
  { key: "club_tagline", value: "Learn. Build. Share.", label: "Club Tagline", description: "Short tagline shown in the hero section." },
  { key: "founded_year", value: "2015", label: "Founded Year", description: "Year the club was founded." },
  { key: "membership_fee", value: "500", label: "Membership Fee (BDT)", description: "Annual membership fee in BDT." },
  { key: "address", value: "Department of CSE, Mymensingh Engineering College, Khagdahar, Mymensingh-2200", label: "Club Address", description: "Physical address of the club headquarters." },
  { key: "contact_email", value: "meccomputerclub@gmail.com", label: "Contact Email", description: "Primary contact email shown on the website." },
  { key: "contact_phone", value: "+8801780667954", label: "Contact Phone", description: "Primary phone number shown on the website." },
  { key: "whatsapp_number", value: "8801780667954", label: "WhatsApp Number", description: "WhatsApp hotline (digits only, no + or spaces)." },
  { key: "facebook_url", value: "https://www.facebook.com/mec.programmingclub", label: "Facebook URL", description: "Club Facebook page URL." },
  { key: "linkedin_url", value: "https://www.linkedin.com/in/mec-computer-club/", label: "LinkedIn URL", description: "Club LinkedIn page URL." },
  { key: "youtube_url", value: "https://www.youtube.com/@MECComputerClub", label: "YouTube URL", description: "Club YouTube channel URL." },
  { key: "github_url", value: "https://github.com", label: "GitHub URL", description: "Club GitHub organization URL." },
  { key: "batch_current_CSE", value: "9", label: "CSE — Current Junior Batch No.", description: "The most junior (latest running) CSE batch number. Registration form shows the last 10 batches up to this number." },
  { key: "batch_current_EEE", value: "18", label: "EEE — Current Junior Batch No.", description: "The most junior (latest running) EEE batch number. Registration form shows the last 10 batches up to this number." },
  { key: "batch_current_CE", value: "12", label: "CE — Current Junior Batch No.", description: "The most junior (latest running) CE batch number. Registration form shows the last 10 batches up to this number." },
];

function mergeWithDefaults(serverSettings: SiteSetting[]): SiteSetting[] {
  const existingMap = new Map<string, SiteSetting>();
  if (Array.isArray(serverSettings)) {
    serverSettings.forEach((s) => {
      if (s && s.key) {
        existingMap.set(s.key, s);
      }
    });
  }

  const merged: SiteSetting[] = [];
  DEFAULT_SITE_SETTINGS.forEach((def) => {
    if (existingMap.has(def.key)) {
      const serverVal = existingMap.get(def.key)!;
      merged.push({
        ...def,
        ...serverVal,
        value: String(serverVal.value ?? def.value),
        label: serverVal.label || def.label,
        description: serverVal.description || def.description,
      });
      existingMap.delete(def.key);
    } else {
      merged.push({ ...def });
    }
  });

  // Preserve any custom dynamic settings in DB
  existingMap.forEach((val) => {
    if (val.key !== "office_hours") {
      merged.push({
        ...val,
        value: String(val.value ?? ""),
      });
    }
  });

  return merged;
}

function SiteSettingsTab({ isAdmin }: { isAdmin: boolean }) {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [originalSettings, setOriginalSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/site-settings");
      const list = res?.data || (Array.isArray(res) ? res : []);
      const merged = mergeWithDefaults(list);
      setSettings(merged);
      setOriginalSettings(merged);
    } catch (err: any) {
      console.warn("Authenticated site-settings fetch failed, trying public fallback:", err);
      try {
        const publicRes = await api.get("/api/site-settings/public");
        const settingsMap = publicRes?.settings || {};
        const fallbackList: SiteSetting[] = Object.entries(settingsMap).map(([k, v]) => ({
          key: k,
          value: String(v ?? ""),
          label: k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        }));
        const merged = mergeWithDefaults(fallbackList);
        setSettings(merged);
        setOriginalSettings(merged);
      } catch (publicErr: any) {
        console.error("All site-settings fetches failed:", publicErr);
        setError("Failed to load site settings. Please check your admin permissions.");
        const fallback = mergeWithDefaults([]);
        setSettings(fallback);
        setOriginalSettings(fallback);
        toast.error("Failed to load site settings");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => prev.map((s) => (s.key === key ? { ...s, value } : s)));
  };

  const isDirty = useMemo(() => {
    if (originalSettings.length === 0 || settings.length === 0) return false;
    return JSON.stringify(settings) !== JSON.stringify(originalSettings);
  }, [settings, originalSettings]);

  const handleDiscard = () => {
    setSettings(originalSettings);
    toast("Changes discarded", { icon: "↩️" });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const filtered = settings
        .filter((s) => s.key !== "office_hours")
        .map((s) => ({
          key: s.key,
          value: String(s.value ?? "").trim(),
          label: s.label,
          description: s.description,
        }));

      await api.put("/api/site-settings", { settings: filtered });
      setOriginalSettings(settings);
      toast.success("Site settings updated successfully!");
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("site_settings_updated"));
      }
    } catch (err: any) {
      console.error("Save error:", err);
      toast.error(err?.message || "Failed to save site settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center bg-surface-elevated rounded-2xl border-2 border-border-brutalist dark:border-border-default shadow-[4px_4px_0px_0px_var(--border-brutalist)]">
        <Loader2 className="w-8 h-8 animate-spin text-accent-primary mx-auto mb-2" />
        <p className="text-xs text-text-secondary font-semibold">Loading club settings…</p>
      </div>
    );
  }

  if (error && settings.length === 0) {
    return (
      <div className="py-16 text-center bg-surface-elevated rounded-2xl border-2 border-border-brutalist dark:border-border-default p-8 shadow-[4px_4px_0px_0px_var(--border-brutalist)]">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <p className="text-sm font-bold text-text-primary mb-1">Failed to load site settings</p>
        <p className="text-xs text-text-secondary mb-4">{error}</p>
        <button
          type="button"
          onClick={fetchSettings}
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent-primary text-text-primary font-bold text-xs rounded-xl border border-border-brutalist shadow-[2px_2px_0px_0px_var(--border-brutalist)] hover:opacity-90 cursor-pointer"
        >
          <RefreshCw size={14} /> Retry Loading
        </button>
      </div>
    );
  }

  // Section categorization
  const deptOrder = ["batch_current_CSE", "batch_current_EEE", "batch_current_CE"];
  const batchSettings = settings
    .filter((s) => s.key.startsWith("batch_current_"))
    .sort((a, b) => {
      const idxA = deptOrder.indexOf(a.key);
      const idxB = deptOrder.indexOf(b.key);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.key.localeCompare(b.key);
    });

  const contactKeys = [
    "contact_email",
    "contact_phone",
    "whatsapp_number",
    "facebook_url",
    "linkedin_url",
    "youtube_url",
    "github_url",
  ];
  const contactSettings = settings
    .filter((s) => contactKeys.includes(s.key))
    .sort((a, b) => contactKeys.indexOf(a.key) - contactKeys.indexOf(b.key));

  const generalOrder = ["club_name", "club_tagline", "founded_year", "membership_fee", "address"];
  const generalSettings = settings
    .filter((s) => !s.key.startsWith("batch_current_") && !contactKeys.includes(s.key) && s.key !== "office_hours")
    .sort((a, b) => {
      const idxA = generalOrder.indexOf(a.key);
      const idxB = generalOrder.indexOf(b.key);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.key.localeCompare(b.key);
    });

  return (
    <form onSubmit={handleSave} className="space-y-6 pb-28">
      {!isAdmin && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs sm:text-sm font-semibold flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>You are viewing site settings in read-only mode. Modifying site parameters requires Administrator clearance.</span>
        </div>
      )}

      {/* ── Subheader Action Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-default pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight flex items-center gap-2.5">
            <Building2 className="text-accent-primary" size={24} />
            Site &amp; Club Information
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Global parameters powering the public portal, registration logic, and official communications.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {isDirty && (
            <button
              type="button"
              onClick={handleDiscard}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border-default bg-surface-secondary text-text-secondary hover:text-text-primary text-xs font-bold transition-all cursor-pointer"
            >
              <RotateCcw size={13} />
              Discard Changes
            </button>
          )}
          <button
            type="button"
            onClick={fetchSettings}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border-default bg-surface-elevated text-text-secondary hover:text-text-primary text-xs font-bold transition-all cursor-pointer shadow-xs"
            title="Reload from server"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            Reload
          </button>
        </div>
      </div>

      {/* ── SECTION 1: General Club Information ── */}
      <div className="bg-surface-elevated rounded-2xl border-2 border-border-brutalist dark:border-border-default p-5 sm:p-6 shadow-[4px_4px_0px_0px_var(--border-brutalist)] dark:shadow-[4px_4px_0px_0px_var(--border-default)]">
        <div className="flex items-center gap-2.5 border-b border-border-default pb-3.5 mb-5">
          <div className="p-2 rounded-xl bg-accent-primary-light text-text-primary border border-border-default shrink-0">
            <Building2 size={20} className="text-accent-primary" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-text-primary tracking-tight">
              Club Profile &amp; Identity
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Official branding, founding year, annual fee, and headquarters address.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {generalSettings.map((s) => {
            const isAddress = s.key === "address";
            return (
              <div
                key={s.key}
                className={`p-4 bg-surface-secondary/70 rounded-xl border border-border-default transition hover:border-accent-primary/40 ${
                  isAddress ? "sm:col-span-2" : ""
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <label className="block text-xs font-bold text-text-primary">
                    {s.label}
                  </label>
                  {s.key === "membership_fee" && (
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-accent-primary-light text-text-primary border border-border-default rounded font-bold">
                      BDT / Year
                    </span>
                  )}
                </div>
                {s.description && (
                  <p className="text-[11px] text-text-tertiary mb-2 font-medium">
                    {s.description}
                  </p>
                )}
                {isAddress ? (
                  <textarea
                    rows={2}
                    value={s.value}
                    onChange={(e) => handleChange(s.key, e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-border-default rounded-lg bg-surface-elevated text-text-primary text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-accent-primary transition resize-y"
                    placeholder="Physical address..."
                  />
                ) : (
                  <input
                    type={s.key === "founded_year" || s.key === "membership_fee" ? "number" : "text"}
                    value={s.value}
                    onChange={(e) => handleChange(s.key, e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-border-default rounded-lg bg-surface-elevated text-text-primary text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-accent-primary transition"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SECTION 2: Official Contacts & Social Channels ── */}
      <div className="bg-surface-elevated rounded-2xl border-2 border-border-brutalist dark:border-border-default p-5 sm:p-6 shadow-[4px_4px_0px_0px_var(--border-brutalist)] dark:shadow-[4px_4px_0px_0px_var(--border-default)]">
        <div className="flex items-center gap-2.5 border-b border-border-default pb-3.5 mb-5">
          <div className="p-2 rounded-xl bg-accent-primary-light text-text-primary border border-border-default shrink-0">
            <Globe size={20} className="text-accent-primary" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-text-primary tracking-tight">
              Official Contacts &amp; Social Links
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Public communication handles shown across the website header, footer, registration, and emails.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {contactSettings.map((s) => {
            const isEmail = s.key.includes("email");
            const isPhone = s.key.includes("phone") || s.key.includes("whatsapp");
            const isUrl = s.key.includes("url");
            return (
              <div
                key={s.key}
                className="p-4 bg-surface-secondary/70 rounded-xl border border-border-default transition hover:border-accent-primary/40 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    {isEmail && <Mail size={13} className="text-accent-primary shrink-0" />}
                    {isPhone && <Phone size={13} className="text-accent-primary shrink-0" />}
                    {isUrl && <Globe size={13} className="text-accent-primary shrink-0" />}
                    <label className="block text-xs font-bold text-text-primary">
                      {s.label}
                    </label>
                  </div>
                  {s.description && (
                    <p className="text-[11px] text-text-tertiary mb-2 font-medium">
                      {s.description}
                    </p>
                  )}
                </div>
                <input
                  type={isEmail ? "email" : isUrl ? "url" : "text"}
                  value={s.value}
                  onChange={(e) => handleChange(s.key, e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-border-default rounded-lg bg-surface-elevated text-text-primary text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-accent-primary transition"
                  placeholder={
                    isEmail
                      ? "name@example.com"
                      : isPhone
                      ? "+88017..."
                      : "https://..."
                  }
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SECTION 3: Academic Batch Settings ── */}
      <div className="bg-surface-elevated rounded-2xl border-2 border-border-brutalist dark:border-border-default p-5 sm:p-6 shadow-[4px_4px_0px_0px_var(--border-brutalist)] dark:shadow-[4px_4px_0px_0px_var(--border-default)]">
        <div className="flex items-center gap-2.5 border-b border-border-default pb-3.5 mb-4">
          <div className="p-2 rounded-xl bg-accent-primary-light text-text-primary border border-border-default shrink-0">
            <GraduationCap size={20} className="text-accent-primary" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-text-primary tracking-tight">
              Academic Batch Settings (Current Junior Batch)
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Controls the latest enrolled batch number per department for student registration forms.
            </p>
          </div>
        </div>

        {/* Informational Callout */}
        <div className="flex items-start gap-2.5 p-3.5 bg-surface-secondary border border-border-default rounded-xl text-xs text-text-secondary mb-5">
          <Info size={18} className="text-accent-primary shrink-0 mt-0.5" />
          <span className="leading-relaxed">
            Set the current most junior (latest running) batch number for each department. The student registration form uses this to calculate and display only the most recent 10 batches (e.g. CSE #9 displays 1st through 9th Batch, EEE #18 displays 9th through 18th Batch).
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {batchSettings.map((s) => {
            const numVal = parseInt(s.value, 10) || 1;
            const startBatch = Math.max(1, numVal - 9);
            const deptCode = s.key.replace("batch_current_", "");
            return (
              <div
                key={s.key}
                className="p-4 bg-surface-secondary/70 rounded-xl border border-border-default transition hover:border-accent-primary/40 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="text-[11px] font-mono px-2 py-0.5 bg-surface-elevated text-accent-primary border border-border-default rounded font-black">
                      {deptCode}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-accent-primary-light text-text-primary border border-border-default rounded font-bold">
                      Latest: #{numVal}
                    </span>
                  </div>
                  <label className="block text-xs font-bold text-text-primary mb-2 leading-tight">
                    {s.label}
                  </label>
                </div>

                <div className="space-y-2 mt-2">
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={s.value}
                    onChange={(e) => handleChange(s.key, e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-border-default rounded-lg bg-surface-elevated text-text-primary text-sm font-extrabold font-mono focus:outline-none focus:ring-2 focus:ring-accent-primary transition"
                  />
                  <p className="text-[10px] font-mono text-text-tertiary">
                    Registration shows: {startBatch}th – {numVal}th Batch
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Fixed Floating Save Bar ── */}
      {isAdmin && (
        <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 flex items-center gap-3">
          {isDirty && (
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-elevated border-2 border-border-brutalist dark:border-border-default text-xs font-bold text-amber-600 dark:text-amber-400 shadow-[3px_3px_0px_0px_var(--border-brutalist)]">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Unsaved Changes
            </div>
          )}
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2.5 px-6 py-3.5 bg-accent-primary hover:bg-accent-primary-hover text-white border-2 border-border-brutalist dark:border-border-default rounded-xl text-sm font-extrabold shadow-[4px_4px_0px_0px_var(--border-brutalist)] dark:shadow-[4px_4px_0px_0px_var(--border-default)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_var(--border-brutalist)] transition-all disabled:opacity-60 cursor-pointer"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {saving ? "Saving Changes..." : "Save All Settings"}
          </button>
        </div>
      )}
    </form>
  );
}

/* ─────────────────────────────────────────────────────────────
   TAB 4: BROADCASTS & ANNOUNCEMENTS ENGINE (MISSING FEATURE)
───────────────────────────────────────────────────────────── */
function BroadcastsTab({ currentUser, isAdmin }: { currentUser: any; isAdmin: boolean }) {
  const [broadcasts, setBroadcasts] = useState<BroadcastItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dispatching, setDispatching] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [recipientRole, setRecipientRole] = useState("all");
  const [priority, setPriority] = useState<"normal" | "high" | "urgent">("normal");
  const [link, setLink] = useState("");
  const [actionLabel, setActionLabel] = useState("View Details");
  const [pendingDelete, setPendingDelete] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  const AUDIENCE_OPTIONS: FilterOption[] = [
    { value: "all", label: "All Club Members & Staff" },
    { value: "current_members", label: "Active Enrolled Members" },
    { value: "executive", label: "Executive Committee Only" },
    { value: "moderator", label: "Moderators & Admins Only" },
  ];

  const PRIORITY_OPTIONS: FilterOption[] = [
    { value: "normal", label: "Normal Notice" },
    { value: "high", label: "High Priority Alert" },
    { value: "urgent", label: "Urgent Deadline / Action" },
  ];

  const fetchBroadcasts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/notifications/broadcasts`, { withCredentials: true });
      if (res.data?.success && Array.isArray(res.data.data)) {
        setBroadcasts(res.data.data);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBroadcasts();
  }, [fetchBroadcasts]);

  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      toast.error("Title and message body are required");
      return;
    }

    setDispatching(true);
    try {
      await axios.post(
        `${API_BASE_URL}/api/notifications/broadcast`,
        {
          title: title.trim(),
          message: message.trim(),
          recipientRole,
          priority,
          link: link.trim(),
          actionLabel: actionLabel.trim() || "View Details",
        },
        { withCredentials: true }
      );

      toast.success("Broadcast announcement dispatched to all targeted members!");
      setTitle("");
      setMessage("");
      setLink("");
      fetchBroadcasts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to dispatch broadcast");
    } finally {
      setDispatching(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete?._id) return;
    const id = pendingDelete._id;
    setDeleting(true);
    try {
      await axios.delete(`${API_BASE_URL}/api/notifications/broadcasts/${id}`, { withCredentials: true });
      toast.success("Broadcast revoked");
      setBroadcasts((prev) => prev.filter((b) => b._id !== id));
      setPendingDelete(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete broadcast");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* ── Form: Dispatch New Broadcast ── */}
      <div className="lg:col-span-5 bg-surface-elevated rounded-2xl border-2 border-border-brutalist dark:border-border-default p-5 shadow-[4px_4px_0px_0px_var(--border-brutalist)]">
        <div className="flex items-center gap-2 border-b border-border-default pb-3 mb-4">
          <Megaphone className="text-accent-primary" size={20} />
          <div>
            <h3 className="text-sm font-bold text-text-primary">
              Dispatch Member Broadcast
            </h3>
            <p className="text-[11px] text-text-tertiary">
              Pushes live alerts directly into members' notification centers.
            </p>
          </div>
        </div>

        <form onSubmit={handleDispatch} className="space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-text-secondary block mb-1">
              Broadcast Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Mock Contest 4 Starting in 2 Hours!"
              className="w-full px-3 py-2 bg-surface-secondary border border-border-default rounded-xl focus:outline-none focus:border-accent-primary font-semibold"
            />
          </div>

          <div>
            <label className="font-bold text-text-secondary block mb-1">
              Message Body *
            </label>
            <textarea
              rows={3}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Provide clear details, instructions, or contest links…"
              className="w-full px-3 py-2 bg-surface-secondary border border-border-default rounded-xl focus:outline-none focus:border-accent-primary leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-text-secondary block mb-1">
                Target Audience
              </label>
              <FilterSelect
                options={AUDIENCE_OPTIONS}
                value={recipientRole}
                onChange={(val) => setRecipientRole(val)}
                className="w-full"
              />
            </div>

            <div>
              <label className="font-bold text-text-secondary block mb-1">
                Priority
              </label>
              <FilterSelect
                options={PRIORITY_OPTIONS}
                value={priority}
                onChange={(val: any) => setPriority(val)}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-text-secondary block mb-1">
                Action CTA Link (Optional)
              </label>
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="/events/mock-4"
                className="w-full px-3 py-2 bg-surface-secondary border border-border-default rounded-xl focus:outline-none focus:border-accent-primary font-mono text-[11px]"
              />
            </div>
            <div>
              <label className="font-bold text-text-secondary block mb-1">
                Button Label
              </label>
              <input
                type="text"
                value={actionLabel}
                onChange={(e) => setActionLabel(e.target.value)}
                placeholder="View Details"
                className="w-full px-3 py-2 bg-surface-secondary border border-border-default rounded-xl focus:outline-none focus:border-accent-primary"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-border-default flex justify-end">
            <button
              type="submit"
              disabled={dispatching}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent-primary text-text-primary font-bold text-xs border border-border-brutalist shadow-[2px_2px_0px_0px_var(--border-brutalist)] hover:opacity-95 disabled:opacity-50 cursor-pointer"
            >
              {dispatching ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
              Send Broadcast Alert
            </button>
          </div>
        </form>
      </div>

      {/* ── Right Column: Broadcast History ── */}
      <div className="lg:col-span-7 bg-surface-elevated rounded-2xl border-2 border-border-brutalist dark:border-border-default p-5 shadow-[4px_4px_0px_0px_var(--border-brutalist)]">
        <div className="flex items-center justify-between border-b border-border-default pb-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-text-primary">
              Broadcast Dispatch Archive
            </h3>
            <p className="text-[11px] text-text-tertiary">
              Active in-app notifications dispatched to club members.
            </p>
          </div>
          <span className="text-xs font-mono text-text-tertiary">
            {broadcasts.length} Sent
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-text-tertiary">
            <Loader2 size={16} className="animate-spin mx-auto mb-2 text-accent-primary" />
            Loading broadcast records…
          </div>
        ) : broadcasts.length === 0 ? (
          <div className="py-16 text-center text-xs text-text-tertiary">
            <Bell size={24} className="mx-auto mb-2 opacity-40" />
            No broadcast notifications dispatched yet. Use the form on the left to send an announcement.
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {broadcasts.map((b) => (
              <div
                key={b._id}
                className="p-3 bg-surface-secondary/50 rounded-xl border border-border-default/70 hover:bg-surface-secondary transition flex items-start justify-between gap-3 text-xs"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-bold text-text-primary text-xs">
                      {b.title}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                        b.priority === "urgent"
                          ? "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30"
                          : b.priority === "high"
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                          : "bg-surface-elevated text-text-secondary border border-border-default"
                      }`}
                    >
                      {b.priority}
                    </span>
                    <span className="text-[10px] font-mono text-text-tertiary">
                      Audience: {b.recipientRole || "all"}
                    </span>
                  </div>
                  <p className="text-text-secondary text-[11px] leading-relaxed line-clamp-2">
                    {b.message}
                  </p>
                  {b.link && (
                    <span className="text-[10px] font-mono text-accent-primary mt-1 inline-block truncate max-w-sm">
                      Target: {b.link}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-[10px] font-mono text-text-tertiary mr-1">
                    {new Date(b.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </span>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => setPendingDelete(b)}
                      className="p-1 rounded-lg text-text-tertiary hover:text-accent-error hover:bg-red-500/10 transition cursor-pointer"
                      title="Revoke / Delete Broadcast"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Revoke Broadcast Confirmation Modal ── */}
      {pendingDelete && (
        <div
          className="fixed inset-0 z-[1300] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => !deleting && setPendingDelete(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="bg-surface-elevated border-2 border-border-brutalist dark:border-border-default rounded-2xl max-w-sm w-full p-5 shadow-[6px_6px_0px_0px_var(--border-brutalist)] space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-sm">
                <Trash2 size={16} />
                <span>Revoke Broadcast?</span>
              </div>
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                disabled={deleting}
                className="p-1 rounded-lg text-text-tertiary hover:text-text-primary cursor-pointer disabled:opacity-50"
                title="Close"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-surface-secondary border border-border-default text-xs space-y-1">
              <p className="font-bold text-text-primary truncate">{pendingDelete.title}</p>
              <p className="text-text-secondary line-clamp-2">{pendingDelete.message}</p>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed">
              This removes the announcement from every member&apos;s notification center. This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                disabled={deleting}
                className="px-3 py-1.5 rounded-xl border border-border-default text-text-secondary hover:text-text-primary text-xs font-bold transition cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="px-3.5 py-1.5 rounded-xl bg-red-600 text-white font-bold text-xs border border-border-brutalist shadow-[2px_2px_0px_0px_var(--border-brutalist)] transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                {deleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                Revoke
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
