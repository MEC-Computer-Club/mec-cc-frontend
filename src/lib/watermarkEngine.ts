/**
 * MEC Computer Club - The Sigil Forge
 * Core client-side canvas watermarking engine.
 * Renders high-fidelity "Fade + Split" overlay with Space Grotesk typography
 * and circular top-right monogram seal, proportionally scaled to any resolution.
 */

export interface WatermarkConfig {
  eventName: string;
  date: string;
  clubName: string;
  fontSizeMultiplier: number; // 0.7 - 1.6
  gradientColor: string; // hex, e.g. #000000
  gradientDepth: number; // percentage 20 - 75
  gradientOpacity: number; // percentage 40 - 100
  showMonogram: boolean;
  monogramSizeMultiplier: number; // 0.6 - 1.5
  monogramBorder: boolean;
}

export const DEFAULT_WATERMARK_CONFIG: WatermarkConfig = {
  eventName: "MEC Programming Contest 2026",
  date: "Autumn 2026",
  clubName: "MEC Computer Club",
  fontSizeMultiplier: 1.0,
  gradientColor: "#000000",
  gradientDepth: 42,
  gradientOpacity: 88,
  showMonogram: true,
  monogramSizeMultiplier: 1.0,
  monogramBorder: true,
};

/**
 * Ensure Space Grotesk font is loaded into the browser context.
 */
export async function ensureFontLoaded(): Promise<void> {
  if (typeof document === "undefined") return;
  try {
    if (document.fonts && document.fonts.load) {
      await Promise.all([
        document.fonts.load('700 32px "Space Grotesk"'),
        document.fonts.load('500 20px "Space Grotesk"'),
        document.fonts.load('400 16px "Space Grotesk"'),
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

  // --- 1. Fade Gradient (Bottom) ---
  const depthFactor = Math.min(Math.max(config.gradientDepth, 15), 80) / 100;
  const gradientHeight = Math.round(height * depthFactor);
  const gradientStartY = height - gradientHeight;
  const maxOpacity = Math.min(Math.max(config.gradientOpacity, 10), 100) / 100;

  const gradient = ctx.createLinearGradient(0, gradientStartY, 0, height);
  gradient.addColorStop(0, hexToRgba(config.gradientColor, 0));
  gradient.addColorStop(0.25, hexToRgba(config.gradientColor, maxOpacity * 0.2));
  gradient.addColorStop(0.6, hexToRgba(config.gradientColor, maxOpacity * 0.65));
  gradient.addColorStop(0.85, hexToRgba(config.gradientColor, maxOpacity * 0.92));
  gradient.addColorStop(1, hexToRgba(config.gradientColor, maxOpacity));

  ctx.fillStyle = gradient;
  ctx.fillRect(0, gradientStartY, width, gradientHeight);

  // --- 2. Typography & Metadata Overlay ---
  const paddingX = Math.round(52 * scale);
  const paddingBottom = Math.round(48 * scale);
  const maxTextWidth = width - paddingX * 2;

  const titleSize = Math.max(18, Math.round(44 * scale * config.fontSizeMultiplier));
  const subSize = Math.max(12, Math.round(21 * scale * config.fontSizeMultiplier));
  const lineSpacing = Math.round(10 * scale);

  // Measure Subtitle line
  const clubText = (config.clubName || "MEC Computer Club").trim();
  const dateText = (config.date || "").trim();
  const subtitleLine = dateText ? `${clubText}  •  ${dateText}` : clubText;

  ctx.font = `500 ${subSize}px "Space Grotesk", system-ui, -apple-system, sans-serif`;
  const subMetrics = ctx.measureText(subtitleLine);
  const subHeight = subSize;

  // Measure Title lines
  ctx.font = `700 ${titleSize}px "Space Grotesk", system-ui, -apple-system, sans-serif`;
  const titleText = (config.eventName || "Event Photo").trim();
  const titleLines = wrapText(ctx, titleText, maxTextWidth);
  const titleLineHeight = Math.round(titleSize * 1.18);

  // Calculate vertical placement from bottom
  const totalTextBlockHeight =
    titleLines.length * titleLineHeight + lineSpacing + subHeight;

  let currentY = height - paddingBottom;

  // Render Subtitle first at the bottom line
  ctx.save();
  ctx.font = `500 ${subSize}px "Space Grotesk", system-ui, -apple-system, sans-serif`;
  ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
  ctx.shadowColor = "rgba(0, 0, 0, 0.85)";
  ctx.shadowBlur = Math.round(5 * scale);
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = Math.round(2 * scale);
  ctx.fillText(subtitleLine, paddingX, currentY);
  ctx.restore();

  currentY -= subHeight + lineSpacing;

  // Render Title lines (stacked above subtitle)
  ctx.save();
  ctx.font = `700 ${titleSize}px "Space Grotesk", system-ui, -apple-system, sans-serif`;
  ctx.fillStyle = "#FFFFFF";
  ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
  ctx.shadowBlur = Math.round(7 * scale);
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = Math.round(2 * scale);

  // Draw lines from bottom to top or top to bottom
  const titleStartY = currentY - (titleLines.length - 1) * titleLineHeight;
  for (let i = 0; i < titleLines.length; i++) {
    ctx.fillText(titleLines[i], paddingX, titleStartY + i * titleLineHeight);
  }
  ctx.restore();

  // --- 3. Top-Right Circular Monogram / Sigil Badge ---
  if (config.showMonogram && sigilImage) {
    const badgeDiameter = Math.max(
      36,
      Math.round(92 * scale * config.monogramSizeMultiplier)
    );
    const radius = badgeDiameter / 2;
    const paddingRight = Math.round(48 * scale);
    const paddingTop = Math.round(42 * scale);

    const centerX = width - paddingRight - radius;
    const centerY = paddingTop + radius;

    ctx.save();

    // Subtle drop shadow for badge
    ctx.shadowColor = "rgba(0, 0, 0, 0.65)";
    ctx.shadowBlur = Math.round(10 * scale);
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = Math.round(3 * scale);

    // Dark circular background plate
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(18, 20, 24, 0.82)";
    ctx.fill();

    // Outer subtle border
    if (config.monogramBorder) {
      ctx.lineWidth = Math.max(1.5, Math.round(2 * scale));
      ctx.strokeStyle = "rgba(255, 255, 255, 0.38)";
      ctx.stroke();
    }

    // Clip to circle and draw logo
    ctx.shadowColor = "transparent";
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - 1, 0, Math.PI * 2);
    ctx.clip();

    // Inset padding for icon
    const iconPad = Math.round(radius * 0.22);
    const iconSize = (radius - iconPad) * 2;
    ctx.drawImage(
      sigilImage,
      centerX - radius + iconPad,
      centerY - radius + iconPad,
      iconSize,
      iconSize
    );

    ctx.restore();
  }

  return canvas;
}

/**
 * Convert an image file / object URL to an HTMLImageElement
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

/**
 * Convert canvas to Blob
 */
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string = "image/jpeg",
  quality: number = 0.93
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas toBlob failed"));
      },
      type,
      quality
    );
  });
}
