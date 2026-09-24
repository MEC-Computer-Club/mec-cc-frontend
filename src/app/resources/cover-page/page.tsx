import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import { CoverPageGeneratorClient } from "./CoverPageGeneratorClient";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-quicksand",
  display: "swap",
});

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
  return (
    <div className={quicksand.variable}>
      <CoverPageGeneratorClient />
    </div>
  );
}
