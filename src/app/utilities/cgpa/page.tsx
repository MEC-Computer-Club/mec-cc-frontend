import type { Metadata } from "next";
import { CgpaCalculatorClient } from "./CgpaCalculatorClient";

export const metadata: Metadata = {
  title: "CGPA Calculator & Target Simulator | MEC Computer Club",
  description:
    "Calculate semester GPA, cumulative standing, and simulate graduation target goals with official Mymensingh Engineering College (DU Technology Unit) syllabus course frameworks.",
  openGraph: {
    title: "CGPA Calculator & Target Simulator | MEC Computer Club",
    description:
      "Calculate semester GPA, cumulative standing, and simulate graduation target goals with official Mymensingh Engineering College (DU Technology Unit) syllabus course frameworks.",
    images: ["/mec-club-photo.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "CGPA Calculator & Target Simulator | MEC Computer Club",
    description:
      "Calculate semester GPA, cumulative standing, and simulate graduation target goals with official Mymensingh Engineering College (DU Technology Unit) syllabus course frameworks.",
    images: ["/mec-club-photo.jpg"],
  },
};

export default function CgpaCalculatorPage() {
  return <CgpaCalculatorClient />;
}
