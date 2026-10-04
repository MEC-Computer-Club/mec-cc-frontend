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

  const handleLink = useCallback(() => {
    if (disabled) return;
    const url = prompt("Enter URL (e.g. https://example.com):");
    if (url) {
      execCommand("createLink", url);
    }
  }, [disabled, execCommand]);

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
      toast.success(`Inserted ${token} at cursor position`);
    },
    [disabled, handleInput]
  );

  const toolbarActions: (ToolbarAction | "separator")[] = [
    { icon: <Bold size={15} />, command: "bold", title: "Bold (Ctrl+B)" },
    { icon: <Italic size={15} />, command: "italic", title: "Italic (Ctrl+I)" },
    { icon: <Underline size={15} />, command: "underline", title: "Underline (Ctrl+U)" },
    { icon: <Strikethrough size={15} />, command: "strikeThrough", title: "Strikethrough" },
    "separator",
    { icon: <Heading2 size={15} />, command: "formatBlock", arg: "h2", title: "Heading 2" },
    { icon: <Heading3 size={15} />, command: "formatBlock", arg: "h3", title: "Heading 3" },
    { icon: <Quote size={15} />, command: "formatBlock", arg: "blockquote", title: "Blockquote" },
    { icon: <Code size={15} />, command: "formatBlock", arg: "pre", title: "Code Block (Click again to undo)" },
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

  // ─────────────────────────────────────────────────────────────
  // 1. LIVE EMAIL STUDIO CANVAS MODE (In-Place Live Preview & Editor)
  // ─────────────────────────────────────────────────────────────
  if (variant === "email-canvas") {
    const previewDevice = emailMetadata?.previewDevice || "desktop";
    const useSampleData = Boolean(emailMetadata?.useSampleData);
    const quickTokens = emailMetadata?.quickTokens || [];

    return (
      <div className="w-full flex flex-col space-y-3">
        {/* Studio Formatting Toolbar Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-surface-secondary border border-border-default rounded-xl select-none">
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
              onMouseDown={(e) => {
                e.preventDefault();
                handleLink();
              }}
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

        {/* Status / Guidance Banner */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-accent-primary/10 border border-accent-primary/20 rounded-lg text-[11px] text-text-secondary font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Email Studio • Click anywhere inside the email card to edit Title, Greeting, Body, Reference Schedule, and Regards directly in real time.
          </span>
          <span className="text-[10px] font-mono text-text-tertiary uppercase font-bold">
            Interactive WYSIWYG
          </span>
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
        <div className="flex flex-wrap items-center gap-1 px-2.5 py-1.5 bg-surface-secondary border-b border-border-default select-none">
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
            onMouseDown={(e) => {
              e.preventDefault();
              handleLink();
            }}
            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg border border-transparent text-text-secondary hover:text-text-primary hover:bg-surface-elevated hover:border-border-default transition-all cursor-pointer"
          >
            <LinkIcon size={15} />
          </button>
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
    `}</style>
  );
}
