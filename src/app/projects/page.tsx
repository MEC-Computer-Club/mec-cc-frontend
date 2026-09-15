export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { getProjects } from "@/data/projects";
import { ProjectsClient } from "./components/ProjectsClient";

export const metadata: Metadata = {
  title: "Projects & Production Software Showcase | MEC Computer Club",
  description:
    "Explore real-world software, open-source platforms, and tools built by MEC Computer Club members — including MEC Judge, CP Tracker, and campus software in Mymensingh.",
  keywords: [
    "MEC Computer Club projects",
    "MEC Judge",
    "MEC CP Tracker",
    "Mymensingh Engineering College software projects",
    "student projects Mymensingh",
    "open source MEC",
  ],
  alternates: {
    canonical: "https://meccomputerclub.org/projects",
  },
  openGraph: {
    title: "Projects & Production Software Showcase | MEC Computer Club",
    description:
      "Not tutorials — real production software built by students at Mymensingh Engineering College (MEC), Mymensingh.",
    url: "https://meccomputerclub.org/projects",
    images: ["/mec-club-photo.jpg"],
  },
};

export default async function ProjectsPage() {
  const allProjects = await getProjects();

  return <ProjectsClient initialProjects={allProjects} />;
}
