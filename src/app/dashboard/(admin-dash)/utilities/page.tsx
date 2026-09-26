"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  BookOpen,
  GraduationCap,
  Plus,
  Search,
  CheckCircle,
  Clock,
  Trash2,
  Edit2,
  X,
  AlertCircle,
  RefreshCw,
  Award,
  BarChart3,
  Building2,
  ExternalLink,
  Layers,
  List,
  Shuffle,
  ArrowLeftRight,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Select, SelectOption } from "@/components/ui/Select";
import FilterSelect, { FilterOption } from "@/app/dashboard/components/FilterSelect";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

interface CourseItem {
  _id: string;
  courseName: string;
  courseCode: string;
  courseCredit: string;
  department: string;
  semester?: number;
  session?: string;
  isElective?: boolean;
  status: "approved" | "pending";
  submittedBy?: { fullName?: string; studentId?: string; email?: string } | null;
  createdAt: string;
  isBaseline?: boolean;
  changeType?: "addition" | "replace" | "shuffle" | "reduction" | "none";
  replacesCourseCode?: string | null;
  replacedByCourseCode?: string | null;
  shuffledFromSemester?: number | null;
  isDiscontinued?: boolean;
  isReplaced?: boolean;
  deltaId?: string | null;
}

interface InstituteDepartmentUsage {
  department: string;
  coverPagePrints: number;
  cgpaCalculations: number;
  total: number;
  lastUsedAt?: string;
}

interface InstituteAnalyticsItem {
  _id?: string;
  name: string;
  usageCount: {
    cgpaCalculations: number;
    coverPagePrints: number;
    total: number;
  };
  departments?: InstituteDepartmentUsage[];
  lastUsedAt: string;
}

interface InstructorItem {
  _id: string;
  name: string;
  designation: string;
  department: string;
  institution: string;
  status: "approved" | "pending";
  submittedBy?: { fullName?: string; studentId?: string; email?: string } | null;
  createdAt: string;
}

const INSTRUCTOR_DEPT_FILTER_OPTIONS: FilterOption[] = [
  { value: "all", label: "All Departments" },
  { value: "CSE", label: "CSE" },
  { value: "EEE", label: "EEE" },
  { value: "CE", label: "CE" },
];

const STATUS_FILTER_OPTIONS: FilterOption[] = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending Approval" },
  { value: "approved", label: "Approved" },
];

const DEPT_FORM_OPTIONS: SelectOption[] = [
  { value: "CSE", label: "Computer Science & Engineering (CSE)" },
  { value: "EEE", label: "Electrical & Electronic Engineering (EEE)" },
  { value: "CE", label: "Civil Engineering (CE)" },
];

const SEMESTER_DETAILS: Record<number, { title: string; yearSem: string }> = {
  1: { title: "1st Semester", yearSem: "1st Year 1st Sem" },
  2: { title: "2nd Semester", yearSem: "1st Year 2nd Sem" },
  3: { title: "3rd Semester", yearSem: "2nd Year 1st Sem" },
  4: { title: "4th Semester", yearSem: "2nd Year 2nd Sem" },
  5: { title: "5th Semester", yearSem: "3rd Year 1st Sem" },
  6: { title: "6th Semester", yearSem: "3rd Year 2nd Sem" },
  7: { title: "7th Semester", yearSem: "4th Year 1st Sem" },
  8: { title: "8th Semester", yearSem: "4th Year 2nd Sem" },
};

const SEMESTER_FORM_OPTIONS: SelectOption[] = [
  { value: "1", label: "1st Semester (1st Year 1st Sem)" },
  { value: "2", label: "2nd Semester (1st Year 2nd Sem)" },
  { value: "3", label: "3rd Semester (2nd Year 1st Sem)" },
  { value: "4", label: "4th Semester (2nd Year 2nd Sem)" },
  { value: "5", label: "5th Semester (3rd Year 1st Sem)" },
  { value: "6", label: "6th Semester (3rd Year 2nd Sem)" },
  { value: "7", label: "7th Semester (4th Year 1st Sem)" },
  { value: "8", label: "8th Semester (4th Year 2nd Sem)" },
];

export default function UtilitiesAdminPage() {
  const [activeTab, setActiveTab] = useState<"courses" | "instructors" | "analytics">("courses");

  // Courses state - only holds one department at a time, CSE by default
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [courseCounts, setCourseCounts] = useState({ pending: 0, approved: 0, total: 0 });
  const [courseDeptFilter, setCourseDeptFilter] = useState<"CSE" | "EEE" | "CE">("CSE");
  const [courseStatusFilter, setCourseStatusFilter] = useState("all");
  const [courseSessionFilter, setCourseSessionFilter] = useState("2021-22");
  const [courseSemesterFilter, setCourseSemesterFilter] = useState("all");
  const [courseSearch, setCourseSearch] = useState("");
  const [courseViewMode, setCourseViewMode] = useState<"semester" | "table">("semester");
  const [activeSemesterTab, setActiveSemesterTab] = useState<string>("all");
  const [availableSessions, setAvailableSessions] = useState<string[]>(["2021-22"]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  // Instructors state
  const [instructors, setInstructors] = useState<InstructorItem[]>([]);
  const [instructorCounts, setInstructorCounts] = useState({ pending: 0, approved: 0, total: 0 });
  const [instructorDeptFilter, setInstructorDeptFilter] = useState("all");
  const [instructorStatusFilter, setInstructorStatusFilter] = useState("all");
  const [instructorSearch, setInstructorSearch] = useState("");
  const [loadingInstructors, setLoadingInstructors] = useState(false);

  // Analytics state
  const [analyticsOverview, setAnalyticsOverview] = useState<{
    summary: { totalEvents: number; totalPrints: number; totalCalculations: number };
    topInstitutes: InstituteAnalyticsItem[];
  } | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  // Modal state
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseItem | null>(null);
  const [isCustomSession, setIsCustomSession] = useState(false);
  const [courseFormData, setCourseFormData] = useState({
    courseName: "",
    courseCode: "",
    courseCredit: "",
    department: "CSE",
    semester: "1",
    session: "2021-22",
    status: "approved" as "approved" | "pending",
  });

  // Delete confirmation dialog state
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "course" | "instructor";
    id: string;
    name: string;
    code?: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [instructorModalOpen, setInstructorModalOpen] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<InstructorItem | null>(null);
  const [instructorFormData, setInstructorFormData] = useState({
    name: "",
    designation: "Lecturer",
    department: "CSE",
    institution: "Mymensingh Engineering College",
    status: "approved" as "approved" | "pending",
  });

  // Delta evolution state
  const [shuffleModalOpen, setShuffleModalOpen] = useState(false);
  const [shufflingCourse, setShufflingCourse] = useState<CourseItem | null>(null);
  const [shuffleTargetSemester, setShuffleTargetSemester] = useState("1");
  const [isSubmittingShuffle, setIsSubmittingShuffle] = useState(false);

  const [replaceModalOpen, setReplaceModalOpen] = useState(false);
  const [replacingCourse, setReplacingCourse] = useState<CourseItem | null>(null);
  const [replaceFormData, setReplaceFormData] = useState({
    newCourseCode: "",
    newCourseName: "",
    newCourseCredit: "3.00",
    isElective: false,
  });
  const [isSubmittingReplace, setIsSubmittingReplace] = useState(false);

  const [dropConfirm, setDropConfirm] = useState<{ course: CourseItem } | null>(null);
  const [isSubmittingDrop, setIsSubmittingDrop] = useState(false);

  const [newSessionModalOpen, setNewSessionModalOpen] = useState(false);
  const [newSessionInput, setNewSessionInput] = useState("");

  // Session options for FilterSelect (contains only sessions where changes/courses exist)
  const sessionFilterOptions: FilterOption[] = useMemo(() => {
    return availableSessions.map((s) => ({
      value: s,
      label: s === "default" || s === "2021-22" ? "Session 2021-22 (Baseline)" : `Session ${s}`,
    }));
  }, [availableSessions]);

  // Session options for Course Form Select
  const sessionFormOptions: SelectOption[] = useMemo(() => {
    const list: SelectOption[] = availableSessions.map((s) => ({
      value: s,
      label: s === "default" || s === "2021-22" ? "Session 2021-22 (Baseline)" : `Session ${s}`,
    }));
    list.push({ value: "custom", label: "+ Enter New Session (e.g. 2025-26)..." });
    return list;
  }, [availableSessions]);

  // Group courses by semester for Semester View
  const coursesBySemester = useMemo(() => {
    const map: Record<number, CourseItem[]> = {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
      7: [],
      8: [],
    };
    const unassigned: CourseItem[] = [];

    courses.forEach((c) => {
      const s = c.semester;
      if (s && s >= 1 && s <= 8) {
        map[s].push(c);
      } else {
        unassigned.push(c);
      }
    });

    return { map, unassigned };
  }, [courses]);

  // Fetch analytics overview
  const fetchAnalytics = useCallback(async () => {
    try {
      setLoadingAnalytics(true);
      const res = await api.get("/api/analytics/overview");
      if (res.status === "success") {
        setAnalyticsOverview(res.data);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load analytics overview");
    } finally {
      setLoadingAnalytics(false);
    }
  }, []);

  // Fetch courses with department, status, session, and search filters
  const fetchCourses = useCallback(async () => {
    try {
      setLoadingCourses(true);
      const params = new URLSearchParams();
      params.append("department", courseDeptFilter);
      if (courseStatusFilter !== "all") params.append("status", courseStatusFilter);
      params.append("session", courseSessionFilter);
      if (courseSemesterFilter !== "all") params.append("semester", courseSemesterFilter);
      if (courseSearch.trim()) params.append("search", courseSearch.trim());
      params.append("limit", "500");

      const res = await api.get(`/api/courses?${params.toString()}`);
      if (res.status === "success") {
        setCourses(res.data || []);
        if (res.counts) setCourseCounts(res.counts);
        if (res.sessions && Array.isArray(res.sessions) && res.sessions.length > 0) {
          const list = res.sessions.filter(Boolean);
          setAvailableSessions(list);
          if (!list.includes(courseSessionFilter)) {
            setCourseSessionFilter(list[0]);
          }
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load courses");
    } finally {
      setLoadingCourses(false);
    }
  }, [courseDeptFilter, courseStatusFilter, courseSessionFilter, courseSemesterFilter, courseSearch]);

  // Helper to open Add Course modal pre-populated for a specific semester
  const handleOpenAddCourseForSemester = (semNumber: number) => {
    setEditingCourse(null);
    setCourseFormData({
      courseName: "",
      courseCode: "",
      courseCredit: "3.0",
      department: courseDeptFilter,
      semester: String(semNumber),
      session: courseSessionFilter || "2021-22",
      status: "approved",
    });
    setIsCustomSession(false);
    setCourseModalOpen(true);
  };

  // Fetch instructors
  const fetchInstructors = useCallback(async () => {
    try {
      setLoadingInstructors(true);
      const params = new URLSearchParams();
      if (instructorDeptFilter !== "all") params.append("department", instructorDeptFilter);
      if (instructorStatusFilter !== "all") params.append("status", instructorStatusFilter);
      if (instructorSearch.trim()) params.append("search", instructorSearch.trim());

      const res = await api.get(`/api/instructors?${params.toString()}`);
      if (res.status === "success") {
        setInstructors(res.data || []);
        if (res.counts) setInstructorCounts(res.counts);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load instructors");
    } finally {
      setLoadingInstructors(false);
    }
  }, [instructorDeptFilter, instructorStatusFilter, instructorSearch]);

  useEffect(() => {
    if (activeTab === "courses") {
      fetchCourses();
    } else {
      fetchInstructors();
    }
  }, [activeTab, fetchCourses, fetchInstructors]);

  // Course Actions
  const handleToggleCourseStatus = async (course: CourseItem) => {
    const nextStatus = course.status === "approved" ? "pending" : "approved";
    try {
      await api.patch(`/api/courses/${course._id}/status`, { status: nextStatus });
      toast.success(`Course marked as ${nextStatus}`);
      fetchCourses();
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    }
  };

  const handleExecuteDelete = async () => {
    if (!deleteConfirm) return;
    try {
      setIsDeleting(true);
      if (deleteConfirm.type === "course") {
        await api.delete(`/api/courses/${deleteConfirm.id}`);
        toast.success(`Course "${deleteConfirm.code || deleteConfirm.name}" deleted successfully`);
        fetchCourses();
      } else {
        await api.delete(`/api/instructors/${deleteConfirm.id}`);
        toast.success(`Instructor "${deleteConfirm.name}" deleted successfully`);
        fetchInstructors();
      }
      setDeleteConfirm(null);
    } catch (err: any) {
      toast.error(err.message || `Failed to delete ${deleteConfirm.type}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const onRequestDeleteCourse = async (course: CourseItem) => {
    if (course.status === "approved") {
      setDeleteConfirm({
        type: "course",
        id: course._id,
        name: course.courseName,
        code: course.courseCode,
      });
    } else {
      // Directly delete pending or rejected items without dialog
      try {
        await api.delete(`/api/courses/${course._id}`);
        toast.success(`Course "${course.courseCode || course.courseName}" deleted successfully`);
        fetchCourses();
      } catch (err: any) {
        toast.error(err.message || "Failed to delete course");
      }
    }
  };

  const onRequestDeleteInstructor = async (inst: InstructorItem) => {
    if (inst.status === "approved") {
      setDeleteConfirm({
        type: "instructor",
        id: inst._id,
        name: inst.name,
      });
    } else {
      // Directly delete pending or rejected items without dialog
      try {
        await api.delete(`/api/instructors/${inst._id}`);
        toast.success(`Instructor "${inst.name}" deleted successfully`);
        fetchInstructors();
      } catch (err: any) {
        toast.error(err.message || "Failed to delete instructor");
      }
    }
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseFormData.courseName.trim() || !courseFormData.courseCode.trim()) {
      toast.error("Please fill in course name and code");
      return;
    }
    try {
      if (editingCourse) {
        await api.patch(`/api/courses/${editingCourse._id}`, courseFormData);
        toast.success("Course updated successfully");
      } else {
        await api.post("/api/courses/submit", courseFormData);
        toast.success("Course added successfully");
      }
      setCourseModalOpen(false);
      setEditingCourse(null);
      fetchCourses();
    } catch (err: any) {
      toast.error(err.message || "Failed to save course");
    }
  };

  // Syllabus Evolution Delta Handlers
  const handleExecuteShuffle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shufflingCourse) return;
    try {
      setIsSubmittingShuffle(true);
      await api.post("/api/courses/delta/shuffle", {
        courseCode: shufflingCourse.courseCode,
        department: courseDeptFilter,
        session: courseSessionFilter,
        newSemester: parseInt(shuffleTargetSemester, 10),
      });
      toast.success(`Course ${shufflingCourse.courseCode} shuffled to Semester ${shuffleTargetSemester}`);
      setShuffleModalOpen(false);
      setShufflingCourse(null);
      fetchCourses();
    } catch (err: any) {
      toast.error(err.message || "Failed to shuffle course");
    } finally {
      setIsSubmittingShuffle(false);
    }
  };

  const handleExecuteReplace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replacingCourse || !replaceFormData.newCourseCode.trim() || !replaceFormData.newCourseName.trim()) {
      toast.error("Please fill in course code and name");
      return;
    }
    try {
      setIsSubmittingReplace(true);
      await api.post("/api/courses/delta/replace", {
        oldCourseCode: replacingCourse.courseCode,
        newCourseCode: replaceFormData.newCourseCode.trim(),
        newCourseName: replaceFormData.newCourseName.trim(),
        newCourseCredit: replaceFormData.newCourseCredit.trim(),
        semester: replacingCourse.semester,
        session: courseSessionFilter,
        department: courseDeptFilter,
        isElective: replaceFormData.isElective,
      });
      toast.success(
        `Course ${replacingCourse.courseCode} replaced by ${replaceFormData.newCourseCode.trim().toUpperCase()}`
      );
      setReplaceModalOpen(false);
      setReplacingCourse(null);
      fetchCourses();
    } catch (err: any) {
      toast.error(err.message || "Failed to replace course");
    } finally {
      setIsSubmittingReplace(false);
    }
  };

  const handleExecuteDrop = async () => {
    if (!dropConfirm) return;
    try {
      setIsSubmittingDrop(true);
      await api.post("/api/courses/delta/reduce", {
        courseCode: dropConfirm.course.courseCode,
        department: courseDeptFilter,
        session: courseSessionFilter,
      });
      toast.success(`Course ${dropConfirm.course.courseCode} dropped for Session ${courseSessionFilter}`);
      setDropConfirm(null);
      fetchCourses();
    } catch (err: any) {
      toast.error(err.message || "Failed to drop course");
    } finally {
      setIsSubmittingDrop(false);
    }
  };

  const handleExecuteRevert = async (course: CourseItem) => {
    try {
      await api.post("/api/courses/delta/revert", {
        courseCode: course.courseCode,
        department: courseDeptFilter,
        session: courseSessionFilter,
        deltaId: course.deltaId,
      });
      toast.success(`Reverted "${course.courseCode}" to baseline`);
      fetchCourses();
    } catch (err: any) {
      toast.error(err.message || "Failed to revert change");
    }
  };

  const handleAddNewSession = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newSessionInput.trim();
    if (!clean) return;
    if (!availableSessions.includes(clean)) {
      setAvailableSessions((prev) => [...prev, clean]);
    }
    setCourseSessionFilter(clean);
    setNewSessionModalOpen(false);
    setNewSessionInput("");
    toast.success(`Switched to Session ${clean}. All courses inherited from 2021-22 baseline.`);
  };

  // Instructor Actions
  const handleToggleInstructorStatus = async (inst: InstructorItem) => {
    const nextStatus = inst.status === "approved" ? "pending" : "approved";
    try {
      await api.patch(`/api/instructors/${inst._id}/status`, { status: nextStatus });
      toast.success(`Instructor marked as ${nextStatus}`);
      fetchInstructors();
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    }
  };



  const handleSaveInstructor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instructorFormData.name.trim()) {
      toast.error("Please fill in instructor name");
      return;
    }
    try {
      if (editingInstructor) {
        await api.patch(`/api/instructors/${editingInstructor._id}`, instructorFormData);
        toast.success("Instructor updated successfully");
      } else {
        await api.post("/api/instructors/submit", instructorFormData);
        toast.success("Instructor added successfully");
      }
      setInstructorModalOpen(false);
      setEditingInstructor(null);
      fetchInstructors();
    } catch (err: any) {
      toast.error(err.message || "Failed to save instructor");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-border-default pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-text-primary uppercase tracking-tight flex items-center gap-2.5">
            <span className="p-2 bg-accent-primary/20 border-2 border-text-primary dark:border-border-default rounded-md shadow-[2px_2px_0px_0px_var(--accent-primary)]">
              {activeTab === "courses" ? <BookOpen size={22} className="text-accent-primary" /> : <GraduationCap size={22} className="text-accent-primary" />}
            </span>
            Utilities: Academic Catalog
          </h1>
          <p className="text-xs sm:text-sm font-mono text-text-secondary mt-1">
            Review user-submitted entries from cover page generators & curate official suggestions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === "courses" ? (
            <Button
              variant="primary"
              size="sm"
              icon={<Plus size={16} />}
              onClick={() => {
                setEditingCourse(null);
                setCourseFormData({
                  courseName: "",
                  courseCode: "",
                  courseCredit: "3.0",
                  department: courseDeptFilter,
                  semester: activeSemesterTab !== "all" && activeSemesterTab !== "unassigned" ? activeSemesterTab : "1",
                  session: courseSessionFilter || "2021-22",
                  status: "approved",
                });
                setIsCustomSession(false);
                setCourseModalOpen(true);
              }}
            >
              Add Course
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              icon={<Plus size={16} />}
              onClick={() => {
                setEditingInstructor(null);
                setInstructorFormData({
                  name: "",
                  designation: "Lecturer",
                  department: "CSE",
                  institution: "Mymensingh Engineering College",
                  status: "approved",
                });
                setInstructorModalOpen(true);
              }}
            >
              Add Instructor
            </Button>
          )}

          <Button
            variant="secondary"
            size="sm"
            icon={
              <RefreshCw
                size={15}
                className={loadingCourses || loadingInstructors || loadingAnalytics ? "animate-spin" : ""}
              />
            }
            onClick={() => {
              if (activeTab === "courses") fetchCourses();
              else if (activeTab === "instructors") fetchInstructors();
              else fetchAnalytics();
            }}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-surface-primary border-2 border-text-primary dark:border-border-default rounded-lg shadow-[3px_3px_0px_0px_var(--accent-primary)]">
          <div className="text-xs font-mono font-bold text-text-secondary uppercase">Pending Courses</div>
          <div className="text-2xl font-black text-amber-500 mt-1 flex items-center justify-between">
            {courseCounts.pending}
            <Clock size={20} className="opacity-40" />
          </div>
        </div>
        <div className="p-4 bg-surface-primary border-2 border-text-primary dark:border-border-default rounded-lg shadow-[3px_3px_0px_0px_var(--border-default)]">
          <div className="text-xs font-mono font-bold text-text-secondary uppercase">Approved Courses</div>
          <div className="text-2xl font-black text-emerald-500 mt-1 flex items-center justify-between">
            {courseCounts.approved}
            <CheckCircle size={20} className="opacity-40" />
          </div>
        </div>
        <div className="p-4 bg-surface-primary border-2 border-text-primary dark:border-border-default rounded-lg shadow-[3px_3px_0px_0px_var(--accent-primary)]">
          <div className="text-xs font-mono font-bold text-text-secondary uppercase">Pending Instructors</div>
          <div className="text-2xl font-black text-amber-500 mt-1 flex items-center justify-between">
            {instructorCounts.pending}
            <Clock size={20} className="opacity-40" />
          </div>
        </div>
        <div className="p-4 bg-surface-primary border-2 border-text-primary dark:border-border-default rounded-lg shadow-[3px_3px_0px_0px_var(--border-default)]">
          <div className="text-xs font-mono font-bold text-text-secondary uppercase">Approved Instructors</div>
          <div className="text-2xl font-black text-emerald-500 mt-1 flex items-center justify-between">
            {instructorCounts.approved}
            <CheckCircle size={20} className="opacity-40" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b-2 border-border-default gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("courses")}
          className={`flex items-center gap-2 px-5 py-2.5 font-mono text-sm font-bold border-b-4 transition-all duration-150 whitespace-nowrap ${
            activeTab === "courses"
              ? "border-accent-primary text-text-primary bg-surface-secondary/40 rounded-t-md"
              : "border-transparent text-text-secondary hover:text-text-primary"
          }`}
        >
          <BookOpen size={16} />
          Courses
          {courseCounts.pending > 0 && (
            <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-500 text-black">
              {courseCounts.pending}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("instructors")}
          className={`flex items-center gap-2 px-5 py-2.5 font-mono text-sm font-bold border-b-4 transition-all duration-150 whitespace-nowrap ${
            activeTab === "instructors"
              ? "border-accent-primary text-text-primary bg-surface-secondary/40 rounded-t-md"
              : "border-transparent text-text-secondary hover:text-text-primary"
          }`}
        >
          <GraduationCap size={16} />
          Instructors
          {instructorCounts.pending > 0 && (
            <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-500 text-black">
              {instructorCounts.pending}
            </span>
          )}
        </button>
        <button
          onClick={() => {
            setActiveTab("analytics");
            fetchAnalytics();
          }}
          className={`flex items-center gap-2 px-5 py-2.5 font-mono text-sm font-bold border-b-4 transition-all duration-150 whitespace-nowrap ${
            activeTab === "analytics"
              ? "border-accent-primary text-text-primary bg-surface-secondary/40 rounded-t-md"
              : "border-transparent text-text-secondary hover:text-text-primary"
          }`}
        >
          <BarChart3 size={16} />
          Institute Analytics
        </button>
      </div>

      {/* TAB 1: COURSES CONTENT */}
      {activeTab === "courses" && (
        <div className="space-y-4">
          {/* Filters & Control Bar */}
          <div className="p-3.5 bg-surface-primary border-2 border-text-primary dark:border-border-default rounded-lg shadow-[3px_3px_0px_0px_var(--border-default)] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
                {/* Search input */}
                <div className="relative flex-1 min-w-[180px] max-w-xs">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="text"
                    placeholder="Search course name or code..."
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs font-mono bg-surface-secondary border border-border-default rounded-md focus:border-accent-primary focus:outline-none text-text-primary"
                  />
                </div>

                {/* Session Filter & Evolve Button */}
                <div className="flex items-center gap-1.5">
                  <FilterSelect
                    value={courseSessionFilter}
                    onChange={setCourseSessionFilter}
                    options={sessionFilterOptions}
                    placeholder="Session"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<Sparkles size={13} className="text-amber-500" />}
                    onClick={() => {
                      setNewSessionInput("");
                      setNewSessionModalOpen(true);
                    }}
                    className="!h-9 !px-2.5 text-xs whitespace-nowrap shadow-sm"
                    title="Create or evolve syllabus changes for another session (e.g. 2025-26)"
                  >
                    + Evolve Session
                  </Button>
                </div>

                {/* Department Selector: Single department at a time, CSE default */}
                <div className="inline-flex p-0.5 rounded-lg bg-surface-secondary border border-border-default">
                  {(["CSE", "EEE", "CE"] as const).map((dept) => (
                    <button
                      key={dept}
                      type="button"
                      onClick={() => setCourseDeptFilter(dept)}
                      className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all ${
                        courseDeptFilter === dept
                          ? "bg-accent-primary text-white shadow-sm"
                          : "text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>

                {/* Status Filter */}
                <FilterSelect
                  value={courseStatusFilter}
                  onChange={setCourseStatusFilter}
                  options={STATUS_FILTER_OPTIONS}
                  placeholder="Status"
                />
              </div>

              {/* View Mode Toggle (Semester-wise vs Flat Table) */}
              <div className="inline-flex p-0.5 rounded-lg bg-surface-secondary border border-border-default">
                <button
                  type="button"
                  onClick={() => setCourseViewMode("semester")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all ${
                    courseViewMode === "semester"
                      ? "bg-accent-primary text-white shadow-sm"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  <BookOpen size={13} />
                  <span>Semester View</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCourseViewMode("table")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all ${
                    courseViewMode === "table"
                      ? "bg-accent-primary text-white shadow-sm"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  <List size={13} />
                  <span>Table View</span>
                </button>
              </div>
            </div>

            {/* Evolved Session Delta Notification Banner */}
            {courseSessionFilter !== "2021-22" && courseSessionFilter !== "default" && (
              <div className="p-3 bg-accent-primary/10 border border-accent-primary/30 rounded-lg flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-accent-primary text-white uppercase tracking-wider shadow-xs">
                    Session {courseSessionFilter} Evolved Syllabus
                  </span>
                  <p className="text-xs text-text-primary font-mono">
                    Inherited from <strong>2021-22 Baseline</strong>. Individual changes (shuffles, replacements, additions, reductions) overlay the baseline without duplication.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCourseSessionFilter("2021-22")}
                  className="!h-7 !px-2.5 text-xs text-accent-primary hover:underline font-mono"
                >
                  ← Switch to 2021-22 Baseline
                </Button>
              </div>
            )}

            {/* Semester Jump Tabs in Semester View */}
            {courseViewMode === "semester" && (
              <div className="flex flex-wrap items-center gap-1 pt-1 border-t border-border-default/60">
                <span className="text-[11px] font-mono font-bold uppercase text-text-muted mr-1.5">
                  Filter Semester:
                </span>
                <button
                  type="button"
                  onClick={() => setActiveSemesterTab("all")}
                  className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold transition-all ${
                    activeSemesterTab === "all"
                      ? "bg-accent-primary text-white shadow-sm"
                      : "text-text-secondary hover:bg-surface-secondary hover:text-text-primary"
                  }`}
                >
                  All Semesters ({courses.length})
                </button>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => {
                  const count = coursesBySemester.map[s]?.length || 0;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setActiveSemesterTab(String(s))}
                      className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                        activeSemesterTab === String(s)
                          ? "bg-accent-primary text-white shadow-sm"
                          : "text-text-secondary hover:bg-surface-secondary hover:text-text-primary"
                      }`}
                    >
                      <span>Sem {s}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                          activeSemesterTab === String(s)
                            ? "bg-white/20 text-white"
                            : count > 0
                            ? "bg-accent-primary/10 text-accent-primary font-bold"
                            : "bg-surface-secondary text-text-muted"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
                {coursesBySemester.unassigned.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveSemesterTab("unassigned")}
                    className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                      activeSemesterTab === "unassigned"
                        ? "bg-accent-primary text-white shadow-sm"
                        : "text-text-secondary hover:bg-surface-secondary hover:text-text-primary"
                    }`}
                  >
                    <span>Other</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-accent-primary/10 text-accent-primary font-bold">
                      {coursesBySemester.unassigned.length}
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* COURSES VIEW (SEMESTER-WISE OR FLAT TABLE) */}
          {courseViewMode === "semester" ? (
            /* SEMESTER-WISE VIEW */
            loadingCourses ? (
              <div className="p-12 text-center text-text-muted font-mono bg-surface-primary border-2 border-text-primary dark:border-border-default rounded-xl">
                Loading courses for {courseSessionFilter !== "all" ? `Session ${courseSessionFilter}` : "selected filters"}...
              </div>
            ) : (
              <div className="space-y-6">
                {(activeSemesterTab === "all"
                  ? [1, 2, 3, 4, 5, 6, 7, 8]
                  : activeSemesterTab === "unassigned"
                  ? []
                  : [parseInt(activeSemesterTab, 10)]
                ).map((semNum) => {
                  const semCourses = coursesBySemester.map[semNum] || [];
                  const totalCr = semCourses.reduce(
                    (acc, c) => acc + (parseFloat(c.courseCredit) || 0),
                    0
                  );
                  const approvedCount = semCourses.filter((c) => c.status === "approved").length;
                  const pendingCount = semCourses.filter((c) => c.status === "pending").length;

                  return (
                    <div
                      key={semNum}
                      className="bg-surface-primary border-2 border-text-primary dark:border-border-default rounded-xl shadow-[4px_4px_0px_0px_var(--border-default)] overflow-hidden"
                    >
                      {/* Semester Header Card */}
                      <div className="p-3.5 bg-surface-secondary/70 border-b-2 border-border-default flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                          <div className="w-8 h-8 rounded-lg bg-accent-primary text-white font-mono font-bold text-sm flex items-center justify-center shadow-sm">
                            {semNum}
                          </div>
                          <div>
                            <h3 className="font-heading font-black text-sm text-text-primary tracking-tight">
                              {SEMESTER_DETAILS[semNum]?.title}
                              <span className="ml-2 text-xs font-mono font-medium text-text-secondary">
                                ({SEMESTER_DETAILS[semNum]?.yearSem})
                              </span>
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 mt-0.5 text-[11px] font-mono">
                              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-accent-primary/10 text-accent-primary border border-accent-primary/20">
                                {courseDeptFilter}
                              </span>
                              <span className="font-bold text-accent-primary">
                                {semCourses.length} {semCourses.length === 1 ? "Course" : "Courses"}
                              </span>
                              <span className="text-text-muted">•</span>
                              <span className="text-text-secondary font-semibold">
                                {totalCr.toFixed(2)} Total Credits
                              </span>
                              <span className="text-text-muted">•</span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                                {approvedCount} Approved
                              </span>
                              {pendingCount > 0 && (
                                <>
                                  <span className="text-text-muted">•</span>
                                  <span className="text-amber-500 font-bold">
                                    {pendingCount} Pending Review
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <Button
                          variant="secondary"
                          size="sm"
                          icon={<Plus size={13} />}
                          onClick={() => handleOpenAddCourseForSemester(semNum)}
                          className="!h-8 !px-3 text-xs"
                        >
                          Add Course to Sem {semNum}
                        </Button>
                      </div>

                      {/* Semester Courses Table or Empty State */}
                      {semCourses.length === 0 ? (
                        <div className="p-8 text-center bg-surface-primary space-y-2">
                          <p className="text-xs font-mono text-text-muted">
                            No courses registered for Semester {semNum} in {courseDeptFilter}
                            {courseSessionFilter !== "all" && ` (Session ${courseSessionFilter})`}.
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<Plus size={13} />}
                            onClick={() => handleOpenAddCourseForSemester(semNum)}
                            className="text-xs text-accent-primary"
                          >
                            + Register First Course for Sem {semNum}
                          </Button>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="border-b border-border-default bg-surface-secondary/40 text-text-secondary font-mono uppercase text-[11px]">
                                <th className="py-2.5 px-3 w-10 text-center">#</th>
                                <th className="py-2.5 px-3 w-32">Course Code</th>
                                <th className="py-2.5 px-3">Course Name</th>
                                <th className="py-2.5 px-3 w-20 text-center">Credit</th>
                                <th className="py-2.5 px-3 w-24">Department</th>
                                <th className="py-2.5 px-3 w-28">Session</th>
                                <th className="py-2.5 px-3 w-32">Status</th>
                                <th className="py-2.5 px-3 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border-default font-mono">
                                {semCourses.map((course, idx) => (
                                  <tr
                                    key={course._id}
                                    className={`hover:bg-surface-secondary/30 transition-colors ${
                                      course.isDiscontinued || course.isReplaced ? "bg-red-500/5 dark:bg-red-500/10" : ""
                                    }`}
                                  >
                                    <td className="py-2.5 px-3 text-center text-text-muted font-bold">
                                      {idx + 1}
                                    </td>
                                    <td className="py-2.5 px-3 font-bold text-accent-primary">
                                      <div className="flex flex-col">
                                        <span className={course.isDiscontinued || course.isReplaced ? "line-through opacity-60" : ""}>
                                          {course.courseCode}
                                        </span>
                                        {course.replacesCourseCode && (
                                          <span className="text-[10px] text-blue-500 font-normal">
                                            replaces {course.replacesCourseCode}
                                          </span>
                                        )}
                                      </div>
                                    </td>
                                    <td className="py-2.5 px-3 font-sans font-medium text-text-primary max-w-xs">
                                      <div className="flex flex-wrap items-center gap-1.5">
                                        <span
                                          className={
                                            course.isDiscontinued || course.isReplaced
                                              ? "line-through opacity-60 text-text-muted"
                                              : ""
                                          }
                                        >
                                          {course.courseName}
                                        </span>
                                        {/* Delta evolution badges */}
                                        {course.changeType === "addition" && (
                                          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                                            <Plus size={10} /> Added ({courseSessionFilter})
                                          </span>
                                        )}
                                        {course.changeType === "replace" && (
                                          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                                            <ArrowLeftRight size={10} /> Replaces {course.replacesCourseCode}
                                          </span>
                                        )}
                                        {course.isReplaced && (
                                          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                                            <ArrowLeftRight size={10} /> Replaced by {course.replacedByCourseCode}
                                          </span>
                                        )}
                                        {course.changeType === "shuffle" && (
                                          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                                            <Shuffle size={10} /> Shuffled (Sem {course.shuffledFromSemester} → Sem {course.semester})
                                          </span>
                                        )}
                                        {(course.changeType === "reduction" || course.isDiscontinued) && (
                                          <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30">
                                            <X size={10} /> Dropped ({courseSessionFilter})
                                          </span>
                                        )}
                                        {course.isBaseline && courseSessionFilter !== "2021-22" && courseSessionFilter !== "default" && !course.isReplaced && !course.isDiscontinued && !course.changeType && (
                                          <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-mono text-text-muted border border-border-default/60 bg-surface-secondary/40">
                                            Inherited
                                          </span>
                                        )}
                                      </div>
                                    </td>
                                    <td className="py-2.5 px-3 text-center font-bold text-text-primary">
                                      {course.courseCredit || "—"}
                                    </td>
                                    <td className="py-2.5 px-3">
                                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-surface-secondary border border-border-default">
                                        {course.department}
                                      </span>
                                    </td>
                                    <td className="py-2.5 px-3">
                                      <span className="px-2 py-0.5 rounded text-[10px] font-mono text-text-muted border border-border-default bg-surface-secondary/50">
                                        {course.session || "default"}
                                      </span>
                                    </td>
                                    <td className="py-2.5 px-3">
                                      {course.status === "approved" ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                                          <CheckCircle size={11} /> Approved
                                        </span>
                                      ) : (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-500 border border-amber-500/30">
                                          <Clock size={11} /> Pending
                                        </span>
                                      )}
                                    </td>
                                    <td className="py-2.5 px-3 text-right space-x-1 whitespace-nowrap">
                                      {courseSessionFilter !== "2021-22" && courseSessionFilter !== "default" ? (
                                        /* Evolved Session Delta Mode Actions */
                                        <>
                                          {(!course.isBaseline || course.changeType === "addition" || course.changeType === "shuffle" || course.changeType === "replace" || course.isDiscontinued || course.isReplaced) ? (
                                            <>
                                              <Button
                                                variant="secondary"
                                                size="sm"
                                                icon={<RotateCcw size={11} className="text-accent-primary" />}
                                                onClick={() => handleExecuteRevert(course)}
                                                title="Revert this change back to baseline"
                                                className="!h-7 !px-2 text-xs"
                                              >
                                                Revert
                                              </Button>
                                              {course.changeType === "addition" && (
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  icon={<Trash2 size={11} className="text-red-500" />}
                                                  onClick={() => onRequestDeleteCourse(course)}
                                                  title="Delete this added course"
                                                  className="!h-7 !px-2 hover:bg-red-500/10"
                                                >
                                                  Delete
                                                </Button>
                                              )}
                                            </>
                                          ) : (
                                            /* Inherited baseline course actions */
                                            <>
                                              <Button
                                                variant="secondary"
                                                size="sm"
                                                icon={<Shuffle size={11} />}
                                                onClick={() => {
                                                  setShufflingCourse(course);
                                                  setShuffleTargetSemester(course.semester ? String(course.semester) : "1");
                                                  setShuffleModalOpen(true);
                                                }}
                                                title="Move to another semester for this session"
                                                className="!h-7 !px-2 text-xs"
                                              >
                                                Shuffle
                                              </Button>
                                              <Button
                                                variant="secondary"
                                                size="sm"
                                                icon={<ArrowLeftRight size={11} />}
                                                onClick={() => {
                                                  setReplacingCourse(course);
                                                  setReplaceFormData({
                                                    newCourseCode: "",
                                                    newCourseName: "",
                                                    newCourseCredit: course.courseCredit || "3.00",
                                                    isElective: Boolean(course.isElective),
                                                  });
                                                  setReplaceModalOpen(true);
                                                }}
                                                title="Replace with new course for this session"
                                                className="!h-7 !px-2 text-xs"
                                              >
                                                Replace
                                              </Button>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                icon={<X size={11} className="text-red-500" />}
                                                onClick={() => setDropConfirm({ course })}
                                                title="Drop / discontinue course for this session"
                                                className="!h-7 !px-2 text-xs text-red-500 hover:bg-red-500/10"
                                              >
                                                Drop
                                              </Button>
                                            </>
                                          )}
                                        </>
                                      ) : (
                                        /* Baseline 2021-22 Syllabus Management */
                                        <>
                                          <Button
                                            variant={course.status === "approved" ? "ghost" : "primary"}
                                            size="sm"
                                            onClick={() => handleToggleCourseStatus(course)}
                                            title={course.status === "approved" ? "Set to Pending" : "Approve Course"}
                                            className="!h-7 !px-2 text-xs"
                                          >
                                            {course.status === "approved" ? "Reject" : "Approve"}
                                          </Button>
                                          <Button
                                            variant="secondary"
                                            size="sm"
                                            icon={<Edit2 size={12} />}
                                            onClick={() => {
                                              setEditingCourse(course);
                                              setCourseFormData({
                                                courseName: course.courseName,
                                                courseCode: course.courseCode,
                                                courseCredit: course.courseCredit || "",
                                                department: course.department || "CSE",
                                                semester: course.semester ? String(course.semester) : "1",
                                                session: course.session || "2021-22",
                                                status: course.status,
                                              });
                                              setIsCustomSession(
                                                course.session ? !availableSessions.includes(course.session) : false
                                              );
                                              setCourseModalOpen(true);
                                            }}
                                            className="!h-7 !px-2"
                                          >
                                            Edit
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            icon={<Trash2 size={12} className="text-red-500" />}
                                            onClick={() => onRequestDeleteCourse(course)}
                                            className="!h-7 !px-2 hover:bg-red-500/10"
                                          >
                                            Delete
                                          </Button>
                                        </>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Unassigned Semester Card */}
                {(activeSemesterTab === "all" || activeSemesterTab === "unassigned") &&
                  coursesBySemester.unassigned.length > 0 && (
                    <div className="bg-surface-primary border-2 border-text-primary dark:border-border-default rounded-xl shadow-[4px_4px_0px_0px_var(--border-default)] overflow-hidden">
                      <div className="p-3.5 bg-surface-secondary/70 border-b-2 border-border-default flex items-center justify-between">
                        <div>
                          <h3 className="font-heading font-black text-sm text-text-primary">
                            Other / Unassigned Semester Courses
                          </h3>
                          <span className="text-[11px] font-mono text-text-muted">
                            {coursesBySemester.unassigned.length} courses with no specific semester defined
                          </span>
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-border-default bg-surface-secondary/40 text-text-secondary font-mono uppercase text-[11px]">
                              <th className="py-2.5 px-3 w-10 text-center">#</th>
                              <th className="py-2.5 px-3 w-32">Course Code</th>
                              <th className="py-2.5 px-3">Course Name</th>
                              <th className="py-2.5 px-3 w-20 text-center">Credit</th>
                              <th className="py-2.5 px-3 w-24">Department</th>
                              <th className="py-2.5 px-3 w-28">Session</th>
                              <th className="py-2.5 px-3 w-32">Status</th>
                              <th className="py-2.5 px-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border-default font-mono">
                            {coursesBySemester.unassigned.map((course, idx) => (
                              <tr
                                key={course._id}
                                className="hover:bg-surface-secondary/30 transition-colors"
                              >
                                <td className="py-2.5 px-3 text-center text-text-muted font-bold">
                                  {idx + 1}
                                </td>
                                <td className="py-2.5 px-3 font-bold text-accent-primary">
                                  {course.courseCode}
                                </td>
                                <td className="py-2.5 px-3 font-sans font-medium text-text-primary max-w-xs">
                                  {course.courseName}
                                </td>
                                <td className="py-2.5 px-3 text-center font-bold text-text-primary">
                                  {course.courseCredit || "—"}
                                </td>
                                <td className="py-2.5 px-3">
                                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-surface-secondary border border-border-default">
                                    {course.department}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3">
                                  <span className="px-2 py-0.5 rounded text-[10px] font-mono text-text-muted border border-border-default bg-surface-secondary/50">
                                    {course.session || "default"}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3">
                                  {course.status === "approved" ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                                      <CheckCircle size={11} /> Approved
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-500 border border-amber-500/30">
                                      <Clock size={11} /> Pending
                                    </span>
                                  )}
                                </td>
                                <td className="py-2.5 px-3 text-right space-x-1 whitespace-nowrap">
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    icon={<Edit2 size={12} />}
                                    onClick={() => {
                                      setEditingCourse(course);
                                      setCourseFormData({
                                        courseName: course.courseName,
                                        courseCode: course.courseCode,
                                        courseCredit: course.courseCredit || "",
                                        department: course.department || "CSE",
                                        semester: course.semester ? String(course.semester) : "1",
                                        session: course.session || "2023-24",
                                        status: course.status,
                                      });
                                      setIsCustomSession(
                                        course.session ? !availableSessions.includes(course.session) : false
                                      );
                                      setCourseModalOpen(true);
                                    }}
                                    className="!h-7 !px-2"
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    icon={<Trash2 size={12} className="text-red-500" />}
                                    onClick={() => onRequestDeleteCourse(course)}
                                    className="!h-7 !px-2 hover:bg-red-500/10"
                                  >
                                    Delete
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
              </div>
            )
          ) : (
            /* FLAT TABLE VIEW */
            <div className="border-2 border-text-primary dark:border-border-default rounded-lg overflow-x-auto shadow-[4px_4px_0px_0px_var(--border-default)] bg-surface-primary">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b-2 border-border-default bg-surface-secondary text-text-secondary font-mono uppercase">
                    <th className="p-3">Course Code</th>
                    <th className="p-3">Course Name</th>
                    <th className="p-3">Credit</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Session</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Submitted By</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-default font-mono">
                  {loadingCourses ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-text-muted">
                        Loading courses...
                      </td>
                    </tr>
                  ) : courses.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-text-muted">
                        No courses found matching criteria.
                      </td>
                    </tr>
                  ) : (
                    courses.map((course) => (
                      <tr
                        key={course._id}
                        className={`hover:bg-surface-secondary/40 transition-colors ${
                          course.isDiscontinued || course.isReplaced ? "bg-red-500/5 dark:bg-red-500/10" : ""
                        }`}
                      >
                        <td className="p-3 font-bold text-accent-primary">
                          <div className="flex flex-col">
                            <span className={course.isDiscontinued || course.isReplaced ? "line-through opacity-60" : ""}>
                              {course.courseCode}
                            </span>
                            {course.replacesCourseCode && (
                              <span className="text-[10px] text-blue-500 font-normal">
                                replaces {course.replacesCourseCode}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-3 font-sans font-medium text-text-primary max-w-xs">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span
                              className={
                                course.isDiscontinued || course.isReplaced
                                  ? "line-through opacity-60 text-text-muted"
                                  : ""
                              }
                            >
                              {course.courseName}
                            </span>
                            {course.changeType === "addition" && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                                <Plus size={10} /> Added ({courseSessionFilter})
                              </span>
                            )}
                            {course.changeType === "replace" && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                                <ArrowLeftRight size={10} /> Replaces {course.replacesCourseCode}
                              </span>
                            )}
                            {course.isReplaced && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                                <ArrowLeftRight size={10} /> Replaced by {course.replacedByCourseCode}
                              </span>
                            )}
                            {course.changeType === "shuffle" && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                                <Shuffle size={10} /> Shuffled (Sem {course.shuffledFromSemester} → Sem {course.semester})
                              </span>
                            )}
                            {(course.changeType === "reduction" || course.isDiscontinued) && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30">
                                <X size={10} /> Dropped ({courseSessionFilter})
                              </span>
                            )}
                            {course.isBaseline && courseSessionFilter !== "2021-22" && courseSessionFilter !== "default" && !course.isReplaced && !course.isDiscontinued && !course.changeType && (
                              <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-mono text-text-muted border border-border-default/60 bg-surface-secondary/40">
                                Inherited
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-3 text-text-secondary">{course.courseCredit || "—"}</td>
                        <td className="p-3">
                          <div className="flex flex-wrap items-center gap-1">
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-surface-secondary border border-border-default">
                              {course.department}
                            </span>
                            {course.semester && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-accent-primary/10 text-accent-primary-hover border border-accent-primary/20">
                                Sem {course.semester}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-text-muted border border-border-default">
                            {course.session || "default"}
                          </span>
                        </td>
                        <td className="p-3">
                          {course.status === "approved" ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                              <CheckCircle size={12} /> Approved
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/15 text-amber-500 border border-amber-500/30">
                              <Clock size={12} /> Pending Review
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-text-muted">
                          {course.submittedBy?.fullName || "Auto-detected"}
                        </td>
                        <td className="p-3 text-right space-x-1 whitespace-nowrap">
                          {courseSessionFilter !== "2021-22" && courseSessionFilter !== "default" ? (
                            /* Evolved Session Delta Actions */
                            <>
                              {(!course.isBaseline || course.changeType === "addition" || course.changeType === "shuffle" || course.changeType === "replace" || course.isDiscontinued || course.isReplaced) ? (
                                <>
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    icon={<RotateCcw size={11} className="text-accent-primary" />}
                                    onClick={() => handleExecuteRevert(course)}
                                    title="Revert this change back to baseline"
                                    className="!h-7 !px-2 text-xs"
                                  >
                                    Revert
                                  </Button>
                                  {course.changeType === "addition" && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      icon={<Trash2 size={11} className="text-red-500" />}
                                      onClick={() => onRequestDeleteCourse(course)}
                                      title="Delete this added course"
                                      className="!h-7 !px-2 hover:bg-red-500/10"
                                    >
                                      Delete
                                    </Button>
                                  )}
                                </>
                              ) : (
                                /* Inherited baseline course actions */
                                <>
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    icon={<Shuffle size={11} />}
                                    onClick={() => {
                                      setShufflingCourse(course);
                                      setShuffleTargetSemester(course.semester ? String(course.semester) : "1");
                                      setShuffleModalOpen(true);
                                    }}
                                    title="Move to another semester for this session"
                                    className="!h-7 !px-2 text-xs"
                                  >
                                    Shuffle
                                  </Button>
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    icon={<ArrowLeftRight size={11} />}
                                    onClick={() => {
                                      setReplacingCourse(course);
                                      setReplaceFormData({
                                        newCourseCode: "",
                                        newCourseName: "",
                                        newCourseCredit: course.courseCredit || "3.00",
                                        isElective: Boolean(course.isElective),
                                      });
                                      setReplaceModalOpen(true);
                                    }}
                                    title="Replace with new course for this session"
                                    className="!h-7 !px-2 text-xs"
                                  >
                                    Replace
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    icon={<X size={11} className="text-red-500" />}
                                    onClick={() => setDropConfirm({ course })}
                                    title="Drop / discontinue course for this session"
                                    className="!h-7 !px-2 text-xs text-red-500 hover:bg-red-500/10"
                                  >
                                    Drop
                                  </Button>
                                </>
                              )}
                            </>
                          ) : (
                            /* Baseline 2021-22 Syllabus Management */
                            <>
                              <Button
                                variant={course.status === "approved" ? "ghost" : "primary"}
                                size="sm"
                                onClick={() => handleToggleCourseStatus(course)}
                                title={course.status === "approved" ? "Set to Pending" : "Approve Course"}
                                className="!h-7 !px-2 text-xs"
                              >
                                {course.status === "approved" ? "Reject" : "Approve"}
                              </Button>
                              <Button
                                variant="secondary"
                                size="sm"
                                icon={<Edit2 size={13} />}
                                onClick={() => {
                                  setEditingCourse(course);
                                  setCourseFormData({
                                    courseName: course.courseName,
                                    courseCode: course.courseCode,
                                    courseCredit: course.courseCredit || "",
                                    department: course.department || "CSE",
                                    semester: course.semester ? String(course.semester) : "1",
                                    session: course.session || "2021-22",
                                    status: course.status,
                                  });
                                  setIsCustomSession(
                                    course.session ? !availableSessions.includes(course.session) : false
                                  );
                                  setCourseModalOpen(true);
                                }}
                                className="!h-7 !px-2"
                              >
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                icon={<Trash2 size={13} className="text-red-500" />}
                                onClick={() => onRequestDeleteCourse(course)}
                                className="!h-7 !px-2 hover:bg-red-500/10"
                              >
                                Delete
                              </Button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: INSTRUCTORS CONTENT */}
      {activeTab === "instructors" && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-surface-primary border-2 border-text-primary dark:border-border-default rounded-lg shadow-[3px_3px_0px_0px_var(--border-default)]">
            <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search instructor name or designation..."
                  value={instructorSearch}
                  onChange={(e) => setInstructorSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs font-mono bg-surface-secondary border border-border-default rounded-md focus:border-accent-primary focus:outline-none text-text-primary"
                />
              </div>

              <FilterSelect
                value={instructorDeptFilter}
                onChange={setInstructorDeptFilter}
                options={INSTRUCTOR_DEPT_FILTER_OPTIONS}
                placeholder="Department"
              />

              <FilterSelect
                value={instructorStatusFilter}
                onChange={setInstructorStatusFilter}
                options={STATUS_FILTER_OPTIONS}
                placeholder="Status"
              />
            </div>
          </div>

          {/* Instructors Table */}
          <div className="border-2 border-text-primary dark:border-border-default rounded-lg overflow-x-auto shadow-[4px_4px_0px_0px_var(--border-default)] bg-surface-primary">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b-2 border-border-default bg-surface-secondary text-text-secondary font-mono uppercase">
                  <th className="p-3">Instructor Name</th>
                  <th className="p-3">Designation</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Institution</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Submitted By</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default font-mono">
                {loadingInstructors ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-text-muted">
                      Loading instructors...
                    </td>
                  </tr>
                ) : instructors.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-text-muted">
                      No instructors found matching criteria.
                    </td>
                  </tr>
                ) : (
                  instructors.map((inst) => (
                    <tr key={inst._id} className="hover:bg-surface-secondary/40 transition-colors">
                      <td className="p-3 font-bold text-text-primary">{inst.name}</td>
                      <td className="p-3 text-text-secondary">{inst.designation}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-surface-secondary border border-border-default">
                          {inst.department}
                        </span>
                      </td>
                      <td className="p-3 text-text-muted max-w-xs truncate">{inst.institution}</td>
                      <td className="p-3">
                        {inst.status === "approved" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                            <CheckCircle size={12} /> Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/15 text-amber-500 border border-amber-500/30">
                            <Clock size={12} /> Pending Review
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-text-muted">
                        {inst.submittedBy?.fullName || "Auto-detected"}
                      </td>
                      <td className="p-3 text-right space-x-1 whitespace-nowrap">
                        <Button
                          variant={inst.status === "approved" ? "ghost" : "primary"}
                          size="sm"
                          onClick={() => handleToggleInstructorStatus(inst)}
                          title={inst.status === "approved" ? "Set to Pending" : "Approve Instructor"}
                          className="!h-7 !px-2 text-xs"
                        >
                          {inst.status === "approved" ? "Reject" : "Approve"}
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={<Edit2 size={13} />}
                          onClick={() => {
                            setEditingInstructor(inst);
                            setInstructorFormData({
                              name: inst.name,
                              designation: inst.designation,
                              department: inst.department || "CSE",
                              institution: inst.institution || "Mymensingh Engineering College",
                              status: inst.status,
                            });
                            setInstructorModalOpen(true);
                          }}
                          className="!h-7 !px-2"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Trash2 size={13} className="text-red-500" />}
                          onClick={() => onRequestDeleteInstructor(inst)}
                          className="!h-7 !px-2 hover:bg-red-500/10"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: INSTITUTE ANALYTICS CONTENT */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-surface-primary border border-text-primary dark:border-border-default rounded-lg shadow-[3px_3px_0px_0px_var(--accent-primary)]">
              <div className="text-xs font-mono font-bold text-text-secondary uppercase">
                Cover Page Prints
              </div>
              <div className="text-2xl font-black text-accent-primary mt-1 flex items-center justify-between">
                {analyticsOverview?.summary.totalPrints || 0}
                <BookOpen size={20} className="opacity-40" />
              </div>
            </div>
            <div className="p-4 bg-surface-primary border border-text-primary dark:border-border-default rounded-lg shadow-[3px_3px_0px_0px_var(--border-default)]">
              <div className="text-xs font-mono font-bold text-text-secondary uppercase">
                CGPA Calculations
              </div>
              <div className="text-2xl font-black text-emerald-500 mt-1 flex items-center justify-between">
                {analyticsOverview?.summary.totalCalculations || 0}
                <Award size={20} className="opacity-40" />
              </div>
            </div>
            <div className="p-4 bg-surface-primary border border-text-primary dark:border-border-default rounded-lg shadow-[3px_3px_0px_0px_var(--border-default)]">
              <div className="text-xs font-mono font-bold text-text-secondary uppercase">
                Total Events Tracked
              </div>
              <div className="text-2xl font-black text-text-primary mt-1 flex items-center justify-between">
                {analyticsOverview?.summary.totalEvents || 0}
                <BarChart3 size={20} className="opacity-40" />
              </div>
            </div>
          </div>

          {/* Leaderboard Table with Department Breakdown */}
          <div className="border border-text-primary dark:border-border-default rounded-lg overflow-x-auto shadow-[4px_4px_0px_0px_var(--border-default)] bg-surface-primary">
            <div className="p-3.5 bg-surface-secondary border-b border-border-default flex items-center justify-between">
              <h3 className="font-mono font-bold text-xs uppercase text-text-primary flex items-center gap-2">
                <Building2 size={15} className="text-accent-primary" /> Active Institutes & Departments
              </h3>
              <span className="text-[11px] font-mono text-text-muted">
                Usage breakdown with departmental logs under each institute
              </span>
            </div>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border-default bg-surface-secondary/60 text-text-secondary font-mono uppercase">
                  <th className="p-3">#</th>
                  <th className="p-3">Institute Name & Logged Departments</th>
                  <th className="p-3 text-center">Cover Page Prints</th>
                  <th className="p-3 text-center">CGPA Calculations</th>
                  <th className="p-3 text-center">Total Uses</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default font-mono">
                {loadingAnalytics ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-text-muted">
                      Loading analytics data...
                    </td>
                  </tr>
                ) : !analyticsOverview?.topInstitutes || analyticsOverview.topInstitutes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-text-muted">
                      No usage data tracked yet.
                    </td>
                  </tr>
                ) : (
                  analyticsOverview.topInstitutes.map((inst, idx) => (
                    <tr key={inst._id || inst.name} className="hover:bg-surface-secondary/40 transition-colors">
                      <td className="p-3 font-bold text-text-muted align-top">{idx + 1}</td>
                      <td className="p-3.5 font-bold text-text-primary align-top">
                        <div className="flex items-center gap-2 text-sm">
                          <Building2 size={16} className="text-accent-primary shrink-0" />
                          <span>{inst.name}</span>
                        </div>
                        {/* Under institute name, keep all dept which have a log to store */}
                        {inst.departments && inst.departments.length > 0 && (
                          <div className="mt-2.5 pt-2 border-t border-border-default/60 space-y-1.5">
                            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted flex items-center gap-1">
                              <GraduationCap size={12} className="text-accent-primary" />
                              Departments with Logged Usage:
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {inst.departments.map((dept, dIdx) => (
                                <div
                                  key={dIdx}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-secondary border border-border-default text-xs font-mono shadow-sm"
                                  title={`Total: ${dept.total} | Calculations: ${dept.cgpaCalculations} | Prints: ${dept.coverPagePrints}`}
                                >
                                  <span className="font-bold text-text-primary">{dept.department}</span>
                                  <span className="px-1.5 py-0.2 rounded bg-accent-primary/10 text-accent-primary font-bold text-[10px]">
                                    {dept.total} uses
                                  </span>
                                  <span className="text-[10px] text-text-muted">
                                    ({dept.cgpaCalculations} calcs, {dept.coverPagePrints} prints)
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-center font-bold text-accent-primary align-top">
                        {inst.usageCount.coverPagePrints || 0}
                      </td>
                      <td className="p-3 text-center font-bold text-emerald-500 align-top">
                        {inst.usageCount.cgpaCalculations || 0}
                      </td>
                      <td className="p-3 text-center font-black text-text-primary text-sm align-top">
                        {inst.usageCount.total || 0}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* COURSE CREATE/EDIT MODAL */}
      {courseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-surface-primary border-2 border-text-primary dark:border-border-default rounded-xl shadow-[6px_6px_0px_0px_var(--accent-primary)] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b-2 border-border-default bg-surface-secondary">
              <h3 className="font-mono font-bold text-base text-text-primary flex items-center gap-2">
                <BookOpen size={18} className="text-accent-primary" />
                {editingCourse ? "Edit Course" : "Add New Course"}
              </h3>
              <button
                onClick={() => setCourseModalOpen(false)}
                className="text-text-secondary hover:text-text-primary"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-text-secondary mb-1">
                  Course Name *
                </label>
                <input
                  type="text"
                  required
                  value={courseFormData.courseName}
                  onChange={(e) => setCourseFormData({ ...courseFormData, courseName: e.target.value })}
                  placeholder="e.g. Operating Systems Lab"
                  className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border-default rounded-md focus:border-accent-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-text-secondary mb-1">
                    Course Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={courseFormData.courseCode}
                    onChange={(e) => setCourseFormData({ ...courseFormData, courseCode: e.target.value })}
                    placeholder="e.g. CSE-3206"
                    className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border-default rounded-md focus:border-accent-primary focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-text-secondary mb-1">
                    Course Credit (Optional)
                  </label>
                  <input
                    type="text"
                    value={courseFormData.courseCredit}
                    onChange={(e) => setCourseFormData({ ...courseFormData, courseCredit: e.target.value })}
                    placeholder="e.g. 1.5 (optional)"
                    className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border-default rounded-md focus:border-accent-primary focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-text-secondary mb-1">
                  Department *
                </label>
                <Select
                  value={courseFormData.department}
                  onChange={(val) => setCourseFormData({ ...courseFormData, department: val })}
                  options={DEPT_FORM_OPTIONS}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-text-secondary mb-1">
                    Semester *
                  </label>
                  <Select
                    value={courseFormData.semester}
                    onChange={(val) => setCourseFormData({ ...courseFormData, semester: val })}
                    options={SEMESTER_FORM_OPTIONS}
                    placeholder="Select semester..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-text-secondary mb-1">
                    Session *
                  </label>
                  <Select
                    value={
                      availableSessions.includes(courseFormData.session) && !isCustomSession
                        ? courseFormData.session
                        : "custom"
                    }
                    onChange={(val) => {
                      if (val === "custom") {
                        setIsCustomSession(true);
                      } else {
                        setIsCustomSession(false);
                        setCourseFormData({ ...courseFormData, session: val });
                      }
                    }}
                    options={sessionFormOptions}
                    placeholder="Select session..."
                  />
                </div>
              </div>

              {isCustomSession && (
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-text-secondary mb-1">
                    Custom Session Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={courseFormData.session}
                    onChange={(e) => setCourseFormData({ ...courseFormData, session: e.target.value })}
                    placeholder="e.g. 2025-26"
                    className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border-default rounded-md focus:border-accent-primary focus:outline-none font-mono text-text-primary"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-border-default">
                <Button variant="ghost" size="sm" onClick={() => setCourseModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  {editingCourse ? "Save Changes" : "Create Course"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INSTRUCTOR CREATE/EDIT MODAL */}
      {instructorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-surface-primary border-2 border-text-primary dark:border-border-default rounded-xl shadow-[6px_6px_0px_0px_var(--accent-primary)] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b-2 border-border-default bg-surface-secondary">
              <h3 className="font-mono font-bold text-base text-text-primary flex items-center gap-2">
                <GraduationCap size={18} className="text-accent-primary" />
                {editingInstructor ? "Edit Instructor" : "Add New Instructor"}
              </h3>
              <button
                onClick={() => setInstructorModalOpen(false)}
                className="text-text-secondary hover:text-text-primary"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveInstructor} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase text-text-secondary mb-1">
                  Instructor Name *
                </label>
                <input
                  type="text"
                  required
                  value={instructorFormData.name}
                  onChange={(e) => setInstructorFormData({ ...instructorFormData, name: e.target.value })}
                  placeholder="e.g. Fokrul Islam"
                  className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border-default rounded-md focus:border-accent-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-text-secondary mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={instructorFormData.designation}
                    onChange={(e) => setInstructorFormData({ ...instructorFormData, designation: e.target.value })}
                    placeholder="e.g. Lecturer"
                    className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border-default rounded-md focus:border-accent-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-text-secondary mb-1">
                    Department
                  </label>
                  <Select
                    value={instructorFormData.department}
                    onChange={(val) => setInstructorFormData({ ...instructorFormData, department: val })}
                    options={DEPT_FORM_OPTIONS}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase text-text-secondary mb-1">
                  Institution
                </label>
                <input
                  type="text"
                  value={instructorFormData.institution}
                  onChange={(e) => setInstructorFormData({ ...instructorFormData, institution: e.target.value })}
                  placeholder="e.g. Mymensingh Engineering College"
                  className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border-default rounded-md focus:border-accent-primary focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border-default">
                <Button variant="ghost" size="sm" onClick={() => setInstructorModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  {editingInstructor ? "Save Changes" : "Create Instructor"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* DELETE CONFIRMATION DIALOG MODAL */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-surface-primary border-2 border-text-primary dark:border-border-default rounded-xl shadow-[6px_6px_0px_0px_#ef4444] dark:shadow-[6px_6px_0px_0px_#ef4444] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b-2 border-border-default bg-red-500/10">
              <h3 className="font-mono font-bold text-base text-red-500 flex items-center gap-2">
                <AlertCircle size={18} className="text-red-500" />
                Confirm Deletion
              </h3>
              <button
                onClick={() => !isDeleting && setDeleteConfirm(null)}
                disabled={isDeleting}
                className="text-text-secondary hover:text-text-primary disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4 font-mono">
              <p className="text-sm text-text-primary">
                Are you sure you want to permanently delete this {deleteConfirm.type === "course" ? "course" : "instructor"}?
              </p>

              <div className="p-3 bg-surface-secondary border border-border-default rounded-lg">
                <div className="text-xs text-text-muted uppercase font-bold">
                  {deleteConfirm.type === "course" ? "Course Details" : "Instructor Details"}
                </div>
                <div className="mt-1 text-sm font-bold text-text-primary">
                  {deleteConfirm.type === "course" ? (
                    <>
                      <span className="text-accent-primary">{deleteConfirm.code}</span> — {deleteConfirm.name}
                    </>
                  ) : (
                    deleteConfirm.name
                  )}
                </div>
              </div>

              <p className="text-xs text-text-muted">
                ⚠️ This item will be permanently removed and will no longer appear in student auto-suggestions.
              </p>

              <div className="flex justify-end gap-2 pt-3 border-t border-border-default">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteConfirm(null)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleExecuteDelete}
                  disabled={isDeleting}
                  icon={<Trash2 size={14} />}
                  className="!bg-red-500 hover:not-disabled:!bg-red-600 !text-white !border-text-primary dark:!border-border-default shadow-[2px_2px_0px_0px_var(--text-primary)]"
                >
                  {isDeleting ? "Deleting..." : "Yes, Delete"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SHUFFLE COURSE MODAL */}
      {shuffleModalOpen && shufflingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-surface-primary border-2 border-text-primary dark:border-border-default rounded-xl shadow-[6px_6px_0px_0px_var(--accent-primary)] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b-2 border-border-default bg-surface-secondary">
              <h3 className="font-mono font-bold text-base text-text-primary flex items-center gap-2">
                <Shuffle size={18} className="text-accent-primary" />
                Shuffle Course Semester
              </h3>
              <button
                onClick={() => setShuffleModalOpen(false)}
                className="text-text-secondary hover:text-text-primary"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleExecuteShuffle} className="p-5 space-y-4 font-mono">
              <div className="p-3 bg-surface-secondary border border-border-default rounded-lg">
                <div className="text-xs text-text-muted uppercase font-bold">Course Details</div>
                <div className="text-sm font-bold text-text-primary mt-1">
                  <span className="text-accent-primary">{shufflingCourse.courseCode}</span> — {shufflingCourse.courseName}
                </div>
                <div className="text-xs text-text-secondary mt-1">
                  Current: <strong>Semester {shufflingCourse.semester || "Unassigned"}</strong> • Session: <strong>{courseSessionFilter}</strong>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-text-secondary mb-1.5">
                  Target Semester for Session {courseSessionFilter} *
                </label>
                <Select
                  value={shuffleTargetSemester}
                  onChange={(val) => setShuffleTargetSemester(val)}
                  options={SEMESTER_FORM_OPTIONS}
                  placeholder="Select target semester..."
                />
              </div>

              <p className="text-[11px] text-text-muted">
                ℹ️ This creates a lightweight delta for Session {courseSessionFilter}. Baseline syllabus remains untouched.
              </p>

              <div className="flex justify-end gap-2 pt-3 border-t border-border-default">
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() => setShuffleModalOpen(false)}
                  disabled={isSubmittingShuffle}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  type="submit"
                  disabled={isSubmittingShuffle}
                  icon={<Shuffle size={14} />}
                >
                  {isSubmittingShuffle ? "Shuffling..." : "Confirm Move"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REPLACE COURSE MODAL */}
      {replaceModalOpen && replacingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-surface-primary border-2 border-text-primary dark:border-border-default rounded-xl shadow-[6px_6px_0px_0px_var(--accent-primary)] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b-2 border-border-default bg-surface-secondary">
              <h3 className="font-mono font-bold text-base text-text-primary flex items-center gap-2">
                <ArrowLeftRight size={18} className="text-accent-primary" />
                Replace Course in Session {courseSessionFilter}
              </h3>
              <button
                onClick={() => setReplaceModalOpen(false)}
                className="text-text-secondary hover:text-text-primary"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleExecuteReplace} className="p-5 space-y-4 font-mono">
              <div className="p-3 bg-surface-secondary border border-border-default rounded-lg">
                <div className="text-xs text-text-muted uppercase font-bold">Original Baseline Course</div>
                <div className="text-sm font-bold text-text-primary mt-1">
                  <span className="text-accent-primary">{replacingCourse.courseCode}</span> — {replacingCourse.courseName}
                </div>
                <div className="text-xs text-text-secondary mt-1">
                  Semester {replacingCourse.semester} • Credit: {replacingCourse.courseCredit || "N/A"}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
                  Replacement Course Code *
                </label>
                <input
                  type="text"
                  required
                  value={replaceFormData.newCourseCode}
                  onChange={(e) => setReplaceFormData({ ...replaceFormData, newCourseCode: e.target.value })}
                  placeholder="e.g. CSE-3105"
                  className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border-default rounded-md focus:border-accent-primary focus:outline-none uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
                  Replacement Course Name *
                </label>
                <input
                  type="text"
                  required
                  value={replaceFormData.newCourseName}
                  onChange={(e) => setReplaceFormData({ ...replaceFormData, newCourseName: e.target.value })}
                  placeholder="e.g. Advanced Operating Systems"
                  className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border-default rounded-md focus:border-accent-primary focus:outline-none font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
                    Credit (Optional)
                  </label>
                  <input
                    type="text"
                    value={replaceFormData.newCourseCredit}
                    onChange={(e) => setReplaceFormData({ ...replaceFormData, newCourseCredit: e.target.value })}
                    placeholder="e.g. 3.00"
                    className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border-default rounded-md focus:border-accent-primary focus:outline-none"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-text-secondary">
                    <input
                      type="checkbox"
                      checked={replaceFormData.isElective}
                      onChange={(e) => setReplaceFormData({ ...replaceFormData, isElective: e.target.checked })}
                      className="rounded border-border-default text-accent-primary focus:ring-accent-primary"
                    />
                    Is Elective / Optional?
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border-default">
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() => setReplaceModalOpen(false)}
                  disabled={isSubmittingReplace}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  type="submit"
                  disabled={isSubmittingReplace}
                  icon={<ArrowLeftRight size={14} />}
                >
                  {isSubmittingReplace ? "Replacing..." : "Confirm Replacement"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DROP COURSE CONFIRMATION DIALOG */}
      {dropConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-surface-primary border-2 border-text-primary dark:border-border-default rounded-xl shadow-[6px_6px_0px_0px_var(--accent-primary)] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b-2 border-border-default bg-surface-secondary">
              <h3 className="font-mono font-bold text-base text-red-500 flex items-center gap-2">
                <AlertCircle size={18} />
                Drop Course from Session {courseSessionFilter}
              </h3>
              <button
                onClick={() => setDropConfirm(null)}
                className="text-text-secondary hover:text-text-primary"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4 font-mono">
              <p className="text-sm text-text-primary">
                Are you sure you want to drop this course from <strong>Session {courseSessionFilter}</strong>?
              </p>

              <div className="p-3 bg-surface-secondary border border-border-default rounded-lg">
                <div className="text-sm font-bold text-text-primary">
                  <span className="text-accent-primary">{dropConfirm.course.courseCode}</span> — {dropConfirm.course.courseName}
                </div>
                <div className="text-xs text-text-secondary mt-1">
                  Semester {dropConfirm.course.semester} • Credit: {dropConfirm.course.courseCredit || "N/A"}
                </div>
              </div>

              <p className="text-xs text-text-muted">
                ℹ️ Students in Session {courseSessionFilter} will no longer have this course calculated. You can restore or revert it anytime.
              </p>

              <div className="flex justify-end gap-2 pt-3 border-t border-border-default">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDropConfirm(null)}
                  disabled={isSubmittingDrop}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleExecuteDrop}
                  disabled={isSubmittingDrop}
                  icon={<X size={14} />}
                  className="!bg-red-500 hover:not-disabled:!bg-red-600 !text-white !border-text-primary dark:!border-border-default shadow-[2px_2px_0px_0px_var(--text-primary)]"
                >
                  {isSubmittingDrop ? "Dropping..." : "Yes, Drop Course"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EVOLVE NEW SESSION MODAL */}
      {newSessionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-surface-primary border-2 border-text-primary dark:border-border-default rounded-xl shadow-[6px_6px_0px_0px_var(--accent-primary)] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b-2 border-border-default bg-surface-secondary">
              <h3 className="font-mono font-bold text-base text-text-primary flex items-center gap-2">
                <Sparkles size={18} className="text-amber-500" />
                Evolve Syllabus for New Session
              </h3>
              <button
                onClick={() => setNewSessionModalOpen(false)}
                className="text-text-secondary hover:text-text-primary"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddNewSession} className="p-5 space-y-4 font-mono">
              <p className="text-xs text-text-secondary">
                Enter the new academic session name. It will automatically inherit all 8 semesters from the <strong>2021-22 Baseline</strong>, ready for you to shuffle, replace, add, or drop courses.
              </p>

              <div>
                <label className="block text-xs font-bold uppercase text-text-secondary mb-1">
                  Academic Session Name *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newSessionInput}
                  onChange={(e) => setNewSessionInput(e.target.value)}
                  placeholder="e.g. 2025-26"
                  className="w-full px-3 py-2 text-sm bg-surface-secondary border border-border-default rounded-md focus:border-accent-primary focus:outline-none font-bold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border-default">
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() => setNewSessionModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  type="submit"
                  icon={<Sparkles size={14} />}
                >
                  Start Evolving Syllabus
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
