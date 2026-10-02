/**
 * Utility helpers to parse and format image positioning and zoom strings.
 * Supports:
 * - Focal points: "50% 50%"
 * - Zoom & Shrink: "50% 50% zoom:-25" (negative zooms shrink width/height, positive zoom in)
 * - Contain mode: "contain 50% 50%"
 */

export interface ParsedImagePosition {
  x: number;
  y: number;
  zoom: number; // percentage from -50 to +100
  scale: number; // multiplier, e.g. 1.0 at zoom=0, 0.75 at zoom=-25, 1.3 at zoom=+30
  isContain: boolean;
  objectPosition: string;
}

export function parseImagePosition(posStr?: string): ParsedImagePosition {
  if (!posStr || typeof posStr !== "string") {
    return { x: 50, y: 50, zoom: 0, scale: 1, isContain: false, objectPosition: "50% 50%" };
  }

  const isContain = posStr.includes("contain");

  // Extract zoom if present: e.g. zoom:-20 or zoom:30
  const zoomMatch = posStr.match(/zoom:([+-]?\d+)/i);
  const zoom = zoomMatch ? Math.min(100, Math.max(-50, parseInt(zoomMatch[1], 10))) : 0;
  const scale = Math.max(0.3, Math.min(3, 1 + zoom / 100));

  // Remove contain and zoom tokens to extract X and Y
  const clean = posStr
    .replace(/contain/gi, "")
    .replace(/zoom:[+-]?\d+/gi, "")
    .trim();

  const parts = clean.split(/\s+/).filter(Boolean);
  const x = Math.min(100, Math.max(0, parseFloat(parts[0]) || 50));
  const y = Math.min(100, Math.max(0, parseFloat(parts[1] || parts[0]) || 50));

  return {
    x: Math.round(x),
    y: Math.round(y),
    zoom,
    scale,
    isContain,
    objectPosition: isContain ? "center" : `${Math.round(x)}% ${Math.round(y)}%`,
  };
}

export function formatImagePosition(
  x: number,
  y: number,
  zoom: number = 0,
  isContain: boolean = false
): string {
  let res = `${Math.round(x)}% ${Math.round(y)}%`;
  if (zoom !== 0) {
    res += ` zoom:${Math.round(zoom)}`;
  }
  if (isContain) {
    res = `contain ${res}`;
  }
  return res;
}
