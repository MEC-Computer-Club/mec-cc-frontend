import type { Metadata } from "next";
import DevelopersClient from "./DevelopersClient";

// revalidate function
export const revalidate = 120;

const OG_IMAGE_URL =
  "https://res.cloudinary.com/dj1sjgitq/image/upload/f_jpg,w_1200,h_630,c_fill,g_auto,q_auto:good/v1791228612/uploads/site/mec-club-og.jpg";

export const metadata: Metadata = {
  title: "Core Developers & Engineering Team | MEC Computer Club",
  description:
    "Meet the core developers and student software architects who engineered and maintain the official MEC Computer Club platform at Mymensingh Engineering College.",
  keywords: [
    "MEC Computer Club developers",
    "MEC CC software team",
    "Md. Nasir Ahmed MEC",
    "Tawhid Ahmed Abokash",
    "MEC CSE engineers",
    "Mymensingh Engineering College developers",
    "MEC CC lead architects",
    "MEC Computer Club website makers",
  ],
  alternates: {
    canonical: "https://meccomputerclub.org/developers",
  },
  openGraph: {
    title: "Core Developers & Engineering Team | MEC Computer Club",
    description:
      "Meet the core developers and student software architects who engineered and maintain the official MEC Computer Club platform at Mymensingh Engineering College.",
    url: "https://meccomputerclub.org/developers",
    siteName: "MEC Computer Club",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: OG_IMAGE_URL,
        secureUrl: OG_IMAGE_URL,
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Core Developers & Engineering Team | MEC Computer Club",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Core Developers & Engineering Team | MEC Computer Club",
    description:
      "Meet the core developers and student software architects who engineered and maintain the official MEC Computer Club platform at Mymensingh Engineering College.",
    images: [OG_IMAGE_URL],
  },
};

export default function DevelopersPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    name: "MEC Computer Club Core Developers",
    description:
      "Official engineering team and core maintainers of the MEC Computer Club web platform.",
    mainEntity: [
      {
        "@type": "Person",
        name: "Md. Nasir Ahmed",
        jobTitle: "Lead Full-Stack Architect & Core Maintainer",
        worksFor: {
          "@type": "Organization",
          name: "MEC Computer Club",
        },
        url: "https://github.com/nasir-ahmed-dev",
        alumniOf: "Mymensingh Engineering College",
      },
      {
        "@type": "Person",
        name: "Tawhid Ahmed (Abokash)",
        jobTitle: "Core Frontend Developer & UI/UX Architect",
        worksFor: {
          "@type": "Organization",
          name: "MEC Computer Club",
        },
        url: "https://github.com/abokash",
        alumniOf: "Mymensingh Engineering College",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DevelopersClient />
    </>
  );
}