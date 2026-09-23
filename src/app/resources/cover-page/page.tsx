import type { Metadata } from "next";
import { CoverPageGeneratorClient } from "./CoverPageGeneratorClient";

export const metadata: Metadata = {
  title: "Cover Page — MEC CC",
  description:
    "Generate and edit official Mymensingh Engineering College cover pages, lab reports, and assignments. Interactive template with authentic Space Mono typography and instant A4 PDF export.",
  keywords: [
    "MEC Cover Page",
    "MEC Lab Report",
    "Mymensingh Engineering College Cover Page",
    "MEC Assignment Cover Page",
    "MEC CSE Lab Report",
    "MEC Cover Page Generator",
  ],
  openGraph: {
    title: "MEC Cover Page — MEC Computer Club",
    description:
      "Interactive cover page template builder with Space Mono typography, customizable fields, and pixel-perfect A4 printing.",
  },
};

export default function CoverPage() {
  return <CoverPageGeneratorClient />;
}
