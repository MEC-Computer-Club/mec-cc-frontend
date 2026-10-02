"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import {
  Search,
  X,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  User,
  ExternalLink,
  Layers,
  Code2,
  RefreshCw,
  RotateCcw,
  Pencil,
} from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

// Custom GitHub Icon
const IconGitHub = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export interface FeatureItem {
  title: string;
  desc?: string;
}

export interface Developer {
  name: string;
  role: string;
  id: string;
  department: string;
  batch: string;
  session: string;
  featuresWorkedOn: FeatureItem[];
  profileUrl: string;
  github: string;
  initials: string;
  avatarBg: string;
  photo?: string;
  isCustomAdded?: boolean;
}

interface AddContributorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newDev: Developer) => void;
  editData?: Developer | null;
  onUpdate?: (updatedDev: Developer) => void;
}

interface SelectedMember {
  name: string;
  studentId: string;
  department: string;
  batch: string;
  session: string;
  photo?: string;
  github?: string;
}

// Built-in student catalog for fast offline lookups & instant suggestions
const SAMPLE_STUDENTS = [
  {
    studentId: "210347",
    name: "Md. Nasir Ahmed",
    department: "Department of CSE",
    batch: "5th Batch",
    session: "2021-2022",
    photo: "",
    github: "https://github.com/nasir-ahmed-dev",
    role: "Lead Full-Stack Architect & Core Maintainer",
  },
  {
    studentId: "210311",
    name: "Tawhid Ahmed (Abokash)",
    department: "Department of CSE",
    batch: "5th Batch",
    session: "2021-2022",
    photo: "",
    github: "https://github.com/abokash",
    role: "Core Frontend Developer & UI/UX Architect",
  },
  {
    studentId: "220310",
    name: "Md. Fahim Hossain Abir",
    department: "Department of CSE",
    batch: "6th Batch",
    session: "2022-2023",
    photo: "",
    github: "https://github.com/fahimabir8",
    role: "Events & Operations Lead Engineer",
  },
  {
    studentId: "220355",
    name: "Salman Haider Sajib",
    department: "Department of CSE",
    batch: "6th Batch",
    session: "2022-2023",
    photo: "",
    github: "https://github.com/dashboard",
    role: "Web Administrator & Backend Engineer",
  },
  {
    studentId: "220324",
    name: "Abdullah Al Muaz",
    department: "Department of CSE",
    batch: "6th Batch",
    session: "2022-2023",
    photo: "",
    github: "https://github.com/aurkaxi",
    role: "Public Relations & Media Architect",
  },
  {
    studentId: "220142",
    name: "Fida Zaman",
    department: "Department of EEE",
    batch: "15th Batch",
    session: "2022-2023",
    photo: "",
    github: "https://github.com/fidazams",
    role: "Creative & Design Specialist",
  },
];

const SUGGESTED_ROLES = [
  "Lead Full-Stack Architect",
  "Core Frontend Developer & UI/UX Architect",
  "Backend & API Systems Engineer",
  "Core Maintainer & Security Specialist",
  "DevOps, Caching & Cloud Engineer",
];

export default function AddContributorModal({
  isOpen,
  onClose,
  onAdd,
  editData,
  onUpdate,
}: AddContributorModalProps) {
  // Search & Active Members Cache
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [dbMembers, setDbMembers] = useState<any[]>([]);

  // Selected Member (Auto-filled)
  const [selectedMember, setSelectedMember] = useState<SelectedMember | null>(null);

  // Editable Role & GitHub override
  const [role, setRole] = useState("");
  const [customGithub, setCustomGithub] = useState("");

  // Features list (Title only, no description)
  const [features, setFeatures] = useState<string[]>([
    "Platform Core Architecture",
    "Design System & UI Components",
  ]);

  const [formError, setFormError] = useState<string | null>(null);

  // Load real members from MongoDB and pre-fill if editData is provided
  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setSelectedMember({
          name: editData.name,
          studentId: editData.id,
          department: editData.department,
          batch: editData.batch,
          session: editData.session,
          photo: editData.photo,
          github: editData.github,
        });
        setRole(editData.role);
        setCustomGithub(editData.github || "");
        setFeatures(
          editData.featuresWorkedOn.map((f) => f.title).length > 0
            ? editData.featuresWorkedOn.map((f) => f.title)
            : ["Platform Core Architecture"]
        );
        setFormError(null);
      } else {
        setSearchQuery("");
        setSearchResults([]);
        setSelectedMember(null);
        setRole("");
        setCustomGithub("");
        setFeatures(["Platform Core Architecture", "Design System & UI Components"]);
        setFormError(null);
      }

      fetch(`${API_BASE_URL}/api/users/profile/active`)
        .then((r) => r.json())
        .then((d) => {
          if (d.data && Array.isArray(d.data)) {
            setDbMembers(d.data);
          }
        })
        .catch(() => {});
    }
  }, [isOpen, editData]);

  // Live Debounced Member Search
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      const results: any[] = [];

      // 1. Search in MongoDB active members
      const dbMatches = dbMembers.filter(
        (m) =>
          (m.fullName && m.fullName.toLowerCase().includes(q)) ||
          (m.studentId && m.studentId.toLowerCase().includes(q)) ||
          (m._id && m._id.toLowerCase().includes(q))
      );
      for (const m of dbMatches) {
        results.push({
          studentId: m.studentId || m._id,
          rawId: m._id,
          name: m.fullName,
          department: m.department ? `Department of ${m.department}` : "Department of CSE",
          batch: m.batch ? (m.batch.includes("Batch") ? m.batch : `${m.batch} Batch`) : "5th Batch",
          session: m.session || "2021-2022",
          photo: m.imageUrl || "",
          github: m.socialLinks?.github || "",
          role: m.customRole || m.designation || "",
        });
      }

      // 2. Search local student database
      const localMatches = SAMPLE_STUDENTS.filter(
        (s) =>
          (s.studentId.toLowerCase().includes(q) ||
            s.name.toLowerCase().includes(q)) &&
          !results.some((r) => r.name.toLowerCase() === s.name.toLowerCase())
      );
      results.push(...localMatches);

      // 3. Search direct backend profile endpoint if querying an exact ID
      if (q.length >= 3) {
        try {
          const res = await fetch(
            `${API_BASE_URL}/api/users/profile/${encodeURIComponent(q)}`
          );
          if (res.ok) {
            const json = await res.json();
            if (json.data && !results.some((r) => r.name === json.data.fullName)) {
              results.unshift({
                studentId: json.data.studentId || json.data._id,
                rawId: json.data._id,
                name: json.data.fullName,
                department: json.data.department ? `Department of ${json.data.department}` : "Department of CSE",
                batch: json.data.batch ? (json.data.batch.includes("Batch") ? json.data.batch : `${json.data.batch} Batch`) : "5th Batch",
                session: json.data.session || "2021-2022",
                photo: json.data.imageUrl || "",
                github: json.data.socialLinks?.github || "",
                role: json.data.customRole || json.data.designation || "",
              });
            }
          }
        } catch {
          // Backend offline or error
        }
      }

      setSearchResults(results);
      setIsSearching(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery, dbMembers]);

  // Handle selecting a member from search
  const handleSelectMember = async (member: any) => {
    setIsSearching(true);
    let finalMember = member;

    // Fetch full profile from MongoDB to ensure studentId & socials are loaded
    if (member.rawId || member.studentId) {
      try {
        const lookupKey = member.rawId || member.studentId;
        const res = await fetch(
          `${API_BASE_URL}/api/users/profile/${encodeURIComponent(lookupKey)}`
        );
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            finalMember = {
              name: json.data.fullName || member.name,
              studentId: json.data.studentId || member.studentId,
              department: json.data.department ? `Department of ${json.data.department}` : member.department,
              batch: json.data.batch ? (json.data.batch.includes("Batch") ? json.data.batch : `${json.data.batch} Batch`) : member.batch,
              session: json.data.session || member.session,
              photo: json.data.imageUrl || member.photo,
              github: json.data.socialLinks?.github || member.github || "",
              role: json.data.customRole || json.data.designation || member.role || "",
            };
          }
        }
      } catch {
        // fallback to existing object
      }
    }

    setSelectedMember({
      name: finalMember.name,
      studentId: finalMember.studentId,
      department: finalMember.department || "Department of CSE",
      batch: finalMember.batch || "5th Batch",
      session: finalMember.session || "2021-2022",
      photo: finalMember.photo || undefined,
      github: finalMember.github || "",
    });

    if (finalMember.github) {
      setCustomGithub(finalMember.github);
    }
    if (finalMember.role && !role) {
      setRole(finalMember.role);
    }

    setSearchResults([]);
    setSearchQuery("");
    setIsSearching(false);
  };

  // Feature List Helpers (Title only)
  const handleAddFeature = () => {
    setFeatures([...features, ""]);
  };

  const handleRemoveFeature = (index: number) => {
    if (features.length <= 1) return;
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleFeatureChange = (index: number, val: string) => {
    const updated = [...features];
    updated[index] = val;
    setFeatures(updated);
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!selectedMember) {
      setFormError("Please search and select a member first.");
      return;
    }

    if (!role.trim()) {
      setFormError("Please assign a Developer Role title.");
      return;
    }

    const validFeatures = features
      .map((f) => f.trim())
      .filter((f) => f.length > 0)
      .map((title) => ({ title, desc: "" }));

    if (validFeatures.length === 0) {
      setFormError("Please add at least one feature worked on.");
      return;
    }

    // Generate initials & gradient avatar
    const initials = selectedMember.name
      .trim()
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    const avatarGradients = [
      "from-cyan-500 via-blue-500 to-indigo-600",
      "from-purple-500 via-violet-500 to-fuchsia-600",
      "from-emerald-500 via-teal-500 to-cyan-600",
      "from-amber-500 via-orange-500 to-rose-600",
    ];
    const randomBg =
      avatarGradients[Math.floor(Math.random() * avatarGradients.length)];

    const newDev: Developer = {
      name: selectedMember.name.trim(),
      role: role.trim(),
      id: selectedMember.studentId.trim(),
      department: selectedMember.department.trim(),
      batch: selectedMember.batch.trim(),
      session: selectedMember.session.trim(),
      featuresWorkedOn: validFeatures,
      profileUrl: `/profile/${selectedMember.studentId.trim()}`,
      github: customGithub.trim() || selectedMember.github || "",
      initials: initials || (editData ? editData.initials : "DEV"),
      avatarBg: editData ? editData.avatarBg : randomBg,
      photo: selectedMember.photo || undefined,
      isCustomAdded: editData ? editData.isCustomAdded : true,
    };

    if (editData && onUpdate) {
      onUpdate(newDev);
    } else {
      onAdd(newDev);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-surface-elevated border-2 border-border-brutalist dark:border-border-default rounded-xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Premium Modal Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-brutalist dark:border-border-default bg-surface-secondary/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-mono font-bold text-sm shadow-xs">
              {editData ? <Pencil size={15} /> : <Plus size={16} />}
            </div>
            <div>
              <h2 className="text-base font-black font-heading tracking-tight text-text-primary">
                {editData ? "Edit Platform Contributor" : "Add Platform Contributor"}
              </h2>
              <p className="text-[11px] font-mono text-text-tertiary">
                {editData
                  ? "Update contributor role and platform contributions"
                  : "Search member and assign platform contributions"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md border border-border-default hover:bg-surface-secondary text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Modal Form Body ── */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {formError && (
            <div className="p-3 rounded-md bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 font-mono text-xs flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              STEP 1: Member Search & Auto-Filled Identity Card
              ══════════════════════════════════════════════════════════ */}
          <div>
            {!selectedMember ? (
              <div className="space-y-2">
                <label className="font-mono text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
                  <Search size={14} className="text-accent-primary" />
                  <span>Search Member by Name or Student ID</span>
                </label>

                <div className="relative">
                  <input
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Type Student ID (e.g. 210347) or Name..."
                    className="w-full h-11 px-4 pr-10 rounded-md bg-surface-elevated border-2 border-border-default focus:border-black dark:focus:border-white text-text-primary font-mono text-xs outline-none transition-all shadow-xs"
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-tertiary">
                    {isSearching ? (
                      <RefreshCw size={14} className="animate-spin text-accent-primary" />
                    ) : (
                      <Search size={14} />
                    )}
                  </div>

                  {/* Search Results Dropdown */}
                  {searchResults.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1.5 z-30 bg-surface-elevated border-2 border-border-brutalist dark:border-border-default rounded-md shadow-xl overflow-hidden max-h-56 overflow-y-auto">
                      <div className="p-2 border-b border-border-default text-[10px] font-mono text-text-tertiary uppercase">
                        Select Member to Auto-Fill:
                      </div>
                      {searchResults.map((member, i) => (
                        <button
                          type="button"
                          key={i}
                          onClick={() => handleSelectMember(member)}
                          className="w-full px-3.5 py-2.5 flex items-center justify-between hover:bg-surface-secondary text-left transition-colors cursor-pointer border-b border-border-default/40 last:border-b-0"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-md bg-surface-secondary border border-border-default flex items-center justify-center font-bold text-xs text-text-primary shrink-0 overflow-hidden relative">
                              {member.photo ? (
                                <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                              ) : (
                                member.name.charAt(0)
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-xs text-text-primary font-heading">
                                {member.name}
                              </div>
                              <div className="font-mono text-[10px] text-text-tertiary">
                                ID: {member.studentId} • {member.department}
                              </div>
                            </div>
                          </div>
                          <span className="font-mono text-[10px] font-bold text-accent-text-on-surface dark:text-accent-primary bg-accent-primary-light/40 px-2 py-0.5 rounded-md">
                            Select ↵
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* ── Verified Auto-Filled Identity Card ── */
              <div className="p-3.5 rounded-md bg-surface-secondary/50 border-2 border-border-brutalist dark:border-border-default flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-md bg-surface-secondary border border-border-brutalist dark:border-border-default shrink-0 overflow-hidden relative shadow-xs flex items-center justify-center">
                    {selectedMember.photo ? (
                      <img
                        src={selectedMember.photo}
                        alt={selectedMember.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-heading font-black text-base flex items-center justify-center">
                        {selectedMember.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-text-primary truncate">
                        {selectedMember.name}
                      </span>
                      <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px] text-text-tertiary mt-0.5">
                      <span className="font-bold text-text-primary bg-surface-elevated px-1.5 py-0.5 rounded-md border border-border-default">
                        ID: {selectedMember.studentId}
                      </span>
                      <span>{selectedMember.department}</span>
                      <span>•</span>
                      <span>{selectedMember.batch}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedMember(null)}
                  className="px-2.5 py-1 rounded-md border border-border-default hover:bg-surface-elevated font-mono text-[10px] font-bold text-text-secondary hover:text-text-primary transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                >
                  <RotateCcw size={11} />
                  <span>Change</span>
                </button>
              </div>
            )}
          </div>

          {/* ══════════════════════════════════════════════════════════
              STEP 2: Developer Role Title
              ══════════════════════════════════════════════════════════ */}
          <div>
            <label className="block font-mono text-xs font-bold uppercase tracking-wider text-text-primary mb-1.5 flex items-center gap-1.5">
              <Code2 size={14} className="text-accent-primary" />
              <span>Developer Role Title *</span>
            </label>
            <input
              type="text"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Lead Full-Stack Architect & Core Maintainer"
              className="w-full h-10 px-3.5 rounded-md bg-surface-elevated border-2 border-border-default focus:border-black dark:focus:border-white font-sans text-xs text-text-primary outline-none transition-colors mb-2 shadow-xs"
            />
            {/* Quick Role Suggestions */}
            <div className="flex flex-wrap items-center gap-1">
              {SUGGESTED_ROLES.map((r, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setRole(r)}
                  className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-surface-secondary hover:bg-surface-elevated border border-border-default text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════
              STEP 3: Features Worked On (Title Only)
              ══════════════════════════════════════════════════════════ */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-mono text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
                <Layers size={14} className="text-accent-primary" />
                <span>Features Worked On *</span>
              </label>
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-2.5 py-1 rounded-md bg-surface-secondary hover:bg-surface-elevated border border-border-default font-mono text-[11px] font-bold text-text-primary flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
              >
                <Plus size={12} />
                <span>Add Feature</span>
              </button>
            </div>

            <div className="space-y-2">
              {features.map((featTitle, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-accent-primary-light text-accent-primary-text font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                    {index + 1}
                  </div>
                  <input
                    type="text"
                    required
                    value={featTitle}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder="Feature name (e.g. Competitive Programming Hub)"
                    className="flex-1 h-9 px-3 rounded-md bg-surface-elevated border border-border-default focus:border-black dark:focus:border-white font-sans text-xs text-text-primary outline-none transition-colors"
                  />
                  {features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(index)}
                      className="p-1.5 text-text-tertiary hover:text-red-500 rounded-md transition-colors cursor-pointer"
                      title="Remove feature"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════
              Optional GitHub override (only if not in profile)
              ══════════════════════════════════════════════════════════ */}
          <div>
            <label className="block font-mono text-[11px] font-bold text-text-secondary mb-1">
              GitHub Profile Link (Optional)
            </label>
            <div className="flex items-center gap-2">
              <span className="p-2.5 rounded-md bg-surface-secondary border border-border-default text-text-secondary shrink-0">
                <IconGitHub className="w-4 h-4" />
              </span>
              <input
                type="url"
                value={customGithub}
                onChange={(e) => setCustomGithub(e.target.value)}
                placeholder="https://github.com/username"
                className="flex-1 h-10 px-3 rounded-md bg-surface-elevated border border-border-default focus:border-black dark:focus:border-white font-mono text-xs text-text-primary outline-none transition-colors"
              />
            </div>
          </div>

          {/* ── Modal Footer ── */}
          <div className="pt-4 border-t border-border-default flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={!selectedMember}
              icon={editData ? <CheckCircle2 size={14} /> : <Plus size={14} />}
            >
              {editData ? "Save Changes" : "Publish Contributor Card"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
