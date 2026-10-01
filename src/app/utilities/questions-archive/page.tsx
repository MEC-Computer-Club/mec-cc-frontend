import type { Metadata } from "next";
import { QuestionsArchiveClient } from "./QuestionsArchiveClient";

export const metadata: Metadata = {
  title: "Questions Archive | MEC Computer Club",
  description:
    "Explore, filter, view, and download semester final and class test (CT1, CT2, CT3) exam question papers across all engineering departments and academic years at Mymensingh Engineering College.",
  keywords: [
    "MEC Questions Archive",
    "MEC Exam Questions",
    "Mymensingh Engineering College Question Bank",
    "MEC CT Questions",
    "CSE Semester Final Questions",
    "EEE Semester Final Questions",
    "CE Semester Final Questions",
  ],
  openGraph: {
    title: "Questions Archive — MEC Computer Club",
    description:
      "Comprehensive exam archive of semester final questions and class tests (CT1, CT2, CT3) across all departments and academic sessions.",
  },
};

export default function QuestionsArchivePage() {
  return <QuestionsArchiveClient />;
}
