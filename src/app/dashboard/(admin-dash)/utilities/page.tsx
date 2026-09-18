"use client";

import React, { useState, useEffect, useCallback } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import FilterSelect, { FilterOption } from "@/app/dashboard/components/FilterSelect";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

interface CourseItem {
  _id: string;
  courseName: string;
  courseCode: string;
  courseCredit: string;
  department: string;
  status: "approved" | "pending";
  submittedBy?: { fullName?: string; studentId?: string; email?: string } | null;
  createdAt: string;
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

const DEPT_FILTER_OPTIONS: FilterOption[] = [
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

const DEPT_FORM_OPTIONS = [
  { value: "CSE", label: "Computer Science & Engineering (CSE)" },
  { value: "EEE", label: "Electrical & Electronic Engineering (EEE)" },
  { value: "CE", label: "Civil Engineering (CE)" },
];

export default function UtilitiesAdminPage() {
  const [activeTab, setActiveTab] = useState<"courses" | "instructors">("courses");

  // Courses state
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [courseCounts, setCourseCounts] = useState({ pending: 0, approved: 0, total: 0 });
  const [courseDeptFilter, setCourseDeptFilter] = useState("all");
  const [courseStatusFilter, setCourseStatusFilter] = useState("all");
  const [courseSearch, setCourseSearch] = useState("");
  const [loadingCourses, setLoadingCourses] = useState(false);

  // Instructors state
  const [instructors, setInstructors] = useState<InstructorItem[]>([]);
  const [instructorCounts, setInstructorCounts] = useState({ pending: 0, approved: 0, total: 0 });
  const [instructorDeptFilter, setInstructorDeptFilter] = useState("all");
  const [instructorStatusFilter, setInstructorStatusFilter] = useState("all");
  const [instructorSearch, setInstructorSearch] = useState("");
  const [loadingInstructors, setLoadingInstructors] = useState(false);

  // Modal state
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseItem | null>(null);
  const [courseFormData, setCourseFormData] = useState({
    courseName: "",
    courseCode: "",
    courseCredit: "",
    department: "CSE",
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

  // Fetch courses
  const fetchCourses = useCallback(async () => {
    try {
      setLoadingCourses(true);
      const params = new URLSearchParams();
      if (courseDeptFilter !== "all") params.append("department", courseDeptFilter);
      if (courseStatusFilter !== "all") params.append("status", courseStatusFilter);
      if (courseSearch.trim()) params.append("search", courseSearch.trim());

      const res = await api.get(`/api/courses?${params.toString()}`);
      if (res.status === "success") {
        setCourses(res.data || []);
        if (res.counts) setCourseCounts(res.counts);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load courses");
    } finally {
      setLoadingCourses(false);
    }
  }, [courseDeptFilter, courseStatusFilter, courseSearch]);

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
                  courseCredit: "",
                  department: "CSE",
                  status: "approved",
                });
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
            icon={<RefreshCw size={15} />}
            onClick={() => (activeTab === "courses" ? fetchCourses() : fetchInstructors())}
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
      <div className="flex border-b-2 border-border-default gap-2">
        <button
          onClick={() => setActiveTab("courses")}
          className={`flex items-center gap-2 px-5 py-2.5 font-mono text-sm font-bold border-b-4 transition-all duration-150 ${
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
          className={`flex items-center gap-2 px-5 py-2.5 font-mono text-sm font-bold border-b-4 transition-all duration-150 ${
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
      </div>

      {/* TAB 1: COURSES CONTENT */}
      {activeTab === "courses" && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-surface-primary border-2 border-text-primary dark:border-border-default rounded-lg shadow-[3px_3px_0px_0px_var(--border-default)]">
            <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
              {/* Search input */}
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search course name or code..."
                  value={courseSearch}
                  onChange={(e) => setCourseSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs font-mono bg-surface-secondary border border-border-default rounded-md focus:border-accent-primary focus:outline-none text-text-primary"
                />
              </div>

              {/* Department Filter using FilterSelect */}
              <FilterSelect
                value={courseDeptFilter}
                onChange={setCourseDeptFilter}
                options={DEPT_FILTER_OPTIONS}
                placeholder="Department"
              />

              {/* Status Filter using FilterSelect */}
              <FilterSelect
                value={courseStatusFilter}
                onChange={setCourseStatusFilter}
                options={STATUS_FILTER_OPTIONS}
                placeholder="Status"
              />
            </div>
          </div>

          {/* Courses Table */}
          <div className="border-2 border-text-primary dark:border-border-default rounded-lg overflow-x-auto shadow-[4px_4px_0px_0px_var(--border-default)] bg-surface-primary">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b-2 border-border-default bg-surface-secondary text-text-secondary font-mono uppercase">
                  <th className="p-3">Course Code</th>
                  <th className="p-3">Course Name</th>
                  <th className="p-3">Credit</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Submitted By</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default font-mono">
                {loadingCourses ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-text-muted">
                      Loading courses...
                    </td>
                  </tr>
                ) : courses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-text-muted">
                      No courses found matching criteria.
                    </td>
                  </tr>
                ) : (
                  courses.map((course) => (
                    <tr key={course._id} className="hover:bg-surface-secondary/40 transition-colors">
                      <td className="p-3 font-bold text-accent-primary">{course.courseCode}</td>
                      <td className="p-3 font-sans font-medium text-text-primary max-w-xs">{course.courseName}</td>
                      <td className="p-3 text-text-secondary">{course.courseCredit || "—"}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-surface-secondary border border-border-default">
                          {course.department}
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
                              status: course.status,
                            });
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
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
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
                options={DEPT_FILTER_OPTIONS}
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
    </div>
  );
}
