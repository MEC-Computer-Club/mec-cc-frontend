"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
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
  Code,
  Layout,
  BookmarkPlus,
  Trash2,
  Check,
  X,
  Smartphone,
  Monitor,
  Calendar,
  MapPin,
  Link2,
  Paperclip,
  Upload,
  FileText,
  Image as ImageIcon,
  Plus,
  Maximize2,
  UserCheck2,
  Flame,
  Search,
  RefreshCw,
  Copy,
} from "lucide-react";
import { Select } from "@/components/ui/Select";
import { RichTextEditor, QuickTokenItem } from "@/components/ui/RichTextEditor";

const API = `${API_BASE_URL}/api`;

type AudienceType =
  | "approved_participants"
  | "pending_registrants"
  | "volunteers"
  | "sponsors"
  | "all"
  | "custom";

type EditorMode = "preview" | "code";
type BannerSource = "event" | "global" | "custom" | "none";
type DeliverySystem = "bcc" | "cc" | "individual";

interface EventMailingTabProps {
  event: any;
  showToast: (msg: string, type?: "success" | "error") => void;
  initialAudience?: AudienceType;
  initialCustomEmails?: string;
  initialDeliveryMethod?: DeliverySystem;
}

interface TemplateOption {
  key: string;
  title: string;
  subject: string;
  body: string;
}

interface EmailAttachment {
  name: string;
  url?: string;
  content?: string; // Base64 content for direct RFC 2822 email attachment (like Gmail)
  size?: number;
  mimeType?: string;
}

interface SavedEventTemplate {
  _id: string;
  name: string;
  subject: string;
  body: string;
  isHtml: boolean;
  audience: AudienceType;
  bannerUrl?: string;
  attachments?: EmailAttachment[];
  createdAt?: string;
  updatedAt?: string;
}

interface EmailBranding {
  clubName: string;
  institutionName?: string;
  bannerUrl: string;
  footerAddress: string;
  footerNote: string;
  websiteUrl: string;
  contactUrl: string;
}

const DEFAULT_BRANDING: EmailBranding = {
  clubName: "MEC Computer Club",
  institutionName: "Mymensingh Engineering College",
  bannerUrl:
    "https://res.cloudinary.com/dj1sjgitq/image/upload/v1768389923/uploads/club_logo/email_banner_lxbsq9.png",
  footerAddress:
    "Department of Computer Science & Engineering, Mymensingh Engineering College, Mymensingh-2200, Bangladesh",
  footerNote:
    "Official Notification System • Automated notification, please do not reply directly.",
  websiteUrl: "https://meccomputerclub.org",
  contactUrl: "https://meccomputerclub.org/contact",
};

// Helper to extract body content from full HTML5 document
function extractBodyFromHtml(fullHtml: string): string {
  if (!fullHtml) return "";
  const cellMatch = fullHtml.match(
    /<td class="email-content-cell"[^>]*>\s*<div[^>]*>([\s\S]*?)<\/div>\s*(?:<!-- Attachments -->[\s\S]*?)?<\/td>/i
  );
  if (cellMatch && cellMatch[1]) {
    return cellMatch[1].trim();
  }
  const genericCellMatch = fullHtml.match(
    /<td class="email-content-cell"[^>]*>([\s\S]*?)<\/td>/i
  );
  if (genericCellMatch && genericCellMatch[1]) {
    return genericCellMatch[1].trim();
  }
  const match = fullHtml.match(
    /<div style="font-size: 15px; line-height: 1.65; color: #4b5563;[^"]*">([\s\S]*?)<\/div>/i
  );
  if (match && match[1]) {
    return match[1].trim();
  }
  const contentPaddingMatch = fullHtml.match(
    /<td class="content-padding"[^>]*>([\s\S]*?)<\/td>/i
  );
  if (contentPaddingMatch && contentPaddingMatch[1]) {
    return contentPaddingMatch[1].trim();
  }
  return fullHtml;
}

export default function EventMailingTab({
  event,
  showToast,
  initialAudience,
  initialCustomEmails,
  initialDeliveryMethod,
}: EventMailingTabProps) {
  const { user } = useAuth();

  // Audience & Delivery configuration
  const [audience, setAudience] = useState<AudienceType>(initialAudience || "approved_participants");
  const [customEmails, setCustomEmails] = useState(initialCustomEmails || "");
  const [deliverySystem, setDeliverySystem] = useState<DeliverySystem>(initialDeliveryMethod || "bcc");
  const [testEmail, setTestEmail] = useState<string>(user?.email || "");
  const [sendingTest, setSendingTest] = useState(false);
  const [ccEmails, setCcEmails] = useState("");

  // Sync initial props if changed externally
  useEffect(() => {
    if (initialAudience) setAudience(initialAudience);
  }, [initialAudience]);

  useEffect(() => {
    if (initialCustomEmails !== undefined) setCustomEmails(initialCustomEmails);
  }, [initialCustomEmails]);

  useEffect(() => {
    if (initialDeliveryMethod) setDeliverySystem(initialDeliveryMethod);
  }, [initialDeliveryMethod]);

  // Editor mode & buffer
  const [editorMode, setEditorMode] = useState<EditorMode>("preview");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [useSampleData, setUseSampleData] = useState<boolean>(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [customHtml, setCustomHtml] = useState("");
  const hasManuallyEditedSubject = useRef(false);

  // Templates
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<string>("confirmation");
  const [templateSearchQuery, setTemplateSearchQuery] = useState("");
  const [systemTemplates, setSystemTemplates] = useState<any[]>([]);
  const [savedEventTemplates, setSavedEventTemplates] = useState<SavedEventTemplate[]>([]);
  const [loadingSavedTemplates, setLoadingSavedTemplates] = useState(false);
  const [activeSavedTemplateId, setActiveSavedTemplateId] = useState<string | null>(null);

  // Save / Delete Template Modals
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveTemplateName, setSaveTemplateName] = useState("");
  const [isUpdateExisting, setIsUpdateExisting] = useState(false);
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingTemplate, setDeletingTemplate] = useState(false);

  // Banner Selection (Per-Event, never touches global header)
  const eventBannerUrl = useMemo(() => {
    return (
      event?.bannerImageUrl ||
      event?.coverImageUrl ||
      event?.banner ||
      event?.image ||
      ""
    );
  }, [event]);

  const [bannerSource, setBannerSource] = useState<BannerSource>(
    eventBannerUrl ? "event" : "global"
  );
  const [customBannerUrl, setCustomBannerUrl] = useState("");

  // Attachments
  const [attachments, setAttachments] = useState<EmailAttachment[]>([]);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);
  const [showAddUrlModal, setShowAddUrlModal] = useState(false);
  const [attachmentUrlInput, setAttachmentUrlInput] = useState("");
  const [attachmentNameInput, setAttachmentNameInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Send Broadcast modal & sending state
  const [sending, setSending] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Global Branding
  const [branding, setBranding] = useState<EmailBranding>(DEFAULT_BRANDING);

  // Sync test email
  useEffect(() => {
    if (user?.email && !testEmail) {
      setTestEmail(user.email);
    }
  }, [user?.email, testEmail]);

  // Fetch Global Branding settings
  useEffect(() => {
    axios
      .get(`${API}/email-templates/branding/settings`, { withCredentials: true })
      .then((res) => {
        if (res.data?.success && res.data.data) {
          setBranding((prev) => ({ ...prev, ...res.data.data }));
        }
      })
      .catch(() => {});
  }, []);

  // Fetch Saved Event Templates
  const fetchSavedTemplates = useCallback(async () => {
    if (!event?._id) return;
    setLoadingSavedTemplates(true);
    try {
      const res = await axios.get(`${API}/events/${event._id}/email-templates`, {
        withCredentials: true,
      });
      if (res.data?.success && Array.isArray(res.data.data)) {
        setSavedEventTemplates(res.data.data);
      }
    } catch {
      // Silently catch
    } finally {
      setLoadingSavedTemplates(false);
    }
  }, [event?._id]);

  useEffect(() => {
    fetchSavedTemplates();
  }, [fetchSavedTemplates]);

  // Load System Templates from backend catalog
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

  // Discover dynamic form fields from linked form & submissions
  const [formFieldTokens, setFormFieldTokens] = useState<QuickTokenItem[]>([]);

  useEffect(() => {
    if (!event?._id) return;
    axios
      .get(`${API}/events/${event._id}/form-submissions`, { withCredentials: true })
      .then((res) => {
        if (res.data?.success) {
          const discoveredTokens: QuickTokenItem[] = [];
          const seen = new Set<string>();
          const reserved = new Set([
            "username",
            "name",
            "email",
            "greeting",
            "eventname",
            "eventdate",
            "eventvenue",
            "clubname",
          ]);

          const getSampleValue = (key: string, rawVal?: any, placeholder?: string) => {
            if (rawVal !== undefined && rawVal !== null && typeof rawVal !== "object" && String(rawVal).trim()) {
              return String(rawVal);
            }
            const lower = key.toLowerCase();
            if (lower.includes("session")) return "2021-22";
            if (lower.includes("pubg") || lower.includes("game") || lower.includes("ign") || lower.includes("uid")) return "5123984124";
            if (lower.includes("phone") || lower.includes("mobile") || lower.includes("contact")) return "+880 1712-345678";
            if (lower.includes("batch")) return "14th";
            if (lower.includes("roll") || lower.includes("student_id") || lower.includes("studentid")) return "2021-042";
            if (lower.includes("dept") || lower.includes("department")) return "CSE";
            if (lower.includes("team") || lower.includes("club")) return "MEC CyberWolves";
            if (lower.includes("shirt") || lower.includes("size")) return "XL";
            if (placeholder) return placeholder;
            return `[${key}]`;
          };

          // 1. From Form Fields definition
          if (Array.isArray(res.data.forms)) {
            res.data.forms.forEach((f: any) => {
              if (Array.isArray(f.fields)) {
                f.fields.forEach((field: any) => {
                  const key = field.name || field.label || "";
                  const norm = key.toLowerCase().replace(/[^a-z0-9]/g, "");
                  if (key && !reserved.has(norm) && !seen.has(norm)) {
                    seen.add(norm);
                    discoveredTokens.push({
                      name: key,
                      description: `Form Field: ${field.label || key}`,
                      sample: getSampleValue(key, undefined, field.placeholder),
                    });
                  }
                });
              }
            });
          }

          // 2. From actual submission responses (e.g. session, pubg_id, etc.)
          if (Array.isArray(res.data.submissions)) {
            res.data.submissions.forEach((sub: any) => {
              if (sub.responses && typeof sub.responses === "object") {
                Object.entries(sub.responses).forEach(([k, v]) => {
                  const norm = k.toLowerCase().replace(/[^a-z0-9]/g, "");
                  if (k && !reserved.has(norm) && !seen.has(norm)) {
                    seen.add(norm);
                    const formattedLabel = k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
                    discoveredTokens.push({
                      name: k,
                      description: `Form Field: ${formattedLabel}`,
                      sample: getSampleValue(k, v),
                    });
                  }
                });
              }
            });
          }

          setFormFieldTokens(discoveredTokens);
        }
      })
      .catch(() => {});
  }, [event?._id]);

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

  // Effective banner URL based on source
  const effectiveBannerUrl = useMemo(() => {
    if (bannerSource === "event") return eventBannerUrl || branding.bannerUrl;
    if (bannerSource === "global") return branding.bannerUrl;
    if (bannerSource === "custom") return customBannerUrl.trim();
    return ""; // none
  }, [bannerSource, eventBannerUrl, branding.bannerUrl, customBannerUrl]);

  // Dynamic preview greeting
  const previewGreeting = useMemo(() => {
    if (deliverySystem === "individual") {
      return useSampleData ? "Hello, Md. Nasir Ahmed!" : "Hello, {{userName}}!";
    }
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
  }, [audience, deliverySystem, useSampleData]);

  // Helper to build a complete, 100% editable email template containing Title, Greeting, Body, Schedule & Regards
  const buildFullTemplateContent = useCallback(
    (paragraphsHtml: string, customTitle?: string, customGreeting?: string) => {
      const titleToUse = customTitle || event?.title || "Official Announcement";
      const greetingToUse = customGreeting || previewGreeting;

      return `<h2 style="margin: 0 0 12px; font-size: 22px; font-weight: 700; color: #002e5b; font-family: 'Inter', -apple-system, sans-serif; letter-spacing: -0.3px; line-height: 1.3;">${titleToUse}</h2>

<p style="margin: 0 0 14px; font-size: 15px; font-weight: 600; color: #002e5b;">${greetingToUse}</p>

${paragraphsHtml}

<div class="email-box-card" style="margin: 16px 0; padding: 12px 14px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px;">
  <p style="margin: 0 0 6px; font-weight: 700; color: #002e5b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">📅 Event Reference &amp; Schedule</p>
  <p style="margin: 0 0 4px; font-size: 14px; font-weight: 700; color: #0f172a;">${event?.title || titleToUse}</p>
  <p style="margin: 0 0 4px; font-size: 13px; color: #475569;">📅 <strong>Date:</strong> ${formattedEventDate} ${event?.eventTime ? `• ${event.eventTime}` : ""}</p>
  <p style="margin: 0 0 4px; font-size: 13px; color: #475569;">📍 <strong>Venue:</strong> ${event?.location || "MEC Campus"}</p>
  ${event?.onlineLink ? `<p style="margin: 6px 0 0; font-size: 13px; color: #002e5b;"><a href="${event.onlineLink}" target="_blank" style="color: #002e5b; font-weight: 600; text-decoration: underline;">🔗 Join Virtual Session</a></p>` : ""}
</div>

<div class="email-signoff" style="margin-top: 20px; padding-top: 12px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #64748b;">
  <p style="margin: 0 0 4px;">Best regards,</p>
  <p style="margin: 0; font-weight: 700; color: #002e5b;">${branding.clubName} Executive Team</p>
</div>`;
    },
    [event?.title, event?.eventTime, event?.location, event?.onlineLink, formattedEventDate, previewGreeting, branding.clubName]
  );

  // Built-in Event Operational Templates with clean HTML
  const eventTemplates: TemplateOption[] = useMemo(
    () => [
      {
        key: "confirmation",
        title: "🎟️ Registration Approved & Confirmation",
        subject: "Registration Approved & Confirmation",
        body: buildFullTemplateContent(
          `<p>We are pleased to inform you that your registration for <strong>${event?.title || "our upcoming event"}</strong> has been confirmed!</p>\n<p>Please arrive 15 minutes before the session begins. If you have any questions or require accommodations, please reply directly to this email.</p>`
        ),
      },
      {
        key: "reminder",
        title: "⏰ 24-Hour Event Reminder",
        subject: "Event Reminder: Tomorrow's Session",
        body: buildFullTemplateContent(
          `<p>This is a friendly reminder that <strong>${event?.title || "our event"}</strong> is taking place tomorrow!</p>\n<p>Please review the venue location and timing in the reference card below. We recommend arriving early to ensure a smooth check-in.</p>`
        ),
      },
      {
        key: "survey",
        title: "📋 Post-Event Feedback & Survey",
        subject: "Thank You for Attending - Feedback & Survey",
        body: buildFullTemplateContent(
          `<p>Thank you for participating in <strong>${event?.title || "the event"}</strong>! We hope you had a fruitful experience and enjoyed the sessions.</p>\n<p>Please take 2 minutes to fill out our post-event feedback survey so we can continue improving future events.</p>`
        ),
      },
      {
        key: "certificate",
        title: "🏆 Certificate of Participation",
        subject: "Certificate of Participation Ready",
        body: buildFullTemplateContent(
          `<p>Congratulations! Your official Certificate of Participation for <strong>${event?.title || "the event"}</strong> is now ready for collection and download.</p>\n<p>Thank you for being part of this event and demonstrating your enthusiasm and talent.</p>`
        ),
      },
      {
        key: "cancellation",
        title: "⚠️ Schedule Change or Cancellation Notice",
        subject: "Important Schedule Update & Notice",
        body: buildFullTemplateContent(
          `<p>We are writing to notify you of an important schedule update regarding <strong>${event?.title || "the event"}</strong>.</p>\n<p>Please review the updated details below. We apologize for any inconvenience caused and appreciate your understanding.</p>`
        ),
      },
      {
        key: "custom",
        title: "✉️ Custom Announcement / Blank",
        subject: "Official Event Announcement",
        body: buildFullTemplateContent(
          `<p>Write your official event announcement here. Click directly into this email card to type, format text, and insert dynamic tokens.</p>`
        ),
      },
    ],
    [buildFullTemplateContent, event?.title]
  );

  // Recipient counts
  const recipientCounts = useMemo(() => {
    const approvedCount =
      (event?.approvedParticipants?.length || 0) +
      (event?.attendees?.length || 0);
    const pendingCount = (event as any)?.pendingCount !== undefined ? (event as any).pendingCount : 0;
    const volunteerCount = event?.contributors?.length || 0;
    const sponsorCount = event?.eventSponsors?.length || 0;
    const totalAll = approvedCount + pendingCount + volunteerCount + sponsorCount;

    return {
      approved: approvedCount,
      pending: pendingCount,
      volunteers: volunteerCount,
      sponsors: sponsorCount,
      all: totalAll,
    };
  }, [event]);

  // Build full HTML email document
  const buildFullHtml = useCallback(
    (subj: string, bodyContent: string, bannerToUse?: string, atts?: EmailAttachment[]) => {
      const banner = bannerToUse !== undefined ? bannerToUse : effectiveBannerUrl;

      const currentAtts = atts || attachments;
      let attachmentsBlock = "";
      if (currentAtts.length > 0) {
        const directFiles = currentAtts.filter((att) => att && att.content);
        const externalLinks = currentAtts.filter((att) => att && !att.content && att.url);

        let filesHtml = "";
        if (directFiles.length > 0) {
          const rows = directFiles
            .map((att) => {
              const sizeStr = att.size
                ? ` <span style="font-size: 11px; color: #64748b; font-weight: normal;">(${(att.size / 1024).toFixed(1)} KB)</span>`
                : "";
              return `<tr>
                <td style="padding: 9px 0; border-bottom: 1px solid #edf2f7; font-size: 13px;">
                  <span style="font-size: 14px; margin-right: 6px;">📄</span>
                  <span style="color: #002e5b; font-weight: 600;">${att.name || "Attachment"}</span>${sizeStr}
                </td>
                <td align="right" style="padding: 9px 0; border-bottom: 1px solid #edf2f7; color: #166534; font-size: 11px; font-weight: 700;">
                  Attached Directly 📎
                </td>
              </tr>`;
            })
            .join("");

          filesHtml = `
            <div class="email-box-card" style="margin: 20px 0 16px; padding: 16px 18px; background-color: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 10px;">
              <p style="margin: 0 0 8px; font-weight: 700; color: #166534; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
                📎 Attached Documents (${directFiles.length})
              </p>
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                ${rows}
              </table>
              <p style="margin: 8px 0 0; font-size: 11px; color: #15803d; line-height: 1.4;">
                Files are attached directly to this email message. You can preview or download them using your email app.
              </p>
            </div>
          `;
        }

        let linksHtml = "";
        if (externalLinks.length > 0) {
          const rows = externalLinks
            .map((att) => {
              return `<tr>
                <td style="padding: 9px 0; border-bottom: 1px solid #e0e7ff; font-size: 13px;">
                  <span style="font-size: 14px; margin-right: 6px;">🔗</span>
                  <a href="${att.url}" target="_blank" style="color: #1e40af; font-weight: 600; text-decoration: none;">
                    ${att.name || "External Resource"}
                  </a>
                </td>
                <td align="right" style="padding: 9px 0; border-bottom: 1px solid #e0e7ff;">
                  <a href="${att.url}" target="_blank" style="display: inline-block; padding: 5px 12px; background: #1e40af; color: #ffffff !important; border-radius: 6px; font-size: 11px; font-weight: 700; text-decoration: none;">
                    Open Link &rarr;
                  </a>
                </td>
              </tr>`;
            })
            .join("");

          linksHtml = `
            <div class="email-box-card" style="margin: 16px 0 20px; padding: 16px 18px; background-color: #eef2ff; border: 1.5px solid #c7d2fe; border-radius: 10px;">
              <p style="margin: 0 0 8px; font-weight: 700; color: #3730a3; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
                🔗 Resource &amp; Reference Links (${externalLinks.length})
              </p>
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                ${rows}
              </table>
            </div>
          `;
        }

        attachmentsBlock = filesHtml + linksHtml;
      }

      const bannerImg = banner
        ? `<table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td width="100%"><img src="${banner}" alt="${branding.clubName}" class="email-banner-img" style="width: 100%; max-width: 600px; height: auto; display: block; border-radius: 12px 12px 0 0;" /></td></tr></table>`
        : "";

      return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no" />
  <title>${subj}</title>
  <style type="text/css">
    /* Global Resets */
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      height: 100% !important;
      -webkit-text-size-adjust: 100% !important;
      -ms-text-size-adjust: 100% !important;
    }
    table, td {
      mso-table-lspace: 0pt !important;
      mso-table-rspace: 0pt !important;
      border-collapse: collapse !important;
    }
    img {
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
      -ms-interpolation-mode: bicubic;
    }

    /* Mobile Responsive Styles */
    @media only screen and (max-width: 600px) {
      .email-body-wrapper {
        padding: 12px 6px !important;
        background-color: #f3f4f6 !important;
      }
      .email-outer-td {
        padding: 0 4px !important;
      }
      .email-container-table {
        width: 100% !important;
        max-width: 100% !important;
        border-radius: 12px !important;
        border: 1px solid #e5e7eb !important;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06) !important;
        overflow: hidden !important;
        background-color: #ffffff !important;
      }
      .email-banner-img {
        border-radius: 12px 12px 0 0 !important;
        width: 100% !important;
        max-width: 100% !important;
        height: auto !important;
        display: block !important;
      }
      .email-content-cell {
        padding: 16px 12px 20px !important;
      }
      .email-title-h1 {
        font-size: 20px !important;
        line-height: 1.35 !important;
        margin-bottom: 10px !important;
      }
      .email-box-card {
        padding: 10px 12px !important;
        margin: 14px 0 !important;
      }
      .email-footer-cell {
        padding: 18px 14px 24px !important;
      }
    }
  </style>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 0; color: #1e293b; width: 100% !important;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" class="email-body-wrapper" style="background-color: #f3f4f6; margin: 0; padding: 16px 0; width: 100%;">
    <tr>
      <td align="center" class="email-outer-td" style="padding: 0 4px;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" class="email-container-table" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); overflow: hidden; border: 1px solid #e5e7eb;">
          ${bannerImg}
          <tr>
            <td class="email-content-cell" style="padding: 28px 24px 32px;">
              <div style="font-size: 15px; line-height: 1.65; color: #4b5563;">
                ${bodyContent}
              </div>
              ${attachmentsBlock}
            </td>
          </tr>

          <!-- Footer Cell -->
          <tr>
            <td align="center" class="email-footer-cell" style="padding: 24px 20px 30px; background-color: #fafafa; border-top: 1px solid #edf2f7; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 12px; color: #9ca3af; line-height: 1.5;">
                &copy; ${new Date().getFullYear()} ${branding.clubName}.
                <br />
                ${branding.footerAddress}
                ${branding.footerNote ? `<br /><span style="font-size: 11px; color: #b0b0b0; display: inline-block; margin-top: 4px;">${branding.footerNote}</span>` : ""}
              </p>
              <div style="margin-top: 10px;">
                <a href="${branding.websiteUrl}" target="_blank" style="color: #002e5b; text-decoration: none; font-size: 12px; margin: 0 10px; font-weight: 600;">Website</a>
                <span style="color: #cbd5e1;">|</span>
                <a href="${branding.contactUrl}" target="_blank" style="color: #002e5b; text-decoration: none; font-size: 12px; margin: 0 10px; font-weight: 600;">Support &amp; Contact</a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
    },
    [effectiveBannerUrl, attachments, branding]
  );

  // Apply selected template
  const applyTemplate = useCallback(
    (key: string) => {
      setSelectedTemplateKey(key);

      if (key === "blank") {
        if (!hasManuallyEditedSubject.current) {
          setSubject("Official Event Announcement");
        }
        const blankBody = buildFullTemplateContent("<p>Write your official event announcement here. Click directly into this email card to type, format text, and insert dynamic tokens.</p>");
        setMessage(blankBody);
        setCustomHtml(buildFullHtml(hasManuallyEditedSubject.current && subject ? subject : "Official Event Announcement", blankBody));
        setActiveSavedTemplateId(null);
        return;
      }

      // Check Saved Event Templates
      if (key.startsWith("saved_")) {
        const templateId = key.replace("saved_", "");
        const saved = savedEventTemplates.find((t) => t._id === templateId);
        if (saved) {
          setActiveSavedTemplateId(saved._id);
          setSubject(saved.subject || "");
          hasManuallyEditedSubject.current = true;
          if (saved.audience) setAudience(saved.audience);

          if (saved.bannerUrl) {
            setCustomBannerUrl(saved.bannerUrl);
            setBannerSource("custom");
          }

          if (Array.isArray(saved.attachments)) {
            setAttachments(saved.attachments);
          }

          if (saved.isHtml) {
            setCustomHtml(saved.body || "");
            setMessage(extractBodyFromHtml(saved.body || ""));
            setEditorMode("code");
          } else {
            setMessage(saved.body || "");
            setCustomHtml(buildFullHtml(saved.subject, saved.body, saved.bannerUrl, saved.attachments));
            setEditorMode("preview");
          }
          showToast(`Loaded saved template: ${saved.name}`);
          return;
        }
      }

      setActiveSavedTemplateId(null);

      // Check System Catalog Templates
      if (key.startsWith("system_")) {
        const actualKey = key.replace("system_", "");
        const st = systemTemplates.find((t) => t.key === actualKey);
        if (st) {
          if (!hasManuallyEditedSubject.current) {
            setSubject(st.subject || "Official Event Notice");
          }
          const bodyContent = st.html ? extractBodyFromHtml(st.html) : `<p>${st.description || ""}</p>`;
          setMessage(bodyContent);
          setCustomHtml(st.html || buildFullHtml(hasManuallyEditedSubject.current && subject ? subject : (st.subject || "Official Event Notice"), bodyContent));
          showToast(`Loaded system template: ${st.title}`);
          return;
        }
      }

      // Check Event Built-in Templates
      const t = eventTemplates.find((item) => item.key === key);
      if (t) {
        if (!hasManuallyEditedSubject.current) {
          setSubject(t.subject);
        }
        setMessage(t.body);
        setCustomHtml(buildFullHtml(hasManuallyEditedSubject.current && subject ? subject : t.subject, t.body));
      }
    },
    [savedEventTemplates, systemTemplates, eventTemplates, buildFullHtml, showToast, subject]
  );

  // Initial load: apply first template
  useEffect(() => {
    if (!subject && !message) {
      applyTemplate("confirmation");
    }
  }, [applyTemplate, subject, message]);

  // Combined options for Select dropdown
  const selectOptions = useMemo(() => {
    const list: { value: string; label: string }[] = [];

    // 1. Saved Event Templates
    if (savedEventTemplates.length > 0) {
      savedEventTemplates.forEach((st) => {
        list.push({
          value: `saved_${st._id}`,
          label: `📌 [Event Custom] ${st.name}`,
        });
      });
    }

    // 2. Built-in Event Operational Templates
    eventTemplates.forEach((t) => {
      list.push({
        value: t.key,
        label: t.title,
      });
    });

    // 3. System Templates
    if (systemTemplates.length > 0) {
      systemTemplates.forEach((st) => {
        list.push({
          value: `system_${st.key}`,
          label: `⚙️ [System] ${st.title}`,
        });
      });
    }

    // 4. Blank
    list.push({
      value: "blank",
      label: "✨ Blank / Custom Composition",
    });

    return list;
  }, [savedEventTemplates, eventTemplates, systemTemplates]);

  // Mode switching
  const handleSwitchMode = (mode: EditorMode) => {
    if (mode === "preview") {
      setMessage(extractBodyFromHtml(customHtml));
    } else {
      setCustomHtml(buildFullHtml(subject, message));
    }
    setEditorMode(mode);
  };

  // Backup of message with template tokens so user can toggle between tokens and mock data
  const messageTokensBackup = useRef<string | null>(null);

  // Helper to substitute realistic sample data into any text
  const fillSampleDataIntoHtml = useCallback(
    (htmlText: string) => {
      let result = htmlText
        .replace(/{{\s*greeting\s*}}/gi, "Hello, Md. Nasir Ahmed!")
        .replace(/{{\s*userName\s*}}/gi, "Md. Nasir Ahmed")
        .replace(/{{\s*name\s*}}/gi, "Md. Nasir Ahmed")
        .replace(/{{\s*email\s*}}/gi, "nasir@mec.edu.bd")
        .replace(/{{\s*eventName\s*}}/gi, event?.title || "Beyond Borders Seminar")
        .replace(/{{\s*eventDate\s*}}/gi, formattedEventDate)
        .replace(/{{\s*eventVenue\s*}}/gi, event?.location || "CSE Seminar Hall")
        .replace(/{{\s*clubName\s*}}/gi, branding.clubName);

      formFieldTokens.forEach((tk) => {
        const esc = tk.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        result = result.replace(new RegExp(`{{\\s*${esc}\\s*}}`, "gi"), tk.sample || `[${tk.name}]`);
        const norm = tk.name.replace(/[^a-z0-9]/gi, "");
        if (norm) {
          result = result.replace(new RegExp(`{{\\s*${norm}\\s*}}`, "gi"), tk.sample || `[${tk.name}]`);
        }
      });

      // Fallback replace common tokens
      result = result
        .replace(/{{\s*session\s*}}/gi, "2021-22")
        .replace(/{{\s*pubg[_ ]?id\s*}}/gi, "5123984124")
        .replace(/{{\s*phone\s*}}/gi, "+880 1712-345678")
        .replace(/{{\s*batch\s*}}/gi, "14th")
        .replace(/{{\s*team\s*}}/gi, "MEC CyberWolves")
        .replace(/{{\s*t_?shirt(_?size)?\s*}}/gi, "XL");

      return result;
    },
    [event?.title, event?.location, formattedEventDate, branding.clubName, formFieldTokens]
  );

  // Toggle or populate mock data right into the editor so user can edit it directly
  const handleFillSampleData = useCallback(() => {
    if (!useSampleData) {
      messageTokensBackup.current = message;
      const filled = fillSampleDataIntoHtml(message);
      setMessage(filled);
      setUseSampleData(true);
      showToast("Populated mock data into editor! You can now edit on top of it directly.", "success");
    } else {
      if (messageTokensBackup.current) {
        setMessage(messageTokensBackup.current);
      }
      setUseSampleData(false);
      showToast("Restored template with dynamic tokens.", "success");
    }
  }, [useSampleData, message, fillSampleDataIntoHtml, showToast]);

  // Mock data substituted body for live sample preview
  const samplePreviewBody = useMemo(() => {
    if (!useSampleData || !message) return message;
    return fillSampleDataIntoHtml(message);
  }, [useSampleData, message, fillSampleDataIntoHtml]);

  // Recipient and event tokens
  const recipientTokens: QuickTokenItem[] = useMemo(
    () => [
      { name: "userName", description: "Recipient Full Name (e.g. Jony)", sample: "Md. Nasir Ahmed" },
      { name: "email", description: "Recipient Email Address (e.g. responder email)", sample: "nasir@mec.edu.bd" },
      { name: "greeting", description: "Individual Greeting (e.g. Hello, Jony!)", sample: "Hello, Md. Nasir Ahmed!" },
      { name: "eventName", description: "Event Title", sample: event?.title || "MEC Event" },
      { name: "eventDate", description: "Scheduled Event Date", sample: formattedEventDate },
      { name: "eventVenue", description: "Event Venue / Hall", sample: event?.location || "CSE Seminar Hall" },
    ],
    [event?.title, event?.location, formattedEventDate]
  );

  // All combined tokens for editor
  const dynamicTokens: QuickTokenItem[] = useMemo(
    () => [...recipientTokens, ...formFieldTokens],
    [recipientTokens, formFieldTokens]
  );

  // Active saved template object
  const currentSavedTemplate = useMemo(() => {
    if (!activeSavedTemplateId) return null;
    return savedEventTemplates.find((t) => t._id === activeSavedTemplateId) || null;
  }, [activeSavedTemplateId, savedEventTemplates]);

  // Direct file attachment handler (no Cloudinary upload - attached directly to email like Gmail)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB limit per file for email
    const newAttachments: EmailAttachment[] = [];
    setUploadingAttachment(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (file.size > MAX_FILE_SIZE) {
          showToast(`"${file.name}" exceeds the 15MB email attachment limit.`, "error");
          continue;
        }

        const base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const res = reader.result as string;
            const commaIndex = res.indexOf(",");
            resolve(commaIndex !== -1 ? res.slice(commaIndex + 1) : res);
          };
          reader.onerror = (err) => reject(err);
          reader.readAsDataURL(file);
        });

        newAttachments.push({
          name: file.name,
          size: file.size,
          mimeType: file.type || "application/octet-stream",
          content: base64Data,
        });
      }

      if (newAttachments.length > 0) {
        setAttachments((prev) => [...prev, ...newAttachments]);
        showToast(
          newAttachments.length === 1
            ? `Attached "${newAttachments[0].name}" directly to email.`
            : `Attached ${newAttachments.length} files directly to email.`,
          "success"
        );
      }
    } catch (err: any) {
      console.error("Direct attachment read error:", err);
      showToast("Failed to read attached file.", "error");
    } finally {
      setUploadingAttachment(false);
      if (e.target) e.target.value = "";
    }
  };

  const handleAddAttachmentByUrl = () => {
    if (!attachmentUrlInput.trim() || !attachmentNameInput.trim()) {
      showToast("Please provide both document name and valid URL.", "error");
      return;
    }
    setAttachments((prev) => [
      ...prev,
      {
        name: attachmentNameInput.trim(),
        url: attachmentUrlInput.trim(),
      },
    ]);
    setAttachmentNameInput("");
    setAttachmentUrlInput("");
    setShowAddUrlModal(false);
    showToast("Attachment link added.", "success");
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // Open Save Modal
  const handleOpenSaveModal = () => {
    if (!subject.trim()) {
      showToast("Please enter an email subject line first.", "error");
      return;
    }
    const content = editorMode === "code" ? customHtml : message;
    if (!content.trim()) {
      showToast("Please enter message body content.", "error");
      return;
    }

    if (currentSavedTemplate) {
      setSaveTemplateName(currentSavedTemplate.name);
      setIsUpdateExisting(true);
    } else {
      setSaveTemplateName(`${event?.title || "Event"} - ${subject.slice(0, 30)}`);
      setIsUpdateExisting(false);
    }
    setShowSaveModal(true);
  };

  // Save or Update Template in Event Details
  const handleSaveEventTemplate = async () => {
    if (!saveTemplateName.trim()) {
      showToast("Please enter a name for this template.", "error");
      return;
    }

    const contentToSave = editorMode === "code" ? customHtml : message;
    if (!contentToSave.trim()) {
      showToast("Please enter message content before saving.", "error");
      return;
    }

    setSavingTemplate(true);
    try {
      const payload: any = {
        name: saveTemplateName.trim(),
        subject: subject.trim(),
        body: contentToSave.trim(),
        isHtml: editorMode === "code",
        audience,
        bannerUrl: effectiveBannerUrl,
        attachments,
        templateId: isUpdateExisting && activeSavedTemplateId ? activeSavedTemplateId : undefined,
      };

      const res = await axios.post(`${API}/events/${event._id}/email-templates`, payload, {
        withCredentials: true,
      });

      if (res.data?.success) {
        showToast(res.data.message || "Template saved to event successfully!", "success");
        setShowSaveModal(false);
        await fetchSavedTemplates();
        if (res.data.data?._id) {
          setSelectedTemplateKey(`saved_${res.data.data._id}`);
          setActiveSavedTemplateId(res.data.data._id);
        }
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to save template.", "error");
    } finally {
      setSavingTemplate(false);
    }
  };

  // Delete Saved Event Template
  const handleDeleteSavedTemplate = async () => {
    if (!activeSavedTemplateId) return;
    setDeletingTemplate(true);
    try {
      const res = await axios.delete(
        `${API}/events/${event._id}/email-templates/${activeSavedTemplateId}`,
        { withCredentials: true }
      );

      if (res.data?.success) {
        showToast("Event custom template deleted successfully.", "success");
        setShowDeleteConfirm(false);
        setActiveSavedTemplateId(null);
        await fetchSavedTemplates();
        applyTemplate("confirmation");
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to delete saved template.", "error");
    } finally {
      setDeletingTemplate(false);
    }
  };

  // Send Test Email
  const handleSendTestEmail = async () => {
    if (!testEmail || !testEmail.includes("@")) {
      showToast("Please enter a valid test recipient email address.", "error");
      return;
    }
    if (!subject.trim()) {
      showToast("Please enter an email subject line.", "error");
      return;
    }

    const contentToSend = editorMode === "code" ? customHtml : message;
    if (!contentToSend.trim()) {
      showToast("Please enter message content or HTML code.", "error");
      return;
    }

    setSendingTest(true);
    try {
      const parsedCc = ccEmails
        .split(/[\n,;]+/)
        .map((e) => e.trim())
        .filter((e) => e.includes("@"));

      const payload: any = {
        audience,
        subject: subject.trim(),
        message: contentToSend.trim(),
        isCustomHtml: editorMode === "code",
        isFullTemplate: editorMode === "preview",
        bannerUrl: effectiveBannerUrl,
        attachments,
        isTestSend: true,
        testEmail: testEmail.trim(),
        ccEmails: parsedCc.length > 0 ? parsedCc : undefined,
      };

      const res = await axios.post(`${API}/events/${event._id}/broadcast`, payload, {
        withCredentials: true,
      });

      if (res.data?.success) {
        showToast(res.data.message || `Test email dispatched to ${testEmail}!`, "success");
      }
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to send test email.", "error");
    } finally {
      setSendingTest(false);
    }
  };

  // Send Broadcast Handler
  const handleSendBroadcast = async () => {
    if (!subject.trim()) {
      showToast("Please enter an email subject line.", "error");
      return;
    }

    const contentToSend = editorMode === "code" ? customHtml : message;
    if (!contentToSend.trim()) {
      showToast("Please enter message content or HTML code.", "error");
      return;
    }

    setSending(true);
    try {
      const parsedCc = ccEmails
        .split(/[\n,;]+/)
        .map((e) => e.trim())
        .filter((e) => e.includes("@"));

      const payload: any = {
        audience,
        subject: subject.trim(),
        message: contentToSend.trim(),
        isCustomHtml: editorMode === "code",
        isFullTemplate: editorMode === "preview",
        bannerUrl: effectiveBannerUrl,
        attachments,
        deliveryMethod: deliverySystem,
        ccEmails: parsedCc.length > 0 ? parsedCc : undefined,
      };

      if (audience === "custom") {
        const parsedEmails = customEmails
          .split(/[\n,;]+/)
          .map((e) => e.trim())
          .filter((e) => e.includes("@"));

        if (parsedEmails.length === 0) {
          showToast("Please provide at least one valid recipient email address.", "error");
          setSending(false);
          return;
        }
        payload.customEmails = parsedEmails;
      }

      const res = await axios.post(`${API}/events/${event._id}/broadcast`, payload, {
        withCredentials: true,
      });

      if (res.data?.success) {
        showToast(res.data.message || "Broadcast dispatched successfully!", "success");
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
      {/* ── 1. Target Audience Cards ── */}
      <div className="bg-surface-elevated rounded-2xl border-2 border-border-brutalist dark:border-border-default p-5 shadow-[4px_4px_0px_0px_var(--border-brutalist)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-text-primary text-base flex items-center gap-2">
              <Users className="w-5 h-5 text-accent-primary" />
              1. Target Audience
            </h3>
            <p className="text-xs text-text-tertiary mt-0.5">
              Select who will receive this official email broadcast.
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 w-fit">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Configurable Delivery System
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
              color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/30",
            },
            {
              id: "pending_registrants" as AudienceType,
              title: "Form Applicants",
              desc: "Submitted registration form responses",
              count: recipientCounts.pending,
              icon: Clock,
              color: "text-amber-600 bg-amber-500/10 border-amber-500/30",
            },
            {
              id: "volunteers" as AudienceType,
              title: "Organizers & Volunteers",
              desc: "Event organizers, committee & staff",
              count: recipientCounts.volunteers,
              icon: UserCheck,
              color: "text-blue-600 bg-blue-500/10 border-blue-500/30",
            },
            {
              id: "sponsors" as AudienceType,
              title: "Event Sponsors",
              desc: "Partner organizations and brand contacts",
              count: recipientCounts.sponsors,
              icon: Building2,
              color: "text-purple-600 bg-purple-500/10 border-purple-500/30",
            },
            {
              id: "all" as AudienceType,
              title: "All Stakeholders",
              desc: "Broadcast to all above groups combined",
              count: recipientCounts.all,
              icon: Globe,
              color: "text-indigo-600 bg-indigo-500/10 border-indigo-500/30",
            },
            {
              id: "custom" as AudienceType,
              title: "Custom Email List",
              desc: "Manually specify recipient emails",
              count: "Custom",
              icon: Mail,
              color: "text-slate-600 bg-slate-500/10 border-slate-500/30",
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
                    ? "border-accent-primary bg-accent-primary/10 shadow-[2px_2px_0px_0px_var(--border-brutalist)]"
                    : "border-border-default hover:bg-surface-secondary bg-surface-secondary/40"
                }`}
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`p-1.5 rounded-lg border ${item.color}`}>
                      <Icon className="w-4 h-4" />
                    </span>
                    <h4 className="font-bold text-text-primary text-xs sm:text-sm truncate">
                      {item.title}
                    </h4>
                  </div>
                  <p className="text-[11px] text-text-tertiary leading-tight">{item.desc}</p>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-surface-elevated text-text-secondary border border-border-default">
                    {typeof item.count === "number" ? `${item.count} rec.` : item.count}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {audience === "custom" && (
          <div className="pt-2 animate-fade-in space-y-1">
            <label className="text-xs font-bold text-text-secondary">
              Recipient Email Addresses (comma or newline separated):
            </label>
            <textarea
              rows={3}
              value={customEmails}
              onChange={(e) => setCustomEmails(e.target.value)}
              placeholder="e.g. participant@gmail.com, judge@industry.com, speaker@university.edu"
              className="w-full p-2.5 rounded-xl border border-border-default bg-surface-secondary text-xs text-text-primary focus:border-accent-primary outline-none"
            />
          </div>
        )}
      </div>

      {/* ── 2. Delivery & Dispatch ── */}
      <div className="bg-surface-elevated rounded-2xl border-2 border-border-brutalist dark:border-border-default p-4 shadow-[4px_4px_0px_0px_var(--border-brutalist)] space-y-3">
        {/* Header row with inline protocol toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="font-bold text-text-primary text-sm flex items-center gap-2">
            <Mail className="w-4 h-4 text-accent-primary" />
            2. Delivery & Dispatch
          </h3>

          {/* Compact Protocol Toggle with BCC, CC, and Individual */}
          <div className="inline-flex items-center rounded-xl border border-border-default bg-surface-secondary overflow-hidden text-xs">
            <button
              type="button"
              onClick={() => setDeliverySystem("bcc")}
              className={`px-3 py-1.5 font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                deliverySystem === "bcc"
                  ? "bg-accent-primary text-text-primary shadow-sm"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated"
              }`}
              title="Recipients hidden in BCC batch"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              BCC Batch
              {deliverySystem === "bcc" && <Check className="w-3 h-3" />}
            </button>
            <button
              type="button"
              onClick={() => setDeliverySystem("cc")}
              className={`px-3 py-1.5 font-bold transition-all cursor-pointer flex items-center gap-1.5 border-l border-border-default ${
                deliverySystem === "cc"
                  ? "bg-accent-primary text-text-primary shadow-sm"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated"
              }`}
              title="Recipients visible to each other in CC batch"
            >
              <Users className="w-3.5 h-3.5" />
              CC Batch
              {deliverySystem === "cc" && <Check className="w-3 h-3" />}
            </button>
            <button
              type="button"
              onClick={() => setDeliverySystem("individual")}
              className={`px-3 py-1.5 font-bold transition-all cursor-pointer flex items-center gap-1.5 border-l border-border-default ${
                deliverySystem === "individual"
                  ? "bg-accent-primary text-text-primary shadow-sm"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated"
              }`}
              title="Separate 1-to-1 personalized email per recipient"
            >
              <UserCheck2 className="w-3.5 h-3.5" />
              Individual
              {deliverySystem === "individual" && <Check className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Protocol description (compact) */}
        <p className="text-[11px] text-text-tertiary leading-snug">
          {deliverySystem === "bcc" && "BCC batch dispatch — sends in chunks of 50. All recipient emails remain private and hidden from each other."}
          {deliverySystem === "cc" && "CC batch dispatch — sends with recipients in CC. All recipients can see each other's email (ideal for committees, judges & teams)."}
          {deliverySystem === "individual" && "Individual dispatch — sends separate 1-to-1 emails. Each recipient gets a personalized greeting with their name."}
        </p>

        {/* CC & Test Email row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {/* CC Field */}
          <div className="p-3 bg-surface-secondary/70 rounded-xl border border-border-default text-xs space-y-1.5">
            <label className="font-bold text-text-primary flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-500" />
              CC (Carbon Copy)
            </label>
            <input
              type="text"
              value={ccEmails}
              onChange={(e) => setCcEmails(e.target.value)}
              placeholder="cc1@email.com, cc2@email.com"
              className="w-full px-3 py-1.5 rounded-xl border border-border-default bg-surface-elevated text-xs text-text-primary outline-none focus:border-accent-primary"
            />
            <p className="text-[10px] text-text-tertiary">Comma-separated. These recipients will be visible to all.</p>
          </div>

          {/* Test Email */}
          <div className="p-3 bg-surface-secondary/70 rounded-xl border border-border-default text-xs space-y-1.5">
            <label className="font-bold text-text-primary flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              Send Test Copy
            </label>
            <div className="flex items-center gap-2">
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="admin@email.com"
                className="flex-1 px-3 py-1.5 rounded-xl border border-border-default bg-surface-elevated text-xs text-text-primary outline-none focus:border-accent-primary"
              />
              <button
                type="button"
                onClick={handleSendTestEmail}
                disabled={sendingTest}
                className="px-3 py-1.5 rounded-xl bg-accent-primary text-text-primary font-bold text-xs border border-border-brutalist shadow-[2px_2px_0px_0px_var(--border-brutalist)] hover:opacity-95 transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer whitespace-nowrap"
              >
                {sendingTest ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                Test
              </button>
            </div>
            <p className="text-[10px] text-text-tertiary">Preview the email in your own inbox before broadcasting.</p>
          </div>
        </div>
      </div>

      {/* ── 3. Live Email Studio Workspace (Matching Administration Template Studio) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ── Left Sidebar (lg:col-span-4): Templates, Banner, Attachments & Tokens ── */}
        <div className="lg:col-span-4 space-y-4">
          {/* Template Catalog Card */}
          <div className="bg-surface-elevated rounded-2xl border-2 border-border-brutalist dark:border-border-default p-4 shadow-[4px_4px_0px_0px_var(--border-brutalist)] space-y-3">
            <div className="flex items-center justify-between border-b border-border-default pb-3">
              <div>
                <h3 className="text-sm font-black text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <Layout className="w-4 h-4 text-accent-primary" />
                  Templates Catalog
                </h3>
                <span className="text-[11px] font-mono text-text-tertiary">
                  {selectOptions.length} templates available
                </span>
              </div>

              <button
                type="button"
                onClick={handleOpenSaveModal}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-accent-primary text-text-primary text-xs font-bold border border-border-brutalist shadow-[2px_2px_0px_0px_var(--border-brutalist)] hover:opacity-95 transition cursor-pointer"
                title="Save current composition as template"
              >
                <BookmarkPlus size={13} />
                <span>Save</span>
              </button>
            </div>

            {/* Template Selector Dropdown */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-text-secondary">
                Select Template:
              </label>
              <Select
                value={selectedTemplateKey}
                onChange={(val) => applyTemplate(val)}
                options={selectOptions}
                placeholder="Choose an email template..."
              />
            </div>

            {/* Active Template Status & Delete */}
            {currentSavedTemplate && (
              <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between text-xs animate-fade-in">
                <div className="min-w-0 pr-2">
                  <span className="font-bold text-amber-700 dark:text-amber-300 truncate block">
                    📌 {currentSavedTemplate.name}
                  </span>
                  <span className="text-[10px] text-text-tertiary">Custom Event Template</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-1 rounded-lg text-red-500 hover:bg-red-500/10 transition cursor-pointer"
                  title="Delete saved template"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            )}
          </div>

          {/* Header Banner Selection Card */}
          <div className="bg-surface-elevated rounded-2xl border-2 border-border-brutalist dark:border-border-default p-4 shadow-[4px_4px_0px_0px_var(--border-brutalist)] space-y-3">
            <div className="flex items-center justify-between border-b border-border-default pb-2">
              <h4 className="text-xs font-black text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-accent-primary" />
                Header Banner Image
              </h4>
              <span className="text-[10px] text-text-tertiary">Per-Event</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => setBannerSource("event")}
                className={`px-2 py-1.5 rounded-lg border font-bold text-[11px] flex items-center justify-center gap-1 transition cursor-pointer ${
                  bannerSource === "event"
                    ? "bg-accent-primary text-text-primary border-border-brutalist shadow-[1px_1px_0px_0px_var(--border-brutalist)]"
                    : "bg-surface-secondary text-text-secondary border-border-default hover:text-text-primary"
                }`}
              >
                🎪 Event Banner
              </button>

              <button
                type="button"
                onClick={() => setBannerSource("global")}
                className={`px-2 py-1.5 rounded-lg border font-bold text-[11px] flex items-center justify-center gap-1 transition cursor-pointer ${
                  bannerSource === "global"
                    ? "bg-accent-primary text-text-primary border-border-brutalist shadow-[1px_1px_0px_0px_var(--border-brutalist)]"
                    : "bg-surface-secondary text-text-secondary border-border-default hover:text-text-primary"
                }`}
              >
                🌐 Global Banner
              </button>

              <button
                type="button"
                onClick={() => setBannerSource("custom")}
                className={`px-2 py-1.5 rounded-lg border font-bold text-[11px] flex items-center justify-center gap-1 transition cursor-pointer ${
                  bannerSource === "custom"
                    ? "bg-accent-primary text-text-primary border-border-brutalist shadow-[1px_1px_0px_0px_var(--border-brutalist)]"
                    : "bg-surface-secondary text-text-secondary border-border-default hover:text-text-primary"
                }`}
              >
                🔗 Custom URL
              </button>

              <button
                type="button"
                onClick={() => setBannerSource("none")}
                className={`px-2 py-1.5 rounded-lg border font-bold text-[11px] flex items-center justify-center gap-1 transition cursor-pointer ${
                  bannerSource === "none"
                    ? "bg-accent-primary text-text-primary border-border-brutalist shadow-[1px_1px_0px_0px_var(--border-brutalist)]"
                    : "bg-surface-secondary text-text-secondary border-border-default hover:text-text-primary"
                }`}
              >
                🚫 No Banner
              </button>
            </div>

            {bannerSource === "custom" && (
              <input
                type="url"
                value={customBannerUrl}
                onChange={(e) => setCustomBannerUrl(e.target.value)}
                placeholder="https://.../banner.jpg"
                className="w-full px-3 py-1.5 rounded-xl border border-border-default bg-surface-secondary text-xs text-text-primary font-mono focus:border-accent-primary outline-none"
              />
            )}

            {effectiveBannerUrl && (
              <div className="h-16 w-full rounded-xl overflow-hidden border border-border-default bg-slate-950 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={effectiveBannerUrl}
                  alt="Banner preview"
                  className="w-full h-full object-cover select-none"
                />
              </div>
            )}
          </div>

          {/* Attachments & Documents Card */}
          <div className="bg-surface-elevated rounded-2xl border-2 border-border-brutalist dark:border-border-default p-4 shadow-[4px_4px_0px_0px_var(--border-brutalist)] space-y-3">
            <div className="flex items-center justify-between border-b border-border-default pb-2">
              <h4 className="text-xs font-black text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                <Paperclip className="w-3.5 h-3.5 text-accent-primary" />
                Attachments ({attachments.filter((a) => a.content).length} files{attachments.some((a) => !a.content && a.url) ? `, ${attachments.filter((a) => !a.content && a.url).length} links` : ""})
              </h4>

              <div className="flex items-center gap-1.5">
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAttachment}
                  className="px-2.5 py-1 rounded-lg bg-surface-secondary hover:bg-surface-elevated text-text-primary border border-border-default text-[11px] font-bold transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  title="Attach file directly to email (like Gmail)"
                >
                  {uploadingAttachment ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Paperclip className="w-3 h-3" />
                  )}
                  Attach File
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddUrlModal(true)}
                  className="px-2.5 py-1 rounded-lg bg-surface-secondary hover:bg-surface-elevated text-text-primary border border-border-default text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                  title="Add external document link (e.g. Google Drive)"
                >
                  <Plus className="w-3 h-3" />
                  URL Link
                </button>
              </div>
            </div>

            {attachments.length > 0 ? (
              <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                {attachments.map((att, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-2 p-2 rounded-xl border border-border-default bg-surface-secondary text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-3.5 h-3.5 text-accent-primary flex-shrink-0" />
                      <div className="truncate min-w-0">
                        <span className="font-semibold text-text-primary truncate block">{att.name}</span>
                        <div className="flex items-center gap-1.5 text-[10px] text-text-tertiary">
                          {att.size && <span>{(att.size / 1024).toFixed(0)} KB</span>}
                          {att.content ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Direct Attachment 📎</span>
                          ) : (
                            <span className="text-blue-500 font-medium truncate max-w-[120px]">External Link</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(idx)}
                      className="text-text-tertiary hover:text-red-500 transition cursor-pointer flex-shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-text-tertiary italic">
                No files attached yet. Attach PDFs, rulebooks, certificates, or schedules directly to this email.
              </p>
            )}
          </div>

          {/* Dynamic Personalization Tokens */}
          <div className="bg-surface-elevated rounded-2xl border-2 border-border-brutalist dark:border-border-default p-4 shadow-[4px_4px_0px_0px_var(--border-brutalist)] space-y-3">
            <div className="flex items-center justify-between border-b border-border-default pb-2">
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={13} className="text-accent-primary" />
                Dynamic Personalization Tokens
              </h4>
              <span className="text-[10px] text-text-tertiary">Click to copy</span>
            </div>

            <p className="text-[11px] text-text-tertiary leading-relaxed">
              Click any token to copy it and paste into Subject or Body. Replaced automatically per recipient:
            </p>

            {/* Quick Fill Mock Data action button */}
            <button
              type="button"
              onClick={handleFillSampleData}
              className={`w-full py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-98 ${
                useSampleData
                  ? "bg-accent-primary text-text-primary border-border-brutalist shadow-[1px_1px_0px_0px_var(--border-brutalist)] font-bold"
                  : "bg-surface-secondary hover:bg-surface-elevated text-text-primary border-border-default"
              }`}
              title="Populate realistic mock data directly into the editor so you can edit it immediately"
            >
              <Sparkles size={13} className={useSampleData ? "text-text-primary" : "text-accent-primary"} />
              <span>{useSampleData ? "Mock Data: Populated (Click to Revert)" : "✨ Fill Mock Data to Edit"}</span>
            </button>

            {formFieldTokens.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-accent-primary uppercase tracking-wider block">
                  📋 From Registration Form
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {formFieldTokens.map((tok) => (
                    <button
                      key={tok.name}
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(`{{${tok.name}}}`);
                        showToast(`Copied {{${tok.name}}} to clipboard!`, "success");
                      }}
                      className="group inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-surface-secondary hover:bg-accent-primary/20 text-text-primary border border-border-default font-mono text-[10px] font-bold transition cursor-pointer shadow-2xs active:scale-95"
                      title={`${tok.description} (Sample: ${tok.sample}) — Click to copy`}
                    >
                      <span>&#123;&#123;{tok.name}&#125;&#125;</span>
                      <Copy size={10} className="text-text-tertiary group-hover:text-accent-primary transition" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">
                👤 Recipient &amp; Event Details
              </span>
              <div className="flex flex-wrap gap-1.5">
                {recipientTokens.map((tok) => (
                  <button
                    key={tok.name}
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(`{{${tok.name}}}`);
                      showToast(`Copied {{${tok.name}}} to clipboard!`, "success");
                    }}
                    className="group inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-surface-secondary hover:bg-accent-primary/20 text-text-primary border border-border-default font-mono text-[10px] font-bold transition cursor-pointer shadow-2xs active:scale-95"
                    title={`${tok.description} (Sample: ${tok.sample}) — Click to copy`}
                  >
                    <span>&#123;&#123;{tok.name}&#125;&#125;</span>
                    <Copy size={10} className="text-text-tertiary group-hover:text-accent-primary transition" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Content (lg:col-span-8): Subject, Mode Switcher & RichTextEditor Canvas ── */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-surface-elevated rounded-2xl border-2 border-border-brutalist dark:border-border-default p-5 shadow-[4px_4px_0px_0px_var(--border-brutalist)] space-y-4">
            {/* Header with Title and Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-default pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-text-primary">
                    Live Email Studio &amp; Preview
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border bg-accent-primary/10 text-text-primary border-accent-primary">
                    Interactive
                  </span>
                </div>
                <p className="text-xs text-text-secondary mt-0.5">
                  Modify your message directly inside the email preview card below in real time.
                </p>
              </div>

              {/* Action Buttons: Send Test & Send Broadcast */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleSendTestEmail}
                  disabled={sendingTest}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-secondary hover:bg-surface-elevated text-text-secondary hover:text-text-primary border border-border-default text-xs font-bold transition cursor-pointer disabled:opacity-50"
                >
                  {sendingTest ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                  Send Test
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!subject.trim()) {
                      showToast("Please provide an email subject line.", "error");
                      return;
                    }
                    const content = editorMode === "code" ? customHtml : message;
                    if (!content.trim()) {
                      showToast("Please provide message content.", "error");
                      return;
                    }
                    setShowConfirmModal(true);
                  }}
                  disabled={sending}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-accent-primary text-text-primary font-bold text-xs border border-border-brutalist shadow-[2px_2px_0px_0px_var(--border-brutalist)] hover:opacity-95 disabled:opacity-50 cursor-pointer"
                >
                  {sending ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                  Broadcast Email
                </button>
              </div>
            </div>

            {/* Subject Line Input */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-text-secondary">
                  Email Subject Line <span className="text-red-500">*</span>
                </label>
                <span className="text-[10px] text-text-tertiary font-mono">
                  Tokens like &#123;&#123;userName&#125;&#125; work in subject too
                </span>
              </div>
              <input
                type="text"
                value={subject}
                onChange={(e) => {
                  hasManuallyEditedSubject.current = true;
                  setSubject(e.target.value);
                }}
                className="w-full px-3.5 py-2.5 bg-surface-secondary border border-border-default rounded-xl text-xs text-text-primary font-semibold focus:outline-none focus:border-accent-primary"
                placeholder="Write email subject line manually (e.g. Registration Approved & Confirmation)..."
              />
            </div>

            {/* View Mode Toolbar: Live Preview & Editor vs HTML Source */}
            <div className="flex items-center justify-between border-b border-border-default/60 pb-2.5 flex-wrap gap-2">
              <div className="flex items-center p-1 bg-surface-secondary border border-border-default rounded-xl gap-0.5">
                <button
                  type="button"
                  onClick={() => handleSwitchMode("preview")}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    editorMode === "preview"
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
                    editorMode === "code"
                      ? "bg-accent-primary text-text-primary shadow-xs"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  <Code size={13} />
                  HTML Source Code
                </button>
              </div>

              {editorMode === "preview" && (
                <span className="text-[11px] font-mono text-text-tertiary">
                  In-Place Live Preview Studio
                </span>
              )}

              {editorMode === "code" && (
                <span className="text-[11px] font-mono text-text-tertiary">
                  Complete HTML5 Document
                </span>
              )}
            </div>

            {/* Editor Workspace */}
            <div className="border border-border-default rounded-2xl overflow-hidden bg-slate-950/5 min-h-[500px]">
              {editorMode === "preview" ? (
                <div className="p-3 sm:p-4 bg-surface-primary">
                  <RichTextEditor
                    value={message}
                    onChange={(val) => setMessage(val)}
                    variant="email-canvas"
                    minHeight="280px"
                    placeholder="Click directly into the email card body to type and style your message in-place..."
                    emailMetadata={{
                      bannerUrl: effectiveBannerUrl,
                      hideBanner: bannerSource === "none",
                      clubName: branding.clubName,
                      footerAddress: branding.footerAddress,
                      footerNote: branding.footerNote,
                      previewDevice,
                      useSampleData,
                      cardChildren:
                        attachments.length > 0 ? (
                          <div className="p-4 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-2 select-none">
                            <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300 text-xs uppercase tracking-wider">
                              <Paperclip className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
                              <span>Attached Documents &amp; Files ({attachments.length})</span>
                            </div>
                            <div className="divide-y divide-emerald-100 dark:divide-emerald-900/60 text-xs">
                              {attachments.map((att, i) => (
                                <div
                                  key={i}
                                  className="py-2 flex items-center justify-between gap-2"
                                >
                                  <span className="text-emerald-900 dark:text-emerald-200 font-semibold truncate flex items-center gap-1.5">
                                    <FileText className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 flex-shrink-0" />
                                    <span className="truncate">{att.name}</span>
                                    {att.size ? (
                                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-normal flex-shrink-0">
                                        ({(att.size / 1024).toFixed(1)} KB)
                                      </span>
                                    ) : null}
                                  </span>
                                  <span className="px-2.5 py-0.5 rounded bg-emerald-700 dark:bg-emerald-600 text-white text-[10px] font-bold shadow-2xs flex-shrink-0">
                                    Download
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : undefined,
                      extraControls: (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleFillSampleData}
                            className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition cursor-pointer flex items-center gap-1.5 ${
                              useSampleData
                                ? "bg-accent-primary text-text-primary border-border-brutalist shadow-[1px_1px_0px_0px_var(--border-brutalist)] font-bold"
                                : "bg-surface-elevated text-text-secondary hover:text-text-primary border-border-default"
                            }`}
                            title="Fill real mock data into editor so you can edit and modify it directly"
                          >
                            <Sparkles size={12} className={useSampleData ? "text-text-primary" : "text-accent-primary"} />
                            {useSampleData ? "Mock Data: Populated (Click to Revert)" : "✨ Fill Mock Data to Edit"}
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
                    rows={22}
                    value={customHtml}
                    onChange={(e) => {
                      setCustomHtml(e.target.value);
                      setMessage(extractBodyFromHtml(e.target.value));
                    }}
                    className="w-full font-mono text-xs p-3.5 bg-surface-secondary text-text-primary rounded-xl border border-border-default focus:outline-none focus:border-accent-primary leading-relaxed resize-y"
                    placeholder="<!DOCTYPE html><html>...</html>"
                  />
                </div>
              )}
            </div>

            {/* Bottom Summary Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-border-default text-xs text-text-tertiary">
              <div>
                Target: <strong className="text-text-primary capitalize">{audience.replace(/_/g, " ")}</strong> • Protocol: <strong className="text-text-primary capitalize">{deliverySystem === "bcc" ? "BCC Batch" : deliverySystem === "cc" ? "CC Batch" : "1-to-1"}</strong> • Attachments: <strong className="text-text-primary">{attachments.filter((a) => a.content).length}</strong>{attachments.some((a) => !a.content && a.url) && <> • Links: <strong className="text-text-primary">{attachments.filter((a) => !a.content && a.url).length}</strong></>}{ccEmails.trim() && <> • CC: <strong className="text-text-primary">{ccEmails.split(/[\n,;]+/).filter((e) => e.trim().includes("@")).length}</strong></>}
              </div>

              <button
                type="button"
                onClick={() => {
                  if (!subject.trim()) {
                    showToast("Please provide an email subject line.", "error");
                    return;
                  }
                  const content = editorMode === "code" ? customHtml : message;
                  if (!content.trim()) {
                    showToast("Please provide message content.", "error");
                    return;
                  }
                  setShowConfirmModal(true);
                }}
                disabled={sending}
                className="px-5 py-2 rounded-xl bg-accent-primary text-text-primary font-bold text-xs sm:text-sm border border-border-brutalist shadow-[2px_2px_0px_0px_var(--border-brutalist)] hover:opacity-95 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                Send Email Broadcast
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Broadcast Confirmation Modal ── */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-elevated border-2 border-border-brutalist dark:border-border-default rounded-2xl max-w-lg w-full p-6 shadow-[6px_6px_0px_0px_var(--border-brutalist)] space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-border-default pb-3">
              <h3 className="font-bold text-base text-text-primary flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                Confirm Email Broadcast Dispatch
              </h3>
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="text-text-tertiary hover:text-text-primary p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-text-secondary leading-relaxed">
                You are about to broadcast an official email to all registered recipients in this group. Please review dispatch details:
              </p>

              <div className="p-3 rounded-xl bg-surface-secondary border border-border-default space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Subject Line:</span>
                  <span className="font-bold text-text-primary truncate max-w-[260px]">{subject}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Target Audience:</span>
                  <span className="font-bold text-text-primary capitalize">{audience.replace(/_/g, " ")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Delivery Protocol:</span>
                  <span className="font-bold text-text-primary">
                    {deliverySystem === "bcc" ? "BCC Batch (Private / 50 per batch)" : deliverySystem === "cc" ? "CC Batch (Recipients visible to each other)" : "1-to-1 Individual Dispatch"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Attachments & Links:</span>
                  <span className="font-bold text-text-primary">
                    {attachments.filter((a) => a.content).length} attached file(s)
                    {attachments.some((a) => !a.content && a.url) ? `, ${attachments.filter((a) => !a.content && a.url).length} link(s)` : ""}
                  </span>
                </div>
                {ccEmails.trim() && (
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">CC Recipients:</span>
                    <span className="font-bold text-text-primary truncate max-w-[260px]">{ccEmails.split(/[\n,;]+/).filter((e) => e.trim().includes("@")).join(", ")}</span>
                  </div>
                )}
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-700 dark:text-amber-300 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  Irreversible Broadcast Action
                </p>
                <p className="text-[11px] leading-tight">
                  Once initiated, emails will be delivered directly to real user inboxes. Make sure you have tested the message rendering first!
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-default">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-xl border border-border-default text-text-secondary hover:text-text-primary text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendBroadcast}
                disabled={sending}
                className="px-5 py-2 rounded-xl bg-accent-primary text-text-primary font-bold text-xs border border-border-brutalist shadow-[2px_2px_0px_0px_var(--border-brutalist)] hover:opacity-95 transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                {sending ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                Confirm &amp; Send Broadcast
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Save Template Modal ── */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-elevated border-2 border-border-brutalist dark:border-border-default rounded-2xl max-w-md w-full p-6 shadow-[6px_6px_0px_0px_var(--border-brutalist)] space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-border-default pb-3">
              <h3 className="font-bold text-base text-text-primary flex items-center gap-2">
                <BookmarkPlus className="w-5 h-5 text-accent-primary" />
                {isUpdateExisting ? "Update Event Template" : "Save as Event Template"}
              </h3>
              <button
                type="button"
                onClick={() => setShowSaveModal(false)}
                className="text-text-tertiary hover:text-text-primary p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-text-secondary">Template Name:</label>
                <input
                  type="text"
                  value={saveTemplateName}
                  onChange={(e) => setSaveTemplateName(e.target.value)}
                  placeholder="e.g. Beyond Borders - Registration Approved"
                  className="w-full px-3 py-2 rounded-xl border border-border-default bg-surface-secondary text-text-primary text-xs focus:border-accent-primary outline-none font-semibold"
                />
              </div>

              <p className="text-[11px] text-text-tertiary leading-relaxed">
                Saving this template allows you or other event managers to reuse this exact subject, body, banner, and attachments across future announcements for this event.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-default">
              <button
                type="button"
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 rounded-xl border border-border-default text-text-secondary hover:text-text-primary text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEventTemplate}
                disabled={savingTemplate}
                className="px-4 py-2 rounded-xl bg-accent-primary text-text-primary font-bold text-xs border border-border-brutalist shadow-[2px_2px_0px_0px_var(--border-brutalist)] hover:opacity-95 transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                {savingTemplate ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                {isUpdateExisting ? "Update Template" : "Save Template"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add URL Attachment Modal ── */}
      {showAddUrlModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-elevated border-2 border-border-brutalist dark:border-border-default rounded-2xl max-w-md w-full p-6 shadow-[6px_6px_0px_0px_var(--border-brutalist)] space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-border-default pb-3">
              <h3 className="font-bold text-base text-text-primary flex items-center gap-2">
                <Paperclip className="w-5 h-5 text-accent-primary" />
                Add External Document Link
              </h3>
              <button
                type="button"
                onClick={() => setShowAddUrlModal(false)}
                className="text-text-tertiary hover:text-text-primary p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-text-secondary">Document Display Name:</label>
                <input
                  type="text"
                  value={attachmentNameInput}
                  onChange={(e) => setAttachmentNameInput(e.target.value)}
                  placeholder="e.g. Event Rulebook & Guidelines (PDF)"
                  className="w-full px-3 py-2 rounded-xl border border-border-default bg-surface-secondary text-text-primary text-xs focus:border-accent-primary outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-text-secondary">Destination File URL:</label>
                <input
                  type="url"
                  value={attachmentUrlInput}
                  onChange={(e) => setAttachmentUrlInput(e.target.value)}
                  placeholder="https://drive.google.com/... or https://res.cloudinary.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-border-default bg-surface-secondary text-text-primary text-xs font-mono focus:border-accent-primary outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-default">
              <button
                type="button"
                onClick={() => setShowAddUrlModal(false)}
                className="px-4 py-2 rounded-xl border border-border-default text-text-secondary hover:text-text-primary text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddAttachmentByUrl}
                className="px-4 py-2 rounded-xl bg-accent-primary text-text-primary font-bold text-xs border border-border-brutalist shadow-[2px_2px_0px_0px_var(--border-brutalist)] hover:opacity-95 transition cursor-pointer"
              >
                Add Attachment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Saved Template Confirmation Modal ── */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-elevated border-2 border-border-brutalist dark:border-border-default rounded-2xl max-w-sm w-full p-5 shadow-[6px_6px_0px_0px_var(--border-brutalist)] space-y-4 animate-scale-up">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-sm">
              <Trash2 size={16} />
              <span>Delete Saved Template?</span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Are you sure you want to delete template &quot;<strong>{currentSavedTemplate?.name}</strong>&quot;? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1.5 rounded-xl border border-border-default text-text-secondary hover:text-text-primary text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteSavedTemplate}
                disabled={deletingTemplate}
                className="px-3.5 py-1.5 rounded-xl bg-red-600 text-white font-bold text-xs transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                {deletingTemplate ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
