/**
 * Utility helpers to parse and format image positioning, focal points, and zoom scale.
 * Supports:
 * - Focal points: "50% 50%"
 * - Zoom & Shrink: "50% 50% zoom:-25" (negative zooms shrink width while keeping height 100% full)
 * - Lock Height: keeps image height 100% full (no vertical shortening or top/bottom gaps)
 * - Contain mode: "contain 50% 50%"
 */

export interface ParsedImagePosition {
  x: number;
  y: number;
  zoom: number; // percentage from -50 to +100
  scale: number; // base multiplier (e.g. 0.6 at zoom=-40)
  scaleX: number; // horizontal scale factor
  scaleY: number; // vertical scale factor (locked to 1 when lockHeight is true and zoom <= 0)
  lockHeight: boolean;
  isContain: boolean;
  objectPosition: string;
}

export function parseImagePosition(posStr?: string): ParsedImagePosition {
  if (!posStr || typeof posStr !== "string") {
    return {
      x: 50,
      y: 50,
      zoom: 0,
      scale: 1,
      scaleX: 1,
      scaleY: 1,
      lockHeight: true,
      isContain: false,
      objectPosition: "50% 50%",
    };
  }

  const isContain = posStr.includes("contain");
  const lockHeight = !posStr.includes("lockHeight:false"); // Default to true: keeps height full

  // Extract zoom if present: e.g. zoom:-20 or zoom:30
  const zoomMatch = posStr.match(/zoom:([+-]?\d+)/i);
  const zoom = zoomMatch ? Math.min(100, Math.max(-50, parseInt(zoomMatch[1], 10))) : 0;
  const scale = Math.max(0.3, Math.min(3, 1 + zoom / 100));

  const scaleX = scale;
  const scaleY = lockHeight && zoom <= 0 ? 1 : scale;

  // Remove contain, lockHeight, and zoom tokens to extract X and Y
  const clean = posStr
    .replace(/contain/gi, "")
    .replace(/lockHeight:(true|false)/gi, "")
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
    scaleX,
    scaleY,
    lockHeight,
    isContain,
    objectPosition: isContain ? "center" : `${Math.round(x)}% ${Math.round(y)}%`,
  };
}

export function formatImagePosition(
  x: number,
  y: number,
  zoom: number = 0,
  isContain: boolean = false,
  lockHeight: boolean = true
): string {
  let res = `${Math.round(x)}% ${Math.round(y)}%`;
  if (zoom !== 0) {
    res += ` zoom:${Math.round(zoom)}`;
    if (!lockHeight) {
      res += ` lockHeight:false`;
    }
  }
  if (isContain) {
    res = `contain ${res}`;
  }
  return res;
}
