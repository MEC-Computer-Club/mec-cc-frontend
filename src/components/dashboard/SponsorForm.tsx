"use client";
import React, { useState, useEffect, useRef, Suspense } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Globe,
  Mail,
  User,
  DollarSign,
  Calendar,
  Plus,
  Trash2,
  Info,
  CheckCircle,
  Search,
  X,
  Handshake,
  Building2,
  Award,
  Sparkles,
} from "lucide-react";
import ImageUpload from "@/components/ui/shared/ImageUpload";

// ── Types ──────────────────────────────────────────────────────────────────
export interface SponsorshipRecord {
  _id?: string;
  sponsorshipType: "event" | "duration";
  eventId?: string;
  eventName?: string;
  tier?: string;
  startDate?: string;
  endDate?: string;
  contributionType: "monetary" | "in_kind" | "service";
  amountOrValue: number;
  notes?: string;
}

export interface SponsorFormData {
  name: string;
  logoUrl: string;
  website: string;
  isActive: boolean;
  showOnHome?: boolean;
  contactName: string;
  contactEmail: string;
  category?: "sponsor" | "club_as_partner";
  role?: string;
  tier?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  sponsorships: SponsorshipRecord[];
}

interface Props {
  initialData?: Partial<SponsorFormData> & { _id?: string };
  mode: "create" | "edit";
}

// ── Helpers ────────────────────────────────────────────────────────────────
const INPUT =
  "w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-accent-primary outline-none text-sm transition";

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-slate-500 dark:text-slate-400">{hint}</p>}
    </div>
  );
}

function IconInput({
  icon: Icon,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { icon?: React.ElementType }) {
  return (
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      )}
      <input
        {...props}
        className={`w-full ${
          Icon ? "pl-10" : "pl-4"
        } pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-accent-primary outline-none text-sm transition`}
      />
    </div>
  );
}

// ── Event autocomplete combobox ────────────────────────────────────────────
interface EventOption {
  _id: string;
  title: string;
  date?: string;
  category?: string;
}

const EMPTY_SPONSORSHIP: SponsorshipRecord = {
  sponsorshipType: "event",
  eventId: "",
  eventName: "",
  tier: "",
  startDate: "",
  endDate: "",
  contributionType: "monetary",
  amountOrValue: 0,
  notes: "",
};

export const DEFAULT_SPONSOR_TIERS = [
  "Title Sponsor",
  "Powered By Sponsor",
  "Co-Sponsor",
  "Gold Sponsor",
  "Silver Sponsor",
  "Bronze Sponsor",
  "Food Sponsor",
  "Snack & Beverage Partner",
  "Platform & Cloud Partner",
  "Media Partner",
  "Community Partner",
  "Kit & Swag Partner",
  "Learning Partner",
];

const COMMON_PARTNER_ROLES = [
  "Club Partner",
  "Community Partner",
  "Outreach Partner",
  "Co-Organizer",
  "Media Partner",
  "Promotional Partner",
];

function EventCombobox({
  value,
  eventId,
  onChange,
}: {
  value: string;
  eventId?: string;
  onChange: (eventName: string, eventId: string) => void;
}) {
  const [query, setQuery] = useState(value);
  const [allEvents, setAllEvents] = useState<EventOption[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_BASE_URL}/api/events`)
      .then((r: any) => setAllEvents(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = query.trim()
    ? allEvents.filter((ev) => ev.title.toLowerCase().includes(query.toLowerCase()))
    : allEvents;

  const handleSelect = (ev: EventOption) => {
    setQuery(ev.title);
    onChange(ev.title, ev._id);
    setOpen(false);
  };

  const handleClear = () => {
    setQuery("");
    onChange("", "");
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          placeholder="Type to search events…"
          autoComplete="off"
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            if (!e.target.value) onChange("", "");
          }}
          onFocus={() => setOpen(true)}
          className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-accent-primary outline-none text-sm"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {eventId && (
        <p className="text-xs text-accent-primary mt-1 flex items-center gap-1 font-semibold">
          <CheckCircle size={11} /> Event linked (ID: {eventId.slice(-6)})
        </p>
      )}

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl max-h-56 overflow-y-auto">
          {loading ? (
            <div className="px-4 py-3 text-xs text-slate-400">Loading events…</div>
          ) : filtered.length === 0 ? (
            <div className="px-4 py-3 text-xs text-slate-400">
              {query ? `No events matching "${query}"` : "No events found"}
            </div>
          ) : (
            filtered.map((ev) => (
              <button
                key={ev._id}
                type="button"
                onClick={() => handleSelect(ev)}
                className={`w-full text-left px-4 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition flex items-start gap-3 ${
                  ev._id === eventId ? "bg-slate-100 dark:bg-slate-700/50" : ""
                }`}
              >
                <Calendar size={14} className="text-accent-primary flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
                    {ev.title}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {ev.date
                      ? new Date(ev.date).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : ""}
                    {ev.category ? ` · ${ev.category}` : ""}
                  </p>
                </div>
                {ev._id === eventId && (
                  <CheckCircle size={14} className="text-accent-primary flex-shrink-0 ml-auto mt-0.5" />
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ── Sponsorship record row ─────────────────────────────────────────────────
function SponsorshipRow({
  record,
  index,
  tierSuggestions = DEFAULT_SPONSOR_TIERS,
  onChange,
  onRemove,
}: {
  record: SponsorshipRecord;
  index: number;
  tierSuggestions?: string[];
  onChange: (idx: number, updated: SponsorshipRecord) => void;
  onRemove: (idx: number) => void;
}) {
  const set = (k: keyof SponsorshipRecord, v: string | number) =>
    onChange(index, { ...record, [k]: v });

  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
          Sponsorship #{index + 1}
        </span>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="flex gap-4">
        {(["event", "duration"] as const).map((t) => (
          <label key={t} className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="radio"
              name={`sponsorshipType-${index}`}
              value={t}
              checked={record.sponsorshipType === t}
              onChange={() => set("sponsorshipType", t)}
              className="text-accent-primary focus:ring-accent-primary"
            />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
              {t}
            </span>
          </label>
        ))}
      </div>

      {record.sponsorshipType === "event" ? (
        <Field label="Linked Event">
          <EventCombobox
            value={record.eventName || ""}
            eventId={record.eventId}
            onChange={(name, id) => {
              onChange(index, { ...record, eventName: name, eventId: id });
            }}
          />
        </Field>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Start Date">
            <input
              type="date"
              className={INPUT}
              value={record.startDate ? record.startDate.slice(0, 10) : ""}
              onChange={(e) => set("startDate", e.target.value)}
            />
          </Field>
          <Field label="End Date">
            <input
              type="date"
              className={INPUT}
              value={record.endDate ? record.endDate.slice(0, 10) : ""}
              onChange={(e) => set("endDate", e.target.value)}
            />
          </Field>
        </div>
      )}

      {/* ── Sponsorship Tier / Role ── */}
      <Field
        label="Sponsorship Role / Tier"
        hint="Specify what type of sponsor they are (e.g. Gold Sponsor, Food Sponsor, Title Sponsor)"
      >
        <div className="relative">
          <input
            type="text"
            list={`sponsor-tier-options-${index}`}
            placeholder="e.g. Gold Sponsor, Food Sponsor, Title Sponsor…"
            value={record.tier || ""}
            onChange={(e) => set("tier", e.target.value)}
            className={INPUT}
          />
          <datalist id={`sponsor-tier-options-${index}`}>
            {tierSuggestions.map((tier) => (
              <option key={tier} value={tier} />
            ))}
          </datalist>
        </div>
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Contribution Type">
          <select
            className={INPUT}
            value={record.contributionType}
            onChange={(e) => set("contributionType", e.target.value)}
          >
            <option value="monetary">Monetary (Cash / Fund)</option>
            <option value="in_kind">In-Kind (Swag / Gadgets / Food)</option>
            <option value="service">Service (Cloud Credits / Software)</option>
          </select>
        </Field>
        <Field label="Estimated Amount / Value (৳)">
          <IconInput
            icon={DollarSign}
            type="number"
            min={0}
            value={record.amountOrValue}
            onChange={(e) => set("amountOrValue", Number(e.target.value))}
          />
        </Field>
      </div>

      <Field label="Notes">
        <textarea
          rows={2}
          placeholder="Optional notes for this sponsorship…"
          value={record.notes || ""}
          onChange={(e) => set("notes", e.target.value)}
          className={INPUT + " resize-y"}
        />
      </Field>
    </div>
  );
}

// ── Inner Form Component ───────────────────────────────────────────────────
function SponsorFormInner({ initialData, mode }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryCategory = searchParams.get("category");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const initialCat: "sponsor" | "club_as_partner" =
    initialData?.category ||
    (queryCategory === "club_as_partner" ? "club_as_partner" : "sponsor");

  const [category, setCategory] = useState<"sponsor" | "club_as_partner">(initialCat);

  const [profile, setProfile] = useState({
    name: initialData?.name || "",
    logoUrl: initialData?.logoUrl || "",
    website: initialData?.website || "",
    isActive: initialData?.isActive ?? true,
    showOnHome: (initialData as any)?.showOnHome ?? true,
    contactName: initialData?.contactName || "",
    contactEmail: initialData?.contactEmail || "",
    role: initialData?.role || "",
    description: initialData?.description || "",
    startDate: initialData?.startDate
      ? new Date(initialData.startDate).toISOString().slice(0, 10)
      : "",
    endDate: initialData?.endDate
      ? new Date(initialData.endDate).toISOString().slice(0, 10)
      : "",
  });

  const [tierSuggestions, setTierSuggestions] = useState<string[]>(DEFAULT_SPONSOR_TIERS);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/sponsors`)
      .then((res) => res.json())
      .then((data) => {
        const list: any[] = data.data || [];
        const dynamicSet = new Set<string>(DEFAULT_SPONSOR_TIERS);
        list.forEach((s) => {
          if (s.tier) dynamicSet.add(s.tier);
          if (s.role) dynamicSet.add(s.role);
          if (Array.isArray(s.sponsorships)) {
            s.sponsorships.forEach((r: any) => {
              if (r.tier) dynamicSet.add(r.tier);
            });
          }
        });
        setTierSuggestions(Array.from(dynamicSet));
      })
      .catch(() => {});
  }, []);

  const [sponsorships, setSponsorships] = useState<SponsorshipRecord[]>(
    initialData?.sponsorships?.length
      ? initialData.sponsorships
      : [{ ...EMPTY_SPONSORSHIP }]
  );

  useEffect(() => {
    if (!initialData) return;
    if (initialData.category) {
      setCategory(initialData.category);
    }
    setProfile({
      name: initialData.name || "",
      logoUrl: initialData.logoUrl || "",
      website: initialData.website || "",
      isActive: initialData.isActive ?? true,
      showOnHome: (initialData as any)?.showOnHome ?? true,
      contactName: initialData.contactName || "",
      contactEmail: initialData.contactEmail || "",
      role: initialData.role || "",
      description: initialData.description || "",
      startDate: initialData.startDate
        ? new Date(initialData.startDate).toISOString().slice(0, 10)
        : "",
      endDate: initialData.endDate
        ? new Date(initialData.endDate).toISOString().slice(0, 10)
        : "",
    });
    if (initialData.sponsorships?.length) {
      setSponsorships(initialData.sponsorships);
    }
  }, [initialData]);

  const setP = (k: keyof typeof profile, v: string | boolean) =>
    setProfile((p) => ({ ...p, [k]: v }));

  const updateRecord = (idx: number, updated: SponsorshipRecord) =>
    setSponsorships((prev) => prev.map((r, i) => (i === idx ? updated : r)));

  const removeRecord = (idx: number) =>
    setSponsorships((prev) => prev.filter((_, i) => i !== idx));

  const addRecord = () =>
    setSponsorships((prev) => [...prev, { ...EMPTY_SPONSORSHIP }]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...profile,
      category,
      sponsorships: category === "club_as_partner" ? [] : sponsorships,
    };

    try {
      if (mode === "edit" && initialData?._id) {
        await axios.patch(
          `${API_BASE_URL}/api/sponsors/${initialData._id}`,
          payload,
          { withCredentials: true }
        );
      } else {
        await axios.post(`${API_BASE_URL}/api/sponsors`, payload, {
          withCredentials: true,
        });
      }
      router.push("/dashboard/sponsors");
    } catch (err) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || "Failed to save."
          : "Unexpected error."
      );
    } finally {
      setSaving(false);
    }
  };

  const isClubPartner = category === "club_as_partner";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-16">
      {/* Sticky header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-4 sm:px-6 py-3 flex items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/sponsors"
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              {mode === "edit"
                ? isClubPartner
                  ? "Edit External Connection"
                  : "Edit Sponsor"
                : isClubPartner
                ? "Add External Connection (Club as Partner)"
                : "Add Sponsor & Collaborator"}
            </h1>
            <p className="text-xs text-slate-500">
              {isClubPartner
                ? "Record where MEC Computer Club is connected as an external partner"
                : "Record organization sponsoring or partnering with our club"}
            </p>
          </div>
        </div>
        <button
          type="submit"
          form="sponsor-form"
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-text-primary hover:bg-surface-inverse text-white rounded-xl font-bold text-sm transition disabled:opacity-60 shadow-[3px_3px_0px_0px_var(--border-default)]"
          style={{ color: "#FFFFFF" }}
        >
          <Save size={15} />{" "}
          {saving
            ? "Saving…"
            : mode === "edit"
            ? "Update Entry"
            : isClubPartner
            ? "Save Connection"
            : "Save Sponsor"}
        </button>
      </div>

      <form
        id="sponsor-form"
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6"
      >
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm font-semibold">
            {error}
          </div>
        )}

        {/* ── Category Segmented Selector (Mode Create or Switchable) ── */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-[3px_3px_0px_0px_var(--border-default)]">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">
            Partnership Type
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setCategory("sponsor")}
              className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition ${
                category === "sponsor"
                  ? "bg-accent-primary-light/40 border-accent-primary text-text-primary font-bold shadow-[2px_2px_0px_0px_var(--accent-primary)]"
                  : "bg-surface-secondary border-border-default text-text-secondary hover:text-text-primary"
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  category === "sponsor"
                    ? "bg-accent-primary text-white"
                    : "bg-surface-elevated text-text-secondary"
                }`}
              >
                <Handshake size={18} />
              </div>
              <div>
                <p className="text-sm font-bold">Sponsor &amp; Collaborator</p>
                <p className="text-xs text-text-secondary font-normal">
                  Inbound backer supporting MEC Computer Club
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setCategory("club_as_partner")}
              className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition ${
                category === "club_as_partner"
                  ? "bg-accent-primary-light/40 border-accent-primary text-text-primary font-bold shadow-[2px_2px_0px_0px_var(--accent-primary)]"
                  : "bg-surface-secondary border-border-default text-text-secondary hover:text-text-primary"
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  category === "club_as_partner"
                    ? "bg-accent-primary text-white"
                    : "bg-surface-elevated text-text-secondary"
                }`}
              >
                <Globe size={18} />
              </div>
              <div>
                <p className="text-sm font-bold">External Connection</p>
                <p className="text-xs text-text-secondary font-normal">
                  MEC CC connected as Club / Community Partner
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* ── Main Details ── */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 sm:p-6 space-y-5 shadow-[3px_3px_0px_0px_var(--border-default)]">
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            {isClubPartner ? (
              <>
                <Building2 size={18} className="text-accent-primary" />
                External Event / Organization Info
              </>
            ) : (
              <>
                <User size={18} className="text-accent-primary" />
                Sponsor Profile
              </>
            )}
          </h2>

          <Field
            label={isClubPartner ? "Event / Host Organization Name" : "Sponsor Name"}
            required
            hint={
              isClubPartner
                ? "e.g. BUET CSE Fest 2026, National Collegiate Hackathon"
                : "e.g. TechCorp Bangladesh, Ummah Host BD"
            }
          >
            <IconInput
              icon={isClubPartner ? Building2 : User}
              required
              placeholder={
                isClubPartner
                  ? "e.g. National Hackathon 2026"
                  : "e.g. TechCorp Bangladesh"
              }
              value={profile.name}
              onChange={(e) => setP("name", e.target.value)}
            />
          </Field>

          {isClubPartner && (
            <div className="space-y-2">
              <Field
                label="MEC CC's Role"
                required
                hint="How MEC Computer Club is credited or designated"
              >
                <IconInput
                  icon={Award}
                  required
                  placeholder="e.g. Club Partner, Community Partner, Co-Organizer"
                  value={profile.role}
                  onChange={(e) => setP("role", e.target.value)}
                />
              </Field>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {COMMON_PARTNER_ROLES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setP("role", r)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition font-semibold ${
                      profile.role === r
                        ? "bg-accent-primary text-white border-accent-primary"
                        : "bg-surface-secondary border-border-default text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Field
            label={isClubPartner ? "Event / Organization Logo" : "Logo"}
            hint="Recommended: square or horizontal logo (PNG, JPG, SVG, min 200×200px)"
          >
            <ImageUpload
              value={profile.logoUrl}
              onChange={(url) => setP("logoUrl", url)}
              folder="sponsors"
              hint="Upload transparent PNG or clean SVG/JPG"
            />
          </Field>

          <Field
            label={isClubPartner ? "Event Website / Link" : "Website"}
            hint={isClubPartner ? "Link to event registration or official announcement" : ""}
          >
            <IconInput
              icon={Globe}
              type="url"
              placeholder="https://example.com"
              value={profile.website}
              onChange={(e) => setP("website", e.target.value)}
            />
          </Field>

          {isClubPartner && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Event / Partnership Start Date">
                <input
                  type="date"
                  className={INPUT}
                  value={profile.startDate}
                  onChange={(e) => setP("startDate", e.target.value)}
                />
              </Field>
              <Field label="Event / Partnership End Date">
                <input
                  type="date"
                  className={INPUT}
                  value={profile.endDate}
                  onChange={(e) => setP("endDate", e.target.value)}
                />
              </Field>
            </div>
          )}

          {isClubPartner && (
            <Field
              label="Collaboration Details & Scope"
              hint="Brief description of the partnership, perks, or engagement details"
            >
              <textarea
                rows={3}
                placeholder="e.g. MEC CC serves as official Club Partner. Members get direct invitation slots and our logo is placed on banners and certificate collaterals."
                value={profile.description}
                onChange={(e) => setP("description", e.target.value)}
                className={INPUT + " resize-y"}
              />
            </Field>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Contact Person (POC)">
              <IconInput
                icon={User}
                placeholder="Event coordinator or contact person"
                value={profile.contactName}
                onChange={(e) => setP("contactName", e.target.value)}
              />
            </Field>
            <Field label="Contact Email">
              <IconInput
                icon={Mail}
                type="email"
                placeholder="poc@example.com"
                value={profile.contactEmail}
                onChange={(e) => setP("contactEmail", e.target.value)}
              />
            </Field>
          </div>

          {/* Active toggle with tooltip */}
          <div className="flex items-center gap-3 pt-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={profile.isActive}
                onChange={(e) => setP("isActive", e.target.checked)}
                className="rounded border-slate-300 text-accent-primary focus:ring-accent-primary w-4 h-4"
              />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <CheckCircle
                  size={15}
                  className={profile.isActive ? "text-green-500" : "text-slate-400"}
                />
                {isClubPartner ? "Active Engagement" : "Active Sponsor"}
              </span>
            </label>
            <div className="relative">
              <button
                type="button"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onFocus={() => setShowTooltip(true)}
                onBlur={() => setShowTooltip(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
                aria-label="Status meaning"
              >
                <Info size={15} />
              </button>
              {showTooltip && (
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 bg-slate-900 dark:bg-slate-700 text-white text-xs rounded-xl px-3 py-2.5 shadow-xl z-50 pointer-events-none">
                  <p className="font-semibold mb-1">
                    {isClubPartner ? "Active Engagement" : "Active Sponsor"}
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    {isClubPartner
                      ? "When active, this partnership is current and visible in club records. Uncheck when the event has concluded."
                      : "When active, this sponsor appears on public partner and sponsor showcases."}
                  </p>
                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-900 dark:border-t-slate-700" />
                </div>
              )}
            </div>
          </div>

          {/* ── Feature on Homepage Toggle ── */}
          {!isClubPartner && (
            <div className="flex items-center justify-between p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl mt-3">
              <div className="space-y-0.5">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                  <Sparkles size={15} className="text-amber-500" />
                  Feature on Homepage
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select whether this sponsor appears on the homepage sponsor showcase. Recommended for active sponsors &amp; latest event sponsors.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={profile.showOnHome}
                  onChange={(e) => setP("showOnHome", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-amber-500"></div>
              </label>
            </div>
          )}
        </div>

        {/* ── Sponsorship Records (only for inbound sponsors) ── */}
        {!isClubPartner && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 sm:p-6 space-y-4 shadow-[3px_3px_0px_0px_var(--border-default)]">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  Sponsorship Records
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  A sponsor can sponsor multiple events or time periods. Add one record per sponsorship.
                </p>
              </div>
              <button
                type="button"
                onClick={addRecord}
                className="flex items-center gap-1.5 px-3 py-2 bg-accent-primary-light/50 hover:bg-accent-primary-light text-text-primary rounded-xl text-xs font-bold transition border border-accent-primary/30"
              >
                <Plus size={13} /> Add Record
              </button>
            </div>

            {sponsorships.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                No sponsorship records yet.{" "}
                <button
                  type="button"
                  onClick={addRecord}
                  className="text-accent-primary font-bold hover:underline"
                >
                  Add one
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {sponsorships.map((record, idx) => (
                  <SponsorshipRow
                    key={idx}
                    record={record}
                    index={idx}
                    tierSuggestions={tierSuggestions}
                    onChange={updateRecord}
                    onRemove={removeRecord}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
}

// ── Export with Suspense wrapper ───────────────────────────────────────────
export default function SponsorForm({ initialData, mode }: Props) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-semibold text-text-secondary">Loading form…</p>
          </div>
        </div>
      }
    >
      <SponsorFormInner initialData={initialData} mode={mode} />
    </Suspense>
  );
}
