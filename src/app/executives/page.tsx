import type { Metadata } from "next";
import { getCommitteeTerms, getCommitteeByTerm } from "@/lib/api/executives";
import ExecutivePanelClient from "./components/ExecutivePanelClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Executive Committee & Leadership Archive | MEC Computer Club",
  description:
    "Explore current executive panels and historical committee archives of the MEC Computer Club at Mymensingh Engineering College. Meet the student leaders driving club governance.",
  keywords: [
    "MEC Computer Club executives",
    "MEC CC executive committee",
    "MEC CC leadership archive",
    "Mymensingh Engineering College computer club leaders",
    "MEC CSE executives",
    "MEC Computer Club president",
    "MEC CC past committees",
  ],
  alternates: {
    canonical: "https://meccomputerclub.org/executives",
  },
  openGraph: {
    title: "Executive Committee & Leadership Archive | MEC Computer Club",
    description:
      "Explore current executive panels and historical committee archives of the MEC Computer Club at Mymensingh Engineering College.",
    url: "https://meccomputerclub.org/executives",
    images: ["/mec-club-photo.jpg"],
  },
};

interface ExecutivesPageProps {
  searchParams?: Promise<{ term?: string }> | { term?: string };
}

export default async function ExecutivesPage({ searchParams }: ExecutivesPageProps) {
  // Resolve searchParams safely
  const resolvedParams = searchParams ? await searchParams : {};
  const requestedTerm = resolvedParams.term;

  // 1. Fetch all available committee terms
  const terms = await getCommitteeTerms();

  // 2. Identify default term (requested from URL or current active term or first available)
  const currentTerm = terms.find((t) => t.isCurrent) || terms[0];
  const activeTermKey = requestedTerm && terms.some((t) => t.term === requestedTerm)
    ? requestedTerm
    : (currentTerm?.term || "2026-2027");

  // 3. Fetch committee details for the chosen term
  const committee = await getCommitteeByTerm(activeTermKey);

  return (
    <ExecutivePanelClient
      initialTerms={terms}
      initialCommittee={committee}
      initialSelectedTerm={activeTermKey}
    />
  );
}
