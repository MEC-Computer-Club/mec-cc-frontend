import type { Metadata } from "next";
import { CgpaCalculatorClient } from "./CgpaCalculatorClient";

export const metadata: Metadata = {
  title: "CGPA Calculator & Target Simulator | MEC Computer Club",
  description:
    "Calculate semester GPA, cumulative standing, and simulate graduation target goals with official Mymensingh Engineering College (DU Technology Unit) syllabus course frameworks.",
};

export default function CgpaCalculatorPage() {
  return <CgpaCalculatorClient />;
}
