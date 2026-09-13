import type { Metadata } from "next";
import { WatermarkForgeClient } from "@/app/resources/watermark/WatermarkForgeClient";

export const metadata: Metadata = {
  title: "The Sigil Forge — Batch Event Photo Watermarking",
  description:
    "Imbue event photos with authentic MEC Computer Club branding, typography, and metadata. Fully client-side batch processing with high-resolution canvas export.",
  keywords: [
    "MEC Computer Club Watermark",
    "Sigil Forge",
    "Event Photo Watermark",
    "Batch Image Watermark",
    "MEC CC Sigil Inscription",
    "Client-side photo watermarking",
  ],
  openGraph: {
    title: "The Sigil Forge — MEC Computer Club Batch Watermark Tool",
    description:
      "Client-side batch photo branding utility with custom monograms and Space Grotesk typography.",
    images: [
      {
        url: "/covers/watermark-forge-og.png",
        width: 1200,
        height: 630,
        alt: "The Sigil Forge — MEC Computer Club",
      },
    ],
  },
};

export default function WatermarkPage() {
  return <WatermarkForgeClient />;
}
