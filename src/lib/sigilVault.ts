/**
 * MEC Computer Club - The Sigil Vault
 * Presets and storage for official emblems and custom uploaded monograms.
 */

export interface SigilItem {
  id: string;
  name: string;
  subtitle: string;
  src: string;
  isCustom?: boolean;
}

export const DEFAULT_SIGILS: SigilItem[] = [
  {
    id: "default-crest",
    name: "Standard Emblem",
    subtitle: "Official MEC CC Crest",
    src: "/mec-cc-logo-icon.png",
  },
  {
    id: "lime-sigil",
    name: "Lime Sigil",
    subtitle: "Emerald CP Aura",
    src: "/logo-icon-lime-dark.png",
  },
  {
    id: "mint-sigil",
    name: "Mint Sigil",
    subtitle: "Algorithmic Sage",
    src: "/logo-icon-mint-dark.png",
  },
  {
    id: "sky-sigil",
    name: "Sky Sigil",
    subtitle: "Celestial Cyber Rune",
    src: "/logo-icon-sky-dark.png",
  },
  {
    id: "amber-sigil",
    name: "Amber Sigil",
    subtitle: "Solar Flame Inscription",
    src: "/logo-icon-amber-dark.png",
  },
  {
    id: "rose-sigil",
    name: "Rose Sigil",
    subtitle: "Crimson Dev Core",
    src: "/logo-icon-rose-dark.png",
  },
  {
    id: "violet-sigil",
    name: "Violet Sigil",
    subtitle: "Arcane Neural Seal",
    src: "/logo-icon-violet-dark.png",
  },
  {
    id: "slate-sigil",
    name: "Slate Sigil",
    subtitle: "Obsidian Tech Rune",
    src: "/logo-icon-slate-dark.png",
  },
];

const STORAGE_KEY = "mec_cc_custom_sigil_vault";

export function loadCustomSigils(): SigilItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Failed to load custom sigils:", err);
    return [];
  }
}

export function saveCustomSigil(newSigil: SigilItem): SigilItem[] {
  if (typeof window === "undefined") return [];
  try {
    const current = loadCustomSigils();
    const updated = [newSigil, ...current.filter((s) => s.id !== newSigil.id)];
    // Cap at 15 custom sigils to respect storage
    const trimmed = updated.slice(0, 15);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    return trimmed;
  } catch (err) {
    console.error("Failed to save custom sigil:", err);
    return [];
  }
}

export function removeCustomSigil(id: string): SigilItem[] {
  if (typeof window === "undefined") return [];
  try {
    const current = loadCustomSigils();
    const updated = current.filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error("Failed to remove custom sigil:", err);
    return [];
  }
}
