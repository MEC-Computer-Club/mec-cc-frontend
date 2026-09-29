"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Search,
  Download,
  Eye,
  Trash2,
  Edit3,
  X,
  ExternalLink,
  UploadCloud,
  Loader2,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  Calendar,
  Layers,
  GraduationCap,
  BookOpen,
  Image as ImageIcon,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
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

export function QuestionArchiveTab() {
  const [questions, setQuestions] = useState<QuestionArchiveItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterMeta, setFilterMeta] = useState<QuestionFiltersData>({
    departments: ["CSE", "EEE", "CE"],
    years: [2024, 2023, 2022, 2021],
    semesters: [1, 2, 3, 4, 5, 6, 7, 8],
    examTypes: ["Semester Final", "CT1", "CT2", "CT3", "Midterm", "Lab Final"],
    courses: [],
    stats: { totalQuestions: 0, totalPdfs: 0, totalImages: 0 },
  });

  // Filters
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [semesterFilter, setSemesterFilter] = useState<string>("all");
  const [examTypeFilter, setExamTypeFilter] = useState<string>("all");
  const [fileTypeFilter, setFileTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<QuestionArchiveItem | null>(null);

  // Form inputs with custom creation overrides
  const [formData, setFormData] = useState({
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

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Load Filters
  const loadFilters = useCallback(async () => {
    try {
      const res = await api.get<{ success: boolean; data: QuestionFiltersData }>(
        "/api/questions/filters"
      );
      if (res && res.data) {
        setFilterMeta(res.data);
      }
    } catch (err) {
      console.warn("Filters load error:", err);
    }
  }, []);

  useEffect(() => {
    loadFilters();
  }, [loadFilters]);

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
    const dept = formData.isCustomDept
      ? formData.customDepartment.trim().toUpperCase()
      : formData.department?.trim().toUpperCase();
    const sem = formData.isCustomSemester
      ? parseInt(formData.customSemester, 10)
      : formData.semester;

    if (!dept || isNaN(sem)) return [];

    return (filterMeta.courses || []).filter(
      (c) =>
        c.department?.trim().toUpperCase() === dept &&
        Number(c.semester) === Number(sem)
    );
  }, [
    filterMeta.courses,
    formData.department,
    formData.customDepartment,
    formData.isCustomDept,
    formData.semester,
    formData.customSemester,
    formData.isCustomSemester,
  ]);

  const handleApplyCourse = (course: { courseCode: string; courseName: string }) => {
    setFormData((prev) => {
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

  // Load Questions
  const loadQuestions = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (deptFilter !== "all") params.append("department", deptFilter);
      if (yearFilter !== "all") params.append("year", yearFilter);
      if (semesterFilter !== "all") params.append("semester", semesterFilter);
      if (examTypeFilter !== "all") params.append("examType", examTypeFilter);
      if (fileTypeFilter !== "all") params.append("fileType", fileTypeFilter);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (debouncedSearch.trim()) params.append("search", debouncedSearch.trim());
      params.append("page", page.toString());
      params.append("limit", "15");

      const res = await api.get<QuestionArchiveResponse>(`/api/questions?${params.toString()}`);
      if (res && res.data) {
        setQuestions(res.data);
        if (res.pagination) {
          setPagination({ total: res.pagination.total, pages: res.pagination.pages });
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load questions");
    } finally {
      setLoading(false);
    }
  }, [deptFilter, yearFilter, semesterFilter, examTypeFilter, fileTypeFilter, statusFilter, debouncedSearch, page]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const resolveUrl = useCallback((url: string) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `${API_BASE_URL}${url.startsWith("/") ? url : `/${url}`}`;
  }, []);

  const isImageFile = useCallback((item: QuestionArchiveItem | { fileType?: string; mimeType?: string; fileUrl?: string; fileName?: string }) => {
    if (item.fileType === "image") return true;
    if (item.mimeType && item.mimeType.startsWith("image/")) return true;
    const name = item.fileName || item.fileUrl || "";
    return /\.(jpe?g|png|webp|gif|avif|bmp)$/i.test(name);
  }, []);

  const handleOpenModal = (item?: QuestionArchiveItem) => {
    if (item) {
      setEditingItem(item);
      const isCustomD = !filterMeta.departments?.includes(item.department);
      const isCustomS = item.semester > 8;
      const isCustomE = !filterMeta.examTypes?.includes(item.examType);
      const isCustomY = !filterMeta.years?.includes(item.year);

      setFormData({
        title: item.title,
        department: isCustomD ? "CUSTOM" : item.department,
        customDepartment: isCustomD ? item.department : "",
        isCustomDept: isCustomD,
        semester: item.semester,
        customSemester: isCustomS ? item.semester.toString() : "",
        isCustomSemester: isCustomS,
        year: item.year,
        customYear: isCustomY ? item.year.toString() : "",
        isCustomYear: isCustomY,
        session: item.session || "",
        examType: isCustomE ? "CUSTOM" : item.examType,
        customExamType: isCustomE ? item.examType : "",
        isCustomExamType: isCustomE,
        courseCode: item.courseCode,
        courseName: item.courseName,
        description: item.description || "",
        tags: item.tags?.join(", ") || "",
        status: item.status,
      });
      setSelectedFile(null);
      setFilePreviewUrl(null);
      setIsReplacingFile(false);
    } else {
      setEditingItem(null);
      setFormData({
        title: "",
        department: deptFilter !== "all" ? deptFilter : "CSE",
        customDepartment: "",
        isCustomDept: false,
        semester: semesterFilter !== "all" ? parseInt(semesterFilter, 10) : 1,
        customSemester: "",
        isCustomSemester: false,
        year: yearFilter !== "all" ? parseInt(yearFilter, 10) : new Date().getFullYear(),
        customYear: "",
        isCustomYear: false,
        session: "",
        examType: examTypeFilter !== "all" ? examTypeFilter : "Semester Final",
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
      setIsReplacingFile(true);
    }
    setIsModalOpen(true);
  };

  const handleCourseAutoFill = (code: string) => {
    const course = filterMeta.courses.find(
      (c) => c.courseCode.toLowerCase() === code.toLowerCase()
    );
    if (course) {
      setFormData((prev) => ({
        ...prev,
        courseCode: course.courseCode,
        courseName: course.courseName,
        department: course.department || prev.department,
        semester: course.semester || prev.semester,
      }));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const resolvedDept = formData.isCustomDept
      ? formData.customDepartment.trim().toUpperCase()
      : formData.department;

    const resolvedExamType = formData.isCustomExamType
      ? formData.customExamType.trim()
      : formData.examType;

    const resolvedSemester = formData.isCustomSemester
      ? parseInt(formData.customSemester, 10) || formData.semester
      : formData.semester;

    const resolvedYear = formData.isCustomYear
      ? parseInt(formData.customYear, 10)
      : formData.year;

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
    if (!formData.courseCode.trim() || !formData.courseName.trim()) {
      toast.error("Please enter course code and course name");
      return;
    }
    if (!editingItem && !selectedFile) {
      toast.error("Please select a question PDF or Image file");
      return;
    }

    try {
      setIsSubmitting(true);
      const data = new FormData();
      data.append("title", formData.title.trim());
      data.append("department", resolvedDept);
      data.append("semester", resolvedSemester.toString());
      data.append("year", resolvedYear.toString());
      data.append("session", formData.session.trim());
      data.append("examType", resolvedExamType);
      data.append("courseCode", formData.courseCode.trim().toUpperCase());
      data.append("courseName", formData.courseName.trim());
      data.append("description", formData.description.trim());
      data.append("tags", formData.tags.trim());
      data.append("status", formData.status);

      if (selectedFile) {
        data.append("file", selectedFile);
      }

      if (editingItem) {
        await api.patch(`/api/questions/${editingItem._id}`, data);
        toast.success("Question paper updated successfully");
      } else {
        await api.post("/api/questions", data);
        toast.success("Question paper uploaded successfully");
      }

      setIsModalOpen(false);
      loadQuestions();
      loadFilters();
    } catch (err: any) {
      toast.error(err.message || "Failed to save question paper");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question paper? This will also remove the stored file.")) {
      return;
    }
    try {
      await api.delete(`/api/questions/${id}`);
      toast.success("Question paper deleted");
      setQuestions((prev) => prev.filter((q) => q._id !== id));
      loadFilters();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete question paper");
    }
  };

  const handleDownload = async (item: QuestionArchiveItem) => {
    try {
      await api.post(`/api/questions/${item._id}/download`, {});
      window.open(resolveUrl(item.fileUrl), "_blank");
    } catch {
      window.open(resolveUrl(item.fileUrl), "_blank");
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-surface-primary border-2 border-text-primary dark:border-border-default rounded-lg shadow-[3px_3px_0px_0px_var(--border-default)]">
        <div>
          <h2 className="text-base font-mono font-bold text-text-primary flex items-center gap-2">
            <FileText size={18} className="text-accent-primary" />
            Questions Archive Management
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Upload, update, and manage archived exam questions (PDF and Images) with custom departments, semesters, exam types, and years.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/utilities/questions-archive"
            target="_blank"
            className="inline-flex items-center gap-1 px-3 py-1.5 font-mono text-xs font-bold rounded border border-border-default hover:bg-surface-secondary text-text-secondary hover:text-text-primary transition-colors"
          >
            <span>Public View</span>
            <ExternalLink size={13} />
          </Link>

          <Button
            onClick={() => handleOpenModal()}
            size="sm"
            className="flex items-center gap-1.5"
          >
            <Plus size={16} />
            Upload Question
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-3.5 bg-surface-primary border-2 border-text-primary dark:border-border-default rounded-lg shadow-[3px_3px_0px_0px_var(--border-default)] space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-2.5">
          {/* Search */}
          <div className="sm:col-span-2 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search code, title, topic..."
              className="w-full pl-8 pr-3 py-1.5 text-xs font-mono rounded border border-border-default bg-surface-secondary text-text-primary focus:outline-none focus:border-accent-primary"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Department */}
          <select
            value={deptFilter}
            onChange={(e) => {
              setDeptFilter(e.target.value);
              setPage(1);
            }}
            className="px-2.5 py-1.5 text-xs font-mono rounded border border-border-default bg-surface-secondary text-text-primary focus:outline-none focus:border-accent-primary cursor-pointer"
          >
            <option value="all">All Departments</option>
            {filterMeta.departments?.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* Semester */}
          <select
            value={semesterFilter}
            onChange={(e) => {
              setSemesterFilter(e.target.value);
              setPage(1);
            }}
            className="px-2.5 py-1.5 text-xs font-mono rounded border border-border-default bg-surface-secondary text-text-primary focus:outline-none focus:border-accent-primary cursor-pointer"
          >
            <option value="all">All Semesters</option>
            {filterMeta.semesters?.map((s) => (
              <option key={s} value={s}>
                Semester {s}
              </option>
            ))}
          </select>

          {/* Exam Type */}
          <select
            value={examTypeFilter}
            onChange={(e) => {
              setExamTypeFilter(e.target.value);
              setPage(1);
            }}
            className="px-2.5 py-1.5 text-xs font-mono rounded border border-border-default bg-surface-secondary text-text-primary focus:outline-none focus:border-accent-primary cursor-pointer"
          >
            <option value="all">All Exam Types</option>
            {filterMeta.examTypes?.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          {/* Format (PDF or Image) */}
          <select
            value={fileTypeFilter}
            onChange={(e) => {
              setFileTypeFilter(e.target.value);
              setPage(1);
            }}
            className="px-2.5 py-1.5 text-xs font-mono rounded border border-border-default bg-surface-secondary text-text-primary focus:outline-none focus:border-accent-primary cursor-pointer"
          >
            <option value="all">All Formats</option>
            <option value="pdf">PDF Documents</option>
            <option value="image">Image Files</option>
          </select>
        </div>

        {/* Second filter row */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border-default/40">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-text-secondary uppercase">Year:</span>
            <select
              value={yearFilter}
              onChange={(e) => {
                setYearFilter(e.target.value);
                setPage(1);
              }}
              className="px-2 py-1 text-xs font-mono rounded border border-border-default bg-surface-secondary text-text-primary focus:outline-none focus:border-accent-primary cursor-pointer"
            >
              <option value="all">All Years</option>
              {filterMeta.years?.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            <span className="text-[11px] font-mono text-text-secondary uppercase ml-2">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-2 py-1 text-xs font-mono rounded border border-border-default bg-surface-secondary text-text-primary focus:outline-none focus:border-accent-primary cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <span className="text-xs font-mono text-text-secondary">
            Total {pagination.total} questions ({filterMeta.stats?.totalPdfs ?? 0} PDFs, {filterMeta.stats?.totalImages ?? 0} Images)
          </span>
        </div>
      </div>

      {/* Questions Table */}
      <div className="bg-surface-primary border-2 border-text-primary dark:border-border-default rounded-lg shadow-[3px_3px_0px_0px_var(--border-default)] overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <Loader2 className="animate-spin text-accent-primary mx-auto mb-2" size={28} />
            <span className="text-xs font-mono text-text-secondary">Loading questions...</span>
          </div>
        ) : questions.length === 0 ? (
          <div className="py-16 text-center">
            <FileText size={40} className="mx-auto text-text-secondary/40 mb-3" />
            <p className="text-sm font-bold text-text-primary">No question papers found</p>
            <p className="text-xs text-text-secondary mt-1">
              Try adjusting your search or filters, or upload a new question paper.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-surface-secondary text-text-secondary border-b-2 border-border-default uppercase text-[10px]">
                <tr>
                  <th className="px-4 py-2.5 font-bold">Format</th>
                  <th className="px-4 py-2.5 font-bold">Course</th>
                  <th className="px-4 py-2.5 font-bold">Subject / Title</th>
                  <th className="px-4 py-2.5 font-bold">Dept</th>
                  <th className="px-4 py-2.5 font-bold">Sem</th>
                  <th className="px-4 py-2.5 font-bold">Year</th>
                  <th className="px-4 py-2.5 font-bold">Type</th>
                  <th className="px-4 py-2.5 font-bold">Stats</th>
                  <th className="px-4 py-2.5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default">
                {questions.map((item) => {
                  const isImg = isImageFile(item);
                  return (
                    <tr key={item._id} className="hover:bg-surface-secondary/40 transition-colors">
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded ${
                            isImg
                              ? "bg-purple-500/15 text-purple-400 border border-purple-500/30"
                              : "bg-red-500/15 text-red-400 border border-red-500/30"
                          }`}
                        >
                          {isImg ? <ImageIcon size={11} /> : <FileText size={11} />}
                          {isImg ? "IMG" : "PDF"}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-text-primary whitespace-nowrap">
                        {item.courseCode}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-text-primary">{item.courseName}</div>
                        <div className="text-[11px] text-text-secondary line-clamp-1">{item.title}</div>
                      </td>
                      <td className="px-4 py-3 text-text-secondary">{item.department}</td>
                      <td className="px-4 py-3 text-text-secondary">Sem {item.semester}</td>
                      <td className="px-4 py-3 text-text-secondary">{item.year}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-surface-secondary border border-border-default text-text-primary">
                          {item.examType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-text-secondary whitespace-nowrap">
                        <span>👁 {item.viewCount}</span>
                        <span className="ml-2">📥 {item.downloadCount}</span>
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => window.open(resolveUrl(item.fileUrl), "_blank")}
                            className="p-1.5 rounded hover:bg-surface-secondary text-text-secondary hover:text-text-primary transition-colors"
                            title="View File"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            onClick={() => handleDownload(item)}
                            className="p-1.5 rounded hover:bg-surface-secondary text-text-secondary hover:text-accent-primary transition-colors"
                            title="Download"
                          >
                            <Download size={14} />
                          </button>
                          <button
                            onClick={() => handleOpenModal(item)}
                            className="p-1.5 rounded hover:bg-amber-500/20 text-text-secondary hover:text-amber-500 transition-colors"
                            title="Edit"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="p-1.5 rounded hover:bg-rose-500/20 text-text-secondary hover:text-rose-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between p-3 border-t-2 border-border-default text-xs font-mono">
            <span className="text-text-secondary">
              Page {page} of {pagination.pages}
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-2.5 py-1 rounded border border-border-default bg-surface-secondary disabled:opacity-40"
              >
                Prev
              </button>
              <button
                disabled={page >= pagination.pages}
                onClick={() => setPage((p) => p + 1)}
                className="px-2.5 py-1 rounded border border-border-default bg-surface-secondary disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Upload / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-xl bg-surface-elevated text-text-primary border border-border-default rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-border-default mb-4">
              <h3 className="text-sm font-mono font-bold text-text-primary flex items-center gap-2">
                <FileText size={18} className="text-accent-primary" />
                {editingItem ? "Edit Question Paper" : "Upload Question Paper"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-text-secondary hover:text-text-primary p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 font-mono text-xs">
              {/* CURRENT FILE PREVIEW (Crucial when editing!) */}
              {editingItem && (
                <div className="rounded-lg border border-border-default bg-surface-secondary p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-accent-primary flex items-center gap-1.5">
                      <FileCheck size={14} /> Current Uploaded File
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsReplacingFile(!isReplacingFile)}
                      className="text-[11px] font-bold px-2 py-0.5 rounded border border-border-default hover:bg-surface-primary text-text-secondary hover:text-text-primary"
                    >
                      {isReplacingFile ? "Keep Current File" : "Replace With New File"}
                    </button>
                  </div>

                  <div className="flex items-center gap-2.5 bg-surface-primary p-2 rounded border border-border-default">
                    {isImageFile(editingItem) ? (
                      <div className="w-12 h-12 rounded overflow-hidden bg-neutral-900 border border-border-default shrink-0 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={resolveUrl(editingItem.fileUrl)}
                          alt="Current"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded bg-red-500/10 border border-red-500/20 text-red-400 shrink-0 flex items-center justify-center">
                        <FileText size={20} />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-text-primary truncate">
                        {editingItem.fileName || "exam-question-file"}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-text-secondary mt-0.5">
                        <span className="uppercase font-bold">
                          {isImageFile(editingItem) ? "Image" : "PDF"}
                        </span>
                        {editingItem.fileSize ? (
                          <>
                            <span>•</span>
                            <span>{(editingItem.fileSize / 1024).toFixed(0)} KB</span>
                          </>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => window.open(resolveUrl(editingItem.fileUrl), "_blank")}
                        className="px-2 py-0.5 text-[11px] rounded bg-surface-secondary border border-border-default text-text-secondary hover:text-text-primary"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Department & Semester with Custom Options */}
              <div className="grid grid-cols-2 gap-3">
                {/* Department */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-text-secondary uppercase">
                      Department *
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          isCustomDept: !prev.isCustomDept,
                        }))
                      }
                      className="text-[10px] text-accent-primary hover:underline"
                    >
                      {formData.isCustomDept ? "List" : "+ Custom"}
                    </button>
                  </div>

                  {formData.isCustomDept ? (
                    <input
                      type="text"
                      value={formData.customDepartment}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customDepartment: e.target.value.toUpperCase(),
                        })
                      }
                      placeholder="e.g. ME, BME..."
                      className="w-full px-2.5 py-1.5 rounded border border-accent-primary bg-surface-secondary text-text-primary uppercase"
                      required
                    />
                  ) : (
                    <select
                      value={formData.department}
                      onChange={(e) => {
                        if (e.target.value === "CUSTOM") {
                          setFormData({ ...formData, isCustomDept: true });
                        } else {
                          setFormData({
                            ...formData,
                            department: e.target.value,
                            isCustomDept: false,
                          });
                        }
                      }}
                      className="w-full px-2.5 py-1.5 rounded border border-border-default bg-surface-secondary text-text-primary"
                      required
                    >
                      {filterMeta.departments?.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                      <option value="CUSTOM">+ Add Custom Department...</option>
                    </select>
                  )}
                </div>

                {/* Semester */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-text-secondary uppercase">
                      Semester *
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          isCustomSemester: !prev.isCustomSemester,
                        }))
                      }
                      className="text-[10px] text-accent-primary hover:underline"
                    >
                      {formData.isCustomSemester ? "1-8" : "+ Custom"}
                    </button>
                  </div>

                  {formData.isCustomSemester ? (
                    <input
                      type="number"
                      value={formData.customSemester}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customSemester: e.target.value,
                        })
                      }
                      min={1}
                      max={20}
                      placeholder="e.g. 9, 10"
                      className="w-full px-2.5 py-1.5 rounded border border-accent-primary bg-surface-secondary text-text-primary"
                      required
                    />
                  ) : (
                    <select
                      value={formData.semester}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          semester: parseInt(e.target.value, 10),
                        })
                      }
                      className="w-full px-2.5 py-1.5 rounded border border-border-default bg-surface-secondary text-text-primary"
                      required
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                        <option key={s} value={s}>
                          Semester {s}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* AUTOMATIC COURSE FILTERING FOR THIS DEPARTMENT & SEMESTER */}
              <div className="p-2.5 rounded-lg bg-surface-secondary border border-border-default space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-text-primary uppercase flex items-center gap-1.5">
                    <BookOpen size={12} className="text-accent-primary" />
                    <span>
                      {formData.isCustomDept
                        ? formData.customDepartment || "Custom Dept"
                        : formData.department}{" "}
                      Sem {formData.semester} Courses
                      {availableCoursesForSemester.length > 0
                        ? ` (${availableCoursesForSemester.length})`
                        : ""}
                    </span>
                  </label>
                  {availableCoursesForSemester.length > 0 && (
                    <span className="text-[10px] text-text-secondary">
                      Click to auto-fill
                    </span>
                  )}
                </div>

                {availableCoursesForSemester.length > 0 ? (
                  <>
                    <select
                      value=""
                      onChange={(e) => {
                        const code = e.target.value;
                        if (!code) return;
                        const c = availableCoursesForSemester.find(
                          (item) => item.courseCode === code
                        );
                        if (c) {
                          handleApplyCourse(c);
                        }
                      }}
                      className="w-full px-2 py-1 rounded bg-surface-primary text-text-primary border border-border-default text-xs"
                    >
                      <option value="">
                        -- Select course to auto-fill code & name --
                      </option>
                      {availableCoursesForSemester.map((c) => (
                        <option key={c.courseCode} value={c.courseCode}>
                          {c.courseCode} — {c.courseName}{" "}
                          {c.courseCredit ? `(${c.courseCredit} Cr)` : ""}
                        </option>
                      ))}
                    </select>

                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {availableCoursesForSemester.map((c) => {
                        const isSelected = formData.courseCode === c.courseCode;
                        return (
                          <button
                            type="button"
                            key={c.courseCode}
                            onClick={() => handleApplyCourse(c)}
                            className={`text-[10px] px-2 py-0.5 rounded border transition-all text-left flex items-center gap-1 ${
                              isSelected
                                ? "bg-accent-primary text-black border-accent-primary font-bold shadow-xs"
                                : "bg-surface-primary text-text-secondary border-border-default hover:border-accent-primary hover:text-text-primary"
                            }`}
                          >
                            <span className="font-mono font-bold">{c.courseCode}</span>
                            <span className="truncate max-w-[120px]">({c.courseName})</span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <p className="text-[10px] text-text-secondary italic">
                    No predefined courses recorded for this department & semester. Enter code & name manually below.
                  </p>
                )}
              </div>

              {/* Course Code & Name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-text-secondary uppercase mb-1">
                    Course Code *
                  </label>
                  <input
                    type="text"
                    value={formData.courseCode}
                    onChange={(e) => {
                      const v = e.target.value;
                      setFormData({ ...formData, courseCode: v });
                      handleCourseAutoFill(v);
                    }}
                    placeholder="e.g. CSE-1101"
                    className="w-full px-2.5 py-1.5 rounded border border-border-default bg-surface-secondary text-text-primary uppercase"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-text-secondary uppercase mb-1">
                    Course Name *
                  </label>
                  <input
                    type="text"
                    value={formData.courseName}
                    onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                    placeholder="e.g. Data Structures"
                    className="w-full px-2.5 py-1.5 rounded border border-border-default bg-surface-secondary text-text-primary"
                    required
                  />
                </div>
              </div>

              {/* Year & Exam Type with Custom Year & Custom Exam Type */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-text-secondary uppercase">
                      Exam Year *
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          isCustomYear: !prev.isCustomYear,
                        }))
                      }
                      className="text-[10px] text-accent-primary hover:underline"
                    >
                      {formData.isCustomYear ? "List" : "+ Custom"}
                    </button>
                  </div>

                  {formData.isCustomYear ? (
                    <input
                      type="number"
                      value={formData.customYear}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customYear: e.target.value,
                        })
                      }
                      min={2000}
                      max={2050}
                      placeholder="e.g. 2028, 2029"
                      className="w-full px-2.5 py-1.5 rounded border border-accent-primary bg-surface-secondary text-text-primary"
                      required
                    />
                  ) : (
                    <select
                      value={formData.year}
                      onChange={(e) => {
                        if (e.target.value === "CUSTOM") {
                          setFormData({ ...formData, isCustomYear: true });
                        } else {
                          setFormData({
                            ...formData,
                            year: parseInt(e.target.value, 10),
                            isCustomYear: false,
                          });
                        }
                      }}
                      className="w-full px-2.5 py-1.5 rounded border border-border-default bg-surface-secondary text-text-primary cursor-pointer"
                      required
                    >
                      {availableYears.map((yr) => (
                        <option key={yr} value={yr}>
                          {yr}
                        </option>
                      ))}
                      <option value="CUSTOM">+ Add Custom Year...</option>
                    </select>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-text-secondary uppercase">
                      Exam Type *
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          isCustomExamType: !prev.isCustomExamType,
                        }))
                      }
                      className="text-[10px] text-accent-primary hover:underline"
                    >
                      {formData.isCustomExamType ? "List" : "+ Custom"}
                    </button>
                  </div>

                  {formData.isCustomExamType ? (
                    <input
                      type="text"
                      value={formData.customExamType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customExamType: e.target.value,
                        })
                      }
                      placeholder="e.g. CT4, Retake..."
                      className="w-full px-2.5 py-1.5 rounded border border-accent-primary bg-surface-secondary text-text-primary"
                      required
                    />
                  ) : (
                    <select
                      value={formData.examType}
                      onChange={(e) => {
                        if (e.target.value === "CUSTOM") {
                          setFormData({ ...formData, isCustomExamType: true });
                        } else {
                          setFormData({
                            ...formData,
                            examType: e.target.value,
                            isCustomExamType: false,
                          });
                        }
                      }}
                      className="w-full px-2.5 py-1.5 rounded border border-border-default bg-surface-secondary text-text-primary"
                      required
                    >
                      <option value="Semester Final">Semester Final</option>
                      <option value="CT1">CT1</option>
                      <option value="CT2">CT2</option>
                      <option value="CT3">CT3</option>
                      <option value="Midterm">Midterm</option>
                      <option value="Lab Final">Lab Final</option>
                      <option value="Quiz">Quiz</option>
                      <option value="Make-up">Make-up</option>
                      <option value="CUSTOM">+ Add Custom Type...</option>
                    </select>
                  )}
                </div>
              </div>

              {/* PDF or Image Document Upload Area */}
              {(!editingItem || isReplacingFile) && (
                <div>
                  <label className="block text-[11px] font-bold text-text-secondary uppercase mb-1">
                    {editingItem ? "Replacement Document or Image" : "Question Document or Image *"}
                  </label>
                  <div className="border-2 border-dashed border-border-default hover:border-accent-primary p-4 rounded-lg text-center bg-surface-secondary/40 relative cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf,image/*,.jpg,.jpeg,.png,.webp,.gif,.avif"
                      onChange={handleFileSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <UploadCloud size={24} className="mx-auto text-accent-primary mb-1" />
                    {selectedFile ? (
                      <div className="space-y-1">
                        {filePreviewUrl ? (
                          <div className="w-12 h-12 mx-auto rounded overflow-hidden mb-1 border border-border-default">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={filePreviewUrl}
                              alt="Selected Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : null}
                        <span className="text-text-primary font-bold block">{selectedFile.name}</span>
                        <span className="text-[10px] text-text-secondary">
                          {(selectedFile.size / 1024).toFixed(0)} KB • {selectedFile.type || "File"}
                        </span>
                      </div>
                    ) : (
                      <span className="text-text-secondary block">
                        Click or drag PDF or image files (PNG, JPG, WEBP)
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Title & Session */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-text-secondary uppercase mb-1">
                    Session (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.session}
                    onChange={(e) => setFormData({ ...formData, session: e.target.value })}
                    placeholder="2022-23"
                    className="w-full px-2.5 py-1.5 rounded border border-border-default bg-surface-secondary text-text-primary"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-text-secondary uppercase mb-1">
                    Tags (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="Algorithms, Graphs, Final"
                    className="w-full px-2.5 py-1.5 rounded border border-border-default bg-surface-secondary text-text-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-text-secondary uppercase mb-1">
                  Description / Remarks
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Additional context or notes..."
                  className="w-full px-2.5 py-1.5 rounded border border-border-default bg-surface-secondary text-text-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t-2 border-border-default">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : editingItem ? "Save Changes" : "Upload Question"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
