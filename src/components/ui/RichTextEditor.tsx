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
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  label?: string;
  disabled?: boolean;
  resizable?: boolean;
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
        let node: Node | null = sel.anchorNode;
        while (node && node !== editorRef.current && node !== document.body) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const tag = (node as HTMLElement).tagName?.toLowerCase();
            if (tag === "h2") isH2 = true;
            if (tag === "h3") isH3 = true;
            if (tag === "blockquote") isQuote = true;
            if (tag === "pre") isPre = true;
          }
          node = node.parentNode;
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
      // Ignore queryCommandState error
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

  const handleInput = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    isInternalChangeRef.current = true;
    onChange(html === "<p><br></p>" || html === "<br>" ? "" : html);
    updateActiveFormats();
  };

  const execCommand = useCallback(
    (command: string, arg?: string) => {
      if (disabled) return;
      editorRef.current?.focus();
      document.execCommand(command, false, arg);
      handleInput();
      setTimeout(updateActiveFormats, 10);
    },
    [disabled, updateActiveFormats]
  );

  const handleToolbarClick = useCallback(
    (action: ToolbarAction) => {
      if (disabled) return;
      editorRef.current?.focus();

      if (action.command === "formatBlock") {
        const blockType = action.arg?.toLowerCase();
        if (blockType === "h2") {
          document.execCommand("formatBlock", false, activeFormats.h2 ? "<p>" : "<h2>");
        } else if (blockType === "h3") {
          document.execCommand("formatBlock", false, activeFormats.h3 ? "<p>" : "<h3>");
        } else if (blockType === "blockquote") {
          document.execCommand("formatBlock", false, activeFormats.blockquote ? "<p>" : "<blockquote>");
        } else if (blockType === "pre") {
          document.execCommand("formatBlock", false, activeFormats.pre ? "<p>" : "<pre>");
        }
      } else {
        document.execCommand(action.command, false, action.arg);
      }

      handleInput();
      setTimeout(updateActiveFormats, 10);
    },
    [disabled, activeFormats, updateActiveFormats]
  );

  const handleLink = useCallback(() => {
    if (disabled) return;
    const url = prompt("Enter URL (e.g. https://example.com):");
    if (url) {
      execCommand("createLink", url);
    }
  }, [disabled, execCommand]);

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
                className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg border transition-all text-xs ${
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
            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg border border-transparent text-text-secondary hover:text-text-primary hover:bg-surface-elevated hover:border-border-default transition-all"
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

      <style jsx global>{`
        .prose-editor[style*="resize: vertical"],
        .prose-editor.resize-y {
          resize: vertical !important;
          max-height: 80vh;
        }
        .prose-editor:empty::before {
          content: attr(data-placeholder);
          color: var(--text-tertiary, #94a3b8);
          pointer-events: none;
        }
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
      `}</style>
    </div>
  );
}
