"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";
import {
  Mail,
  Send,
  Users,
  CheckCircle2,
  Clock,
  UserCheck,
  Building2,
  Globe,
  Sparkles,
  Loader2,
  Eye,
  AlertCircle,
  FileCheck2,
  Code,
  Layout,
  Edit3,
  Copy,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { Select } from "@/components/ui/Select";

const API = `${API_BASE_URL}/api`;

type AudienceType =
  | "approved_participants"
  | "pending_registrants"
  | "volunteers"
  | "sponsors"
  | "all"
  | "custom";

type EditorMode = "visual" | "html";

interface EventMailingTabProps {
  event: any;
  showToast: (msg: string, type?: "success" | "error") => void;
}

interface TemplateOption {
  key: string;
  title: string;
  subject: string;
  body: string;
  isHtml?: boolean;
}

export default function EventMailingTab({ event, showToast }: EventMailingTabProps) {
  const [audience, setAudience] = useState<AudienceType>("approved_participants");
  const [editorMode, setEditorMode] = useState<EditorMode>("visual");
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<string>("confirmation");

  // Subject and Content states
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [customHtml, setCustomHtml] = useState("");
  const [customEmails, setCustomEmails] = useState("");

  // States
  const [sending, setSending] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [previewTab, setPreviewTab] = useState<"desktop" | "mobile">("desktop");
  const [systemTemplates, setSystemTemplates] = useState<any[]>([]);

  const editablePreviewRef = useRef<HTMLDivElement>(null);

  // Formatted date string for event
  const formattedEventDate = useMemo(() => {
    return event?.date
      ? new Date(event.date).toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : "Upcoming Event Date";
  }, [event]);

  // Built-in Event Templates
  const eventTemplates: TemplateOption[] = useMemo(() => [
    {
      key: "confirmation",
      title: "🎟️ Registration Approved & Ticket Confirmation",
      subject: `Registration Approved: Welcome to ${event?.title || "the Event"}!`,
      body: `Dear Participant,\n\nWe are pleased to inform you that your registration for "${event?.title}" has been confirmed!\n\nPlease review the event details:\n• Date: ${formattedEventDate}\n• Time: ${event?.eventTime || "Refer to event schedule"}\n• Venue / Room: ${event?.location || "MEC Campus"}\n\nPlease be present 15 minutes before the session starts. If you have any questions, feel free to reply to this email.\n\nBest regards,\nMEC Computer Club Team`,
    },
    {
      key: "schedule_update",
      title: "📍 Schedule, Venue & Virtual Link Details",
      subject: `Schedule & Venue Update: ${event?.title || "the Event"}`,
      body: `Dear Attendees & Participants,\n\nPlease find the latest schedule and venue updates for "${event?.title}".\n\n• Date: ${formattedEventDate}\n• Time: ${event?.eventTime || "See schedule"}\n• Venue: ${event?.location || "MEC Campus"}${event?.onlineLink ? `\n• Virtual Session Link: ${event.onlineLink}` : ""}\n\nMake sure to review the session schedule and guidelines beforehand.\n\nWarm regards,\nMEC Computer Club`,
    },
    {
      key: "rules",
      title: "🚨 Guidelines, Code of Conduct & Rules",
      subject: `Participation Guidelines & Rules: ${event?.title || "the Event"}`,
      body: `Dear Participants,\n\nAhead of "${event?.title}", please take a moment to carefully review the rules and guidelines.\n\nImportant points:\n1. Bring your Student ID / Registration Confirmation.\n2. Respect event timing and session etiquette.\n3. Adhere to the code of conduct throughout the event.\n\nThank you for your cooperation and dedication!\n\nOrganizing Committee\nMEC Computer Club`,
    },
    {
      key: "reminder",
      title: "⏰ Final Reminder: Tomorrow is Event Day!",
      subject: `Reminder: ${event?.title || "the Event"} takes place tomorrow!`,
      body: `Dear All,\n\nThis is a friendly reminder that "${event?.title}" is happening tomorrow!\n\n• Date: ${formattedEventDate}\n• Time: ${event?.eventTime || "TBA"}\n• Venue: ${event?.location || "MEC Campus"}\n\nWe are excited to have you join us for an inspiring session. See you tomorrow!\n\nBest regards,\nMEC Computer Club`,
    },
    {
      key: "wrapup",
      title: "🏆 Post-Event Wrap-up & Certificates",
      subject: `Thank you for attending ${event?.title || "the Event"}! Certificates & Next Steps`,
      body: `Dear Attendees & Team,\n\nThank you for participating in "${event?.title}"! We truly appreciate your active participation and enthusiasm.\n\nYour digital certificates of participation are being published on the MEC Computer Club portal. You can download and share them directly from your profile.\n\nKeep learning and building!\n\nMEC Computer Club Executive Team`,
    },
    {
      key: "announcement",
      title: "📣 General Announcement & Notice",
      subject: `Important Announcement: ${event?.title || "the Event"}`,
      body: `Dear Members & Attendees,\n\nWe have an important announcement regarding "${event?.title}".\n\nPlease take note of the upcoming milestones and updates.\n\nBest regards,\nMEC Computer Club`,
    },
  ], [event, formattedEventDate]);

  // Load system templates from backend
  useEffect(() => {
    axios
      .get(`${API}/email-templates`, { withCredentials: true })
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data.data)) {
          setSystemTemplates(res.data.data);
        }
      })
      .catch(() => {});
  }, []);

  // Combined options for Select dropdown
  const selectOptions = useMemo(() => {
    const list = eventTemplates.map((t) => ({
      value: t.key,
      label: t.title,
    }));

    if (systemTemplates.length > 0) {
      systemTemplates.forEach((st) => {
        list.push({
          value: `system_${st.key}`,
          label: `⚙️ ${st.title} (System Template)`,
        });
      });
    }

    list.push({
      value: "blank",
      label: "✨ Blank / Custom Composition",
    });

    return list;
  }, [eventTemplates, systemTemplates]);

  // Apply selected template
  const applyTemplate = useCallback((key: string) => {
    setSelectedTemplateKey(key);

    if (key === "blank") {
      setSubject("");
      setMessage("");
      setCustomHtml("");
      return;
    }

    if (key.startsWith("system_")) {
      const actualKey = key.replace("system_", "");
      const st = systemTemplates.find((t) => t.key === actualKey);
      if (st) {
        setSubject(st.subject || `Notice: ${event?.title}`);
        setMessage(st.description || "");
        if (st.html) {
          setCustomHtml(st.html);
          setEditorMode("html");
        }
        showToast(`Loaded system template: ${st.title}`);
        return;
      }
    }

    const t = eventTemplates.find((item) => item.key === key);
    if (t) {
      setSubject(t.subject);
      setMessage(t.body);

      // Generate initial HTML representation for custom HTML mode
      const initialHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${t.subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 28px; background: #ffffff; color: #1e293b;">
  <div style="text-align: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 18px; margin-bottom: 22px;">
    <h1 style="color: #0f172a; margin: 0; font-size: 24px; font-weight: 800;">MEC COMPUTER CLUB</h1>
    <p style="color: #64748b; margin: 4px 0 0 0; font-size: 13px; font-weight: 600; text-transform: uppercase;">${event?.title}</p>
  </div>
  <div style="margin-bottom: 22px;">
    <h2 style="color: #0f172a; font-size: 18px;">Hello, {{userName}}!</h2>
    <div style="color: #334155; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">${t.body}</div>
  </div>
  <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 22px; font-size: 13px;">
    <p style="margin: 0 0 4px 0; font-weight: bold; color: #0f172a;">Event Reference:</p>
    <p style="margin: 0; color: #475569;">${event?.title} • ${formattedEventDate} (${event?.location})</p>
  </div>
  <div style="text-align: center; border-top: 1px solid #e2e8f0; padding-top: 18px; color: #94a3b8; font-size: 12px;">
    <p style="margin: 0;">MEC Computer Club • Official Broadcast</p>
  </div>
</body>
</html>`;
      setCustomHtml(initialHtml);
    }
  }, [eventTemplates, systemTemplates, event, formattedEventDate, showToast]);

  // Initial load: apply first template
  useEffect(() => {
    if (!subject && !message) {
      applyTemplate("confirmation");
    }
  }, [applyTemplate, subject, message]);

  // Calculate live recipient estimates from event state
  const recipientCounts = useMemo(() => {
    const approvedCount =
      (event.approvedParticipants?.length || 0) +
      (event.attendees?.length || 0);

    const pendingCount = event.pendingParticipants?.length || 0;
    const volunteerCount = event.contributors?.length || 0;
    const sponsorCount = event.eventSponsors?.length || 0;
    const totalAll = approvedCount + pendingCount + volunteerCount + sponsorCount;

    return {
      approved: approvedCount,
      pending: pendingCount,
      volunteers: volunteerCount,
      sponsors: sponsorCount,
      all: totalAll,
    };
  }, [event]);

  // Dynamic preview greeting matching BCC broadcast format
  const previewGreeting = useMemo(() => {
    switch (audience) {
      case "approved_participants":
        return "Hello Participants & Attendees!";
      case "pending_registrants":
        return "Hello Applicants & Registrants!";
      case "volunteers":
        return "Hello Organizing Team & Volunteers!";
      case "sponsors":
        return "Hello Valued Sponsors & Partners!";
      case "all":
      case "custom":
      default:
        return "Hello Everyone!";
    }
  }, [audience]);

  // Handle direct inline modification from the visual preview card
  const handlePreviewInput = (e: React.FormEvent<HTMLDivElement>) => {
    const newText = e.currentTarget.innerText;
    setMessage(newText);
  };

  // Synchronize editablePreviewRef text when message changes from outside
  useEffect(() => {
    if (editablePreviewRef.current && document.activeElement !== editablePreviewRef.current) {
      editablePreviewRef.current.innerText = message || "";
    }
  }, [message]);

  const handleSendBroadcast = async () => {
    if (!subject.trim()) {
      showToast("Please enter an email subject line.", "error");
      return;
    }

    const contentToSend = editorMode === "html" ? customHtml : message;
    if (!contentToSend.trim()) {
      showToast("Please enter message content or HTML code.", "error");
      return;
    }

    setSending(true);
    try {
      const payload: any = {
        audience,
        subject: subject.trim(),
        message: contentToSend.trim(),
        isCustomHtml: editorMode === "html",
      };

      if (audience === "custom") {
        const parsedEmails = customEmails
          .split(/[\n,;]+/)
          .map((e) => e.trim())
          .filter((e) => e.includes("@"));

        if (parsedEmails.length === 0) {
          showToast("Please provide at least one valid email address.", "error");
          setSending(false);
          return;
        }
        payload.customEmails = parsedEmails;
      }

      const res = await axios.post(`${API}/events/${event._id}/broadcast`, payload, {
        withCredentials: true,
      });

      if (res.data?.success) {
        showToast(res.data.message || "Broadcast sent successfully!", "success");
        setShowConfirmModal(false);
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to send email broadcast.", "error");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Audience Selector Cards ── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              1. Target Audience
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select who will receive this official email broadcast.
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 w-fit">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Sent via BCC (Emails kept private)
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            {
              id: "approved_participants" as AudienceType,
              title: "Approved Participants",
              desc: "Confirmed attendees & participants",
              count: recipientCounts.approved,
              icon: CheckCircle2,
              color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800",
            },
            {
              id: "pending_registrants" as AudienceType,
              title: "Form Applicants",
              desc: "Submitted registration form responses",
              count: recipientCounts.pending,
              icon: Clock,
              color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800",
            },
            {
              id: "volunteers" as AudienceType,
              title: "Organizers",
              desc: "Event organizers, committee & volunteers",
              count: recipientCounts.volunteers,
              icon: UserCheck,
              color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800",
            },
            {
              id: "sponsors" as AudienceType,
              title: "Event Sponsors",
              desc: "Partner organizations and brand contacts",
              count: recipientCounts.sponsors,
              icon: Building2,
              color: "text-purple-600 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800",
            },
            {
              id: "all" as AudienceType,
              title: "All Stakeholders",
              desc: "Broadcast to all above groups combined",
              count: recipientCounts.all,
              icon: Globe,
              color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800",
            },
            {
              id: "custom" as AudienceType,
              title: "Custom Email List",
              desc: "Manually specify recipient emails",
              count: "Custom",
              icon: Mail,
              color: "text-slate-600 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700",
            },
          ].map((item) => {
            const isSelected = audience === item.id;
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                onClick={() => setAudience(item.id)}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-150 flex items-start justify-between gap-3 ${
                  isSelected
                    ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/30 shadow-sm"
                    : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
                }`}
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`p-1.5 rounded-lg border ${item.color}`}>
                      <Icon className="w-4 h-4" />
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm truncate">
                      {item.title}
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    {item.desc}
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {typeof item.count === "number" ? `${item.count} rec.` : item.count}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {audience === "custom" && (
          <div className="pt-2 animate-fade-in space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Recipient Email Addresses (comma or newline separated):
            </label>
            <textarea
              rows={3}
              value={customEmails}
              onChange={(e) => setCustomEmails(e.target.value)}
              placeholder="e.g. member1@mec.edu.bd, organizer@gmail.com, guest@company.com"
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        )}
      </div>

      {/* ── Template Picker & Mode Switcher ── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              2. Select Template & Format Mode
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Choose an existing pre-made template or switch to custom HTML mode.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setEditorMode("visual")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                editorMode === "visual"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <Layout className="w-3.5 h-3.5 text-indigo-500" />
              Visual Composer
            </button>
            <button
              type="button"
              onClick={() => {
                setEditorMode("html");
                if (!customHtml.trim() && message.trim()) {
                  applyTemplate(selectedTemplateKey);
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                editorMode === "html"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              <Code className="w-3.5 h-3.5 text-indigo-500" />
              Custom HTML
            </button>
          </div>
        </div>

        {/* Template Dropdown using custom Select */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Choose Email Template:
          </label>
          <div className="max-w-md">
            <Select
              value={selectedTemplateKey}
              onChange={(val) => applyTemplate(val)}
              options={selectOptions}
              placeholder="Select a template..."
            />
          </div>
        </div>
      </div>

      {/* ── Email Editor & Interactive Live Preview ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN: Input Fields / Code Editor */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-5 space-y-4 flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              {editorMode === "visual" ? (
                <>
                  <Edit3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Message Details
                </>
              ) : (
                <>
                  <Code className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  HTML Source Code
                </>
              )}
            </h3>

            {editorMode === "html" && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                HTML Mode Active
              </span>
            )}
          </div>

          {/* Subject Line Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Email Subject Line: <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Registration Approved: Beyond Borders Seminar"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
          </div>

          {/* Content Editor */}
          {editorMode === "visual" ? (
            <div className="space-y-1 flex-1 flex flex-col">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Announcement Body Text:
              </label>
              <textarea
                rows={12}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message text here. You can also modify text directly inside the live preview on the right..."
                className="w-full flex-1 p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none leading-relaxed transition"
              />
              <p className="text-[11px] text-slate-400">
                Tip: Paragraphs and line breaks are automatically formatted in the email.
              </p>
            </div>
          ) : (
            <div className="space-y-1 flex-1 flex flex-col">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Custom HTML Markup:
                </label>
                <span className="text-[11px] text-slate-400">Supports inline styles & variables</span>
              </div>
              <textarea
                rows={16}
                value={customHtml}
                onChange={(e) => setCustomHtml(e.target.value)}
                placeholder="Paste your full custom HTML markup here (<table>, <div>, inline styles)..."
                className="w-full flex-1 p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-950 text-emerald-400 font-mono text-xs focus:ring-2 focus:ring-indigo-500 outline-none leading-relaxed transition resize-y"
              />
              <p className="text-[11px] text-slate-400">
                Variables: <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono">{"{{userName}}"}</code> and <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono">{"{{email}}"}</code> will be dynamically replaced per recipient.
              </p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Interactive Live Preview with Direct Text Editing */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-5 space-y-3 flex flex-col">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Interactive Live Preview
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1">
                <Edit3 className="w-3 h-3" /> Click text in preview to edit
              </span>
            </div>
          </div>

          {/* Subject Bar in Preview */}
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs flex items-center gap-1.5">
            <span className="text-slate-400 font-medium flex-shrink-0">Subject: </span>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="(Click to edit subject directly in preview...)"
              className="bg-transparent font-bold text-slate-800 dark:text-slate-100 flex-1 outline-none focus:ring-1 focus:ring-indigo-400 rounded px-1.5 py-0.5"
            />
          </div>

          {/* Rendered Preview Card / Frame */}
          <div className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-950 p-3 sm:p-5 overflow-y-auto max-h-[550px]">
            {editorMode === "html" ? (
              <div
                className="bg-white text-slate-900 rounded-xl p-4 sm:p-6 shadow-sm border border-slate-200 text-sm overflow-x-auto min-h-[350px]"
                dangerouslySetInnerHTML={{
                  __html: (customHtml || "")
                    .replace(/{{\s*userName\s*}}/g, "Participant")
                    .replace(/{{\s*email\s*}}/g, ""),
                }}
              />
            ) : (
              <div className="bg-white text-slate-900 rounded-xl p-5 sm:p-7 shadow-sm border-2 border-black max-w-[560px] mx-auto space-y-4">
                {/* Header */}
                <div className="text-center border-b-2 border-slate-200 pb-3">
                  <h4 className="font-extrabold text-lg tracking-tight text-slate-900">
                    MEC COMPUTER CLUB
                  </h4>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    {event?.title || "Official Event Announcement"}
                  </p>
                </div>

                {/* Greeting */}
                <h5 className="font-bold text-base text-slate-900">
                  {previewGreeting}
                </h5>

                {/* Direct Editable Text Body */}
                <div
                  ref={editablePreviewRef}
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                  onInput={handlePreviewInput}
                  className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-indigo-50/20 p-2 rounded-lg transition border border-transparent hover:border-slate-300"
                  title="Click directly to edit this message text"
                >
                  {message || "Click here to type or modify message text directly inside the preview..."}
                </div>

                {/* Event Reference Box */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                  <p className="font-bold text-slate-800">Event Reference:</p>
                  <p className="text-slate-600">
                    <strong>{event?.title}</strong> • {formattedEventDate} ({event?.location || "MEC Campus"})
                  </p>
                </div>

                {/* Footer */}
                <div className="text-center border-t border-slate-200 pt-3 text-[11px] text-slate-400">
                  <p className="m-0">MEC Computer Club • Learn. Build. Share.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Footer Actions Bar ── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-xs text-slate-500">
          Target Audience: <strong className="text-slate-800 dark:text-slate-200 capitalize">{audience.replace(/_/g, " ")}</strong> • Format: <strong className="text-slate-800 dark:text-slate-200">{editorMode === "html" ? "Custom HTML" : "Visual Template"}</strong>
        </div>

        <button
          type="button"
          onClick={() => {
            if (!subject.trim()) {
              showToast("Please provide an email subject line.", "error");
              return;
            }
            const content = editorMode === "html" ? customHtml : message;
            if (!content.trim()) {
              showToast("Please provide message content.", "error");
              return;
            }
            setShowConfirmModal(true);
          }}
          disabled={sending}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          style={{ backgroundColor: "var(--accent-primary, #6366f1)", color: "#FFFFFF" }}
        >
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Send Email Broadcast
        </button>
      </div>

      {/* ── Confirmation Modal ── */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 border border-indigo-200 dark:border-indigo-800">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Confirm Broadcast Dispatch
                </h3>
                <p className="text-xs text-slate-500">
                  Ready to send this official announcement email.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-1.5 text-xs">
              <p>
                <strong className="text-slate-700 dark:text-slate-300">Target Audience: </strong>
                <span className="capitalize">{audience.replace(/_/g, " ")}</span>
              </p>
              <p>
                <strong className="text-slate-700 dark:text-slate-300">Delivery Method: </strong>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" /> Blind Carbon Copy (BCC)
                </span>
              </p>
              <p>
                <strong className="text-slate-700 dark:text-slate-300">Format Mode: </strong>
                <span>{editorMode === "html" ? "Custom HTML Markup" : "Visual Template"}</span>
              </p>
              <p>
                <strong className="text-slate-700 dark:text-slate-300">Subject: </strong>
                <span className="text-slate-900 dark:text-white font-medium">{subject}</span>
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={sending}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendBroadcast}
                disabled={sending}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow transition flex items-center gap-1.5 disabled:opacity-50"
                style={{ color: "#FFFFFF" }}
              >
                {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                Confirm & Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
