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
  iframe.style.width = "794px";
  iframe.style.height = "1123px";
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
  <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Quicksand:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
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
      width: 794px !important;
      height: 1123px !important;
      min-width: 794px !important;
      min-height: 1123px !important;
      max-width: 794px !important;
      max-height: 1123px !important;
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
    .font-latex, .font-latex * {
      font-family: 'EB Garamond', 'Latin Modern Roman', 'Computer Modern', 'Times New Roman', Times, serif !important;
    }
    table {
      border-collapse: collapse !important;
    }
    th, td {
      box-sizing: border-box !important;
    }
    /* Hide edit outlines in export */
    .inline-editable {
      outline: none !important;
    }
    .inline-editable:hover,
    .inline-editable:focus {
      outline: none !important;
      background-color: transparent !important;
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
  clone.style.margin = "0 auto";
  clone.style.position = "relative";
  clone.style.width = "794px";
  clone.style.height = "1123px";
  clone.style.minWidth = "794px";
  clone.style.minHeight = "1123px";
  clone.style.maxWidth = "794px";
  clone.style.maxHeight = "1123px";
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

    // Skip internal SVG elements so pure vector paths, lines, and text transforms are preserved perfectly
    if (src instanceof SVGElement && src.tagName.toLowerCase() !== "svg") {
      continue;
    }

    const comp = window.getComputedStyle(src);

    // Skip applying transform or borders to the root container
    if (i === 0) {
      dst.style.padding = comp.padding;
      dst.style.flexDirection = comp.flexDirection;
      dst.style.justifyContent = comp.justifyContent;
      dst.style.display = comp.display;
      continue;
    }

    // Table element support
    if (src.tagName === "TABLE") {
      dst.style.borderCollapse = comp.borderCollapse || "collapse";
      dst.style.tableLayout = comp.tableLayout || "fixed";
    }
    if (src.tagName === "TH" || src.tagName === "TD") {
      dst.style.verticalAlign = comp.verticalAlign || "middle";
    }

    // Copy padding for every element so text never collapses into borders
    dst.style.paddingTop = comp.paddingTop;
    dst.style.paddingRight = comp.paddingRight;
    dst.style.paddingBottom = comp.paddingBottom;
    dst.style.paddingLeft = comp.paddingLeft;
    dst.style.boxSizing = "border-box";

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

    // Explicit 4-directional borders: Prevents single-side borders (border-b, border-r, border-b-2)
    // from disappearing due to CSSOM shorthand getComputedStyle.borderWidth returning empty string ("")
    dst.style.borderTopWidth = comp.borderTopWidth;
    dst.style.borderTopStyle = comp.borderTopStyle;
    dst.style.borderTopColor = comp.borderTopColor && !comp.borderTopColor.includes("oklch") ? comp.borderTopColor : "#000000";

    dst.style.borderRightWidth = comp.borderRightWidth;
    dst.style.borderRightStyle = comp.borderRightStyle;
    dst.style.borderRightColor = comp.borderRightColor && !comp.borderRightColor.includes("oklch") ? comp.borderRightColor : "#000000";

    dst.style.borderBottomWidth = comp.borderBottomWidth;
    dst.style.borderBottomStyle = comp.borderBottomStyle;
    dst.style.borderBottomColor = comp.borderBottomColor && !comp.borderBottomColor.includes("oklch") ? comp.borderBottomColor : "#000000";

    dst.style.borderLeftWidth = comp.borderLeftWidth;
    dst.style.borderLeftStyle = comp.borderLeftStyle;
    dst.style.borderLeftColor = comp.borderLeftColor && !comp.borderLeftColor.includes("oklch") ? comp.borderLeftColor : "#000000";

    // Preserve direct inline style overrides if specifically set on source
    if (src.style.border) dst.style.border = src.style.border;
    if (src.style.borderBottom) dst.style.borderBottom = src.style.borderBottom;
    if (src.style.borderRight) dst.style.borderRight = src.style.borderRight;
    if (src.style.borderTop) dst.style.borderTop = src.style.borderTop;
    if (src.style.borderLeft) dst.style.borderLeft = src.style.borderLeft;
    if (src.style.backgroundColor) dst.style.backgroundColor = src.style.backgroundColor;
    if (src.style.padding) dst.style.padding = src.style.padding;
    if (src.style.paddingLeft) dst.style.paddingLeft = src.style.paddingLeft;
    if (src.style.paddingRight) dst.style.paddingRight = src.style.paddingRight;
    if (src.style.paddingTop) dst.style.paddingTop = src.style.paddingTop;
    if (src.style.paddingBottom) dst.style.paddingBottom = src.style.paddingBottom;

    // Preserve margins and spacing so elements (like logos, headers, and text) maintain exact vertical gaps in print
    dst.style.marginTop = comp.marginTop;
    dst.style.marginBottom = comp.marginBottom;

    if (src.classList.contains("mx-auto")) {
      dst.style.marginLeft = "auto";
      dst.style.marginRight = "auto";
    } else {
      dst.style.marginLeft = comp.marginLeft;
      dst.style.marginRight = comp.marginRight;
    }

    if (src.style.marginTop) dst.style.marginTop = src.style.marginTop;
    if (src.style.marginBottom) dst.style.marginBottom = src.style.marginBottom;
    if (src.style.marginLeft) dst.style.marginLeft = src.style.marginLeft;
    if (src.style.marginRight) dst.style.marginRight = src.style.marginRight;

    // Dimensions
    if (src.tagName === "IMG") {
      dst.style.width = src.style.width || comp.width;
      dst.style.height = src.style.height || comp.height;
    } else if (src.classList.contains("w-full") || src.style.width === "100%") {
      dst.style.width = "100%";
    } else if (src.classList.contains("w-fit")) {
      dst.style.width = "fit-content";
    } else {
      dst.style.width = comp.width;
    }
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
  }

  doc.body.appendChild(clone);
  return clone;
}

/**
 * Triggers native system print dialog with exact A4 sizing via isolated iframe.
 */
export async function printCoverPage(element: HTMLElement): Promise<void> {
  const iframe = createIsolatedIframe();

  try {
    // Temporarily reset transform: scale(...) so computed styles are measured at true 1:1 A4
    const origTransform = element.style.transform;
    element.style.transform = "none";

    let clonedSheet: HTMLElement | null = null;
    try {
      clonedSheet = populateIsolatedIframe(iframe, element);
    } finally {
      element.style.transform = origTransform;
    }

    if (!clonedSheet || !iframe.contentWindow) {
      window.print();
      return;
    }

    if (iframe.contentDocument && iframe.contentDocument.fonts) {
      await iframe.contentDocument.fonts.ready;
    }

    await new Promise((resolve) => setTimeout(resolve, 300));

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