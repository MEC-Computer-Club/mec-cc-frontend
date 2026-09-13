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
      className="fixed bottom-6 right-6 z-[1000] inline-flex items-center gap-2 px-4 py-2.5 bg-accent-primary text-white text-sm font-bold rounded-xl border-2 border-text-primary dark:border-border-default shadow-[4px_4px_0px_0px_var(--text-primary)] hover:shadow-[2px_2px_0px_0px_var(--text-primary)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all duration-150"
      title="Edit this page (Admin)"
    >
      <Pencil size={16} />
      Edit This Page
    </Link>
  );
}
