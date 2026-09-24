import type { Metadata } from "next";
import Link from "next/link";
import { Calculator, ArrowLeft, Sparkles, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "CGPA Calculator | MEC Computer Club",
  description:
    "Calculate semester GPA and overall CGPA using official grading policies for Mymensingh Engineering College (MEC). Tool under active development.",
};

export default function CgpaCalculatorPage() {
  return (
    <div className="container py-16 md:py-24 max-w-3xl mx-auto px-4">
      <div className="text-center mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-text-tertiary hover:text-text-primary transition-colors mb-6"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-primary-light text-accent-primary-text text-xs font-mono font-bold uppercase tracking-wider mb-4 border border-border-default">
          <Clock size={13} />
          Coming Soon
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-heading tracking-tight text-text-primary mb-4">
          CGPA Calculator
        </h1>
        <p className="text-base sm:text-lg text-text-secondary max-w-xl mx-auto leading-relaxed">
          We are building a customized semester and cumulative GPA calculator tailored to the official Mymensingh Engineering College grading scales and credit frameworks.
        </p>
      </div>

      <div className="bg-surface-elevated border-2 border-border-brutalist dark:border-border-default rounded-2xl p-8 sm:p-10 shadow-[6px_6px_0px_var(--border-brutalist)] text-center">
        <div className="w-16 h-16 rounded-2xl bg-accent-primary/10 border-2 border-border-brutalist dark:border-border-default flex items-center justify-center mx-auto mb-6 text-accent-primary-hover shadow-[3px_3px_0px_var(--border-brutalist)]">
          <Calculator size={32} />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold font-heading text-text-primary mb-3">
          Tool In Active Development
        </h2>
        <p className="text-sm sm:text-base text-text-tertiary max-w-md mx-auto mb-8">
          Features will include semester-wise course entry, retake grade replacement algorithms, target GPA simulation, and PDF transcripts export.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button href="/resources/cover-page" variant="secondary" size="md">
            Try Cover Page Generator
          </Button>
          <Button href="/resources/watermark" variant="secondary" size="md">
            Try Photo Sigil
          </Button>
        </div>
      </div>
    </div>
  );
}
