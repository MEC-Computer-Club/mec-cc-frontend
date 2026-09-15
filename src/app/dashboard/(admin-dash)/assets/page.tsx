"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Package,
  Plus,
  Search,
  RotateCcw,
  CheckCircle2,
  Clock,
  Building2,
  User,
  MapPin,
  Calendar,
  AlertTriangle,
  Edit2,
  Trash2,
  Layers,
  ArrowUpDown,
  Tag,
  X,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import FilterSelect, { FilterOption } from "@/app/dashboard/components/FilterSelect";
import { Select, SelectOption } from "@/components/ui/Select";
import { executives } from "@/data/executives";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";
import {
  BorrowedEquipment,
  ClubAsset,
  INITIAL_BORROWED_EQUIPMENT,
  INITIAL_CLUB_ASSETS,
  BorrowedItemStatus,
  ClubAssetStatus,
  AssetCondition,
} from "@/types/asset";
import { logAdminActivity } from "@/lib/auditLogger";

const STORAGE_KEY_BORROWED = "mec_cc_borrowed_equipment";
const STORAGE_KEY_CLUB = "mec_cc_club_assets";

export default function AssetsPage() {
  const { user } = useAuth();
  const currentActorName = user?.fullName || "Nasir";
  const currentActorRole = (user?.role === "admin" ? "admin" : "moderator") as "admin" | "moderator";
  const currentActorEmail = user?.email || "nasir.mec@gmail.com";

  // Tab State
  const [activeTab, setActiveTab] = useState<"borrowed" | "club">("borrowed");

  // Live Registered Executive / Admin Accounts from backend database
  const [liveExecutives, setLiveExecutives] = useState<{ name: string; role: string }[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function fetchLiveExecutives() {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/users/public/members`);
        if (res.data?.success && Array.isArray(res.data.data)) {
          const filtered = res.data.data
            .filter(
              (u: any) =>
                u.clubRole === "executive" ||
                u.role === "admin" ||
                u.role === "moderator" ||
                u.role === "executive"
            )
            .map((u: any) => ({
              name: u.fullName,
              role: u.designation || u.customRole || (u.role === "admin" ? "Executive (Admin)" : "Executive Member"),
            }));
          if (isMounted && filtered.length > 0) {
            setLiveExecutives(filtered);
          }
        }
      } catch (e) {
        console.warn("Could not load live executives from API, fallback to committee roster:", e);
      }
    }
    fetchLiveExecutives();
    return () => {
      isMounted = false;
    };
  }, []);

  // Data States
  const [borrowedItems, setBorrowedItems] = useState<BorrowedEquipment[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY_BORROWED);
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    return INITIAL_BORROWED_EQUIPMENT;
  });

  const [clubAssets, setClubAssets] = useState<ClubAsset[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY_CLUB);
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    return INITIAL_CLUB_ASSETS;
  });

  const [isLoaded, setIsLoaded] = useState(false);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Modal States
  const [isAddBorrowedOpen, setIsAddBorrowedOpen] = useState(false);
  const [isAddClubOpen, setIsAddClubOpen] = useState(false);
  const [editingBorrowed, setEditingBorrowed] = useState<BorrowedEquipment | null>(null);
  const [editingClub, setEditingClub] = useState<ClubAsset | null>(null);
  const [returningItem, setReturningItem] = useState<BorrowedEquipment | null>(null);
  const [returnNotes, setReturnNotes] = useState("");

  // Lock body scroll whenever ANY modal is active
  const isAnyModalOpen = Boolean(
    isAddBorrowedOpen || editingBorrowed || isAddClubOpen || editingClub || returningItem
  );

  useEffect(() => {
    if (isAnyModalOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isAnyModalOpen]);

  // Sync to localStorage on mount if not yet written
  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY_BORROWED)) {
        localStorage.setItem(STORAGE_KEY_BORROWED, JSON.stringify(INITIAL_BORROWED_EQUIPMENT));
      }
      if (!localStorage.getItem(STORAGE_KEY_CLUB)) {
        localStorage.setItem(STORAGE_KEY_CLUB, JSON.stringify(INITIAL_CLUB_ASSETS));
      }
    } catch (e) {
      console.error("Error setting initial assets to storage:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save changes to storage
  const saveBorrowed = useCallback((items: BorrowedEquipment[]) => {
    setBorrowedItems(items);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_BORROWED, JSON.stringify(items));
    }
  }, []);

  const saveClub = useCallback((items: ClubAsset[]) => {
    setClubAssets(items);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY_CLUB, JSON.stringify(items));
    }
  }, []);

  // Filter options
  const statusOptionsBorrowed: FilterOption[] = [
    { value: "all", label: "All Statuses" },
    { value: "In Use", label: "In Use" },
    { value: "Returned", label: "Returned" },
    { value: "Overdue", label: "Overdue" },
    { value: "Damaged", label: "Damaged" },
  ];

  const statusOptionsClub: FilterOption[] = [
    { value: "all", label: "All Statuses" },
    { value: "Available", label: "Available" },
    { value: "In Use", label: "In Use" },
    { value: "Maintenance", label: "Maintenance" },
    { value: "Retired", label: "Retired" },
  ];

  const categoryOptionsBorrowed: FilterOption[] = useMemo(() => {
    const cats = Array.from(new Set(borrowedItems.map((i) => i.category))).filter(Boolean);
    return [
      { value: "all", label: "All Categories" },
      ...cats.map((c) => ({ value: c, label: c })),
    ];
  }, [borrowedItems]);

  const categoryOptionsClub: FilterOption[] = useMemo(() => {
    const cats = Array.from(new Set(clubAssets.map((i) => i.category))).filter(Boolean);
    return [
      { value: "all", label: "All Categories" },
      ...cats.map((c) => ({ value: c, label: c })),
    ];
  }, [clubAssets]);

  // Filtered lists
  const filteredBorrowed = useMemo(() => {
    return borrowedItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.borrowedFrom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.borrowedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [borrowedItems, searchQuery, statusFilter, categoryFilter]);

  const filteredClub = useMemo(() => {
    return clubAssets.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.custodian.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [clubAssets, searchQuery, statusFilter, categoryFilter]);

  // Metrics summary
  const metrics = useMemo(() => {
    const borrowedInUse = borrowedItems.filter((i) => i.status === "In Use").length;
    const borrowedReturned = borrowedItems.filter((i) => i.status === "Returned").length;
    const totalBorrowedUnits = borrowedItems.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);
    const clubAvailable = clubAssets.filter((i) => i.status === "Available").length;
    const clubInUse = clubAssets.filter((i) => i.status === "In Use").length;
    const totalClubUnits = clubAssets.reduce((acc, curr) => acc + (Number(curr.quantity) || 0), 0);

    return {
      borrowedInUse,
      borrowedReturned,
      totalBorrowedUnits,
      clubAvailable,
      clubInUse,
      totalClubUnits,
    };
  }, [borrowedItems, clubAssets]);

  // Handle Quick Return of a borrowed equipment
  const handleConfirmReturn = () => {
    if (!returningItem) return;

    const previousStatus = returningItem.status;
    const previousReturnDate = returningItem.returnDate || "Not Returned";
    const previousLocation = returningItem.location;

    const todayStr = new Date().toISOString().split("T")[0];
    const updatedLocation = `${returningItem.borrowedFrom} (Returned)`;

    const updated = borrowedItems.map((item) => {
      if (item.id === returningItem.id) {
        return {
          ...item,
          status: "Returned" as BorrowedItemStatus,
          returnDate: todayStr,
          location: updatedLocation,
          notes: returnNotes
            ? `${item.notes ? item.notes + " | " : ""}Returned on ${todayStr}: ${returnNotes}`
            : item.notes,
          updatedAt: new Date().toISOString(),
        };
      }
      return item;
    });

    saveBorrowed(updated);

    // Audit log
    logAdminActivity({
      actorName: currentActorName,
      actorRole: currentActorRole,
      actorEmail: currentActorEmail,
      action: "STATUS_CHANGE",
      targetType: "ASSET",
      targetTitle: returningItem.name,
      description: `${currentActorName} marked borrowed asset '${returningItem.name}' as Returned to ${returningItem.borrowedFrom}. Previous version was '${previousStatus}'.`,
      diff: [
        { field: "Status", previousValue: previousStatus, newValue: "Returned" },
        { field: "Return Date", previousValue: previousReturnDate, newValue: todayStr },
        { field: "Location", previousValue: previousLocation, newValue: updatedLocation },
        ...(returnNotes ? [{ field: "Return Notes", previousValue: "N/A", newValue: returnNotes }] : []),
      ],
    });

    setReturningItem(null);
    setReturnNotes("");
  };

  // Delete Borrowed Item
  const handleDeleteBorrowed = (item: BorrowedEquipment) => {
    if (!confirm(`Are you sure you want to delete '${item.name}' from the borrowed inventory?`)) return;
    const updated = borrowedItems.filter((i) => i.id !== item.id);
    saveBorrowed(updated);

    logAdminActivity({
      actorName: currentActorName,
      actorRole: currentActorRole,
      actorEmail: currentActorEmail,
      action: "DELETE",
      targetType: "ASSET",
      targetTitle: item.name,
      description: `${currentActorName} deleted borrowed asset record '${item.name}' (Qty: ${item.quantity}, From: ${item.borrowedFrom}).`,
      diff: [
        { field: "Record Status", previousValue: "Active Record", newValue: "Deleted" },
        { field: "Previous State", previousValue: item.status, newValue: "N/A" },
      ],
    });
  };

  // Delete Club Asset
  const handleDeleteClub = (item: ClubAsset) => {
    if (!confirm(`Are you sure you want to delete '${item.name}' from club owned assets?`)) return;
    const updated = clubAssets.filter((i) => i.id !== item.id);
    saveClub(updated);

    logAdminActivity({
      actorName: currentActorName,
      actorRole: currentActorRole,
      actorEmail: currentActorEmail,
      action: "DELETE",
      targetType: "ASSET",
      targetTitle: item.name,
      description: `${currentActorName} deleted club asset '${item.name}' (Qty: ${item.quantity}).`,
      diff: [
        { field: "Record Status", previousValue: "Active Record", newValue: "Deleted" },
      ],
    });
  };

  return (
    <div className="space-y-6 pb-10 sm:pb-12">
      {/* ── Header & Tabs ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border-default pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-accent-primary flex items-center justify-center text-accent-primary-text font-black text-lg border border-border-brutalist shadow-[2px_2px_0px_var(--border-brutalist)]">
              <Package size={20} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
                Club Asset & Equipment Inventory
              </h1>
              <p className="text-xs sm:text-sm text-text-secondary font-mono mt-0.5">
                Track borrowed department assets and club-owned hardware & inventory
              </p>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-3">
          {activeTab === "borrowed" ? (
            <button
              onClick={() => setIsAddBorrowedOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent-primary text-accent-primary-text font-bold text-xs sm:text-sm border-2 border-text-primary dark:border-border-default shadow-[3px_3px_0px_var(--text-primary)] dark:shadow-[3px_3px_0px_var(--accent-primary)] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-0 active:translate-y-0 transition-all cursor-pointer"
            >
              <Plus size={16} />
              <span>Log Borrowed Equipment</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAddClubOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-accent-primary text-accent-primary-text font-bold text-xs sm:text-sm border-2 border-text-primary dark:border-border-default shadow-[3px_3px_0px_var(--text-primary)] dark:shadow-[3px_3px_0px_var(--accent-primary)] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-0 active:translate-y-0 transition-all cursor-pointer"
            >
              <Plus size={16} />
              <span>Add Club Asset</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Summary Stats Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-surface-elevated border border-border-default rounded-xl p-3.5 sm:p-4 shadow-[3px_3px_0px_var(--border-default)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-text-secondary uppercase">Borrowed In Use</span>
            <span className="w-2.5 h-2.5 rounded-full bg-accent-warning animate-pulse" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-text-primary">{metrics.borrowedInUse}</span>
            <span className="text-xs text-text-tertiary font-mono">items</span>
          </div>
          <p className="text-[11px] text-text-tertiary mt-1">Total {metrics.totalBorrowedUnits} physical units</p>
        </div>

        <div className="bg-surface-elevated border border-border-default rounded-xl p-3.5 sm:p-4 shadow-[3px_3px_0px_var(--border-default)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-text-secondary uppercase">Dept Returned</span>
            <CheckCircle2 size={15} className="text-accent-success" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-text-primary">{metrics.borrowedReturned}</span>
            <span className="text-xs text-text-tertiary font-mono">returned</span>
          </div>
          <p className="text-[11px] text-text-tertiary mt-1">Returned to department storage</p>
        </div>

        <div className="bg-surface-elevated border border-border-default rounded-xl p-3.5 sm:p-4 shadow-[3px_3px_0px_var(--border-default)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-text-secondary uppercase">Club Owned</span>
            <Layers size={15} className="text-accent-primary" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-text-primary">{clubAssets.length}</span>
            <span className="text-xs text-text-tertiary font-mono">categories</span>
          </div>
          <p className="text-[11px] text-text-tertiary mt-1">{metrics.totalClubUnits} club asset units</p>
        </div>

        <div className="bg-surface-elevated border border-border-default rounded-xl p-3.5 sm:p-4 shadow-[3px_3px_0px_var(--border-default)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-text-secondary uppercase">Club In-Use</span>
            <span className="w-2.5 h-2.5 rounded-full bg-accent-primary" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-text-primary">{metrics.clubInUse}</span>
            <span className="text-xs text-text-tertiary font-mono">assigned</span>
          </div>
          <p className="text-[11px] text-text-tertiary mt-1">{metrics.clubAvailable} available in storage</p>
        </div>
      </div>

      {/* ── Dual Tab Switcher ── */}
      <div className="flex items-center gap-2 border-b border-border-default pb-2">
        <button
          onClick={() => {
            setActiveTab("borrowed");
            setStatusFilter("all");
            setCategoryFilter("all");
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === "borrowed"
              ? "bg-text-primary text-surface-primary dark:bg-white dark:text-black shadow-[3px_3px_0px_var(--accent-primary)]"
              : "bg-surface-elevated text-text-secondary hover:text-text-primary border border-border-default hover:bg-surface-secondary"
          }`}
        >
          <Building2 size={16} />
          <span>Department Borrowed Equipment</span>
          <span
            className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
              activeTab === "borrowed"
                ? "bg-accent-primary text-black font-extrabold"
                : "bg-surface-secondary text-text-tertiary"
            }`}
          >
            {borrowedItems.length}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveTab("club");
            setStatusFilter("all");
            setCategoryFilter("all");
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeTab === "club"
              ? "bg-text-primary text-surface-primary dark:bg-white dark:text-black shadow-[3px_3px_0px_var(--accent-primary)]"
              : "bg-surface-elevated text-text-secondary hover:text-text-primary border border-border-default hover:bg-surface-secondary"
          }`}
        >
          <Package size={16} />
          <span>Club Owned Assets</span>
          <span
            className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
              activeTab === "club"
                ? "bg-accent-primary text-black font-extrabold"
                : "bg-surface-secondary text-text-tertiary"
            }`}
          >
            {clubAssets.length}
          </span>
        </button>
      </div>

      {/* ── Search & Filters Bar (Using Neo-Brutalist FilterSelect) ── */}
      <div className="bg-surface-elevated border border-border-default rounded-xl p-4 shadow-[4px_4px_0px_var(--border-default)] flex flex-col md:flex-row gap-3 md:items-center justify-between">
        {/* Search input */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary" />
          <input
            type="text"
            placeholder={
              activeTab === "borrowed"
                ? "Search by item, department, borrower, room location..."
                : "Search by asset name, category, notes..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-surface-primary border border-border-default text-text-primary text-xs sm:text-sm placeholder:text-text-tertiary focus:outline-none focus:border-accent-primary focus:shadow-[2px_2px_0px_var(--accent-primary)]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Dropdown Filters using custom Neo-Brutalist FilterSelect */}
        <div className="flex flex-wrap items-center gap-2.5">
          <FilterSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={activeTab === "borrowed" ? statusOptionsBorrowed : statusOptionsClub}
            placeholder="Status"
          />

          <FilterSelect
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={activeTab === "borrowed" ? categoryOptionsBorrowed : categoryOptionsClub}
            placeholder="Category"
          />

          {(searchQuery || statusFilter !== "all" || categoryFilter !== "all") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setCategoryFilter("all");
              }}
              className="px-3 py-1.5 text-xs font-mono font-bold text-text-secondary hover:text-accent-error transition cursor-pointer flex items-center gap-1"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Data Tables ── */}
      {activeTab === "borrowed" ? (
        /* ================= TAB 1: BORROWED EQUIPMENT ================= */
        <div className="bg-surface-elevated border border-border-default rounded-xl shadow-[4px_4px_0px_var(--border-default)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1020px]">
              <thead>
                <tr className="bg-surface-secondary border-b border-border-default font-mono text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                  <th className="py-3 px-4 min-w-[240px]">Item & Quantity</th>
                  <th className="py-3 px-4 min-w-[180px] whitespace-nowrap">Borrowed From</th>
                  <th className="py-3 px-4 min-w-[210px] whitespace-nowrap">Borrowed By</th>
                  <th className="py-3 px-4 min-w-[190px] whitespace-nowrap">Borrow & Due Dates</th>
                  {/* Location column hidden for now per user request */}
                  <th className="py-3 px-4 min-w-[120px] whitespace-nowrap">Status</th>
                  <th className="py-3 px-4 min-w-[90px] whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default text-xs sm:text-sm">
                {filteredBorrowed.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-text-tertiary">
                      <Package size={36} className="mx-auto mb-2 opacity-40" />
                      <p className="font-semibold text-text-secondary">No borrowed equipment found</p>
                      <p className="text-xs mt-1">Try adjusting your search or filters</p>
                    </td>
                  </tr>
                ) : (
                  filteredBorrowed.map((item) => (
                    <tr key={item.id} className="hover:bg-surface-secondary/60 transition-colors">
                      {/* Name & Quantity */}
                      <td className="py-3.5 px-4 min-w-[240px]">
                        <div className="font-bold text-text-primary flex items-center gap-2 text-xs sm:text-sm">
                          <span className="leading-snug">{item.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-accent-primary/15 text-text-primary dark:text-white rounded-md font-extrabold border border-accent-primary/30 shrink-0">
                            ×{item.quantity}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-text-tertiary font-mono mt-1 whitespace-nowrap">
                          <span className="px-1.5 py-0.5 rounded bg-surface-secondary border border-border-default font-semibold text-text-secondary">
                            {item.category}
                          </span>
                          <span>•</span>
                          <span className="capitalize">{item.condition} condition</span>
                        </div>
                        {item.notes && (
                          <p className="text-[11px] text-text-tertiary line-clamp-1 mt-1 italic">
                            &ldquo;{item.notes}&rdquo;
                          </p>
                        )}
                      </td>

                      {/* Borrowed From (Person Name like Monir Vai) */}
                      <td className="py-3.5 px-4 font-medium text-text-secondary whitespace-nowrap min-w-[180px]">
                        {(() => {
                          const match = item.borrowedFrom.match(/^([^(]+)(?:\((.*)\))?$/);
                          const pName = match ? match[1].trim() : item.borrowedFrom;
                          const pRole = match && match[2] ? match[2].trim() : null;
                          return (
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-lg bg-surface-secondary border border-border-default flex items-center justify-center text-text-secondary shadow-[1px_1px_0px_var(--border-default)] shrink-0">
                                <User size={13} />
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-text-primary text-xs sm:text-sm whitespace-nowrap">
                                  {pName}
                                </div>
                                {pRole && (
                                  <span className="inline-block text-[10px] font-mono text-text-tertiary whitespace-nowrap">
                                    {pRole}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })()}
                      </td>

                      {/* Borrowed By (Executive Member Account) */}
                      <td className="py-3.5 px-4 font-medium text-text-secondary whitespace-nowrap min-w-[210px]">
                        {(() => {
                          const match = item.borrowedBy.match(/^([^(]+)(?:\((.*)\))?$/);
                          const bName = match ? match[1].trim() : item.borrowedBy;
                          const bRole = match && match[2] ? match[2].trim() : null;
                          const initial = bName ? bName.charAt(0).toUpperCase() : "E";

                          return (
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-lg bg-accent-primary/20 border border-accent-primary/40 flex items-center justify-center font-mono font-black text-xs text-text-primary dark:text-white shadow-[1px_1px_0px_var(--border-default)] shrink-0">
                                {initial}
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-text-primary text-xs sm:text-sm whitespace-nowrap">
                                  {bName}
                                </div>
                                {bRole && (
                                  <span className="inline-block text-[10px] font-mono px-1.5 py-0.2 rounded bg-surface-secondary text-text-secondary border border-border-default/70 mt-0.5 whitespace-nowrap">
                                    {bRole}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })()}
                      </td>

                      {/* Dates */}
                      <td className="py-3.5 px-4 font-mono text-xs text-text-secondary whitespace-nowrap min-w-[190px]">
                        <div className="flex flex-col gap-1 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-text-secondary whitespace-nowrap">
                            <Calendar size={13} className="text-text-tertiary shrink-0" />
                            <span className="text-text-tertiary text-[11px]">Borrowed:</span>
                            <span className="font-semibold text-text-primary text-xs">{item.borrowDate}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-text-secondary whitespace-nowrap">
                            <Clock size={13} className="text-text-tertiary shrink-0" />
                            <span className="text-text-tertiary text-[11px]">Due:</span>
                            <span className="font-semibold text-text-primary text-xs">{item.dueDate}</span>
                          </div>
                          {item.returnDate && (
                            <div className="inline-flex items-center gap-1.5 text-[11px] text-accent-success font-bold mt-0.5 whitespace-nowrap">
                              <CheckCircle2 size={12} className="shrink-0" />
                              <span>Returned: {item.returnDate}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Location column hidden for now */}

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap min-w-[120px]">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold font-mono whitespace-nowrap ${
                            item.status === "In Use"
                              ? "bg-accent-primary/20 text-text-primary dark:text-white border border-accent-primary"
                              : item.status === "Returned"
                              ? "bg-accent-success/20 text-accent-success border border-accent-success"
                              : item.status === "Damaged"
                              ? "bg-accent-error/20 text-accent-error border border-accent-error"
                              : "bg-surface-secondary text-text-secondary border border-border-default"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              item.status === "In Use"
                                ? "bg-accent-primary"
                                : item.status === "Returned"
                                ? "bg-accent-success"
                                : item.status === "Damaged"
                                ? "bg-accent-error"
                                : "bg-text-tertiary"
                            }`}
                          />
                          <span>{item.status}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap min-w-[90px]">
                        <div className="flex items-center justify-end gap-1.5">
                          {item.status === "In Use" && (
                            <button
                              onClick={() => {
                                setReturningItem(item);
                                setReturnNotes("");
                              }}
                              className="px-2.5 py-1 rounded-md bg-accent-success/15 hover:bg-accent-success/30 text-accent-success font-bold text-xs border border-accent-success transition cursor-pointer"
                              title="Mark as Returned to Department"
                            >
                              Return
                            </button>
                          )}
                          <button
                            onClick={() => setEditingBorrowed(item)}
                            className="p-1.5 rounded-md hover:bg-surface-secondary text-text-tertiary hover:text-text-primary border border-transparent hover:border-border-default transition cursor-pointer"
                            title="Edit Record"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteBorrowed(item)}
                            className="p-1.5 rounded-md hover:bg-accent-error/15 text-text-tertiary hover:text-accent-error border border-transparent hover:border-accent-error/30 transition cursor-pointer"
                            title="Delete Record"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Table Bottom Status Footer */}
          <div className="py-3 px-4 bg-surface-secondary/40 border-t border-border-default flex items-center justify-between text-xs font-mono text-text-tertiary">
            <span>Showing {filteredBorrowed.length} of {borrowedItems.length} borrowed items</span>
            <span className="hidden sm:inline">End of borrowed list</span>
          </div>
        </div>
      ) : (
        /* ================= TAB 2: CLUB OWNED ASSETS ================= */
        <div className="bg-surface-elevated border border-border-default rounded-xl shadow-[4px_4px_0px_var(--border-default)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[850px]">
              <thead>
                <tr className="bg-surface-secondary border-b border-border-default font-mono text-[11px] font-bold text-text-secondary uppercase tracking-wider">
                  <th className="py-3 px-4 min-w-[260px]">Asset & Qty</th>
                  <th className="py-3 px-4 min-w-[150px] whitespace-nowrap">Category</th>
                  {/* Custodian and Storage Location columns hidden for now per user request */}
                  <th className="py-3 px-4 min-w-[160px] whitespace-nowrap">Condition & Value</th>
                  <th className="py-3 px-4 min-w-[120px] whitespace-nowrap">Status</th>
                  <th className="py-3 px-4 min-w-[90px] whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default text-xs sm:text-sm">
                {filteredClub.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-text-tertiary">
                      <Package size={36} className="mx-auto mb-2 opacity-40" />
                      <p className="font-semibold text-text-secondary">No club assets found</p>
                      <p className="text-xs mt-1">Try adjusting your search or filters</p>
                    </td>
                  </tr>
                ) : (
                  filteredClub.map((asset) => (
                    <tr key={asset.id} className="hover:bg-surface-secondary/60 transition-colors">
                      {/* Name & Qty */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-text-primary flex items-center gap-2 text-xs sm:text-sm">
                          <span>{asset.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-accent-primary/15 text-text-primary dark:text-white rounded-md font-extrabold border border-accent-primary/30">
                            ×{asset.quantity}
                          </span>
                        </div>
                        <div className="text-[11px] text-text-tertiary font-mono mt-1 flex items-center gap-1.5">
                          <Calendar size={12} className="text-text-tertiary shrink-0" />
                          <span>Acquired: {asset.acquisitionDate}</span>
                        </div>
                        {asset.notes && (
                          <p className="text-[11px] text-text-tertiary line-clamp-1 mt-1 italic">
                            &ldquo;{asset.notes}&rdquo;
                          </p>
                        )}
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 font-medium text-text-secondary">
                        <span className="px-2 py-0.5 rounded-md bg-surface-secondary text-xs font-mono font-semibold border border-border-default">
                          {asset.category}
                        </span>
                      </td>

                      {/* Custodian & Storage Location hidden for now */}

                      {/* Condition & Value */}
                      <td className="py-3.5 px-4 font-mono text-xs text-text-secondary">
                        <div>
                          <span className="capitalize font-bold text-text-primary">{asset.condition}</span>
                          {asset.estimatedValue && (
                            <span className="text-text-tertiary block text-[11px] font-semibold mt-0.5">
                              {asset.estimatedValue}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold font-mono ${
                            asset.status === "Available"
                              ? "bg-accent-success/20 text-accent-success border border-accent-success"
                              : asset.status === "In Use"
                              ? "bg-accent-primary/20 text-text-primary dark:text-white border border-accent-primary"
                              : "bg-surface-secondary text-text-secondary border border-border-default"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              asset.status === "Available"
                                ? "bg-accent-success"
                                : asset.status === "In Use"
                                ? "bg-accent-primary"
                                : "bg-text-tertiary"
                            }`}
                          />
                          <span>{asset.status}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditingClub(asset)}
                            className="p-1.5 rounded-md hover:bg-surface-secondary text-text-tertiary hover:text-text-primary border border-transparent hover:border-border-default transition cursor-pointer"
                            title="Edit Asset"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteClub(asset)}
                            className="p-1.5 rounded-md hover:bg-accent-error/15 text-text-tertiary hover:text-accent-error border border-transparent hover:border-accent-error/30 transition cursor-pointer"
                            title="Delete Asset"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Table Bottom Status Footer */}
          <div className="py-3 px-4 bg-surface-secondary/40 border-t border-border-default flex items-center justify-between text-xs font-mono text-text-tertiary">
            <span>Showing {filteredClub.length} of {clubAssets.length} assets</span>
            <span className="hidden sm:inline">End of inventory list</span>
          </div>
        </div>
      )}

      {/* ================= MODAL: QUICK RETURN ================= */}
      {returningItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150 overflow-hidden">
          <div
            className="w-full max-w-md bg-surface-elevated border-2 border-text-primary dark:border-border-default rounded-xl shadow-[4px_4px_0px_var(--accent-primary)] overflow-hidden flex flex-col my-auto"
            style={{ maxHeight: "calc(100dvh - 3rem)" }}
          >
            <div className="p-4 border-b border-border-default flex items-center justify-between bg-surface-secondary shrink-0">
              <div className="flex items-center gap-2">
                <RotateCcw size={18} className="text-accent-success" />
                <h3 className="font-black text-text-primary text-base">Return Equipment to Department</h3>
              </div>
              <button
                onClick={() => setReturningItem(null)}
                className="p-1 rounded-md text-text-tertiary hover:text-text-primary cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 min-h-0 overscroll-contain">
              <div className="bg-surface-primary p-3 rounded-lg border border-border-default text-xs space-y-1">
                <div className="font-bold text-text-primary text-sm">{returningItem.name}</div>
                <div className="text-text-secondary">Quantity: {returningItem.quantity} units</div>
                <div className="text-text-secondary">Borrowed From: {returningItem.borrowedFrom}</div>
                <div className="text-text-secondary">Borrowed By: {returningItem.borrowedBy}</div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-text-secondary uppercase mb-1.5">
                  Return Verification Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g., Handed over to Mr. X in CSE Dept Lab in working condition."
                  value={returnNotes}
                  onChange={(e) => setReturnNotes(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-surface-primary border border-border-default text-xs sm:text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-primary"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 p-3 sm:p-4 border-t border-border-default bg-surface-secondary/40 shrink-0">
              <button
                type="button"
                onClick={() => setReturningItem(null)}
                className="px-4 py-2 rounded-lg bg-surface-secondary text-text-secondary font-bold text-xs hover:bg-surface-elevated transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReturn}
                className="px-4 py-2 rounded-lg bg-accent-success text-white font-bold text-xs shadow-[2px_2px_0px_var(--text-primary)] hover:translate-x-0.5 hover:translate-y-0.5 transition cursor-pointer"
              >
                Confirm Return
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT BORROWED ITEM ================= */}
      {(isAddBorrowedOpen || editingBorrowed) && (
        <BorrowedEquipmentModal
          initialData={editingBorrowed}
          liveExecutives={liveExecutives}
          onClose={() => {
            setIsAddBorrowedOpen(false);
            setEditingBorrowed(null);
          }}
          onSave={(item) => {
            if (editingBorrowed) {
              // Edit flow
              const previous = editingBorrowed;
              const updated = borrowedItems.map((i) => (i.id === item.id ? item : i));
              saveBorrowed(updated);

              // Generate diff
              const diffItems = [];
              if (previous.status !== item.status)
                diffItems.push({ field: "Status", previousValue: previous.status, newValue: item.status });
              if (previous.quantity !== item.quantity)
                diffItems.push({ field: "Quantity", previousValue: previous.quantity, newValue: item.quantity });
              if (previous.location !== item.location)
                diffItems.push({ field: "Location", previousValue: previous.location, newValue: item.location });
              if (previous.borrowedBy !== item.borrowedBy)
                diffItems.push({ field: "Borrowed By", previousValue: previous.borrowedBy, newValue: item.borrowedBy });

              logAdminActivity({
                actorName: currentActorName,
                actorRole: currentActorRole,
                actorEmail: currentActorEmail,
                action: "UPDATE",
                targetType: "ASSET",
                targetTitle: item.name,
                description: `${currentActorName} modified borrowed equipment '${item.name}' details.`,
                diff: diffItems.length > 0 ? diffItems : [{ field: "Details", previousValue: "Modified", newValue: "Saved" }],
              });
            } else {
              // Add flow
              const updated = [item, ...borrowedItems];
              saveBorrowed(updated);

              logAdminActivity({
                actorName: currentActorName,
                actorRole: currentActorRole,
                actorEmail: currentActorEmail,
                action: "CREATE",
                targetType: "ASSET",
                targetTitle: item.name,
                description: `${currentActorName} logged new borrowed equipment '${item.name}' (Qty: ${item.quantity}) from ${item.borrowedFrom}.`,
                diff: [
                  { field: "Status", previousValue: "N/A", newValue: item.status },
                  { field: "Quantity", previousValue: "0", newValue: String(item.quantity) },
                  { field: "Borrowed By", previousValue: "N/A", newValue: item.borrowedBy },
                  { field: "Location", previousValue: "N/A", newValue: item.location },
                ],
              });
            }
            setIsAddBorrowedOpen(false);
            setEditingBorrowed(null);
          }}
        />
      )}

      {/* ================= MODAL: ADD / EDIT CLUB ASSET ================= */}
      {(isAddClubOpen || editingClub) && (
        <ClubAssetModal
          initialData={editingClub}
          onClose={() => {
            setIsAddClubOpen(false);
            setEditingClub(null);
          }}
          onSave={(asset) => {
            if (editingClub) {
              // Edit flow
              const previous = editingClub;
              const updated = clubAssets.map((a) => (a.id === asset.id ? asset : a));
              saveClub(updated);

              const diffItems = [];
              if (previous.status !== asset.status)
                diffItems.push({ field: "Status", previousValue: previous.status, newValue: asset.status });
              if (previous.custodian !== asset.custodian)
                diffItems.push({ field: "Custodian", previousValue: previous.custodian, newValue: asset.custodian });
              if (previous.location !== asset.location)
                diffItems.push({ field: "Location", previousValue: previous.location, newValue: asset.location });

              logAdminActivity({
                actorName: currentActorName,
                actorRole: currentActorRole,
                actorEmail: currentActorEmail,
                action: "UPDATE",
                targetType: "ASSET",
                targetTitle: asset.name,
                description: `${currentActorName} updated club asset '${asset.name}'.`,
                diff: diffItems.length > 0 ? diffItems : [{ field: "Details", previousValue: "Old", newValue: "New" }],
              });
            } else {
              // Add flow
              const updated = [asset, ...clubAssets];
              saveClub(updated);

              logAdminActivity({
                actorName: currentActorName,
                actorRole: currentActorRole,
                actorEmail: currentActorEmail,
                action: "CREATE",
                targetType: "ASSET",
                targetTitle: asset.name,
                description: `${currentActorName} added new club asset '${asset.name}' (Qty: ${asset.quantity}).`,
                diff: [
                  { field: "Custodian", previousValue: "N/A", newValue: asset.custodian },
                  { field: "Quantity", previousValue: "0", newValue: String(asset.quantity) },
                  { field: "Status", previousValue: "N/A", newValue: asset.status },
                ],
              });
            }
            setIsAddClubOpen(false);
            setEditingClub(null);
          }}
        />
      )}
    </div>
  );
}

/* ========================================================================= */
/*  Subcomponent: BorrowedEquipmentModal                                      */
/* ========================================================================= */
function BorrowedEquipmentModal({
  initialData,
  liveExecutives,
  onClose,
  onSave,
}: {
  initialData: BorrowedEquipment | null;
  liveExecutives?: { name: string; role: string }[];
  onClose: () => void;
  onSave: (item: BorrowedEquipment) => void;
}) {
  const { user } = useAuth();

  const availableExecutives = liveExecutives && liveExecutives.length > 0 ? liveExecutives : executives;

  const executiveOptions: SelectOption[] = useMemo(() => {
    const list: SelectOption[] = availableExecutives.map((exec) => ({
      value: `${exec.name} (${exec.role})`,
      label: `${exec.name} — ${exec.role}`,
    }));
    if (initialData?.borrowedBy && !list.some((o) => o.value === initialData.borrowedBy)) {
      list.unshift({ value: initialData.borrowedBy, label: initialData.borrowedBy });
    }
    return list;
  }, [availableExecutives, initialData]);

  const defaultBorrower = useMemo(() => {
    if (initialData?.borrowedBy) return initialData.borrowedBy;
    const match = availableExecutives.find(
      (e) =>
        user?.fullName &&
        (e.name.toLowerCase().includes(user.fullName.toLowerCase()) ||
          user.fullName.toLowerCase().includes(e.name.toLowerCase()))
    );
    return match ? `${match.name} (${match.role})` : `${availableExecutives[0]?.name || "Executive"} (${availableExecutives[0]?.role || "In Charge"})`;
  }, [availableExecutives, initialData, user]);

  const [name, setName] = useState(initialData?.name || "");
  const [category, setCategory] = useState(initialData?.category || "Networking");
  const [quantity, setQuantity] = useState(initialData?.quantity || 1);
  const [borrowedFrom, setBorrowedFrom] = useState(initialData?.borrowedFrom || "Monir Vai (Lab Attendant)");
  const [borrowedBy, setBorrowedBy] = useState(defaultBorrower);

  useEffect(() => {
    if (!initialData?.borrowedBy && defaultBorrower) {
      setBorrowedBy(defaultBorrower);
    }
  }, [defaultBorrower, initialData]);
  const [borrowDate, setBorrowDate] = useState(initialData?.borrowDate || new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState(initialData?.dueDate || "Permanent Borrow");
  const [location, setLocation] = useState(initialData?.location || "Club Room 302");
  const [status, setStatus] = useState<BorrowedItemStatus>(initialData?.status || "In Use");
  const [condition, setCondition] = useState<AssetCondition>(initialData?.condition || "Good");
  const [notes, setNotes] = useState(initialData?.notes || "");

  const categoryOptions: SelectOption[] = [
    { value: "Networking", label: "Networking (Routers, Switches)" },
    { value: "Electrical", label: "Electrical (Multiplugs, Adapters)" },
    { value: "Furniture", label: "Furniture (Chairs, Tables)" },
    { value: "Teaching Aid", label: "Teaching Aid (Whiteboards, Markers)" },
    { value: "Audio/Visual", label: "Audio/Visual (Projectors, Sound)" },
    { value: "Computer Lab Hardware", label: "Computer Lab Hardware" },
  ];

  const statusOptions: SelectOption[] = [
    { value: "In Use", label: "In Use (Active in Club Room)" },
    { value: "Returned", label: "Returned to Department" },
    { value: "Overdue", label: "Overdue" },
    { value: "Damaged", label: "Damaged / Needs Repair" },
  ];

  const conditionOptions: SelectOption[] = [
    { value: "New", label: "New" },
    { value: "Excellent", label: "Excellent" },
    { value: "Good", label: "Good" },
    { value: "Fair", label: "Fair" },
    { value: "Damaged", label: "Damaged" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please provide an item name.");
      return;
    }

    onSave({
      id: initialData?.id || `dept-eq-${Date.now()}`,
      name: name.trim(),
      category,
      quantity: Number(quantity) || 1,
      borrowedFrom: borrowedFrom.trim(),
      borrowedBy: borrowedBy.trim(),
      borrowDate,
      dueDate,
      returnDate: status === "Returned" ? initialData?.returnDate || new Date().toISOString().split("T")[0] : undefined,
      location: location.trim(),
      status,
      condition,
      notes: notes.trim(),
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150 overflow-hidden">
      <div
        className="w-full max-w-xl bg-surface-elevated border-2 border-text-primary dark:border-border-default rounded-xl shadow-[4px_4px_0px_var(--accent-primary)] overflow-hidden flex flex-col my-auto"
        style={{ maxHeight: "calc(100dvh - 3rem)" }}
      >
        <div className="p-3.5 sm:p-4 border-b border-border-default flex items-center justify-between bg-surface-secondary shrink-0">
          <div className="flex items-center gap-2">
            <Building2 size={18} className="text-accent-primary" />
            <h3 className="font-black text-text-primary text-base">
              {initialData ? "Edit Borrowed Equipment" : "Log Borrowed Department Equipment"}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-text-tertiary hover:text-text-primary cursor-pointer">
            <X size={16} />
          </button>
        </div>

        <form
          id="borrowed-equipment-form"
          onSubmit={handleSubmit}
          className="p-4 sm:p-5 space-y-3.5 overflow-y-auto flex-1 min-h-0 overscroll-contain"
        >
          {/* Item Name */}
          <div>
            <label className="block text-xs font-mono font-bold text-text-secondary uppercase mb-1">
              Item Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., TP-Link Gigabit Router / Heavy Duty Multiplug"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-surface-primary border border-border-default text-xs sm:text-sm text-text-primary focus:outline-none focus:border-accent-primary"
            />
          </div>

          {/* Category & Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-bold text-text-secondary uppercase mb-1">
                Category
              </label>
              <Select value={category} onChange={setCategory} options={categoryOptions} />
            </div>
            <div>
              <label className="block text-xs font-mono font-bold text-text-secondary uppercase mb-1">
                Quantity
              </label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full p-2.5 rounded-lg bg-surface-primary border border-border-default text-xs sm:text-sm text-text-primary focus:outline-none focus:border-accent-primary"
              />
            </div>
          </div>

          {/* Borrowed From & Borrowed By */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-bold text-text-secondary uppercase mb-1">
                Borrowed From (Person / Staff) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Monir Vai (Lab Attendant) / Dulal Sir"
                value={borrowedFrom}
                onChange={(e) => setBorrowedFrom(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-surface-primary border border-border-default text-xs sm:text-sm text-text-primary focus:outline-none focus:border-accent-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-bold text-text-secondary uppercase mb-1">
                Borrowed By (Executive Member) *
              </label>
              <Select
                id="borrowed-by-select"
                value={borrowedBy}
                onChange={setBorrowedBy}
                options={executiveOptions}
                placeholder="Select Executive Member..."
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-bold text-text-secondary uppercase mb-1">
                Borrow Date
              </label>
              <input
                type="date"
                value={borrowDate}
                onChange={(e) => setBorrowDate(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-surface-primary border border-border-default text-xs sm:text-sm text-text-primary focus:outline-none focus:border-accent-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-bold text-text-secondary uppercase mb-1">
                Due Date / Terms
              </label>
              <input
                type="text"
                placeholder="e.g., Permanent Borrow / 2024-12-31"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-surface-primary border border-border-default text-xs sm:text-sm text-text-primary focus:outline-none focus:border-accent-primary"
              />
            </div>
          </div>

          {/* Status (Location and Condition hidden per user request) */}
          <div>
            <label className="block text-xs font-mono font-bold text-text-secondary uppercase mb-1">
              Current Status
            </label>
            <Select value={status} onChange={(v) => setStatus(v as BorrowedItemStatus)} options={statusOptions} />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-mono font-bold text-text-secondary uppercase mb-1">
              Remarks & Notes
            </label>
            <textarea
              rows={2}
              placeholder="e.g. For weekly algorithm training and contest local network."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-surface-primary border border-border-default text-xs sm:text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-primary"
            />
          </div>
        </form>

        {/* Pinned Fixed Footer */}
        <div className="flex items-center justify-end gap-2.5 p-3 sm:p-4 border-t border-border-default bg-surface-secondary/40 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-surface-secondary text-text-secondary font-bold text-xs hover:bg-surface-elevated transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="borrowed-equipment-form"
            className="px-5 py-2 rounded-lg bg-accent-primary text-accent-primary-text font-bold text-xs border-2 border-text-primary dark:border-border-default shadow-[3px_3px_0px_var(--text-primary)] dark:shadow-[3px_3px_0px_var(--accent-primary)] hover:translate-x-0.5 hover:translate-y-0.5 transition cursor-pointer"
          >
            {initialData ? "Save Changes" : "Create Record"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================= */
/*  Subcomponent: ClubAssetModal                                              */
/* ========================================================================= */
function ClubAssetModal({
  initialData,
  onClose,
  onSave,
}: {
  initialData: ClubAsset | null;
  onClose: () => void;
  onSave: (asset: ClubAsset) => void;
}) {
  const [name, setName] = useState(initialData?.name || "");
  const [category, setCategory] = useState(initialData?.category || "Electronics");
  const [quantity, setQuantity] = useState(initialData?.quantity || 1);
  const [acquisitionDate, setAcquisitionDate] = useState(
    initialData?.acquisitionDate || new Date().toISOString().split("T")[0]
  );
  const [custodian, setCustodian] = useState(initialData?.custodian || "Club Room 302");
  const [location, setLocation] = useState(initialData?.location || "Club Room 302");
  const [status, setStatus] = useState<ClubAssetStatus>(initialData?.status || "Available");
  const [condition, setCondition] = useState<AssetCondition>(initialData?.condition || "Good");
  const [estimatedValue, setEstimatedValue] = useState(initialData?.estimatedValue || "৳ ");
  const [notes, setNotes] = useState(initialData?.notes || "");

  const categoryOptions: SelectOption[] = [
    { value: "Electronics", label: "Electronics (Arduino, Microcontrollers)" },
    { value: "Security", label: "Security (Locks, Keys, Padlocks)" },
    { value: "Office Supplies", label: "Office Supplies (File Holders, Folders)" },
    { value: "Tools", label: "Tools (Soldering, Multimeter, Hardware)" },
    { value: "Branding", label: "Branding (Banners, Backdrops, Posters)" },
    { value: "Merchandise", label: "Merchandise (T-Shirts, Badges, Stickers)" },
  ];

  const statusOptions: SelectOption[] = [
    { value: "Available", label: "Available (In Storage)" },
    { value: "In Use", label: "In Use (Assigned / Deployed)" },
    { value: "Maintenance", label: "Maintenance / Servicing" },
    { value: "Retired", label: "Retired / Deprecated" },
  ];

  const conditionOptions: SelectOption[] = [
    { value: "New", label: "New" },
    { value: "Excellent", label: "Excellent" },
    { value: "Good", label: "Good" },
    { value: "Fair", label: "Fair" },
    { value: "Damaged", label: "Damaged" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please provide asset name.");
      return;
    }

    onSave({
      id: initialData?.id || `club-asset-${Date.now()}`,
      name: name.trim(),
      category,
      quantity: Number(quantity) || 1,
      acquisitionDate,
      custodian: custodian.trim(),
      location: location.trim(),
      status,
      condition,
      estimatedValue: estimatedValue.trim() || undefined,
      notes: notes.trim(),
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150 overflow-hidden">
      <div
        className="w-full max-w-xl bg-surface-elevated border-2 border-text-primary dark:border-border-default rounded-xl shadow-[4px_4px_0px_var(--accent-primary)] overflow-hidden flex flex-col my-auto"
        style={{ maxHeight: "calc(100dvh - 3rem)" }}
      >
        {/* Fixed Header */}
        <div className="p-3.5 sm:p-4 border-b border-border-default flex items-center justify-between bg-surface-secondary shrink-0">
          <div className="flex items-center gap-2">
            <Package size={18} className="text-accent-primary" />
            <h3 className="font-black text-text-primary text-base">
              {initialData ? "Edit Club Asset" : "Register New Club Asset"}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-text-tertiary hover:text-text-primary cursor-pointer">
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form
          id="club-asset-form"
          onSubmit={handleSubmit}
          className="p-4 sm:p-5 space-y-3.5 overflow-y-auto flex-1 min-h-0 overscroll-contain"
        >
          {/* Name */}
          <div>
            <label className="block text-xs font-mono font-bold text-text-secondary uppercase mb-1">
              Asset Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Club Room Padlock & Keys / Arduino Uno Kits / File Holder"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-surface-primary border border-border-default text-xs sm:text-sm text-text-primary focus:outline-none focus:border-accent-primary"
            />
          </div>

          {/* Category & Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-bold text-text-secondary uppercase mb-1">
                Category
              </label>
              <Select value={category} onChange={setCategory} options={categoryOptions} />
            </div>
            <div>
              <label className="block text-xs font-mono font-bold text-text-secondary uppercase mb-1">
                Quantity
              </label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full p-2.5 rounded-lg bg-surface-primary border border-border-default text-xs sm:text-sm text-text-primary focus:outline-none focus:border-accent-primary"
              />
            </div>
          </div>

          {/* Acquisition Date & Estimated Value (Custodian and Storage Location hidden per user request) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-bold text-text-secondary uppercase mb-1">
                Acquisition Date
              </label>
              <input
                type="date"
                value={acquisitionDate}
                onChange={(e) => setAcquisitionDate(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-surface-primary border border-border-default text-xs sm:text-sm text-text-primary focus:outline-none focus:border-accent-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-bold text-text-secondary uppercase mb-1">
                Estimated Value (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g., ৳ 1,200"
                value={estimatedValue}
                onChange={(e) => setEstimatedValue(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-surface-primary border border-border-default text-xs sm:text-sm text-text-primary focus:outline-none focus:border-accent-primary"
              />
            </div>
          </div>

          {/* Status & Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-bold text-text-secondary uppercase mb-1">
                Status
              </label>
              <Select value={status} onChange={(v) => setStatus(v as ClubAssetStatus)} options={statusOptions} />
            </div>
            <div>
              <label className="block text-xs font-mono font-bold text-text-secondary uppercase mb-1">
                Condition
              </label>
              <Select value={condition} onChange={(v) => setCondition(v as AssetCondition)} options={conditionOptions} />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-mono font-bold text-text-secondary uppercase mb-1">
              Notes & Description
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Master keys with President & GS; file holder contains constitutional archive."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-surface-primary border border-border-default text-xs sm:text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-primary"
            />
          </div>
        </form>

        {/* Pinned Fixed Footer */}
        <div className="flex items-center justify-end gap-2.5 p-3 sm:p-4 border-t border-border-default bg-surface-secondary/40 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-surface-secondary text-text-secondary font-bold text-xs hover:bg-surface-elevated transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="club-asset-form"
            className="px-5 py-2 rounded-lg bg-accent-primary text-accent-primary-text font-bold text-xs border-2 border-text-primary dark:border-border-default shadow-[3px_3px_0px_var(--text-primary)] dark:shadow-[3px_3px_0px_var(--accent-primary)] hover:translate-x-0.5 hover:translate-y-0.5 transition cursor-pointer"
          >
            {initialData ? "Save Changes" : "Register Asset"}
          </button>
        </div>
      </div>
    </div>
  );
}
