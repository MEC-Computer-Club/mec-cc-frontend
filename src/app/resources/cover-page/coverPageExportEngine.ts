"use client";

/**
 * Creates an isolated offscreen iframe for clean DOM cloning.
 * This guarantees:
 * 1. Next.js / Tailwind CSS modern color tokens (oklch) in the main app
 *    do not crash printing.
 * 2. The document is rendered at exactly 816px x 1056px without any
 *    parent layout interference, zoom, or viewport scaling.
 */
function createIsolatedIframe(): HTMLIFrameElement {
  const existing = document.getElementById("mec-cover-export-iframe");
  if (existing) {
    try {
      existing.remove();
    } catch {
      // Ignore
    }
  }

  const iframe = document.createElement("iframe");
  iframe.id = "mec-cover-export-iframe";
  iframe.style.position = "fixed";
  iframe.style.left = "-9999px";
  iframe.style.top = "-9999px";
  iframe.style.width = "816px";
  iframe.style.height = "1056px";
  iframe.style.border = "none";
  iframe.style.opacity = "0";
  iframe.style.pointerEvents = "none";
  iframe.style.zIndex = "-9999";
  iframe.setAttribute("aria-hidden", "true");

  document.body.appendChild(iframe);
  return iframe;
}

/**
 * Injects clean HTML5 skeleton, authentic fonts, and cloned DOM with
 * resolved inline computed styles into the isolated iframe.
 */
function populateIsolatedIframe(
  iframe: HTMLIFrameElement,
  sourceElement: HTMLElement
): HTMLElement | null {
  const doc = iframe.contentDocument;
  if (!doc) return null;

  doc.open();
  doc.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>MEC Document Print</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
  <style>
    @page {
      size: letter portrait;
      margin: 0;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    html, body {
      background: #ffffff !important;
      color: #000000 !important;
      width: 816px !important;
      height: 1056px !important;
      min-width: 816px !important;
      min-height: 1056px !important;
      max-width: 816px !important;
      max-height: 1056px !important;
      margin: 0 !important;
      padding: 0 !important;
      overflow: hidden !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .font-quicksand, .font-quicksand * {
      font-family: 'Quicksand', 'Nunito', 'Segoe UI', system-ui, sans-serif !important;
    }
    .font-space-mono, .font-space-mono * {
      font-family: 'Space Mono', monospace !important;
    }
    /* Hide edit outlines in export */
    .inline-editable {
      outline: none !important;
      background: transparent !important;
      border: none !important;
    }
  </style>
</head>
<body>
</body>
</html>`);
  doc.close();

  // Clone source tree
  const clone = sourceElement.cloneNode(true) as HTMLElement;

  // Enforce true 1:1 dimensions without zoom/scale artifacts
  clone.style.transform = "none";
  clone.style.webkitTransform = "none";
  clone.style.boxShadow = "none";
  clone.style.border = "none";
  clone.style.outline = "none";
  clone.style.margin = "0";
  clone.style.position = "relative";
  clone.style.width = "816px";
  clone.style.height = "1056px";
  clone.style.minWidth = "816px";
  clone.style.minHeight = "1056px";
  clone.style.maxWidth = "816px";
  clone.style.maxHeight = "1056px";
  clone.style.display = "block";
  clone.style.background = "#ffffff";
  clone.style.color = "#000000";

  // Recursively map computed styles from live DOM to clone elements
  const srcElements = [sourceElement, ...Array.from(sourceElement.querySelectorAll<HTMLElement>("*"))];
  const dstElements = [clone, ...Array.from(clone.querySelectorAll<HTMLElement>("*"))];

  for (let i = 0; i < srcElements.length; i++) {
    const src = srcElements[i];
    const dst = dstElements[i];
    if (!src || !dst) continue;

    const comp = window.getComputedStyle(src);

    // Skip applying transform or borders to the root container
    if (i === 0) {
      dst.style.padding = comp.padding;
      dst.style.flexDirection = comp.flexDirection;
      dst.style.justifyContent = comp.justifyContent;
      dst.style.display = comp.display;
      continue;
    }

    dst.style.fontFamily = comp.fontFamily;
    dst.style.fontSize = comp.fontSize;
    dst.style.fontWeight = comp.fontWeight;
    dst.style.lineHeight = comp.lineHeight;
    dst.style.letterSpacing = comp.letterSpacing;
    dst.style.textAlign = comp.textAlign;
    dst.style.display = comp.display;
    dst.style.color = comp.color && !comp.color.includes("oklch") ? comp.color : "#000000";
    dst.style.backgroundColor =
      comp.backgroundColor && !comp.backgroundColor.includes("oklch") ? comp.backgroundColor : "transparent";
    dst.style.borderColor =
      comp.borderColor && !comp.borderColor.includes("oklch") ? comp.borderColor : "#000000";
    dst.style.padding = comp.padding;
    dst.style.margin = comp.margin;
    dst.style.width = comp.width;
    dst.style.height = comp.height;
    dst.style.position = comp.position;
    dst.style.top = comp.top;
    dst.style.bottom = comp.bottom;
    dst.style.left = comp.left;
    dst.style.right = comp.right;
    dst.style.flexDirection = comp.flexDirection;
    dst.style.justifyContent = comp.justifyContent;
    dst.style.alignItems = comp.alignItems;
    dst.style.alignSelf = comp.alignSelf;
    dst.style.flexGrow = comp.flexGrow;
    dst.style.flexShrink = comp.flexShrink;
    dst.style.gridTemplateColumns = comp.gridTemplateColumns;
    dst.style.gap = comp.gap;
    dst.style.borderWidth = comp.borderWidth;
    dst.style.borderStyle = comp.borderStyle;
  }

  doc.body.appendChild(clone);
  return clone;
}

/**
 * Triggers native system print dialog with exact US Letter sizing via isolated iframe.
 */
export async function printCoverPage(element: HTMLElement): Promise<void> {
  const iframe = createIsolatedIframe();

  try {
    const clonedSheet = populateIsolatedIframe(iframe, element);
    if (!clonedSheet || !iframe.contentWindow) {
      window.print();
      return;
    }

    if (iframe.contentDocument && iframe.contentDocument.fonts) {
      await iframe.contentDocument.fonts.ready;
    }

    await new Promise((resolve) => setTimeout(resolve, 250));

    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  } catch {
    window.print();
  } finally {
    setTimeout(() => {
      try {
        iframe.remove();
      } catch {
        // Ignore
      }
    }, 2000);
  }
}