"use client";

import React, { useState } from "react";
import CommitteeTermsManager from "@/components/dashboard/CommitteeTermsManager";
import { Users, Mail, Award, KeyRound, Calendar } from "lucide-react";
import InvitationCodeContent from "@/components/dashboard/InvitationCodeContent";
import RolesManagement from "@/components/dashboard/RolesManagement";
import { DesignationManager } from "@/components/dashboard/legacy/DesignationManager";
import { useAuth } from "@/context/AuthContext";
import { useRoleGuard } from "@/hooks/useRoleGuard";

type RolesTab = "roles" | "invitation" | "designations";

export default function RolesAndPermissionsPage() {
  const { isAllowed, isLoading } = useRoleGuard(["admin"]);
  const [activeTab, setActiveTab] = useState<RolesTab>("roles");
  const [designationCategory, setDesignationCategory] = useState<"executive" | "advisor" | "committees">("executive");
  const { user } = useAuth();

  if (isLoading || !isAllowed) return null;

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="border-b border-border-default pb-5">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-950 dark:bg-orange-950/60 dark:text-orange-300 font-mono text-[11px] font-bold tracking-wider uppercase mb-1.5 border border-orange-300 dark:border-orange-700/60">
          <KeyRound size={13} />
          Access Control &amp; Hierarchy
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
          Roles &amp; Permissions
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-0.5 max-w-2xl">
          Manage member administrative clearance, generate role-granting invitation codes, and configure executive committee panels.
        </p>
      </div>

      {/* ── Neo-Brutalist Tabs ── */}
      <div className="flex items-center gap-2 border-b border-border-default overflow-x-auto no-scrollbar pb-px">
        <button
          type="button"
          onClick={() => setActiveTab("roles")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-all cursor-pointer whitespace-nowrap border-t-2 border-x-2 ${
            activeTab === "roles"
              ? "bg-surface-elevated text-text-primary border-border-brutalist dark:border-border-default shadow-[3px_-2px_0px_0px_var(--border-brutalist)] -mb-px"
              : "border-transparent text-text-secondary hover:text-text-primary hover:bg-surface-secondary/60"
          }`}
        >
          <Users size={16} className={activeTab === "roles" ? "text-accent-primary" : ""} />
          Member Roles &amp; Clearance
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("invitation")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-all cursor-pointer whitespace-nowrap border-t-2 border-x-2 ${
            activeTab === "invitation"
              ? "bg-surface-elevated text-text-primary border-border-brutalist dark:border-border-default shadow-[3px_-2px_0px_0px_var(--border-brutalist)] -mb-px"
              : "border-transparent text-text-secondary hover:text-text-primary hover:bg-surface-secondary/60"
          }`}
        >
          <Mail size={16} className={activeTab === "invitation" ? "text-accent-primary" : ""} />
          Invitation Codes
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("designations")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-t-xl transition-all cursor-pointer whitespace-nowrap border-t-2 border-x-2 ${
            activeTab === "designations"
              ? "bg-surface-elevated text-text-primary border-border-brutalist dark:border-border-default shadow-[3px_-2px_0px_0px_var(--border-brutalist)] -mb-px"
              : "border-transparent text-text-secondary hover:text-text-primary hover:bg-surface-secondary/60"
          }`}
        >
          <Award size={16} className={activeTab === "designations" ? "text-accent-primary" : ""} />
          Designations &amp; Panels
        </button>
      </div>

      {/* ── Tab Content ── */}
      <div>
        {activeTab === "roles" && <RolesManagement />}

        {activeTab === "invitation" && <InvitationCodeContent />}

        {activeTab === "designations" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2 p-1.5 bg-surface-secondary rounded-xl border border-border-default w-fit">
              <button
                type="button"
                onClick={() => setDesignationCategory("executive")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  designationCategory === "executive"
                    ? "bg-accent-primary text-accent-primary-text shadow-xs border border-border-brutalist"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                Executive Roles
              </button>
              <button
                type="button"
                onClick={() => setDesignationCategory("advisor")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  designationCategory === "advisor"
                    ? "bg-accent-primary text-accent-primary-text shadow-xs border border-border-brutalist"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                Advisor Panel
              </button>
              <button
                type="button"
                onClick={() => setDesignationCategory("committees")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  designationCategory === "committees"
                    ? "bg-accent-primary text-accent-primary-text shadow-xs border border-border-brutalist"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <Calendar size={13} />
                Committee Tenures &amp; Archives
              </button>
            </div>

            {designationCategory === "committees" ? (
              <CommitteeTermsManager isAdminUser={user?.role === "admin"} />
            ) : (
              <DesignationManager
                category={designationCategory}
                isAdminUser={user?.role === "admin"}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
