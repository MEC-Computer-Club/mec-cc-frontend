"use client";
import React, { useState, useEffect, Suspense } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  DollarSign,
  CheckCircle,
  XCircle,
  ExternalLink,
  Handshake,
  Globe,
  Award,
  Calendar,
  Building2,
  Users,
  Sparkles,
} from "lucide-react";
import SponsorLogo from "@/components/dashboard/SponsorLogo";

interface Sponsor {
  _id: string;
  name: string;
  logoUrl: string;
  website?: string;
  category?: "sponsor" | "club_as_partner";
  role?: string;
  tier?: string;
  showOnHome?: boolean;
  description?: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  contactName?: string;
  contactEmail?: string;
  sponsorships?: Array<{
    _id?: string;
    sponsorshipType: "event" | "duration";
    eventName?: string;
    tier?: string;
    startDate?: string;
    endDate?: string;
    contributionType: string;
    amountOrValue: number;
    notes?: string;
  }>;
  createdAt?: string;
}

const API = `${API_BASE_URL}/api/sponsors`;

function SponsorsContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") || searchParams.get("category");

  const [mainTab, setMainTab] = useState<"sponsors" | "club_as_partner">(
    tabParam === "club_as_partner" || tabParam === "partner" ? "club_as_partner" : "sponsors"
  );
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [filterActive, setFilterActive] = useState<"all" | "active" | "inactive">("all");

  const fetchSponsors = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API, { withCredentials: true });
      setSponsors(res.data.data || []);
    } catch {
      console.error("Failed to load sponsors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API}/${id}`, { withCredentials: true });
      setSponsors((prev) => prev.filter((s) => s._id !== id));
      setDeleteConfirm(null);
    } catch {
      alert("Delete failed.");
    }
  };

  const toggleActive = async (sponsor: Sponsor) => {
    try {
      await axios.patch(
        `${API}/${sponsor._id}`,
        { isActive: !sponsor.isActive },
        { withCredentials: true }
      );
      setSponsors((prev) =>
        prev.map((s) => (s._id === sponsor._id ? { ...s, isActive: !sponsor.isActive } : s))
      );
    } catch {
      alert("Update failed.");
    }
  };

  const toggleHomeFeature = async (sponsor: Sponsor) => {
    const nextVal = !sponsor.showOnHome;
    try {
      await axios.patch(
        `${API}/${sponsor._id}`,
        { showOnHome: nextVal },
        { withCredentials: true }
      );
      setSponsors((prev) =>
        prev.map((s) => (s._id === sponsor._id ? { ...s, showOnHome: nextVal } : s))
      );
    } catch {
      alert("Failed to update homepage status.");
    }
  };

  // Divide into the two categories
  const sponsorList = sponsors
    .filter((s) => s.category !== "club_as_partner")
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

  const partnerList = sponsors
    .filter((s) => s.category === "club_as_partner")
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

  const currentList = mainTab === "sponsors" ? sponsorList : partnerList;

  const filtered = currentList.filter((s) => {
    if (filterActive === "active") return s.isActive;
    if (filterActive === "inactive") return !s.isActive;
    return true;
  });

  // Tab 1 (Sponsors) stats
  const activeSponsorsCount = sponsorList.filter((s) => s.isActive).length;
  const totalMonetaryValue = sponsorList
    .flatMap((s) => s.sponsorships || [])
    .filter((r) => r.contributionType === "monetary")
    .reduce((sum, r) => sum + (r.amountOrValue || 0), 0);

  // Tab 2 (Club as Partner) stats
  const activePartnersCount = partnerList.filter((s) => s.isActive).length;
  const uniqueRolesCount = new Set(
    partnerList.map((p) => p.role?.trim() || "Club Partner").filter(Boolean)
  ).size;

  const formatDateRange = (start?: string, end?: string) => {
    if (!start && !end) return null;
    const startStr = start ? new Date(start).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "";
    const endStr = end ? new Date(end).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "";
    if (startStr && endStr) return `${startStr} – ${endStr}`;
    return startStr || endStr;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-default pb-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary flex items-center gap-2.5">
            <Handshake className="text-accent-primary" size={28} /> Sponsors &amp; Partners
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Manage club sponsors, financial backers, and external partnerships where MEC CC is connected.
          </p>
        </div>
        <Link
          href={
            mainTab === "sponsors"
              ? "/dashboard/sponsors/create?category=sponsor"
              : "/dashboard/sponsors/create?category=club_as_partner"
          }
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition whitespace-nowrap bg-text-primary text-surface-elevated hover:opacity-90 shadow-[4px_4px_0px_0px_var(--accent-primary)]"
          style={{ color: "#FFFFFF" }}
        >
          <Plus size={16} />
          {mainTab === "sponsors" ? "Add Sponsor" : "Add Connection"}
        </Link>
      </div>

      {/* Main Mode Switcher Tabs */}
      <div className="flex border-b-2 border-border-default gap-2">
        <button
          onClick={() => {
            setMainTab("sponsors");
            setFilterActive("all");
          }}
          className={`flex items-center gap-2.5 px-5 py-3 font-bold text-sm transition relative border-t-2 border-x-2 rounded-t-xl ${
            mainTab === "sponsors"
              ? "border-text-primary dark:border-border-default bg-surface-elevated text-text-primary shadow-[0_2px_0_0_var(--surface-elevated)]"
              : "border-transparent text-text-secondary hover:text-text-primary hover:bg-surface-secondary/60"
          }`}
        >
          <Handshake size={18} className={mainTab === "sponsors" ? "text-accent-primary" : "text-text-secondary"} />
          <span>Sponsors &amp; Collaborators</span>
          <span
            className={`px-2 py-0.5 text-xs rounded-full font-bold ${
              mainTab === "sponsors"
                ? "bg-accent-primary-light text-text-primary"
                : "bg-surface-secondary text-text-secondary"
            }`}
          >
            {sponsorList.length}
          </span>
        </button>

        <button
          onClick={() => {
            setMainTab("club_as_partner");
            setFilterActive("all");
          }}
          className={`flex items-center gap-2.5 px-5 py-3 font-bold text-sm transition relative border-t-2 border-x-2 rounded-t-xl ${
            mainTab === "club_as_partner"
              ? "border-text-primary dark:border-border-default bg-surface-elevated text-text-primary shadow-[0_2px_0_0_var(--surface-elevated)]"
              : "border-transparent text-text-secondary hover:text-text-primary hover:bg-surface-secondary/60"
          }`}
        >
          <Globe size={18} className={mainTab === "club_as_partner" ? "text-accent-primary" : "text-text-secondary"} />
          <span>External Connections (Club as Partner)</span>
          <span
            className={`px-2 py-0.5 text-xs rounded-full font-bold ${
              mainTab === "club_as_partner"
                ? "bg-accent-primary-light text-text-primary"
                : "bg-surface-secondary text-text-secondary"
            }`}
          >
            {partnerList.length}
          </span>
        </button>
      </div>

      {/* Stats Cards */}
      {mainTab === "sponsors" ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Total Sponsors"
            value={sponsorList.length}
            icon={Building2}
            color="text-accent-primary"
          />
          <StatCard
            label="Active Sponsors"
            value={activeSponsorsCount}
            icon={CheckCircle}
            color="text-accent-success"
          />
          <StatCard
            label="Total Monetary Backing"
            value={`৳${totalMonetaryValue.toLocaleString()}`}
            icon={DollarSign}
            color="text-accent-warning"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Partner Engagements"
            value={partnerList.length}
            icon={Globe}
            color="text-accent-primary"
          />
          <StatCard
            label="Active Connections"
            value={activePartnersCount}
            icon={CheckCircle}
            color="text-accent-success"
          />
          <StatCard
            label="Partner Roles Represented"
            value={uniqueRolesCount}
            icon={Award}
            color="text-accent-warning"
          />
        </div>
      )}

      {/* Filter Status Pills */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-1 bg-surface-secondary border border-border-default p-1 rounded-xl w-fit shadow-[2px_2px_0px_0px_var(--border-default)]">
          {(["all", "active", "inactive"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilterActive(f)}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition capitalize ${
                filterActive === f
                  ? "bg-surface-elevated text-text-primary border border-border-default shadow-[2px_2px_0px_0px_var(--border-default)]"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {f === "all"
                ? `All (${currentList.length})`
                : f === "active"
                ? `Active (${currentList.filter((s) => s.isActive).length})`
                : `Inactive (${currentList.filter((s) => !s.isActive).length})`}
            </button>
          ))}
        </div>

        {!loading && (
          <button
            onClick={fetchSponsors}
            className="flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-text-primary transition px-3 py-1.5 rounded-lg border border-border-default bg-surface-elevated shadow-[2px_2px_0px_0px_var(--border-default)]"
          >
            <RefreshCw size={13} /> Refresh List
          </button>
        )}
      </div>

      {/* List content */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-28 bg-surface-secondary rounded-2xl animate-pulse border border-border-default"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-surface-elevated rounded-2xl border-2 border-dashed border-border-default">
          {mainTab === "sponsors" ? (
            <>
              <Handshake className="w-12 h-12 text-text-secondary mx-auto mb-3" />
              <p className="text-text-primary font-bold text-base">No sponsors found</p>
              <p className="text-text-secondary text-xs mt-1 max-w-sm mx-auto">
                {filterActive !== "all"
                  ? `No ${filterActive} sponsors currently match the filter.`
                  : "Start documenting organizations providing sponsorship or collaborating with MEC CC."}
              </p>
              <Link
                href="/dashboard/sponsors/create?category=sponsor"
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-text-primary text-surface-elevated hover:opacity-90 shadow-[3px_3px_0px_0px_var(--border-default)]"
                style={{ color: "#FFFFFF" }}
              >
                <Plus size={14} /> Add First Sponsor
              </Link>
            </>
          ) : (
            <>
              <Globe className="w-12 h-12 text-accent-primary mx-auto mb-3" />
              <p className="text-text-primary font-bold text-base">No external connections recorded yet</p>
              <p className="text-text-secondary text-xs mt-1 max-w-md mx-auto">
                Track external events, fests, and hackathons where MEC Computer Club is participating as a Club Partner, Community Partner, or Co-Organizer.
              </p>
              <Link
                href="/dashboard/sponsors/create?category=club_as_partner"
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-text-primary text-surface-elevated hover:opacity-90 shadow-[3px_3px_0px_0px_var(--border-default)]"
                style={{ color: "#FFFFFF" }}
              >
                <Plus size={14} /> Add First External Connection
              </Link>
            </>
          )}
        </div>
      ) : mainTab === "sponsors" ? (
        /* ── Tab 1: Sponsors List ── */
        <div className="space-y-3">
          {filtered.map((sponsor) => (
            <div
              key={sponsor._id}
              className={`bg-surface-elevated rounded-2xl border border-border-default p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-[6px_6px_0px_0px_var(--border-default)] shadow-[4px_4px_0px_0px_var(--border-default)] transition ${
                sponsor.isActive ? "" : "opacity-70"
              }`}
            >
              <SponsorLogo logoUrl={sponsor.logoUrl} name={sponsor.name} />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-bold text-base text-text-primary">{sponsor.name}</h4>
                  <span
                    className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                      sponsor.isActive
                        ? "bg-accent-success text-surface-elevated"
                        : "bg-surface-secondary text-text-secondary"
                    }`}
                  >
                    {sponsor.isActive ? "Active" : "Inactive"}
                  </span>
                  {sponsor.showOnHome && (
                    <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                      <Sparkles size={11} /> Home
                    </span>
                  )}
                  {(sponsor.sponsorships?.length ?? 0) > 0 && (
                    <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-surface-secondary text-text-secondary border border-border-default">
                      {sponsor.sponsorships?.length} sponsorship
                      {sponsor.sponsorships?.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-text-secondary font-semibold">
                  {(sponsor.sponsorships?.length ?? 0) > 0 && (
                    <span className="text-text-primary font-bold">
                      Total: ৳
                      {(sponsor.sponsorships || [])
                        .filter((r) => r.contributionType === "monetary")
                        .reduce((s, r) => s + (r.amountOrValue || 0), 0)
                        .toLocaleString()}
                    </span>
                  )}
                  {sponsor.contactName && <span>Contact: {sponsor.contactName}</span>}
                  {sponsor.contactEmail && <span>{sponsor.contactEmail}</span>}
                </div>

                {(sponsor.sponsorships?.length ?? 0) > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {sponsor.sponsorships?.slice(0, 3).map((r, i) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-0.5 rounded-full bg-surface-secondary border border-border-default text-text-secondary font-semibold flex items-center gap-1"
                      >
                        {r.tier && <span className="text-amber-600 dark:text-amber-400 font-bold">{r.tier}:</span>}
                        <span>
                          {r.sponsorshipType === "event"
                            ? r.eventName || "Event"
                            : `${r.startDate ? new Date(r.startDate).getFullYear() : "?"} – ${
                                r.endDate ? new Date(r.endDate).getFullYear() : "?"
                              }`}
                        </span>
                      </span>
                    ))}
                    {(sponsor.sponsorships?.length ?? 0) > 3 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-surface-secondary border border-border-default text-text-secondary font-semibold">
                        +{(sponsor.sponsorships?.length ?? 0) - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                {sponsor.website && (
                  <a
                    href={sponsor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg text-text-secondary hover:text-accent-primary hover:bg-surface-secondary transition"
                    title="Visit website"
                  >
                    <ExternalLink size={16} />
                  </a>
                )}
                <button
                  onClick={() => toggleHomeFeature(sponsor)}
                  className={`p-2 rounded-lg transition font-semibold ${
                    sponsor.showOnHome
                      ? "text-amber-500 hover:bg-surface-secondary"
                      : "text-text-tertiary hover:text-amber-500 hover:bg-surface-secondary"
                  }`}
                  title={sponsor.showOnHome ? "Remove from Homepage" : "Feature on Homepage"}
                >
                  <Sparkles size={16} />
                </button>
                <button
                  onClick={() => toggleActive(sponsor)}
                  className={`p-2 rounded-lg transition font-semibold ${
                    sponsor.isActive
                      ? "text-accent-success hover:bg-surface-secondary"
                      : "text-text-secondary hover:text-accent-success hover:bg-surface-secondary"
                  }`}
                  title={sponsor.isActive ? "Deactivate" : "Activate"}
                >
                  {sponsor.isActive ? <CheckCircle size={16} /> : <XCircle size={16} />}
                </button>
                <Link
                  href={`/dashboard/sponsors/${sponsor._id}/edit`}
                  className="p-2 rounded-lg text-text-secondary hover:text-accent-primary hover:bg-surface-secondary transition"
                  title="Edit"
                >
                  <Pencil size={16} />
                </Link>
                {deleteConfirm === sponsor._id ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDelete(sponsor._id)}
                      className="px-2 py-1 text-xs bg-accent-error hover:bg-red-700 text-surface-elevated font-semibold rounded-lg transition"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-2 py-1 text-xs text-text-secondary font-semibold hover:text-text-primary transition"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(sponsor._id)}
                    className="p-2 rounded-lg text-text-secondary hover:text-accent-error hover:bg-surface-secondary transition"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ── Tab 2: External Connections (Club as Partner) List ── */
        <div className="space-y-3">
          {filtered.map((partner) => {
            const dateRange = formatDateRange(partner.startDate, partner.endDate);
            return (
              <div
                key={partner._id}
                className={`bg-surface-elevated rounded-2xl border border-border-default p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start gap-4 hover:shadow-[6px_6px_0px_0px_var(--border-default)] shadow-[4px_4px_0px_0px_var(--border-default)] transition ${
                  partner.isActive ? "" : "opacity-75"
                }`}
              >
                {/* Event/Organizer Logo */}
                <SponsorLogo logoUrl={partner.logoUrl} name={partner.name} category="club_as_partner" />

                {/* Main Details */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h4 className="font-bold text-base text-text-primary">{partner.name}</h4>

                    {/* Role Pill */}
                    <span className="px-2.5 py-0.5 text-xs font-bold rounded-lg bg-accent-primary-light text-text-primary border border-accent-primary/30 flex items-center gap-1.5 shadow-[1px_1px_0px_0px_var(--accent-primary)]">
                      <Award size={13} className="text-accent-primary" />
                      MEC CC as: {partner.role || "Club Partner"}
                    </span>

                    {/* Active Status */}
                    <span
                      className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                        partner.isActive
                          ? "bg-accent-success text-surface-elevated"
                          : "bg-surface-secondary text-text-secondary"
                      }`}
                    >
                      {partner.isActive ? "Active Engagement" : "Past / Concluded"}
                    </span>
                  </div>

                  {/* Dates if available */}
                  {dateRange && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary">
                      <Calendar size={13} className="text-accent-primary" />
                      <span>{dateRange}</span>
                    </div>
                  )}

                  {/* Description / Scope notes */}
                  {partner.description && (
                    <p className="text-xs text-text-secondary leading-relaxed bg-surface-secondary/50 p-2.5 rounded-xl border border-border-default/60">
                      {partner.description}
                    </p>
                  )}

                  {/* Contact Info */}
                  {(partner.contactName || partner.contactEmail) && (
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-secondary font-semibold pt-0.5">
                      {partner.contactName && (
                        <span className="flex items-center gap-1">
                          <Users size={12} /> Contact: {partner.contactName}
                        </span>
                      )}
                      {partner.contactEmail && <span>{partner.contactEmail}</span>}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-start pt-1">
                  {partner.website && (
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-text-secondary hover:text-accent-primary hover:bg-surface-secondary transition"
                      title="Visit official event link"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                  <button
                    onClick={() => toggleActive(partner)}
                    className={`p-2 rounded-lg transition font-semibold ${
                      partner.isActive
                        ? "text-accent-success hover:bg-surface-secondary"
                        : "text-text-secondary hover:text-accent-success hover:bg-surface-secondary"
                    }`}
                    title={partner.isActive ? "Mark Concluded" : "Mark Active"}
                  >
                    {partner.isActive ? <CheckCircle size={16} /> : <XCircle size={16} />}
                  </button>
                  <Link
                    href={`/dashboard/sponsors/${partner._id}/edit`}
                    className="p-2 rounded-lg text-text-secondary hover:text-accent-primary hover:bg-surface-secondary transition"
                    title="Edit Connection"
                  >
                    <Pencil size={16} />
                  </Link>
                  {deleteConfirm === partner._id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(partner._id)}
                        className="px-2 py-1 text-xs bg-accent-error hover:bg-red-700 text-surface-elevated font-semibold rounded-lg transition"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-2 py-1 text-xs text-text-secondary font-semibold hover:text-text-primary transition"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(partner._id)}
                      className="p-2 rounded-lg text-text-secondary hover:text-accent-error hover:bg-surface-secondary transition"
                      title="Delete Connection"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function SponsorsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-text-secondary font-semibold">
          Loading Sponsors &amp; Partners…
        </div>
      }
    >
      <SponsorsContent />
    </Suspense>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  icon?: React.ElementType;
  color: string;
}) {
  return (
    <div className="bg-surface-elevated rounded-2xl border border-border-default p-5 shadow-[4px_4px_0px_0px_var(--border-default)] hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-text-secondary">{label}</p>
        {Icon && <Icon size={18} className="text-text-secondary" />}
      </div>
      <p className={`text-2xl font-bold mt-1.5 ${color}`}>{value}</p>
    </div>
  );
}
