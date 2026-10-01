"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";
import {
  Calendar,
  Plus,
  Trash2,
  Edit2,
  Users,
  CheckCircle2,
  History,
  Sparkles,
  Loader2,
  Search,
  X,
  ExternalLink,
  ShieldAlert,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import UniversalImageDropzone from "@/components/ui/shared/UniversalImageDropzone";
import toast from "react-hot-toast";

const API = `${API_BASE_URL}/api`;

interface CommitteeMemberItem {
  _id?: string;
  id?: string;
  userId?: string | null;
  name: string;
  role: string;
  order: number;
  department?: string;
  batch?: string;
  session?: string;
  image?: string;
  imageUrl?: string;
  imagePosition?: string;
  bio?: string;
  socials?: any;
}

interface CommitteeItem {
  _id: string;
  term: string;
  title: string;
  isCurrent: boolean;
  order: number;
  session?: string;
  groupPhotoUrl?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  memberCount: number;
  createdAt?: string;
}

export default function CommitteeTermsManager({ isAdminUser }: { isAdminUser: boolean }) {
  const [committees, setCommittees] = useState<CommitteeItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Term Modal (Create / Edit metadata)
  const [termModalOpen, setTermModalOpen] = useState(false);
  const [editingCommittee, setEditingCommittee] = useState<CommitteeItem | null>(null);
  const [termName, setTermName] = useState("");
  const [termTitle, setTermTitle] = useState("");
  const [termDescription, setTermDescription] = useState("");
  const [termIsCurrent, setTermIsCurrent] = useState(false);
  const [termGroupPhoto, setTermGroupPhoto] = useState("");
  const [savingTerm, setSavingTerm] = useState(false);

  // Roster Modal (Manage members for a specific committee)
  const [rosterModalOpen, setRosterModalOpen] = useState(false);
  const [activeCommitteeDetail, setActiveCommitteeDetail] = useState<any | null>(null);
  const [loadingRoster, setLoadingRoster] = useState(false);
  const [savingRoster, setSavingRoster] = useState(false);

  // Add Member to Roster form
  const [newMemberMode, setNewMemberMode] = useState<"search" | "manual">("search");
  const [memberSearchQuery, setMemberSearchQuery] = useState("");
  const [searchingUsers, setSearchingUsers] = useState(false);
  const [userSearchResults, setUserSearchResults] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  // Member fields
  const [memberRole, setMemberRole] = useState("Executive Member");
  const [memberOrder, setMemberOrder] = useState<number>(50);
  const [manualName, setManualName] = useState("");
  const [manualDept, setManualDept] = useState("CSE");
  const [manualBatch, setManualBatch] = useState("");
  const [manualSession, setManualSession] = useState("");
  const [manualImageUrl, setManualImageUrl] = useState("");
  const [manualImagePosition, setManualImagePosition] = useState("50% 50%");

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchCommittees = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/committees`, { withCredentials: true });
      if (res.data?.success) {
        setCommittees(res.data.data || []);
      }
    } catch {
      toast.error("Failed to load committee terms.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommittees();
  }, []);

  const openCreateTermModal = () => {
    setEditingCommittee(null);
    setTermName("");
    setTermTitle("");
    setTermDescription("");
    setTermIsCurrent(false);
    setTermGroupPhoto("");
    setTermModalOpen(true);
  };

  const openEditTermModal = (c: CommitteeItem) => {
    setEditingCommittee(c);
    setTermName(c.term);
    setTermTitle(c.title);
    setTermDescription(c.description || "");
    setTermIsCurrent(c.isCurrent);
    setTermGroupPhoto(c.groupPhotoUrl || "");
    setTermModalOpen(true);
  };

  const handleSaveTerm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!termName.trim() || !termTitle.trim()) {
      toast.error("Term code (e.g. 2026-2027) and Title are required.");
      return;
    }

    setSavingTerm(true);
    try {
      if (editingCommittee) {
        await axios.put(
          `${API}/committees/${editingCommittee._id}`,
          {
            term: termName.trim(),
            title: termTitle.trim(),
            description: termDescription.trim(),
            isCurrent: termIsCurrent,
            groupPhotoUrl: termGroupPhoto.trim(),
          },
          { withCredentials: true }
        );
        toast.success("Committee tenure updated successfully.");
      } else {
        await axios.post(
          `${API}/committees`,
          {
            term: termName.trim(),
            title: termTitle.trim(),
            description: termDescription.trim(),
            isCurrent: termIsCurrent,
            groupPhotoUrl: termGroupPhoto.trim(),
          },
          { withCredentials: true }
        );
        toast.success("New committee tenure created successfully.");
      }
      setTermModalOpen(false);
      fetchCommittees();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save committee term.");
    } finally {
      setSavingTerm(false);
    }
  };

  const handleDeleteTerm = async (c: CommitteeItem) => {
    if (!confirm(`Are you sure you want to delete the committee tenure "${c.title}"?`)) return;

    try {
      await axios.delete(`${API}/committees/${c._id}`, { withCredentials: true });
      toast.success("Committee tenure deleted.");
      fetchCommittees();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete committee tenure.");
    }
  };

  const handleSetCurrent = async (c: CommitteeItem) => {
    if (c.isCurrent) return;
    try {
      await axios.put(
        `${API}/committees/${c._id}`,
        { isCurrent: true },
        { withCredentials: true }
      );
      toast.success(`Set "${c.title}" as active current committee.`);
      fetchCommittees();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to set current committee.");
    }
  };

  // Open Roster modal for managing members of a term
  const openRosterModal = async (c: CommitteeItem) => {
    setRosterModalOpen(true);
    setLoadingRoster(true);
    setSelectedUser(null);
    setMemberSearchQuery("");
    setUserSearchResults([]);
    try {
      const res = await axios.get(`${API}/committees/term/${encodeURIComponent(c.term)}`, {
        withCredentials: true,
      });
      if (res.data?.success) {
        setActiveCommitteeDetail(res.data.data);
      }
    } catch {
      toast.error("Failed to load committee roster.");
      setRosterModalOpen(false);
    } finally {
      setLoadingRoster(false);
    }
  };

  // User search debounce for assigning registered users
  useEffect(() => {
    if (!memberSearchQuery.trim()) {
      setUserSearchResults([]);
      return;
    }

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(async () => {
      setSearchingUsers(true);
      try {
        const q = memberSearchQuery.trim().toLowerCase();
        const res = await axios.get(
          `${API}/users/profile/active?search=${encodeURIComponent(q)}`,
          { withCredentials: true }
        );
        const users: any[] = res.data?.data || res.data?.members || [];
        // Perform client-side filter fallback to guarantee accurate match across name, email, department, role
        const filtered = users.filter((u: any) => {
          const name = (u.fullName || "").toLowerCase();
          const email = (u.email || "").toLowerCase();
          const dept = (u.department || "").toLowerCase();
          const desig = (u.designation || "").toLowerCase();
          const custom = (u.customRole || "").toLowerCase();
          const sid = (u.studentId || "").toLowerCase();
          return (
            name.includes(q) ||
            email.includes(q) ||
            dept.includes(q) ||
            desig.includes(q) ||
            custom.includes(q) ||
            sid.includes(q)
          );
        });
        setUserSearchResults(filtered.slice(0, 15));
      } catch {
        setUserSearchResults([]);
      } finally {
        setSearchingUsers(false);
      }
    }, 200);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [memberSearchQuery]);

  const handleAddMemberToRoster = async () => {
    if (newMemberMode === "search" && !selectedUser) {
      toast.error("Please search and select a website user.");
      return;
    }
    if (newMemberMode === "manual" && !manualName.trim()) {
      toast.error("Please provide member name.");
      return;
    }
    if (!memberRole.trim()) {
      toast.error("Please specify a role / designation.");
      return;
    }

    const currentMembers = activeCommitteeDetail?.members || [];

    const newMemberObj: any = {
      name: newMemberMode === "search" ? selectedUser.fullName : manualName.trim(),
      role: memberRole.trim(),
      order: memberOrder,
      department: newMemberMode === "search" ? selectedUser.department || "CSE" : manualDept.trim(),
      batch: newMemberMode === "search" ? selectedUser.batch || "" : manualBatch.trim(),
      session: newMemberMode === "search" ? selectedUser.session || "" : manualSession.trim(),
      imageUrl: newMemberMode === "search" ? selectedUser.imageUrl || "" : manualImageUrl.trim(),
      imagePosition: newMemberMode === "search" ? selectedUser.imagePosition || "50% 50%" : manualImagePosition || "50% 50%",
      socialLinks: newMemberMode === "search" ? selectedUser.socialLinks || {} : {},
    };

    if (newMemberMode === "search") {
      newMemberObj.userId = selectedUser._id || selectedUser.id;
    }

    const updatedMembers = [...currentMembers, newMemberObj];

    setSavingRoster(true);
    try {
      const res = await axios.put(
        `${API}/committees/${activeCommitteeDetail._id}`,
        { members: updatedMembers },
        { withCredentials: true }
      );
      if (res.data?.success) {
        toast.success("Leader added to committee roster.");
        // Refresh active roster
        const refreshed = await axios.get(
          `${API}/committees/term/${encodeURIComponent(activeCommitteeDetail.term)}`,
          { withCredentials: true }
        );
        if (refreshed.data?.success) {
          setActiveCommitteeDetail(refreshed.data.data);
        }
        // Reset form
        setSelectedUser(null);
        setMemberSearchQuery("");
        setManualName("");
        setManualImageUrl("");
        setManualImagePosition("50% 50%");
        setMemberRole("Executive Member");
        fetchCommittees();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update committee roster.");
    } finally {
      setSavingRoster(false);
    }
  };

  const handleRemoveMemberFromRoster = async (indexOrId: string | number) => {
    if (!confirm("Are you sure you want to remove this member from the committee?")) return;

    const currentMembers = activeCommitteeDetail?.members || [];
    const updatedMembers = currentMembers.filter((m: any, idx: number) => {
      if (typeof indexOrId === "number") return idx !== indexOrId;
      return m.id !== indexOrId && m._id !== indexOrId;
    });

    setSavingRoster(true);
    try {
      await axios.put(
        `${API}/committees/${activeCommitteeDetail._id}`,
        { members: updatedMembers },
        { withCredentials: true }
      );
      toast.success("Member removed from committee.");
      const refreshed = await axios.get(
        `${API}/committees/term/${encodeURIComponent(activeCommitteeDetail.term)}`,
        { withCredentials: true }
      );
      if (refreshed.data?.success) {
        setActiveCommitteeDetail(refreshed.data.data);
      }
      fetchCommittees();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to remove member.");
    } finally {
      setSavingRoster(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Top Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-surface-primary border border-border-default shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <Calendar className="w-5 h-5 text-accent-primary" />
            Executive Committee Tenures &amp; Archives
          </h2>
          <p className="text-xs text-text-secondary mt-0.5 max-w-xl">
            Manage active executive panels and past committee archives. When a tenure concludes, historical designations remain permanently preserved.
          </p>
        </div>

        {isAdminUser && (
          <Button onClick={openCreateTermModal} size="sm" className="whitespace-nowrap flex items-center gap-1.5 self-start sm:self-auto">
            <Plus className="w-4 h-4" />
            Add New Tenure
          </Button>
        )}
      </div>

      {/* ── Committee Terms List ── */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <Loader2 className="w-7 h-7 mx-auto animate-spin text-accent-primary" />
          <p className="text-xs font-semibold text-text-secondary">Loading committee tenures...</p>
        </div>
      ) : committees.length === 0 ? (
        <div className="py-12 text-center space-y-2 border-2 border-dashed border-border-default rounded-2xl p-6 bg-surface-primary">
          <History className="w-8 h-8 mx-auto text-text-secondary opacity-40" />
          <h4 className="font-bold text-sm text-text-primary">No Committee Tenures Configured</h4>
          <p className="text-xs text-text-secondary">Click &quot;Add New Tenure&quot; above to create a committee session.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {committees.map((c) => (
            <div
              key={c._id}
              className={`p-5 rounded-2xl border-2 transition-all flex flex-col justify-between gap-4 bg-surface-primary ${
                c.isCurrent
                  ? "border-accent-primary shadow-[4px_4px_0px_0px_var(--accent-primary)]"
                  : "border-border-default hover:border-text-secondary shadow-xs"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 min-w-0">
                    <span className="text-[11px] font-mono font-bold text-text-secondary uppercase tracking-wider">
                      Term: {c.term}
                    </span>
                    <h3 className="font-bold text-text-primary text-base truncate">
                      {c.title}
                    </h3>
                  </div>

                  {c.isCurrent ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-accent-primary-light text-accent-primary border border-accent-primary/30 flex-shrink-0">
                      <Sparkles className="w-3 h-3" /> Current
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-surface-secondary text-text-secondary border border-border-default flex-shrink-0">
                      <History className="w-3 h-3" /> Archived
                    </span>
                  )}
                </div>

                {c.description && (
                  <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                    {c.description}
                  </p>
                )}

                <div className="flex items-center gap-2 pt-1 text-xs text-text-secondary">
                  <Users className="w-3.5 h-3.5 text-accent-primary" />
                  <span>
                    <strong className="text-text-primary">{c.memberCount}</strong> committee leaders registered
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-border-default flex items-center justify-between gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openRosterModal(c)}
                  className="text-xs flex-1 flex items-center justify-center gap-1"
                >
                  <Users className="w-3.5 h-3.5" />
                  Manage Roster ({c.memberCount})
                </Button>

                <div className="flex items-center gap-1">
                  {!c.isCurrent && isAdminUser && (
                    <button
                      type="button"
                      title="Set as Current Active Committee"
                      onClick={() => handleSetCurrent(c)}
                      className="p-1.5 rounded-lg border border-border-default hover:bg-accent-primary-light hover:text-accent-primary text-text-secondary transition cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}

                  {isAdminUser && (
                    <>
                      <button
                        type="button"
                        title="Edit Tenure Information"
                        onClick={() => openEditTermModal(c)}
                        className="p-1.5 rounded-lg border border-border-default hover:bg-surface-secondary text-text-secondary hover:text-text-primary transition cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        title="Delete Tenure"
                        onClick={() => handleDeleteTerm(c)}
                        className="p-1.5 rounded-lg border border-border-default hover:bg-red-50 dark:hover:bg-red-950/40 text-text-secondary hover:text-red-600 transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── MODAL: Create / Edit Committee Tenure ── */}
      {termModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-primary border-2 border-border-brutalist dark:border-border-default rounded-2xl shadow-[6px_6px_0px_0px_var(--border-brutalist)] w-full max-w-lg p-6 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-border-default">
              <h3 className="font-bold text-text-primary text-base flex items-center gap-2">
                <Calendar className="w-4 h-4 text-accent-primary" />
                {editingCommittee ? "Edit Committee Tenure" : "Create New Committee Tenure"}
              </h3>
              <button
                onClick={() => setTermModalOpen(false)}
                className="text-text-secondary hover:text-text-primary p-1 rounded-lg hover:bg-surface-secondary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTerm} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-primary">
                    Term Code: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2027-2028"
                    value={termName}
                    onChange={(e) => setTermName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-border-default bg-surface-secondary text-xs text-text-primary outline-none focus:ring-2 focus:ring-accent-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-text-primary">
                    Tenure Title: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Executive Committee 2027–2028"
                    value={termTitle}
                    onChange={(e) => setTermTitle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-border-default bg-surface-secondary text-xs text-text-primary outline-none focus:ring-2 focus:ring-accent-primary"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-text-primary">
                  Description / Theme:
                </label>
                <textarea
                  rows={3}
                  placeholder="Optional summary or motto of this committee panel..."
                  value={termDescription}
                  onChange={(e) => setTermDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-border-default bg-surface-secondary text-xs text-text-primary outline-none focus:ring-2 focus:ring-accent-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-text-primary">
                  Group Photograph URL (Optional):
                </label>
                <input
                  type="text"
                  placeholder="https://res.cloudinary.com/... or uploaded photo link"
                  value={termGroupPhoto}
                  onChange={(e) => setTermGroupPhoto(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-border-default bg-surface-secondary text-xs text-text-primary outline-none focus:ring-2 focus:ring-accent-primary"
                />
              </div>

              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termIsCurrent}
                  onChange={(e) => setTermIsCurrent(e.target.checked)}
                  className="rounded text-accent-primary focus:ring-accent-primary w-4 h-4 cursor-pointer"
                />
                <span className="text-xs font-bold text-text-primary">
                  Mark as Current Active Committee (switches previous term to archive)
                </span>
              </label>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border-default">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setTermModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={savingTerm}>
                  {savingTerm ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
                  Save Tenure
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: Manage Committee Roster / Members ── */}
      {rosterModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-surface-primary border-2 border-border-brutalist dark:border-border-default rounded-2xl shadow-[6px_6px_0px_0px_var(--border-brutalist)] w-full max-w-3xl max-h-[90vh] flex flex-col p-6 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-border-default flex-shrink-0">
              <div>
                <h3 className="font-bold text-text-primary text-base flex items-center gap-2">
                  <Users className="w-4 h-4 text-accent-primary" />
                  Roster: {activeCommitteeDetail?.title || "Committee Roster"}
                </h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  Term: <strong>{activeCommitteeDetail?.term}</strong> • {activeCommitteeDetail?.members?.length || 0} members
                </p>
              </div>
              <button
                onClick={() => setRosterModalOpen(false)}
                className="text-text-secondary hover:text-text-primary p-1 rounded-lg hover:bg-surface-secondary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-6">
              {/* Notice for Active Live Committee */}
              {activeCommitteeDetail?.isCurrent && (
                <div className="p-3.5 rounded-xl bg-accent-primary/10 border border-accent-primary/30 flex items-start gap-3 text-xs text-text-primary">
                  <Sparkles className="w-4 h-4 text-accent-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-text-primary mb-0.5">Active Live Executive Committee</span>
                    <p className="text-text-secondary leading-relaxed">
                      This tenure automatically mirrors all leaders assigned under the <strong>Executive Roles</strong> tab. You only need to add leaders here manually when documenting <strong>historical committee archives</strong> (such as 2025–2026, 2024–2025) or adding external non-registered members.
                    </p>
                  </div>
                </div>
              )}

              {/* Form to Add Leader */}
              <div className="p-4 rounded-xl border border-border-default bg-surface-secondary space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-text-primary uppercase tracking-wider">
                    Add Leader to this Committee
                  </h4>
                  <div className="flex items-center gap-1 bg-surface-primary p-1 rounded-lg border border-border-default text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => {
                        setNewMemberMode("search");
                        setSelectedUser(null);
                      }}
                      className={`px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
                        newMemberMode === "search"
                          ? "shadow-xs border border-border-default"
                          : "text-text-secondary hover:text-text-primary"
                      }`}
                      style={{
                        backgroundColor: newMemberMode === "search" ? "var(--accent-primary)" : "transparent",
                        color: newMemberMode === "search" ? "var(--accent-primary-text)" : "var(--text-secondary)",
                      }}
                    >
                      Website User
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setNewMemberMode("manual");
                        setSelectedUser(null);
                      }}
                      className={`px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
                        newMemberMode === "manual"
                          ? "shadow-xs border border-border-default"
                          : "text-text-secondary hover:text-text-primary"
                      }`}
                      style={{
                        backgroundColor: newMemberMode === "manual" ? "var(--accent-primary)" : "transparent",
                        color: newMemberMode === "manual" ? "var(--accent-primary-text)" : "var(--text-secondary)",
                      }}
                    >
                      Manual / Historical
                    </button>
                  </div>
                </div>

                {newMemberMode === "search" ? (
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-text-secondary" />
                      <input
                        type="text"
                        placeholder="Search active website user by name, email, or role..."
                        value={memberSearchQuery}
                        onChange={(e) => setMemberSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-8 py-2 rounded-xl border border-border-default bg-surface-primary text-xs text-text-primary outline-none focus:ring-2 focus:ring-accent-primary"
                      />
                      {searchingUsers && (
                        <Loader2 className="w-3.5 h-3.5 absolute right-3 top-2.5 animate-spin text-accent-primary" />
                      )}
                    </div>

                    {selectedUser ? (
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-primary border border-accent-primary/40 text-xs">
                        <div className="flex items-center gap-2">
                          <img
                            src={selectedUser.imageUrl || "/avatar-placeholder.png"}
                            alt=""
                            className="w-7 h-7 rounded-full object-cover border border-border-default"
                          />
                          <div>
                            <strong className="text-text-primary block">{selectedUser.fullName}</strong>
                            <p className="text-[11px] text-text-secondary">
                              {selectedUser.department} • {selectedUser.session || selectedUser.batch}
                              {selectedUser.designation ? ` • ${selectedUser.designation}` : ""}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedUser(null)}
                          className="text-xs text-red-500 font-bold hover:underline cursor-pointer"
                        >
                          Change
                        </button>
                      </div>
                    ) : userSearchResults.length > 0 ? (
                      <div className="max-h-48 overflow-y-auto divide-y divide-border-default border border-border-default rounded-xl bg-surface-primary shadow-sm">
                        {userSearchResults.map((u) => (
                          <div
                            key={u._id || u.id}
                            onClick={() => {
                              setSelectedUser(u);
                              if (u.designation && u.designation !== "General Member") {
                                setMemberRole(u.designation);
                              } else if (u.customRole && u.customRole !== "General Member") {
                                setMemberRole(u.customRole);
                              }
                              setUserSearchResults([]);
                            }}
                            className="p-2.5 hover:bg-accent-primary-light cursor-pointer flex items-center justify-between text-xs transition"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <img
                                src={u.imageUrl || "/avatar-placeholder.png"}
                                alt=""
                                className="w-6 h-6 rounded-full object-cover border border-border-default flex-shrink-0"
                              />
                              <div className="min-w-0">
                                <span className="font-bold text-text-primary block truncate">{u.fullName}</span>
                                <span className="text-[11px] text-text-secondary truncate block">{u.email || u.department}</span>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0 pl-2">
                              <span className="text-[11px] text-accent-primary font-semibold block">{u.designation || u.customRole || "Member"}</span>
                              <span className="text-[10px] text-text-secondary">{u.department} ({u.session || u.batch})</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : memberSearchQuery.trim() && !searchingUsers ? (
                      <div className="p-3 text-xs text-text-secondary text-center border border-border-default rounded-xl bg-surface-primary">
                        No registered website user found matching &quot;{memberSearchQuery}&quot;
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Full Name *"
                        value={manualName}
                        onChange={(e) => setManualName(e.target.value)}
                        className="px-3 py-1.5 rounded-xl border border-border-default bg-surface-primary text-xs text-text-primary outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Dept (e.g. CSE)"
                        value={manualDept}
                        onChange={(e) => setManualDept(e.target.value)}
                        className="px-3 py-1.5 rounded-xl border border-border-default bg-surface-primary text-xs text-text-primary outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Batch / Session"
                        value={manualBatch}
                        onChange={(e) => setManualBatch(e.target.value)}
                        className="px-3 py-1.5 rounded-xl border border-border-default bg-surface-primary text-xs text-text-primary outline-none"
                      />
                    </div>

                    {/* Profile Image Processing & Dropzone */}
                    <div className="space-y-2">
                      <UniversalImageDropzone
                        label="Leader Profile Photo (Auto-compressed to WebP)"
                        hint="Portrait image. Automatically optimized, compressed, and uploaded."
                        value={manualImageUrl}
                        onChange={(url) => setManualImageUrl(url)}
                        folder="uploads/users_pp"
                        imagePosition={manualImagePosition}
                        onClear={() => {
                          setManualImageUrl("");
                          setManualImagePosition("50% 50%");
                        }}
                      />

                      {manualImageUrl && (
                        <div className="flex items-center justify-between p-2 rounded-lg bg-surface-primary border border-border-default text-xs">
                          <span className="text-[11px] font-bold text-text-secondary">Face Focus / Position:</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setManualImagePosition("50% 20%")}
                              className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition ${
                                manualImagePosition === "50% 20%"
                                  ? "bg-accent-primary text-white border-transparent"
                                  : "border-border-default text-text-secondary hover:text-text-primary"
                              }`}
                            >
                              Top (Face)
                            </button>
                            <button
                              type="button"
                              onClick={() => setManualImagePosition("50% 50%")}
                              className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition ${
                                manualImagePosition === "50% 50%"
                                  ? "bg-accent-primary text-white border-transparent"
                                  : "border-border-default text-text-secondary hover:text-text-primary"
                              }`}
                            >
                              Center
                            </button>
                            <button
                              type="button"
                              onClick={() => setManualImagePosition("50% 35%")}
                              className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition ${
                                manualImagePosition === "50% 35%"
                                  ? "bg-accent-primary text-white border-transparent"
                                  : "border-border-default text-text-secondary hover:text-text-primary"
                              }`}
                            >
                              Upper 1/3
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-text-secondary">
                      Tenure Designation / Role:
                    </label>
                    <input
                      type="text"
                      value={memberRole}
                      onChange={(e) => setMemberRole(e.target.value)}
                      placeholder="e.g. President, General Secretary"
                      className="w-full px-3 py-1.5 rounded-xl border border-border-default bg-surface-primary text-xs text-text-primary outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-text-secondary">
                      Rank / Order (1=President, 2=GS, etc.):
                    </label>
                    <input
                      type="number"
                      value={memberOrder}
                      onChange={(e) => setMemberOrder(parseInt(e.target.value, 10) || 50)}
                      className="w-full px-3 py-1.5 rounded-xl border border-border-default bg-surface-primary text-xs text-text-primary outline-none"
                    />
                  </div>
                </div>

                <div className="text-right pt-2">
                  <Button
                    size="sm"
                    onClick={handleAddMemberToRoster}
                    disabled={savingRoster || (newMemberMode === "search" && !selectedUser) || (newMemberMode === "manual" && !manualName.trim())}
                  >
                    {savingRoster ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Plus className="w-3 h-3 mr-1" />}
                    Add to Committee
                  </Button>
                </div>
              </div>

              {/* Members List */}
              <div className="space-y-2">
                <h4 className="font-bold text-xs text-text-primary uppercase tracking-wider">
                  Current Committee Leaders ({activeCommitteeDetail?.members?.length || 0})
                </h4>

                {loadingRoster ? (
                  <div className="py-8 text-center text-xs text-text-secondary">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto text-accent-primary" />
                  </div>
                ) : (activeCommitteeDetail?.members || []).length === 0 ? (
                  <p className="text-xs text-text-secondary py-4 text-center">
                    No members assigned to this tenure yet.
                  </p>
                ) : (
                  <div className="divide-y divide-border-default border border-border-default rounded-xl bg-surface-primary overflow-hidden">
                    {activeCommitteeDetail.members.map((m: any, idx: number) => (
                      <div
                        key={m.id || m._id || idx}
                        className="p-3 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-6 h-6 rounded-full bg-surface-secondary text-text-secondary font-bold flex items-center justify-center text-[10px] flex-shrink-0">
                            #{m.order ?? idx + 1}
                          </span>
                          <img
                            src={m.image || m.imageUrl || "/avatar-placeholder.png"}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover border border-border-default flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <h5 className="font-bold text-text-primary truncate">{m.name}</h5>
                            <p className="text-[11px] text-accent-primary font-semibold">{m.role}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="text-[11px] text-text-secondary hidden sm:inline">
                            {m.department} {m.batch ? `(${m.batch})` : ""}
                          </span>
                          <button
                            type="button"
                            title="Remove leader"
                            onClick={() => handleRemoveMemberFromRoster(m.id || idx)}
                            className="p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-text-secondary hover:text-red-600 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-border-default flex justify-end flex-shrink-0">
              <Button size="sm" variant="outline" onClick={() => setRosterModalOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
