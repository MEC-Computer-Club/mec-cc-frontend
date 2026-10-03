"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  Download,
  Eye,
  Filter,
  Calendar,
  GraduationCap,
  Layers,
  Plus,
  Trash2,
  Edit3,
  X,
  ExternalLink,
  ChevronDown,
  BookOpen,
  Sparkles,
  LayoutGrid,
  List,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FilePlus,
  Maximize2,
  Minimize2,
  UploadCloud,
  Loader2,
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  FileCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { SearchInput } from "@/components/ui/SearchInput";
import { api } from "@/lib/api";
import {
  QuestionArchiveItem,
  QuestionFiltersData,
  QuestionArchiveResponse,
} from "@/types/questionArchive";
import toast from "react-hot-toast";

const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
).replace(/\/+$/, "");

export function QuestionsArchiveClient() {
  const { user, isAdmin } = useAuth();

  // Filters State
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedSemester, setSelectedSemester] = useState<string>("all");
  const [selectedExamType, setSelectedExamType] = useState<string>("all");
  const [selectedFileType, setSelectedFileType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("year");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(12);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Data State
  const [questions, setQuestions] = useState<QuestionArchiveItem[]>([]);
  const [filterMeta, setFilterMeta] = useState<QuestionFiltersData>({
    departments: ["CSE", "EEE", "CE"],
    years: [2024, 2023, 2022, 2021],
    semesters: [1, 2, 3, 4, 5, 6, 7, 8],
    examTypes: ["Semester Final", "CT1", "CT2", "CT3", "Midterm", "Lab Final"],
    fileTypes: ["all", "pdf", "image"],
    courses: [],
    stats: { totalQuestions: 0, totalPdfs: 0, totalImages: 0 },
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    pages: 1,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [filtersLoading, setFiltersLoading] = useState<boolean>(true);

  // Preview Modal
  const [previewQuestion, setPreviewQuestion] = useState<QuestionArchiveItem | null>(null);
  const [isFullscreenPreview, setIsFullscreenPreview] = useState<boolean>(false);
  const [imageZoom, setImageZoom] = useState<number>(1);

  // Admin Upload / Edit Modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionArchiveItem | null>(null);

  // Form inputs with dynamic overrides
  const [uploadFormData, setUploadFormData] = useState({
    title: "",
    department: "CSE",
    customDepartment: "",
    isCustomDept: false,
    semester: 1,
    customSemester: "",
    isCustomSemester: false,
    year: new Date().getFullYear(),
    customYear: "",
    isCustomYear: false,
    session: "",
    examType: "Semester Final",
    customExamType: "",
    isCustomExamType: false,
    courseCode: "",
    courseName: "",
    description: "",
    tags: "",
    status: "published" as "published" | "draft" | "archived",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [isReplacingFile, setIsReplacingFile] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load dynamic filter metadata
  const fetchFilterMeta = useCallback(async () => {
    try {
      setFiltersLoading(true);
      const res = await api.get<{ success: boolean; data: QuestionFiltersData }>(
        "/api/questions/filters"
      );
      if (res && res.data) {
        setFilterMeta(res.data);
      }
    } catch (err) {
      console.warn("Could not fetch filter options:", err);
    } finally {
      setFiltersLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFilterMeta();
  }, [fetchFilterMeta]);

  // Available Years List (deduplicated, sorted descending)
  const availableYears = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const defaultYears = [
      currentYear + 1,
      currentYear,
      currentYear - 1,
      currentYear - 2,
      currentYear - 3,
      currentYear - 4,
      currentYear - 5,
      currentYear - 6,
    ];
    const combined = Array.from(new Set([...(filterMeta.years || []), ...defaultYears]));
    return combined.filter((y) => typeof y === "number" && !isNaN(y)).sort((a, b) => b - a);
  }, [filterMeta.years]);

  // Dynamic Course Filtering for current Department & Semester in the modal
  const availableCoursesForSemester = useMemo(() => {
    const dept = uploadFormData.isCustomDept
      ? uploadFormData.customDepartment.trim().toUpperCase()
      : uploadFormData.department?.trim().toUpperCase();
    const sem = uploadFormData.isCustomSemester
      ? parseInt(uploadFormData.customSemester, 10)
      : uploadFormData.semester;

    if (!dept || isNaN(sem)) return [];

    return (filterMeta.courses || []).filter(
      (c) =>
        c.department?.trim().toUpperCase() === dept &&
        Number(c.semester) === Number(sem)
    );
  }, [
    filterMeta.courses,
    uploadFormData.department,
    uploadFormData.customDepartment,
    uploadFormData.isCustomDept,
    uploadFormData.semester,
    uploadFormData.customSemester,
    uploadFormData.isCustomSemester,
  ]);

  // Fetch Questions
  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedDepartment !== "all") params.append("department", selectedDepartment);
      if (selectedYear !== "all") params.append("year", selectedYear);
      if (selectedSemester !== "all") params.append("semester", selectedSemester);
      if (selectedExamType !== "all") params.append("examType", selectedExamType);
      if (selectedFileType !== "all") params.append("fileType", selectedFileType);
      if (debouncedSearch.trim()) params.append("search", debouncedSearch.trim());
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      params.append("sortBy", sortBy);
      params.append("sortOrder", sortOrder);

      const res = await api.get<QuestionArchiveResponse>(
        `/api/questions?${params.toString()}`
      );
      if (res && res.data) {
        setQuestions(res.data);
        if (res.pagination) {
          setPagination(res.pagination);
        }
      }
    } catch (err: any) {
      console.error("Error fetching questions:", err);
      toast.error(err.message || "Failed to load question archive");
    } finally {
      setLoading(false);
    }
  }, [
    selectedDepartment,
    selectedYear,
    selectedSemester,
    selectedExamType,
    selectedFileType,
    debouncedSearch,
    page,
    limit,
    sortBy,
    sortOrder,
  ]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // Helper to resolve absolute URL for files
  const resolveFileUrl = useCallback((url: string) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    return `${API_BASE_URL}${url.startsWith("/") ? url : `/${url}`}`;
  }, []);

  // Check if item is an image
  const isImageFile = useCallback(
    (item: QuestionArchiveItem | { fileType?: string; mimeType?: string; fileUrl?: string; fileName?: string }) => {
      if (item.fileType === "image") return true;
      if (item.mimeType && item.mimeType.startsWith("image/")) return true;
      const name = item.fileName || item.fileUrl || "";
      return /\.(jpe?g|png|webp|gif|avif|bmp)$/i.test(name);
    },
    []
  );

  // Handle Download
  const handleDownload = async (item: QuestionArchiveItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const res = await api.post<{
        success: boolean;
        data: { fileUrl: string; fileName: string };
      }>(`/api/questions/${item._id}/download`, {});

      const targetUrl = resolveFileUrl(res?.data?.fileUrl || item.fileUrl);
      const link = document.createElement("a");
      link.href = targetUrl;
      const ext = isImageFile(item) ? "png" : "pdf";
      link.download = item.fileName || `${item.courseCode}_${item.year}_${item.examType}.${ext}`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Download started");
      setQuestions((prev) =>
        prev.map((q) =>
          q._id === item._id ? { ...q, downloadCount: q.downloadCount + 1 } : q
        )
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to download question paper");
    }
  };

  // Handle Open Preview Modal
  const handleOpenPreview = (item: QuestionArchiveItem) => {
    setPreviewQuestion(item);
    setImageZoom(1);
    setQuestions((prev) =>
      prev.map((q) => (q._id === item._id ? { ...q, viewCount: q.viewCount + 1 } : q))
    );
  };

  // Open Modal for Upload or Edit
  const handleOpenUploadModal = (itemToEdit?: QuestionArchiveItem) => {
    if (itemToEdit) {
      setEditingQuestion(itemToEdit);
      const isCustomD = !filterMeta.departments?.includes(itemToEdit.department);
      const isCustomS = itemToEdit.semester > 8;
      const isCustomE = !filterMeta.examTypes?.includes(itemToEdit.examType);
      const isCustomY = !filterMeta.years?.includes(itemToEdit.year);

      setUploadFormData({
        title: itemToEdit.title,
        department: isCustomD ? "CUSTOM" : itemToEdit.department,
        customDepartment: isCustomD ? itemToEdit.department : "",
        isCustomDept: isCustomD,
        semester: itemToEdit.semester,
        customSemester: isCustomS ? itemToEdit.semester.toString() : "",
        isCustomSemester: isCustomS,
        year: itemToEdit.year,
        customYear: isCustomY ? itemToEdit.year.toString() : "",
        isCustomYear: isCustomY,
        session: itemToEdit.session || "",
        examType: isCustomE ? "CUSTOM" : itemToEdit.examType,
        customExamType: isCustomE ? itemToEdit.examType : "",
        isCustomExamType: isCustomE,
        courseCode: itemToEdit.courseCode,
        courseName: itemToEdit.courseName,
        description: itemToEdit.description || "",
        tags: itemToEdit.tags?.join(", ") || "",
        status: itemToEdit.status,
      });
      setSelectedFile(null);
      setFilePreviewUrl(null);
      setIsReplacingFile(false);
    } else {
      setEditingQuestion(null);
      setUploadFormData({
        title: "",
        department: selectedDepartment !== "all" ? selectedDepartment : "CSE",
        customDepartment: "",
        isCustomDept: false,
        semester: selectedSemester !== "all" ? parseInt(selectedSemester, 10) : 1,
        customSemester: "",
        isCustomSemester: false,
        year: selectedYear !== "all" ? parseInt(selectedYear, 10) : new Date().getFullYear(),
        customYear: "",
        isCustomYear: false,
        session: "",
        examType: selectedExamType !== "all" ? selectedExamType : "Semester Final",
        customExamType: "",
        isCustomExamType: false,
        courseCode: "",
        courseName: "",
        description: "",
        tags: "",
        status: "published",
      });
      setSelectedFile(null);
      setFilePreviewUrl(null);
      setIsReplacingFile(true); // new entry must upload a file
    }
    setIsModalOpen(true);
  };

  // Handle local file selection and thumbnail generation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (file.type.startsWith("image/")) {
        setFilePreviewUrl(URL.createObjectURL(file));
      } else {
        setFilePreviewUrl(null);
      }
    }
  };

  // Select a course from the filtered semester course list
  const handleApplyCourse = (course: { courseCode: string; courseName: string }) => {
    setUploadFormData((prev) => {
      const currentYear = prev.isCustomYear ? prev.customYear || prev.year : prev.year;
      return {
        ...prev,
        courseCode: course.courseCode,
        courseName: course.courseName,
        title: prev.title.trim()
          ? prev.title
          : `${course.courseCode} ${prev.examType} Exam Question ${currentYear}`,
      };
    });
  };

  // Handle Form Submit
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const resolvedDept = uploadFormData.isCustomDept
      ? uploadFormData.customDepartment.trim().toUpperCase()
      : uploadFormData.department;

    const resolvedExamType = uploadFormData.isCustomExamType
      ? uploadFormData.customExamType.trim()
      : uploadFormData.examType;

    const resolvedSemester = uploadFormData.isCustomSemester
      ? parseInt(uploadFormData.customSemester, 10) || uploadFormData.semester
      : uploadFormData.semester;

    const resolvedYear = uploadFormData.isCustomYear
      ? parseInt(uploadFormData.customYear, 10)
      : uploadFormData.year;

    if (!resolvedDept) {
      toast.error("Please provide a department");
      return;
    }
    if (!resolvedExamType) {
      toast.error("Please provide an exam type");
      return;
    }
    if (!resolvedYear || isNaN(resolvedYear)) {
      toast.error("Please provide a valid exam year");
      return;
    }
    if (!uploadFormData.courseCode.trim()) {
      toast.error("Please enter a course code");
      return;
    }
    if (!uploadFormData.courseName.trim()) {
      toast.error("Please enter a course name");
      return;
    }
    if (!editingQuestion && !selectedFile) {
      toast.error("Please select a question PDF or Image file");
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("title", uploadFormData.title.trim());
      formData.append("department", resolvedDept);
      formData.append("semester", resolvedSemester.toString());
      formData.append("year", resolvedYear.toString());
      formData.append("session", uploadFormData.session.trim());
      formData.append("examType", resolvedExamType);
      formData.append("courseCode", uploadFormData.courseCode.trim().toUpperCase());
      formData.append("courseName", uploadFormData.courseName.trim());
      formData.append("description", uploadFormData.description.trim());
      formData.append("tags", uploadFormData.tags.trim());
      formData.append("status", uploadFormData.status);

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      if (editingQuestion) {
        await api.patch(`/api/questions/${editingQuestion._id}`, formData);
        toast.success("Question paper updated successfully!");
      } else {
        await api.post("/api/questions", formData);
        toast.success("Question paper archived successfully!");
      }

      setIsModalOpen(false);
      fetchQuestions();
      fetchFilterMeta();
    } catch (err: any) {
      console.error("Save error:", err);
      toast.error(err.message || "Failed to save question paper");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Question
  const handleDeleteQuestion = async (id: string) => {
    try {
      await api.delete(`/api/questions/${id}`);
      toast.success("Question paper deleted");
      setQuestions((prev) => prev.filter((q) => q._id !== id));
      fetchFilterMeta();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete question");
    }
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSelectedDepartment("all");
    setSelectedYear("all");
    setSelectedSemester("all");
    setSelectedExamType("all");
    setSelectedFileType("all");
    setSearchQuery("");
    setDebouncedSearch("");
    setSortBy("year");
    setSortOrder("desc");
    setPage(1);
  };

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedDepartment !== "all") count++;
    if (selectedYear !== "all") count++;
    if (selectedSemester !== "all") count++;
    if (selectedExamType !== "all") count++;
    if (selectedFileType !== "all") count++;
    if (debouncedSearch.trim()) count++;
    return count;
  }, [
    selectedDepartment,
    selectedYear,
    selectedSemester,
    selectedExamType,
    selectedFileType,
    debouncedSearch,
  ]);

  // Color mapper for exam types
  const getExamTypeBadge = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes("final")) {
      return "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30";
    }
    if (t.includes("ct1") || t === "ct 1") {
      return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30";
    }
    if (t.includes("ct2") || t === "ct 2") {
      return "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30";
    }
    if (t.includes("ct3") || t === "ct 3") {
      return "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30";
    }
    if (t.includes("quiz")) {
      return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
    }
    return "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30";
  };

  return (
    <div className="min-h-screen bg-surface-primary text-text-primary pb-20">
      {/* Header Section */}
      <section className="pt-8 pb-4">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border-default pb-6">
            <div className="max-w-3xl">
              <span className="kicker">Academic Resource</span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-text-primary my-3">
                Academic Vault (Questions Archive)
              </h1>
              <p className="text-base sm:text-lg text-text-secondary max-w-[640px] leading-relaxed">
                Comprehensive question bank for all academic years and engineering departments.
                Filter, view, and download semester final and class test (CT1, CT2, CT3, Quiz)
                questions in PDF or Image formats.
              </p>
            </div>

            {/* Quick Actions & Dynamic Stats */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {isAdmin && (
                <Button
                  onClick={() => handleOpenUploadModal()}
                  size="md"
                  variant="primary"
                  icon={<Plus size={18} />}
                >
                  Upload Question Paper
                </Button>
              )}

              <div className="inline-flex items-center gap-3.5 sm:gap-4 px-4 py-2 sm:px-5 sm:py-2.5 rounded-md bg-surface-elevated border border-black dark:border-border-default shadow-[4px_4px_0px_var(--accent-primary)] text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-sm bg-accent-primary/10 border border-accent-primary/25 flex items-center justify-center text-accent-primary shrink-0">
                    <BookOpen size={15} />
                  </div>
                  <div>
                    <span className="text-[10px] sm:text-[11px] font-semibold text-text-secondary uppercase tracking-wider block">
                      Total Papers
                    </span>
                    <span className="text-sm sm:text-base font-black text-text-primary leading-tight">
                      {pagination.total || filterMeta.stats?.totalQuestions || 0}
                    </span>
                  </div>
                </div>

                <div className="h-7 w-px bg-border-default" />

                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-sm bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shrink-0">
                    <GraduationCap size={15} />
                  </div>
                  <div>
                    <span className="text-[10px] sm:text-[11px] font-semibold text-text-secondary uppercase tracking-wider block">
                      Departments
                    </span>
                    <span className="text-sm sm:text-base font-black text-text-primary leading-tight">
                      {filterMeta.departments?.length || 3}
                    </span>
                  </div>
                </div>

                <div className="h-7 w-px bg-border-default" />

                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-sm bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
                    <Layers size={15} />
                  </div>
                  <div>
                    <span className="text-[10px] sm:text-[11px] font-semibold text-text-secondary uppercase tracking-wider block">
                      PDFs / Images
                    </span>
                    <span className="text-sm sm:text-base font-black text-text-primary leading-tight">
                      {filterMeta.stats?.totalPdfs ?? 0} / {filterMeta.stats?.totalImages ?? 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Filter & Content Section */}
      <div className="container mx-auto px-4 md:px-8 pt-6">
        {/* Dynamic Filters Bar */}
        <div className="bg-surface-elevated rounded-xl border border-black dark:border-border-default p-5 sm:p-6 shadow-[4px_4px_0px_var(--accent-primary)] mb-8 space-y-4">
          {/* Top row: Search, Format & Sort */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="flex-1 w-full">
              <SearchInput
                value={searchQuery}
                onChangeValue={setSearchQuery}
                onClear={() => setSearchQuery("")}
                placeholder="Search by course code (e.g. CSE-1101), title, subject, topic..."
                sizeVariant="md"
              />
            </div>

            {/* File Format Filter */}
            <div className="flex flex-wrap items-center gap-2" role="tablist">
              <Button
                type="button"
                isFlip
                role="tab"
                size="sm"
                variant={selectedFileType === "all" ? "primary" : "secondary"}
                onClick={() => {
                  setSelectedFileType("all");
                  setPage(1);
                }}
              >
                All Formats
              </Button>
              <Button
                type="button"
                isFlip
                role="tab"
                size="sm"
                variant={selectedFileType === "pdf" ? "primary" : "secondary"}
                icon={<FileText size={14} />}
                onClick={() => {
                  setSelectedFileType("pdf");
                  setPage(1);
                }}
              >
                PDF
              </Button>
              <Button
                type="button"
                isFlip
                role="tab"
                size="sm"
                variant={selectedFileType === "image" ? "primary" : "secondary"}
                icon={<ImageIcon size={14} />}
                onClick={() => {
                  setSelectedFileType("image");
                  setPage(1);
                }}
              >
                Images
              </Button>
            </div>

            {/* Sorting Select & View Mode */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select
                value={`${sortBy}-${sortOrder}`}
                onChange={(val) => {
                  const [field, order] = val.split("-");
                  setSortBy(field);
                  setSortOrder(order as "asc" | "desc");
                }}
                options={[
                  { value: "year-desc", label: "Year: Newest First" },
                  { value: "year-asc", label: "Year: Oldest First" },
                  { value: "semester-asc", label: "Semester: Ascending" },
                  { value: "semester-desc", label: "Semester: Descending" },
                  { value: "downloads-desc", label: "Most Downloaded" },
                  { value: "views-desc", label: "Most Viewed" },
                ]}
                size="sm"
                className="w-full sm:w-48"
              />

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1.5" role="tablist">
                <Button
                  type="button"
                  isFlip
                  role="tab"
                  size="sm"
                  variant={viewMode === "grid" ? "primary" : "secondary"}
                  onClick={() => setViewMode("grid")}
                  title="Grid View"
                  className="!w-9 !h-9 !px-0"
                >
                  <LayoutGrid size={16} />
                </Button>
                <Button
                  type="button"
                  isFlip
                  role="tab"
                  size="sm"
                  variant={viewMode === "table" ? "primary" : "secondary"}
                  onClick={() => setViewMode("table")}
                  title="List / Table View"
                  className="!w-9 !h-9 !px-0"
                >
                  <List size={16} />
                </Button>
              </div>

              {/* Reset Filters Button */}
              {activeFiltersCount > 0 && (
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={handleResetFilters}
                  icon={<RotateCcw size={14} />}
                  className="!text-rose-500 !border-rose-500 hover:!bg-rose-500/10 hover:!shadow-[4px_4px_0px_0px_#ef4444]"
                >
                  Reset ({activeFiltersCount})
                </Button>
              )}
            </div>
          </div>

          {/* Department Filter Pills (Completely dynamic) */}
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-border-default" role="tablist">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider mr-1">
              Department:
            </span>
            <Button
              type="button"
              isFlip
              role="tab"
              size="sm"
              variant={selectedDepartment === "all" ? "primary" : "secondary"}
              onClick={() => {
                setSelectedDepartment("all");
                setPage(1);
              }}
            >
              All Departments
            </Button>
            {filterMeta.departments?.map((dept) => (
              <Button
                key={dept}
                type="button"
                isFlip
                role="tab"
                size="sm"
                variant={selectedDepartment === dept ? "primary" : "secondary"}
                onClick={() => {
                  setSelectedDepartment(dept);
                  setPage(1);
                }}
              >
                {dept}
              </Button>
            ))}
          </div>

          {/* Exam Type & Year & Semester filter rows */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-border-default">
            {/* Exam Type */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                Exam Type
              </label>
              <Select
                value={selectedExamType}
                onChange={(val) => {
                  setSelectedExamType(val);
                  setPage(1);
                }}
                options={[
                  { value: "all", label: "All Exam Types (Final, CTs, etc.)" },
                  ...(filterMeta.examTypes?.map((type) => ({ value: type, label: type })) || []),
                ]}
                size="sm"
              />
            </div>

            {/* Year */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                Academic Year
              </label>
              <Select
                value={selectedYear}
                onChange={(val) => {
                  setSelectedYear(val);
                  setPage(1);
                }}
                options={[
                  { value: "all", label: "All Available Years" },
                  ...availableYears.map((yr) => ({ value: String(yr), label: `Year ${yr}` })),
                ]}
                size="sm"
              />
            </div>

            {/* Semester */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                Semester
              </label>
              <Select
                value={selectedSemester}
                onChange={(val) => {
                  setSelectedSemester(val);
                  setPage(1);
                }}
                options={[
                  { value: "all", label: "All Semesters" },
                  ...(filterMeta.semesters?.map((sem) => ({ value: String(sem), label: `Semester ${sem}` })) || []),
                ]}
                size="sm"
              />
            </div>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="py-24 text-center">
            <Loader2 className="animate-spin text-accent-primary mx-auto mb-4" size={36} />
            <p className="text-text-secondary text-sm">Loading question archive...</p>
          </div>
        ) : questions.length === 0 ? (
          <div className="py-16 text-center rounded-xl bg-surface-elevated border border-black dark:border-border-default p-8 shadow-[4px_4px_0px_var(--accent-primary)]">
            <FileText size={48} className="mx-auto text-text-tertiary mb-4 opacity-50" />
            <h3 className="text-xl font-black text-text-primary">No Question Papers Found</h3>
            <p className="text-text-secondary text-sm max-w-md mx-auto mt-1 mb-6">
              {activeFiltersCount > 0
                ? "Try clearing some filters or searching with different keywords."
                : "No question papers have been archived yet for this category."}
            </p>
            {activeFiltersCount > 0 ? (
              <Button
                type="button"
                onClick={handleResetFilters}
                size="md"
                variant="primary"
                icon={<RotateCcw size={16} />}
              >
                Reset All Filters
              </Button>
            ) : isAdmin ? (
              <Button
                type="button"
                onClick={() => handleOpenUploadModal()}
                size="md"
                variant="primary"
                icon={<Plus size={16} />}
              >
                Upload First Question Paper
              </Button>
            ) : null}
          </div>
        ) : viewMode === "grid" ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {questions.map((item) => {
              const isImg = isImageFile(item);
              return (
                <div
                  key={item._id}
                  onClick={() => handleOpenPreview(item)}
                  className="group relative flex flex-col justify-between rounded-xl bg-surface-elevated border border-black dark:border-border-default p-5 shadow-[4px_4px_0px_0px_black] dark:shadow-[4px_4px_0px_0px_var(--border-default)] hover:shadow-[4px_4px_0px_var(--accent-primary)] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-150 cursor-pointer"
                >
                  <div>
                    {/* Top badges: Course Code, File Format & Exam Type */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-surface-secondary border border-black dark:border-border-default text-text-primary group-hover:border-accent-primary transition-colors">
                          {item.courseCode}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                            isImg
                              ? "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/40"
                              : "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/40"
                          }`}
                        >
                          {isImg ? <ImageIcon size={11} /> : <FileText size={11} />}
                          {isImg ? "IMAGE" : "PDF"}
                        </span>
                      </div>

                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getExamTypeBadge(
                          item.examType
                        )}`}
                      >
                        {item.examType}
                      </span>
                    </div>

                    {/* Title & Course Name */}
                    <h3 className="font-bold text-base text-text-primary group-hover:text-accent-primary transition-colors line-clamp-1 mb-1">
                      {item.courseName}
                    </h3>
                    <p className="text-xs text-text-secondary line-clamp-2 mb-4 leading-relaxed">
                      {item.description || item.title}
                    </p>

                    {/* Meta Chips */}
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-text-secondary mb-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-secondary border border-border-default font-medium">
                        <GraduationCap size={12} className="text-accent-primary" />
                        {item.department}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-secondary border border-border-default font-medium">
                        <Layers size={12} className="text-cyan-500" />
                        Sem {item.semester}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-secondary border border-border-default font-medium">
                        <Calendar size={12} className="text-amber-500" />
                        {item.year}
                      </span>
                      {item.fileSize ? (
                        <span className="px-2.5 py-1 rounded-md bg-surface-secondary border border-border-default font-mono">
                          {(item.fileSize / 1024).toFixed(0)} KB
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {/* Footer stats & actions */}
                  <div className="pt-3 border-t border-border-default flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-text-secondary font-medium">
                      <span className="inline-flex items-center gap-1" title="Views">
                        <Eye size={13} /> {item.viewCount}
                      </span>
                      <span className="inline-flex items-center gap-1" title="Downloads">
                        <Download size={13} /> {item.downloadCount}
                      </span>
                    </div>

                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => handleDownload(item, e)}
                        title="Download Document"
                        className="!w-8 !h-8 !px-0"
                      >
                        <Download size={14} />
                      </Button>

                      {isAdmin && (
                        <>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenUploadModal(item);
                            }}
                            title="Edit Question"
                            className="!w-8 !h-8 !px-0 hover:!text-amber-500 hover:!border-amber-500"
                          >
                            <Edit3 size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm("Are you sure you want to delete this question paper?")) {
                                handleDeleteQuestion(item._id);
                              }
                            }}
                            title="Delete Question"
                            className="!w-8 !h-8 !px-0 hover:!text-rose-500 hover:!border-rose-500"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Table View */
          <div className="overflow-x-auto rounded-xl border border-black dark:border-border-default bg-surface-elevated shadow-[4px_4px_0px_var(--accent-primary)]">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-secondary text-text-secondary uppercase tracking-wider text-[11px] border-b border-black dark:border-border-default">
                <tr>
                  <th className="px-4 py-3 font-semibold">Format</th>
                  <th className="px-4 py-3 font-semibold">Course</th>
                  <th className="px-4 py-3 font-semibold">Title / Subject</th>
                  <th className="px-4 py-3 font-semibold">Dept</th>
                  <th className="px-4 py-3 font-semibold">Sem</th>
                  <th className="px-4 py-3 font-semibold">Year</th>
                  <th className="px-4 py-3 font-semibold">Exam Type</th>
                  <th className="px-4 py-3 font-semibold text-center">Stats</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default">
                {questions.map((item) => {
                  const isImg = isImageFile(item);
                  return (
                    <tr
                      key={item._id}
                      onClick={() => handleOpenPreview(item)}
                      className="hover:bg-surface-secondary/50 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                            isImg
                              ? "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/40"
                              : "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/40"
                          }`}
                        >
                          {isImg ? <ImageIcon size={11} /> : <FileText size={11} />}
                          {isImg ? "IMG" : "PDF"}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-text-primary">
                        {item.courseCode}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-text-primary">{item.courseName}</div>
                        <div className="text-text-secondary text-[11px] line-clamp-1">
                          {item.title}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-text-secondary font-medium">
                        {item.department}
                      </td>
                      <td className="px-4 py-3 text-text-secondary">Sem {item.semester}</td>
                      <td className="px-4 py-3 text-text-secondary">{item.year}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getExamTypeBadge(
                            item.examType
                          )}`}
                        >
                          {item.examType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-text-secondary">
                        <span className="inline-flex items-center gap-2">
                          <span title="Views">👁 {item.viewCount}</span>
                          <span title="Downloads">📥 {item.downloadCount}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={(e) => handleDownload(item, e)}
                            title="Download"
                            className="!w-8 !h-8 !px-0"
                          >
                            <Download size={14} />
                          </Button>
                          {isAdmin && (
                            <>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenUploadModal(item);
                                }}
                                title="Edit"
                                className="!w-8 !h-8 !px-0 hover:!text-amber-500 hover:!border-amber-500"
                              >
                                <Edit3 size={14} />
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (
                                    confirm(
                                      "Are you sure you want to delete this question paper?"
                                    )
                                  ) {
                                    handleDeleteQuestion(item._id);
                                  }
                                }}
                                title="Delete"
                                className="!w-8 !h-8 !px-0 hover:!text-rose-500 hover:!border-rose-500"
                              >
                                <Trash2 size={14} />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {pagination.pages > 1 && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border-default pt-4">
            <span className="text-xs text-text-secondary font-medium">
              Showing page {pagination.page} of {pagination.pages} ({pagination.total} items)
            </span>
            <div className="flex items-center gap-1.5">
              <Button
                size="sm"
                variant="secondary"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((pNum) => (
                <Button
                  key={pNum}
                  isFlip
                  size="sm"
                  variant={pNum === page ? "primary" : "secondary"}
                  onClick={() => setPage(pNum)}
                  className="!w-9 !h-9 !px-0"
                >
                  {pNum}
                </Button>
              ))}
              <Button
                size="sm"
                variant="secondary"
                disabled={page >= pagination.pages}
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* PDF / Image Preview Modal */}
      {previewQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div
            className={`relative flex flex-col bg-surface-elevated text-text-primary border border-black dark:border-border-default rounded-xl shadow-[8px_8px_0px_var(--accent-primary)] overflow-hidden transition-all duration-300 ${
              isFullscreenPreview
                ? "w-full h-full rounded-none"
                : "w-full max-w-5xl h-[85vh]"
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-black dark:border-border-default bg-surface-secondary">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-surface-elevated border border-black dark:border-border-default text-accent-primary">
                  {previewQuestion.courseCode}
                </span>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-text-primary line-clamp-1">
                    {previewQuestion.courseName}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-text-secondary font-medium">
                    <span>{previewQuestion.department}</span>
                    <span>•</span>
                    <span>Semester {previewQuestion.semester}</span>
                    <span>•</span>
                    <span>{previewQuestion.examType}</span>
                    <span>•</span>
                    <span>{previewQuestion.year}</span>
                    <span>•</span>
                    <span className="uppercase font-bold text-[10px]">
                      {isImageFile(previewQuestion) ? "Image Format" : "PDF Document"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isImageFile(previewQuestion) && (
                  <div className="flex items-center gap-1 bg-surface-elevated px-2 py-1 rounded-md border border-black dark:border-border-default text-xs">
                    <button
                      type="button"
                      onClick={() => setImageZoom((z) => Math.max(0.5, z - 0.25))}
                      className="p-1 hover:text-accent-primary text-text-secondary cursor-pointer"
                      title="Zoom Out"
                    >
                      <ZoomOut size={14} />
                    </button>
                    <span className="w-10 text-center font-mono text-[11px] text-text-primary font-bold">
                      {Math.round(imageZoom * 100)}%
                    </span>
                    <button
                      type="button"
                      onClick={() => setImageZoom((z) => Math.min(3, z + 0.25))}
                      className="p-1 hover:text-accent-primary text-text-secondary cursor-pointer"
                      title="Zoom In"
                    >
                      <ZoomIn size={14} />
                    </button>
                  </div>
                )}

                <Button
                  size="sm"
                  variant="primary"
                  icon={<Download size={14} />}
                  onClick={() => handleDownload(previewQuestion)}
                >
                  Download
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => window.open(resolveFileUrl(previewQuestion.fileUrl), "_blank")}
                  title="Open Raw File"
                  className="!w-9 !h-9 !px-0"
                >
                  <ExternalLink size={15} />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setIsFullscreenPreview(!isFullscreenPreview)}
                  title={isFullscreenPreview ? "Exit Fullscreen" : "Fullscreen"}
                  className="!w-9 !h-9 !px-0"
                >
                  {isFullscreenPreview ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setPreviewQuestion(null)}
                  title="Close Preview"
                  className="!w-9 !h-9 !px-0"
                >
                  <X size={16} />
                </Button>
              </div>
            </div>

            {/* Modal Body: PDF iframe or Zoomable Image Viewer */}
            <div className="flex-1 w-full bg-surface-secondary/70 overflow-auto relative flex items-center justify-center p-4">
              {isImageFile(previewQuestion) ? (
                <div className="max-w-full max-h-full flex items-center justify-center transition-transform duration-150">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resolveFileUrl(previewQuestion.fileUrl)}
                    alt={previewQuestion.title}
                    style={{ transform: `scale(${imageZoom})`, transformOrigin: "center center" }}
                    className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-xl transition-transform duration-150"
                  />
                </div>
              ) : (
                <iframe
                  src={`${resolveFileUrl(previewQuestion.fileUrl)}#toolbar=1&navpanes=0`}
                  className="w-full h-full border-0 bg-white rounded-lg shadow-sm"
                  title={previewQuestion.title}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Admin Upload / Edit Question Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-surface-elevated text-text-primary border border-black dark:border-border-default rounded-xl shadow-[8px_8px_0px_var(--accent-primary)] p-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-black dark:border-border-default mb-5">
              <div className="flex items-center gap-2">
                <FilePlus className="text-accent-primary" size={22} />
                <h3 className="text-lg font-bold text-text-primary">
                  {editingQuestion ? "Edit Question Paper" : "Upload Exam Question Paper"}
                </h3>
              </div>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setIsModalOpen(false)}
                title="Close"
                className="!w-8 !h-8 !px-0"
              >
                <X size={16} />
              </Button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* CURRENT FILE PREVIEW (Crucial when editing!) */}
              {editingQuestion && (
                <div className="rounded-xl border border-black dark:border-border-default bg-surface-secondary p-3.5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-accent-primary flex items-center gap-1.5">
                      <FileCheck size={14} /> Current Uploaded File
                    </span>
                    <Button
                      type="button"
                      size="sm"
                      variant={isReplacingFile ? "secondary" : "primary"}
                      onClick={() => setIsReplacingFile(!isReplacingFile)}
                      className={isReplacingFile ? "!text-rose-500 !border-rose-500" : ""}
                    >
                      {isReplacingFile ? "Keep Current File" : "Replace With New File"}
                    </Button>
                  </div>

                  <div className="flex items-center gap-3 bg-surface-elevated p-2.5 rounded-lg border border-black dark:border-border-default">
                    {isImageFile(editingQuestion) ? (
                      <div className="w-14 h-14 rounded-md overflow-hidden bg-surface-secondary border border-border-default shrink-0 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={resolveFileUrl(editingQuestion.fileUrl)}
                          alt="Current"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-md bg-red-500/10 border border-red-500/20 text-red-500 shrink-0 flex items-center justify-center">
                        <FileText size={24} />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-text-primary truncate">
                        {editingQuestion.fileName || "exam-question-document"}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-text-secondary mt-0.5">
                        <span className="uppercase font-semibold">
                          {isImageFile(editingQuestion) ? "Image" : "PDF"}
                        </span>
                        {editingQuestion.fileSize ? (
                          <>
                            <span>•</span>
                            <span>{(editingQuestion.fileSize / 1024).toFixed(0)} KB</span>
                          </>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => window.open(resolveFileUrl(editingQuestion.fileUrl), "_blank")}
                        className="!h-8 !text-xs !px-2.5"
                      >
                        View File
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => handleDownload(editingQuestion)}
                        title="Download"
                        className="!w-8 !h-8 !px-0"
                      >
                        <Download size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Department & Semester (With Custom Inputs!) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Department */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-text-primary">
                      Department *
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setUploadFormData((prev) => ({
                          ...prev,
                          isCustomDept: !prev.isCustomDept,
                        }))
                      }
                      className="text-[11px] text-accent-primary hover:underline font-medium"
                    >
                      {uploadFormData.isCustomDept ? "Choose from list" : "+ Create new department"}
                    </button>
                  </div>

                  {uploadFormData.isCustomDept ? (
                    <input
                      type="text"
                      value={uploadFormData.customDepartment}
                      onChange={(e) =>
                        setUploadFormData({
                          ...uploadFormData,
                          customDepartment: e.target.value.toUpperCase(),
                        })
                      }
                      placeholder="e.g. ME, BME, ARCH..."
                      className="w-full h-10 px-3 rounded-md bg-surface-primary border border-accent-primary text-xs uppercase text-text-primary focus:outline-none focus:shadow-[2px_2px_0px_var(--accent-primary)] transition-all"
                      required
                    />
                  ) : (
                    <Select
                      value={uploadFormData.department}
                      onChange={(val) => {
                        if (val === "CUSTOM") {
                          setUploadFormData({ ...uploadFormData, isCustomDept: true });
                        } else {
                          setUploadFormData({
                            ...uploadFormData,
                            department: val,
                            isCustomDept: false,
                          });
                        }
                      }}
                      options={[
                        ...(filterMeta.departments?.map((dept) => ({ value: dept, label: dept })) || []),
                        { value: "CUSTOM", label: "+ Add New Custom Department..." },
                      ]}
                      size="md"
                    />
                  )}
                </div>

                {/* Semester */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-text-primary">
                      Semester *
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setUploadFormData((prev) => ({
                          ...prev,
                          isCustomSemester: !prev.isCustomSemester,
                        }))
                      }
                      className="text-[11px] text-accent-primary hover:underline font-medium"
                    >
                      {uploadFormData.isCustomSemester ? "Standard (1-8)" : "+ Custom semester"}
                    </button>
                  </div>

                  {uploadFormData.isCustomSemester ? (
                    <input
                      type="number"
                      value={uploadFormData.customSemester}
                      onChange={(e) =>
                        setUploadFormData({
                          ...uploadFormData,
                          customSemester: e.target.value,
                        })
                      }
                      min={1}
                      max={20}
                      placeholder="e.g. 9, 10..."
                      className="w-full h-10 px-3 rounded-md bg-surface-primary border border-accent-primary text-xs text-text-primary focus:outline-none focus:shadow-[2px_2px_0px_var(--accent-primary)] transition-all"
                      required
                    />
                  ) : (
                    <Select
                      value={String(uploadFormData.semester)}
                      onChange={(val) =>
                        setUploadFormData({
                          ...uploadFormData,
                          semester: parseInt(val, 10),
                        })
                      }
                      options={[1, 2, 3, 4, 5, 6, 7, 8].map((s) => ({
                        value: String(s),
                        label: `Semester ${s}`,
                      }))}
                      size="md"
                    />
                  )}
                </div>
              </div>

              {/* AUTOMATIC COURSE FILTERING FOR THIS DEPARTMENT & SEMESTER */}
              <div className="p-3.5 rounded-xl bg-surface-secondary border border-black dark:border-border-default space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                    <BookOpen size={14} className="text-accent-primary" />
                    <span>
                      {uploadFormData.isCustomDept
                        ? uploadFormData.customDepartment || "Custom Dept"
                        : uploadFormData.department}{" "}
                      Semester {uploadFormData.semester} Courses
                      {availableCoursesForSemester.length > 0
                        ? ` (${availableCoursesForSemester.length} available)`
                        : ""}
                    </span>
                  </label>
                  {availableCoursesForSemester.length > 0 && (
                    <span className="text-[11px] text-text-secondary">
                      Select below to auto-fill
                    </span>
                  )}
                </div>

                {availableCoursesForSemester.length > 0 ? (
                  <>
                    <Select
                      value=""
                      onChange={(val) => {
                        if (!val) return;
                        const c = availableCoursesForSemester.find(
                          (item) => item.courseCode === val
                        );
                        if (c) {
                          handleApplyCourse(c);
                        }
                      }}
                      options={[
                        { value: "", label: "-- Choose an official semester course to auto-fill --" },
                        ...availableCoursesForSemester.map((c) => ({
                          value: c.courseCode,
                          label: `${c.courseCode} — ${c.courseName}${c.courseCredit ? ` (${c.courseCredit} Cr)` : ""}`,
                        })),
                      ]}
                      placeholder="-- Choose an official semester course to auto-fill --"
                      size="md"
                    />

                    {/* Quick clickable chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1" role="tablist">
                      {availableCoursesForSemester.map((c) => {
                        const isSelected = uploadFormData.courseCode === c.courseCode;
                        return (
                          <Button
                            type="button"
                            key={c.courseCode}
                            isFlip
                            role="tab"
                            size="sm"
                            variant={isSelected ? "primary" : "secondary"}
                            onClick={() => handleApplyCourse(c)}
                            className="!text-[11px] !h-8 !px-2.5"
                          >
                            <span className="font-mono font-bold">{c.courseCode}</span>
                            <span className="truncate max-w-[130px]">({c.courseName})</span>
                          </Button>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <p className="text-[11px] text-text-secondary italic">
                    No predefined courses recorded for this department & semester yet. You can manually enter the course code and title below.
                  </p>
                )}
              </div>

              {/* Course Code & Name Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1.5">
                    Course Code (e.g. CSE-1101) *
                  </label>
                  <input
                    type="text"
                    value={uploadFormData.courseCode}
                    onChange={(e) =>
                      setUploadFormData({ ...uploadFormData, courseCode: e.target.value })
                    }
                    placeholder="CSE-1101"
                    className="w-full h-10 px-3 rounded-md bg-surface-primary border border-black dark:border-border-default text-xs uppercase text-text-primary focus:outline-none focus:border-accent-primary focus:shadow-[2px_2px_0px_var(--accent-primary)] transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1.5">
                    Course Name *
                  </label>
                  <input
                    type="text"
                    value={uploadFormData.courseName}
                    onChange={(e) =>
                      setUploadFormData({ ...uploadFormData, courseName: e.target.value })
                    }
                    placeholder="e.g. Fundamentals of Programming"
                    className="w-full h-10 px-3 rounded-md bg-surface-primary border border-black dark:border-border-default text-xs text-text-primary focus:outline-none focus:border-accent-primary focus:shadow-[2px_2px_0px_var(--accent-primary)] transition-all"
                    required
                  />
                </div>
              </div>

              {/* Year & Exam Type (With Selectable & Custom Inputs!) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Exam Year */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-text-primary">
                      Exam Year *
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setUploadFormData((prev) => ({
                          ...prev,
                          isCustomYear: !prev.isCustomYear,
                        }))
                      }
                      className="text-[11px] text-accent-primary hover:underline font-medium"
                    >
                      {uploadFormData.isCustomYear ? "Choose from list" : "+ Custom year"}
                    </button>
                  </div>

                  {uploadFormData.isCustomYear ? (
                    <input
                      type="number"
                      value={uploadFormData.customYear}
                      onChange={(e) =>
                        setUploadFormData({
                          ...uploadFormData,
                          customYear: e.target.value,
                        })
                      }
                      min={2000}
                      max={2050}
                      placeholder="e.g. 2028, 2029..."
                      className="w-full h-10 px-3 rounded-md bg-surface-primary text-text-primary border border-accent-primary focus:outline-none focus:shadow-[2px_2px_0px_var(--accent-primary)] text-xs transition-all"
                      required
                    />
                  ) : (
                    <Select
                      value={String(uploadFormData.year)}
                      onChange={(val) => {
                        if (val === "CUSTOM") {
                          setUploadFormData({ ...uploadFormData, isCustomYear: true });
                        } else {
                          setUploadFormData({
                            ...uploadFormData,
                            year: parseInt(val, 10),
                            isCustomYear: false,
                          });
                        }
                      }}
                      options={[
                        ...availableYears.map((yr) => ({ value: String(yr), label: `Year ${yr}` })),
                        { value: "CUSTOM", label: "+ Add Custom Year..." },
                      ]}
                      size="md"
                    />
                  )}
                </div>

                {/* Exam Type */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-text-primary">
                      Exam Type *
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setUploadFormData((prev) => ({
                          ...prev,
                          isCustomExamType: !prev.isCustomExamType,
                        }))
                      }
                      className="text-[11px] text-accent-primary hover:underline font-medium"
                    >
                      {uploadFormData.isCustomExamType ? "Standard types" : "+ Custom exam type"}
                    </button>
                  </div>

                  {uploadFormData.isCustomExamType ? (
                    <input
                      type="text"
                      value={uploadFormData.customExamType}
                      onChange={(e) =>
                        setUploadFormData({
                          ...uploadFormData,
                          customExamType: e.target.value,
                        })
                      }
                      placeholder="e.g. CT4, Retake, Quiz, Model Test..."
                      className="w-full h-10 px-3 rounded-md bg-surface-primary border border-accent-primary text-xs text-text-primary focus:outline-none focus:shadow-[2px_2px_0px_var(--accent-primary)] transition-all"
                      required
                    />
                  ) : (
                    <Select
                      value={uploadFormData.examType}
                      onChange={(val) => {
                        if (val === "CUSTOM") {
                          setUploadFormData({ ...uploadFormData, isCustomExamType: true });
                        } else {
                          setUploadFormData({
                            ...uploadFormData,
                            examType: val,
                            isCustomExamType: false,
                          });
                        }
                      }}
                      options={[
                        { value: "Semester Final", label: "Semester Final" },
                        { value: "CT1", label: "CT1" },
                        { value: "CT2", label: "CT2" },
                        { value: "CT3", label: "CT3" },
                        { value: "Midterm", label: "Midterm" },
                        { value: "Lab Final", label: "Lab Final" },
                        { value: "Quiz", label: "Quiz" },
                        { value: "Make-up", label: "Make-up Exam" },
                        { value: "CUSTOM", label: "+ Add Custom Exam Type..." },
                      ]}
                      size="md"
                    />
                  )}
                </div>
              </div>

              {/* PDF or Image Document Upload Area */}
              {(!editingQuestion || isReplacingFile) && (
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1.5">
                    {editingQuestion
                      ? "Upload Replacement Document or Image"
                      : "Question Document or Image *"}
                  </label>
                  <div className="relative border-2 border-dashed border-black dark:border-border-default hover:border-accent-primary rounded-xl p-5 text-center bg-surface-secondary/50 transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf,image/*,.jpg,.jpeg,.png,.webp,.gif,.avif"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <UploadCloud size={30} className="mx-auto text-accent-primary mb-2" />
                    {selectedFile ? (
                      <div className="space-y-1">
                        {filePreviewUrl ? (
                          <div className="w-16 h-16 mx-auto rounded-md overflow-hidden mb-2 border border-black dark:border-border-default">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={filePreviewUrl}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <FileText size={24} className="mx-auto text-red-500 mb-1" />
                        )}
                        <p className="text-xs font-semibold text-text-primary">{selectedFile.name}</p>
                        <p className="text-[11px] text-text-secondary font-mono">
                          {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.type || "Document"}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs font-semibold text-text-primary">
                          Drop question paper PDF or Images here, or click to browse
                        </p>
                        <p className="text-[11px] text-text-secondary mt-0.5">
                          PDF, JPG, PNG, WEBP, GIF up to 25MB supported
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Title & Session */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1.5">
                    Session (Optional)
                  </label>
                  <input
                    type="text"
                    value={uploadFormData.session}
                    onChange={(e) =>
                      setUploadFormData({ ...uploadFormData, session: e.target.value })
                    }
                    placeholder="e.g. 2023-24"
                    className="w-full h-10 px-3 rounded-md bg-surface-primary border border-black dark:border-border-default text-xs text-text-primary focus:outline-none focus:border-accent-primary focus:shadow-[2px_2px_0px_var(--accent-primary)] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1.5">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={uploadFormData.tags}
                    onChange={(e) =>
                      setUploadFormData({ ...uploadFormData, tags: e.target.value })
                    }
                    placeholder="Algorithms, Graphs, Final, 2024"
                    className="w-full h-10 px-3 rounded-md bg-surface-primary border border-black dark:border-border-default text-xs text-text-primary focus:outline-none focus:border-accent-primary focus:shadow-[2px_2px_0px_var(--accent-primary)] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1.5">
                  Remarks / Description (Optional)
                </label>
                <textarea
                  rows={2}
                  value={uploadFormData.description}
                  onChange={(e) =>
                    setUploadFormData({ ...uploadFormData, description: e.target.value })
                  }
                  placeholder="Additional context, hints, handwritten note or syllabus changes..."
                  className="w-full p-3 rounded-md bg-surface-primary border border-black dark:border-border-default text-xs text-text-primary focus:outline-none focus:border-accent-primary focus:shadow-[2px_2px_0px_var(--accent-primary)] transition-all"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-default">
                <Button
                  type="button"
                  size="md"
                  variant="secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="md"
                  variant="primary"
                  disabled={isSubmitting}
                  icon={isSubmitting ? <Loader2 size={16} className="animate-spin" /> : undefined}
                >
                  {editingQuestion ? "Save Changes" : "Archive Question"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
