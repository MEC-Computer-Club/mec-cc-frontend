export const revalidate = 60;

import { Metadata } from "next";
import { getPageContent } from "@/lib/pageContent";
import SponsorView from "./components/SponsorView";

export const metadata: Metadata = {
  title: "Corporate Sponsorship | MEC Computer Club",
  description:
    "Acquire top engineering talent and boost brand visibility by partnering with Mymensingh Engineering College's premier tech community.",
  alternates: {
    canonical: "https://meccomputerclub.org/collaborate/sponsor",
  },
  openGraph: {
    title: "Corporate Sponsorship | MEC Computer Club",
    description:
      "Partner with MEC Computer Club to recruit battle-tested engineers, sponsor collegiate hackathons, and boost tech brand presence.",
    url: "https://meccomputerclub.org/collaborate/sponsor",
  },
};

export default async function SponsorPage() {
  const sponsorContent = await getPageContent("sponsor");

  return <SponsorView initialContent={sponsorContent} />;
}

