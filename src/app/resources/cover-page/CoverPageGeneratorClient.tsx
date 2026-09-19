"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Space_Mono } from "next/font/google";
import { printCoverPage } from "./coverPageExportEngine";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/lib/api";
import { AutoSuggestInput } from "./AutoSuggestInput";
import toast from "react-hot-toast";
import {
  Printer,
  FileText,
  RotateCcw,
  Sparkles,
  Save,
  Check,
  Calendar,
  Layers,
  GraduationCap,
  UserCheck,
  BookOpen,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Info,
  ChevronRight,
  Plus,
  Trash2,
  Table,
  ListOrdered,
} from "lucide-react";
import { MecHeaderVector } from "./MecHeaderVector";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export type CoverTemplate = "modern-clean" | "classic-mono";
export type DocType = "cover-page" | "lab-report" | "assignment" | "index-table";

export interface TemplateOption {
  id: CoverTemplate;
  name: string;
  badge: string;
  description: string;
}

export const TEMPLATE_OPTIONS: TemplateOption[] = [
  {
    id: "modern-clean",
    name: "Modern Centered",
    badge: "Official Clean",
    description: "Centered header, official colored crest, two-column meta, and bottom-right signature.",
  },
  {
    id: "classic-mono",
    name: "Classic Space Mono",
    badge: "Retro Monospace",
    description: "Left-aligned crest, vertical divider line, authentic monospace typewriter type.",
  },
];

export const TEMPLATE_SELECT_OPTIONS = [
  { value: "modern-clean", label: "Modern Centered" },
  { value: "classic-mono", label: "Classic Space Mono" },
];

export interface IndexRow {
  id: string;
  sl: string;
  experimentName: string;
  pageNo: string;
  remarks: string;
}

const DEFAULT_INDEX_ROWS: IndexRow[] = [
  { id: "1", sl: "01", experimentName: "Study of 8086 Microprocessor Architecture and Pin Details.", pageNo: "01 - 04", remarks: "" },
  { id: "2", sl: "02", experimentName: "Execution of 16-Bit Arithmetic Addition and Subtraction Operations.", pageNo: "05 - 08", remarks: "" },
  { id: "3", sl: "03", experimentName: "Block Data Transfer and Memory Interfacing in Assembly Language.", pageNo: "09 - 12", remarks: "" },
  { id: "4", sl: "04", experimentName: "Multiplication and Division of 16-Bit Operands using 8086 Instructions.", pageNo: "13 - 16", remarks: "" },
  { id: "5", sl: "05", experimentName: "Finding Largest and Smallest Numbers in an Array of Memory Elements.", pageNo: "17 - 20", remarks: "" },
  { id: "6", sl: "06", experimentName: "Array Sorting in Ascending and Descending Order using Bubble Sort Algorithm.", pageNo: "21 - 25", remarks: "" },
  { id: "7", sl: "07", experimentName: "String Reversal and Palindrome Validation using String Primitive Instructions.", pageNo: "26 - 30", remarks: "" },
  { id: "8", sl: "08", experimentName: "Implementation of Hardware Interrupt Handling and Service Routine.", pageNo: "31 - 36", remarks: "" },
];

const COURSE_EXPERIMENTS: Record<string, string[]> = {
  "CSE-2212": [
    "Implementation of Divide and Conquer: Merge Sort and Binary Search.",
    "Analysis and Implementation of Quick Sort with Randomized Pivot Selection.",
    "Greedy Strategy: Fractional Knapsack and Job Sequencing with Deadlines.",
    "Dynamic Programming: 0/1 Knapsack Problem and Longest Common Subsequence.",
    "Graph Traversal Algorithms: Breadth-First Search and Depth-First Search.",
    "Single Source Shortest Path: Dijkstra's and Bellman-Ford Algorithms.",
    "Minimum Spanning Tree: Prim's and Kruskal's Algorithms.",
    "Backtracking: N-Queens Problem and Graph Coloring Problem.",
  ],
  "CSE-3113.": [
    "Study of 8086 Microprocessor Architecture and Pin Details.",
    "Execution of 16-Bit Arithmetic Addition and Subtraction Operations.",
    "Block Data Transfer and Memory Interfacing in Assembly Language.",
    "Multiplication and Division of 16-Bit Operands using 8086 Instructions.",
    "Finding Largest and Smallest Numbers in an Array of Memory Elements.",
    "Array Sorting in Ascending and Descending Order using Bubble Sort Algorithm.",
    "String Reversal and Palindrome Validation using String Primitive Instructions.",
    "Implementation of Hardware Interrupt Handling and Service Routine.",
  ],
  "CSE-2102.": [
    "Implementation of Singly and Doubly Linked List Operations.",
    "Stack Implementation using Array & Linked List with Postfix Evaluation.",
    "Queue and Circular Queue Implementation using Linear Data Structures.",
    "Binary Search Tree Creation, Insertion, Deletion, and Inorder Traversal.",
    "Graph Representation and Depth First Search (DFS) & Breadth First Search (BFS).",
    "Comparison of Sorting Algorithms: QuickSort, MergeSort, and HeapSort.",
    "Implementation of Dijkstra's Single Source Shortest Path Algorithm.",
    "Implementation of Hash Table with Linear Probing Collision Resolution.",
  ],
  "CSE-2104.": [
    "Introduction to OOP Concepts: Class, Objects, and Constructors in C++.",
    "Implementation of Function Overloading and Operator Overloading.",
    "Single, Multiple, and Hierarchical Inheritance Implementation.",
    "Polymorphism, Virtual Functions, and Abstract Base Classes.",
    "Dynamic Memory Allocation and Copy Constructor Deep Copy.",
    "Exception Handling and Custom Exception Hierarchy.",
    "Template Classes and Standard Template Library (STL) Containers.",
    "File Handling and Stream I/O Operations in C++.",
  ],
  "CSE-3102.": [
    "Creation of Database Schema and Table Constraints using SQL DDL.",
    "Data Manipulation using SQL INSERT, UPDATE, DELETE, and SELECT Queries.",
    "Complex Database Querying using SQL Joins, Subqueries, and Aggregate Functions.",
    "Implementation of Views, Indexes, and Sequence Generation in SQL.",
    "Designing Stored Procedures and Triggers for Integrity Constraints.",
    "Database Normalization and De-normalization Case Study.",
    "Transaction Processing, Concurrency Control, and ACID Property Simulation.",
    "Full-Stack Database Application Integration with Backend API.",
  ],
  "CSE-3202.": [
    "Network Cable Crimping and LAN Configuration (RJ-45, Cat6).",
    "Basic Router and Switch Configuration using Cisco Packet Tracer.",
    "Subnetting and VLSM IP Addressing Scheme Implementation.",
    "Configuring Static Routing and Dynamic RIP Routing Protocols.",
    "Configuring OSPF and EIGRP Single Area Routing on Cisco Routers.",
    "VLAN Configuration and Inter-VLAN Routing Setup.",
    "Network Packet Analysis using Wireshark Packet Analyzer.",
    "Socket Programming in C/Python for TCP and UDP Client-Server.",
  ],
  "CSE-3206.": [
    "Implementation of First-Come First-Served (FCFS) CPU Scheduling.",
    "Implementation of Shortest Job First (SJF) and Round Robin CPU Scheduling.",
    "Process Synchronization using Semaphores and Mutex Locks.",
    "Simulation of Producer-Consumer Problem using Shared Memory.",
    "Deadlock Avoidance using Banker's Safety and Resource Request Algorithm.",
    "Memory Allocation Simulation: First Fit, Best Fit, and Worst Fit Algorithms.",
    "Simulation of Page Replacement Algorithms: FIFO, LRU, and Optimal.",
    "Implementation of Disk Scheduling Algorithms: FCFS, SSTF, SCAN, and C-SCAN.",
  ],
};

interface FormData {
  template: CoverTemplate;
  docType: DocType;
  department: string;
  studentDepartment: string;
  institution: string;
  courseName: string;
  courseCode: string;
  courseCredit: string;
  experimentNo: string;
  experimentName: string;
  experimentDate: string;
  showExperimentDate: boolean;
  assignmentNo: string;
  assignmentTopic: string;
  studentName: string;
  roll: string;
  reg: string;
  session: string;
  yearNumber: string;
  yearSuffix: string;
  semNumber: string;
  semSuffix: string;
  teacherName: string;
  teacherDesignation: string;
  teacherDepartment: string;
  teacherInstitution: string;
  submissionDate: string;
  showSubmissionDate: boolean;
}

const DEFAULT_DATA: FormData = {
  template: "modern-clean",
  docType: "lab-report",
  department: "Department of Computer Science & Engineering",
  studentDepartment: "CSE",
  institution: "Mymensingh Engineering College",
  courseName: "Database Management Systems - I Lab",
  courseCode: "CSE-2211",
  courseCredit: "1.5",
  experimentNo: "",
  experimentName: "",
  experimentDate: "",
  showExperimentDate: true,
  assignmentNo: "01",
  assignmentTopic: "Algorithm Time and Space Complexity Analysis",
  studentName: "Md. Nasir Ahmed",
  roll: "210347",
  reg: "1335",
  session: "2021-2022",
  yearNumber: "2",
  yearSuffix: "nd",
  semNumber: "2",
  semSuffix: "nd",
  teacherName: "Fokrul Islam",
  teacherDesignation: "Lecturer",
  teacherDepartment: "Department of CSE",
  teacherInstitution: "Mymensingh Engineering College",
  submissionDate: "",
  showSubmissionDate: true,
};

const DOC_TYPE_OPTIONS = [
  { value: "cover-page", label: "Cover Page" },
  { value: "lab-report", label: "Lab Report" },
  { value: "assignment", label: "Assignment" },
  { value: "index-table", label: "Index Table / Table of Contents" },
];

const YEAR_OPTIONS = [
  { value: "1-st", label: "1st Year" },
  { value: "2-nd", label: "2nd Year" },
  { value: "3-rd", label: "3rd Year" },
  { value: "4-th", label: "4th Year" },
];

const SEMESTER_OPTIONS = [
  { value: "1-st", label: "1st Semester" },
  { value: "2-nd", label: "2nd Semester" },
];

const DEPARTMENT_OPTIONS = [
  { value: "Department of Computer Science and Engineering", label: "Computer Science & Engineering (CSE)" },
  { value: "Department of Electrical & Electronic Engineering", label: "Electrical & Electronic Engineering (EEE)" },
  { value: "Department of Civil Engineering", label: "Civil Engineering (CE)" },
];

const QUICK_COURSES = [
  { name: "Design and Analysis of Algorithms-I Lab", code: "CSE-2212", credit: "1.5" },
  { name: "Microprocessor and Assembly Language Lab.", code: "CSE-3113.", credit: "1.5" },
  { name: "Data Structure and Algorithms Lab.", code: "CSE-2102.", credit: "1.5" },
  { name: "Object Oriented Programming Lab.", code: "CSE-2104.", credit: "1.5" },
  { name: "Database Management Systems Lab.", code: "CSE-3102.", credit: "1.5" },
  { name: "Computer Networks Lab.", code: "CSE-3202.", credit: "1.5" },
  { name: "Operating Systems Lab.", code: "CSE-3206.", credit: "1.5" },
  { name: "Software Engineering & Information System Design Lab.", code: "CSE-4102.", credit: "1.5" },
];

export function CoverPageGeneratorClient() {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState<FormData>(DEFAULT_DATA);
  const [indexRows, setIndexRows] = useState<IndexRow[]>(DEFAULT_INDEX_ROWS);
  const [showPageNoColumn, setShowPageNoColumn] = useState<boolean>(true);
  const [showRemarksColumn, setShowRemarksColumn] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(0.85);
  const [isSavedLocally, setIsSavedLocally] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"document" | "index" | "student" | "instructor">("document");

  // Mobile Responsiveness States
  const [mobileViewMode, setMobileViewMode] = useState<"edit" | "preview">("edit");
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [containerWidth, setContainerWidth] = useState<number>(390);
  const [mobileFitMode, setMobileFitMode] = useState<boolean>(true);

  useEffect(() => {
    const updateDimensions = () => {
      const w = window.innerWidth;
      setIsMobile(w < 1024);
      const available = Math.min(Math.max(w - 32, 280), 794);
      setContainerWidth(available);
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const mobileScale = Math.min(1.0, Math.max(0.35, containerWidth / 794));

  // Load saved student data on mount & auto-fill from user profile
  useEffect(() => {
    let savedProfile: any = null;
    try {
      const saved = localStorage.getItem("mec_cc_coverpage_profile");
      if (saved) {
        savedProfile = JSON.parse(saved);
        setIsSavedLocally(true);
      }
    } catch {
      // ignore
    }

    setFormData((prev) => {
      // Priority: user profile > saved local profile > default sample
      let studentName = prev.studentName;
      if (user?.fullName) {
        const trimmed = user.fullName.trim();
        studentName = trimmed.endsWith(".") ? trimmed : `${trimmed}.`;
      } else if (savedProfile?.studentName) {
        studentName = savedProfile.studentName;
      }

      let roll = prev.roll;
      if (user?.studentId) {
        const trimmed = user.studentId.trim();
        roll = trimmed.endsWith(".") ? trimmed : `${trimmed}.`;
      } else if (savedProfile?.roll) {
        roll = savedProfile.roll;
      }

      let department = prev.department;
      if (user?.department) {
        const d = user.department.toUpperCase();
        if (d.includes("CSE") || d.includes("COMPUTER")) {
          department = "Department of Computer Science & Engineering";
        } else if (d.includes("EEE") || d.includes("ELECTRICAL")) {
          department = "Department of Electrical & Electronic Engineering";
        } else if (d.includes("CE") || d.includes("CIVIL")) {
          department = "Department of Civil Engineering";
        }
      }

      return {
        ...prev,
        department,
        studentName,
        roll,
        reg: savedProfile?.reg || prev.reg,
        session: savedProfile?.session || prev.session,
        yearNumber: savedProfile?.yearNumber || prev.yearNumber,
        yearSuffix: savedProfile?.yearSuffix || prev.yearSuffix,
        semNumber: savedProfile?.semNumber || prev.semNumber,
        semSuffix: savedProfile?.semSuffix || prev.semSuffix,
      };
    });
  }, [user]);

  const handleSyncWithAccount = () => {
    if (!user) {
      toast.error("Please login to your account first");
      return;
    }
    setFormData((prev) => {
      let dept = prev.department;
      if (user.department) {
        const d = user.department.toUpperCase();
        if (d.includes("CSE") || d.includes("COMPUTER")) {
          dept = "Department of Computer Science & Engineering";
        } else if (d.includes("EEE") || d.includes("ELECTRICAL")) {
          dept = "Department of Electrical & Electronic Engineering";
        } else if (d.includes("CE") || d.includes("CIVIL")) {
          dept = "Department of Civil Engineering";
        }
      }
      const sName = user.fullName ? (user.fullName.trim().endsWith(".") ? user.fullName.trim() : `${user.fullName.trim()}.`) : prev.studentName;
      const sRoll = user.studentId ? (user.studentId.trim().endsWith(".") ? user.studentId.trim() : `${user.studentId.trim()}.`) : prev.roll;
      return {
        ...prev,
        studentName: sName,
        roll: sRoll,
        department: dept,
      };
    });
    toast.success("Synchronized with your MEC CC account profile!");
  };

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "docType") {
      if (value === "index-table") {
        setActiveTab("index");
      } else if (activeTab === "index") {
        setActiveTab("document");
      }
    }
  };

  const handleAddIndexRow = () => {
    const nextNum = String(indexRows.length + 1).padStart(2, "0");
    const newRow: IndexRow = {
      id: Date.now().toString(),
      sl: nextNum,
      experimentName: "",
      pageNo: "",
      remarks: "",
    };
    setIndexRows((prev) => [...prev, newRow]);
    toast.success(`Added row ${nextNum}`);
  };

  const handleRemoveIndexRow = (id: string) => {
    if (indexRows.length <= 1) {
      toast.error("Table must contain at least one row");
      return;
    }
    setIndexRows((prev) => prev.filter((r) => r.id !== id));
    toast.success("Row removed");
  };

  const handleUpdateIndexRow = (id: string, field: keyof IndexRow, val: string) => {
    setIndexRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: val } : r))
    );
  };

  const handleFillBlankIndexRows = () => {
    const blankRows: IndexRow[] = Array.from({ length: 9 }).map((_, i) => ({
      id: (i + 1).toString(),
      sl: String(i + 1).padStart(2, "0"),
      experimentName: "",
      pageNo: "",
      remarks: "",
    }));
    setIndexRows(blankRows);
    toast.success("Loaded 9 blank rows for handwriting");
  };

  const handleResetIndexRows = () => {
    setIndexRows(DEFAULT_INDEX_ROWS);
    toast.success("Reset to sample lab experiments");
  };

  const handleLoadCourseExperiments = (code: string) => {
    const experiments = COURSE_EXPERIMENTS[code];
    if (experiments) {
      const rows: IndexRow[] = experiments.map((name, i) => ({
        id: (i + 1).toString(),
        sl: String(i + 1).padStart(2, "0"),
        experimentName: name,
        pageNo: `${String(i * 4 + 1).padStart(2, "0")} - ${String(i * 4 + 4).padStart(2, "0")}`,
        remarks: "",
      }));
      setIndexRows(rows);
      toast.success(`Loaded experiments for ${code}`);
    }
  };

  const handleYearChange = (val: string) => {
    const [num, suf] = val.split("-");
    setFormData((prev) => ({ ...prev, yearNumber: num, yearSuffix: suf }));
  };

  const handleSemChange = (val: string) => {
    const [num, suf] = val.split("-");
    setFormData((prev) => ({ ...prev, semNumber: num, semSuffix: suf }));
  };

  const handleSaveStudentProfile = () => {
    try {
      localStorage.setItem(
        "mec_cc_coverpage_profile",
        JSON.stringify({
          studentName: formData.studentName,
          roll: formData.roll,
          reg: formData.reg,
          session: formData.session,
          yearNumber: formData.yearNumber,
          yearSuffix: formData.yearSuffix,
          semNumber: formData.semNumber,
          semSuffix: formData.semSuffix,
        })
      );
      setIsSavedLocally(true);
      toast.success("Student details remembered in this browser!");
    } catch {
      toast.error("Could not save to local storage");
    }
  };

  const handleSetTodayExperiment = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    handleChange("experimentDate", `${dd}/${mm}/${yyyy}`);
    toast.success("Experiment date set to today");
  };

  const handleSetTodaySubmission = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    handleChange("submissionDate", `${dd}/${mm}/${yyyy}`);
    toast.success("Submission date set to today");
  };

  const handleSetToday = () => {
    handleSetTodaySubmission();
  };


  // Submit unapproved / new course and instructor to backend for admin moderation
  const autoSubmitEntities = () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      if (formData.courseName?.trim() && formData.courseCode?.trim()) {
        fetch(`${API_BASE_URL}/api/courses/submit`, {
          method: "POST",
          headers,
          credentials: "include",
          body: JSON.stringify({
            courseName: formData.courseName.trim(),
            courseCode: formData.courseCode.trim().toUpperCase(),
            courseCredit: formData.courseCredit?.trim() || "",
            department: formData.department,
          }),
        }).catch(() => { });
      }

      if (formData.teacherName?.trim()) {
        fetch(`${API_BASE_URL}/api/instructors/submit`, {
          method: "POST",
          headers,
          credentials: "include",
          body: JSON.stringify({
            name: formData.teacherName.trim(),
            designation: formData.teacherDesignation?.trim() || "Lecturer",
            department: formData.teacherDepartment || formData.department,
            institution: formData.teacherInstitution?.trim() || "Mymensingh Engineering College",
          }),
        }).catch(() => { });
      }
    } catch {
      // Non-blocking fire-and-forget
    }
  };

  const handleReset = () => {
    setFormData(DEFAULT_DATA);
    toast("Template reset to sample", { icon: "🔄" });
  };

  const handlePrint = async () => {
    autoSubmitEntities();
    const printRoot = document.getElementById("print-root");
    if (!printRoot) {
      window.print();
      return;
    }
    await printCoverPage(printRoot);
  };


  const getDocTypeHeader = () => {
    switch (formData.docType) {
      case "lab-report":
        return "Lab Report,";
      case "assignment":
        return "Assignment,";
      case "index-table":
        return "Index Table,";
      case "cover-page":
      default:
        return "Cover Page,";
    }
  };

  return (
    <div className="min-h-screen bg-surface-primary text-text-primary">
      {/* Global CSS for Space Mono and Print Mode */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&display=swap");
        @import url("https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap");

        .font-quicksand,
        .font-quicksand * {
          font-family: var(--font-quicksand), "Quicksand", "Nunito", "Segoe UI", ui-sans-serif, system-ui, sans-serif !important;
        }

        .font-space-mono {
          font-family: "Space Mono", monospace !important;
        }

        /* Editable inline field styling */
        .inline-editable {
          cursor: text;
          border-radius: 2px;
          padding: 0;
          margin: 0;
          transition: background-color 0.15s ease, outline 0.15s ease;
          display: inline;
        }
        .inline-editable:empty {
          display: inline-block;
          min-width: 28px;
          min-height: 1em;
          vertical-align: baseline;
        }
        .inline-editable:hover {
          background-color: rgba(34, 197, 94, 0.12);
          outline: 1px dashed rgba(34, 197, 94, 0.4);
        }
        .inline-editable:focus {
          background-color: rgba(34, 197, 94, 0.18);
          outline: 1.5px solid var(--accent-primary, #10b981);
        }

        /* PRINT STYLESHEET */
        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }
          html, body {
            background: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Hide non-print chrome & controls */
          header, footer, nav, aside, .no-print, [data-no-print] {
            display: none !important;
            visibility: hidden !important;
          }
          /* Neutralize wrappers so print-root is the only visible content */
          #main-content,
          main,
          .grid,
          .lg\:col-span-7,
          [data-preview-wrapper],
          [data-scaled-wrapper] {
            display: block !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            max-width: none !important;
            min-height: 0 !important;
            overflow: visible !important;
            perspective: none !important;
            transform: none !important;
            box-shadow: none !important;
            border: none !important;
            background: transparent !important;
          }
          #print-root {
            position: relative !important;
            margin: 0 auto !important;
            top: 0 !important;
            left: 0 !important;
            width: 794px !important;
            height: 1123px !important;
            max-width: 794px !important;
            max-height: 1123px !important;
            box-shadow: none !important;
            border: none !important;
            background: #ffffff !important;
            color: #000000 !important;
            transform: none !important;
            display: block !important;
            visibility: visible !important;
            overflow: hidden !important;
            page-break-before: avoid !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
          }
          #print-root * {
            visibility: visible !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          table {
            border-collapse: collapse !important;
          }
          th, td {
            box-sizing: border-box !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .inline-editable:hover, .inline-editable:focus {
            background-color: transparent !important;
            outline: none !important;
          }
          .inline-editable:empty {
            display: inline !important;
            min-width: 0 !important;
          }
        }
      `}</style>

      {/* Hero / Header Section (No-Print) */}
      <section className="no-print border-b border-border-default bg-surface-secondary/40 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-text-secondary uppercase mb-3">
            <Link href="/" className="hover:text-accent-primary transition-colors">
              Home
            </Link>
            <ChevronRight size={13} />
            <Link href="/resources" className="hover:text-accent-primary transition-colors">
              Resources
            </Link>
            <ChevronRight size={13} />
            <span className="text-text-primary font-bold">Cover Page & Lab Report Generator</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-accent-primary/10 text-accent-primary text-xs font-mono font-bold uppercase rounded border border-accent-primary/30 mb-2">
                <FileText size={13} /> Official MEC Templates
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                MEC Cover Page & Lab Report Builder
              </h1>
              <p className="text-sm text-text-secondary mt-1 max-w-2xl">
                Select your desired template, edit directly on the canvas or customize via the control deck. Formatted with authentic Mymensingh Engineering College typography, high-resolution crest, and instant 1-page A4 print export.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleReset}
                title="Reset to sample values"
                icon={<RotateCcw size={14} />}
              >
                Reset
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handlePrint}
                icon={<Printer size={16} />}
                title="Open browser print dialog / save as PDF"
                className="border border-black shadow-[3px_3px_0px_var(--accent-primary)] font-bold"
              >
                Print
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Workspace: Left Controls + Right Preview */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 lg:pb-8">
        {/* Mobile View Switcher (lg:hidden) */}
        <div className="no-print lg:hidden mb-6">
          <div className="grid grid-cols-2 p-1 bg-surface-elevated border border-black rounded-xl shadow-[3px_3px_0px_var(--accent-primary)] text-xs font-mono font-bold uppercase">
            <button
              type="button"
              onClick={() => {
                setMobileViewMode("edit");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg transition-all ${
                mobileViewMode === "edit"
                  ? "bg-accent-primary text-white shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <FileText size={15} /> Edit Form
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileViewMode("preview");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg transition-all ${
                mobileViewMode === "preview"
                  ? "bg-accent-primary text-white shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <Printer size={15} /> Live Preview
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ================= LEFT CONTROLS (5 cols on lg, 4 cols on xl) ================= */}
          <div className={`no-print lg:col-span-5 xl:col-span-4 space-y-6 ${mobileViewMode === "preview" ? "hidden lg:block" : "block"}`}>
            {/* Document Type Selector Card */}
            <div className="p-5 bg-surface-elevated border border-black rounded-xl shadow-[4px_4px_0px_var(--accent-primary)]">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-text-secondary mb-2">
                Document Type
              </label>
              <Select
                value={formData.docType}
                onChange={(val) => handleChange("docType", val as DocType)}
                options={DOC_TYPE_OPTIONS}
              />
              <div className="flex items-center gap-1.5 mt-2.5 text-[11px] font-mono text-text-secondary">
                <Info size={12} className="text-accent-primary shrink-0" />
                <span>
                  {formData.docType === "cover-page" && "Standard academic cover page format."}
                  {formData.docType === "lab-report" && "Includes Experiment Number and Experiment Title fields."}
                  {formData.docType === "assignment" && "Includes Assignment Number and Topic fields."}
                  {formData.docType === "index-table" && "Lab Report Table of Contents with alternating striped rows (pure table focus)."}
                </span>
              </div>
            </div>

            {/* Tab Navigation for Controls */}
            <div className="flex items-center border-b-2 border-border-default gap-1 overflow-x-auto no-scrollbar">
              {formData.docType === "index-table" ? (
                <button
                  onClick={() => setActiveTab("index")}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold uppercase transition-colors border-b-2 -mb-[2px] ${activeTab === "index"
                    ? "border-accent-primary text-accent-primary"
                    : "border-transparent text-text-secondary hover:text-text-primary"
                    }`}
                >
                  <Table size={14} /> Index Rows
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setActiveTab("document")}
                    className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold uppercase transition-colors border-b-2 -mb-[2px] ${activeTab === "document"
                      ? "border-accent-primary text-accent-primary"
                      : "border-transparent text-text-secondary hover:text-text-primary"
                      }`}
                  >
                    <BookOpen size={14} /> Course Info
                  </button>
                  <button
                    onClick={() => setActiveTab("student")}
                    className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold uppercase transition-colors border-b-2 -mb-[2px] ${activeTab === "student"
                      ? "border-accent-primary text-accent-primary"
                      : "border-transparent text-text-secondary hover:text-text-primary"
                      }`}
                  >
                    <GraduationCap size={14} /> Student Info
                  </button>
                  <button
                    onClick={() => setActiveTab("instructor")}
                    className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold uppercase transition-colors border-b-2 -mb-[2px] ${activeTab === "instructor"
                      ? "border-accent-primary text-accent-primary"
                      : "border-transparent text-text-secondary hover:text-text-primary"
                      }`}
                  >
                    <UserCheck size={14} /> Instructor
                  </button>
                </>
              )}
            </div>

            {/* TAB CONTENT */}
            <div className="bg-surface-elevated border border-black rounded-xl p-5 shadow-[4px_4px_0px_var(--accent-primary)] space-y-4">
              {/* TAB 0: Index Table Rows & Visibility Controls */}
              {activeTab === "index" && (
                <div className="space-y-4">
                  {/* Column Visibility Toggles */}
                  <div className="p-3 bg-surface-secondary/50 border border-border-default rounded-lg space-y-2.5">
                    <div className="text-xs font-mono font-bold uppercase text-text-primary flex items-center justify-between">
                      <span>Column Visibility</span>
                      <span className="text-[10px] text-accent-primary font-normal">Optional</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <label className="flex items-center gap-2 p-2 rounded bg-surface-primary border border-border-default cursor-pointer hover:border-accent-primary transition-colors">
                        <input
                          type="checkbox"
                          checked={showPageNoColumn}
                          onChange={(e) => setShowPageNoColumn(e.target.checked)}
                          className="accent-accent-primary rounded cursor-pointer"
                        />
                        <span className="font-bold">Page No.</span>
                      </label>
                      <label className="flex items-center gap-2 p-2 rounded bg-surface-primary border border-border-default cursor-pointer hover:border-accent-primary transition-colors">
                        <input
                          type="checkbox"
                          checked={showRemarksColumn}
                          onChange={(e) => setShowRemarksColumn(e.target.checked)}
                          className="accent-accent-primary rounded cursor-pointer"
                        />
                        <span className="font-bold">Remarks</span>
                      </label>
                    </div>
                  </div>

                  {/* Action Buttons: Add Row, Blank Handwriting Rows, Reset */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={handleAddIndexRow}
                      className="flex-1 flex items-center justify-center gap-1 px-2.5 py-1.5 bg-accent-primary text-white text-xs font-mono font-bold rounded border border-black shadow-[2px_2px_0px_var(--accent-primary)] hover:opacity-95"
                    >
                      <Plus size={13} /> Add Row
                    </button>
                    <button
                      type="button"
                      onClick={handleFillBlankIndexRows}
                      className="flex-1 flex items-center justify-center gap-1 px-2.5 py-1.5 bg-surface-secondary hover:bg-surface-elevated border border-border-default text-text-primary text-xs font-mono font-bold rounded"
                      title="Load 9 empty rows ready for handwriting"
                    >
                      Blank Rows
                    </button>
                    <button
                      type="button"
                      onClick={handleResetIndexRows}
                      className="px-2.5 py-1.5 bg-surface-secondary hover:bg-surface-elevated border border-border-default text-text-secondary hover:text-text-primary text-xs font-mono font-bold rounded"
                      title="Reset back to standard sample experiments"
                    >
                      <RotateCcw size={12} />
                    </button>
                  </div>

                  {/* List of Rows */}
                  <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                    {indexRows.map((row, index) => (
                      <div
                        key={row.id}
                        className="p-2.5 rounded-lg border border-border-default bg-surface-primary/80 space-y-2 text-xs font-mono"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-text-secondary font-bold">#{index + 1}</span>
                            <input
                              type="text"
                              value={row.sl}
                              onChange={(e) => handleUpdateIndexRow(row.id, "sl", e.target.value)}
                              placeholder="SL"
                              className="w-12 px-1.5 py-1 bg-surface-secondary border border-border-default rounded text-center font-bold text-xs"
                              title="Serial Number"
                            />
                          </div>

                          <div className="flex items-center gap-2 flex-1 justify-end">
                            {showPageNoColumn && (
                              <input
                                type="text"
                                value={row.pageNo}
                                onChange={(e) => handleUpdateIndexRow(row.id, "pageNo", e.target.value)}
                                placeholder="Page"
                                className="w-20 px-1.5 py-1 bg-surface-secondary border border-border-default rounded text-center text-xs"
                                title="Page Number / Range"
                              />
                            )}
                            {showRemarksColumn && (
                              <input
                                type="text"
                                value={row.remarks}
                                onChange={(e) => handleUpdateIndexRow(row.id, "remarks", e.target.value)}
                                placeholder="Remarks"
                                className="w-24 px-1.5 py-1 bg-surface-secondary border border-border-default rounded text-xs"
                                title="Remarks"
                              />
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveIndexRow(row.id)}
                              className="text-text-secondary hover:text-red-500 p-1"
                              title="Delete row"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                        <div>
                          <input
                            type="text"
                            value={row.experimentName}
                            onChange={(e) => handleUpdateIndexRow(row.id, "experimentName", e.target.value)}
                            placeholder="Experiment Name / Topic"
                            className="w-full px-2 py-1.5 bg-surface-secondary border border-border-default rounded text-xs font-mono"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 1: Document & Course Info */}
              {activeTab === "document" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-text-secondary mb-1">
                      Department Name
                    </label>
                    <Select
                      value={formData.department}
                      onChange={(val) => handleChange("department", val)}
                      options={DEPARTMENT_OPTIONS}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-text-secondary mb-1">
                      Course Name
                    </label>
                    <AutoSuggestInput
                      value={formData.courseName}
                      onChange={(val) => handleChange("courseName", val)}
                      onSelect={(course) => {
                        setFormData((prev) => ({
                          ...prev,
                          courseName: course.courseName || prev.courseName,
                          courseCode: course.courseCode || prev.courseCode,
                          courseCredit: course.courseCredit || prev.courseCredit,
                        }));
                      }}
                      placeholder="e.g. Microprocessor and Assembly Language Lab."
                      searchEndpoint="/api/courses/search"
                      department={formData.department}
                      formatSuggestion={(course) => ({
                        primary: course.courseName,
                        secondary: course.courseCredit ? `Credit: ${course.courseCredit}` : "",
                        meta: course.courseCode,
                      })}
                      className="w-full px-3 py-2 bg-surface-primary border border-border-default rounded-md text-base sm:text-sm font-mono focus:border-accent-primary focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase text-text-secondary mb-1">
                        Course Code
                      </label>
                      <AutoSuggestInput
                        value={formData.courseCode}
                        onChange={(val) => handleChange("courseCode", val)}
                        onSelect={(course) => {
                          setFormData((prev) => ({
                            ...prev,
                            courseName: course.courseName || prev.courseName,
                            courseCode: course.courseCode || prev.courseCode,
                            courseCredit: course.courseCredit || prev.courseCredit,
                          }));
                        }}
                        placeholder="e.g. CSE-3113"
                        searchEndpoint="/api/courses/search"
                        department={formData.department}
                        formatSuggestion={(course) => ({
                          primary: course.courseCode,
                          secondary: course.courseName,
                          meta: course.courseCredit ? `${course.courseCredit} cr` : "",
                        })}
                        className="w-full px-3 py-2 bg-surface-primary border border-border-default rounded-md text-base sm:text-sm font-mono focus:border-accent-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase text-text-secondary mb-1">
                        Course Credit (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.courseCredit}
                        onChange={(e) => handleChange("courseCredit", e.target.value)}
                        placeholder="e.g. 1.5"
                        className="w-full px-3 py-2 bg-surface-primary border border-border-default rounded-md text-base sm:text-sm font-mono focus:border-accent-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* If Lab Report, show Experiment fields */}
                  {formData.docType === "lab-report" && (
                    <div className="p-3.5 bg-accent-primary/5 border border-accent-primary/25 rounded-xl space-y-3.5">
                      <div className="text-xs font-mono font-bold text-accent-primary uppercase flex items-center gap-1.5">
                        <Layers size={13} /> Lab Report Specifics
                      </div>
                      <div>
                        <label className="block text-xs font-mono font-bold uppercase text-text-secondary mb-1">
                          Experiment No.
                        </label>
                        <input
                          type="text"
                          value={formData.experimentNo}
                          onChange={(e) => handleChange("experimentNo", e.target.value)}
                          placeholder="e.g. 01"
                          className="w-full px-3 py-2 bg-surface-primary border border-border-default rounded-md text-base sm:text-sm font-mono focus:border-accent-primary focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono font-bold uppercase text-text-secondary mb-1">
                          Name of Experiment
                        </label>
                        <textarea
                          rows={2}
                          value={formData.experimentName}
                          onChange={(e) => handleChange("experimentName", e.target.value)}
                          placeholder="e.g. Implementation of Relational Database Queries..."
                          className="w-full px-3 py-2 bg-surface-primary border border-border-default rounded-md text-base sm:text-sm font-mono focus:border-accent-primary focus:outline-none resize-none"
                        />
                      </div>

                      {/* Date of Experiment with individual visibility toggle */}
                      <div className="pt-2 border-t border-border-default/60 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-mono font-bold uppercase text-text-secondary">
                            Date of Experiment
                          </label>
                          <div className="flex items-center gap-2">
                            <label className="flex items-center gap-1.5 text-xs font-mono text-text-primary cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.showExperimentDate}
                                onChange={(e) => handleChange("showExperimentDate", e.target.checked)}
                                className="accent-accent-primary rounded cursor-pointer"
                              />
                              <span className="font-bold">Show</span>
                            </label>
                            <button
                              type="button"
                              onClick={handleSetTodayExperiment}
                              className="text-[11px] font-mono text-accent-primary hover:underline flex items-center gap-0.5"
                              title="Set experiment date to today"
                            >
                              <Calendar size={11} /> Today
                            </button>
                          </div>
                        </div>
                        <input
                          type="text"
                          value={formData.experimentDate}
                          onChange={(e) => handleChange("experimentDate", e.target.value)}
                          placeholder="e.g. 11/01/2026"
                          disabled={!formData.showExperimentDate}
                          className={`w-full px-3 py-2 bg-surface-primary border border-border-default rounded-md text-base sm:text-sm font-mono focus:border-accent-primary focus:outline-none ${!formData.showExperimentDate ? "opacity-40 cursor-not-allowed" : ""
                            }`}
                        />
                      </div>

                      {/* Date of Submission with individual visibility toggle */}
                      <div className="pt-2 border-t border-border-default/60 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-mono font-bold uppercase text-text-secondary">
                            Date of Submission
                          </label>
                          <div className="flex items-center gap-2">
                            <label className="flex items-center gap-1.5 text-xs font-mono text-text-primary cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.showSubmissionDate}
                                onChange={(e) => handleChange("showSubmissionDate", e.target.checked)}
                                className="accent-accent-primary rounded cursor-pointer"
                              />
                              <span className="font-bold">Show</span>
                            </label>
                            <button
                              type="button"
                              onClick={handleSetTodaySubmission}
                              className="text-[11px] font-mono text-accent-primary hover:underline flex items-center gap-0.5"
                              title="Set submission date to today"
                            >
                              <Calendar size={11} /> Today
                            </button>
                          </div>
                        </div>
                        <input
                          type="text"
                          value={formData.submissionDate}
                          onChange={(e) => handleChange("submissionDate", e.target.value)}
                          placeholder="e.g. 18/01/2026"
                          disabled={!formData.showSubmissionDate}
                          className={`w-full px-3 py-2 bg-surface-primary border border-border-default rounded-md text-base sm:text-sm font-mono focus:border-accent-primary focus:outline-none ${!formData.showSubmissionDate ? "opacity-40 cursor-not-allowed" : ""
                            }`}
                        />
                      </div>
                    </div>
                  )}

                  {/* If Assignment, show Assignment fields */}
                  {formData.docType === "assignment" && (
                    <div className="p-3 bg-accent-primary/5 border border-accent-primary/20 rounded-lg space-y-3">
                      <div className="text-xs font-mono font-bold text-accent-primary uppercase flex items-center gap-1.5">
                        <FileText size={13} /> Assignment Specifics
                      </div>
                      <div>
                        <label className="block text-xs font-mono font-bold uppercase text-text-secondary mb-1">
                          Assignment No.
                        </label>
                        <input
                          type="text"
                          value={formData.assignmentNo}
                          onChange={(e) => handleChange("assignmentNo", e.target.value)}
                          placeholder="e.g. 01"
                          className="w-full px-3 py-2 bg-surface-primary border border-border-default rounded-md text-base sm:text-sm font-mono focus:border-accent-primary focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono font-bold uppercase text-text-secondary mb-1">
                          Assignment Name
                        </label>
                        <textarea
                          rows={2}
                          value={formData.assignmentTopic}
                          onChange={(e) => handleChange("assignmentTopic", e.target.value)}
                          placeholder="e.g. Pipeline Hazard Resolution and Branch Prediction..."
                          className="w-full px-3 py-2 bg-surface-primary border border-border-default rounded-md text-base sm:text-sm font-mono focus:border-accent-primary focus:outline-none resize-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Submission Date for Cover Page / Assignment */}
                  {formData.docType !== "lab-report" && (
                    <div className="pt-2 border-t border-border-default space-y-1.5">
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-mono font-bold uppercase text-text-secondary">
                          Submission Date
                        </label>
                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-1.5 text-xs font-mono text-text-primary cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.showSubmissionDate}
                              onChange={(e) => handleChange("showSubmissionDate", e.target.checked)}
                              className="accent-accent-primary rounded cursor-pointer"
                            />
                            <span className="font-bold">Show</span>
                          </label>
                          <button
                            type="button"
                            onClick={handleSetTodaySubmission}
                            className="text-[11px] font-mono text-accent-primary hover:underline flex items-center gap-1"
                          >
                            <Calendar size={11} /> Today
                          </button>
                        </div>
                      </div>
                      <input
                        type="text"
                        value={formData.submissionDate}
                        onChange={(e) => handleChange("submissionDate", e.target.value)}
                        placeholder="e.g. 18/01/2026"
                        disabled={!formData.showSubmissionDate}
                        className={`w-full px-3 py-2 bg-surface-primary border border-border-default rounded-md text-base sm:text-sm font-mono focus:border-accent-primary focus:outline-none ${!formData.showSubmissionDate ? "opacity-40 cursor-not-allowed" : ""
                          }`}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: Student Information */}
              {activeTab === "student" && (
                <div className="space-y-4">
                  {isAuthenticated && user && (
                    <div className="p-3 bg-accent-primary/10 border border-accent-primary/30 rounded-lg flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2 min-w-0">
                        <UserCheck size={14} className="text-accent-primary shrink-0" />
                        <div className="truncate">
                          <span className="font-bold text-text-primary">{user.fullName}</span>
                          <span className="text-text-secondary ml-1.5">({user.studentId || "MEC Member"})</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleSyncWithAccount}
                        className="text-[11px] text-accent-primary font-bold hover:underline shrink-0 ml-2"
                        title="Reset fields with data from your website profile"
                      >
                        Re-sync
                      </button>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-text-secondary mb-1">
                      Student Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.studentName}
                      onChange={(e) => handleChange("studentName", e.target.value)}
                      placeholder="e.g. Twahid Ahmmed."
                      className="w-full px-3 py-2 bg-surface-primary border border-border-default rounded-md text-base sm:text-sm font-mono focus:border-accent-primary focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase text-text-secondary mb-1">
                        Class Roll
                      </label>
                      <input
                        type="text"
                        value={formData.roll}
                        onChange={(e) => handleChange("roll", e.target.value)}
                        placeholder="e.g. 210347"
                        className="w-full px-3 py-2 bg-surface-primary border border-border-default rounded-md text-base sm:text-sm font-mono focus:border-accent-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase text-text-secondary mb-1">
                        Registration No.
                      </label>
                      <input
                        type="text"
                        value={formData.reg}
                        onChange={(e) => handleChange("reg", e.target.value)}
                        placeholder="e.g. 1335"
                        className="w-full px-3 py-2 bg-surface-primary border border-border-default rounded-md text-base sm:text-sm font-mono focus:border-accent-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase text-text-secondary mb-1">
                        Dept. Code (Short)
                      </label>
                      <input
                        type="text"
                        value={formData.studentDepartment}
                        onChange={(e) => handleChange("studentDepartment", e.target.value)}
                        placeholder="e.g. CSE"
                        className="w-full px-3 py-2 bg-surface-primary border border-border-default rounded-md text-base sm:text-sm font-mono focus:border-accent-primary focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase text-text-secondary mb-1">
                        Academic Session
                      </label>
                      <input
                        type="text"
                        value={formData.session}
                        onChange={(e) => handleChange("session", e.target.value)}
                        placeholder="e.g. 2021-2022"
                        className="w-full px-3 py-2 bg-surface-primary border border-border-default rounded-md text-base sm:text-sm font-mono focus:border-accent-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase text-text-secondary mb-1">
                        Academic Year
                      </label>
                      <Select
                        value={`${formData.yearNumber}-${formData.yearSuffix}`}
                        onChange={handleYearChange}
                        options={YEAR_OPTIONS}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-bold uppercase text-text-secondary mb-1">
                        Semester
                      </label>
                      <Select
                        value={`${formData.semNumber}-${formData.semSuffix}`}
                        onChange={handleSemChange}
                        options={SEMESTER_OPTIONS}
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      fullWidth
                      onClick={handleSaveStudentProfile}
                      icon={<Save size={14} />}
                    >
                      Save As Default Student Info
                    </Button>
                  </div>
                </div>
              )}

              {/* TAB 3: Instructor Information */}
              {activeTab === "instructor" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-text-secondary mb-1">
                      Instructor Name
                    </label>
                    <AutoSuggestInput
                      value={formData.teacherName}
                      onChange={(val) => handleChange("teacherName", val)}
                      onSelect={(inst) => {
                        setFormData((prev) => ({
                          ...prev,
                          teacherName: inst.name || prev.teacherName,
                          teacherDesignation: inst.designation || prev.teacherDesignation,
                          teacherDepartment: inst.department
                            ? (inst.department.startsWith("Department") ? inst.department : `Department of ${inst.department}`)
                            : prev.teacherDepartment,
                          teacherInstitution: inst.institution || prev.teacherInstitution,
                        }));
                      }}
                      placeholder="e.g. Md. Ismail Hossain"
                      searchEndpoint="/api/instructors/search"
                      department={formData.department}
                      formatSuggestion={(inst) => ({
                        primary: inst.name,
                        secondary: `${inst.designation || "Lecturer"} • ${inst.department || "CSE"}`,
                        meta: inst.department,
                      })}
                      className="w-full px-3 py-2 bg-surface-primary border border-border-default rounded-md text-base sm:text-sm font-mono focus:border-accent-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-text-secondary mb-1">
                      Designation
                    </label>
                    <input
                      type="text"
                      value={formData.teacherDesignation}
                      onChange={(e) => handleChange("teacherDesignation", e.target.value)}
                      placeholder="e.g. Adjunct Lecturer,"
                      className="w-full px-3 py-2 bg-surface-primary border border-border-default rounded-md text-base sm:text-sm font-mono focus:border-accent-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-text-secondary mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      value={formData.teacherDepartment}
                      onChange={(e) => handleChange("teacherDepartment", e.target.value)}
                      placeholder="e.g. Department of Computer Science & Engineering,"
                      className="w-full px-3 py-2 bg-surface-primary border border-border-default rounded-md text-base sm:text-sm font-mono focus:border-accent-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-text-secondary mb-1">
                      Institution
                    </label>
                    <input
                      type="text"
                      value={formData.teacherInstitution}
                      onChange={(e) => handleChange("teacherInstitution", e.target.value)}
                      placeholder="e.g. Mymensingh Engineering College."
                      className="w-full px-3 py-2 bg-surface-primary border border-border-default rounded-md text-base sm:text-sm font-mono focus:border-accent-primary focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Tips */}
            <div className="p-4 bg-surface-secondary/40 border border-black rounded-xl text-xs font-mono text-text-secondary space-y-1">
              <div className="font-bold text-text-primary uppercase flex items-center gap-1.5">
                <Sparkles size={13} className="text-accent-primary" /> Pro Tip: Inline Canvas Editing
              </div>
              <p>
                You can also click directly on any text on the white A4 page to edit it inline. Changes sync instantly
                with the controls.
              </p>
            </div>

            {/* Mobile-Only: Jump to Preview Button */}
            <div className="lg:hidden pt-2">
              <button
                type="button"
                onClick={() => {
                  setMobileViewMode("preview");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="w-full py-3 px-4 bg-accent-primary text-white font-mono font-bold text-sm uppercase rounded-xl border border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 hover:opacity-95 active:translate-y-0.5 transition-all"
              >
                <Printer size={16} /> View A4 Preview & Print
              </button>
            </div>
          </div>

          {/* ================= RIGHT PREVIEW CANVAS (7 cols on lg, 8 cols on xl) ================= */}
          <div className={`lg:col-span-7 xl:col-span-8 flex flex-col items-center w-full ${mobileViewMode === "edit" ? "hidden lg:flex" : "flex"}`}>
            {/* Desktop Top Toolbar: Template Dropdown + Zoom / Viewport Controls (No-Print) */}
            <div className="no-print w-full max-w-[794px] hidden lg:flex flex-wrap items-center justify-between gap-3 pb-3 px-2">
              {/* Template Dropdown Selector */}
              <div className="flex items-center gap-2 flex-1 min-w-[240px] max-w-sm">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-text-secondary whitespace-nowrap flex items-center gap-1.5">
                  <Layers size={13} className="text-accent-primary" /> Template:
                </span>
                <div className="flex-1">
                  <Select
                    value={formData.template}
                    onChange={(val) => handleChange("template", val as CoverTemplate)}
                    options={TEMPLATE_SELECT_OPTIONS}
                  />
                </div>
              </div>

              {/* Viewport Badge & Zoom Controls */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] bg-accent-primary/10 text-accent-primary px-2 py-1 rounded font-mono font-bold hidden sm:inline-block">
                  210 × 297 mm (A4)
                </span>

                <div className="flex items-center gap-1 bg-surface-elevated border border-border-default rounded-lg p-1">
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(0.55, z - 0.1))}
                    className="p-1 hover:text-accent-primary transition-colors cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut size={14} />
                  </button>
                  <span className="px-1.5 text-[11px] font-mono font-bold text-text-primary min-w-[42px] text-center">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(1.15, z + 0.1))}
                    className="p-1 hover:text-accent-primary transition-colors cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn size={14} />
                  </button>
                  <button
                    onClick={() => setZoomLevel(1.0)}
                    className={`px-1.5 py-0.5 text-[11px] font-mono font-bold rounded hover:text-accent-primary transition-colors border-l border-border-default cursor-pointer ${zoomLevel === 1.0 ? "text-accent-primary bg-accent-primary/10" : ""}`}
                    title="100% (Actual A4 Size)"
                  >
                    100%
                  </button>
                  <button
                    onClick={() => setZoomLevel(0.85)}
                    className={`p-1 hover:text-accent-primary transition-colors border-l border-border-default pl-1.5 cursor-pointer ${zoomLevel === 0.85 ? "text-accent-primary" : ""}`}
                    title="Fit Preview (85%)"
                  >
                    <Maximize2 size={13} />
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Top Toolbar (lg:hidden) */}
            <div className="no-print w-full flex flex-col gap-2.5 pb-3 px-1 lg:hidden">
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <Select
                    value={formData.template}
                    onChange={(val) => handleChange("template", val as CoverTemplate)}
                    options={TEMPLATE_SELECT_OPTIONS}
                  />
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setMobileFitMode(true)}
                    className={`px-2.5 py-1.5 text-xs font-mono font-bold rounded border transition-all ${
                      mobileFitMode
                        ? "bg-accent-primary text-white border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                        : "bg-surface-elevated text-text-secondary border-border-default hover:text-text-primary"
                    }`}
                    title="Fit to mobile screen width"
                  >
                    Fit
                  </button>
                  <button
                    type="button"
                    onClick={() => setMobileFitMode(false)}
                    className={`px-2.5 py-1.5 text-xs font-mono font-bold rounded border transition-all ${
                      !mobileFitMode
                        ? "bg-accent-primary text-white border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]"
                        : "bg-surface-elevated text-text-secondary border-border-default hover:text-text-primary"
                    }`}
                    title="100% Actual Size (Scroll to inspect)"
                  >
                    100%
                  </button>
                </div>
              </div>

              {/* Mobile View Mode Info Helper */}
              <div className="flex items-center justify-between text-[11px] font-mono text-text-muted px-1">
                <span>{mobileFitMode ? "Auto-fitted A4 sheet" : "Actual 1:1 scale (scroll horizontally)"}</span>
                <span className="text-accent-primary font-bold">210 × 297 mm</span>
              </div>
            </div>

            {/* Canvas Outer Container with Shadow and Frame */}
            <div
              data-preview-wrapper
              className={`w-full flex justify-center pb-8 pt-2 ${
                isMobile && !mobileFitMode ? "overflow-x-auto" : "overflow-hidden lg:overflow-x-auto"
              }`}
            >
              <div
                data-scaled-wrapper
                style={
                  isMobile && mobileFitMode
                    ? {
                        width: `${Math.round(794 * mobileScale)}px`,
                        height: `${Math.round(1123 * mobileScale)}px`,
                        position: "relative",
                        overflow: "hidden",
                        margin: "0 auto",
                      }
                    : undefined
                }
              >
                {/* THE EXACT A4 (210mm x 297mm @ 96 DPI: 794px x 1123px) PRINT SHEET */}
                <div
                  id="print-root"
                  style={{
                    width: "794px",
                    minWidth: "794px",
                    maxWidth: "794px",
                    height: "1123px",
                    minHeight: "1123px",
                    maxHeight: "1123px",
                    transform: `scale(${isMobile ? (mobileFitMode ? mobileScale : 1.0) : zoomLevel})`,
                    transformOrigin: isMobile && mobileFitMode ? "top left" : "top center",
                    backgroundColor: "#FFFFFF",
                    color: "#000000",
                  }}
                className={`${formData.template === "classic-mono"
                  ? `${spaceMono.className} font-space-mono pt-[81px] pb-[80px] px-[64px] flex flex-col justify-start shrink-0`
                  : formData.docType === "index-table"
                    ? "font-quicksand p-[48px] sm:p-[56px] flex flex-col justify-between shrink-0"
                    : "font-quicksand p-0 block relative shrink-0"
                  } text-black shadow-2xl border border-neutral-300 transition-transform duration-150 relative box-border select-text`}
              >
                {/* ----------------- IF INDEX TABLE ----------------- */}
                {formData.docType === "index-table" ? (
                  <div className="flex flex-col flex-1 justify-between select-text">
                    <div>
                      {/* Index Table Header */}
                      {formData.template === "modern-clean" ? (
                        <div className="flex items-center justify-center gap-4 pb-4 border-b border-black">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="/mec-logo.png"
                            alt="Mymensingh Engineering College Crest"
                            width={68}
                            height={68}
                            className="w-[68px] h-[68px] object-contain shrink-0"
                          />
                          <div className="text-left flex flex-col justify-center">
                            <h2
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) => handleChange("institution", e.currentTarget.textContent || "")}
                              className="inline-editable block text-[22px] font-bold tracking-tight text-neutral-900 leading-snug"
                              style={{ display: "block" }}
                              title="Click to edit institution"
                            >
                              {formData.institution}
                            </h2>
                            <div
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) => handleChange("department", e.currentTarget.textContent || "")}
                              className="inline-editable block text-[14px] font-medium text-neutral-800 mt-0.5"
                              style={{ display: "block" }}
                              title="Click to edit department"
                            >
                              {formData.department}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full pb-2">
                          <MecHeaderVector
                            department={formData.department}
                            onDepartmentChange={(dept) => handleChange("department", dept)}
                          />
                        </div>
                      )}

                      {/* Centered Title */}
                      <div className="text-center my-6">
                        <div
                          className="inline-block border-b-2 border-black pb-1 px-4"
                          style={{
                            borderBottom: "2px solid #000000",
                            paddingBottom: "4px",
                            paddingLeft: "16px",
                            paddingRight: "16px",
                          }}
                        >
                          <span
                            contentEditable
                            suppressContentEditableWarning
                            className="inline-editable text-[18px] font-bold tracking-widest uppercase inline-block"
                            title="Click to edit table title"
                          >
                            INDEX / TABLE OF CONTENTS
                          </span>
                        </div>
                      </div>

                      {/* NO COURSE OR STUDENT INFO BOX HERE (Clean Table Focus) */}

                      {/* THE INDEX TABLE */}
                      <div className="w-full mt-2">
                        <table
                          className="w-full border-collapse border-2 border-black font-space-mono"
                          style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            border: "2px solid #000000",
                            tableLayout: "fixed",
                          }}
                        >
                          {/* Table Header */}
                          <thead>
                            <tr
                              className="bg-black text-white font-bold text-[12px] uppercase tracking-wider text-center"
                              style={{
                                backgroundColor: "#000000",
                                color: "#FFFFFF",
                                borderBottom: "2px solid #000000",
                              }}
                            >
                              <th
                                style={{
                                  width: "60px",
                                  borderRight: "1px solid rgba(255, 255, 255, 0.4)",
                                  borderBottom: "2px solid #000000",
                                  padding: "8px 4px",
                                  textAlign: "center",
                                  verticalAlign: "middle",
                                }}
                              >
                                <div className="flex flex-col items-center justify-center leading-tight">
                                  <span>SL</span>
                                  <span>NO.</span>
                                </div>
                              </th>
                              <th
                                style={{
                                  borderRight: showPageNoColumn || showRemarksColumn ? "1px solid rgba(255, 255, 255, 0.4)" : "none",
                                  borderBottom: "2px solid #000000",
                                  padding: "10px 14px",
                                  textAlign: "left",
                                  verticalAlign: "middle",
                                }}
                              >
                                EXPERIMENT NAME
                              </th>
                              {showPageNoColumn && (
                                <th
                                  style={{
                                    width: "84px",
                                    borderRight: showRemarksColumn ? "1px solid rgba(255, 255, 255, 0.4)" : "none",
                                    borderBottom: "2px solid #000000",
                                    padding: "10px 4px",
                                    textAlign: "center",
                                    verticalAlign: "middle",
                                  }}
                                >
                                  PAGE
                                </th>
                              )}
                              {showRemarksColumn && (
                                <th
                                  style={{
                                    width: "96px",
                                    borderBottom: "2px solid #000000",
                                    padding: "10px 4px",
                                    textAlign: "center",
                                    verticalAlign: "middle",
                                  }}
                                >
                                  REMARKS
                                </th>
                              )}
                            </tr>
                          </thead>

                          {/* Table Rows with Alternating White & Light Ash background */}
                          <tbody>
                            {indexRows.map((row, idx) => {
                              const isWhite = idx % 2 === 0;
                              const rowBg = isWhite ? "#FFFFFF" : "#e6e7e7";
                              const isLast = idx === indexRows.length - 1;
                              return (
                                <tr
                                  key={row.id || idx}
                                  style={{
                                    backgroundColor: rowBg,
                                    borderBottom: !isLast ? "1px solid #000000" : "none",
                                  }}
                                  className="text-[12.5px]"
                                >
                                  {/* SL Column */}
                                  <td
                                    style={{
                                      width: "60px",
                                      borderRight: "1px solid #000000",
                                      borderBottom: !isLast ? "1px solid #000000" : "none",
                                      padding: "8px 4px",
                                      textAlign: "center",
                                      verticalAlign: "middle",
                                      fontWeight: "bold",
                                      backgroundColor: rowBg,
                                    }}
                                  >
                                    <span
                                      contentEditable
                                      suppressContentEditableWarning
                                      onBlur={(e) => handleUpdateIndexRow(row.id, "sl", e.currentTarget.textContent || "")}
                                      className="inline-editable block text-center"
                                      title="Click to edit SL"
                                    >
                                      {row.sl}
                                    </span>
                                  </td>

                                  {/* Experiment Name Column */}
                                  <td
                                    style={{
                                      borderRight: showPageNoColumn || showRemarksColumn ? "1px solid #000000" : "none",
                                      borderBottom: !isLast ? "1px solid #000000" : "none",
                                      padding: "8px 14px",
                                      textAlign: "left",
                                      verticalAlign: "middle",
                                      lineHeight: "1.35",
                                      backgroundColor: rowBg,
                                    }}
                                  >
                                    <span
                                      contentEditable
                                      suppressContentEditableWarning
                                      onBlur={(e) =>
                                        handleUpdateIndexRow(row.id, "experimentName", e.currentTarget.textContent || "")
                                      }
                                      className="inline-editable block w-full text-left"
                                      title="Click to edit experiment name"
                                    >
                                      {row.experimentName}
                                    </span>
                                  </td>

                                  {/* Page No Column (Optional) */}
                                  {showPageNoColumn && (
                                    <td
                                      style={{
                                        width: "84px",
                                        borderRight: showRemarksColumn ? "1px solid #000000" : "none",
                                        borderBottom: !isLast ? "1px solid #000000" : "none",
                                        padding: "8px 4px",
                                        textAlign: "center",
                                        verticalAlign: "middle",
                                        backgroundColor: rowBg,
                                      }}
                                    >
                                      <span
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) =>
                                          handleUpdateIndexRow(row.id, "pageNo", e.currentTarget.textContent || "")
                                        }
                                        className="inline-editable block text-center"
                                        title="Click to edit page"
                                      >
                                        {row.pageNo}
                                      </span>
                                    </td>
                                  )}

                                  {/* Remarks Column (Optional) */}
                                  {showRemarksColumn && (
                                    <td
                                      style={{
                                        width: "96px",
                                        borderBottom: !isLast ? "1px solid #000000" : "none",
                                        padding: "8px 4px",
                                        textAlign: "center",
                                        verticalAlign: "middle",
                                        backgroundColor: rowBg,
                                      }}
                                    >
                                      <span
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) =>
                                          handleUpdateIndexRow(row.id, "remarks", e.currentTarget.textContent || "")
                                        }
                                        className="inline-editable block text-center"
                                        title="Click to edit remarks"
                                      >
                                        {row.remarks}
                                      </span>
                                    </td>
                                  )}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Footer: Submission Date & Teacher's Signature */}
                    <div className="mt-12 flex items-end justify-between text-[13px] leading-[1.3] pt-4">
                      {/* Date */}
                      {formData.showSubmissionDate ? (
                        <div className="space-y-[3px]">
                          <div>
                            <span className="font-bold">Submission Date : </span>
                            <span
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) => handleChange("submissionDate", e.currentTarget.textContent || "")}
                              className="inline-editable font-bold"
                              title="Click to edit submission date"
                            >
                              {formData.submissionDate}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div />
                      )}

                      {/* Teacher's Signature Line */}
                      <div className="text-center pr-4 space-y-1">
                        <div className="w-48 border-b border-black mb-1" />
                        <div className="font-normal text-[12.5px]">Teacher&apos;s Signature &amp; Date</div>
                      </div>
                    </div>
                  </div>
                ) : formData.template === "modern-clean" ? (
                  /* ================= TEMPLATE 2: MODERN CENTERED (hehe.pdf, Lab Report & Assignment) ================= */
                  <div className="relative min-h-[1123px] w-[794px] overflow-hidden bg-white text-black select-text font-quicksand">
                    {/* Institution name (fully centered across 816px sheet) */}
                    <div
                      className={`${formData.docType === "lab-report" || formData.docType === "assignment"
                        ? "pt-[46px]"
                        : "pt-[72px]"
                        } text-center w-full block`}
                    >
                      <h1
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => handleChange("institution", e.currentTarget.textContent || "")}
                        className="inline-editable inline-block text-center text-[35px] font-bold leading-[42px] tracking-tight text-neutral-900 font-quicksand"
                        title="Click to edit institution"
                      >
                        {formData.institution}
                      </h1>
                    </div>

                    {/* Crest (high-res matching reference) */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/mec-logo.png"
                      alt="Mymensingh Engineering College Crest"
                      width={formData.docType === "lab-report" || formData.docType === "assignment" ? 208 : 232}
                      height={formData.docType === "lab-report" || formData.docType === "assignment" ? 208 : 232}
                      style={{
                        width:
                          formData.docType === "lab-report" || formData.docType === "assignment"
                            ? "208px"
                            : "232px",
                        height:
                          formData.docType === "lab-report" || formData.docType === "assignment"
                            ? "208px"
                            : "232px",
                      }}
                      className={`mx-auto ${formData.docType === "lab-report" || formData.docType === "assignment"
                        ? "mt-[38px]"
                        : "mt-[74px]"
                        } block object-contain`}
                    />

                    {/* Department + course */}
                    <p
                      className={`${formData.docType === "lab-report" || formData.docType === "assignment"
                        ? "mt-[34px]"
                        : "mt-[62px]"
                        } text-center text-[22px] font-semibold leading-[30px] text-neutral-900`}
                    >
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => handleChange("department", e.currentTarget.textContent || "")}
                        className="inline-editable"
                        title="Click to edit department"
                      >
                        {formData.department}
                      </span>
                    </p>
                    <p
                      className={`${formData.docType === "lab-report" || formData.docType === "assignment"
                        ? "mt-[12px]"
                        : "mt-[17px]"
                        } text-center text-[24px] leading-[32px] text-neutral-900`}
                    >
                      <span>Course Name: </span>
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => handleChange("courseName", e.currentTarget.textContent || "")}
                        className="inline-editable"
                        title="Click to edit course name"
                      >
                        {formData.courseName}
                      </span>
                    </p>
                    <p
                      className={`${formData.docType === "lab-report" || formData.docType === "assignment"
                        ? "mt-[10px]"
                        : "mt-[16px]"
                        } text-center text-[24px] leading-[32px] text-neutral-900`}
                    >
                      <span>Course Code: </span>
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => handleChange("courseCode", e.currentTarget.textContent || "")}
                        className="inline-editable"
                        title="Click to edit course code"
                      >
                        {formData.courseCode}
                      </span>
                    </p>

                    {/* Lab Report Specifics: Experiment No, Name of Experiment, and individual dates */}
                    {formData.docType === "lab-report" && (
                      <div className="mt-[28px] pl-[114px] pr-[34px] text-left text-neutral-900 text-[18.5px] leading-[28px]">
                        <p>
                          <span className="font-semibold">Experiment No:</span>{" "}
                          <span
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => handleChange("experimentNo", e.currentTarget.textContent || "")}
                            className="inline-editable font-normal"
                            style={{ display: "inline" }}
                            title="Click to edit experiment number"
                          >
                            {formData.experimentNo}
                          </span>
                        </p>
                        <p className="mt-[2px]">
                          <span className="font-semibold">Name of Experiment:</span>{" "}
                          <span
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => handleChange("experimentName", e.currentTarget.textContent || "")}
                            className="inline-editable font-normal"
                            style={{ display: "inline" }}
                            title="Click to edit experiment name"
                          >
                            {formData.experimentName}
                          </span>
                        </p>

                        {(formData.showExperimentDate || formData.showSubmissionDate) && (
                          <div className="mt-[14px] space-y-[2px]">
                            {formData.showExperimentDate && (
                              <p>
                                <span className="font-semibold">Date of Experiment:</span>{" "}
                                <span
                                  contentEditable
                                  suppressContentEditableWarning
                                  onBlur={(e) => handleChange("experimentDate", e.currentTarget.textContent || "")}
                                  className="inline-editable font-normal"
                                  style={{ display: "inline" }}
                                  title="Click to edit date of experiment"
                                >
                                  {formData.experimentDate}
                                </span>
                              </p>
                            )}
                            {formData.showSubmissionDate && (
                              <p>
                                <span className="font-semibold">Date of Submission:</span>{" "}
                                <span
                                  contentEditable
                                  suppressContentEditableWarning
                                  onBlur={(e) => handleChange("submissionDate", e.currentTarget.textContent || "")}
                                  className="inline-editable font-normal"
                                  style={{ display: "inline" }}
                                  title="Click to edit date of submission"
                                >
                                  {formData.submissionDate}
                                </span>
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Assignment Specifics: Assignment No, Assignment Name, and Submission Date */}
                    {formData.docType === "assignment" && (
                      <div className="mt-[28px] pl-[114px] pr-[34px] text-left text-neutral-900 text-[18.5px] leading-[28px]">
                        <p>
                          <span className="font-semibold">Assignment No:</span>{" "}
                          <span
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => handleChange("assignmentNo", e.currentTarget.textContent || "")}
                            className="inline-editable font-normal"
                            style={{ display: "inline" }}
                            title="Click to edit assignment number"
                          >
                            {formData.assignmentNo}
                          </span>
                        </p>
                        <p className="mt-[2px]">
                          <span className="font-semibold">Assignment Name:</span>{" "}
                          <span
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => handleChange("assignmentTopic", e.currentTarget.textContent || "")}
                            className="inline-editable font-normal"
                            style={{ display: "inline" }}
                            title="Click to edit assignment name"
                          >
                            {formData.assignmentTopic}
                          </span>
                        </p>

                        {formData.showSubmissionDate && (
                          <div className="mt-[14px]">
                            <p>
                              <span className="font-semibold">Date of Submission:</span>{" "}
                              <span
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => handleChange("submissionDate", e.currentTarget.textContent || "")}
                                className="inline-editable font-normal"
                                style={{ display: "inline" }}
                                title="Click to edit date of submission"
                              >
                                {formData.submissionDate}
                              </span>
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Two-column block: Left edge 114px, right column starts at 456px */}
                    <div
                      className={`${formData.docType === "lab-report" || formData.docType === "assignment"
                        ? "mt-[32px]"
                        : "mt-[58px]"
                        } grid grid-cols-[342px_1fr] pl-[114px] pr-[34px] text-neutral-900 text-left`}
                    >
                      <section>
                        <h2 className="text-[23px] font-semibold leading-[31px] tracking-tight">Submitted By:</h2>
                        <div className="text-[18px] leading-[27px] mt-1 space-y-0.5">
                          <p>
                            Name:{" "}
                            <span
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) => handleChange("studentName", e.currentTarget.textContent || "")}
                              className="inline-editable"
                              title="Click to edit student name"
                            >
                              {formData.studentName}
                            </span>
                          </p>
                          <p>
                            Department:{" "}
                            <span
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) => handleChange("studentDepartment", e.currentTarget.textContent || "")}
                              className="inline-editable"
                              title="Click to edit department code"
                            >
                              {formData.studentDepartment || "CSE"}
                            </span>
                          </p>
                          <p>
                            Roll:{" "}
                            <span
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) => handleChange("roll", e.currentTarget.textContent || "")}
                              className="inline-editable"
                              title="Click to edit roll"
                            >
                              {formData.roll}
                            </span>
                          </p>
                          <p>
                            Reg no:{" "}
                            <span
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) => handleChange("reg", e.currentTarget.textContent || "")}
                              className="inline-editable"
                              title="Click to edit reg no"
                            >
                              {formData.reg}
                            </span>
                          </p>
                          <p>
                            Session:{" "}
                            <span
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) => handleChange("session", e.currentTarget.textContent || "")}
                              className="inline-editable"
                              title="Click to edit session"
                            >
                              {formData.session}
                            </span>
                          </p>
                        </div>
                      </section>

                      <section>
                        <h2 className="text-[23px] font-semibold leading-[31px] tracking-tight">Submitted To:</h2>
                        <div className="text-[18px] leading-[27px] mt-1 space-y-0.5">
                          <p className="font-semibold">
                            <span
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) => handleChange("teacherName", e.currentTarget.textContent || "")}
                              className="inline-editable font-semibold"
                              title="Click to edit instructor name"
                            >
                              {formData.teacherName}
                            </span>
                          </p>
                          {formData.teacherDesignation && (
                            <p>
                              <span
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => handleChange("teacherDesignation", e.currentTarget.textContent || "")}
                                className="inline-editable"
                                title="Click to edit designation"
                              >
                                {formData.teacherDesignation}
                              </span>
                            </p>
                          )}
                          {formData.teacherDepartment && (
                            <p>
                              <span
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => handleChange("teacherDepartment", e.currentTarget.textContent || "")}
                                className="inline-editable"
                                title="Click to edit teacher department"
                              >
                                {formData.teacherDepartment}
                              </span>
                            </p>
                          )}
                          {formData.teacherInstitution && (
                            <p>
                              <span
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => handleChange("teacherInstitution", e.currentTarget.textContent || "")}
                                className="inline-editable"
                                title="Click to edit teacher institution"
                              >
                                {formData.teacherInstitution}
                              </span>
                            </p>
                          )}
                        </div>
                      </section>
                    </div>

                    {/* Signature rule, bottom right */}
                    {formData.docType === "lab-report" || formData.docType === "assignment" ? (
                      <div className="absolute right-[96px] bottom-[68px] w-[140px] text-center">
                        <div className="h-[1.5px] w-full bg-black mb-1" />
                        <p className="text-[21px] leading-[28px] text-neutral-900 font-normal">
                          Signature
                        </p>
                      </div>
                    ) : (
                      <div className="absolute left-[571px] top-[926px] w-[139px]">
                        <div className="h-[1.5px] w-full bg-black mb-1" />
                        <p className="mt-[2px] whitespace-nowrap text-right text-[24px] leading-[32px] text-neutral-900 font-normal">
                          Signature
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  /* ================= TEMPLATE 1: CLASSIC SPACE MONO (PREMIUM ACADEMIC) ================= */
                  <div className={`flex flex-col flex-1 w-full justify-start select-text ${spaceMono.className} font-space-mono text-[#030202]`}>
                    {/* Official Adobe Illustrator Vector Header (Exact Seal, Line, and Overlapping Typography) */}
                    <MecHeaderVector
                      department={formData.department}
                      onDepartmentChange={(dept) => handleChange("department", dept)}
                    />

                    {/* Section 1: Document Type & Course Information Block (108px gap from header) */}
                    <div className="mt-[108px] text-[17.3px] leading-[1.2] text-[#030202]">
                      <div className="font-bold text-[17.3px] leading-[1.2] mb-[2px] text-[#030202]">
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          className="inline-editable font-bold"
                          title="Click to edit document header"
                        >
                          {getDocTypeHeader()}
                        </span>
                      </div>

                      <div className="flex items-start">
                        <span className="font-normal shrink-0 w-[140px] whitespace-nowrap">Course Name</span>
                        <span className="shrink-0 mx-1">:</span>
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => handleChange("courseName", e.currentTarget.textContent || "")}
                          className="inline-editable font-normal flex-1"
                          title="Click to edit course name"
                        >
                          {formData.courseName}
                        </span>
                      </div>

                      <div className="flex items-start">
                        <span className="font-normal shrink-0 w-[140px] whitespace-nowrap">Course Code</span>
                        <span className="shrink-0 mx-1">:</span>
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => handleChange("courseCode", e.currentTarget.textContent || "")}
                          className="inline-editable font-normal flex-1"
                          title="Click to edit course code"
                        >
                          {formData.courseCode}
                        </span>
                      </div>

                      {formData.courseCredit?.trim() ? (
                        <div className="flex items-start">
                          <span className="font-normal shrink-0 w-[140px] whitespace-nowrap">Course Credit</span>
                          <span className="shrink-0 mx-1">:</span>
                          <span
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => handleChange("courseCredit", e.currentTarget.textContent || "")}
                            className="inline-editable font-normal flex-1"
                            title="Click to edit course credit"
                          >
                            {formData.courseCredit}
                          </span>
                        </div>
                      ) : null}

                      {/* Dynamic Lab Report Fields */}
                      {formData.docType === "lab-report" && (
                        <>
                          <div className="flex items-start">
                            <span className="font-normal shrink-0 w-[140px] whitespace-nowrap">Exp. No.</span>
                            <span className="shrink-0 mx-1">:</span>
                            <span
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) => handleChange("experimentNo", e.currentTarget.textContent || "")}
                              className="inline-editable font-normal flex-1"
                              title="Click to edit experiment number"
                            >
                              {formData.experimentNo}
                            </span>
                          </div>
                          <div className="flex items-start">
                            <span className="font-normal shrink-0 w-[140px] whitespace-nowrap">Exp. Name</span>
                            <span className="shrink-0 mx-1">:</span>
                            <span
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) => handleChange("experimentName", e.currentTarget.textContent || "")}
                              className="inline-editable font-normal flex-1"
                              title="Click to edit experiment name"
                            >
                              {formData.experimentName}
                            </span>
                          </div>
                        </>
                      )}

                      {/* Dynamic Assignment Fields */}
                      {formData.docType === "assignment" && (
                        <>
                          <div className="flex items-start">
                            <span className="font-normal shrink-0 w-[140px] whitespace-nowrap">Assign. No.</span>
                            <span className="shrink-0 mx-1">:</span>
                            <span
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) => handleChange("assignmentNo", e.currentTarget.textContent || "")}
                              className="inline-editable font-normal flex-1"
                              title="Click to edit assignment number"
                            >
                              {formData.assignmentNo}
                            </span>
                          </div>
                          <div className="flex items-start">
                            <span className="font-normal shrink-0 w-[140px] whitespace-nowrap">Assign. Topic</span>
                            <span className="shrink-0 mx-1">:</span>
                            <span
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) => handleChange("assignmentTopic", e.currentTarget.textContent || "")}
                              className="inline-editable font-normal flex-1"
                              title="Click to edit assignment topic"
                            >
                              {formData.assignmentTopic}
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Section 2: Submitted By Block (93px gap from Section 1) */}
                    <div className="mt-[93px] text-[17.3px] leading-[1.2] text-[#030202]">
                      <div className="font-bold text-[17.3px] leading-[1.2] mb-[2px] text-[#030202]">Submitted By,</div>

                      <div className="flex items-start">
                        <span className="font-normal shrink-0 w-[62px]">Name</span>
                        <span className="shrink-0 mx-1">:</span>
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => handleChange("studentName", e.currentTarget.textContent || "")}
                          className="inline-editable font-normal"
                          title="Click to edit student name"
                        >
                          {formData.studentName}
                        </span>
                      </div>

                      <div className="flex items-start">
                        <span className="font-normal shrink-0 w-[62px]">Roll</span>
                        <span className="shrink-0 mx-1">:</span>
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => handleChange("roll", e.currentTarget.textContent || "")}
                          className="inline-editable font-normal"
                          title="Click to edit roll"
                        >
                          {formData.roll}
                        </span>
                      </div>

                      <div className="flex items-start">
                        <span className="font-normal shrink-0 w-[62px]">Reg.</span>
                        <span className="shrink-0 mx-1">:</span>
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => handleChange("reg", e.currentTarget.textContent || "")}
                          className="inline-editable font-normal"
                          title="Click to edit registration"
                        >
                          {formData.reg}
                        </span>
                      </div>

                      <div className="flex items-start">
                        <span className="font-normal shrink-0 w-[62px]">Year</span>
                        <span className="shrink-0 mx-1">:</span>
                        <span className="font-normal flex items-baseline">
                          <span
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => handleChange("yearNumber", e.currentTarget.textContent || "")}
                            className="inline-editable font-normal"
                            title="Click to edit year"
                          >
                            {formData.yearNumber}
                          </span>
                          <sup className="text-[10px] font-normal leading-none ml-[1px]">
                            {formData.yearSuffix || "rd"}
                          </sup>
                          <span className="ml-[1px]"> Year.</span>
                        </span>
                      </div>

                      <div className="flex items-start">
                        <span className="font-normal shrink-0 w-[62px]">Sem.</span>
                        <span className="shrink-0 mx-1">:</span>
                        <span className="font-normal flex items-baseline">
                          <span
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => handleChange("semNumber", e.currentTarget.textContent || "")}
                            className="inline-editable font-normal"
                            title="Click to edit semester"
                          >
                            {formData.semNumber}
                          </span>
                          <sup className="text-[10px] font-normal leading-none ml-[1px]">
                            {formData.semSuffix || "nd"}
                          </sup>
                          <span className="ml-[1px]"> Semester.</span>
                        </span>
                      </div>
                    </div>

                    {/* Section 3: Submitted To Block (90px gap from Section 2) */}
                    <div className="mt-[90px] text-[17.3px] leading-[1.2] text-[#030202]">
                      <div className="font-bold text-[17.3px] leading-[1.2] mb-[2px] text-[#030202]">Submitted To,</div>
                      <div>
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => handleChange("teacherName", e.currentTarget.textContent || "")}
                          className="inline-editable font-normal"
                          title="Click to edit instructor name"
                        >
                          {formData.teacherName}
                        </span>
                        {formData.teacherName && !formData.teacherName.trim().endsWith(",") ? "," : ""}
                      </div>
                      {formData.teacherDesignation && (
                        <div>
                          <span
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => handleChange("teacherDesignation", e.currentTarget.textContent || "")}
                            className="inline-editable font-normal"
                            title="Click to edit instructor designation"
                          >
                            {formData.teacherDesignation}
                          </span>
                          {formData.teacherDesignation && !formData.teacherDesignation.trim().endsWith(",") ? "," : ""}
                        </div>
                      )}
                      {formData.teacherDepartment && (
                        <div>
                          <span
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => handleChange("teacherDepartment", e.currentTarget.textContent || "")}
                            className="inline-editable font-normal"
                            title="Click to edit instructor department"
                          >
                            {formData.teacherDepartment}
                          </span>
                          {formData.teacherDepartment && !formData.teacherDepartment.trim().endsWith(",") ? "," : ""}
                        </div>
                      )}
                      {formData.teacherInstitution && (
                        <div>
                          <span
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => handleChange("teacherInstitution", e.currentTarget.textContent || "")}
                            className="inline-editable font-normal"
                            title="Click to edit instructor institution"
                          >
                            {formData.teacherInstitution}
                          </span>
                          {formData.teacherInstitution && !formData.teacherInstitution.trim().endsWith(".") ? "." : ""}
                        </div>
                      )}
                    </div>

                    {/* Section 4: Date & Signature Block (Placed at bottom, right-aligned signature at exact Illustrator coordinate) */}
                    <div className="mt-auto pt-[40px] w-full flex items-end justify-between text-[17.3px] leading-[1.2] text-[#030202]">
                      {/* Left: Date Block (for lab report or if enabled) */}
                      {(formData.showExperimentDate || formData.showSubmissionDate) ? (
                        <div>
                          <div className="font-bold text-[17.3px] leading-[1.2] mb-[2px] text-[#030202]">Date,</div>
                          {formData.docType === "lab-report" && formData.showExperimentDate && (
                            <div className="flex items-start">
                              <span className="font-normal shrink-0 w-[170px]">Experiment Date</span>
                              <span className="shrink-0 mx-1">:</span>
                              <span
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => handleChange("experimentDate", e.currentTarget.textContent || "")}
                                className="inline-editable font-normal"
                                title="Click to edit experiment date"
                              >
                                {formData.experimentDate || "10|01|2026"}
                              </span>
                            </div>
                          )}
                          {formData.showSubmissionDate && (
                            <div className="flex items-start">
                              <span className="font-normal shrink-0 w-[170px]">Submission Date</span>
                              <span className="shrink-0 mx-1">:</span>
                              <span
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => handleChange("submissionDate", e.currentTarget.textContent || "")}
                                className="inline-editable font-normal"
                                title="Click to edit submission date"
                              >
                                {formData.submissionDate || "18|01|2026"}
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div />
                      )}

                      {/* Right: Signature Label (exact position matching Illustrator setu.pdf) */}
                      <div className="text-right pr-2 pb-0.5 ml-auto">
                        <div className="font-normal text-[17.3px] leading-none text-[#030202]">
                          Signature
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>


          </div>
        </div>
      </main>

      {/* Mobile Sticky Bottom Action Bar (No-Print, lg:hidden) */}
      <div className="no-print lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-elevated/95 backdrop-blur-md border-t border-black px-4 py-2.5 shadow-[0px_-4px_16px_rgba(0,0,0,0.15)] flex items-center justify-between gap-3">
        {/* Left: Mode Switcher */}
        <div className="flex items-center bg-surface-primary border border-border-default rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => {
              setMobileViewMode("edit");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 ${
              mobileViewMode === "edit"
                ? "bg-accent-primary text-white shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <FileText size={13} /> Edit
          </button>
          <button
            type="button"
            onClick={() => {
              setMobileViewMode("preview");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 ${
              mobileViewMode === "preview"
                ? "bg-accent-primary text-white shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <Printer size={13} /> Preview
          </button>
        </div>

        {/* Right: Print / Save PDF Button */}
        <Button
          variant="primary"
          size="sm"
          onClick={handlePrint}
          icon={<Printer size={15} />}
          className="border border-black shadow-[2px_2px_0px_var(--accent-primary)] font-bold text-xs uppercase px-4 py-2 shrink-0"
          title="Print or Save as PDF"
        >
          Print / PDF
        </Button>
      </div>
    </div>
  );
}
