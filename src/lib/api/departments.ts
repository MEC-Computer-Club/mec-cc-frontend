import { Department } from "@/types";

export const departments: Department[] = [
  {
    id: "cp",
    name: "Competitive Programming",
    description:
      "Train for ICPC, national contests, and online competitions. Weekly practice sessions, editorial discussions, and team formations.",
    icon: "[CP]",
    color: "var(--accent-primary)",
    memberCount: 24,
  },
  {
    id: "webdev",
    name: "Web Development",
    description:
      "Build real-world projects using modern frameworks. From frontend to full-stack, learn by shipping, not just studying.",
    icon: "[WEB]",
    color: "var(--accent-secondary)",
    memberCount: 18,
  },
  {
    id: "ml",
    name: "Machine Learning & AI",
    description:
      "Explore data science, deep learning, and AI applications. Kaggle competitions, research projects, and study groups.",
    icon: "[ML]",
    color: "#7C3AED",
    memberCount: 15,
  },
  {
    id: "cybersec",
    name: "Cybersecurity",
    description:
      "CTF competitions, ethical hacking workshops, and security research. Learn to break things — responsibly.",
    icon: "[SEC]",
    color: "#DC2626",
    memberCount: 12,
  },
  {
    id: "gaming",
    name: "Game Dev & Esports",
    description:
      "Build immersive games using Unity and Unreal, and compete in inter-university esports tournaments.",
    icon: "[GAME]",
    color: "#F59E0B",
    memberCount: 20,
  }
];
