/**
 * MEC Computer Club - The Sigil Forge
 * Core client-side canvas watermarking engine.
 * Renders high-fidelity "Fade + Split" overlay with Space Grotesk typography
 * and circular top-right monogram seal, proportionally scaled to any resolution.
 */

import { getLiquidGlassRenderer, SHADOW_PAD } from "./liquidGlassRenderer";

export type FontCombination = "website" | "space" | "clean";
export type WatermarkLayout = "liquid-glass";
export type GlassTheme = "regular" | "frosted" | "dark" | "crystal" | "obsidian" | "tinted"; // canonical: regular|frosted|dark; crystal/obsidian/tinted kept for backward compat

export interface WatermarkConfig {
  eventName: string;
  date: string;
  subtitle?: string; // Optional subtitle / tagline (replaces mandatory club signature)
  clubName?: string; // Legacy alias for subtitle
  fontSizeMultiplier: number; // 0.7 - 1.6
  gradientColor: string; // hex, e.g. #000000 (used for custom glass tinting)
  showMonogram: boolean; // Display primary logo
  monogramSizeMultiplier: number; // 0.3 - 3.5
  monogramColor: string; // hex or "original"
  fontStyle: FontCombination; // "website" | "space" | "clean"

  // Apple Liquid Glass & Multi-Logo Options
  watermarkStyle?: string; // "liquid-glass"
  showSecondLogo: boolean;
  secondLogoColor: string; // hex or "original"
  glassTheme: GlassTheme; // "regular" | "frosted" | "dark"
  glassBlur: number; // 0 - 30 px
  glassOpacity: number; // 20 - 100%
  bottomOffsetMultiplier: number; // 0.5 - 2.0 (distance from bottom)
  cardWidthMultiplier?: number; // 0.7 - 2.0 (horizontal span multiplier for glass badge)
  displacementScale?: number; // 0 - 60 (optical refraction displacement scale, default 30)
  aberrationIntensity?: number; // 0 - 10 (chromatic aberration dispersion, default 2)
  refractionMode?: "prominent" | "standard" | "polar"; // default "prominent"
  opticalRefraction?: boolean; // edge-weighted lensing distortion
  chromaticAberration?: boolean; // subtle R/B channel edge displacement
  squircleShape?: boolean; // continuous-curvature superellipse (n~4.5)

  // Legacy Style 1 fields kept optional for backwards compatibility
  gradientDepth?: number;
  gradientOpacity?: number;
  filmGrain?: boolean;
  filmGrainIntensity?: number;
  monogramBorder?: boolean;
  monogramShadow?: boolean;
}

export const DEFAULT_WATERMARK_CONFIG: WatermarkConfig = {
  eventName: "",
  date: "September 18, 2026",
  subtitle: "",
  clubName: "",
  fontSizeMultiplier: 1.0, // Fixed 100% typography scale
  gradientColor: "#000000",
  showMonogram: true,
  monogramSizeMultiplier: 0.8, // Fixed 80% adaptive logo length
  monogramColor: "#FFFFFF",
  fontStyle: "website",

  // 3D Photorealistic Liquid Glass defaults
  watermarkStyle: "liquid-glass",
  showSecondLogo: true,
  secondLogoColor: "original",
  glassTheme: "dark", // Dark glass default
  glassBlur: 0, // 0 = Crystal Clear optical transmission
  glassOpacity: 25,
  bottomOffsetMultiplier: 0.5, // Fixed 50% floating clearance above bottom
  cardWidthMultiplier: 0.9, // Fixed 90% border width
  displacementScale: 50, // Default 50px
  aberrationIntensity: 4, // Default 4
  refractionMode: "prominent", // Prominent displacement map
  opticalRefraction: true,
  chromaticAberration: true,
  squircleShape: true,
};

/**
 * Intelligent parser for stacked dates in Style 2:
 * "Sep 20, 2026" -> Line 1: "Sep 20", Line 2: "2026"
 * "September 20, 2026" -> Line 1: "September 20", Line 2: "2026"
 */
export function parseStackedDate(rawDate: string): { line1: string; line2: string } {
  const trimmed = (rawDate || "").trim();
  if (!trimmed) {
    return { line1: "", line2: "" };
  }

  // 1. If comma exists, e.g. "Sep 20, 2026"
  if (trimmed.includes(",")) {
    const parts = trimmed.split(",");
    const line1 = parts[0].trim();
    const line2 = parts.slice(1).join(",").trim();
    return { line1, line2 };
  }

  // 2. If ends with 4-digit year, e.g. "20 Sep 2026"
  const yearMatch = trimmed.match(/^(.*?)(?:\s+)(\d{4})$/);
  if (yearMatch) {
    return { line1: yearMatch[1].trim(), line2: yearMatch[2].trim() };
  }

  // 3. Fallback: split on last space if multi-word
  const words = trimmed.split(/\s+/);
  if (words.length >= 2) {
    return {
      line1: words.slice(0, -1).join(" "),
      line2: words[words.length - 1],
    };
  }

  return { line1: trimmed, line2: "" };
}

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
 * Safely draw a rounded rectangle path with fallback for older canvas implementations.
 */
function drawRoundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): void {
  const radius = Math.max(0, Math.min(r, w / 2, h / 2));
  if (typeof ctx.roundRect === "function") {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, radius);
  } else {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }
}

/**
 * 100% Mathematically Perfect Stadium / Pill Capsule Path
 * Draws flawless 180° circular semicircular end caps with radius r = h / 2.
 * Strictly avoids any squircle boxiness or corner flattening.
 */
export function drawCapsulePillPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r?: number
): void {
  const maxR = Math.min(w / 2, h / 2);
  const radius = Math.max(0, Math.min(r !== undefined ? r : maxR, maxR));
  ctx.beginPath();
  if (radius <= 0) {
    ctx.rect(x, y, w, h);
    return;
  }
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.arc(x + w - radius, y + radius, radius, -Math.PI / 2, Math.PI / 2, false);
  ctx.lineTo(x + radius, y + h);
  ctx.arc(x + radius, y + radius, radius, Math.PI / 2, (3 * Math.PI) / 2, false);
  ctx.closePath();
}

/**
 * Draw a continuous-curve squircle (superellipse n ≈ 4.5) path on Canvas 2D.
 * Unlike standard circular fillets (arcTo), superellipse geometry provides G2
 * curvature continuity with no abrupt transitions between curves and straight edges.
 */
function drawSquirclePath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  n: number = 4.5
): void {
  const rx = Math.max(2, Math.min(r, w / 2));
  const ry = Math.max(2, Math.min(r, h / 2));
  const exp = 2 / n;
  const N = 12; // 12 samples per corner quadrant gives a buttery smooth path

  ctx.beginPath();

  // 1. Top edge -> Top-Right corner (from theta = PI/2 down to 0)
  const cxTR = x + w - rx;
  const cyTR = y + ry;
  ctx.moveTo(x + rx, y);
  ctx.lineTo(cxTR, y);
  for (let i = 1; i <= N; i++) {
    const theta = (Math.PI / 2) * (1 - i / N);
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);
    const dx = rx * Math.pow(Math.max(0, cosT), exp);
    const dy = ry * Math.pow(Math.max(0, sinT), exp);
    ctx.lineTo(cxTR + dx, cyTR - dy);
  }

  // 2. Right edge -> Bottom-Right corner (from theta = 0 up to PI/2)
  const cxBR = x + w - rx;
  const cyBR = y + h - ry;
  ctx.lineTo(x + w, cyBR);
  for (let i = 1; i <= N; i++) {
    const theta = (Math.PI / 2) * (i / N);
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);
    const dx = rx * Math.pow(Math.max(0, cosT), exp);
    const dy = ry * Math.pow(Math.max(0, sinT), exp);
    ctx.lineTo(cxBR + dx, cyBR + dy);
  }

  // 3. Bottom edge -> Bottom-Left corner (from theta = PI/2 down to 0)
  const cxBL = x + rx;
  const cyBL = y + h - ry;
  ctx.lineTo(cxBL, y + h);
  for (let i = 1; i <= N; i++) {
    const theta = (Math.PI / 2) * (1 - i / N);
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);
    const dx = rx * Math.pow(Math.max(0, cosT), exp);
    const dy = ry * Math.pow(Math.max(0, sinT), exp);
    ctx.lineTo(cxBL - dx, cyBL + dy);
  }

  // 4. Left edge -> Top-Left corner (from theta = 0 up to PI/2)
  const cxTL = x + rx;
  const cyTL = y + ry;
  ctx.lineTo(x, cyTL);
  for (let i = 1; i <= N; i++) {
    const theta = (Math.PI / 2) * (i / N);
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);
    const dx = rx * Math.pow(Math.max(0, cosT), exp);
    const dy = ry * Math.pow(Math.max(0, sinT), exp);
    ctx.lineTo(cxTL - dx, cyTL - dy);
  }

  ctx.closePath();
}

/**
 * Render Apple Liquid Glass Floating Badge (Style 2)
 * Features:
 * - Floating glass capsule at bottom with comfortable clearance (not flush to bottom)
 * - True canvas backdrop blur (frosted optical glass simulation)
 * - Apple specular highlight bevel on top border (light reflection from above)
 * - Apple upper-rim translucent light sheen
 * - Deep floating ambient drop shadow
 * - Dual logos (second logo optional) with matching height
 * - Vertical divider lines between sections
 * - Mid-balanced title & subtitle (title can wrap to 2 lines)
 * - Stacked calendar date (Month & Day on top, Year on bottom)
 */
function renderLiquidGlassBadge(
  ctx: CanvasRenderingContext2D,
  sourceImage: HTMLImageElement,
  sigil1: HTMLImageElement | null,
  sigil2: HTMLImageElement | null,
  config: WatermarkConfig,
  width: number,
  height: number,
  scale: number
): void {
  // 1. Font family selections
  let titleFamily = '"General Sans", "Space Grotesk", system-ui, -apple-system, sans-serif';
  let subtitleFamily = '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace';
  let dateFamily = '"Space Grotesk", "General Sans", system-ui, sans-serif';

  if (config.fontStyle === "space") {
    titleFamily = '"Space Grotesk", system-ui, -apple-system, sans-serif';
    subtitleFamily = '"JetBrains Mono", ui-monospace, monospace';
    dateFamily = '"Space Grotesk", ui-monospace, monospace';
  } else if (config.fontStyle === "clean") {
    titleFamily = '"General Sans", system-ui, -apple-system, sans-serif';
    subtitleFamily = '"General Sans", system-ui, -apple-system, sans-serif';
    dateFamily = '"General Sans", system-ui, -apple-system, sans-serif';
  }

  // Glass theme resolution — maps legacy aliases to canonical three-mode system (default: dark)
  const resolveGlassTheme = (): "regular" | "frosted" | "dark" => {
    const t = config.glassTheme;
    if (t === "frosted") return "frosted";
    if (t === "regular") return "regular";
    return "dark";
  };
  const glassTheme = resolveGlassTheme();

  // 2. Proportional typography metrics (Fixed 100% typography scale)
  const fontSizeMultiplier = 1.0;
  const titleFontSize = Math.max(17, Math.round(27 * scale * fontSizeMultiplier));
  const subFontSize = Math.max(11, Math.round(13 * scale * fontSizeMultiplier));
  const titleLineHeight = Math.round(titleFontSize * 1.20);
  const textGap = Math.round(5 * scale);

  const titleText = (config.eventName || "Enter Event Title").trim();
  const subText = (
    config.subtitle !== undefined ? config.subtitle : (config.clubName || "")
  ).trim();
  const hasSubtitle = subText.length > 0;

  // 3. Date Metrics (Stacked Date: "Sep 20" / "2026")
  const { line1: dateLine1, line2: dateLine2 } = parseStackedDate(config.date || "");
  const dateSize1 = Math.max(13, Math.round(17 * scale * fontSizeMultiplier));
  const dateSize2 = Math.max(11, Math.round(13 * scale * fontSizeMultiplier));
  const dateGap = Math.round(3 * scale);

  ctx.font = `700 ${dateSize1}px ${dateFamily}`;
  const dateW1 = dateLine1 ? ctx.measureText(dateLine1).width : 0;

  ctx.font = `600 ${dateSize2}px ${dateFamily}`;
  const dateW2 = dateLine2 ? ctx.measureText(dateLine2).width : 0;

  const dateBlockWidth = Math.max(dateW1, dateW2);
  const dateBlockHeight = dateLine2 ? dateSize1 + dateGap + dateSize2 : dateSize1;

  // 4. Horizontal Three-Column Geometry
  const cornerRadius = Math.max(18, Math.round(24 * scale));
  const widthRatio = width <= height ? 0.90 : 0.85;
  const badgeW = Math.round(width * widthRatio);
  const badgeX = Math.round((width - badgeW) / 2);
  const padX = Math.round(cornerRadius + 6 * scale);
  const divSpacing = Math.round(20 * scale); // spacing between outer content and divider
  const textSafetyGap = Math.round(44 * scale); // 44px guaranteed air gap buffer between text and dividers

  // Logo presence & baseline dimensions
  const showL1 = config.showMonogram && Boolean(sigil1);
  const showL2 = config.showSecondLogo && Boolean(sigil2);
  const hasAnyLogo = showL1 || showL2;
  const logoMultiplier = config.monogramSizeMultiplier ?? 0.8;
  const logosSpacing = Math.round(14 * scale);

  // Baseline logo dimensions for bay width calculation
  const estLogoH = Math.round(72 * scale);
  const estL1W = showL1 && sigil1 ? Math.round(estLogoH * ((sigil1.naturalWidth || 1) / (sigil1.naturalHeight || 1))) : 0;
  const estL2W = showL2 && sigil2 ? Math.round(estLogoH * ((sigil2.naturalWidth || 1) / (sigil2.naturalHeight || 1))) : 0;
  const estTotalLogosW = (showL2 ? estL2W : 0) + (showL1 && showL2 ? logosSpacing : 0) + (showL1 ? estL1W : 0);

  // Center bay dimensions with guaranteed textSafetyGap
  const estLeftClusterEnd = badgeX + padX + (hasAnyLogo ? estTotalLogosW : 0);
  const estDiv1X = hasAnyLogo ? estLeftClusterEnd + divSpacing : badgeX + padX;
  const dateRightX = badgeX + badgeW - padX;
  const dateLeftX = dateRightX - dateBlockWidth;
  const div2X = dateBlockWidth > 0 ? dateLeftX - divSpacing : dateRightX;

  const centerBayStart = estDiv1X + (hasAnyLogo ? textSafetyGap : 0);
  const centerBayEnd = div2X - (dateBlockWidth > 0 ? textSafetyGap : 0);
  const availableTitleW = Math.max(100, centerBayEnd - centerBayStart);

  // Measure and auto-fit event title inside the center bay
  const baseTitleFontSize = Math.max(16, Math.round(26 * scale * fontSizeMultiplier));
  const baseSubFontSize = Math.max(11, Math.round(13 * scale * fontSizeMultiplier));

  let activeTitleFontSize = baseTitleFontSize;
  let activeSubFontSize = baseSubFontSize;

  ctx.font = `700 ${activeTitleFontSize}px ${titleFamily}`;
  const singleLineWidth = ctx.measureText(titleText).width;

  // If single line almost fits (within 25% of bay width), gently scale down so it fits on 1 clean line!
  if (singleLineWidth > availableTitleW && singleLineWidth <= availableTitleW * 1.25) {
    activeTitleFontSize = Math.max(
      Math.round(19 * scale),
      Math.round(baseTitleFontSize * (availableTitleW / singleLineWidth) * 0.95)
    );
    ctx.font = `700 ${activeTitleFontSize}px ${titleFamily}`;
  } else if (singleLineWidth > availableTitleW * 1.25) {
    // Very long title wrapping to 2 lines: comfortable size that avoids cramping
    activeTitleFontSize = Math.max(
      Math.round(20 * scale),
      Math.round(baseTitleFontSize * 0.90)
    );
    ctx.font = `700 ${activeTitleFontSize}px ${titleFamily}`;
  }
  const activeTitleLineHeight = Math.round(activeTitleFontSize * 1.18);

  let titleLines = wrapText(ctx, titleText, availableTitleW);
  if (titleLines.length > 2) {
    titleLines = [titleLines[0], titleLines.slice(1).join(" ")];
    while (
      titleLines[1] &&
      ctx.measureText(titleLines[1] + "…").width > availableTitleW &&
      titleLines[1].length > 4
    ) {
      titleLines[1] = titleLines[1].slice(0, -2);
    }
    if (titleLines[1]) titleLines[1] += "…";
  }

  const titleBlockHeight = titleLines.length * activeTitleLineHeight;
  const combinedTextHeight = hasSubtitle
    ? titleBlockHeight + textGap + activeSubFontSize
    : titleBlockHeight;

  // 5. Adaptive Liquid Background Height ("Length")
  // Automatically expands if title wraps to multiple lines or subtitle is present!
  const minContentH = Math.round(52 * scale);
  const textAndDateH = Math.max(minContentH, combinedTextHeight, dateBlockHeight);
  const padY = Math.round(20 * scale);
  const badgeH = padY * 2 + textAndDateH;

  // 6. Adaptive 80% Logo Height (scaled to the final adaptive badge height)
  const logoHeight = Math.max(28, Math.round(badgeH * logoMultiplier));
  let logo1W = 0;
  if (showL1 && sigil1) {
    const natW = sigil1.naturalWidth || sigil1.width || 1;
    const natH = sigil1.naturalHeight || sigil1.height || 1;
    logo1W = Math.round(logoHeight * (natW / natH));
  }

  let logo2W = 0;
  if (showL2 && sigil2) {
    const natW = sigil2.naturalWidth || sigil2.width || 1;
    const natH = sigil2.naturalHeight || sigil2.height || 1;
    logo2W = Math.round(logoHeight * (natW / natH));
  }

  const totalLogosWidth =
    (showL2 ? logo2W : 0) + (showL1 && showL2 ? logosSpacing : 0) + (showL1 ? logo1W : 0);

  // Exact positions with final dimensions
  const leftClusterEndX = badgeX + padX + (hasAnyLogo ? totalLogosWidth : 0);
  const div1X = hasAnyLogo ? leftClusterEndX + divSpacing : badgeX + padX;
  const centerMidX = Math.round((div1X + div2X) / 2);

  const floatMargin = Math.round(48 * scale * (config.bottomOffsetMultiplier || 0.5));
  const badgeY = height - badgeH - floatMargin;
  const centerY = badgeY + badgeH / 2;

  // Dividers & Specular Edge (Idea 1: Shorter 38% height for delicate whisper hairline)
  const dividerWidth = Math.max(1, Math.round(1.5 * scale));
  const dividerH = Math.round(badgeH * 0.38);

  // Rounded-rect badge shape (card corners, not full capsule pill)
  const drawBadgeShape = (
    c: CanvasRenderingContext2D,
    bx: number,
    by: number,
    bw: number,
    bh: number,
    br: number
  ) => {
    drawRoundRectPath(c, bx, by, bw, bh, br);
  };

  // 11. Render Liquid Glass Background (optical refraction from rdev/liquid-glass-react)
  const pad = SHADOW_PAD;
  const liquidRenderer = getLiquidGlassRenderer();
  let renderedGlassCanvas: HTMLCanvasElement | null = null;

  if (liquidRenderer) {
    renderedGlassCanvas = liquidRenderer.renderGlass(
      sourceImage,
      badgeX,
      badgeY,
      badgeW,
      badgeH,
      pad,
      {
        displacementScale: config.displacementScale ?? 50,
        blurAmount: config.glassBlur ?? 0,
        saturation: 180,
        aberrationIntensity: config.aberrationIntensity ?? 4,
        cornerRadius: cornerRadius,
        mode: config.refractionMode || "prominent",
        theme: glassTheme,
      }
    );
  }

  if (renderedGlassCanvas) {
    ctx.drawImage(renderedGlassCanvas, badgeX - pad, badgeY - pad);
  } else {
    // Physical box-shadow: 0px 12px 40px rgba(0, 0, 0, 0.25)
    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
    ctx.shadowBlur = Math.round(40 * scale);
    ctx.shadowOffsetY = Math.round(12 * scale);
    ctx.fillStyle =
      glassTheme === "dark"
        ? "rgba(18, 20, 26, 0.65)"
        : glassTheme === "frosted"
        ? "rgba(255, 255, 255, 0.22)"
        : "rgba(255, 255, 255, 0.12)";
    ctx.beginPath();
    drawRoundRectPath(ctx, badgeX, badgeY, badgeW, badgeH, cornerRadius);
    ctx.fill();
    ctx.restore();
  }

  // --- Liquid Glass Border (replicated from rdev/liquid-glass-react lines 508-560) ---
  // 1.5px border with 135deg linear-gradient, screen & overlay mix-blend, and inset specular rim
  const borderWidth = Math.max(1, Math.round(1.5 * scale));
  const borderGrad = ctx.createLinearGradient(
    badgeX,
    badgeY,
    badgeX + badgeW,
    badgeY + badgeH
  );
  borderGrad.addColorStop(0.0, "rgba(255, 255, 255, 0.0)");
  borderGrad.addColorStop(0.33, "rgba(255, 255, 255, 0.35)");
  borderGrad.addColorStop(0.66, "rgba(255, 255, 255, 0.65)");
  borderGrad.addColorStop(1.0, "rgba(255, 255, 255, 0.0)");

  // Border Layer 1 (screen mix-blend)
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.strokeStyle = borderGrad;
  ctx.lineWidth = borderWidth;
  ctx.beginPath();
  drawRoundRectPath(ctx, badgeX, badgeY, badgeW, badgeH, cornerRadius);
  ctx.stroke();
  ctx.restore();

  // Border Layer 2 (overlay mix-blend)
  ctx.save();
  ctx.globalCompositeOperation = "overlay";
  ctx.strokeStyle = borderGrad;
  ctx.lineWidth = borderWidth;
  ctx.beginPath();
  drawRoundRectPath(ctx, badgeX, badgeY, badgeW, badgeH, cornerRadius);
  ctx.stroke();
  ctx.restore();

  // Inset specular edge rim (box-shadow: 0 0 0 0.5px rgba(255, 255, 255, 0.5) inset)
  ctx.save();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
  ctx.lineWidth = Math.max(0.5, Math.round(0.75 * scale));
  ctx.beginPath();
  drawRoundRectPath(
    ctx,
    badgeX + 0.5,
    badgeY + 0.5,
    badgeW - 1,
    badgeH - 1,
    Math.max(1, cornerRadius - 0.5)
  );
  ctx.stroke();
  ctx.restore();

  // 12. Helpers for rendering items inside the capsule
  const drawDivider = (x: number) => {
    ctx.save();
    // 1. Subtle dark shadow groove (ensures visibility over bright/white photos)
    const sGrad = ctx.createLinearGradient(
      x - 0.5,
      centerY - dividerH / 2,
      x - 0.5,
      centerY + dividerH / 2
    );
    sGrad.addColorStop(0.0, "rgba(0, 0, 0, 0.0)");
    sGrad.addColorStop(0.5, "rgba(0, 0, 0, 0.22)");
    sGrad.addColorStop(1.0, "rgba(0, 0, 0, 0.0)");
    ctx.strokeStyle = sGrad;
    ctx.lineWidth = Math.max(1, Math.round(1 * scale));
    ctx.beginPath();
    ctx.moveTo(x - 0.5, centerY - dividerH / 2);
    ctx.lineTo(x - 0.5, centerY + dividerH / 2);
    ctx.stroke();

    // 2. Luminous white specular glint with soft top/bottom fade
    const dGrad = ctx.createLinearGradient(
      x + 0.5,
      centerY - dividerH / 2,
      x + 0.5,
      centerY + dividerH / 2
    );
    dGrad.addColorStop(0.0, "rgba(255, 255, 255, 0.0)");
    dGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.45)");
    dGrad.addColorStop(1.0, "rgba(255, 255, 255, 0.0)");
    ctx.strokeStyle = dGrad;
    ctx.lineWidth = dividerWidth;
    ctx.beginPath();
    ctx.moveTo(x + 0.5, centerY - dividerH / 2);
    ctx.lineTo(x + 0.5, centerY + dividerH / 2);
    ctx.stroke();
    ctx.restore();
  };

  const drawLogoItem = (
    img: HTMLImageElement,
    dx: number,
    dy: number,
    dw: number,
    dh: number,
    tint: string
  ) => {
    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
    ctx.shadowBlur = Math.round(3 * scale);
    ctx.shadowOffsetY = Math.round(1.2 * scale);
    const isOrig = !tint || tint.toLowerCase() === "original";
    if (isOrig) {
      ctx.drawImage(img, dx, dy, dw, dh);
    } else {
      const off = document.createElement("canvas");
      off.width = Math.max(1, dw);
      off.height = Math.max(1, dh);
      const oCtx = off.getContext("2d");
      if (oCtx) {
        oCtx.drawImage(img, 0, 0, dw, dh);
        oCtx.globalCompositeOperation = "source-in";
        oCtx.fillStyle = tint;
        oCtx.fillRect(0, 0, dw, dh);
        ctx.drawImage(off, dx, dy, dw, dh);
      } else {
        ctx.drawImage(img, dx, dy, dw, dh);
      }
    }
    ctx.restore();
  };

  // 13. Three-Column Dock Content Placement

  // Column 1: Left-Anchored Logos
  if (hasAnyLogo) {
    let logoCurX = badgeX + padX;
    const logoY = Math.round(centerY - logoHeight / 2);

    // 2nd Logo on the LEFT (e.g. MEC College Seal / Partner)
    if (showL2 && sigil2) {
      drawLogoItem(
        sigil2,
        logoCurX,
        logoY,
        logo2W,
        logoHeight,
        config.secondLogoColor || "original"
      );
      logoCurX += logo2W;
    }

    if (showL1 && showL2) {
      logoCurX += logosSpacing;
    }

    // Primary Logo on the RIGHT of 2nd Logo (e.g. Club Emblem)
    if (showL1 && sigil1) {
      drawLogoItem(sigil1, logoCurX, logoY, logo1W, logoHeight, config.monogramColor);
    }

    // Divider 1 (etched glass groove)
    drawDivider(div1X);
  }

  // Column 2: Centered Event Title & Subtitle (Balanced in Center Bay)
  const textStartY = Math.round(centerY - combinedTextHeight / 2);
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
  ctx.shadowBlur = Math.round(3.5 * scale);
  ctx.shadowOffsetY = Math.round(1.2 * scale);

  // Title Lines (pure white #FFFFFF)
  ctx.font = `700 ${activeTitleFontSize}px ${titleFamily}`;
  ctx.fillStyle = "#FFFFFF";
  for (let i = 0; i < titleLines.length; i++) {
    const lineY = textStartY + i * activeTitleLineHeight + activeTitleFontSize * 0.85;
    ctx.fillText(titleLines[i], centerMidX, lineY);
  }

  // Subtitle (below title, centered)
  if (hasSubtitle) {
    ctx.font = `500 ${activeSubFontSize}px ${subtitleFamily}`;
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    const subY = textStartY + titleBlockHeight + textGap + activeSubFontSize * 0.85;
    ctx.fillText(subText, centerMidX, subY);
  }
  ctx.restore();

  // Column 3: Right-Anchored Date & Divider 2
  if (dateBlockWidth > 0) {
    // Divider 2 (etched glass groove)
    drawDivider(div2X);

    const dateStartY = Math.round(centerY - dateBlockHeight / 2);
    ctx.save();
    ctx.textAlign = "right";
    ctx.textBaseline = "alphabetic";
    ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
    ctx.shadowBlur = Math.round(3.5 * scale);
    ctx.shadowOffsetY = Math.round(1.2 * scale);

    // Date Line 1 (Month + Day, e.g. "Sep 20")
    if (dateLine1) {
      ctx.font = `700 ${dateSize1}px ${dateFamily}`;
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(dateLine1, dateRightX, dateStartY + dateSize1 * 0.85);
    }

    // Date Line 2 (Year, e.g. "2026")
    if (dateLine2) {
      ctx.font = `600 ${dateSize2}px ${dateFamily}`;
      ctx.fillStyle = "rgba(255, 255, 255, 0.78)";
      ctx.fillText(
        dateLine2,
        dateRightX,
        dateStartY + dateSize1 + dateGap + dateSize2 * 0.85
      );
    }
    ctx.restore();
  }
}

/**
 * Render the watermark overlay onto the provided or newly created canvas.
 * Preserves exact original photo dimensions while scaling overlay proportionally.
 */
/** Guard so ensureFontLoaded() only runs once — not on every canvas render. */
let _fontsReady = false;

export async function renderWatermarkOnCanvas(
  sourceImage: HTMLImageElement,
  sigilImage: HTMLImageElement | null,
  config: WatermarkConfig,
  targetCanvas?: HTMLCanvasElement,
  secondSigilImage?: HTMLImageElement | null
): Promise<HTMLCanvasElement> {
  if (!_fontsReady) {
    await ensureFontLoaded();
    _fontsReady = true;
  }

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
  // Render Apple Liquid Glass Floating Badge
  renderLiquidGlassBadge(
    ctx,
    sourceImage,
    sigilImage,
    secondSigilImage || null,
    config,
    width,
    height,
    scale
  );

  return canvas;
}

/**
 * Module-level image decode cache.
 * Each unique src URL is decoded exactly once per browser session.
 * Subsequent calls with the same URL return the cached Promise instantly,
 * eliminating the 300-800ms JPEG/PNG decode on every config change.
 * Cache is stored as a Promise (not the resolved image) so parallel callers
 * for the same URL share a single in-flight decode instead of racing.
 */
const _imageCache = new Map<string, Promise<HTMLImageElement>>();

/**
 * Evict a URL from the image cache (call when revoking a blob URL on photo removal).
 */
export function evictImageCache(src: string): void {
  _imageCache.delete(src);
}

/**
 * Convert an image file / object URL to an HTMLImageElement.
 * Results are cached by src URL — repeat calls are instant (no re-decode).
 * Waits for full decode (not just the `load` event) so canvas draws never
 * race ahead of pixel data being ready.
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  if (_imageCache.has(src)) return _imageCache.get(src)!;

  const p = new Promise<HTMLImageElement>((resolve, reject) => {
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
    img.onerror = (err) => {
      _imageCache.delete(src); // don't cache failures
      reject(err);
    };
    img.src = src;
  });

  _imageCache.set(src, p);
  return p;
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