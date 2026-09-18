/**
 * MEC Computer Club - The Sigil Forge
 * Core client-side canvas watermarking engine.
 * Renders high-fidelity "Fade + Split" overlay with Space Grotesk typography
 * and circular top-right monogram seal, proportionally scaled to any resolution.
 */

export type FontCombination = "website" | "space" | "clean";

export interface WatermarkConfig {
  eventName: string;
  date: string;
  clubName: string;
  fontSizeMultiplier: number; // 0.7 - 1.6
  gradientColor: string; // hex, e.g. #000000
  gradientDepth: number; // percentage 20 - 75
  gradientOpacity: number; // percentage 40 - 100
  showMonogram: boolean;
  monogramSizeMultiplier: number; // 0.3 - 3.5
  monogramBorder: boolean;
  monogramColor: string; // hex, e.g. #FFFFFF
  monogramShadow: boolean; // default: false (no shadow/glow by default)
  fontStyle: FontCombination; // "website" | "space" | "clean"
}

export const DEFAULT_WATERMARK_CONFIG: WatermarkConfig = {
  eventName: "MEC Programming Contest 2026",
  date: "September 18, 2026",
  clubName: "MEC Computer Club",
  fontSizeMultiplier: 1.0,
  gradientColor: "#000000",
  gradientDepth: 36,
  gradientOpacity: 92,
  showMonogram: true,
  monogramSizeMultiplier: 1.0,
  monogramBorder: false,
  monogramColor: "#FFFFFF",
  monogramShadow: false,
  fontStyle: "website",
};

/**
 * Ensure Space Grotesk, JetBrains Mono, and General Sans fonts are loaded into the browser context.
 */
export async function ensureFontLoaded(): Promise<void> {
  if (typeof document === "undefined") return;
  try {
    if (!document.getElementById("watermark-font-loader")) {
      const link = document.createElement("link");
      link.id = "watermark-font-loader";
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Space+Grotesk:wght@500;700&display=swap";
      document.head.appendChild(link);
    }
    if (document.fonts && document.fonts.load) {
      await Promise.all([
        document.fonts.load('700 32px "General Sans"'),
        document.fonts.load('500 20px "General Sans"'),
        document.fonts.load('700 32px "Space Grotesk"'),
        document.fonts.load('500 20px "Space Grotesk"'),
        document.fonts.load('500 16px "JetBrains Mono"'),
        document.fonts.load('700 16px "JetBrains Mono"'),
      ]);
    }
  } catch (err) {
    console.warn("Font loading fallback engaged:", err);
  }
}

/**
 * Hex to RGBA helper
 */
function hexToRgba(hex: string, alpha: number): string {
  let cleaned = hex.replace("#", "").trim();
  if (cleaned.length === 3) {
    cleaned = cleaned
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (cleaned.length !== 6) {
    return `rgba(0, 0, 0, ${alpha})`;
  }
  const r = parseInt(cleaned.substring(0, 2), 16);
  const g = parseInt(cleaned.substring(2, 4), 16);
  const b = parseInt(cleaned.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Word wrap helper for canvas
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = words[0] || "";

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + " " + word).width;
    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

/**
 * Render the watermark overlay onto the provided or newly created canvas.
 * Preserves exact original photo dimensions while scaling overlay proportionally.
 */
export async function renderWatermarkOnCanvas(
  sourceImage: HTMLImageElement,
  sigilImage: HTMLImageElement | null,
  config: WatermarkConfig,
  targetCanvas?: HTMLCanvasElement
): Promise<HTMLCanvasElement> {
  await ensureFontLoaded();

  const width = sourceImage.naturalWidth || sourceImage.width;
  const height = sourceImage.naturalHeight || sourceImage.height;

  // Guard: if the source image hasn't actually decoded (e.g. a race where
  // `onload` fired but naturalWidth/Height are still 0), fail loudly here
  // instead of silently producing a 0x0 canvas that later exports as a
  // "valid" but essentially empty JPEG.
  if (!width || !height) {
    throw new Error(
      `Source image has no usable dimensions (got ${width}\u00d7${height}) ` +
      `- it may not have finished decoding before rendering was attempted.`
    );
  }

  const canvas = targetCanvas || document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d", { willReadFrequently: false });
  if (!ctx) throw new Error("Could not get 2D canvas context");

  // Clear and draw original image
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(sourceImage, 0, 0, width, height);

  // Proportional scale factor based on minimum dimension (normalised to 1080px base)
  const baseDim = Math.min(width, height);
  const scale = Math.max(0.4, baseDim / 1080);
  const isPortrait = height > width;

  // --- 1. Fade Gradient (Bottom) ---
  // Pure Apple-grade cubic scrim gradient:
  // Dynamically anchored to the lower region so it never covers portrait faces or chest subjects.
  const rawDepth = Math.min(Math.max(config.gradientDepth, 15), 75) / 100;
  // In portrait photos (height > width), cap vertical climb so it strictly covers text + gentle breathing room
  const maxPortraitRatio = isPortrait ? 0.28 : 0.45;
  const effectiveDepth = Math.min(rawDepth, maxPortraitRatio);

  const gradientHeight = Math.max(
    Math.round(height * effectiveDepth),
    Math.round(160 * scale)
  );
  const gradientStartY = height - gradientHeight;
  const maxOpacity = Math.min(Math.max(config.gradientOpacity, 10), 100) / 100;

  // Ultra-smooth non-linear cubic scrim gradient stops
  // (Zero banding, zero harsh edge lines, perfectly buttery falloff)
  const gradient = ctx.createLinearGradient(0, gradientStartY, 0, height);
  gradient.addColorStop(0.0, hexToRgba(config.gradientColor, 0));
  gradient.addColorStop(0.2, hexToRgba(config.gradientColor, maxOpacity * 0.03));
  gradient.addColorStop(0.4, hexToRgba(config.gradientColor, maxOpacity * 0.14));
  gradient.addColorStop(0.6, hexToRgba(config.gradientColor, maxOpacity * 0.38));
  gradient.addColorStop(0.8, hexToRgba(config.gradientColor, maxOpacity * 0.72));
  gradient.addColorStop(1.0, hexToRgba(config.gradientColor, maxOpacity));

  ctx.fillStyle = gradient;
  ctx.fillRect(0, gradientStartY, width, gradientHeight);

  // --- 2. Typography & Metadata Overlay ---
  const paddingX = Math.round(52 * scale);
  const paddingBottom = Math.round(48 * scale);
  const maxTextWidth = width - paddingX * 2;

  const titleSize = Math.max(18, Math.round(44 * scale * config.fontSizeMultiplier));
  const subSize = Math.max(12, Math.round(21 * scale * config.fontSizeMultiplier));
  const lineSpacing = Math.round(10 * scale);

  // Determine font families according to config.fontStyle
  let titleFamily = '"General Sans", "Space Grotesk", system-ui, -apple-system, sans-serif';
  let subtitleFamily = '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';

  if (config.fontStyle === "space") {
    titleFamily = '"Space Grotesk", system-ui, -apple-system, sans-serif';
    subtitleFamily = '"JetBrains Mono", ui-monospace, monospace';
  } else if (config.fontStyle === "clean") {
    titleFamily = '"General Sans", system-ui, -apple-system, sans-serif';
    subtitleFamily = '"General Sans", system-ui, -apple-system, sans-serif';
  }

  // Measure Subtitle line
  const clubText = (config.clubName || "MEC Computer Club").trim();
  const dateText = (config.date || "").trim();
  const subtitleLine = dateText ? `${clubText}  \u2022  ${dateText}` : clubText;

  ctx.font = `500 ${subSize}px ${subtitleFamily}`;
  const subHeight = subSize;

  // Measure Title lines
  ctx.font = `700 ${titleSize}px ${titleFamily}`;
  const titleText = (config.eventName || "Event Photo").trim();
  const titleLines = wrapText(ctx, titleText, maxTextWidth);
  const titleLineHeight = Math.round(titleSize * 1.18);

  let currentY = height - paddingBottom;

  // Render Subtitle first at the bottom line
  // NO DROP SHADOW OR GLOW ON FONT (Clean flat typography as requested by user)
  ctx.save();
  ctx.font = `500 ${subSize}px ${subtitleFamily}`;
  ctx.fillStyle = "rgba(255, 255, 255, 0.90)";
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.fillText(subtitleLine, paddingX, currentY);
  ctx.restore();

  currentY -= subHeight + lineSpacing;

  // Render Title lines (stacked above subtitle)
  // NO DROP SHADOW OR GLOW ON FONT (Clean flat typography as requested by user)
  ctx.save();
  ctx.font = `700 ${titleSize}px ${titleFamily}`;
  ctx.fillStyle = "#FFFFFF";
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  const titleStartY = currentY - (titleLines.length - 1) * titleLineHeight;
  for (let i = 0; i < titleLines.length; i++) {
    ctx.fillText(titleLines[i], paddingX, titleStartY + i * titleLineHeight);
  }
  ctx.restore();

  // --- 3. Top-Right Monogram Watermark (Pure Transparent, Highly Scalable, Optional Shadow) ---
  if (config.showMonogram && sigilImage) {
    const naturalW = sigilImage.naturalWidth || sigilImage.width || 1;
    const naturalH = sigilImage.naturalHeight || sigilImage.height || 1;
    const aspect = naturalW / naturalH;

    // Highly scalable width base: 180px at 1.0x on a standard 1080p base dimension
    const baseTargetWidth = Math.round(180 * scale * config.monogramSizeMultiplier);

    let targetW = baseTargetWidth;
    let targetH = Math.round(targetW / aspect);

    // If logo is taller than wide (portrait aspect < 0.85), scale by height instead
    if (aspect < 0.85) {
      targetH = Math.round(130 * scale * config.monogramSizeMultiplier);
      targetW = Math.round(targetH * aspect);
    }

    const paddingRight = Math.round(44 * scale);
    const paddingTop = Math.round(40 * scale);

    const drawX = width - paddingRight - targetW;
    const drawY = paddingTop;

    ctx.save();

    // High quality tinting to config.monogramColor
    const tintColor = config.monogramColor || "#FFFFFF";

    // Use offscreen canvas for crisp anti-aliased tinting
    const offCanvas = document.createElement("canvas");
    offCanvas.width = Math.max(1, Math.ceil(targetW));
    offCanvas.height = Math.max(1, Math.ceil(targetH));
    const offCtx = offCanvas.getContext("2d", { willReadFrequently: false });

    if (offCtx) {
      offCtx.imageSmoothingEnabled = true;
      offCtx.imageSmoothingQuality = "high";

      // 1. Draw monogram in native alpha
      offCtx.drawImage(sigilImage, 0, 0, offCanvas.width, offCanvas.height);

      // 2. Tint with monogramColor
      offCtx.globalCompositeOperation = "source-in";
      offCtx.fillStyle = tintColor;
      offCtx.fillRect(0, 0, offCanvas.width, offCanvas.height);

      // 3. Optional soft drop shadow / glow behind logo (Disabled by default)
      if (config.monogramShadow) {
        ctx.shadowColor = "rgba(0, 0, 0, 0.75)";
        ctx.shadowBlur = Math.round(8 * scale);
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = Math.round(2 * scale);
      } else {
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(offCanvas, drawX, drawY, targetW, targetH);
    } else {
      ctx.drawImage(sigilImage, drawX, drawY, targetW, targetH);
    }

    ctx.restore();
  }

  return canvas;
}

/**
 * Convert an image file / object URL to an HTMLImageElement.
 * Waits for full decode (not just the `load` event) so canvas draws never
 * race ahead of pixel data being ready.
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      // `decode()` guarantees the bitmap is fully available before we hand
      // the image back for drawImage(). Falls back gracefully if the
      // browser lacks it or decode() itself rejects (rare, but non-fatal
      // since onload already fired).
      if (typeof img.decode === "function") {
        img
          .decode()
          .then(() => resolve(img))
          .catch(() => resolve(img));
      } else {
        resolve(img);
      }
    };
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

/**
 * Convert canvas to Blob. Rejects on a null result AND on a suspiciously
 * empty/undersized result, so a 0x0 or near-blank render fails loudly
 * instead of silently downloading as a "successful" but corrupt file.
 */
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string = "image/jpeg",
  quality: number = 0.93
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    if (!canvas.width || !canvas.height) {
      reject(new Error(`Cannot export a ${canvas.width}\u00d7${canvas.height} canvas`));
      return;
    }
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas toBlob failed"));
          return;
        }
        if (blob.size < 1000) {
          reject(
            new Error(
              `Render produced a suspiciously small blob (${blob.size} bytes) - likely an empty canvas`
            )
          );
          return;
        }
        resolve(blob);
      },
      type,
      quality
    );
  });
}

/**
 * Robust client-side file download.
 *
 * Uses the native `anchor.click()` method (NOT a synthetic
 * `dispatchEvent(new MouseEvent(...))`). Chrome only reliably honors the
 * `download` attribute's suggested filename for a real `.click()` call -
 * a dispatched MouseEvent is treated as an untrusted/scripted event and,
 * once transient user-activation has expired (which it has by this point,
 * since we got here via several awaited async steps), Chrome falls back to
 * treating it as an anonymous/automatic download and substitutes its own
 * internal blob identifier as the filename with no extension. That's the
 * exact "UUID with no extension" bug in the download history.
 */
export function downloadFile(blob: Blob, filename: string): void {
  if (typeof window === "undefined" || !blob) return;

  const cleanFilename = filename.trim();
  let mimeType = blob.type;

  if (cleanFilename.toLowerCase().endsWith(".zip")) {
    mimeType = "application/zip";
  } else if (/\.(jpe?g)$/i.test(cleanFilename)) {
    mimeType = "image/jpeg";
  } else if (cleanFilename.toLowerCase().endsWith(".png")) {
    mimeType = "image/png";
  } else if (!mimeType) {
    mimeType = "application/octet-stream";
  }

  // A plain Blob is all we need - wrapping in `File` doesn't propagate a
  // name into the resulting blob: URL, so it bought us nothing before.
  const typedBlob =
    blob.type === mimeType ? blob : new Blob([blob], { type: mimeType });
  const url = URL.createObjectURL(typedBlob);

  const anchor = document.createElement("a");
  anchor.style.display = "none";
  anchor.href = url;
  anchor.download = cleanFilename;

  document.body.appendChild(anchor);

  // Trigger the browser download
  anchor.click();

  // CRITICAL: Do NOT remove anchor synchronously!
  // Chromium / Edge processes the download request asynchronously via Mojo IPC.
  // If anchor.remove() runs synchronously immediately after click(), the node is
  // already detached (isConnected === false) when the browser evaluates the
  // download suggestion. Under Chromium security policy for detached elements,
  // the suggested filename is dropped and the browser falls back to the raw
  // Blob URL path (the UUID with no extension).
  // Keeping the anchor in the DOM for 2 seconds ensures the download handshake completes.
  setTimeout(() => {
    try {
      if (anchor.parentNode) {
        anchor.parentNode.removeChild(anchor);
      }
    } catch {}
  }, 2000);

  // Keep object URL alive for 60 seconds so background download manager
  // can stream the file to disk without prematurely losing data.
  setTimeout(() => {
    try {
      URL.revokeObjectURL(url);
    } catch {}
  }, 60000);
}

/**
 * Render watermark on canvas, then download as JPEG.
 */
export async function downloadCanvasAsJpeg(
  canvas: HTMLCanvasElement,
  filename: string,
  quality: number = 0.93
): Promise<void> {
  const safeFilename =
    /\.(jpe?g)$/i.test(filename) ? filename : `${filename}.jpg`;

  const blob = await canvasToBlob(canvas, "image/jpeg", quality);
  downloadFile(blob, safeFilename);
}

/**
 * Generate a ZIP archive from a JSZip instance and download it.
 */
export async function downloadZipArchive(
  zip: any,
  filename: string
): Promise<void> {
  const safeFilename = filename.toLowerCase().endsWith(".zip")
    ? filename
    : `${filename}.zip`;

  const blob: Blob = await zip.generateAsync({
    type: "blob",
    mimeType: "application/zip",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });

  if (!blob || blob.size < 100) {
    throw new Error(
      `ZIP generation produced a suspiciously small archive (${blob?.size ?? 0} bytes)`
    );
  }

  downloadFile(blob, safeFilename);
}

// Legacy alias kept for any other callers
export const downloadBlob = downloadFile;