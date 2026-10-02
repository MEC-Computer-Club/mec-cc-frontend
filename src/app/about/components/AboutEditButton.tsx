"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Pencil } from "lucide-react";

export function AboutEditButton() {
  const { isAdmin } = useAuth();

  if (!isAdmin) return null;

  return (
    <Link
      href="/dashboard/page-editor?tab=content&section=about"
      className="fixed bottom-6 right-6 z-[1000] inline-flex items-center gap-2 px-4 py-2.5 bg-black text-white dark:bg-white dark:text-black text-sm font-bold rounded-md hover:shadow-[4px_4px_0px_0px_var(--accent-primary)] hover:-translate-x-1 hover:-translate-y-1 active:translate-x-0 active:translate-y-0 active:shadow-none transition-all duration-150"
      title="Edit this page (Admin)"
    >
      <Pencil size={16} />
      Edit This Page
    </Link>
  );
}
