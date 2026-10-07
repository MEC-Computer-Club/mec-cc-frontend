"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Quote,
  Code,
  Link as LinkIcon,
  Undo,
  Redo,
  Sparkles,
  Plus,
  MousePointerClick,
  Info,
  AlertTriangle,
  CheckCircle2,
  Bookmark,
  Calendar,
  Minus,
  X,
  ChevronDown,
  Check,
  Maximize2,
  Layers,
  Copy,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";

export interface QuickTokenItem {
  name: string;
  description: string;
  sample: string;
}

export interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  label?: string;
  disabled?: boolean;
  resizable?: boolean;

  // Live Email Studio Canvas Mode
  variant?: "default" | "email-canvas";
  emailMetadata?: {
    bannerUrl?: string;
    clubName?: string;
    footerAddress?: string;
    footerNote?: string;
    previewDevice?: "desktop" | "mobile";
    useSampleData?: boolean;
    sampleDataHtml?: string;
    quickTokens?: QuickTokenItem[];
    extraControls?: React.ReactNode;
    hideBanner?: boolean;
    headerContent?: React.ReactNode;
    cardChildren?: React.ReactNode;
  };
}

interface ToolbarAction {
  icon: React.ReactNode;
  command: string;
  arg?: string;
  title: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your detailed description here...",
  minHeight = "220px",
  label,
  disabled = false,
  resizable = true,
  variant = "default",
  emailMetadata,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInternalChangeRef = useRef(false);

  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false,
    h2: false,
    h3: false,
    blockquote: false,
    pre: false,
    insertUnorderedList: false,
    insertOrderedList: false,
  });

  // Keep content in sync with external value without resetting cursor
  useEffect(() => {
    if (!editorRef.current) return;
    if (isInternalChangeRef.current) {
      isInternalChangeRef.current = false;
      return;
    }

    const currentHtml = editorRef.current.innerHTML;
    const nextHtml = value || "";
    if (currentHtml !== nextHtml) {
      editorRef.current.innerHTML = nextHtml;
    }
  }, [value]);

  const updateActiveFormats = useCallback(() => {
    if (!editorRef.current) return;

    try {
      const isBold = document.queryCommandState("bold");
      const isItalic = document.queryCommandState("italic");
      const isUnderline = document.queryCommandState("underline");
      const isStrike = document.queryCommandState("strikeThrough");
      const isUl = document.queryCommandState("insertUnorderedList");
      const isOl = document.queryCommandState("insertOrderedList");

      let isH2 = false;
      let isH3 = false;
      let isQuote = false;
      let isPre = false;

      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0 && editorRef.current) {
        for (const startNode of [sel.anchorNode, sel.focusNode]) {
          let node: Node | null = startNode;
          while (node && node !== editorRef.current && node !== document.body) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const el = node as HTMLElement;
              const tag = el.tagName?.toLowerCase();
              if (tag === "h2" || el.getAttribute("data-inline-h2") === "true") isH2 = true;
              if (tag === "h3" || el.getAttribute("data-inline-h3") === "true") isH3 = true;
              if (tag === "blockquote") isQuote = true;
              if (tag === "pre" || tag === "code") isPre = true;
            }
            node = node.parentNode;
          }
        }
      }

      setActiveFormats({
        bold: isBold,
        italic: isItalic,
        underline: isUnderline,
        strikeThrough: isStrike,
        h2: isH2,
        h3: isH3,
        blockquote: isQuote,
        pre: isPre,
        insertUnorderedList: isUl,
        insertOrderedList: isOl,
      });
    } catch {
      // Ignore queryCommandState error in unfocused states
    }
  }, []);

  useEffect(() => {
    const handleSelectionChange = () => {
      const sel = window.getSelection();
      if (
        sel &&
        editorRef.current &&
        sel.anchorNode &&
        editorRef.current.contains(sel.anchorNode)
      ) {
        updateActiveFormats();
      }
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () =>
      document.removeEventListener("selectionchange", handleSelectionChange);
  }, [updateActiveFormats]);

  const handleInput = useCallback(() => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    isInternalChangeRef.current = true;
    onChange(html === "<p><br></p>" || html === "<br>" ? "" : html);
    updateActiveFormats();
  }, [onChange, updateActiveFormats]);

  /**
   * Dedicated unwrap logic for block elements like <pre> and <blockquote>.
   * Browsers (Chrome/Edge/Firefox) fail to unwrap <pre> when document.execCommand("formatBlock", false, "<p>") is called.
   */
  const unwrapBlock = useCallback((tagName: "pre" | "blockquote"): boolean => {
    if (!editorRef.current) return false;
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return false;

    let targetEl: HTMLElement | null = null;

    // Traverse upwards from selection nodes to find the enclosing block
    for (const startNode of [sel.anchorNode, sel.focusNode]) {
      let curr: Node | null = startNode;
      while (curr && curr !== editorRef.current && curr !== document.body) {
        if (curr.nodeType === Node.ELEMENT_NODE) {
          const el = curr as HTMLElement;
          const tag = el.tagName.toLowerCase();
          if (tagName === "pre" && (tag === "pre" || tag === "code")) {
            targetEl = tag === "pre" ? el : (el.closest("pre") || el);
            break;
          }
          if (tag === tagName) {
            targetEl = el;
            break;
          }
        }
        curr = curr.parentNode;
      }
      if (targetEl) break;
    }

    // Intersect check if selection spans across the block
    if (!targetEl && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      const blocks = editorRef.current.querySelectorAll(tagName);
      for (const b of Array.from(blocks)) {
        if (range.intersectsNode(b)) {
          targetEl = b as HTMLElement;
          break;
        }
      }
    }

    if (targetEl && targetEl.parentNode) {
      if (
        targetEl.tagName.toLowerCase() === "code" &&
        targetEl.parentElement?.tagName.toLowerCase() !== "pre"
      ) {
        // Inline code element
        const span = document.createElement("span");
        span.innerHTML = targetEl.innerHTML;
        targetEl.parentNode.replaceChild(span, targetEl);
        const range = document.createRange();
        range.selectNodeContents(span);
        sel.removeAllRanges();
        sel.addRange(range);
        return true;
      }

      // Pre or blockquote element
      const preOrQuote =
        targetEl.tagName.toLowerCase() === "code" && targetEl.parentElement?.tagName.toLowerCase() === "pre"
          ? (targetEl.parentElement as HTMLElement)
          : targetEl;

      const p = document.createElement("p");
      let content = preOrQuote.innerHTML;
      if (tagName === "pre") {
        content = content.replace(/^<code[^>]*>([\s\S]*?)<\/code>$/i, "$1");
        content = content.replace(/\r?\n/g, "<br>");
      }
      p.innerHTML = content || "<br>";
      preOrQuote.parentNode?.replaceChild(p, preOrQuote);

      const range = document.createRange();
      range.selectNodeContents(p);
      sel.removeAllRanges();
      sel.addRange(range);
      return true;
    }

    return false;
  }, []);

  const unwrapNode = (node: Node) => {
    const parent = node.parentNode;
    if (!parent) return;
    while (node.firstChild) {
      parent.insertBefore(node.firstChild, node);
    }
    parent.removeChild(node);
  };

  const execCommand = useCallback(
    (command: string, arg?: string) => {
      if (disabled) return;
      editorRef.current?.focus();
      document.execCommand(command, false, arg);
      handleInput();
      setTimeout(updateActiveFormats, 10);
    },
    [disabled, handleInput, updateActiveFormats]
  );

  const handleToolbarClick = useCallback(
    (action: ToolbarAction) => {
      if (disabled) return;
      editorRef.current?.focus();

      if (action.command === "formatBlock") {
        const blockType = action.arg?.toLowerCase();

        if (blockType === "h2" || blockType === "h3") {
          const sel = window.getSelection();
          if (!sel || sel.rangeCount === 0 || !editorRef.current) {
            document.execCommand(
              "formatBlock",
              false,
              activeFormats[blockType as "h2" | "h3"] ? "<p>" : `<${blockType}>`
            );
          } else {
            const range = sel.getRangeAt(0);

            // 1. Find enclosing block element (p, h1-h6, div, blockquote, li, etc.)
            let blockEl: HTMLElement | null = null;
            let curr: Node | null = range.commonAncestorContainer;
            while (curr && curr !== editorRef.current && curr !== document.body) {
              if (curr.nodeType === Node.ELEMENT_NODE) {
                const el = curr as HTMLElement;
                const tag = el.tagName.toLowerCase();
                if (
                  [
                    "p",
                    "div",
                    "h1",
                    "h2",
                    "h3",
                    "h4",
                    "h5",
                    "h6",
                    "li",
                    "blockquote",
                  ].includes(tag)
                ) {
                  blockEl = el;
                  break;
                }
              }
              curr = curr.parentNode;
            }

            // 2. Check if we are inside an existing inline heading of this type
            let inlineHeadingSpan: HTMLElement | null = null;
            let n: Node | null = range.commonAncestorContainer;
            while (n && n !== blockEl && n !== editorRef.current && n !== document.body) {
              if (n.nodeType === Node.ELEMENT_NODE) {
                const el = n as HTMLElement;
                if (
                  el.getAttribute(`data-inline-${blockType}`) === "true" ||
                  el.classList.contains(`inline-${blockType}`)
                ) {
                  inlineHeadingSpan = el;
                  break;
                }
              }
              n = n.parentNode;
            }

            if (inlineHeadingSpan) {
              // Toggle OFF: unwrap the inline heading span
              unwrapNode(inlineHeadingSpan);
              handleInput();
              setTimeout(updateActiveFormats, 10);
              return;
            }

            // 3. Check if the block itself is already this heading tag (e.g. whole line turned into h2)
            if (blockEl && blockEl.tagName.toLowerCase() === blockType) {
              // Convert block back to <p>
              const p = document.createElement("p");
              p.innerHTML = blockEl.innerHTML || "<br>";
              blockEl.parentNode?.replaceChild(p, blockEl);
              const newRange = document.createRange();
              newRange.selectNodeContents(p);
              sel.removeAllRanges();
              sel.addRange(newRange);
              handleInput();
              setTimeout(updateActiveFormats, 10);
              return;
            }

            // 4. Check if user made a partial selection within a block
            const selectedText = sel.toString();
            const isCollapsed = sel.isCollapsed;
            const blockText = blockEl ? blockEl.textContent || "" : "";
            const isPartialSelection =
              !isCollapsed &&
              selectedText.trim().length > 0 &&
              selectedText.trim() !== blockText.trim();

            if (isPartialSelection) {
              // Apply inline heading styling ONLY to the selected text!
              const span = document.createElement("span");
              span.setAttribute(`data-inline-${blockType}`, "true");
              span.className = `inline-${blockType}`;
              if (blockType === "h2") {
                span.setAttribute(
                  "style",
                  "font-size: 20px; font-weight: 700; color: #002e5b; line-height: 1.3;"
                );
              } else {
                span.setAttribute(
                  "style",
                  "font-size: 16px; font-weight: 700; color: #002e5b; line-height: 1.3;"
                );
              }

              try {
                const extracted = range.extractContents();
                span.appendChild(extracted);
                range.insertNode(span);

                const newRange = document.createRange();
                newRange.selectNodeContents(span);
                sel.removeAllRanges();
                sel.addRange(newRange);
              } catch {
                document.execCommand("formatBlock", false, `<${blockType}>`);
              }

              handleInput();
              setTimeout(updateActiveFormats, 10);
              return;
            }

            // 5. Default whole-block formatting:
            const isCurrentlyActive =
              blockType === "h2" ? activeFormats.h2 : activeFormats.h3;
            document.execCommand(
              "formatBlock",
              false,
              isCurrentlyActive ? "<p>" : `<${blockType}>`
            );
          }
        } else if (blockType === "blockquote") {
          if (activeFormats.blockquote) {
            const unwrapped = unwrapBlock("blockquote");
            if (!unwrapped) document.execCommand("formatBlock", false, "<p>");
          } else {
            document.execCommand("formatBlock", false, "<blockquote>");
          }
        } else if (blockType === "pre") {
          if (activeFormats.pre) {
            // Undo code block: replace <pre> with <p>
            const unwrapped = unwrapBlock("pre");
            if (!unwrapped) {
              document.execCommand("formatBlock", false, "<p>");
            }
          } else {
            document.execCommand("formatBlock", false, "<pre>");
          }
        }
      } else {
        document.execCommand(action.command, false, action.arg);
      }

      handleInput();
      setTimeout(updateActiveFormats, 10);
    },
    [disabled, activeFormats, unwrapBlock, handleInput, updateActiveFormats]
  );

  // Selection memory across modals
  const savedSelectionRef = useRef<Range | null>(null);

  const saveCurrentSelection = useCallback(() => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editorRef.current) {
      const range = sel.getRangeAt(0);
      if (editorRef.current.contains(range.commonAncestorContainer)) {
        savedSelectionRef.current = range.cloneRange();
        return;
      }
    }
    savedSelectionRef.current = null;
  }, []);

  const restoreCurrentSelection = useCallback(() => {
    if (savedSelectionRef.current && editorRef.current) {
      editorRef.current.focus();
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedSelectionRef.current);
      }
    }
  }, []);

  // Modals & Popover State
  const [showButtonModal, setShowButtonModal] = useState(false);
  const [btnText, setBtnText] = useState("Join Google Meet &rarr;");
  const [btnUrl, setBtnUrl] = useState("https://meet.google.com/");
  const [btnColor, setBtnColor] = useState("#002e5b");
  const [btnAlign, setBtnAlign] = useState<"center" | "left" | "right">("center");
  const [btnSize, setBtnSize] = useState<"md" | "lg">("md");

  const [showBoxDropdown, setShowBoxDropdown] = useState(false);
  const [showBoxModal, setShowBoxModal] = useState(false);
  const [boxType, setBoxType] = useState<"info" | "warning" | "success" | "note">("info");
  const [boxCustomTitle, setBoxCustomTitle] = useState("");
  const [boxCustomContent, setBoxCustomContent] = useState("");

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [schedTitle, setSchedTitle] = useState("📅 Event Schedule & Session Details");
  const [schedDate, setSchedDate] = useState("{{eventDate}}");
  const [schedTime, setSchedTime] = useState("03:00 PM - 05:00 PM BST");
  const [schedVenue, setSchedVenue] = useState("{{eventVenue}}");
  const [schedAudience, setSchedAudience] = useState("All Registered Participants");

  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("https://");

  const [showTokensDropdown, setShowTokensDropdown] = useState(false);

  // Close popovers on click outside
  const boxDropdownRef = useRef<HTMLDivElement>(null);
  const tokensDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (boxDropdownRef.current && !boxDropdownRef.current.contains(e.target as Node)) {
        setShowBoxDropdown(false);
      }
      if (tokensDropdownRef.current && !tokensDropdownRef.current.contains(e.target as Node)) {
        setShowTokensDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleDocumentClick);
    return () => document.removeEventListener("mousedown", handleDocumentClick);
  }, []);

  /**
   * Safe HTML insertion at caret position with paragraph continuation
   */
  const insertHtmlAtCursor = useCallback(
    (htmlToInsert: string) => {
      if (disabled || !editorRef.current) return;
      editorRef.current.focus();
      restoreCurrentSelection();

      const sel = window.getSelection();
      let inserted = false;

      if (sel && sel.rangeCount > 0 && editorRef.current) {
        const range = sel.getRangeAt(0);
        if (editorRef.current.contains(range.commonAncestorContainer)) {
          range.deleteContents();

          const temp = document.createElement("div");
          temp.innerHTML = htmlToInsert;
          const frag = document.createDocumentFragment();
          let node: Node | null;
          let lastNode: Node | null = null;
          while ((node = temp.firstChild)) {
            lastNode = frag.appendChild(node);
          }

          range.insertNode(frag);

          if (lastNode) {
            const newRange = document.createRange();
            newRange.setStartAfter(lastNode);
            newRange.collapse(true);
            sel.removeAllRanges();
            sel.addRange(newRange);
          }
          inserted = true;
        }
      }

      if (!inserted && editorRef.current) {
        editorRef.current.innerHTML += `<p><br></p>${htmlToInsert}<p><br></p>`;
      }

      handleInput();
      setTimeout(updateActiveFormats, 10);
    },
    [disabled, restoreCurrentSelection, handleInput, updateActiveFormats]
  );

  const handleOpenLinkModal = useCallback(() => {
    if (disabled) return;
    saveCurrentSelection();
    const sel = window.getSelection();
    if (sel && !sel.isCollapsed) {
      setLinkText(sel.toString());
    } else {
      setLinkText("");
    }
    setLinkUrl("https://");
    setShowLinkModal(true);
  }, [disabled, saveCurrentSelection]);

  const handleInsertLink = useCallback(() => {
    if (!linkUrl.trim()) {
      toast.error("Please enter a valid URL.");
      return;
    }
    const cleanUrl = linkUrl.trim();
    const display = linkText.trim() || cleanUrl;
    const linkHtml = `<a href="${cleanUrl}" target="_blank" style="color: #002e5b; font-weight: 600; text-decoration: underline;">${display}</a>`;
    insertHtmlAtCursor(linkHtml);
    setShowLinkModal(false);
    toast.success("Link inserted");
  }, [linkUrl, linkText, insertHtmlAtCursor]);

  /**
   * Inserts dynamic token like {{userName}} directly at caret position
   */
  const insertTokenAtCursor = useCallback(
    (tokenName: string) => {
      if (disabled || !editorRef.current) return;
      const token = `{{${tokenName}}}`;
      editorRef.current.focus();

      const success = document.execCommand("insertText", false, token);
      if (!success) {
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
          const range = sel.getRangeAt(0);
          range.deleteContents();
          const textNode = document.createTextNode(token);
          range.insertNode(textNode);
          range.setStartAfter(textNode);
          range.setEndAfter(textNode);
          sel.removeAllRanges();
          sel.addRange(range);
        } else {
          editorRef.current.innerHTML += ` ${token}`;
        }
      }

      handleInput();
      navigator.clipboard?.writeText(token);
      toast.success(`Inserted ${token}`);
    },
    [disabled, handleInput]
  );

  // Notice Boxes Configuration
  const noticeBoxTypes = {
    info: {
      name: "Information Box",
      icon: "💡",
      bgColor: "#eff6ff",
      borderColor: "#bfdbfe",
      accentBorderColor: "#2563eb",
      titleColor: "#1d4ed8",
      textColor: "#1e40af",
      defaultTitle: "Important Guidelines & Information",
      defaultContent: "Please review the event guidelines and instructions carefully before joining.",
    },
    warning: {
      name: "Warning / Alert Box",
      icon: "⚠️",
      bgColor: "#fffbeb",
      borderColor: "#fde68a",
      accentBorderColor: "#d97706",
      titleColor: "#b45309",
      textColor: "#92400e",
      defaultTitle: "Urgent Notice & Arrival Time",
      defaultContent: "Please join the meeting or venue at least 15 minutes before the session starts.",
    },
    success: {
      name: "Confirmation / Success Box",
      icon: "✅",
      bgColor: "#f0fdf4",
      borderColor: "#bbf7d0",
      accentBorderColor: "#16a34a",
      titleColor: "#15803d",
      textColor: "#166534",
      defaultTitle: "Registration Status: Confirmed",
      defaultContent: "Your registration has been approved. Your seat is officially reserved.",
    },
    note: {
      name: "Important Note / Preparation",
      icon: "📌",
      bgColor: "#faf5ff",
      borderColor: "#e9d5ff",
      accentBorderColor: "#9333ea",
      titleColor: "#7e22ce",
      textColor: "#6b21a8",
      defaultTitle: "Preparation & Required Items",
      defaultContent: "Bring your institutional ID card and ensure you have all materials ready.",
    },
  };

  const handleInsertNoticeBoxPreset = (type: "info" | "warning" | "success" | "note") => {
    const cfg = noticeBoxTypes[type];
    const boxHtml = `
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 16px 0; background-color: ${cfg.bgColor}; border: 1px solid ${cfg.borderColor}; border-left: 4px solid ${cfg.accentBorderColor}; border-radius: 8px; border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
        <tr>
          <td style="padding: 14px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.5; color: ${cfg.textColor};">
            <div style="font-weight: 700; margin-bottom: 4px; font-size: 14px; color: ${cfg.titleColor};">
              ${cfg.icon} ${cfg.defaultTitle}
            </div>
            <div style="font-size: 13.5px; color: ${cfg.textColor};">
              ${cfg.defaultContent}
            </div>
          </td>
        </tr>
      </table>
      <p><br></p>
    `;
    insertHtmlAtCursor(boxHtml);
    setShowBoxDropdown(false);
    toast.success(`Inserted ${cfg.name} (editable in place)`);
  };

  const handleInsertNoticeBoxCustom = () => {
    const cfg = noticeBoxTypes[boxType];
    const title = boxCustomTitle.trim() || cfg.defaultTitle;
    const content = boxCustomContent.trim() || cfg.defaultContent;
    const boxHtml = `
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 16px 0; background-color: ${cfg.bgColor}; border: 1px solid ${cfg.borderColor}; border-left: 4px solid ${cfg.accentBorderColor}; border-radius: 8px; border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
        <tr>
          <td style="padding: 14px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.5; color: ${cfg.textColor};">
            <div style="font-weight: 700; margin-bottom: 4px; font-size: 14px; color: ${cfg.titleColor};">
              ${cfg.icon} ${title}
            </div>
            <div style="font-size: 13.5px; color: ${cfg.textColor};">
              ${content}
            </div>
          </td>
        </tr>
      </table>
      <p><br></p>
    `;
    insertHtmlAtCursor(boxHtml);
    setShowBoxModal(false);
    toast.success(`Inserted ${cfg.name}`);
  };

  const handleInsertButtonSubmit = () => {
    const label = btnText.trim() || "Click Here";
    const link = btnUrl.trim() || "#";
    const padding = btnSize === "lg" ? "14px 32px" : "11px 24px";
    const fontSize = btnSize === "lg" ? "16px" : "14px";

    const buttonHtml = `
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 20px 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
        <tr>
          <td align="${btnAlign}" style="padding: 0;">
            <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
              <tr>
                <td align="center" style="background-color: ${btnColor}; border-radius: 8px; padding: 0;">
                  <a href="${link}" target="_blank" style="display: inline-block; padding: ${padding}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: ${fontSize}; font-weight: 700; color: #ffffff !important; text-decoration: none; border-radius: 8px; line-height: 1.2; text-align: center;">
                    ${label}
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
      <p><br></p>
    `;
    insertHtmlAtCursor(buttonHtml);
    setShowButtonModal(false);
    toast.success("Inserted Call-to-Action button");
  };

  const handleInsertScheduleSubmit = () => {
    const title = schedTitle.trim() || "📅 Event Schedule & Session Details";
    const date = schedDate.trim() || "{{eventDate}}";
    const time = schedTime.trim() || "03:00 PM - 05:00 PM BST";
    const venue = schedVenue.trim() || "{{eventVenue}}";
    const audience = schedAudience.trim();

    const scheduleHtml = `
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 18px 0; background-color: #f8fafc; border: 2px dashed #f58a1f; border-radius: 10px; border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
        <tr>
          <td style="padding: 16px 18px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            <div style="font-size: 13px; font-weight: 800; color: #002e5b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">
              ${title}
            </div>
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
              <tr>
                <td style="padding: 7px 0; font-size: 13px; color: #64748b; width: 110px; font-weight: 600; border-bottom: 1px solid #f1f5f9;">
                  📅 Date:
                </td>
                <td style="padding: 7px 0; font-size: 13px; color: #002e5b; font-weight: 700; border-bottom: 1px solid #f1f5f9;">
                  ${date}
                </td>
              </tr>
              <tr>
                <td style="padding: 7px 0; font-size: 13px; color: #64748b; width: 110px; font-weight: 600; border-bottom: 1px solid #f1f5f9;">
                  ⏰ Time:
                </td>
                <td style="padding: 7px 0; font-size: 13px; color: #002e5b; font-weight: 700; border-bottom: 1px solid #f1f5f9;">
                  ${time}
                </td>
              </tr>
              <tr>
                <td style="padding: 7px 0; font-size: 13px; color: #64748b; width: 110px; font-weight: 600; border-bottom: 1px solid #f1f5f9;">
                  📍 Venue:
                </td>
                <td style="padding: 7px 0; font-size: 13px; color: #002e5b; font-weight: 700; border-bottom: 1px solid #f1f5f9;">
                  ${venue}
                </td>
              </tr>
              ${
                audience
                  ? `<tr>
                <td style="padding: 7px 0; font-size: 13px; color: #64748b; width: 110px; font-weight: 600;">
                  👥 Audience:
                </td>
                <td style="padding: 7px 0; font-size: 13px; color: #002e5b; font-weight: 700;">
                  ${audience}
                </td>
              </tr>`
                  : ""
              }
            </table>
          </td>
        </tr>
      </table>
      <p><br></p>
    `;
    insertHtmlAtCursor(scheduleHtml);
    setShowScheduleModal(false);
    toast.success("Inserted Event Schedule Card");
  };

  const handleInsertDivider = () => {
    const dividerHtml = `
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 22px 0; border-collapse: collapse;">
        <tr>
          <td style="border-top: 1px solid #e2e8f0; font-size: 0; line-height: 0; height: 1px;">&nbsp;</td>
        </tr>
      </table>
      <p><br></p>
    `;
    insertHtmlAtCursor(dividerHtml);
    toast.success("Inserted Divider line");
  };

  const toolbarActions: (ToolbarAction | "separator")[] = [
    { icon: <Bold size={15} />, command: "bold", title: "Bold (Ctrl+B)" },
    { icon: <Italic size={15} />, command: "italic", title: "Italic (Ctrl+I)" },
    { icon: <Underline size={15} />, command: "underline", title: "Underline (Ctrl+U)" },
    { icon: <Strikethrough size={15} />, command: "strikeThrough", title: "Strikethrough" },
    "separator",
    { icon: <Heading2 size={15} />, command: "formatBlock", arg: "h2", title: "Heading 2" },
    { icon: <Heading3 size={15} />, command: "formatBlock", arg: "h3", title: "Heading 3" },
    { icon: <Quote size={15} />, command: "formatBlock", arg: "blockquote", title: "Blockquote" },
    { icon: <Code size={15} />, command: "formatBlock", arg: "pre", title: "Code Block" },
    "separator",
    { icon: <List size={15} />, command: "insertUnorderedList", title: "Bulleted List" },
    { icon: <ListOrdered size={15} />, command: "insertOrderedList", title: "Numbered List" },
    "separator",
    { icon: <Undo size={15} />, command: "undo", title: "Undo" },
    { icon: <Redo size={15} />, command: "redo", title: "Redo" },
  ];

  const isActionActive = (action: ToolbarAction): boolean => {
    if (action.command === "bold") return activeFormats.bold;
    if (action.command === "italic") return activeFormats.italic;
    if (action.command === "underline") return activeFormats.underline;
    if (action.command === "strikeThrough") return activeFormats.strikeThrough;
    if (action.command === "insertUnorderedList") return activeFormats.insertUnorderedList;
    if (action.command === "insertOrderedList") return activeFormats.insertOrderedList;
    if (action.command === "formatBlock") {
      if (action.arg === "h2") return activeFormats.h2;
      if (action.arg === "h3") return activeFormats.h3;
      if (action.arg === "blockquote") return activeFormats.blockquote;
      if (action.arg === "pre") return activeFormats.pre;
    }
    return false;
  };

  /**
   * Reusable Block insertion toolbar component
   */
  const renderBlockTools = () => {
    const quickTokens = emailMetadata?.quickTokens || [];

    return (
      <div className="flex items-center gap-1.5 flex-wrap">
        {/* Button Inserter */}
        <button
          type="button"
          title="Insert Call-to-Action Button"
          disabled={disabled}
          onClick={() => {
            saveCurrentSelection();
            setShowButtonModal(true);
          }}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-elevated hover:bg-accent-primary/20 text-text-primary text-xs font-bold border border-border-default hover:border-accent-primary transition cursor-pointer shadow-2xs"
        >
          <MousePointerClick size={13} className="text-blue-500" />
          <span>Button</span>
        </button>

        {/* Notice Box Dropdown */}
        <div className="relative" ref={boxDropdownRef}>
          <button
            type="button"
            title="Insert Notice / Info / Warning Box"
            disabled={disabled}
            onClick={() => setShowBoxDropdown((prev) => !prev)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-elevated hover:bg-accent-primary/20 text-text-primary text-xs font-bold border border-border-default hover:border-accent-primary transition cursor-pointer shadow-2xs"
          >
            <Info size={13} className="text-amber-500" />
            <span>Notice Box</span>
            <ChevronDown size={12} className="text-text-tertiary" />
          </button>

          {showBoxDropdown && (
            <div className="absolute left-0 mt-1.5 w-64 rounded-xl bg-surface-elevated border-2 border-border-brutalist dark:border-border-default shadow-[4px_4px_0px_0px_var(--border-brutalist)] z-50 overflow-hidden text-xs animate-scale-up">
              <div className="p-2 border-b border-border-default bg-surface-secondary/60">
                <span className="font-bold text-[11px] uppercase tracking-wider text-text-secondary">
                  Insert Notice / Callout Box
                </span>
              </div>
              <div className="p-1 space-y-0.5">
                <button
                  type="button"
                  onClick={() => handleInsertNoticeBoxPreset("info")}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-blue-500/10 flex items-center gap-2 transition cursor-pointer"
                >
                  <span className="text-base">💡</span>
                  <div className="min-w-0">
                    <span className="font-bold text-blue-700 dark:text-blue-300 block">Information Box</span>
                    <span className="text-[10px] text-text-tertiary truncate block">Guidelines & announcements</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertNoticeBoxPreset("warning")}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-amber-500/10 flex items-center gap-2 transition cursor-pointer"
                >
                  <span className="text-base">⚠️</span>
                  <div className="min-w-0">
                    <span className="font-bold text-amber-700 dark:text-amber-300 block">Warning / Alert Box</span>
                    <span className="text-[10px] text-text-tertiary truncate block">Urgent timing & precautions</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertNoticeBoxPreset("success")}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-emerald-500/10 flex items-center gap-2 transition cursor-pointer"
                >
                  <span className="text-base">✅</span>
                  <div className="min-w-0">
                    <span className="font-bold text-emerald-700 dark:text-emerald-300 block">Confirmation Box</span>
                    <span className="text-[10px] text-text-tertiary truncate block">Approval & reserved seat</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleInsertNoticeBoxPreset("note")}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-purple-500/10 flex items-center gap-2 transition cursor-pointer"
                >
                  <span className="text-base">📌</span>
                  <div className="min-w-0">
                    <span className="font-bold text-purple-700 dark:text-purple-300 block">Important Note Box</span>
                    <span className="text-[10px] text-text-tertiary truncate block">Preparation & prerequisites</span>
                  </div>
                </button>
              </div>
              <div className="p-1 border-t border-border-default bg-surface-secondary/40">
                <button
                  type="button"
                  onClick={() => {
                    setShowBoxDropdown(false);
                    saveCurrentSelection();
                    setShowBoxModal(true);
                  }}
                  className="w-full text-center px-2 py-1 rounded-lg text-accent-primary hover:bg-accent-primary/10 font-bold text-[11px] transition cursor-pointer"
                >
                  ⚙️ Customize Box Content &rarr;
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Schedule Card Inserter */}
        <button
          type="button"
          title="Insert Event Schedule & Venue Grid"
          disabled={disabled}
          onClick={() => {
            saveCurrentSelection();
            setShowScheduleModal(true);
          }}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-elevated hover:bg-accent-primary/20 text-text-primary text-xs font-bold border border-border-default hover:border-accent-primary transition cursor-pointer shadow-2xs"
        >
          <Calendar size={13} className="text-orange-500" />
          <span>Schedule Card</span>
        </button>

        {/* Divider Inserter */}
        <button
          type="button"
          title="Insert Horizontal Divider Line"
          disabled={disabled}
          onClick={handleInsertDivider}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-elevated hover:bg-accent-primary/20 text-text-primary text-xs font-bold border border-border-default hover:border-accent-primary transition cursor-pointer shadow-2xs"
        >
          <Minus size={13} className="text-slate-500" />
          <span>Divider</span>
        </button>

        {/* Dynamic Tokens Dropdown */}
        {quickTokens.length > 0 && (
          <div className="relative" ref={tokensDropdownRef}>
            <button
              type="button"
              title="Insert Dynamic Token at Cursor"
              disabled={disabled}
              onClick={() => setShowTokensDropdown((prev) => !prev)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-elevated hover:bg-accent-primary/20 text-text-primary text-xs font-bold border border-border-default hover:border-accent-primary transition cursor-pointer shadow-2xs"
            >
              <Sparkles size={13} className="text-purple-500" />
              <span>Token</span>
              <ChevronDown size={12} className="text-text-tertiary" />
            </button>

            {showTokensDropdown && (
              <div className="absolute left-0 mt-1.5 w-60 max-h-64 overflow-y-auto rounded-xl bg-surface-elevated border-2 border-border-brutalist dark:border-border-default shadow-[4px_4px_0px_0px_var(--border-brutalist)] z-50 p-1 text-xs animate-scale-up">
                <div className="p-1.5 border-b border-border-default text-[10px] uppercase font-bold text-text-secondary">
                  Insert Dynamic Token
                </div>
                {quickTokens.map((tok) => (
                  <button
                    key={tok.name}
                    type="button"
                    onClick={() => {
                      insertTokenAtCursor(tok.name);
                      setShowTokensDropdown(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-accent-primary/10 flex items-center justify-between text-text-primary transition cursor-pointer"
                  >
                    <span className="font-mono font-bold text-accent-primary">
                      &#123;&#123;{tok.name}&#125;&#125;
                    </span>
                    <span className="text-[10px] text-text-tertiary truncate max-w-[100px]">
                      {tok.description}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  /**
   * Modals for Button, Notice Box, Schedule, and Link
   */
  const renderModals = () => (
    <>
      {/* ── Button Insertion Modal ── */}
      {showButtonModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-elevated border-2 border-border-brutalist dark:border-border-default rounded-2xl max-w-md w-full p-5 shadow-[6px_6px_0px_0px_var(--border-brutalist)] space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-border-default pb-2.5">
              <h3 className="font-bold text-sm text-text-primary flex items-center gap-2">
                <MousePointerClick className="w-4 h-4 text-accent-primary" />
                Insert Call-to-Action Button
              </h3>
              <button
                type="button"
                onClick={() => setShowButtonModal(false)}
                className="text-text-tertiary hover:text-text-primary p-1 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-text-secondary block mb-1">
                  Button Text / Label:
                </label>
                <input
                  type="text"
                  value={btnText}
                  onChange={(e) => setBtnText(e.target.value)}
                  placeholder="e.g. Join Google Meet &rarr;"
                  className="w-full px-3 py-2 rounded-xl border border-border-default bg-surface-secondary text-text-primary focus:border-accent-primary outline-none"
                />
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {[
                    "Join Google Meet &rarr;",
                    "Register Now &rarr;",
                    "View Schedule &rarr;",
                    "Join WhatsApp Group &rarr;",
                  ].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setBtnText(s)}
                      className="px-1.5 py-0.5 rounded bg-surface-secondary hover:bg-accent-primary/20 text-[10px] text-text-secondary border border-border-default cursor-pointer"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-text-secondary block mb-1">
                  Destination URL / Action Link:
                </label>
                <input
                  type="text"
                  value={btnUrl}
                  onChange={(e) => setBtnUrl(e.target.value)}
                  placeholder="https://meet.google.com/xyz or {{eventUrl}}"
                  className="w-full px-3 py-2 rounded-xl border border-border-default bg-surface-secondary text-text-primary focus:border-accent-primary outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-text-secondary block mb-1">
                  Color Theme:
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {[
                    { label: "Navy", color: "#002e5b" },
                    { label: "Orange", color: "#f58a1f" },
                    { label: "Green", color: "#16a34a" },
                    { label: "Purple", color: "#7c3aed" },
                    { label: "Dark", color: "#1e293b" },
                  ].map((c) => (
                    <button
                      key={c.color}
                      type="button"
                      onClick={() => setBtnColor(c.color)}
                      className={`p-2 rounded-xl border text-[11px] font-bold text-white flex flex-col items-center justify-center transition cursor-pointer ${
                        btnColor === c.color ? "ring-2 ring-accent-primary scale-102" : "opacity-85 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: c.color }}
                    >
                      <span>{c.label}</span>
                      {btnColor === c.color && <Check size={12} className="mt-0.5" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-text-secondary block mb-1">Alignment:</label>
                  <div className="flex rounded-xl border border-border-default overflow-hidden">
                    {(["center", "left", "right"] as const).map((a) => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => setBtnAlign(a)}
                        className={`flex-1 py-1.5 font-bold capitalize text-[11px] cursor-pointer ${
                          btnAlign === a ? "bg-accent-primary text-text-primary" : "bg-surface-secondary text-text-secondary"
                        }`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-text-secondary block mb-1">Size:</label>
                  <div className="flex rounded-xl border border-border-default overflow-hidden">
                    {(["md", "lg"] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setBtnSize(s)}
                        className={`flex-1 py-1.5 font-bold uppercase text-[11px] cursor-pointer ${
                          btnSize === s ? "bg-accent-primary text-text-primary" : "bg-surface-secondary text-text-secondary"
                        }`}
                      >
                        {s === "md" ? "Medium" : "Large"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live Preview Card inside Modal */}
              <div className="p-3 bg-surface-secondary/70 border border-border-default rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-text-tertiary uppercase block">
                  Live Preview:
                </span>
                <div style={{ textAlign: btnAlign }} className="py-2">
                  <span
                    style={{
                      backgroundColor: btnColor,
                      color: "#ffffff",
                      padding: btnSize === "lg" ? "12px 28px" : "9px 20px",
                      borderRadius: "8px",
                      fontWeight: 700,
                      display: "inline-block",
                      fontSize: btnSize === "lg" ? "15px" : "13px",
                    }}
                  >
                    {btnText || "Click Here"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-default">
              <button
                type="button"
                onClick={() => setShowButtonModal(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-text-secondary hover:text-text-primary cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertButtonSubmit}
                className="px-4 py-2 rounded-xl bg-accent-primary text-text-primary font-bold text-xs border border-border-brutalist shadow-[2px_2px_0px_0px_var(--border-brutalist)] hover:opacity-95 cursor-pointer"
              >
                Insert Button Into Email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Notice Box Customizer Modal ── */}
      {showBoxModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-elevated border-2 border-border-brutalist dark:border-border-default rounded-2xl max-w-md w-full p-5 shadow-[6px_6px_0px_0px_var(--border-brutalist)] space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-border-default pb-2.5">
              <h3 className="font-bold text-sm text-text-primary flex items-center gap-2">
                <Info className="w-4 h-4 text-accent-primary" />
                Customize Notice / Callout Box
              </h3>
              <button
                type="button"
                onClick={() => setShowBoxModal(false)}
                className="text-text-tertiary hover:text-text-primary p-1 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-text-secondary block mb-1">Notice Style / Type:</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["info", "warning", "success", "note"] as const).map((t) => {
                    const cfg = noticeBoxTypes[t];
                    const isSel = boxType === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => {
                          setBoxType(t);
                          if (!boxCustomTitle) setBoxCustomTitle(cfg.defaultTitle);
                          if (!boxCustomContent) setBoxCustomContent(cfg.defaultContent);
                        }}
                        className={`p-2 rounded-xl border text-left flex items-center gap-2 transition cursor-pointer ${
                          isSel
                            ? "border-accent-primary bg-accent-primary/10 shadow-[2px_2px_0px_0px_var(--border-brutalist)] font-bold text-text-primary"
                            : "border-border-default bg-surface-secondary text-text-secondary hover:bg-surface-elevated"
                        }`}
                      >
                        <span className="text-base">{cfg.icon}</span>
                        <span className="truncate text-xs">{cfg.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="font-bold text-text-secondary block mb-1">Box Header Title:</label>
                <input
                  type="text"
                  value={boxCustomTitle}
                  onChange={(e) => setBoxCustomTitle(e.target.value)}
                  placeholder={noticeBoxTypes[boxType].defaultTitle}
                  className="w-full px-3 py-2 rounded-xl border border-border-default bg-surface-secondary text-text-primary focus:border-accent-primary outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-text-secondary block mb-1">Notice Body Content:</label>
                <textarea
                  rows={3}
                  value={boxCustomContent}
                  onChange={(e) => setBoxCustomContent(e.target.value)}
                  placeholder={noticeBoxTypes[boxType].defaultContent}
                  className="w-full px-3 py-2 rounded-xl border border-border-default bg-surface-secondary text-text-primary focus:border-accent-primary outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-default">
              <button
                type="button"
                onClick={() => setShowBoxModal(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-text-secondary hover:text-text-primary cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertNoticeBoxCustom}
                className="px-4 py-2 rounded-xl bg-accent-primary text-text-primary font-bold text-xs border border-border-brutalist shadow-[2px_2px_0px_0px_var(--border-brutalist)] hover:opacity-95 cursor-pointer"
              >
                Insert Notice Box
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Schedule Card Modal ── */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-elevated border-2 border-border-brutalist dark:border-border-default rounded-2xl max-w-md w-full p-5 shadow-[6px_6px_0px_0px_var(--border-brutalist)] space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-border-default pb-2.5">
              <h3 className="font-bold text-sm text-text-primary flex items-center gap-2">
                <Calendar className="w-4 h-4 text-accent-primary" />
                Insert Event Schedule &amp; Details Card
              </h3>
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="text-text-tertiary hover:text-text-primary p-1 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <label className="font-bold text-text-secondary block mb-1">Card Title:</label>
                <input
                  type="text"
                  value={schedTitle}
                  onChange={(e) => setSchedTitle(e.target.value)}
                  placeholder="📅 Event Schedule & Session Details"
                  className="w-full px-3 py-2 rounded-xl border border-border-default bg-surface-secondary text-text-primary focus:border-accent-primary outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-text-secondary block mb-1">Date:</label>
                  <input
                    type="text"
                    value={schedDate}
                    onChange={(e) => setSchedDate(e.target.value)}
                    placeholder="{{eventDate}} or Oct 24, 2026"
                    className="w-full px-3 py-2 rounded-xl border border-border-default bg-surface-secondary text-text-primary focus:border-accent-primary outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-text-secondary block mb-1">Time:</label>
                  <input
                    type="text"
                    value={schedTime}
                    onChange={(e) => setSchedTime(e.target.value)}
                    placeholder="03:00 PM - 05:00 PM BST"
                    className="w-full px-3 py-2 rounded-xl border border-border-default bg-surface-secondary text-text-primary focus:border-accent-primary outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-text-secondary block mb-1">Venue / Platform:</label>
                <input
                  type="text"
                  value={schedVenue}
                  onChange={(e) => setSchedVenue(e.target.value)}
                  placeholder="{{eventVenue}} or Google Meet"
                  className="w-full px-3 py-2 rounded-xl border border-border-default bg-surface-secondary text-text-primary focus:border-accent-primary outline-none font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-text-secondary block mb-1">Target Audience:</label>
                <input
                  type="text"
                  value={schedAudience}
                  onChange={(e) => setSchedAudience(e.target.value)}
                  placeholder="All Registered Participants"
                  className="w-full px-3 py-2 rounded-xl border border-border-default bg-surface-secondary text-text-primary focus:border-accent-primary outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-default">
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-text-secondary hover:text-text-primary cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertScheduleSubmit}
                className="px-4 py-2 rounded-xl bg-accent-primary text-text-primary font-bold text-xs border border-border-brutalist shadow-[2px_2px_0px_0px_var(--border-brutalist)] hover:opacity-95 cursor-pointer"
              >
                Insert Schedule Card
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Link Insertion Modal ── */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-elevated border-2 border-border-brutalist dark:border-border-default rounded-2xl max-w-sm w-full p-5 shadow-[6px_6px_0px_0px_var(--border-brutalist)] space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-border-default pb-2.5">
              <h3 className="font-bold text-sm text-text-primary flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-accent-primary" />
                Insert Hyperlink
              </h3>
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="text-text-tertiary hover:text-text-primary p-1 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-text-secondary block mb-1">Text to Display:</label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="e.g. Click here to read rules"
                  className="w-full px-3 py-2 rounded-xl border border-border-default bg-surface-secondary text-text-primary focus:border-accent-primary outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-text-secondary block mb-1">Destination URL:</label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 rounded-xl border border-border-default bg-surface-secondary text-text-primary focus:border-accent-primary outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-default">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-text-secondary hover:text-text-primary cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertLink}
                className="px-4 py-2 rounded-xl bg-accent-primary text-text-primary font-bold text-xs border border-border-brutalist shadow-[2px_2px_0px_0px_var(--border-brutalist)] hover:opacity-95 cursor-pointer"
              >
                Insert Link
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  // ─────────────────────────────────────────────────────────────
  // 1. LIVE EMAIL STUDIO CANVAS MODE (In-Place Live Preview & Editor)
  // ─────────────────────────────────────────────────────────────
  if (variant === "email-canvas") {
    const previewDevice = emailMetadata?.previewDevice || "desktop";

    return (
      <div className="w-full flex flex-col space-y-3">
        {/* Studio Formatting Toolbar Bar */}
        <div className="flex flex-col gap-2 p-2.5 bg-surface-secondary border border-border-default rounded-xl select-none">
          {/* Row 1: Formatting icons and Extra Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1">
              {toolbarActions.map((action, i) => {
                if (action === "separator") {
                  return (
                    <div key={`sep-${i}`} className="w-px h-5 bg-border-default mx-1 shrink-0" />
                  );
                }
                const active = isActionActive(action);
                return (
                  <button
                    key={action.command + (action.arg || "")}
                    type="button"
                    title={action.title}
                    disabled={disabled}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleToolbarClick(action);
                    }}
                    className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg border transition-all text-xs cursor-pointer ${
                      active
                        ? "bg-accent-primary text-black dark:text-black font-bold border-text-primary shadow-[2px_2px_0px_0px_var(--text-primary)]"
                        : "border-transparent text-text-secondary hover:text-text-primary hover:bg-surface-elevated hover:border-border-default disabled:opacity-40"
                    }`}
                  >
                    {action.icon}
                  </button>
                );
              })}

              {/* Link button */}
              <button
                type="button"
                title="Insert Link"
                disabled={disabled}
                onClick={handleOpenLinkModal}
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg border border-transparent text-text-secondary hover:text-text-primary hover:bg-surface-elevated hover:border-border-default transition-all cursor-pointer disabled:opacity-40"
              >
                <LinkIcon size={15} />
              </button>
            </div>

            {/* Extra Controls: Viewport Device Switcher & Sample Data Switcher */}
            {emailMetadata?.extraControls && (
              <div className="flex items-center gap-2">
                {emailMetadata.extraControls}
              </div>
            )}
          </div>

          {/* Row 2: Dedicated Email Block Builder Menu */}
          <div className="flex items-center justify-between pt-2 border-t border-border-default/60 flex-wrap gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider mr-1">
                Insert Blocks:
              </span>
              {renderBlockTools()}
            </div>
            <span className="text-[10px] font-mono text-text-tertiary hidden sm:inline-block">
              Click elements inside email card to edit directly
            </span>
          </div>
        </div>

        {/* Live Studio Canvas Background */}
        <div className="p-3 sm:p-5 sm:py-6 flex items-center justify-center bg-slate-200/80 dark:bg-slate-900/90 rounded-2xl border border-border-default min-h-[580px] overflow-x-auto">
          {/* Authentic Email Card Container */}
          <div
            className={`w-full transition-all duration-300 bg-white dark:bg-[#1a1f2c] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden ${
              previewDevice === "mobile" ? "max-w-[375px]" : "max-w-[600px]"
            }`}
          >
            {/* Email Header Banner */}
            {!emailMetadata?.hideBanner && (
              <img
                src={
                  emailMetadata?.bannerUrl ||
                  "https://res.cloudinary.com/dj1sjgitq/image/upload/v1768389923/uploads/club_logo/email_banner_lxbsq9.png"
                }
                alt={emailMetadata?.clubName || "MEC Computer Club"}
                className="w-full h-auto block select-none border-b border-slate-100 dark:border-slate-800"
              />
            )}

            {/* Email Card Inner Body - Full In-Place Editable Canvas */}
            <div className="p-5 sm:p-8 space-y-3.5">
              <div
                ref={editorRef}
                contentEditable={!disabled}
                suppressContentEditableWarning
                data-placeholder={placeholder}
                onInput={handleInput}
                onKeyUp={updateActiveFormats}
                onMouseUp={updateActiveFormats}
                style={{ minHeight }}
                className="w-full outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-accent-primary rounded-xl p-2 -m-2 transition-all text-[#4b5563] dark:text-slate-200 text-sm sm:text-base leading-relaxed email-prose-editor"
              />

              {emailMetadata?.cardChildren}

              {/* Email Footer */}
              <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-800 text-center space-y-1.5 select-none">
                <p className="text-xs font-bold text-[#002e5b] dark:text-blue-400">
                  {emailMetadata?.clubName || "MEC Computer Club"}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {emailMetadata?.footerAddress || "Mymensingh Engineering College, Mymensingh-2200"}
                </p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">
                  {emailMetadata?.footerNote ||
                    "Official Club Communication System • Automated notification, please do not reply directly."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {renderModals()}
        <GlobalEditorStyles />
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 2. STANDARD DEFAULT MODE (Used in form inputs / modals)
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
          {label}
        </label>
      )}

      <div className="border border-border-default dark:border-border-default rounded-xl overflow-hidden bg-surface-elevated focus-within:border-accent-primary focus-within:ring-2 focus-within:ring-accent-primary/20 transition shadow-xs">
        {/* Toolbar */}
        <div className="flex flex-col gap-2 p-2 bg-surface-secondary border-b border-border-default select-none">
          <div className="flex flex-wrap items-center gap-1">
            {toolbarActions.map((action, i) => {
              if (action === "separator") {
                return (
                  <div key={`sep-${i}`} className="w-px h-5 bg-border-default mx-1 shrink-0" />
                );
              }
              const active = isActionActive(action);
              return (
                <button
                  key={action.command + (action.arg || "")}
                  type="button"
                  title={action.title}
                  disabled={disabled}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleToolbarClick(action);
                  }}
                  className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg border transition-all text-xs cursor-pointer ${
                    active
                      ? "bg-accent-primary text-black dark:text-black font-bold border-text-primary shadow-[2px_2px_0px_0px_var(--text-primary)]"
                      : "border-transparent text-text-secondary hover:text-text-primary hover:bg-surface-elevated hover:border-border-default"
                  }`}
                >
                  {action.icon}
                </button>
              );
            })}

            {/* Link button */}
            <button
              type="button"
              title="Insert Link"
              disabled={disabled}
              onClick={handleOpenLinkModal}
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg border border-transparent text-text-secondary hover:text-text-primary hover:bg-surface-elevated hover:border-border-default transition-all cursor-pointer"
            >
              <LinkIcon size={15} />
            </button>
          </div>

          {/* Blocks Toolbar row in standard mode */}
          <div className="flex items-center gap-2 pt-1 border-t border-border-default/50 flex-wrap">
            <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">
              Blocks:
            </span>
            {renderBlockTools()}
          </div>
        </div>

        {/* Contenteditable Area */}
        <div
          ref={editorRef}
          contentEditable={!disabled}
          suppressContentEditableWarning
          style={{ minHeight, resize: resizable ? "vertical" : "none" }}
          data-placeholder={placeholder}
          onInput={handleInput}
          onKeyUp={updateActiveFormats}
          onMouseUp={updateActiveFormats}
          className={`w-full px-4 py-3 text-text-primary text-sm sm:text-base leading-relaxed outline-none prose-editor overflow-y-auto ${
            resizable ? "resize-y" : ""
          }`}
        />
      </div>

      {renderModals()}
      <GlobalEditorStyles />
    </div>
  );
}

function GlobalEditorStyles() {
  return (
    <style jsx global>{`
      .prose-editor[style*="resize: vertical"],
      .prose-editor.resize-y {
        resize: vertical !important;
        max-height: 80vh;
      }
      .prose-editor:empty::before,
      .email-prose-editor:empty::before {
        content: attr(data-placeholder);
        color: var(--text-tertiary, #94a3b8);
        pointer-events: none;
      }

      /* Standard prose editor */
      .prose-editor h2 {
        font-size: 1.35rem;
        font-weight: 700;
        margin-top: 1.25rem;
        margin-bottom: 0.5rem;
        color: var(--text-primary);
      }
      .prose-editor h3 {
        font-size: 1.15rem;
        font-weight: 700;
        margin-top: 1rem;
        margin-bottom: 0.35rem;
        color: var(--text-primary);
      }
      .prose-editor p {
        margin-bottom: 0.65rem;
      }
      .prose-editor ul,
      .prose-editor ol {
        margin: 0.65rem 0;
        padding-left: 1.5rem;
      }
      .prose-editor ul {
        list-style: disc;
      }
      .prose-editor ol {
        list-style: decimal;
      }
      .prose-editor li {
        margin-bottom: 0.25rem;
      }
      .prose-editor blockquote {
        border-left: 4px solid var(--accent-primary);
        padding: 0.5rem 0.85rem;
        margin: 0.85rem 0;
        background: var(--surface-secondary);
        border-radius: 0 8px 8px 0;
        color: var(--text-secondary);
        font-style: italic;
      }
      .prose-editor pre {
        background: #0f172a;
        color: #38bdf8;
        padding: 0.85rem;
        border-radius: 8px;
        margin: 0.85rem 0;
        overflow-x: auto;
        font-family: monospace;
        font-size: 0.85rem;
        line-height: 1.5;
      }
      .prose-editor a {
        color: var(--accent-primary-hover, #6366f1);
        text-decoration: underline;
      }

      /* Authentic Email Canvas Editor */
      .email-prose-editor h1,
      .email-prose-editor .header-text {
        font-size: 24px;
        font-weight: 700;
        color: #002e5b;
        margin: 0 0 16px;
        font-family: "Inter", Helvetica, Arial, sans-serif;
        line-height: 1.3;
      }
      :global(.dark) .email-prose-editor h1,
      :global(.dark) .email-prose-editor .header-text {
        color: #60a5fa;
      }

      .email-prose-editor h2 {
        font-size: 20px;
        font-weight: 700;
        color: #002e5b;
        margin: 20px 0 12px;
      }
      .email-prose-editor span[data-inline-h2="true"],
      .email-prose-editor .inline-h2 {
        display: inline;
        font-size: 20px;
        font-weight: 700;
        color: #002e5b;
        line-height: 1.3;
        margin: 0;
      }
      :global(.dark) .email-prose-editor h2,
      :global(.dark) .email-prose-editor span[data-inline-h2="true"],
      :global(.dark) .email-prose-editor .inline-h2 {
        color: #93c5fd !important;
      }

      .email-prose-editor h3 {
        font-size: 16px;
        font-weight: 700;
        color: #002e5b;
        margin: 16px 0 8px;
      }
      .email-prose-editor span[data-inline-h3="true"],
      .email-prose-editor .inline-h3 {
        display: inline;
        font-size: 16px;
        font-weight: 700;
        color: #002e5b;
        line-height: 1.3;
        margin: 0;
      }
      :global(.dark) .email-prose-editor h3,
      :global(.dark) .email-prose-editor span[data-inline-h3="true"],
      :global(.dark) .email-prose-editor .inline-h3 {
        color: #93c5fd !important;
      }

      .email-prose-editor p,
      .email-prose-editor .body-text {
        margin: 0 0 16px;
        font-size: 15px;
        line-height: 1.6;
        color: #4b5563;
      }
      :global(.dark) .email-prose-editor p,
      :global(.dark) .email-prose-editor .body-text {
        color: #cbd5e1;
      }

      .email-prose-editor ul,
      .email-prose-editor ol {
        margin: 12px 0 16px;
        padding-left: 24px;
      }
      .email-prose-editor ul {
        list-style: disc;
      }
      .email-prose-editor ol {
        list-style: decimal;
      }
      .email-prose-editor li {
        margin-bottom: 6px;
        color: #4b5563;
      }
      :global(.dark) .email-prose-editor li {
        color: #cbd5e1;
      }

      .email-prose-editor blockquote {
        border-left: 4px solid var(--accent-primary, #f58a1f);
        padding: 8px 16px;
        margin: 16px 0;
        background: #f8fafc;
        border-radius: 0 8px 8px 0;
        color: #475569;
        font-style: italic;
      }
      :global(.dark) .email-prose-editor blockquote {
        background: #1e293b;
        color: #94a3b8;
      }

      .email-prose-editor pre {
        background: #0f172a;
        color: #38bdf8;
        padding: 14px;
        border-radius: 8px;
        margin: 16px 0;
        overflow-x: auto;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 13px;
        line-height: 1.5;
        border: 1px solid #1e293b;
      }

      .email-prose-editor a {
        color: #002e5b;
        font-weight: 600;
        text-decoration: underline;
      }
      :global(.dark) .email-prose-editor a {
        color: #60a5fa;
      }

      .email-prose-editor .btn-primary {
        display: inline-block;
        background-color: #002e5b;
        color: #ffffff !important;
        font-weight: 700;
        padding: 12px 28px;
        border-radius: 8px;
        text-decoration: none;
        margin: 16px 0;
        text-align: center;
        box-shadow: 0 4px 6px rgba(0, 46, 91, 0.2);
      }
      :global(.dark) .email-prose-editor .btn-primary {
        background-color: #f58a1f;
        color: #002e5b !important;
      }

      .email-prose-editor .otp-container {
        background-color: #fdf8f3;
        border: 2px dashed #f58a1f;
        border-radius: 12px;
        padding: 18px 0;
        width: 100%;
        max-width: 320px;
        text-align: center;
        margin: 16px auto;
      }
      :global(.dark) .email-prose-editor .otp-container {
        background-color: #262626;
        border-color: #f58a1f;
      }

      .email-prose-editor .otp-label {
        display: block;
        font-size: 11px;
        text-transform: uppercase;
        color: #888888;
        margin-bottom: 4px;
        font-weight: 600;
      }

      .email-prose-editor .otp-value {
        font-family: "Courier Prime", Courier, monospace;
        font-size: 28px;
        font-weight: 700;
        letter-spacing: 6px;
        color: #002e5b;
      }
      :global(.dark) .email-prose-editor .otp-value {
        color: #f58a1f;
      }

      .email-prose-editor .warning-box {
        margin: 12px 0;
        font-size: 13px;
        line-height: 1.5;
        color: #6b7280;
        background-color: #f9fafb;
        padding: 10px 14px;
        border-radius: 6px;
        border-left: 3px solid #f58a1f;
        display: block;
      }
      :global(.dark) .email-prose-editor .warning-box {
        background-color: #1e293b;
        color: #cbd5e1;
      }

      /* In-editor block styling */
      .email-prose-editor table {
        border-collapse: separate !important;
        max-width: 100% !important;
      }
      .email-prose-editor table td {
        word-break: break-word;
      }
      :global(.dark) .email-prose-editor table[style*="background-color: #eff6ff"],
      :global(.dark) .email-prose-editor table[style*="background-color: rgb(239, 246, 255)"] {
        background-color: #0f172a !important;
        border-color: #1e3a8a !important;
      }
      :global(.dark) .email-prose-editor table[style*="background-color: #fffbeb"],
      :global(.dark) .email-prose-editor table[style*="background-color: rgb(255, 251, 235)"] {
        background-color: #1c1917 !important;
        border-color: #78350f !important;
      }
      :global(.dark) .email-prose-editor table[style*="background-color: #f0fdf4"],
      :global(.dark) .email-prose-editor table[style*="background-color: rgb(240, 253, 244)"] {
        background-color: #052e16 !important;
        border-color: #14532d !important;
      }
      :global(.dark) .email-prose-editor table[style*="background-color: #faf5ff"],
      :global(.dark) .email-prose-editor table[style*="background-color: rgb(250, 245, 255)"] {
        background-color: #1e1b4b !important;
        border-color: #581c87 !important;
      }
      :global(.dark) .email-prose-editor table[style*="background-color: #f8fafc"],
      :global(.dark) .email-prose-editor table[style*="background-color: rgb(248, 250, 252)"] {
        background-color: #0f172a !important;
      }
      :global(.dark) .email-prose-editor table td div[style*="color: #002e5b"],
      :global(.dark) .email-prose-editor table td[style*="color: #002e5b"] {
        color: #93c5fd !important;
      }
    `}</style>
  );
}
