import type { Metadata } from "next";
import { WatermarkForgeClient } from "@/app/resources/watermark/WatermarkForgeClient";

export const metadata: Metadata = {
  title: "Event Watermark Studio — MEC Computer Club",
  description:
    "Add official MEC Computer Club branding, logos, and event details to photos in batch. Fast, high-resolution, client-side photo watermarking.",
  keywords: [
    "MEC Computer Club Watermark",
    "Watermark Studio",
    "Event Photo Watermark",
    "Batch Image Watermark",
    "MEC CC Photo Branding",
    "Client-side photo watermarking",
  ],
  openGraph: {
    title: "Event Watermark Studio — MEC Computer Club",
    description:
      "Client-side batch photo branding utility with custom logos and official brand typography.",
    images: [
      {
        url: "/covers/watermark-forge-og.png",
        width: 1200,
        height: 630,
        alt: "Event Watermark Studio — MEC Computer Club",
      },
    ],
  },
};

export default function WatermarkPage() {
  return <WatermarkForgeClient />;
}
