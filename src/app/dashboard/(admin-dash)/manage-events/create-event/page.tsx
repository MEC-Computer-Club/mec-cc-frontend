"use client";

import React, { useState, useEffect, useMemo, useRef, Suspense } from "react";
import {
  Calendar, MapPin, Tag, Link as LinkIcon, AlignLeft, Type, Clock,
  Save, ArrowLeft, Users, DollarSign, Mail, Phone,
  Globe, Code, Eye, EyeOff, Info, Image as ImageIcon, Trophy,
  ListChecks, Plus, Trash2, HelpCircle, CheckCircle2, UserCheck,
  Upload, Sparkles, AlertCircle, Loader2, ClipboardPaste, Award, ShieldCheck
} from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import TagInput from "@/components/ui/shared/TagInput";
import { Select } from "@/components/ui/Select";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { compressImage } from "@/lib/imageCompressor";
import UniversalImageDropzone from "@/components/ui/shared/UniversalImageDropzone";
import toast from "react-hot-toast";
import { useRoleGuard } from "@/hooks/useRoleGuard";
import { EventImagePositionModal } from "../components/EventImagePositionModal";
import { EventPreviewModal } from "../components/EventPreviewModal";
import { api } from "@/lib/api";

// ── Reusable field wrapper ──────────────────────────────────────────────────
function Field({ label, required, hint, children }: {
  label: string; required?: boolean; hint?: string; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

// ── Input with optional left icon ──────────────────────────────────────────
function Input({ icon: Icon, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { icon?: React.ElementType }) {
  return (
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />}
      <input
        {...props}
        className={`w-full ${Icon ? "pl-10" : "pl-4"} pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-sm ${props.className || ""}`}
      />
    </div>
  );
}

// ── Section card ────────────────────────────────────────────────────────────
function Section({ icon: Icon, title, color = "text-indigo-500", children }: {
  icon: React.ElementType; title: string; color?: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
        <Icon className={`w-5 h-5 ${color}`} />
        <h2 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h2>
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  );
}


// ── Main form options ───────────────────────────────────────────────────────
const CATEGORY_OPTIONS = [
  { value: "workshop", label: "Workshop" },
  { value: "seminar", label: "Seminar" },
  { value: "contest", label: "Contest" },
  { value: "conference", label: "Conference" },
  { value: "hackathon", label: "Hackathon" },
  { value: "gaming", label: "Gaming Tournament" },
  { value: "social", label: "Social" },
  { value: "other", label: "Other" },
];

const STATUS_OPTIONS = [
  { value: "scheduled", label: "Scheduled" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed (Past Event)" },
  { value: "cancelled", label: "Cancelled" },
  { value: "postponed", label: "Postponed" },
];

const REGISTRATION_TYPE_OPTIONS = [
  { value: "individual", label: "Individual Registration" },
  { value: "team", label: "Team / Squad Registration" },
];

function CreateEventFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const { settings } = useSiteSettings();

  const [saving, setSaving] = useState(false);
  const [savingProgress, setSavingProgress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showHtmlPreview, setShowHtmlPreview] = useState(false);

  // Local File states for deferred cloud upload
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    title: "",
    category: "workshop",
    status: "scheduled",
    registrationType: "individual",
    teamSizeMin: 1,
    teamSizeMax: 4,
    description: "",
    date: "",
    endDate: "",
    eventTime: "",
    location: "",
    onlineLink: "",
    registrationLink: "",
    registrationDeadline: "",
    registrationDeadlineDate: "",
    registrationDeadlineTime: "23:59",
    maxParticipants: "",
    registrationFee: "0",
    coverImageUrl: "",
    coverImagePosition: "50% 50%",
    bannerImageUrl: "",
    bannerImagePosition: "50% 50%",
    organizer: "",
    contactEmail: "",
    contactPhone: "",
    isPublished: true,
    prizePool: "",
    linkedForm: "",
    providesCertificate: false,
    customHtmlSection: "",
    allowParticipationClaims: false,
  });

  const [positionModalOpen, setPositionModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  const DEFAULT_RULES = useMemo(
    () => [
      "Participants must maintain respect and professional conduct throughout the session.",
      "Ensure a stable internet connection and active attendance during the scheduled time.",
      "Check your registered email address for official announcements and joining instructions.",
    ],
    []
  );

  const [availableForms, setAvailableForms] = useState<{ _id: string; title: string; eventId?: any }[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [rewards, setRewards] = useState<{ position: string; prize: string }[]>([]);
  const [schedule, setSchedule] = useState<{ time: string; title: string; description: string }[]>([]);
  const [rules, setRules] = useState<string[]>(editId ? [] : DEFAULT_RULES);
  const [contributors, setContributors] = useState<{ name: string; role: string; department: string }[]>([]);

  // Registration source: custom form vs external URL
  const [registrationSource, setRegistrationSource] = useState<"custom_form" | "external_url">("custom_form");

  // Keep references to initial Cloudinary URLs to delete old ones when replaced
  const initialCoverUrlRef = useRef<string>("");
  const initialBannerUrlRef = useRef<string>("");

  // Default contact information from global site settings
  useEffect(() => {
    if (!editId && settings) {
      setForm((prev) => ({
        ...prev,
        organizer: prev.organizer || settings.club_name || "MEC Computer Club",
        contactEmail: prev.contactEmail || settings.contact_email || "meccomputerclub@gmail.com",
        contactPhone: prev.contactPhone || settings.contact_phone || "",
      }));
    }
  }, [settings, editId]);

  const set = (key: keyof typeof form, value: string | boolean | number) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // Check if event is in the past
  const isPastEvent = useMemo(() => {
    if (form.status === "completed") return true;
    if (!form.date) return false;
    const eventDate = new Date(form.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate < today;
  }, [form.date, form.status]);

  // Independent forms or forms currently linked to this event
  const selectableForms = useMemo(() => {
    return availableForms.filter((f) => {
      if (form.linkedForm && String(f._id) === String(form.linkedForm)) return true;
      const evId = f.eventId?._id ? String(f.eventId._id) : (f.eventId ? String(f.eventId) : undefined);
      if (editId && evId === editId) return true;
      const isIndependent = !evId || evId === "" || evId === "111111111111111111111111";
      return isIndependent;
    });
  }, [availableForms, form.linkedForm, editId]);

  const selectedLinkedFormObj = useMemo(() => {
    if (!form.linkedForm) return null;
    return availableForms.find((f: any) => String(f._id) === String(form.linkedForm)) as any;
  }, [availableForms, form.linkedForm]);

  // Pre-load available forms from Form Builder
  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/forms`, { withCredentials: true })
      .then((res) => {
        const list = res.data?.data || res.data || [];
        setAvailableForms(Array.isArray(list) ? list : []);
      })
      .catch(() => {});
  }, []);

  // If editing an event and linkedForm is not yet resolved, auto-detect from availableForms matching eventId
  useEffect(() => {
    if (editId && !form.linkedForm && availableForms.length > 0) {
      const matched = availableForms.find((f: any) => {
        const evId = f.eventId?._id ? String(f.eventId._id) : (f.eventId ? String(f.eventId) : undefined);
        return evId === editId;
      });
      if (matched) {
        setForm((prev) => ({ ...prev, linkedForm: String(matched._id) }));
        setRegistrationSource("custom_form");
      }
    }
  }, [editId, form.linkedForm, availableForms]);

  // Pre-load if editing
  useEffect(() => {
    if (!editId) return;
    async function loadEvent() {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/events/${editId}`, { withCredentials: true });
        const ev = res.data.data;
        if (ev) {
          let rDate = "";
          let rTime = "23:59";
          if (ev.registrationDeadline) {
            const raw = String(ev.registrationDeadline);
            if (raw.includes("T")) {
              const [d, t] = raw.split("T");
              rDate = d;
              rTime = t.slice(0, 5);
            } else {
              rDate = raw;
            }
          }

          const initialImg = ev.bannerImageUrl || ev.coverImageUrl || ev.image || "";
          const initialPos = ev.bannerImagePosition || ev.coverImagePosition || "50% 50%";
          initialCoverUrlRef.current = initialImg;
          initialBannerUrlRef.current = initialImg;

          const rawLinked =
            ev.linkedForm?._id ? String(ev.linkedForm._id)
            : typeof ev.linkedForm === "string" ? ev.linkedForm
            : (ev.forms && ev.forms[0]?._id) ? String(ev.forms[0]._id)
            : (ev.forms && ev.forms[0] && typeof ev.forms[0] === "string") ? ev.forms[0]
            : "";

          const hasLinkedForm = Boolean(rawLinked);
          if (hasLinkedForm) {
            setRegistrationSource("custom_form");
          } else if (ev.registrationLink) {
            setRegistrationSource("external_url");
          } else {
            setRegistrationSource("custom_form");
          }

          setForm({
            title: ev.title || "",
            category: ev.category || "workshop",
            status: ev.status || "scheduled",
            registrationType: ev.registrationType || "individual",
            teamSizeMin: ev.teamSize?.min || 1,
            teamSizeMax: ev.teamSize?.max || 4,
            description: ev.description || "",
            date: ev.date ? ev.date.split("T")[0] : "",
            endDate: ev.endDate ? ev.endDate.split("T")[0] : "",
            eventTime: ev.eventTime || "",
            location: ev.location || "",
            onlineLink: ev.onlineLink || "",
            registrationLink: ev.registrationLink || "",
            registrationDeadline: ev.registrationDeadline ? ev.registrationDeadline.split("T")[0] : "",
            registrationDeadlineDate: rDate,
            registrationDeadlineTime: rTime || "23:59",
            maxParticipants: ev.maxParticipants ? String(ev.maxParticipants) : "",
            registrationFee: ev.registrationFee !== undefined ? String(ev.registrationFee) : "0",
            coverImageUrl: initialImg,
            coverImagePosition: initialPos,
            bannerImageUrl: initialImg,
            bannerImagePosition: initialPos,
            organizer: ev.organizer || "",
            contactEmail: ev.contactEmail || "",
            contactPhone: ev.contactPhone || "",
            isPublished: ev.isPublished ?? true,
            customHtmlSection: ev.customHtmlSection || "",
            prizePool: ev.prizePool || "",
            linkedForm: rawLinked,
            providesCertificate: Boolean(ev.providesCertificate),
            allowParticipationClaims: ev.allowParticipationClaims ?? false,
          });
          if (ev.tags) setTags(ev.tags);
          if (ev.rewards) setRewards(ev.rewards);
          if (ev.schedule) setSchedule(ev.schedule);
          if (ev.rules && ev.rules.length > 0) {
            setRules(ev.rules);
          } else {
            setRules(DEFAULT_RULES);
          }
          if (ev.contributors) setContributors(ev.contributors);
        }
      } catch (err) {
        console.error("Failed to load event for edit", err);
      }
    }
    loadEvent();
  }, [editId, DEFAULT_RULES]);

  // Helper to compress and upload a file to Cloudinary only when saving
  const uploadAndCompressImage = async (file: File, folder: string = "events"): Promise<string> => {
    const compressed = await compressImage(file, {
      maxSizeMB: 1.5,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    });

    const fd = new FormData();
    fd.append("image", compressed.file);
    fd.append("folder", folder);

    const res = await axios.post(
      `${API_BASE_URL}/api/upload/image?folder=${encodeURIComponent(folder)}`,
      fd,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return res.data.url || res.data.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavingProgress("Saving event…");
    setError(null);

    try {
      let finalBannerUrl = form.bannerImageUrl || form.coverImageUrl;

      // Upload Banner Image if a local file was dropped or selected
      const uploadFile = bannerFile || coverFile;
      if (uploadFile) {
        setSavingProgress("Compressing and uploading banner image…");
        finalBannerUrl = await uploadAndCompressImage(uploadFile, "events");
      }

      setSavingProgress("Saving event details…");

      let calculatedDeadline: string | undefined = undefined;
      if (registrationSource === "custom_form" && form.linkedForm && selectedLinkedFormObj?.endDate) {
        const parts = selectedLinkedFormObj.endDate.split("-");
        if (parts.length === 3) {
          const t = selectedLinkedFormObj.closingTime || "23:59";
          calculatedDeadline = `${parts[0]}-${parts[1].padStart(2, "0")}-${parts[2].padStart(2, "0")}T${t.length === 5 ? t + ":00" : t}+06:00`;
        }
      } else if (form.registrationDeadlineDate) {
        const t = form.registrationDeadlineTime || "23:59";
        calculatedDeadline = `${form.registrationDeadlineDate}T${t.length === 5 ? t + ":00" : t}+06:00`;
      }

      const payload = {
        ...form,
        coverImageUrl: finalBannerUrl,
        bannerImageUrl: finalBannerUrl,
        image: finalBannerUrl,
        bannerImagePosition: form.bannerImagePosition || form.coverImagePosition || "50% 50%",
        coverImagePosition: form.bannerImagePosition || form.coverImagePosition || "50% 50%",
        linkedForm: registrationSource === "custom_form" ? (form.linkedForm || "") : "",
        registrationLink: registrationSource === "external_url" ? (form.registrationLink ? form.registrationLink.trim() : "") : "",
        providesCertificate: Boolean(form.providesCertificate),
        allowParticipationClaims: Boolean(form.allowParticipationClaims),
        contributors: contributors.filter((c) => c.name.trim() && c.role.trim()),
        tags,
        maxParticipants: form.maxParticipants ? Number(form.maxParticipants) : undefined,
        registrationFee: Number(form.registrationFee) || 0,
        teamSize: form.registrationType === "team" ? { min: Number(form.teamSizeMin), max: Number(form.teamSizeMax) } : undefined,
        date: form.date || undefined,
        endDate: form.endDate || undefined,
        registrationDeadline: calculatedDeadline,
        rewards: rewards.filter((r) => r.position.trim() && r.prize.trim()),
        schedule: schedule.filter((s) => s.time.trim() && s.title.trim()),
        rules: rules.filter((r) => r.trim()),
      };

      if (editId) {
        await axios.patch(`${API_BASE_URL}/api/events/${editId}`, payload, { withCredentials: true });
        toast.success("Event updated successfully!");
      } else {
        await axios.post(`${API_BASE_URL}/api/events`, payload, { withCredentials: true });
        toast.success("Event created successfully!");
      }

      // Cleanup orphaned Cloudinary images if replaced
      const oldImagesToDelete = new Set<string>();
      if (initialCoverUrlRef.current && initialCoverUrlRef.current !== finalBannerUrl && initialCoverUrlRef.current.includes("cloudinary.com")) {
        oldImagesToDelete.add(initialCoverUrlRef.current);
      }
      if (initialBannerUrlRef.current && initialBannerUrlRef.current !== finalBannerUrl && initialBannerUrlRef.current.includes("cloudinary.com")) {
        oldImagesToDelete.add(initialBannerUrlRef.current);
      }

      for (const oldUrl of oldImagesToDelete) {
        try {
          await axios.delete(`${API_BASE_URL}/api/upload/image`, {
            data: { url: oldUrl },
            withCredentials: true,
          });
        } catch (e) {
          console.warn("Failed to delete replaced image from Cloudinary", e);
        }
      }
      router.push("/dashboard/manage-events");
    } catch (err) {
      setError(axios.isAxiosError(err) ? err.response?.data?.message || "Failed to save event." : (err as any)?.message || "Unexpected error.");
    } finally {
      setSaving(false);
      setSavingProgress("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-16">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-4 sm:px-6 py-3 flex items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/dashboard/manage-events"
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition flex-shrink-0">
            <ArrowLeft size={18} />
          </Link>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white truncate">
              {editId ? "Edit Event" : "Create New Event"}
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block">
              Configure event details, images, archiving, contributors, and registration rules
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 cursor-pointer select-none">
            <input type="checkbox" checked={form.isPublished}
              onChange={(e) => set("isPublished", e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
            <span className="hidden sm:inline">Publish</span>
          </label>
          <button
            type="button"
            onClick={() => setPreviewModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-xl font-medium text-sm transition shadow-sm"
          >
            <Eye size={15} />
            <span>Preview</span>
          </button>
          <button type="submit" form="event-form" disabled={saving}
            className="flex items-center gap-2 px-4 sm:px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm shadow-sm transition disabled:opacity-60">
            <Save size={15} />
            {saving ? (savingProgress || "Saving…") : editId ? "Update Event" : "Create Event"}
          </button>
        </div>
      </div>

      <form id="event-form" onSubmit={handleSubmit} className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* ── 1. General Info ── */}
        <Section icon={Type} title="General Information">
          <Field label="Event Title" required>
            <Input icon={Type} name="title" required placeholder="e.g. Workshop on Modern Full-Stack Development"
              value={form.title} onChange={(e) => set("title", e.target.value)} />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Category" required>
              <Select
                value={form.category}
                onChange={(val) => set("category", val)}
                options={CATEGORY_OPTIONS}
              />
            </Field>
            <Field label="Status">
              <Select
                value={form.status}
                onChange={(val) => set("status", val)}
                options={STATUS_OPTIONS}
              />
            </Field>
          </div>

          <Field label="Description" required>
            <RichTextEditor
              value={form.description}
              onChange={(val) => set("description", val)}
              placeholder="Describe the purpose, highlights, syllabus, eligibility, and what attendees will experience…"
              minHeight="180px"
            />
          </Field>

          <Field label="Tags" hint="Press Enter or comma to add tags (e.g. Workshop, Python, WebDev, AI)">
            <TagInput
              value={tags}
              onChange={setTags}
              placeholder="Add tags…"
            />
          </Field>
        </Section>

        {/* ── 2. Event Banner Image (Used for both Card & Event Banner) ── */}
        <Section icon={ImageIcon} title="Event Banner Image" color="text-purple-500">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="text-xs text-slate-500 leading-relaxed">
              Upload the event banner photo below. This single image is automatically used for both the event card display and the event detail hero banner.
            </p>
            <button
              type="button"
              onClick={() => setPreviewModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              <Eye size={13} />
              <span>Preview Card &amp; Details Layout →</span>
            </button>
          </div>

          <UniversalImageDropzone
            label="Banner Image (Card & Hero Header)"
            hint="This single banner image is displayed across event cards on the homepage/events list and as the hero header on the event detail page."
            aspectRatioHint="Recommended: 16:9 widescreen (e.g. 1920×1080 or 1280×720px)"
            currentUrl={form.bannerImageUrl || form.coverImageUrl}
            selectedFile={bannerFile || coverFile}
            imagePosition={form.bannerImagePosition || form.coverImagePosition}
            onAdjustPosition={() => setPositionModalOpen(true)}
            onFileSelect={(file) => {
              setBannerFile(file);
              setCoverFile(null);
            }}
            onClear={() => {
              setBannerFile(null);
              setCoverFile(null);
              set("bannerImageUrl", "");
              set("coverImageUrl", "");
              set("bannerImagePosition", "50% 50%");
              set("coverImagePosition", "50% 50%");
            }}
          />
        </Section>

        {/* ── 3. Date & Location ── */}
        <Section icon={Calendar} title="Date & Location" color="text-blue-500">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Start Date" required>
              <Input icon={Calendar} type="date" required value={form.date}
                onChange={(e) => set("date", e.target.value)} />
            </Field>
            <Field label="End Date" hint="Leave blank for single-day events">
              <Input icon={Calendar} type="date" value={form.endDate}
                onChange={(e) => set("endDate", e.target.value)} />
            </Field>
            <Field label="Time / Duration">
              <Input icon={Clock} placeholder="e.g. 10:00 AM – 04:00 PM" value={form.eventTime}
                onChange={(e) => set("eventTime", e.target.value)} />
            </Field>
            <Field label="Venue / Location" required>
              <Input icon={MapPin} required placeholder="e.g. MEC Campus Auditorium / CSE Lab 2" value={form.location}
                onChange={(e) => set("location", e.target.value)} />
            </Field>
          </div>

          <Field label="Online / Meeting Link" hint="Google Meet, Zoom, Discord, or YouTube live stream link">
            <Input icon={Globe} type="url" placeholder="https://meet.google.com/... or https://zoom.us/..." value={form.onlineLink}
              onChange={(e) => set("onlineLink", e.target.value)} />
          </Field>
        </Section>

        {/* ── 4. Event Contributors & Organizing Team ── */}
        <Section icon={Users} title="Event Contributors & Organizing Team" color="text-indigo-500">
          <p className="text-xs text-slate-500 leading-relaxed">
            Acknowledge the key people who organized, mentored, spoke, or contributed to this event. These individuals will be credited on the public event page.
          </p>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Contributors List
              </label>
              <button
                type="button"
                onClick={() => setContributors([...contributors, { name: "", role: "", department: "" }])}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <Plus size={14} /> Add Contributor
              </button>
            </div>

            {contributors.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">
                No contributors added yet. Click &quot;Add Contributor&quot; to credit speakers, mentors, or lead organizers.
              </p>
            ) : (
              contributors.map((contrib, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40">
                  <input
                    type="text"
                    placeholder="Full Name (e.g. Dr. John Doe)"
                    value={contrib.name}
                    onChange={(e) => {
                      const next = [...contributors];
                      next[idx].name = e.target.value;
                      setContributors(next);
                    }}
                    className="w-full sm:w-1/3 px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    placeholder="Role (e.g. Keynote Speaker / Lead Organizer)"
                    value={contrib.role}
                    onChange={(e) => {
                      const next = [...contributors];
                      next[idx].role = e.target.value;
                      setContributors(next);
                    }}
                    className="w-full sm:w-1/3 px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    placeholder="Dept / Affiliation (optional)"
                    value={contrib.department}
                    onChange={(e) => {
                      const next = [...contributors];
                      next[idx].department = e.target.value;
                      setContributors(next);
                    }}
                    className="w-full sm:flex-1 px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setContributors(contributors.filter((_, i) => i !== idx))}
                    className="p-2 text-slate-400 hover:text-red-500 transition self-end sm:self-center"
                    title="Remove contributor"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </Section>

        {/* ── 6. Registration Settings ── */}
        <Section icon={Users} title="Registration Settings" color="text-green-500">
          <Field label="Registration Mode" hint="Individual participant or multi-member team">
            <Select
              value={form.registrationType}
              onChange={(val) => set("registrationType", val)}
              options={REGISTRATION_TYPE_OPTIONS}
            />
          </Field>

          {/* Registration Method Selection Radio */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Registration Channel / Source
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-3.5 rounded-xl border-2 cursor-pointer flex items-start gap-3 transition-all ${
                  registrationSource === "custom_form"
                    ? "border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 shadow-[2px_2px_0px_var(--accent-primary)]"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600"
                }`}
              >
                <input
                  type="radio"
                  name="registrationSource"
                  checked={registrationSource === "custom_form"}
                  onChange={() => {
                    setRegistrationSource("custom_form");
                    set("registrationLink", "");
                  }}
                  className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <ListChecks size={15} className="text-indigo-500" /> Custom Form (Form Builder)
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Built-in registration form hosted directly on the club portal.
                  </p>
                </div>
              </label>

              <label
                className={`p-3.5 rounded-xl border-2 cursor-pointer flex items-start gap-3 transition-all ${
                  registrationSource === "external_url"
                    ? "border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/30 shadow-[2px_2px_0px_var(--accent-primary)]"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600"
                }`}
              >
                <input
                  type="radio"
                  name="registrationSource"
                  checked={registrationSource === "external_url"}
                  onChange={() => {
                    setRegistrationSource("external_url");
                    set("linkedForm", "");
                  }}
                  className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                />
                <div>
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <LinkIcon size={15} className="text-indigo-500" /> External Registration URL
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Google Form, Microsoft Form, Eventbrite, or external portal.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Conditional based on registrationSource */}
          {registrationSource === "custom_form" ? (
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <ListChecks size={16} className="text-indigo-500" />
                  Select Custom Form
                </span>
                <Link
                  href={
                    editId
                      ? `/dashboard/manage-events/create-form?eventId=${editId}&eventTitle=${encodeURIComponent(form.title || "Event")}`
                      : `/dashboard/manage-events/create-form`
                  }
                  target="_blank"
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <Plus size={13} /> Open Form Builder →
                </Link>
              </div>

              {form.linkedForm && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between flex-wrap gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-100">
                        {selectedLinkedFormObj?.title || "Custom Registration Form"}
                      </span>
                      <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                        Active Form
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/forms/${form.linkedForm}`}
                      target="_blank"
                      className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <Globe size={13} /> View Live Form ↗
                    </Link>
                    <Link
                      href={`/dashboard/manage-events/create-form?edit=${form.linkedForm}`}
                      target="_blank"
                      className="font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:underline flex items-center gap-1"
                    >
                      Edit in Builder ↗
                    </Link>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <Field label="Registration Form">
                  <Select
                    value={form.linkedForm || ""}
                    onChange={(val) => set("linkedForm", val)}
                    options={[
                      { value: "", label: "Select a custom form…" },
                      ...selectableForms.map((f) => ({
                        value: String(f._id),
                        label: `${f.title}${String(f._id) === String(form.linkedForm) ? " (Linked to this Event)" : " (Independent Form)"}`,
                      })),
                      ...(form.linkedForm && !selectableForms.some((f) => String(f._id) === String(form.linkedForm))
                        ? [{ value: String(form.linkedForm), label: selectedLinkedFormObj?.title ? `${selectedLinkedFormObj.title} (Linked)` : "Linked Custom Form" }]
                        : []),
                    ]}
                  />
                </Field>
                {form.linkedForm && (
                  <div className="pb-0.5 flex items-center gap-2">
                    <Link
                      href={`/forms/${form.linkedForm}`}
                      target="_blank"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-bold hover:border-indigo-500 transition shadow-sm"
                    >
                      <Globe size={14} className="text-indigo-500" />
                      Preview Live Form →
                    </Link>
                    <button
                      type="button"
                      onClick={() => set("linkedForm", "")}
                      className="px-3 py-2.5 rounded-xl border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-100 transition"
                      title="Disconnect form from this event"
                    >
                      Unlink
                    </button>
                  </div>
                )}
              </div>

              {/* Compact Registration Deadline indicator */}
              {form.linkedForm && selectedLinkedFormObj && (
                <div className="p-3 rounded-lg border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/40 dark:bg-indigo-950/20 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-indigo-500" />
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Registration Deadline:
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {selectedLinkedFormObj.endDate
                        ? `${selectedLinkedFormObj.endDate} at ${selectedLinkedFormObj.closingTime || "23:59"} (BST)`
                        : "No deadline specified in Form Builder"}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800">
                    Synced with Form
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <Field label="External Registration URL" hint="Paste a Google Form, Microsoft Form, or external ticketing link">
                <Input
                  icon={LinkIcon}
                  type="url"
                  placeholder="https://forms.gle/... or https://eventbrite.com/..."
                  value={form.registrationLink}
                  onChange={(e) => set("registrationLink", e.target.value)}
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Registration Deadline Date" hint="Date when registrations close">
                  <Input
                    icon={Calendar}
                    type="date"
                    value={form.registrationDeadlineDate}
                    onChange={(e) => set("registrationDeadlineDate", e.target.value)}
                  />
                </Field>
                <Field label="Registration Closing Time (BST)" hint="Exact cutoff time in Bangladesh Time">
                  <Input
                    icon={Clock}
                    type="time"
                    value={form.registrationDeadlineTime || "23:59"}
                    onChange={(e) => set("registrationDeadlineTime", e.target.value)}
                  />
                </Field>
              </div>
            </div>
          )}

          {/* Team / Squad constraints */}
          {form.registrationType === "team" && (
            <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-950/20 space-y-3">
              <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-semibold text-sm">
                <Users size={16} /> Team / Squad Roster Constraints
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Minimum Members per Team" hint="e.g. 2 for pair, 4 for squad">
                  <Input type="number" min="1" max="10" value={form.teamSizeMin}
                    onChange={(e) => set("teamSizeMin", Number(e.target.value))} />
                </Field>
                <Field label="Maximum Members per Team" hint="e.g. 4 or 5 with substitute">
                  <Input type="number" min="1" max="10" value={form.teamSizeMax}
                    onChange={(e) => set("teamSizeMax", Number(e.target.value))} />
                </Field>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Max Participants / Teams" hint="Leave blank for unlimited">
              <Input icon={Users} type="number" min="1" placeholder="e.g. 100" value={form.maxParticipants}
                onChange={(e) => set("maxParticipants", e.target.value)} />
            </Field>
            <Field label="Registration Fee (BDT)">
              <Input icon={DollarSign} type="number" min="0" placeholder="0 for free" value={form.registrationFee}
                onChange={(e) => set("registrationFee", e.target.value)} />
            </Field>
          </div>

          {/* ── Verified Credentials / Certificates Toggle ── */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Award size={16} className="text-amber-500" />
                  Issue Verified Digital Credentials &amp; Certificates
                </span>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Decide whether official, verifiable certificates will be granted for this event. When enabled, a verified credential badge will be displayed on the public event details page.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={form.providesCertificate}
                  onChange={(e) => set("providesCertificate", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-amber-500"></div>
              </label>
            </div>
          </div>

          {/* ── Participation Claims Toggle ("I Participated") ── */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <UserCheck size={16} className="text-emerald-500" />
                  Allow Participation Claims (&quot;I Participated&quot;)
                </span>
                <p className="text-xs text-slate-500 leading-relaxed">
                  When enabled, verified students visiting this event page can click &quot;I Participated&quot; to claim attendance or certificates. You can review, approve, or reject claims from the dashboard.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={form.allowParticipationClaims}
                  onChange={(e) => set("allowParticipationClaims", e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>
        </Section>

        {/* ── 7. Rules & Guidelines (Optional) ── */}
        <Section icon={ShieldCheck} title="Event Guidelines & Rules (Optional)" color="text-indigo-500">
          <p className="text-xs text-slate-500 -mt-2">
            Add specific guidelines, participation rules, or prerequisites for this event. If left empty, no guidelines section will be shown on the public event page.
          </p>
          <div className="space-y-3">
            {rules.map((rule, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-400 w-5">{idx + 1}.</span>
                <input
                  type="text"
                  value={rule}
                  onChange={(e) => {
                    const next = [...rules];
                    next[idx] = e.target.value;
                    setRules(next);
                  }}
                  placeholder={`Guideline rule #${idx + 1}`}
                  className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setRules(rules.filter((_, i) => i !== idx))}
                  className="p-2 text-slate-400 hover:text-red-500 transition"
                  title="Remove rule"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setRules([...rules, ""])}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-dashed border-indigo-400 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition flex items-center gap-1.5"
            >
              <Plus size={14} /> Add Guideline Rule
            </button>
          </div>
        </Section>

        {/* ── 6. Prizes & Rewards (Optional) ── */}
        <Section icon={Trophy} title="Prize Pool & Rewards (Optional)" color="text-amber-500">
          <Field label="Total Prize Pool Title" hint="e.g. ৳15,000 BDT or Grand Trophy + Swags">
            <Input icon={Trophy} placeholder="e.g. ৳15,000 BDT" value={form.prizePool}
              onChange={(e) => set("prizePool", e.target.value)} />
          </Field>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Prize Breakdown by Podium Position
              </label>
              <button
                type="button"
                onClick={() => setRewards([...rewards, { position: "", prize: "" }])}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <Plus size={14} /> Add Position
              </button>
            </div>

            {rewards.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">
                No prize breakdown added. Click &quot;Add Position&quot; if this event offers awards or certificates.
              </p>
            ) : (
              rewards.map((rew, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Position (e.g. 1st Place)"
                    value={rew.position}
                    onChange={(e) => {
                      const next = [...rewards];
                      next[idx].position = e.target.value;
                      setRewards(next);
                    }}
                    className="w-1/3 px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    placeholder="Prize (e.g. ৳5,000 + Certificate)"
                    value={rew.prize}
                    onChange={(e) => {
                      const next = [...rewards];
                      next[idx].prize = e.target.value;
                      setRewards(next);
                    }}
                    className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setRewards(rewards.filter((_, i) => i !== idx))}
                    className="p-2 text-slate-400 hover:text-red-500 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </Section>

        {/* ── 7. Schedule Timeline (Optional) ── */}
        <Section icon={Clock} title="Schedule Timeline (Optional)" color="text-teal-500">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Event Stages &amp; Timing
              </label>
              <button
                type="button"
                onClick={() => setSchedule([...schedule, { time: "", title: "", description: "" }])}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <Plus size={14} /> Add Timeline Item
              </button>
            </div>

            {schedule.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">
                No schedule items added yet. Click &quot;Add Timeline Item&quot; to lay out sessions or match timings.
              </p>
            ) : (
              schedule.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 space-y-2">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Time (e.g. 10:00 AM)"
                      value={item.time}
                      onChange={(e) => {
                        const next = [...schedule];
                        next[idx].time = e.target.value;
                        setSchedule(next);
                      }}
                      className="w-36 px-3 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Session / Stage Title (e.g. Opening Remarks)"
                      value={item.title}
                      onChange={(e) => {
                        const next = [...schedule];
                        next[idx].title = e.target.value;
                        setSchedule(next);
                      }}
                      className="flex-1 px-3 py-1.5 text-sm font-medium rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setSchedule(schedule.filter((_, i) => i !== idx))}
                      className="p-1.5 text-slate-400 hover:text-red-500 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Optional brief notes or speaker for this session..."
                    value={item.description}
                    onChange={(e) => {
                      const next = [...schedule];
                      next[idx].description = e.target.value;
                      setSchedule(next);
                    }}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none"
                  />
                </div>
              ))
            )}
          </div>
        </Section>

        {/* ── 9. Organiser & Contact ── */}
        <Section icon={Info} title="Organiser & Contact" color="text-orange-500">
          <p className="text-xs text-slate-500 leading-relaxed">
            Pre-filled with MEC Computer Club global site contact information. You can modify these values if this event has a specific external partner or coordinator.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Organiser Name">
              <Input icon={Users} placeholder="e.g. MEC Computer Club" value={form.organizer}
                onChange={(e) => set("organizer", e.target.value)} />
            </Field>
            <Field label="Contact Email">
              <Input icon={Mail} type="email" placeholder="meccomputerclub@gmail.com" value={form.contactEmail}
                onChange={(e) => set("contactEmail", e.target.value)} />
            </Field>
            <Field label="Contact Phone">
              <Input icon={Phone} type="tel" placeholder="+8801XXXXXXXXX" value={form.contactPhone}
                onChange={(e) => set("contactPhone", e.target.value)} />
            </Field>
          </div>
        </Section>

        {/* ── 11. Custom HTML Section ── */}
        <Section icon={Code} title="Custom HTML / Embed Section (Optional)" color="text-rose-500">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-sm text-amber-800 dark:text-amber-300 flex gap-2">
            <Info size={16} className="flex-shrink-0 mt-0.5" />
            <div>
              <strong>Embeds &amp; widgets.</strong> Use this to embed tournament brackets (Challonge), YouTube live stream frames, or custom interactive standings.
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">HTML Editor</span>
            <button type="button" onClick={() => setShowHtmlPreview((v) => !v)}
              className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
              {showHtmlPreview ? <><EyeOff size={13} /> Hide Preview</> : <><Eye size={13} /> Show Preview</>}
            </button>
          </div>

          <textarea
            rows={6}
            placeholder={`<!-- Example: Tournament live stream or embedded frame -->
<div style="text-align: center; padding: 20px;">
  <h3>Live Stream Arena</h3>
</div>`}
            value={form.customHtmlSection}
            onChange={(e) => set("customHtmlSection", e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-900 text-green-400 font-mono text-xs focus:ring-2 focus:ring-indigo-500 outline-none resize-y"
            spellCheck={false}
          />

          {showHtmlPreview && form.customHtmlSection && (
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-5 bg-white dark:bg-slate-800">
              <p className="text-xs text-slate-500 mb-3 font-medium uppercase tracking-wide">Preview</p>
              <div
                className="prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: form.customHtmlSection }}
              />
            </div>
          )}
        </Section>

        {/* Bottom actions */}
        <div className="flex items-center justify-between pt-2">
          <Link href="/dashboard/manage-events"
            className="px-5 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition text-sm">
            Cancel
          </Link>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPreviewModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-semibold hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition text-sm cursor-pointer shadow-2xs"
            >
              <Eye size={16} />
              <span>Preview Event</span>
            </button>
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 dark:shadow-none transition disabled:opacity-60 text-sm cursor-pointer">
              <Save size={16} />
              {saving ? (savingProgress || "Saving…") : editId ? "Update Event" : "Create Event"}
            </button>
          </div>
        </div>
      </form>

      {/* Event Live Preview Modal */}
      <EventPreviewModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        event={{
          ...form,
          coverImageUrl: form.bannerImageUrl || form.coverImageUrl,
          bannerImageUrl: form.bannerImageUrl || form.coverImageUrl,
          coverImagePosition: form.bannerImagePosition || form.coverImagePosition,
          bannerImagePosition: form.bannerImagePosition || form.coverImagePosition,
          tags,
          rewards,
          schedule,
          rules,
          contributors,
        }}
        coverFile={bannerFile || coverFile}
        bannerFile={bannerFile || coverFile}
      />

      {/* Event Image Positioner Modal */}
      <EventImagePositionModal
        isOpen={positionModalOpen}
        onClose={() => setPositionModalOpen(false)}
        imageUrl={
          bannerFile || coverFile
            ? URL.createObjectURL((bannerFile || coverFile)!)
            : form.bannerImageUrl || form.coverImageUrl || null
        }
        imageTitle="Banner"
        currentPosition={form.bannerImagePosition || form.coverImagePosition}
        eventTitle={form.title || "Event Title Preview"}
        category={form.category || "EVENT"}
        onSavePosition={(pos) => {
          set("bannerImagePosition", pos);
          set("coverImagePosition", pos);
          toast.success("Banner focal position saved!");
        }}
      />
    </div>
  );
}

export default function CreateEventPage() {
  const { isAllowed, isLoading } = useRoleGuard(["admin", "moderator", "executive"]);
  if (isLoading || !isAllowed) return null;
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading form...</div>}>
      <CreateEventFormContent />
    </Suspense>
  );
}
