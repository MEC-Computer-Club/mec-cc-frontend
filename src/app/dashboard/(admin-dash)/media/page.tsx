"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  Image as ImageIcon,
  HardDrive,
  Activity,
  Folder,
  FolderPlus,
  Upload,
  RefreshCw,
  Search,
  Copy,
  Check,
  ExternalLink,
  Trash2,
  Eye,
  SlidersHorizontal,
  AlertTriangle,
  FileText,
  Video,
  X,
  Loader2,
  ChevronRight,
  ChevronLeft,
  ShieldAlert,
  Link2,
  Database,
  AlertCircle,
  RotateCcw,
  CheckSquare,
  Square,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Select, SelectOption } from "@/components/ui/Select";
import FilterSelect, { FilterOption } from "@/app/dashboard/components/FilterSelect";
import { useRoleGuard } from "@/hooks/useRoleGuard";
import {
  fetchMediaStats,
  fetchMediaFolders,
  fetchMediaResources,
  uploadMediaFile,
  deleteMediaResource,
  deleteBulkMediaResources,
  createMediaFolder,
  getOptimizedThumbnailUrl,
  CloudinaryUsageStats,
  CloudinaryFolder,
  CloudinaryResource,
} from "@/lib/api/mediaManager";
import toast from "react-hot-toast";

const SORT_OPTIONS: FilterOption[] = [
  { value: "created_at:desc", label: "Newest Uploads First" },
  { value: "created_at:asc", label: "Oldest Uploads First" },
  { value: "bytes:desc", label: "Largest File Size" },
  { value: "bytes:asc", label: "Smallest File Size" },
];

const TYPE_OPTIONS: FilterOption[] = [
  { value: "all", label: "All Media Types" },
  { value: "image", label: "Images (PNG, JPG, WebP, SVG)" },
  { value: "video", label: "Videos (MP4, WebM)" },
  { value: "raw", label: "Documents & Files (PDF, Docs)" },
];

const LINK_STATUS_OPTIONS: FilterOption[] = [
  { value: "all", label: "All Assets (Linked & Orphan)" },
  { value: "linked", label: "🔗 In Use (Linked to Site)" },
  { value: "unlinked", label: "⚠️ Unlinked / Orphan (Cleanup)" },
];

export default function MediaManagerPage() {
  const { isAllowed, isLoading: guardLoading } = useRoleGuard(["admin"]);
  // Stats state
  const [stats, setStats] = useState<CloudinaryUsageStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Folder & resources state
  const [folders, setFolders] = useState<CloudinaryFolder[]>([]);
  const [activeTab, setActiveTab] = useState<"unlinked" | "misc">("unlinked");
  const activeFolder = activeTab === "misc" ? "uploads/misc" : "all";
  const linkStatus = activeTab === "misc" ? "all" : "unlinked";
  const [resources, setResources] = useState<CloudinaryResource[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoadingResources, setIsLoadingResources] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [resourceType, setResourceType] = useState<string>("all");
  const [sortValue, setSortValue] = useState<string>("created_at:desc");

  // Interactive UI states
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<CloudinaryResource | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  // Upload modal states
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadFolder, setUploadFolder] = useState<string>("uploads/misc");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // New folder state
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderParent, setNewFolderParent] = useState("uploads");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  // Custom Confirmation Modal state for Permanent Delete
  const [resourceToDelete, setResourceToDelete] = useState<CloudinaryResource | null>(null);

  // Multi-selection states
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  // 1. Fetch Stats
  const loadStats = useCallback(async () => {
    setIsLoadingStats(true);
    try {
      const data = await fetchMediaStats();
      setStats(data);
    } catch (err: any) {
      console.warn("Could not load Cloudinary stats:", err);
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  // 2. Fetch Folders
  const loadFolders = useCallback(async () => {
    try {
      const data = await fetchMediaFolders();
      setFolders(data);
    } catch (err) {
      console.warn("Could not load folders:", err);
    }
  }, []);

  // 3. Fetch Resources
  const loadResources = useCallback(
    async (cursor: string | null = null, append = false) => {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoadingResources(true);
      }

      const [sortBy, sortDir] = sortValue.split(":") as ["created_at" | "bytes", "asc" | "desc"];

      try {
        const result = await fetchMediaResources({
          folder: activeFolder,
          search: searchQuery,
          resourceType: resourceType as any,
          linkStatus: linkStatus as any,
          nextCursor: cursor,
          sortBy,
          sortDir,
          maxResults: 24,
        });

        if (append) {
          setResources((prev) => [...prev, ...result.resources]);
        } else {
          setResources(result.resources);
        }

        setTotalCount(result.totalCount);
        setNextCursor(result.nextCursor);
      } catch (err: any) {
        console.warn("Could not load media items:", err);
      } finally {
        setIsLoadingResources(false);
        setIsLoadingMore(false);
      }
    },
    [activeFolder, searchQuery, resourceType, linkStatus, sortValue]
  );

  useEffect(() => {
    loadStats();
    loadFolders();
  }, [loadStats, loadFolders]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadResources(null, false);
    }, 250);
    return () => clearTimeout(timer);
  }, [loadResources]);

  // Copy URL with visual notification
  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("CDN URL copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Open confirmation modal for delete or move to trash
  const handleDeleteResource = (resource: CloudinaryResource, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setResourceToDelete(resource);
  };

  // Perform confirmed permanent deletion
  const handleConfirmDelete = async () => {
    if (!resourceToDelete) return;
    const resource = resourceToDelete;

    setIsDeletingId(resource.publicId);
    try {
      await deleteMediaResource(resource.publicId, true, resource.resourceType || "image");
      toast.success("Media asset permanently deleted from Cloudinary");

      // Remove from current list view
      setResources((prev) => prev.filter((r) => r.publicId !== resource.publicId));
      setTotalCount((prev) => Math.max(0, prev - 1));

      // If active preview item is being deleted, advance or close
      if (previewItem?.publicId === resource.publicId) {
        const remaining = resources.filter((r) => r.publicId !== resource.publicId);
        if (remaining.length > 0) {
          const idx = resources.findIndex((r) => r.publicId === resource.publicId);
          setPreviewItem(remaining[Math.min(idx, remaining.length - 1)]);
        } else {
          setPreviewItem(null);
        }
      }

      setResourceToDelete(null);
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(resource.publicId);
        return next;
      });
      loadStats();
      loadFolders();
    } catch (err: any) {
      toast.error(err?.message || "Failed to permanently delete media asset");
    } finally {
      setIsDeletingId(null);
    }
  };

  // Multi-selection handlers
  const isAllSelected = useMemo(() => {
    if (resources.length === 0) return false;
    return resources.every((r) => selectedIds.has(r.publicId));
  }, [resources, selectedIds]);

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(resources.map((r) => r.publicId)));
    }
  };

  const handleToggleSelectOne = (publicId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(publicId)) {
        next.delete(publicId);
      } else {
        next.add(publicId);
      }
      return next;
    });
  };

  const handleConfirmBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    const idsToDelete = Array.from(selectedIds);
    setIsBulkDeleting(true);
    try {
      await deleteBulkMediaResources(idsToDelete);
      toast.success(`Successfully deleted ${idsToDelete.length} media assets`);
      setResources((prev) => prev.filter((r) => !selectedIds.has(r.publicId)));
      setTotalCount((prev) => Math.max(0, prev - idsToDelete.length));
      setSelectedIds(new Set());
      setShowBulkDeleteModal(false);
      loadStats();
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete selected media assets");
    } finally {
      setIsBulkDeleting(false);
    }
  };

  // Next and Previous navigation for preview modal
  const currentPreviewIndex = useMemo(() => {
    if (!previewItem) return -1;
    return resources.findIndex((r) => r.publicId === previewItem.publicId);
  }, [previewItem, resources]);

  const handleNextPreview = useCallback(() => {
    if (resources.length === 0 || currentPreviewIndex === -1) return;
    const nextIdx = (currentPreviewIndex + 1) % resources.length;
    setPreviewItem(resources[nextIdx]);
  }, [currentPreviewIndex, resources]);

  const handlePrevPreview = useCallback(() => {
    if (resources.length === 0 || currentPreviewIndex === -1) return;
    const prevIdx = (currentPreviewIndex - 1 + resources.length) % resources.length;
    setPreviewItem(resources[prevIdx]);
  }, [currentPreviewIndex, resources]);

  // Keyboard navigation (Left, Right, Escape)
  useEffect(() => {
    if (!previewItem) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if ((e.target as HTMLElement).tagName === "INPUT" || (e.target as HTMLElement).tagName === "TEXTAREA") {
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNextPreview();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrevPreview();
      } else if (e.key === "Escape") {
        e.preventDefault();
        setPreviewItem(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previewItem, handleNextPreview, handlePrevPreview]);

  // Direct file upload handler
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) {
      toast.error("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    try {
      await uploadMediaFile(uploadFile, uploadFolder);
      toast.success(`Uploaded "${uploadFile.name}" into ${uploadFolder}`);
      setShowUploadModal(false);
      setUploadFile(null);
      loadResources(null, false);
      loadStats();
    } catch (err: any) {
      toast.error(err?.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  // Create folder handler
  const handleCreateFolderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) {
      toast.error("Folder name cannot be empty");
      return;
    }

    setIsCreatingFolder(true);
    const fullPath = `${newFolderParent}/${newFolderName.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "-")}`;

    try {
      await createMediaFolder(fullPath);
      toast.success(`Folder "${fullPath}" created in Cloudinary!`);
      setShowNewFolderModal(false);
      setNewFolderName("");
      await loadFolders();
    } catch (err: any) {
      toast.error(err?.message || "Failed to create folder");
    } finally {
      setIsCreatingFolder(false);
    }
  };

  if (guardLoading || !isAllowed) return null;

  return (
    <div className="space-y-6">
      {/* ══════════════════════════════════════════════════════════════
          1. HEADER & ACTIONS
          ══════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-border-default">
        <div>
          <div className="flex items-center gap-2 text-amber-500 font-mono text-xs font-bold uppercase tracking-wider mb-1">
            {activeTab === "misc" ? (
              <>
                <Folder size={16} className="text-accent-primary" />
                <span className="text-accent-primary">Miscellaneous Storage Folder</span>
              </>
            ) : (
              <>
                <AlertCircle size={16} /> Cloudinary Unlinked Media Manager
              </>
            )}
          </div>
          <h1 className="font-heading text-xl sm:text-2xl font-black text-text-primary m-0">
            {activeTab === "misc" ? "Miscellaneous Media (uploads/misc)" : "Unlinked Cloudinary Media"}
          </h1>
          <p className="font-body text-xs sm:text-sm text-text-secondary mt-0.5 max-w-2xl">
            {activeTab === "misc"
              ? "Manage independent assets in the uploads/misc folder. Upload standalone photos, copy their direct CDN URLs, and link them anywhere on the website."
              : "Showing only unlinked / orphan media files that are not used in any events, blogs, users, forms, or certificates. Permanently delete them to reclaim Cloudinary storage."}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              loadStats();
              loadResources(null, false);
            }}
            disabled={isLoadingStats || isLoadingResources}
            className="h-9 px-3"
          >
            <RefreshCw size={14} className={`mr-1.5 ${isLoadingStats ? "animate-spin" : ""}`} />
            Sync Stats
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowNewFolderModal(true)}
            className="h-9 px-3"
          >
            <FolderPlus size={14} className="mr-1.5 text-accent-primary" />
            New Folder
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setUploadFolder(activeFolder === "all" ? "uploads/misc" : activeFolder);
              setShowUploadModal(true);
            }}
            className="h-9 px-3.5"
          >
            <Upload size={14} className="mr-1.5" />
            Upload Media
          </Button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          2. LIVE CLOUDINARY USAGE & QUOTA STATS
          ══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Storage Space Used */}
        <div className="p-4 bg-surface-elevated border-2 border-text-primary dark:border-border-default rounded-xl shadow-[4px_4px_0px_0px_var(--accent-primary)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-text-secondary uppercase">
              Storage Used
            </span>
            <div className="p-1.5 bg-accent-primary/10 border border-accent-primary/30 rounded-md text-accent-primary">
              <HardDrive size={16} />
            </div>
          </div>

          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="font-heading font-black text-2xl text-text-primary">
                {stats?.storage.formatted || "..."}
              </span>
              <span className="text-xs text-text-tertiary font-mono">
                / {stats?.credits.limit || 25} GB Quota
              </span>
            </div>

            {/* Brutalist progress gauge */}
            <div className="w-full h-2.5 bg-surface-secondary border border-border-default rounded-full mt-2 overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  (stats?.credits.percentUsed || 0) > 85
                    ? "bg-red-500"
                    : (stats?.credits.percentUsed || 0) > 60
                    ? "bg-amber-400"
                    : "bg-accent-primary"
                }`}
                style={{ width: `${Math.max(3, Math.min(100, stats?.credits.percentUsed || 0))}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-text-secondary pt-1">
            <span>Quota Used: <strong>{stats?.credits.percentUsed || 0}%</strong></span>
            <span className="text-emerald-500 font-bold">Optimal</span>
          </div>
        </div>

        {/* Metric 2: Monthly Bandwidth */}
        <div className="p-4 bg-surface-elevated border-2 border-text-primary dark:border-border-default rounded-xl shadow-[4px_4px_0px_0px_var(--border-default)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-text-secondary uppercase">
              CDN Bandwidth
            </span>
            <div className="p-1.5 bg-indigo-500/10 border border-indigo-500/30 rounded-md text-indigo-400">
              <Activity size={16} />
            </div>
          </div>

          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="font-heading font-black text-2xl text-text-primary">
                {stats?.bandwidth.formatted || "..."}
              </span>
              <span className="text-xs text-text-tertiary font-mono">
                this month
              </span>
            </div>
            <p className="m-0 text-[11px] text-text-secondary mt-1">
              Delivered globally via Cloudinary Fastly edge nodes.
            </p>
          </div>

          <div className="text-[11px] font-mono text-text-tertiary pt-1 border-t border-border-default">
            Bandwidth credits: {stats?.bandwidth.credits || 0}
          </div>
        </div>

        {/* Metric 3: Total Media Files (all - size(/sample)) */}
        <div className="p-4 bg-surface-elevated border-2 border-text-primary dark:border-border-default rounded-xl shadow-[4px_4px_0px_0px_var(--border-default)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-text-secondary uppercase">
              Total Media Files
            </span>
            <div className="p-1.5 bg-blue-500/10 border border-blue-500/30 rounded-md text-blue-500">
              <Database size={16} />
            </div>
          </div>

          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="font-heading font-black text-2xl text-text-primary">
                {stats?.objects.totalAssets || 0}
              </span>
              <span className="text-xs text-text-tertiary font-mono">
                files
              </span>
            </div>
            <p className="m-0 text-[11px] text-text-secondary mt-1">
              <strong className="text-amber-500 font-bold">{totalCount} unlinked</strong> · <strong className="text-emerald-500 font-bold">{stats?.databaseReferences?.totalEntitiesWithMedia ?? 0} linked</strong> in DB
            </p>
          </div>

          <div className="text-[11px] font-mono text-text-tertiary pt-1 border-t border-border-default flex items-center justify-between">
            <span>Users: {stats?.databaseReferences?.breakdown.users || 0}</span>
            <span>Events: {stats?.databaseReferences?.breakdown.events || 0}</span>
            <span>Blogs: {stats?.databaseReferences?.breakdown.blogs || 0}</span>
          </div>
        </div>

        {/* Metric 4: Cloudinary Plan & Remaining Credits */}
        <div className="p-4 bg-surface-elevated border-2 border-text-primary dark:border-border-default rounded-xl shadow-[4px_4px_0px_0px_var(--border-default)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-text-secondary uppercase">
              Plan &amp; Credits
            </span>
            <span className="px-2 py-0.5 bg-accent-primary text-black font-mono text-[10px] font-extrabold rounded">
              {stats?.plan || "Free"}
            </span>
          </div>

          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="font-heading font-black text-2xl text-accent-primary">
                {stats?.credits.remaining ?? "24.1"}
              </span>
              <span className="text-xs text-text-secondary font-mono">
                Credits Free
              </span>
            </div>
            <p className="m-0 text-[11px] text-text-secondary mt-1">
              {stats?.credits.usage ?? 0.86} of {stats?.credits.limit ?? 25} credits consumed.
            </p>
          </div>

          <div className="text-[11px] font-mono text-text-tertiary pt-1 border-t border-border-default flex items-center justify-between">
            <span>API Calls: {stats?.rateLimit.remaining ?? 499} left</span>
            <span className="text-[10px]">Resets daily</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          3. REPOSITORY MODE TABS (Unlinked vs Miscellaneous)
          ══════════════════════════════════════════════════════════════ */}
      <div className="flex items-center gap-2 border-b-2 border-border-default pb-2">
        <button
          type="button"
          onClick={() => {
            setActiveTab("unlinked");
            setSelectedIds(new Set());
          }}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition cursor-pointer flex items-center gap-2 ${
            activeTab === "unlinked"
              ? "bg-accent-primary text-black border-2 border-text-primary shadow-[3px_3px_0px_0px_var(--text-primary)]"
              : "bg-surface-elevated text-text-secondary border-2 border-border-default hover:border-accent-primary hover:text-text-primary"
          }`}
        >
          <AlertCircle size={14} />
          <span>Unlinked Media ({activeTab === "unlinked" ? totalCount : stats?.objects.totalAssets ? `${totalCount}` : "..."})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("misc");
            setSelectedIds(new Set());
          }}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition cursor-pointer flex items-center gap-2 ${
            activeTab === "misc"
              ? "bg-accent-primary text-black border-2 border-text-primary shadow-[3px_3px_0px_0px_var(--text-primary)]"
              : "bg-surface-elevated text-text-secondary border-2 border-border-default hover:border-accent-primary hover:text-text-primary"
          }`}
        >
          <Folder size={14} />
          <span>Miscellaneous Folder (uploads/misc)</span>
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          4. SEARCH & FILTER CONTROLS
          ══════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 bg-surface-elevated border-2 border-border-default rounded-xl">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by filename or public_id..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-border-default bg-surface-primary text-text-primary font-mono focus:outline-none focus:border-accent-primary"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {activeTab === "unlinked" ? (
            <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-mono font-bold flex items-center gap-1.5">
              <AlertCircle size={13} />
              <span>Unlinked Files Only</span>
            </div>
          ) : (
            <div className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-mono font-bold flex items-center gap-1.5">
              <Folder size={13} />
              <span>uploads/misc</span>
            </div>
          )}

          <FilterSelect
            value={resourceType}
            onChange={(val) => setResourceType(val)}
            options={TYPE_OPTIONS}
            placeholder="Media Type"
            className="text-xs"
          />

          <FilterSelect
            value={sortValue}
            onChange={(val) => setSortValue(val)}
            options={SORT_OPTIONS}
            placeholder="Sort Order"
            className="text-xs"
          />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          5. MEDIA ASSETS GALLERY / LIST
          ══════════════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-text-secondary font-mono flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong className="text-text-primary">{resources.length}</strong> of{" "}
              <strong className="text-text-primary">{totalCount}</strong>{" "}
              {activeTab === "misc" ? "files in uploads/misc" : "unlinked media files"}
            </span>
            {selectedIds.size > 0 && (
              <span className="px-2 py-0.5 rounded bg-accent-primary/20 text-accent-primary font-bold text-[11px] border border-accent-primary/40">
                {selectedIds.size} selected
              </span>
            )}
          </div>

          {/* Right side: Select All button + Delete icon */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleToggleSelectAll}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border-2 transition cursor-pointer flex items-center gap-1.5 ${
                isAllSelected
                  ? "bg-accent-primary text-black border-text-primary shadow-[2px_2px_0px_0px_var(--text-primary)]"
                  : "bg-surface-primary text-text-primary border-border-default hover:border-accent-primary"
              }`}
            >
              {isAllSelected ? <CheckSquare size={14} /> : <Square size={14} />}
              <span>{isAllSelected ? "Deselect All" : "Select All"}</span>
            </button>

            {selectedIds.size > 0 && (
              <button
                type="button"
                onClick={() => setShowBulkDeleteModal(true)}
                className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-red-600 hover:bg-red-500 text-white border-2 border-red-700 shadow-[2px_2px_0px_0px_#991b1b] transition cursor-pointer flex items-center gap-1.5 animate-[fadeIn_0.15s_ease]"
                title="Permanently Delete Selected Media"
              >
                <Trash2 size={14} />
                <span>Delete ({selectedIds.size})</span>
              </button>
            )}
          </div>
        </div>

        {isLoadingResources ? (
          <div className="flex flex-col items-center justify-center p-16 bg-surface-elevated border-2 border-border-default rounded-xl gap-3">
            <Loader2 size={24} className="animate-spin text-accent-primary" />
            <p className="font-mono text-xs text-text-secondary">Scanning Cloudinary media assets...</p>
          </div>
        ) : resources.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 bg-surface-elevated border-2 border-dashed border-border-default rounded-xl text-center space-y-3">
            <div className="p-3 bg-surface-secondary rounded-full text-text-tertiary">
              <ImageIcon size={32} />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-sm text-text-primary m-0">
                {activeTab === "misc" ? "No Media in Miscellaneous Folder" : "No Unlinked Media Found"}
              </h3>
              <p className="font-body text-xs text-text-secondary mt-1 max-w-sm">
                {searchQuery
                  ? `No assets match your search term "${searchQuery}".`
                  : activeTab === "misc"
                  ? "No files currently uploaded to uploads/misc. Upload an independent image to use anywhere on the website."
                  : "All media assets in Cloudinary are actively linked and referenced across the website!"}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setUploadFolder("uploads/misc");
                setShowUploadModal(true);
              }}
            >
              <Upload size={13} className="mr-1.5" /> Upload File Here
            </Button>
          </div>
        ) : (
          /* ── Card / Grid View ── */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {resources.map((item) => {
              const isCopied = copiedId === item.publicId;
              const isDeleting = isDeletingId === item.publicId;
              const isSelected = selectedIds.has(item.publicId);

              return (
                <div
                  key={item.assetId || item.publicId}
                  className={`group bg-surface-elevated border-2 rounded-xl overflow-hidden transition-all flex flex-col justify-between ${
                    isSelected
                      ? "border-accent-primary ring-2 ring-accent-primary/50 shadow-[4px_4px_0px_0px_var(--accent-primary)]"
                      : "border-border-brutalist dark:border-border-default shadow-[2px_2px_0px_0px_var(--border-default)] hover:shadow-[4px_4px_0px_0px_var(--accent-primary)] hover:-translate-x-0.5 hover:-translate-y-0.5"
                  }`}
                >
                  {/* Thumbnail Container */}
                  <div
                    onClick={() => setPreviewItem(item)}
                    className="w-full aspect-square bg-slate-950 relative overflow-hidden cursor-pointer flex items-center justify-center"
                  >
                    {/* Select Checkbox (Top Left Corner) */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleSelectOne(item.publicId, e)}
                      style={{ position: "absolute", top: "8px", left: "8px" }}
                      className={`w-5 h-5 rounded flex items-center justify-center transition-all z-20 cursor-pointer ${
                        isSelected
                          ? "bg-accent-primary text-black border-2 border-black shadow-[1px_1px_0px_0px_#000]"
                          : "bg-black/50 hover:bg-black/80 border-2 border-white/80 hover:border-white shadow-sm"
                      }`}
                      title={isSelected ? "Deselect" : "Select"}
                    >
                      {isSelected && <Check size={13} strokeWidth={3.5} />}
                    </button>

                    {/* Badges (Top Right Corner) */}
                    <div
                      style={{ position: "absolute", top: "8px", right: "8px" }}
                      className="flex items-center gap-1 z-10"
                    >
                      <span className="px-1.5 py-0.5 bg-black/80 backdrop-blur-xs text-white rounded text-[9px] font-mono font-bold uppercase border border-white/20">
                        {item.format}
                      </span>
                      <span className="px-1.5 py-0.5 bg-black/80 backdrop-blur-xs text-accent-primary rounded text-[9px] font-mono font-bold border border-white/20">
                        {item.formattedSize}
                      </span>
                    </div>

                    {item.resourceType === "video" ? (
                      <div className="flex flex-col items-center justify-center text-text-secondary gap-1 p-2 text-center">
                        <Video size={28} className="text-purple-400" />
                        <span className="text-[10px] font-mono uppercase">{item.format}</span>
                      </div>
                    ) : item.resourceType === "raw" ? (
                      <div className="flex flex-col items-center justify-center text-text-secondary gap-1 p-2 text-center">
                        <FileText size={28} className="text-amber-400" />
                        <span className="text-[10px] font-mono uppercase">{item.format || "DOC"}</span>
                      </div>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={getOptimizedThumbnailUrl(item.secureUrl, 380, 260, "fill")}
                        alt={item.filename}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewItem(item);
                        }}
                        className="p-1.5 bg-surface-primary text-text-primary rounded-md border border-border-default hover:bg-accent-primary hover:text-black transition"
                        title="Quick Preview"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyUrl(item.secureUrl, item.publicId);
                        }}
                        className="p-1.5 bg-surface-primary text-text-primary rounded-md border border-border-default hover:bg-accent-primary hover:text-black transition"
                        title="Copy CDN URL"
                      >
                        {isCopied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Card Meta & Bottom Actions */}
                  <div className="p-2 border-t border-border-default bg-surface-secondary flex flex-col justify-between gap-1.5">
                    <div>
                      <p
                        className="m-0 text-xs font-bold text-text-primary truncate"
                        title={item.filename}
                      >
                        {item.filename}
                      </p>
                      <p className="m-0 text-[10px] text-text-tertiary font-mono truncate">
                        {item.folder || "root"}
                      </p>
                    </div>

                    {/* Database Usage Reference Badge */}
                    <div className="pt-0.5">
                      {item.isLinked && item.linkedEntities && item.linkedEntities.length > 0 ? (
                        <div
                          className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 rounded truncate"
                          title={item.linkedEntities.map((e) => `${e.usage}: ${e.title}`).join(", ")}
                        >
                          <Link2 size={10} className="shrink-0" />
                          <span className="truncate">
                            {item.linkedEntities[0].usage}: {item.linkedEntities[0].title}
                            {item.linkedEntities.length > 1 ? ` (+${item.linkedEntities.length - 1})` : ""}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-[10px] font-mono text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 rounded truncate">
                          <AlertCircle size={10} className="shrink-0" />
                          <span className="truncate">Unlinked / Orphan</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-border-default/60">
                      <button
                        type="button"
                        onClick={() => handleCopyUrl(item.secureUrl, item.publicId)}
                        className="text-[10px] font-mono font-bold text-accent-primary hover:underline flex items-center gap-1 cursor-pointer border-none bg-transparent p-0"
                      >
                        {isCopied ? (
                          <>
                            <Check size={11} className="text-emerald-500" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy size={11} /> Copy URL
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={(e) => handleDeleteResource(item, e)}
                        className="text-red-500 hover:text-red-400 p-1 rounded cursor-pointer border-none bg-transparent hover:bg-red-500/10 transition"
                        title="Permanently Delete"
                      >
                        {isDeleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Load More Pagination - Only appear if we have more media to show */}
        {Boolean(nextCursor) && (
          <div className="flex justify-center pt-4">
            <Button
              variant="outline"
              size="sm"
              disabled={isLoadingMore}
              onClick={() => loadResources(nextCursor, true)}
              className="px-6 font-mono"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 size={14} className="animate-spin mr-1.5" /> Loading More Media...
                </>
              ) : (
                "Load More Media..."
              )}
            </Button>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════
          6. MODAL A: PREVIEW & ASSET METADATA (NON-OVERFLOWING & ARROW NAV)
          ══════════════════════════════════════════════════════════════ */}
      {previewItem && (
        <div
          style={{ zIndex: 10000 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="w-full max-w-5xl max-h-[92vh] md:h-[530px] flex flex-col bg-surface-elevated border-2 border-text-primary dark:border-border-default rounded-xl shadow-[8px_8px_0px_0px_var(--accent-primary)] overflow-hidden animate-[slideUp_0.2s_ease_forwards] relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Header (Pinned) */}
            <div className="px-4 py-3 border-b-2 border-border-default flex items-center justify-between shrink-0 bg-surface-elevated">
              <div className="flex items-center gap-2.5 min-w-0 pr-3">
                <h3 className="font-heading font-extrabold text-sm sm:text-base text-text-primary m-0 truncate">
                  {previewItem.filename}
                </h3>
                {currentPreviewIndex !== -1 && (
                  <span className="px-2 py-0.5 rounded bg-accent-primary/10 border border-accent-primary/30 text-accent-primary font-mono text-[10px] font-bold shrink-0">
                    {currentPreviewIndex + 1} / {resources.length}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Arrow navigation buttons in header */}
                <div className="flex items-center border border-border-default rounded-md overflow-hidden bg-surface-secondary">
                  <button
                    type="button"
                    onClick={handlePrevPreview}
                    className="p-1.5 hover:bg-accent-primary hover:text-black text-text-primary transition cursor-pointer border-none bg-transparent"
                    title="Previous Asset (Left Arrow)"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextPreview}
                    className="p-1.5 hover:bg-accent-primary hover:text-black text-text-primary transition cursor-pointer border-none bg-transparent border-l border-border-default"
                    title="Next Asset (Right Arrow)"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setPreviewItem(null)}
                  className="p-1.5 rounded-md bg-surface-secondary text-text-primary border border-border-default hover:bg-accent-primary hover:text-black cursor-pointer transition"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body: 2-Column Split (Left: Canvas, Right: Inspector) */}
            <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden bg-surface-secondary">
              {/* Left Column: Media Canvas */}
              <div className="flex-1 bg-slate-950 flex items-center justify-center p-3 relative overflow-hidden group select-none min-h-[260px] md:min-h-0">
                {previewItem.resourceType === "video" ? (
                  <video src={previewItem.secureUrl} controls className="max-h-full max-w-full rounded" />
                ) : previewItem.resourceType === "raw" ? (
                  <div className="flex flex-col items-center justify-center text-text-secondary gap-3 p-8">
                    <FileText size={48} className="text-amber-400" />
                    <span className="text-sm font-mono font-bold text-center break-all">{previewItem.filename}</span>
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewItem.secureUrl}
                    alt={previewItem.filename}
                    className="max-h-full max-w-full object-contain rounded"
                  />
                )}

                {/* Floating Canvas Navigation Controls */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevPreview();
                  }}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 hover:bg-accent-primary hover:text-black text-white border border-white/20 transition cursor-pointer shadow-lg z-10"
                  title="Previous (Left Arrow key)"
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextPreview();
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 hover:bg-accent-primary hover:text-black text-white border border-white/20 transition cursor-pointer shadow-lg z-10"
                  title="Next (Right Arrow key)"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Right Column: Asset Inspector & Metadata Sheet */}
              <div className="w-full md:w-[360px] lg:w-[380px] shrink-0 border-t-2 md:border-t-0 md:border-l-2 border-border-default bg-surface-elevated p-4 flex flex-col justify-between overflow-y-auto min-h-0 space-y-4">
                <div className="space-y-3.5">
                  {/* Folder & Path info */}
                  <div className="p-2.5 rounded-lg bg-surface-primary border border-border-default">
                    <span className="text-[10px] uppercase font-mono font-bold text-text-tertiary block mb-0.5">
                      Cloudinary Folder
                    </span>
                    <span className="text-xs font-mono font-bold text-text-primary break-all">
                      {previewItem.folder}
                    </span>
                  </div>

                  {/* 2x2 Metadata Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2.5 rounded-lg bg-surface-primary border border-border-default">
                      <span className="text-[10px] text-text-tertiary block font-bold">File Size</span>
                      <strong className="text-text-primary text-sm">{previewItem.formattedSize}</strong>
                    </div>
                    <div className="p-2.5 rounded-lg bg-surface-primary border border-border-default">
                      <span className="text-[10px] text-text-tertiary block font-bold">Dimensions</span>
                      <strong className="text-text-primary text-sm">
                        {previewItem.width ? `${previewItem.width} × ${previewItem.height}` : "N/A"}
                      </strong>
                    </div>
                    <div className="p-2.5 rounded-lg bg-surface-primary border border-border-default">
                      <span className="text-[10px] text-text-tertiary block font-bold">Format</span>
                      <strong className="text-text-primary uppercase text-sm">{previewItem.format}</strong>
                    </div>
                    <div className="p-2.5 rounded-lg bg-surface-primary border border-border-default">
                      <span className="text-[10px] text-text-tertiary block font-bold">Created At</span>
                      <strong className="text-text-primary text-xs">
                        {new Date(previewItem.createdAt).toLocaleDateString()}
                      </strong>
                    </div>
                  </div>

                  {/* ── Active Database Connections / Orphan Detection ── */}
                  <div className="p-2.5 rounded-lg border bg-surface-primary border-border-default space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-mono font-bold text-text-tertiary flex items-center gap-1.5">
                        <Database size={12} /> Database Usages &amp; Links
                      </span>
                      {previewItem.isLinked ? (
                        <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[9px] font-mono font-bold">
                          {previewItem.linkedEntities?.length || 1} Connected
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[9px] font-mono font-bold">
                          Orphan / Unused
                        </span>
                      )}
                    </div>

                    {previewItem.isLinked && previewItem.linkedEntities && previewItem.linkedEntities.length > 0 ? (
                      <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1 scrollbar-thin">
                        {previewItem.linkedEntities.map((ent, idx) => (
                          <div
                            key={`${ent.type}-${ent.id}-${idx}`}
                            className="flex items-center justify-between p-1.5 rounded bg-surface-secondary border border-border-default/60 text-xs"
                          >
                            <div className="min-w-0 pr-2">
                              <span className="text-[9px] font-mono font-bold text-accent-primary block uppercase">
                                {ent.usage}
                              </span>
                              <span className="font-bold text-text-primary truncate block text-[11px]">
                                {ent.title}
                              </span>
                            </div>
                            {ent.dashboardUrl && (
                              <a
                                href={ent.dashboardUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2 py-0.5 rounded bg-surface-primary border border-border-default hover:border-accent-primary text-text-primary text-[10px] font-mono font-bold flex items-center gap-1 shrink-0"
                              >
                                <span>View</span>
                                <ExternalLink size={10} />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-2 rounded bg-amber-500/5 border border-amber-500/20 text-text-secondary text-[11px]">
                        <p className="m-0 leading-relaxed font-mono text-[10.5px]">
                          ⚠️ <strong>Unlinked File:</strong> Not found in any User profile, Event, Blog, Project, or Form. You can safely delete or move it to trash to free up space.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Direct CDN URL Box */}
                  <div>
                    <label className="text-[11px] font-mono font-bold text-text-tertiary mb-1.5 block">
                      Public Cloudinary CDN URL
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        readOnly
                        value={previewItem.secureUrl}
                        className="flex-1 min-w-0 px-2.5 py-1.5 text-xs font-mono bg-surface-primary border border-border-default rounded text-text-primary"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopyUrl(previewItem.secureUrl, previewItem.publicId)}
                        className="shrink-0"
                      >
                        <Copy size={13} className="mr-1" /> Copy
                      </Button>
                      <a
                        href={previewItem.secureUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded border border-border-default bg-surface-primary text-text-primary hover:border-accent-primary shrink-0"
                        title="Open original"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>

                  {/* Markdown Tag Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-center"
                    onClick={() => {
                      const mdSnippet = `![${previewItem.filename}](${previewItem.secureUrl})`;
                      navigator.clipboard.writeText(mdSnippet);
                      toast.success("Markdown image snippet copied!");
                    }}
                  >
                    Copy Markdown Tag
                  </Button>
                </div>

                {/* Bottom Actions & Keyboard Hint */}
                <div className="pt-3 border-t border-border-default space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isDeletingId === previewItem.publicId}
                    onClick={() => handleDeleteResource(previewItem)}
                    className="w-full justify-center text-red-500 hover:text-red-400 border-red-500/30 hover:border-red-500 font-bold"
                  >
                    {isDeletingId === previewItem.publicId ? (
                      <>
                        <Loader2 size={13} className="animate-spin mr-1" /> Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 size={13} className="mr-1" /> Permanently Delete
                      </>
                    )}
                  </Button>

                  <div className="text-[11px] font-mono text-text-tertiary text-center pt-0.5">
                    <kbd className="px-1.5 py-0.5 bg-surface-secondary border border-border-default rounded text-[10px]">←</kbd> and <kbd className="px-1.5 py-0.5 bg-surface-secondary border border-border-default rounded text-[10px]">→</kbd> to navigate · <kbd className="px-1 py-0.5 bg-surface-secondary border border-border-default rounded text-[10px]">Esc</kbd> to close
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          7. MODAL B: UPLOAD NEW MEDIA
          ══════════════════════════════════════════════════════════════ */}
      {showUploadModal && (
        <div
          style={{ zIndex: 10000 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
          onClick={() => setShowUploadModal(false)}
        >
          <div
            className="w-full max-w-lg bg-surface-elevated border-2 border-text-primary dark:border-border-default rounded-xl shadow-[8px_8px_0px_0px_var(--accent-primary)] p-5 relative animate-[slideUp_0.2s_ease_forwards]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-3 border-b border-border-default mb-4">
              <div>
                <h3 className="font-heading font-extrabold text-base text-text-primary m-0">
                  Upload Media to Cloudinary
                </h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  Directly upload images, banners, or files to your chosen folder.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="p-1 rounded text-text-primary hover:bg-surface-secondary"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">
                  Destination Folder in Cloudinary
                </label>
                <input
                  type="text"
                  required
                  value={uploadFolder}
                  onChange={(e) => setUploadFolder(e.target.value)}
                  placeholder="e.g. uploads/events or mec-cc-web/banners"
                  className="w-full px-3 py-1.5 text-xs rounded border border-border-default bg-surface-primary text-text-primary font-mono focus:outline-none focus:border-accent-primary"
                />
                <span className="text-[10px] text-text-tertiary mt-1 block">
                  You can specify existing folders or create a new path (e.g. <code>uploads/events</code>).
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary mb-1.5">
                  Select Media File (Max 25MB)
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  id="media-file-input"
                  className="hidden"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                />

                {!uploadFile ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (e.dataTransfer.files?.[0]) setUploadFile(e.dataTransfer.files[0]);
                    }}
                    className="border-2 border-dashed border-border-default hover:border-accent-primary bg-surface-primary hover:bg-surface-secondary/70 rounded-xl p-5 transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-2 group shadow-sm hover:shadow-[3px_3px_0px_0px_var(--accent-primary)]"
                  >
                    <div className="w-10 h-10 rounded-full bg-accent-primary/10 border-2 border-accent-primary/30 text-accent-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-text-primary m-0">
                        <span className="text-accent-primary underline underline-offset-2">Click to browse file</span> or drag &amp; drop here
                      </p>
                      <p className="text-[11px] text-text-tertiary font-mono m-0 mt-0.5">
                        PNG, JPG, WebP, SVG, MP4, PDF (up to 25MB)
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-accent-primary bg-surface-secondary rounded-xl p-3 flex items-center justify-between gap-3 shadow-[3px_3px_0px_0px_var(--accent-primary)]">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-accent-primary/20 border border-accent-primary/40 text-accent-primary flex items-center justify-center shrink-0">
                        <FileText size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-text-primary truncate m-0 font-mono">
                          {uploadFile.name}
                        </p>
                        <p className="text-[10px] text-text-tertiary font-mono m-0 mt-0.5">
                          {(uploadFile.size / 1024 / 1024).toFixed(2)} MB · Ready to upload
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-2.5 py-1 text-xs font-bold rounded-md border border-border-default bg-surface-primary hover:bg-surface-elevated text-text-primary transition cursor-pointer"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setUploadFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        className="p-1.5 text-text-tertiary hover:text-red-500 rounded-md hover:bg-red-500/10 transition cursor-pointer"
                        title="Remove file"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border-default">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUploadModal(false)}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isUploading || !uploadFile}
                >
                  {isUploading ? (
                    <>
                      <Loader2 size={14} className="animate-spin mr-1.5" /> Uploading to CDN...
                    </>
                  ) : (
                    <>
                      <Upload size={14} className="mr-1.5" /> Start Upload
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          8. MODAL C: CREATE NEW FOLDER
          ══════════════════════════════════════════════════════════════ */}
      {showNewFolderModal && (
        <div
          style={{ zIndex: 10000 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
          onClick={() => setShowNewFolderModal(false)}
        >
          <div
            className="w-full max-w-md bg-surface-elevated border-2 border-text-primary dark:border-border-default rounded-xl shadow-[8px_8px_0px_0px_var(--accent-primary)] p-5 relative animate-[slideUp_0.2s_ease_forwards]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between pb-3 border-b border-border-default mb-4">
              <div>
                <h3 className="font-heading font-extrabold text-base text-text-primary m-0">
                  Create New Cloudinary Folder
                </h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  Organize your cloud media library under custom namespaces.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowNewFolderModal(false)}
                className="p-1 rounded text-text-primary hover:bg-surface-secondary"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateFolderSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">
                  Parent Directory
                </label>
                <Select
                  value={newFolderParent}
                  onChange={(val) => setNewFolderParent(val)}
                  options={[
                    { value: "uploads", label: "uploads (Current Root)" },
                    { value: "mec-cc-web", label: "mec-cc-web (New Standard Root)" },
                  ]}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">
                  Folder Name
                </label>
                <input
                  type="text"
                  required
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="e.g. hackathon-2026, workshops"
                  className="w-full px-3 py-1.5 text-xs rounded border border-border-default bg-surface-primary text-text-primary font-mono focus:outline-none focus:border-accent-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border-default">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewFolderModal(false)}
                  disabled={isCreatingFolder}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isCreatingFolder || !newFolderName.trim()}
                >
                  {isCreatingFolder ? (
                    <>
                      <Loader2 size={14} className="animate-spin mr-1.5" /> Creating...
                    </>
                  ) : (
                    <>
                      <FolderPlus size={14} className="mr-1.5" /> Create Folder
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          9. MODAL D: CONFIRM DELETE / MOVE TO TRASH
          ══════════════════════════════════════════════════════════════ */}
      {resourceToDelete && (
        <div
          style={{ zIndex: 11000 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
          onClick={() => !isDeletingId && setResourceToDelete(null)}
        >
          <div
            className="w-full max-w-md bg-surface-elevated border-2 border-text-primary dark:border-border-default rounded-xl shadow-[8px_8px_0px_0px_#ef4444] p-5 relative animate-[slideUp_0.2s_ease_forwards]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2.5 bg-red-500/10 border-2 border-red-500/30 rounded-xl text-red-500 shrink-0">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-base text-text-primary m-0">
                  Permanently Delete Media Asset?
                </h3>
                <p className="text-xs text-text-secondary mt-1">
                  This unlinked file will be completely wiped from Cloudinary CDN storage immediately. This action CANNOT be undone.
                </p>
              </div>
            </div>

            {/* Asset Preview Mini-Card */}
            <div className="p-2.5 rounded-lg bg-surface-secondary border border-border-default flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded bg-slate-950 border border-border-default overflow-hidden shrink-0 flex items-center justify-center">
                {resourceToDelete.resourceType === "video" ? (
                  <Video size={18} className="text-purple-400" />
                ) : resourceToDelete.resourceType === "raw" ? (
                  <FileText size={18} className="text-amber-400" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={getOptimizedThumbnailUrl(resourceToDelete.secureUrl, 80, 80, "fill")}
                    alt={resourceToDelete.filename}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold font-mono text-text-primary truncate m-0">{resourceToDelete.filename}</p>
                <p className="text-[10px] font-mono text-text-tertiary truncate m-0 mt-0.5">{resourceToDelete.folder} · {resourceToDelete.formattedSize}</p>
              </div>
            </div>

            {/* Warning if asset is currently linked to website */}
            {resourceToDelete.isLinked && resourceToDelete.linkedEntities && resourceToDelete.linkedEntities.length > 0 && (
              <div className="p-2.5 rounded-lg bg-amber-500/10 border-2 border-amber-500/40 text-amber-600 dark:text-amber-400 text-xs font-mono mb-4">
                <p className="m-0 font-bold flex items-center gap-1.5">
                  <AlertTriangle size={14} className="shrink-0 text-amber-500" /> Warning: Currently in use on the site!
                </p>
                <p className="m-0 mt-1 text-[11px] text-text-secondary leading-snug">
                  This media is actively used by:{" "}
                  <strong>{resourceToDelete.linkedEntities.map((e) => `${e.usage} ("${e.title}")`).join(", ")}</strong>.
                  Deleting it may break images for members and visitors.
                </p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border-default">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={!!isDeletingId}
                onClick={() => setResourceToDelete(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={!!isDeletingId}
                onClick={handleConfirmDelete}
                className="bg-red-500 hover:bg-red-600 text-white font-bold border-2 border-red-700 shadow-[3px_3px_0px_0px_#991b1b]"
              >
                {isDeletingId === resourceToDelete.publicId ? (
                  <>
                    <Loader2 size={13} className="animate-spin mr-1.5" /> Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={13} className="mr-1.5" /> Permanently Delete
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          10. MODAL E: CONFIRM BULK PERMANENT DELETE
          ══════════════════════════════════════════════════════════════ */}
      {showBulkDeleteModal && (
        <div
          style={{ zIndex: 11000 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
          onClick={() => !isBulkDeleting && setShowBulkDeleteModal(false)}
        >
          <div
            className="w-full max-w-md bg-surface-elevated border-2 border-text-primary dark:border-border-default rounded-xl shadow-[8px_8px_0px_0px_#ef4444] p-5 relative animate-[slideUp_0.2s_ease_forwards]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2.5 bg-red-500/10 border-2 border-red-500/30 rounded-xl text-red-500 shrink-0">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-base text-text-primary m-0">
                  Permanently Delete {selectedIds.size} Media Assets?
                </h3>
                <p className="text-xs text-text-secondary mt-1">
                  All {selectedIds.size} selected items will be completely erased from Cloudinary CDN storage immediately. This action CANNOT be undone.
                </p>
              </div>
            </div>

            {/* Warning alert */}
            <div className="p-2.5 rounded-lg bg-red-500/10 border-2 border-red-500/40 text-red-600 dark:text-red-400 text-xs font-mono mb-4">
              <p className="m-0 font-bold flex items-center gap-1.5">
                <AlertTriangle size={14} className="shrink-0 text-red-500" /> Irreversible Cloud Deletion
              </p>
              <p className="m-0 mt-1 text-[11px] text-text-secondary leading-snug">
                These files will be wiped directly from Cloudinary storage and CDN edge caches will be purged. Any external or un-tracked links using these URLs will stop loading.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border-default">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={isBulkDeleting}
                onClick={() => setShowBulkDeleteModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={isBulkDeleting}
                onClick={handleConfirmBulkDelete}
                className="bg-red-500 hover:bg-red-600 text-white font-bold border-2 border-red-700 shadow-[3px_3px_0px_0px_#991b1b]"
              >
                {isBulkDeleting ? (
                  <>
                    <Loader2 size={13} className="animate-spin mr-1.5" /> Deleting {selectedIds.size} items...
                  </>
                ) : (
                  <>
                    <Trash2 size={13} className="mr-1.5" /> Yes, Permanently Delete All ({selectedIds.size})
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
