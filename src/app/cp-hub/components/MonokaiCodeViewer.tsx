"use client";

import React, { useState, useMemo } from "react";
import { Copy, Check, Terminal } from "lucide-react";

interface MonokaiCodeViewerProps {
  code: string;
  problemId?: string;
  language?: string;
}

// Token types for Monokai C++ Highlighting
type TokenType =
  | "comment"
  | "string"
  | "includeHeader"
  | "preprocessor"
  | "keyword"
  | "type"
  | "number"
  | "function"
  | "operator"
  | "plain";

interface Token {
  type: TokenType;
  text: string;
}

// Tokenize a single line of C++ code
function tokenizeCppLine(line: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const n = line.length;

  while (i < n) {
    // 1. Single-line comment //
    if (line[i] === "/" && line[i + 1] === "/") {
      tokens.push({ type: "comment", text: line.slice(i) });
      break;
    }

    // 2. Preprocessor directive (#include, #define, etc.)
    if (line[i] === "#") {
      let j = i + 1;
      while (j < n && /[a-zA-Z0-9_]/.test(line[j])) j++;
      const directive = line.slice(i, j);
      tokens.push({ type: "preprocessor", text: directive });
      i = j;

      // Handle header following #include (e.g. <bits/stdc++.h> or "myheader.h")
      if (directive === "#include") {
        // Skip whitespace
        while (i < n && /\s/.test(line[i])) {
          tokens.push({ type: "plain", text: line[i] });
          i++;
        }
        if (i < n && (line[i] === "<" || line[i] === '"')) {
          const closing = line[i] === "<" ? ">" : '"';
          let headerEnd = line.indexOf(closing, i + 1);
          if (headerEnd === -1) headerEnd = n - 1;
          tokens.push({
            type: "includeHeader",
            text: line.slice(i, headerEnd + 1),
          });
          i = headerEnd + 1;
        }
      }
      continue;
    }

    // 3. String literals ("...")
    if (line[i] === '"') {
      let j = i + 1;
      while (j < n && line[j] !== '"') {
        if (line[j] === "\\" && j + 1 < n) j += 2;
        else j++;
      }
      tokens.push({ type: "string", text: line.slice(i, j + 1) });
      i = j + 1;
      continue;
    }

    // 4. Character literals ('.')
    if (line[i] === "'") {
      let j = i + 1;
      while (j < n && line[j] !== "'") {
        if (line[j] === "\\" && j + 1 < n) j += 2;
        else j++;
      }
      tokens.push({ type: "string", text: line.slice(i, j + 1) });
      i = j + 1;
      continue;
    }

    // 5. Numbers (integers, floats, scientific notation like 1e18)
    if (/\d/.test(line[i])) {
      let j = i;
      while (j < n && /[0-9a-fA-FxXeEbB._]/.test(line[j])) j++;
      tokens.push({ type: "number", text: line.slice(i, j) });
      i = j;
      continue;
    }

    // 6. Identifiers, Keywords, Types, Functions
    if (/[a-zA-Z_]/.test(line[i])) {
      let j = i;
      while (j < n && /[a-zA-Z0-9_]/.test(line[j])) j++;
      const word = line.slice(i, j);

      // Check if followed by '(' (ignoring whitespace) -> function call
      let k = j;
      while (k < n && /\s/.test(line[k])) k++;
      const isFunction = k < n && line[k] === "(";

      if (isCppKeyword(word)) {
        tokens.push({ type: "keyword", text: word });
      } else if (isCppType(word)) {
        tokens.push({ type: "type", text: word });
      } else if (isFunction && !isCppKeyword(word)) {
        tokens.push({ type: "function", text: word });
      } else {
        tokens.push({ type: "plain", text: word });
      }
      i = j;
      continue;
    }

    // 7. Operators and punctuation
    if (/[+\-*\/%=&|<>!~?:;,.(){}\[\]]/.test(line[i])) {
      let j = i + 1;
      // Handle multi-character operators like <<, >>, ==, !=, <=, >=, &&, ||, ::, ->
      if (
        (line[i] === "<" && line[i + 1] === "<") ||
        (line[i] === ">" && line[i + 1] === ">") ||
        (line[i] === "=" && line[i + 1] === "=") ||
        (line[i] === "!" && line[i + 1] === "=") ||
        (line[i] === "<" && line[i + 1] === "=") ||
        (line[i] === ">" && line[i + 1] === "=") ||
        (line[i] === "&" && line[i + 1] === "&") ||
        (line[i] === "|" && line[i + 1] === "|") ||
        (line[i] === ":" && line[i + 1] === ":") ||
        (line[i] === "-" && line[i + 1] === ">") ||
        (line[i] === "+" && line[i + 1] === "+") ||
        (line[i] === "-" && line[i + 1] === "-")
      ) {
        j = i + 2;
      }
      tokens.push({ type: "operator", text: line.slice(i, j) });
      i = j;
      continue;
    }

    // 8. Plain whitespace or fallback
    tokens.push({ type: "plain", text: line[i] });
    i++;
  }

  return tokens;
}

const CPP_KEYWORDS = new Set([
  "using",
  "namespace",
  "return",
  "if",
  "else",
  "while",
  "for",
  "do",
  "break",
  "continue",
  "switch",
  "case",
  "default",
  "const",
  "auto",
  "static",
  "constexpr",
  "struct",
  "class",
  "public",
  "private",
  "protected",
  "virtual",
  "template",
  "typename",
  "typedef",
  "sizeof",
  "new",
  "delete",
  "true",
  "false",
  "nullptr",
  "NULL",
  "cin",
  "cout",
  "endl",
  "ios_base",
  "ios",
]);

const CPP_TYPES = new Set([
  "int",
  "long",
  "short",
  "char",
  "bool",
  "float",
  "double",
  "void",
  "unsigned",
  "signed",
  "vector",
  "string",
  "pair",
  "set",
  "map",
  "unordered_set",
  "unordered_map",
  "queue",
  "deque",
  "stack",
  "priority_queue",
  "multiset",
  "multimap",
  "bitset",
  "size_t",
  "int64_t",
  "uint64_t",
  "int32_t",
  "uint32_t",
]);

function isCppKeyword(word: string): boolean {
  return CPP_KEYWORDS.has(word);
}

function isCppType(word: string): boolean {
  return CPP_TYPES.has(word);
}

// Monokai Color mapping
function getTokenColor(type: TokenType): string {
  switch (type) {
    case "comment":
      return "#75715e"; // Monokai Gray/Olive
    case "preprocessor":
      return "#f92672"; // Monokai Hot Pink
    case "includeHeader":
      return "#e6db74"; // Monokai Yellow
    case "string":
      return "#e6db74"; // Monokai Yellow
    case "keyword":
      return "#f92672"; // Monokai Hot Pink
    case "type":
      return "#66d9ef"; // Monokai Cyan
    case "number":
      return "#ae81ff"; // Monokai Lavender Purple
    case "function":
      return "#a6e22e"; // Monokai Bright Lime
    case "operator":
      return "#f92672"; // Monokai Pink for operators
    case "plain":
    default:
      return "#f8f8f2"; // Monokai Off-White text
  }
}

export default function MonokaiCodeViewer({
  code,
  problemId,
  language = "C++ (GCC 11+)",
}: MonokaiCodeViewerProps) {
  const [copied, setCopied] = useState(false);

  // Split code into lines and tokenize
  const tokenizedLines = useMemo(() => {
    if (!code) return [];
    const rawLines = code.split("\n");
    return rawLines.map((line) => tokenizeCppLine(line));
  }, [code]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="flex flex-col h-full min-h-0 rounded-xl overflow-hidden border border-[#3e3d32] shadow-2xl"
      style={{ backgroundColor: "#272822" }}
    >
      {/* Editor Header Bar */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-[#3e3d32] shrink-0"
        style={{ backgroundColor: "#1e1f1c" }}
      >
        {/* Left: Window Dots & Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="hidden sm:flex items-center gap-1.5 shrink-0">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block opacity-90" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block opacity-90" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block opacity-90" />
          </div>

          <div className="flex items-center gap-2 sm:pl-2 border-l-0 sm:border-l sm:border-[#3e3d32] min-w-0">
            <Terminal size={14} className="text-[#a6e22e] shrink-0" />
            <span className="font-mono text-xs font-bold text-[#f8f8f2] truncate max-w-[140px] sm:max-w-none">
              {problemId ? `solution_${problemId}.cpp` : "solution.cpp"}
            </span>
            <span className="hidden md:inline-block font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#3e3d32] text-[#66d9ef] font-bold shrink-0">
              {language}
            </span>
          </div>
        </div>

        {/* Right: Copy Button */}
        <button
          onClick={handleCopy}
          type="button"
          aria-label="Copy source code"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer shadow-xs border border-[#49483e] hover:border-[#66d9ef]"
          style={{
            backgroundColor: copied ? "#27c93f" : "#3e3d32",
            color: copied ? "#000000" : "#f8f8f2",
          }}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          <span>{copied ? "Copied!" : "Copy"}</span>
        </button>
      </div>

      {/* Editor Body with Line Numbers & Monokai Syntax */}
      <div
        className="flex-1 min-h-0 overflow-y-auto overflow-x-auto p-4 font-mono text-xs sm:text-sm leading-6 selection:bg-[#49483e] selection:text-[#f8f8f2]"
        style={{ backgroundColor: "#272822" }}
      >
        <div className="min-w-max flex">
          {/* Line Numbers Column */}
          <div
            className="select-none text-right pr-4 mr-4 border-r border-[#3e3d32] text-[#75715e] font-mono text-xs sm:text-sm"
            aria-hidden="true"
          >
            {tokenizedLines.map((_, idx) => (
              <div key={idx} className="h-6 leading-6">
                {idx + 1}
              </div>
            ))}
          </div>

          {/* Code Lines Column */}
          <div className="flex-1 font-mono">
            {tokenizedLines.map((tokens, lineIdx) => (
              <div key={lineIdx} className="h-6 leading-6 whitespace-pre">
                {tokens.length === 0 ? (
                  <span>&nbsp;</span>
                ) : (
                  tokens.map((token, tokenIdx) => (
                    <span
                      key={tokenIdx}
                      style={{
                        color: getTokenColor(token.type),
                        fontStyle:
                          token.type === "comment" ? "italic" : "normal",
                        fontWeight:
                          token.type === "keyword" || token.type === "type"
                            ? 600
                            : 400,
                      }}
                    >
                      {token.text}
                    </span>
                  ))
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
