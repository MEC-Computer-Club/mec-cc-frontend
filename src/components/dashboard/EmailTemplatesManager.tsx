"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";
import FilterSelect, { FilterOption } from "@/app/dashboard/components/FilterSelect";
import { Select } from "@/components/ui/Select";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import toast from "react-hot-toast";
import {
  Mail,
  Send,
  Save,
  RefreshCw,
  Eye,
  Code,
  Copy,
  Check,
  Trash2,
  Sparkles,
  Loader2,
  X,
  Plus,
  Smartphone,
  Monitor,
  Search,
  PenTool,
  SlidersHorizontal,
  Image as ImageIcon,
  RotateCcw,
} from "lucide-react";

export interface EmailTemplateItem {
  key: string;
  title: string;
  category:
    | "authentication"
    | "membership"
    | "invitations"
    | "events"
    | "sponsors"
    | "collaborations"
    | "contact"
    | "administrative"
    | "custom";
  description: string;
  defaultSubject: string;
  subject: string;
  html: string;
  isCustomized: boolean;
  isCustomCreated?: boolean;
  variables: { name: string; description: string; sample: string }[];
}

export interface EmailTemplatesManagerProps {
  currentUser: any;
  isAdmin: boolean;
}

// Helper to extract body content inside <td class="content-padding">...</td>
function extractBodyHtml(fullHtml: string): string {
  if (!fullHtml) return "";
  const match = fullHtml.match(/<td class="content-padding"[^>]*>([\s\S]*?)<\/td>/i);
  if (match && match[1]) {
    return match[1].trim();
  }
  return fullHtml;
}

// Helper to inject updated body back into full template shell
function injectBodyHtml(fullHtml: string, newBody: string): string {
  if (!fullHtml) return newBody;
  if (fullHtml.includes('class="content-padding"')) {
    return fullHtml.replace(
      /(<td class="content-padding"[^>]*>)([\s\S]*?)(<\/td>)/i,
      `$1\n${newBody}\n$3`
    );
  }
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #f3f4f6; margin: 0; padding: 20px; }
      .card { background: #fff; max-width: 600px; margin: 0 auto; border-radius: 12px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
      .header-text { font-size: 24px; font-weight: 700; color: #002e5b; margin: 0 0 16px; }
      .body-text { font-size: 15px; line-height: 1.6; color: #4b5563; }
      .btn-primary { display: inline-block; padding: 12px 28px; background-color: #f58a1f; color: #002e5b !important; text-decoration: none; font-weight: 700; border-radius: 6px; margin: 20px 0; }
    </style>
  </head>
  <body>
    <div class="card">
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td class="content-padding">
            ${newBody}
          </td>
        </tr>
      </table>
    </div>
  </body>
</html>`;
}

// Helper to substitute dynamic tokens with sample values for live preview
function replaceTokensWithSampleData(
  content: string,
  variables: { name: string; sample: string }[] = []
): string {
  if (!content) return "";
  let result = content;
  variables.forEach((v) => {
    if (v.name && v.sample) {
      const regex = new RegExp(`{{\\s*${v.name}\\s*}}`, "g");
      result = result.replace(regex, v.sample);
    }
  });

  // Fallback substitutions for common variables
  result = result
    .replace(/{{\\s*clubName\\s*}}/g, "MEC Computer Club")
    .replace(/{{\\s*userName\\s*}}/g, "Md. Nasir Ahmed")
    .replace(/{{\\s*code\\s*}}/g, "849201")
    .replace(/{{\\s*link\\s*}}/g, "https://meccomputerclub.org")
    .replace(/{{\\s*dashboardLink\\s*}}/g, "https://meccomputerclub.org/dashboard")
    .replace(/{{\\s*contactLink\\s*}}/g, "https://meccomputerclub.org/contact-us")
    .replace(/{{\\s*eventName\\s*}}/g, "MEC Intra-College Code Fest 2026")
    .replace(/{{\\s*eventDate\\s*}}/g, "March 28, 2026 at 10:00 AM")
    .replace(/{{\\s*eventVenue\\s*}}/g, "Auditorium & CSE Lab 301")
    .replace(/{{\\s*roleTitle\\s*}}/g, "Head of Tech & Web Operations")
    .replace(/{{\\s*sponsorName\\s*}}/g, "TechCorp Bangladesh")
    .replace(/{{\\s*organizationName\\s*}}/g, "TechCorp Solutions")
    .replace(/{{\\s*tierName\\s*}}/g, "Platinum Title Sponsor");

  return result;
}

const CATEGORY_NAMES: Record<string, string> = {
  all: "All Categories",
  authentication: "Authentication",
  membership: "Membership",
  invitations: "Invitations",
  events: "Events & Contests",
  sponsors: "Sponsors & Faculty",
  collaborations: "Collaborations",
  contact: "Contact Replies",
  administrative: "Administrative",
  custom: "Custom Templates",
};

const CATEGORY_COLORS: Record<string, string> = {
  authentication: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  membership: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  invitations: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  events: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  sponsors: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  collaborations: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
  contact: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  administrative: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
  custom: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
};

export default function EmailTemplatesManager({ currentUser, isAdmin }: EmailTemplatesManagerProps) {
  const [templates, setTemplates] = useState<EmailTemplateItem[]>([]);
  const [selectedKey, setSelectedKey] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  // Editor mode: "preview" (In-Place Live Preview Studio) | "code" (raw HTML)
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [useSampleData, setUseSampleData] = useState<boolean>(false);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Edit buffer
  const [editSubject, setEditSubject] = useState("");
  const [editHtml, setEditHtml] = useState("");
  const [editBodyHtml, setEditBodyHtml] = useState("");
  const [copiedVar, setCopiedVar] = useState<string | null>(null);

  // Test send modal
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [testEmail, setTestEmail] = useState(currentUser?.email || "");
  const [sendingTest, setSendingTest] = useState(false);

  // Add new template modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newKey, setNewKey] = useState("");
  const [newCategory, setNewCategory] = useState("events");
  const [newSubject, setNewSubject] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newBody, setNewBody] = useState("<p>Write your message body here...</p>");
  const [newCtaText, setNewCtaText] = useState("");
  const [newCtaUrl, setNewCtaUrl] = useState("");
  const [creating, setCreating] = useState(false);

  // Delete modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Global Branding Settings (Header Banner & Footer)
  const [isBrandingModalOpen, setIsBrandingModalOpen] = useState(false);
  const [savingBranding, setSavingBranding] = useState(false);
  const [branding, setBranding] = useState({
    bannerUrl: "https://res.cloudinary.com/dj1sjgitq/image/upload/v1768389923/uploads/club_logo/email_banner_lxbsq9.png",
    clubName: "MEC Computer Club",
    institutionName: "Mymensingh Engineering College",
    footerAddress: "Mymensingh Engineering College, Mymensingh-2200",
    footerNote: "Official Notification System • Automated notification, please do not reply directly.",
    websiteUrl: "https://www.meccomputerclub.org/",
    contactUrl: "https://www.meccomputerclub.org/contact-us",
  });

  const fetchBranding = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/email-templates/branding/settings`, { withCredentials: true });
      if (res.data?.success && res.data.data) {
        setBranding((prev) => ({ ...prev, ...res.data.data }));
      }
    } catch {
      // Default branding remains active
    }
  }, []);

  useEffect(() => {
    fetchBranding();
  }, [fetchBranding]);

  const handleSaveBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingBranding(true);
    try {
      const res = await axios.put(
        `${API_BASE_URL}/api/email-templates/branding/settings`,
        branding,
        { withCredentials: true }
      );
      if (res.data?.success) {
        toast.success("Global email header & footer branding saved successfully!");
        setIsBrandingModalOpen(false);
        fetchTemplates();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update branding settings");
    } finally {
      setSavingBranding(false);
    }
  };

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/email-templates`, { withCredentials: true });
      if (res.data?.success && Array.isArray(res.data.data)) {
        setTemplates(res.data.data);
        if (res.data.data.length > 0 && !selectedKey) {
          const first = res.data.data[0];
          setSelectedKey(first.key);
          setEditSubject(first.subject);
          setEditHtml(first.html);
          setEditBodyHtml(extractBodyHtml(first.html));
        }
      }
    } catch {
      toast.error("Failed to load email templates catalog");
    } finally {
      setLoading(false);
    }
  }, [selectedKey]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const currentTemplate = useMemo(() => {
    return templates.find((t) => t.key === selectedKey) || templates[0];
  }, [templates, selectedKey]);

  const handleSelectTemplate = (item: EmailTemplateItem) => {
    setSelectedKey(item.key);
    setEditSubject(item.subject);
    setEditHtml(item.html);
    setEditBodyHtml(extractBodyHtml(item.html));
  };

  // Body change in RichTextEditor
  const handleBodyChange = (newBodyContent: string) => {
    setEditBodyHtml(newBodyContent);
    setEditHtml((prev) => injectBodyHtml(prev, newBodyContent));
  };

  // Switching view modes
  const handleSwitchMode = (mode: "preview" | "code") => {
    if (mode === "preview") {
      setEditBodyHtml(extractBodyHtml(editHtml));
    }
    setViewMode(mode);
  };

  // Insert token chip into body editor
  const handleInsertToken = (tokenName: string) => {
    const tokenTag = `{{${tokenName}}}`;
    const updated = editBodyHtml
      ? `${editBodyHtml} ${tokenTag}`
      : `<p>${tokenTag}</p>`;
    setEditBodyHtml(updated);
    setEditHtml((prev) => injectBodyHtml(prev, updated));
    navigator.clipboard.writeText(tokenTag);
    toast.success(`Inserted ${tokenTag} into email body & copied to clipboard!`);
  };

  const handleCopyVar = (varName: string) => {
    navigator.clipboard.writeText(`{{${varName}}}`);
    setCopiedVar(varName);
    toast.success(`Copied {{${varName}}} to clipboard`);
    setTimeout(() => setCopiedVar(null), 2000);
  };

  const handleSaveTemplate = async () => {
    if (!currentTemplate) return;
    setSaving(true);
    try {
      await axios.put(
        `${API_BASE_URL}/api/email-templates/${currentTemplate.key}`,
        {
          html: editHtml,
          subject: editSubject,
        },
        { withCredentials: true }
      );
      toast.success(`Template "${currentTemplate.title}" saved successfully!`);
      setTemplates((prev) =>
        prev.map((t) =>
          t.key === currentTemplate.key
            ? { ...t, html: editHtml, subject: editSubject, isCustomized: true }
            : t
        )
      );
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save template");
    } finally {
      setSaving(false);
    }
  };

  const handleResetTemplate = async () => {
    if (!currentTemplate) return;
    if (
      !window.confirm(
        `Reset "${currentTemplate.title}" to its code default? Any custom changes will be lost.`
      )
    ) {
      return;
    }
    setSaving(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/email-templates/${currentTemplate.key}/reset`,
        {},
        { withCredentials: true }
      );
      const defaultHtml = res.data?.html || "";
      setEditHtml(defaultHtml);
      setEditBodyHtml(extractBodyHtml(defaultHtml));
      setEditSubject(currentTemplate.defaultSubject);
      setTemplates((prev) =>
        prev.map((t) =>
          t.key === currentTemplate.key
            ? {
                ...t,
                html: defaultHtml,
                subject: currentTemplate.defaultSubject,
                isCustomized: false,
              }
            : t
        )
      );
      toast.success("Template reset to original default");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to reset template");
    } finally {
      setSaving(false);
    }
  };

  // Create custom template
  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error("Please enter a template title");
      return;
    }

    setCreating(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/email-templates`,
        {
          title: newTitle.trim(),
          key: newKey.trim() || undefined,
          category: newCategory,
          subject: newSubject.trim() || undefined,
          description: newDescription.trim() || undefined,
          bodyHtml: newBody,
          ctaText: newCtaText.trim() || undefined,
          ctaUrl: newCtaUrl.trim() || undefined,
        },
        { withCredentials: true }
      );

      if (res.data?.success && res.data.data) {
        const created: EmailTemplateItem = res.data.data;
        toast.success(`Template "${created.title}" created successfully!`);
        setTemplates((prev) => [created, ...prev]);
        setSelectedKey(created.key);
        setEditSubject(created.subject);
        setEditHtml(created.html);
        setEditBodyHtml(extractBodyHtml(created.html));
        setIsAddModalOpen(false);

        // Reset form
        setNewTitle("");
        setNewKey("");
        setNewCategory("events");
        setNewSubject("");
        setNewDescription("");
        setNewBody("<p>Write your message body here...</p>");
        setNewCtaText("");
        setNewCtaUrl("");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create template");
    } finally {
      setCreating(false);
    }
  };

  // Delete custom template
  const handleDeleteTemplate = async () => {
    if (!currentTemplate || !currentTemplate.isCustomCreated) return;
    setDeleting(true);
    try {
      await axios.delete(`${API_BASE_URL}/api/email-templates/${currentTemplate.key}`, {
        withCredentials: true,
      });
      toast.success(`Template "${currentTemplate.title}" deleted successfully`);
      const remaining = templates.filter((t) => t.key !== currentTemplate.key);
      setTemplates(remaining);
      if (remaining.length > 0) {
        const next = remaining[0];
        setSelectedKey(next.key);
        setEditSubject(next.subject);
        setEditHtml(next.html);
        setEditBodyHtml(extractBodyHtml(next.html));
      }
      setIsDeleteModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete template");
    } finally {
      setDeleting(false);
    }
  };

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail || !testEmail.includes("@")) {
      toast.error("Please enter a valid recipient email");
      return;
    }
    setSendingTest(true);
    try {
      await axios.post(
        `${API_BASE_URL}/api/email-templates/test-send`,
        {
          key: currentTemplate?.key,
          recipientEmail: testEmail,
          html: editHtml,
          subject: editSubject,
        },
        { withCredentials: true }
      );
      toast.success(`Test email sent to ${testEmail}! Check your inbox.`);
      setIsTestModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send test email");
    } finally {
      setSendingTest(false);
    }
  };

  // Category filter options for FilterSelect
  const categoryFilterOptions: FilterOption[] = useMemo(() => {
    const counts: Record<string, number> = { all: templates.length };
    templates.forEach((t) => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });

    const orderedKeys = [
      "all",
      "authentication",
      "membership",
      "invitations",
      "events",
      "sponsors",
      "collaborations",
      "contact",
      "administrative",
      "custom",
    ];

    return orderedKeys
      .map((key) => ({
        value: key,
        label: CATEGORY_NAMES[key] || key,
        count: counts[key] || 0,
      }))
      .filter((opt) => opt.value === "all" || opt.count > 0);
  }, [templates]);

  // Filtered list
  const filteredTemplates = useMemo(() => {
    return templates.filter((tpl) => {
      const matchesCategory = categoryFilter === "all" || tpl.category === categoryFilter;
      const matchesSearch =
        !searchQuery.trim() ||
        tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tpl.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tpl.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [templates, categoryFilter, searchQuery]);

  // Render preview document with or without token replacement
  const previewHtmlDoc = useMemo(() => {
    if (!useSampleData || !currentTemplate) {
      return editHtml;
    }
    return replaceTokensWithSampleData(editHtml, currentTemplate.variables);
  }, [editHtml, useSampleData, currentTemplate]);

  // Render preview body content with token replacement for in-place preview
  const previewHtmlBody = useMemo(() => {
    if (!useSampleData || !currentTemplate) {
      return editBodyHtml;
    }
    return replaceTokensWithSampleData(editBodyHtml, currentTemplate.variables);
  }, [editBodyHtml, useSampleData, currentTemplate]);

  if (loading) {
    return (
      <div className="py-24 text-center bg-surface-elevated rounded-2xl border-2 border-border-brutalist dark:border-border-default shadow-[4px_4px_0px_0px_var(--border-brutalist)]">
        <Loader2 className="w-8 h-8 animate-spin text-accent-primary mx-auto mb-2" />
        <p className="text-xs text-text-secondary font-semibold">
          Loading email templates catalog…
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* ── Left Sidebar: Template Catalog ── */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-surface-elevated rounded-2xl border-2 border-border-brutalist dark:border-border-default p-4 shadow-[4px_4px_0px_0px_var(--border-brutalist)] space-y-3">
          {/* Header & Add Button */}
          <div className="flex items-center justify-between border-b border-border-default pb-3">
            <div>
              <h3 className="text-sm font-black text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                <Mail size={15} className="text-accent-primary" />
                Templates Catalog
              </h3>
              <span className="text-[11px] font-mono text-text-tertiary">
                {filteredTemplates.length} of {templates.length} available
              </span>
            </div>

            {isAdmin && (
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-accent-primary text-text-primary text-xs font-bold border border-border-brutalist shadow-[2px_2px_0px_0px_var(--border-brutalist)] hover:opacity-95 transition cursor-pointer"
                title="Create new template"
              >
                <Plus size={13} />
                <span>New</span>
              </button>
            )}
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates by title or key..."
              className="w-full pl-8 pr-3 py-1.5 bg-surface-secondary border border-border-default rounded-xl text-xs text-text-primary focus:outline-none focus:border-accent-primary"
            />
          </div>

          {/* Category FilterSelect */}
          <div className="w-full">
            <FilterSelect
              value={categoryFilter}
              onChange={(val) => setCategoryFilter(val)}
              options={categoryFilterOptions}
              placeholder="Filter by category..."
              className="w-full"
              buttonClassName="w-full justify-between"
            />
          </div>

          {/* Templates List */}
          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-8 text-xs text-text-tertiary">
                No templates match your search filter.
              </div>
            ) : (
              filteredTemplates.map((tpl) => {
                const isSelected = tpl.key === currentTemplate?.key;
                const categoryBadgeColor =
                  CATEGORY_COLORS[tpl.category] || CATEGORY_COLORS.administrative;

                return (
                  <button
                    key={tpl.key}
                    type="button"
                    onClick={() => handleSelectTemplate(tpl)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-accent-primary/10 border-accent-primary shadow-[2px_2px_0px_0px_var(--border-brutalist)]"
                        : "bg-surface-secondary/40 border-border-default hover:bg-surface-secondary"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1.5 mb-1">
                      <span className="text-xs font-bold text-text-primary truncate">
                        {tpl.title}
                      </span>
                      {tpl.isCustomCreated ? (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/30 shrink-0">
                          Custom
                        </span>
                      ) : tpl.isCustomized ? (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 shrink-0">
                          Modified
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-surface-elevated text-text-tertiary border border-border-default shrink-0">
                          Default
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-text-tertiary line-clamp-2 leading-relaxed mb-2">
                      {tpl.description}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-text-tertiary font-mono">
                      <span
                        className={`px-1.5 py-0.5 rounded border uppercase text-[9px] font-bold ${categoryBadgeColor}`}
                      >
                        {CATEGORY_NAMES[tpl.category] || tpl.category}
                      </span>
                      <span>{tpl.key}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Dynamic Tokens Cheat Sheet */}
        {currentTemplate && (
          <div className="bg-surface-elevated rounded-2xl border-2 border-border-brutalist dark:border-border-default p-4 shadow-[4px_4px_0px_0px_var(--border-brutalist)]">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={13} className="text-accent-primary" />
                Available Dynamic Tokens
              </h4>
              <span className="text-[10px] text-text-tertiary">Click to insert / copy</span>
            </div>

            <p className="text-[11px] text-text-tertiary mb-3 leading-relaxed">
              Click any token below to insert it into your editor or copy to clipboard:
            </p>

            <div className="flex flex-wrap gap-1.5">
              {currentTemplate.variables.map((v) => (
                <button
                  key={v.name}
                  type="button"
                  onClick={() => handleInsertToken(v.name)}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-surface-secondary hover:bg-accent-primary/20 text-text-primary border border-border-default font-mono text-[10px] font-bold transition cursor-pointer"
                  title={`${v.description} (e.g. ${v.sample}) — Click to insert into body`}
                >
                  <span>&#123;&#123;{v.name}&#125;&#125;</span>
                  {copiedVar === v.name ? (
                    <Check size={11} className="text-emerald-500" />
                  ) : (
                    <Plus size={10} className="text-text-tertiary" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Right Content: Template Customizer & Live Preview ── */}
      <div className="lg:col-span-8 space-y-4">
        {currentTemplate && (
          <div className="bg-surface-elevated rounded-2xl border-2 border-border-brutalist dark:border-border-default p-5 shadow-[4px_4px_0px_0px_var(--border-brutalist)] flex flex-col justify-between">
            {/* Header with Title and Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-default pb-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-text-primary">
                    {currentTemplate.title}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
                      CATEGORY_COLORS[currentTemplate.category] || CATEGORY_COLORS.administrative
                    }`}
                  >
                    {CATEGORY_NAMES[currentTemplate.category] || currentTemplate.category}
                  </span>
                </div>
                <p className="text-xs text-text-secondary mt-0.5">
                  {currentTemplate.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => setIsBrandingModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-secondary hover:bg-surface-elevated text-text-secondary hover:text-text-primary border border-border-default text-xs font-bold transition cursor-pointer"
                    title="Customize Header Banner Image & Footer Details"
                  >
                    <SlidersHorizontal size={13} className="text-accent-primary" />
                    Header &amp; Footer
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsTestModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-secondary hover:bg-surface-elevated text-text-secondary hover:text-text-primary border border-border-default text-xs font-bold transition cursor-pointer"
                >
                  <Send size={13} />
                  Send Test
                </button>

                {isAdmin && currentTemplate.isCustomCreated && (
                  <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10 text-xs font-bold transition cursor-pointer"
                    title="Delete custom template"
                  >
                    <Trash2 size={12} />
                    Delete
                  </button>
                )}

                {isAdmin && currentTemplate.isCustomized && !currentTemplate.isCustomCreated && (
                  <button
                    type="button"
                    onClick={handleResetTemplate}
                    disabled={saving}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-border-default text-text-secondary hover:text-text-primary text-xs font-bold transition cursor-pointer"
                    title="Restore code default"
                  >
                    <RefreshCw size={12} />
                    Reset
                  </button>
                )}

                {isAdmin ? (
                  <button
                    type="button"
                    onClick={handleSaveTemplate}
                    disabled={saving}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-accent-primary text-text-primary font-bold text-xs border border-border-brutalist shadow-[2px_2px_0px_0px_var(--border-brutalist)] hover:opacity-95 disabled:opacity-50 cursor-pointer"
                  >
                    {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                    Save Template
                  </button>
                ) : (
                  <span className="text-[11px] font-bold text-text-secondary px-2.5 py-1 bg-surface-secondary rounded-lg border border-border-default">
                    View Only
                  </span>
                )}
              </div>
            </div>

            {/* Subject Line Input */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-text-secondary mb-1">
                Email Subject Line
              </label>
              <input
                type="text"
                value={editSubject}
                onChange={(e) => setEditSubject(e.target.value)}
                className="w-full px-3.5 py-2 bg-surface-secondary border border-border-default rounded-xl text-xs text-text-primary font-semibold focus:outline-none focus:border-accent-primary"
                placeholder="e.g. Welcome to MEC Computer Club!"
              />
            </div>

            {/* View Mode Toolbar: Live Preview & Editor vs HTML Source */}
            <div className="flex items-center justify-between border-b border-border-default/60 pb-2.5 mb-3 flex-wrap gap-2">
              <div className="flex items-center p-1 bg-surface-secondary border border-border-default rounded-xl gap-0.5">
                <button
                  type="button"
                  onClick={() => handleSwitchMode("preview")}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    viewMode === "preview"
                      ? "bg-accent-primary text-text-primary shadow-xs"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  <Eye size={13} />
                  Live Preview &amp; Editor
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchMode("code")}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    viewMode === "code"
                      ? "bg-accent-primary text-text-primary shadow-xs"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  <Code size={13} />
                  HTML Source
                </button>
              </div>

              {viewMode === "preview" && (
                <span className="text-[11px] font-mono text-text-tertiary">
                  In-Place Live Preview Studio
                </span>
              )}

              {viewMode === "code" && (
                <span className="text-[11px] font-mono text-text-tertiary">
                  Complete HTML5 Email Document
                </span>
              )}
            </div>

            {/* Editor Workspace */}
            <div className="border border-border-default rounded-2xl overflow-hidden bg-slate-950/5 min-h-[500px]">
              {viewMode === "preview" ? (
                <div className="p-3 sm:p-4 bg-surface-primary">
                  <RichTextEditor
                    value={editBodyHtml}
                    onChange={handleBodyChange}
                    variant="email-canvas"
                    minHeight="320px"
                    placeholder="Click directly into the email card body to type and style your message in-place..."
                    emailMetadata={{
                      bannerUrl: branding.bannerUrl,
                      clubName: branding.clubName,
                      footerAddress: branding.footerAddress,
                      footerNote: branding.footerNote,
                      previewDevice,
                      useSampleData,
                      sampleDataHtml: previewHtmlBody,
                      quickTokens: currentTemplate.variables,
                      extraControls: (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setUseSampleData(!useSampleData)}
                            className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                              useSampleData
                                ? "bg-accent-primary text-text-primary border-border-brutalist shadow-[1px_1px_0px_0px_var(--border-brutalist)] font-bold"
                                : "bg-surface-elevated text-text-secondary hover:text-text-primary border-border-default"
                            }`}
                            title="Toggle rendering with mock sample values vs raw editable {{tokens}}"
                          >
                            {useSampleData ? "Mock Data: ON" : "Mock Data: OFF (Edit)"}
                          </button>

                          <div className="flex items-center p-0.5 bg-surface-secondary border border-border-default rounded-lg">
                            <button
                              type="button"
                              onClick={() => setPreviewDevice("desktop")}
                              className={`p-1 rounded cursor-pointer ${
                                previewDevice === "desktop"
                                  ? "bg-surface-elevated text-text-primary shadow-xs font-bold"
                                  : "text-text-tertiary hover:text-text-primary"
                              }`}
                              title="Desktop preview (600px)"
                            >
                              <Monitor size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => setPreviewDevice("mobile")}
                              className={`p-1 rounded cursor-pointer ${
                                previewDevice === "mobile"
                                  ? "bg-surface-elevated text-text-primary shadow-xs font-bold"
                                  : "text-text-tertiary hover:text-text-primary"
                              }`}
                              title="Mobile preview (375px)"
                            >
                              <Smartphone size={14} />
                            </button>
                          </div>
                        </div>
                      ),
                    }}
                  />
                </div>
              ) : (
                <div className="p-3">
                  <textarea
                    rows={24}
                    value={editHtml}
                    onChange={(e) => {
                      setEditHtml(e.target.value);
                      setEditBodyHtml(extractBodyHtml(e.target.value));
                    }}
                    className="w-full font-mono text-xs p-3.5 bg-surface-secondary text-text-primary rounded-xl border border-border-default focus:outline-none focus:border-accent-primary leading-relaxed resize-y"
                    placeholder="<!DOCTYPE html><html>...</html>"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Test Send Modal ── */}
      {isTestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-surface-elevated border-2 border-border-brutalist dark:border-border-default rounded-2xl max-w-sm w-full p-5 shadow-[6px_6px_0px_0px_var(--border-brutalist)]">
            <div className="flex items-center justify-between border-b border-border-default pb-3 mb-3">
              <h4 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
                <Send size={15} className="text-accent-primary" />
                Dispatch Test Email
              </h4>
              <button
                type="button"
                onClick={() => setIsTestModalOpen(false)}
                className="p-1 text-text-tertiary hover:text-text-primary cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSendTest} className="space-y-3 text-xs">
              <p className="text-text-secondary leading-relaxed">
                Sends a live test version of <strong>{currentTemplate?.title}</strong> with sample
                variables to your inbox.
              </p>
              <div>
                <label className="font-bold text-text-secondary block mb-1">
                  Recipient Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full px-3 py-2 bg-surface-secondary border border-border-default rounded-xl focus:outline-none focus:border-accent-primary"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-border-default">
                <button
                  type="button"
                  onClick={() => setIsTestModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-border-default font-bold hover:bg-surface-secondary cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingTest}
                  className="px-4 py-1.5 rounded-xl bg-accent-primary text-text-primary font-bold border border-border-brutalist shadow-[2px_2px_0px_0px_var(--border-brutalist)] hover:opacity-95 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  {sendingTest && <Loader2 size={13} className="animate-spin" />}
                  Send Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Add New Template Modal ── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-surface-elevated border-2 border-border-brutalist dark:border-border-default rounded-2xl max-w-2xl w-full p-6 shadow-[6px_6px_0px_0px_var(--border-brutalist)] my-8">
            <div className="flex items-center justify-between border-b border-border-default pb-3 mb-4">
              <h4 className="text-base font-bold text-text-primary flex items-center gap-2">
                <Plus size={16} className="text-accent-primary" />
                Create New Email Template
              </h4>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-text-tertiary hover:text-text-primary cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTemplate} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-text-secondary block mb-1">
                    Template Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => {
                      setNewTitle(e.target.value);
                      if (!newKey || newKey === newTitle.toLowerCase().replace(/[^a-z0-9]+/g, "")) {
                        setNewKey(
                          e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "")
                        );
                      }
                      if (!newSubject) {
                        setNewSubject(`${e.target.value} - MEC Computer Club`);
                      }
                    }}
                    placeholder="e.g. Workshop Participation Certificate"
                    className="w-full px-3 py-2 bg-surface-secondary border border-border-default rounded-xl focus:outline-none focus:border-accent-primary font-semibold text-text-primary"
                  />
                </div>

                <div>
                  <label className="font-bold text-text-secondary block mb-1">
                    Template Key (Slug) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ""))}
                    placeholder="e.g. workshopCertificate"
                    className="w-full px-3 py-2 bg-surface-secondary border border-border-default rounded-xl focus:outline-none focus:border-accent-primary font-mono text-text-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-text-secondary block mb-1">
                    Category *
                  </label>
                  <Select
                    value={newCategory}
                    onChange={(val) => setNewCategory(val)}
                    options={[
                      { value: "events", label: "Events & Contests" },
                      { value: "membership", label: "Membership & Onboarding" },
                      { value: "invitations", label: "Invitations & Outreach" },
                      { value: "sponsors", label: "Sponsors & Faculty" },
                      { value: "collaborations", label: "Collaborations" },
                      { value: "contact", label: "Contact Responses" },
                      { value: "administrative", label: "Administrative" },
                      { value: "custom", label: "Custom / General" },
                    ]}
                  />
                </div>

                <div>
                  <label className="font-bold text-text-secondary block mb-1">
                    Default Subject Line *
                  </label>
                  <input
                    type="text"
                    required
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="e.g. Your Certificate of Participation"
                    className="w-full px-3 py-2 bg-surface-secondary border border-border-default rounded-xl focus:outline-none focus:border-accent-primary text-text-primary"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-text-secondary block mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Short description of when this email is dispatched..."
                  className="w-full px-3 py-2 bg-surface-secondary border border-border-default rounded-xl focus:outline-none focus:border-accent-primary text-text-primary"
                />
              </div>

              <div>
                <label className="font-bold text-text-secondary block mb-1">
                  Initial Email Body (Rich Text) *
                </label>
                <RichTextEditor
                  value={newBody}
                  onChange={(val) => setNewBody(val)}
                  placeholder="Compose initial template message..."
                  minHeight="180px"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-text-secondary block mb-1">
                    Call To Action Button Text (Optional)
                  </label>
                  <input
                    type="text"
                    value={newCtaText}
                    onChange={(e) => setNewCtaText(e.target.value)}
                    placeholder="e.g. Download Certificate"
                    className="w-full px-3 py-2 bg-surface-secondary border border-border-default rounded-xl focus:outline-none focus:border-accent-primary text-text-primary"
                  />
                </div>

                <div>
                  <label className="font-bold text-text-secondary block mb-1">
                    CTA Button URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={newCtaUrl}
                    onChange={(e) => setNewCtaUrl(e.target.value)}
                    placeholder="e.g. {{link}} or https://..."
                    className="w-full px-3 py-2 bg-surface-secondary border border-border-default rounded-xl focus:outline-none focus:border-accent-primary text-text-primary"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-border-default">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border-default font-bold hover:bg-surface-secondary cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 rounded-xl bg-accent-primary text-text-primary font-bold border border-border-brutalist shadow-[2px_2px_0px_0px_var(--border-brutalist)] hover:opacity-95 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  {creating && <Loader2 size={13} className="animate-spin" />}
                  Create Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {isDeleteModalOpen && currentTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-surface-elevated border-2 border-border-brutalist dark:border-border-default rounded-2xl max-w-sm w-full p-5 shadow-[6px_6px_0px_0px_var(--border-brutalist)]">
            <div className="flex items-center justify-between border-b border-border-default pb-3 mb-3">
              <h4 className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                <Trash2 size={15} />
                Delete Template
              </h4>
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="p-1 text-text-tertiary hover:text-text-primary cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-text-secondary leading-relaxed">
                Are you sure you want to delete custom template{" "}
                <strong>&quot;{currentTemplate.title}&quot;</strong>? This action cannot be undone.
              </p>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-border-default">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-border-default font-bold hover:bg-surface-secondary cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={handleDeleteTemplate}
                  className="px-4 py-1.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  {deleting && <Loader2 size={13} className="animate-spin" />}
                  Delete Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Global Header & Footer Branding Modal ── */}
      {isBrandingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-surface-elevated border-2 border-border-brutalist dark:border-border-default rounded-2xl max-w-xl w-full shadow-[6px_6px_0px_0px_var(--border-brutalist)] max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header (Pinned) */}
            <div className="flex items-center justify-between border-b border-border-default px-5 py-3.5 flex-shrink-0 bg-surface-elevated">
              <h4 className="text-base font-bold text-text-primary flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-accent-primary" />
                Email Header &amp; Footer Branding Settings
              </h4>
              <button
                type="button"
                onClick={() => setIsBrandingModalOpen(false)}
                className="p-1 text-text-tertiary hover:text-text-primary cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveBranding} className="flex flex-col flex-1 overflow-hidden">
              {/* Scrollable Form Body */}
              <div className="overflow-y-auto p-5 space-y-4 text-xs flex-1">
                <p className="text-text-secondary leading-relaxed text-[11px]">
                  Customize the official club header banner image, institution address, and disclaimer footer across all 30+ email templates and broadcasts.
                </p>

                {/* Header Banner Image Section */}
                <div className="space-y-2 p-3.5 rounded-xl bg-surface-secondary/70 border border-border-default">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-text-primary flex items-center gap-1.5">
                      <ImageIcon size={13} className="text-accent-primary" />
                      Header Banner Image URL *
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setBranding((prev) => ({
                          ...prev,
                          bannerUrl:
                            "https://res.cloudinary.com/dj1sjgitq/image/upload/v1768389923/uploads/club_logo/email_banner_lxbsq9.png",
                        }))
                      }
                      className="text-[10px] font-bold text-accent-primary hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw size={10} /> Reset Default
                    </button>
                  </div>

                  <input
                    type="url"
                    required
                    value={branding.bannerUrl}
                    onChange={(e) => setBranding((prev) => ({ ...prev, bannerUrl: e.target.value }))}
                    placeholder="https://res.cloudinary.com/.../banner.png"
                    className="w-full px-3 py-2 bg-surface-elevated border border-border-default rounded-xl focus:outline-none focus:border-accent-primary font-mono text-[11px] text-text-primary"
                  />

                  {/* Banner Image Live Preview */}
                  {branding.bannerUrl && (
                    <div className="relative rounded-lg overflow-hidden border border-border-default bg-slate-900 max-h-24 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={branding.bannerUrl}
                        alt="Banner Preview"
                        className="w-full h-auto object-cover max-h-24"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Club Identity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-text-secondary block mb-1">
                      Club Official Brand Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={branding.clubName}
                      onChange={(e) => setBranding((prev) => ({ ...prev, clubName: e.target.value }))}
                      placeholder="MEC Computer Club"
                      className="w-full px-3 py-2 bg-surface-secondary border border-border-default rounded-xl focus:outline-none focus:border-accent-primary font-semibold text-text-primary"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-text-secondary block mb-1">
                      Host Institution
                    </label>
                    <input
                      type="text"
                      value={branding.institutionName || ""}
                      onChange={(e) =>
                        setBranding((prev) => ({ ...prev, institutionName: e.target.value }))
                      }
                      placeholder="Mymensingh Engineering College"
                      className="w-full px-3 py-2 bg-surface-secondary border border-border-default rounded-xl focus:outline-none focus:border-accent-primary text-text-primary"
                    />
                  </div>
                </div>

                {/* Footer Contents */}
                <div>
                  <label className="font-bold text-text-secondary block mb-1">
                    Footer Address / Campus Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={branding.footerAddress}
                    onChange={(e) => setBranding((prev) => ({ ...prev, footerAddress: e.target.value }))}
                    placeholder="Mymensingh Engineering College, Mymensingh-2200"
                    className="w-full px-3 py-2 bg-surface-secondary border border-border-default rounded-xl focus:outline-none focus:border-accent-primary text-text-primary"
                  />
                </div>

                <div>
                  <label className="font-bold text-text-secondary block mb-1">
                    Footer Automated Disclaimer Note
                  </label>
                  <input
                    type="text"
                    value={branding.footerNote}
                    onChange={(e) => setBranding((prev) => ({ ...prev, footerNote: e.target.value }))}
                    placeholder="Official Notification System • Automated notification, please do not reply directly."
                    className="w-full px-3 py-2 bg-surface-secondary border border-border-default rounded-xl focus:outline-none focus:border-accent-primary text-text-primary"
                  />
                </div>

                {/* Links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-text-secondary block mb-1">
                      Official Website URL
                    </label>
                    <input
                      type="url"
                      value={branding.websiteUrl}
                      onChange={(e) => setBranding((prev) => ({ ...prev, websiteUrl: e.target.value }))}
                      placeholder="https://www.meccomputerclub.org"
                      className="w-full px-3 py-2 bg-surface-secondary border border-border-default rounded-xl focus:outline-none focus:border-accent-primary text-text-primary"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-text-secondary block mb-1">
                      Contact / Support URL
                    </label>
                    <input
                      type="url"
                      value={branding.contactUrl}
                      onChange={(e) => setBranding((prev) => ({ ...prev, contactUrl: e.target.value }))}
                      placeholder="https://www.meccomputerclub.org/contact-us"
                      className="w-full px-3 py-2 bg-surface-secondary border border-border-default rounded-xl focus:outline-none focus:border-accent-primary text-text-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions (Pinned) */}
              <div className="p-3.5 px-5 flex items-center justify-end gap-2 border-t border-border-default bg-surface-secondary/40 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsBrandingModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border-default font-bold hover:bg-surface-secondary cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingBranding}
                  className="px-5 py-2 rounded-xl bg-accent-primary text-text-primary font-bold border border-border-brutalist shadow-[2px_2px_0px_0px_var(--border-brutalist)] hover:opacity-95 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  {savingBranding && <Loader2 size={13} className="animate-spin" />}
                  Save Branding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
