import { api } from "@/lib/api";

export interface CoverPreset {
  id: string;
  name: string;
  category: string;
  url: string;
  description: string;
  isCustom?: boolean;
  uploadedBy?: {
    _id?: string;
    id?: string;
    fullName?: string;
    studentId?: string;
    imageUrl?: string;
  } | null;
  createdAt?: string;
}

export const builtInCoverPresets: CoverPreset[] = [
  {
    id: "mec-emerald",
    name: "MEC Emerald Circuit",
    category: "Official Club Branding",
    url: "/covers/cover-mec-emerald.svg",
    description: "Signature MEC emerald & mint cyber tracks with binary telemetry nodes.",
  },
  {
    id: "minimal-code",
    name: "Developer Syntax IDE",
    category: "Clean Code & Software",
    url: "/covers/cover-minimal-code.svg",
    description: "Dark carbon code editor with real TypeScript types, prompt lines, and system diagnostics.",
  },
  {
    id: "terminal-matrix",
    name: "Terminal Core Matrix",
    category: "Cyberpunk Terminal",
    url: "/covers/cover-terminal-matrix.svg",
    description: "Linux kernel architecture, memory allocation, and glowing green code streams.",
  },
  {
    id: "deep-space",
    name: "Nebula Hex Mesh",
    category: "Modern Gradient",
    url: "/covers/cover-deep-space.svg",
    description: "Deep violet & magenta hexagonal cosmic mesh with glowing starfield constellations.",
  },
  {
    id: "circuit-blueprint",
    name: "RISC-V Circuit Blueprint",
    category: "Hardware & Architecture",
    url: "/covers/cover-circuit-blueprint.svg",
    description: "64-bit microchip CPU package, gold circuit traces, and telemetry clock lines.",
  },
  {
    id: "cyber-grid",
    name: "Cryptographic Mesh",
    category: "Cybersecurity & Networks",
    url: "/covers/cover-cyber-grid.svg",
    description: "AES-256 primitives, ECDH key exchange, and neon cyan polygonal topology.",
  },
  {
    id: "algorithm-tree",
    name: "Algorithmic Tree & Big-O",
    category: "Data Structures",
    url: "/covers/cover-algorithm-tree.svg",
    description: "Binary search tree node traversal, Dijkstra graph, and asymptotic complexity curves.",
  },
  {
    id: "retro-hacker",
    name: "x86_64 Disassembler",
    category: "Assembly & Low Level",
    url: "/covers/cover-retro-hacker.svg",
    description: "Amber phosphor CRT, assembly opcodes, syscalls, and general-purpose registers.",
  },
];

// Backward-compatible alias
export const coverPresets = builtInCoverPresets;

export async function fetchAllCoverPresets(): Promise<CoverPreset[]> {
  try {
    const res: any = await api.get("/api/cover-presets");
    const serverPresets = Array.isArray(res?.data) ? res.data : [];

    const mappedServerPresets: CoverPreset[] = serverPresets.map((p: any) => ({
      id: p._id || p.id,
      name: p.name,
      category: p.category || "Community",
      url: p.url,
      description: p.description || "Uploaded by MEC community moderator",
      isCustom: true,
      uploadedBy: p.uploadedBy,
      createdAt: p.createdAt,
    }));

    return [...mappedServerPresets, ...builtInCoverPresets];
  } catch (err) {
    console.warn("Could not load dynamic cover presets, using built-ins:", err);
    return builtInCoverPresets;
  }
}

export async function createCoverPreset(formData: FormData): Promise<CoverPreset> {
  const res: any = await api.upload("/api/cover-presets", formData, { method: "POST" });
  const p = res?.data || res?.preset;
  return {
    id: p._id || p.id,
    name: p.name,
    category: p.category || "Community",
    url: p.url,
    description: p.description || "",
    isCustom: true,
    uploadedBy: p.uploadedBy,
    createdAt: p.createdAt,
  };
}

export async function deleteCoverPreset(id: string): Promise<void> {
  await api.delete(`/api/cover-presets/${id}`);
}
