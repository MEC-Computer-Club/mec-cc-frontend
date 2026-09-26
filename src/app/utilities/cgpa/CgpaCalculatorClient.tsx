"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  Calculator,
  Target,
  RotateCcw,
  Plus,
  Trash2,
  Info,
  SlidersHorizontal,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  X,
  GraduationCap,
  BookOpen,
  ChevronRight,
  TrendingUp,
  Award,
  Loader2,
} from "lucide-react";
import { Select } from "@/components/ui/Select";
import { useAuth } from "@/context/AuthContext";
import {
  SYLLABUS_COURSES,
  DEFAULT_GRADING_SCALES,
  GradeScale,
  getCompletedCredits,
  getRemainingCredits,
  TOTAL_DEPARTMENT_CREDITS,
  SEMESTER_CREDIT_BREAKDOWN,
  DU_TECH_UNIT_INSTITUTES,
  isDuTechUnitAffiliated,
} from "@/data/syllabusCourses";
import { QuickFillModal } from "./QuickFillModal";
import { GradingSystemModal } from "./GradingSystemModal";
import { CustomGradingSystemModal } from "./CustomGradingSystemModal";
import { toast } from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface CourseRow {
  id: string;
  courseCode: string;
  courseName: string;
  courseCredit: string;
  letterGrade: string;
  gradePoint: string;
  isOptionalSlot?: boolean;
}

interface SemesterResultRow {
  id: string;
  semesterNumber: number;
  gpa: string;
  credits: string;
}

interface GpaCalculationResult {
  gpa: number;
  totalCredits: number;
  earnedCredits: number;
  cumulativeCgpa: number;
  cumulativeCredits: number;
  gradeBreakdown: Record<string, number>;
}

interface SemesterCgpaResult {
  cgpa: number;
  simpleAvg: number;
  totalCredits: number;
  totalPoints: number;
  validCount: number;
  standing: string;
}

interface TargetSimulationResult {
  requiredGpa: number;
  maxPossibleCgpa: number;
  isPossible: boolean;
  status: "achieved" | "realistic" | "difficult" | "impossible" | "invalid";
  completedCredits: number;
  remainingCredits: number;
  totalCredits: number;
}

const DEPARTMENTS = [
  { value: "CSE", label: "Computer Science & Engineering (CSE)" },
  { value: "EEE", label: "Electrical & Electronic Engineering (EEE)" },
  { value: "CE", label: "Civil Engineering (CE)" },
];

const SESSIONS = [
  { value: "2024-25", label: "Session 2024-25" },
  { value: "2023-24", label: "Session 2023-24" },
  { value: "2022-23", label: "Session 2022-23" },
  { value: "2021-22", label: "Session 2021-22" },
  { value: "2020-21", label: "Session 2020-21" },
  { value: "2019-20", label: "Session 2019-20" },
  { value: "2018-19", label: "Session 2018-19" },
  { value: "2017-18", label: "Session 2017-18" },
];

const SEMESTERS = [
  { value: "1", label: "1st Semester (1st Year 1st Sem)" },
  { value: "2", label: "2nd Semester (1st Year 2nd Sem)" },
  { value: "3", label: "3rd Semester (2nd Year 1st Sem)" },
  { value: "4", label: "4th Semester (2nd Year 2nd Sem)" },
  { value: "5", label: "5th Semester (3rd Year 1st Sem)" },
  { value: "6", label: "6th Semester (3rd Year 2nd Sem)" },
  { value: "7", label: "7th Semester (4th Year 1st Sem)" },
  { value: "8", label: "8th Semester (4th Year 2nd Sem)" },
];

export function CgpaCalculatorClient() {
  const { user } = useAuth();

  // Mode Selection: Course GPA vs Semester-wise CGPA vs Target CGPA
  const [activeTab, setActiveTab] = useState<"calculator" | "semester_cgpa" | "target">("calculator");

  // Institute and Academic Setup - 2021-22 initial session
  const [institute, setInstitute] = useState<string>("Mymensingh Engineering College");
  const [department, setDepartment] = useState<string>("CSE");
  const [availableSessions, setAvailableSessions] = useState<string[]>(["2021-22"]);
  const [session, setSession] = useState<string>("2021-22");
  const [semester, setSemester] = useState<string>("1");

  // Quick Fill Modal State & Notice
  const [hasSelectedInfo, setHasSelectedInfo] = useState<boolean>(false);
  const [quickFillModalOpen, setQuickFillModalOpen] = useState(false);
  const [noCoursesNotice, setNoCoursesNotice] = useState<{
    message: string;
    dept: string;
    sem: string;
  } | null>(null);

  // Semester GPA Calculator calculation state (retains calculate button for tracking)
  const [hasCalculatedGpa, setHasCalculatedGpa] = useState<boolean>(false);
  const [calculatedGpaResult, setCalculatedGpaResult] = useState<GpaCalculationResult | null>(null);

  // Active Grading Scale (Default DU Technology Unit scale)
  const [activeScales, setActiveScales] = useState<GradeScale[]>(DEFAULT_GRADING_SCALES);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [customModalOpen, setCustomModalOpen] = useState(false);

  // Grade Mode: Letter vs Point (0-4)
  const [gradeInputMode, setGradeInputMode] = useState<"letter" | "point">("letter");

  // Initial Reset State with 3 Blank Course Rows
  const INITIAL_EMPTY_COURSES: CourseRow[] = [
    { id: "1", courseCode: "", courseName: "", courseCredit: "3.0", letterGrade: "A+", gradePoint: "4.00" },
    { id: "2", courseCode: "", courseName: "", courseCredit: "3.0", letterGrade: "A+", gradePoint: "4.00" },
    { id: "3", courseCode: "", courseName: "", courseCredit: "1.5", letterGrade: "A+", gradePoint: "4.00" },
  ];

  // Courses List for Semester - initially in reset state
  const [courses, setCourses] = useState<CourseRow[]>(INITIAL_EMPTY_COURSES);
  const [loadingCourses, setLoadingCourses] = useState<boolean>(false);
  const [hasManualReset, setHasManualReset] = useState<boolean>(true);

  // Semester-wise CGPA State
  const [semesterRows, setSemesterRows] = useState<SemesterResultRow[]>(() => [
    { id: "sem-1", semesterNumber: 1, gpa: "", credits: "20.5" },
    { id: "sem-2", semesterNumber: 2, gpa: "", credits: "21.5" },
    { id: "sem-3", semesterNumber: 3, gpa: "", credits: "22.25" },
  ]);

  // Cumulative CGPA Settings
  const [includePrevious, setIncludePrevious] = useState<boolean>(false);
  const [prevCompletedCredits, setPrevCompletedCredits] = useState<string>("");
  const [prevCgpa, setPrevCgpa] = useState<string>("");

  // Target CGPA Mode States
  const [targetModeType, setTargetModeType] = useState<"syllabus" | "manual">("syllabus");
  const [completedSemesters, setCompletedSemesters] = useState<string>("6");
  const [targetMilestone, setTargetMilestone] = useState<string>("8"); // '8' for graduation, or specific sem
  const [currentCgpaInput, setCurrentCgpaInput] = useState<string>("3.45");
  const [targetCgpaInput, setTargetCgpaInput] = useState<string>("3.55");
  const [manualCompletedCr, setManualCompletedCr] = useState<string>("122.5");
  const [manualRemainingCr, setManualRemainingCr] = useState<string>("38.0");

  // Target simulation input handlers (automatically updates live simulation)
  const handleCompletedSemestersChange = (val: string) => {
    setCompletedSemesters(val);
    const newComp = parseInt(val, 10) || 1;
    const currentTgt = parseInt(targetMilestone, 10) || 8;
    if (currentTgt <= newComp) {
      setTargetMilestone("8");
    }
  };

  const handleTargetMilestoneChange = (val: string) => {
    setTargetMilestone(val);
  };

  const handleTargetModeTypeChange = (mode: "syllabus" | "manual") => {
    setTargetModeType(mode);
  };

  const handleCurrentCgpaChange = (val: string) => {
    setCurrentCgpaInput(val);
  };

  const handleTargetCgpaChange = (val: string) => {
    setTargetCgpaInput(val);
  };

  const handleManualCompletedCrChange = (val: string) => {
    setManualCompletedCr(val);
  };

  const handleManualRemainingCrChange = (val: string) => {
    setManualRemainingCr(val);
  };

  // Cumulative previous credit handlers that reset GPA calculation
  const handleIncludePreviousChange = (checked: boolean) => {
    setIncludePrevious(checked);
    setCalculatedGpaResult(null);
    setHasCalculatedGpa(false);
  };

  const handlePrevCompletedCreditsChange = (val: string) => {
    setPrevCompletedCredits(val);
    setCalculatedGpaResult(null);
    setHasCalculatedGpa(false);
  };

  const handlePrevCgpaChange = (val: string) => {
    setPrevCgpa(val);
    setCalculatedGpaResult(null);
    setHasCalculatedGpa(false);
  };

  // Dynamic target milestone options strictly greater than completed semesters (e.g., if 6 -> 7 and 8)
  const targetMilestoneOptions = useMemo(() => {
    const comp = parseInt(completedSemesters, 10) || 1;
    const opts = [];
    for (let sem = comp + 1; sem <= 8; sem++) {
      if (sem === 8) {
        opts.push({ value: "8", label: "Graduation (End of 8th Sem)" });
      } else {
        const suffix = sem === 2 ? "nd" : sem === 3 ? "rd" : "th";
        opts.push({ value: String(sem), label: `After ${sem}${suffix} Semester` });
      }
    }
    return opts;
  }, [completedSemesters]);

  useEffect(() => {
    const comp = parseInt(completedSemesters, 10) || 1;
    const tgt = parseInt(targetMilestone, 10) || 8;
    if (tgt <= comp) {
      setTargetMilestone("8");
    }
  }, [completedSemesters, targetMilestone]);

  // Auto-fill from profile on mount
  useEffect(() => {
    if (user) {
      if (user.department) {
        const d = user.department.toUpperCase();
        if (d.includes("CSE") || d.includes("COMPUTER")) setDepartment("CSE");
        else if (d.includes("EEE") || d.includes("ELECTRICAL")) setDepartment("EEE");
        else if (d.includes("CE") || d.includes("CIVIL")) setDepartment("CE");
      }
      if (user.session) {
        setSession(user.session);
      }
    }
  }, [user]);

  // Handle Institute selection
  const handleInstituteChange = (name: string) => {
    setInstitute(name);
  };

  // Optional subjects available for current department and 7th/8th semester
  const optionalSubjects = useMemo(() => {
    const semNum = parseInt(semester, 10);
    if (semNum !== 7 && semNum !== 8) return [];
    return SYLLABUS_COURSES.filter(
      (c) => c.department === department && c.semester === semNum && c.isElective === true
    );
  }, [department, semester]);

  const [activeSuggestionRowId, setActiveSuggestionRowId] = useState<string | null>(null);
  const [suggestionSearch, setSuggestionSearch] = useState<string>("");
  const suggestionContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionContainerRef.current &&
        !suggestionContainerRef.current.contains(e.target as Node)
      ) {
        setActiveSuggestionRowId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Dynamically load available sessions where changes/courses exist
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/courses/sessions?department=${department}`)
      .then((r) => r.json())
      .then((res) => {
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          setAvailableSessions(res.data);
          if (!res.data.includes(session)) {
            setSession(res.data[0]);
          }
        }
      })
      .catch(() => {});
  }, [department]);

  const filteredOptionalSubjects = useMemo(() => {
    if (!suggestionSearch.trim()) return optionalSubjects;
    const q = suggestionSearch.toLowerCase();
    return optionalSubjects.filter(
      (opt) =>
        opt.courseCode.toLowerCase().includes(q) ||
        opt.courseName.toLowerCase().includes(q)
    );
  }, [optionalSubjects, suggestionSearch]);

  const handleSelectOptionalSubject = (rowId: string, opt: (typeof SYLLABUS_COURSES)[0]) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === rowId
          ? {
              ...c,
              courseCode: opt.courseCode,
              courseName: opt.courseName,
              courseCredit: opt.courseCredit,
              isOptionalSlot: false,
            }
          : c
      )
    );
    setActiveSuggestionRowId(null);
    toast.success(`Selected ${opt.courseCode}: ${opt.courseName}`, { icon: "✨" });
  };

  // Helper to transform courses: for 7th & 8th sem, leave optional subject slots blank
  const processCoursesForSemester = useCallback(
    (rawCourses: any[], sem: string | number, dept: string): CourseRow[] => {
      const semNum = typeof sem === "string" ? parseInt(sem, 10) : sem;

      if (semNum !== 7 && semNum !== 8) {
        return rawCourses.map((c: any) => ({
          id: c._id || Math.random().toString(),
          courseCode: c.courseCode || "",
          courseName: c.courseName || "",
          courseCredit: String(c.courseCredit || "3.0"),
          letterGrade: "A+",
          gradePoint: "4.00",
          isOptionalSlot: false,
        }));
      }

      // 7th or 8th Semester:
      // Mandatory courses are pre-loaded
      // Optional/Elective courses have courseCode and courseName left BLANK
      const mandatoryCourses = rawCourses.filter((c: any) => !c.isElective);
      const electiveCourses = rawCourses.filter((c: any) => c.isElective === true);

      const mappedMandatory: CourseRow[] = mandatoryCourses.map((c: any) => ({
        id: c._id || Math.random().toString(),
        courseCode: c.courseCode || "",
        courseName: c.courseName || "",
        courseCredit: String(c.courseCredit || "3.0"),
        letterGrade: "A+",
        gradePoint: "4.00",
        isOptionalSlot: false,
      }));

      // Group electives by credit requirement (e.g. 3.0 cr theory, 1.5 cr lab) to create blank slots
      const distinctCredits = Array.from(
        new Set(electiveCourses.map((c: any) => String(c.courseCredit || "3.0")))
      );
      const creditsForSlots = distinctCredits.length > 0 ? distinctCredits : ["3.0"];

      const optionalSlots: CourseRow[] = creditsForSlots.map((cr, idx) => ({
        id: `opt-${semNum}-${idx}-${Math.random().toString().slice(2, 7)}`,
        courseCode: "",
        courseName: "",
        courseCredit: cr,
        letterGrade: "A+",
        gradePoint: "4.00",
        isOptionalSlot: true,
      }));

      return [...mappedMandatory, ...optionalSlots];
    },
    []
  );

  // Reset to 3 blank rows
  const resetToEmptyCourses = useCallback(() => {
    setCalculatedGpaResult(null);
    setHasCalculatedGpa(false);
    setCourses([
      { id: "1", courseCode: "", courseName: "", courseCredit: "3.0", letterGrade: "A+", gradePoint: "4.00" },
      { id: "2", courseCode: "", courseName: "", courseCredit: "3.0", letterGrade: "A+", gradePoint: "4.00" },
      { id: "3", courseCode: "", courseName: "", courseCredit: "1.5", letterGrade: "A+", gradePoint: "4.00" },
    ]);
  }, []);

  // Handle Quick Fill Submission from Modal
  const handleQuickFillApply = async (params: {
    institute: string;
    department: string;
    session: string;
    semester: string;
  }) => {
    setInstitute(params.institute);
    setDepartment(params.department);
    setSession(params.session);
    setSemester(params.semester);
    setHasSelectedInfo(true);
    setHasManualReset(false);
    setCalculatedGpaResult(null);
    setHasCalculatedGpa(false);

    // Update semester breakdown for semester CGPA
    const breakdown = SEMESTER_CREDIT_BREAKDOWN[params.department] || SEMESTER_CREDIT_BREAKDOWN.CSE;
    setSemesterRows((prev) =>
      prev.map((r) => ({
        ...r,
        credits: (breakdown[r.semesterNumber] || 20.0).toString(),
      }))
    );

    const isDuTech = isDuTechUnitAffiliated(params.institute);

    // Fetch courses from backend
    try {
      setLoadingCourses(true);
      const res = await fetch(
        `${API_BASE_URL}/api/courses/semester?department=${params.department}&semester=${params.semester}&session=${params.session}&institute=${encodeURIComponent(params.institute)}`
      );
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          const mapped = processCoursesForSemester(json.data, params.semester, params.department);
          setCourses(mapped);
          setNoCoursesNotice(null);
          toast.success(
            `Loaded ${mapped.length} courses for ${params.department} Semester ${params.semester}!`,
            { icon: "📚" }
          );
          return;
        }
      }
    } catch {
      // Fallback
    } finally {
      setLoadingCourses(false);
    }

    // Offline / Instant Fallback from embedded syllabus data (ONLY for DU Technology Unit colleges!)
    const semNum = parseInt(params.semester, 10);
    const localMatches = SYLLABUS_COURSES.filter(
      (c) => c.department === params.department && c.semester === semNum
    );

    if (localMatches.length > 0 && isDuTech) {
      const mapped = processCoursesForSemester(localMatches, params.semester, params.department);
      setCourses(mapped);
      setNoCoursesNotice(null);
    } else {
      resetToEmptyCourses();
      setNoCoursesNotice({
        message: "No registered courses found for this session and semester yet. You can add your course codes and credits below manually to calculate your GPA.",
        dept: params.department,
        sem: params.semester,
      });
    }
  };

  // Convert letter grade to grade point using active scales
  const letterToPoint = useCallback(
    (letter: string): number => {
      const match = activeScales.find(
        (s) => s.letterGrade.toUpperCase() === letter.trim().toUpperCase()
      );
      return match ? match.gradePoint : 0;
    },
    [activeScales]
  );

  // Convert grade point to letter grade
  const pointToLetter = useCallback(
    (point: number): string => {
      const match = activeScales.find((s) => point >= s.gradePoint);
      return match ? match.letterGrade : "F";
    },
    [activeScales]
  );

  // Fetch or Load Courses when Department, Session, or Semester changes
  const loadCourses = useCallback(async () => {
    if (hasManualReset) return;
    setCalculatedGpaResult(null);
    setHasCalculatedGpa(false);
    const isDuTech = isDuTechUnitAffiliated(institute);

    try {
      setLoadingCourses(true);
      const res = await fetch(
        `${API_BASE_URL}/api/courses/semester?department=${department}&semester=${semester}&session=${session}&institute=${encodeURIComponent(institute)}`
      );
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          const mapped = processCoursesForSemester(json.data, semester, department);
          setCourses(mapped);
          return;
        }
      }
    } catch {
      // Fallback
    } finally {
      setLoadingCourses(false);
    }

    // Only DU Tech colleges fall back to localMatches
    const semNum = parseInt(semester, 10);
    const localMatches = SYLLABUS_COURSES.filter(
      (c) => c.department === department && c.semester === semNum
    );

    if (localMatches.length > 0 && isDuTech) {
      const mapped = processCoursesForSemester(localMatches, semester, department);
      setCourses(mapped);
    } else {
      // 3 Blank rows for outside universities or unknown semesters
      resetToEmptyCourses();
      if (!isDuTech) {
        setNoCoursesNotice({
          message: `Pre-loaded syllabus is currently available for University of Dhaka (Technology Unit) colleges (MEC, FEC, BEC, NITER, Shyamoli Textile, etc.). For ${institute}, please enter your course codes and credits below — your inputs will be saved for your institute!`,
          dept: department,
          sem: semester,
        });
      }
    }
  }, [hasManualReset, institute, department, semester, session, resetToEmptyCourses]);

  // Reset All Courses -> 3 Blank Rows
  const handleResetAll = () => {
    setHasManualReset(true);
    setHasSelectedInfo(false);
    setCalculatedGpaResult(null);
    setHasCalculatedGpa(false);
    resetToEmptyCourses();
    toast("Courses reset to blank fields. Click Quick Fill to load from backend anytime.", { icon: "🔄" });
  };

  const handleAddCourse = () => {
    setCalculatedGpaResult(null);
    setHasCalculatedGpa(false);
    setCourses((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        courseCode: "",
        courseName: "",
        courseCredit: "3.0",
        letterGrade: "A+",
        gradePoint: "4.00",
      },
    ]);
  };

  const handleRemoveCourse = (id: string) => {
    if (courses.length <= 1) {
      toast.error("At least one course is required");
      return;
    }
    setCalculatedGpaResult(null);
    setHasCalculatedGpa(false);
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  const handleCourseChange = (id: string, field: keyof CourseRow, value: string) => {
    setCalculatedGpaResult(null);
    setHasCalculatedGpa(false);
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const updated = { ...c, [field]: value };

        // Keep letterGrade and gradePoint synchronized
        if (field === "letterGrade") {
          const pt = letterToPoint(value);
          updated.gradePoint = pt.toFixed(2);
        } else if (field === "gradePoint") {
          const pt = parseFloat(value) || 0;
          updated.letterGrade = pointToLetter(pt);
        }

        return updated;
      })
    );
  };

  const handleSemesterRowChange = (id: string, field: "gpa" | "credits", val: string) => {
    setSemesterRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: val } : r))
    );
  };

  const handleSetSemestersCount = (count: number) => {
    const breakdown = SEMESTER_CREDIT_BREAKDOWN[department] || SEMESTER_CREDIT_BREAKDOWN.CSE;
    setSemesterRows((prev) => {
      const next: SemesterResultRow[] = [];
      for (let i = 1; i <= count; i++) {
        const existing = prev.find((r) => r.semesterNumber === i);
        if (existing) {
          next.push(existing);
        } else {
          next.push({
            id: `sem-${i}`,
            semesterNumber: i,
            gpa: "",
            credits: (breakdown[i] || 20.0).toString(),
          });
        }
      }
      return next;
    });
  };

  const handleAddSemesterRow = () => {
    if (semesterRows.length >= 8) {
      toast.error("Undergraduate syllabus has a maximum of 8 semesters");
      return;
    }
    const nextNum = semesterRows.length + 1;
    const breakdown = SEMESTER_CREDIT_BREAKDOWN[department] || SEMESTER_CREDIT_BREAKDOWN.CSE;
    setSemesterRows((prev) => [
      ...prev,
      {
        id: `sem-${nextNum}-${Date.now()}`,
        semesterNumber: nextNum,
        gpa: "",
        credits: (breakdown[nextNum] || 20.0).toString(),
      },
    ]);
  };

  const handleRemoveSemesterRow = (id: string) => {
    if (semesterRows.length <= 1) {
      toast.error("At least one semester is required");
      return;
    }
    setSemesterRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleResetSemesterRows = () => {
    setSemesterRows((prev) =>
      prev.map((r) => ({
        ...r,
        gpa: "",
      }))
    );
    toast.success("Semester GPAs cleared", { icon: "🔄" });
  };

  const handleTransferToTargetSimulator = () => {
    if (!liveSemesterCgpaResult || liveSemesterCgpaResult.validCount === 0) {
      toast.error("Please enter a GPA for at least one semester first");
      return;
    }
    setCurrentCgpaInput(liveSemesterCgpaResult.cgpa.toFixed(2));
    setCompletedSemesters(Math.min(liveSemesterCgpaResult.validCount, 7).toString());
    setActiveTab("target");
    toast.success(
      `Transferred CGPA ${liveSemesterCgpaResult.cgpa.toFixed(2)} to Target Simulator!`,
      { icon: "🎯" }
    );
  };

  // Calculation Action Handlers (Calculates ONLY on button click & logs usage)
  const handleCalculateGpa = () => {
    const validCourses = courses.filter((c) => (parseFloat(c.courseCredit) || 0) > 0);
    if (validCourses.length === 0) {
      toast.error("Please enter at least one course with credit hours greater than 0");
      return;
    }

    let totalCredits = 0;
    let earnedCredits = 0;
    let totalQualityPoints = 0;
    const gradeBreakdown: Record<string, number> = {};

    for (const c of courses) {
      const cr = parseFloat(c.courseCredit) || 0;
      const pt = parseFloat(c.gradePoint) || 0;
      totalCredits += cr;

      if (pt > 0) {
        earnedCredits += cr;
      }
      totalQualityPoints += cr * pt;

      const letter = c.letterGrade || "F";
      gradeBreakdown[letter] = (gradeBreakdown[letter] || 0) + 1;
    }

    const gpa = totalCredits > 0 ? totalQualityPoints / totalCredits : 0;

    let cumulativeCgpa = gpa;
    let cumulativeCredits = totalCredits;

    if (includePrevious) {
      const pCr = parseFloat(prevCompletedCredits) || 0;
      const pGpa = parseFloat(prevCgpa) || 0;
      if (pCr > 0) {
        const totalPts = pCr * pGpa + totalQualityPoints;
        cumulativeCredits = pCr + totalCredits;
        cumulativeCgpa = cumulativeCredits > 0 ? totalPts / cumulativeCredits : 0;
      }
    }

    const result: GpaCalculationResult = {
      gpa,
      totalCredits,
      earnedCredits,
      cumulativeCgpa,
      cumulativeCredits,
      gradeBreakdown,
    };

    setCalculatedGpaResult(result);
    setHasCalculatedGpa(true);

    // Track usage accurately and anonymously (only GPA calculator and cover page)
    try {
      const isGuest = !hasSelectedInfo;
      fetch(`${API_BASE_URL}/api/analytics/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: "cgpa_calculator",
          action: "calculate",
          instituteName: isGuest ? "Guest User" : (institute.trim() || "Guest User"),
          department: isGuest ? undefined : department,
          session: isGuest ? undefined : session,
          semester: isGuest ? undefined : (parseInt(semester, 10) || 1),
        }),
      }).catch(() => {});
    } catch {
      // Non-blocking
    }

    toast.success(`GPA Calculated: ${result.gpa.toFixed(2)}`, {
      icon: "🎯",
    });

    setTimeout(() => {
      const resultsElement = document.getElementById("gpa-results-deck");
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 100);
  };

  // Live Semester-wise Cumulative CGPA Calculation
  const liveSemesterCgpaResult = useMemo<SemesterCgpaResult | null>(() => {
    let totalCredits = 0;
    let totalPoints = 0;
    let validCount = 0;
    let simpleGpaSum = 0;

    for (const row of semesterRows) {
      const gpa = parseFloat(row.gpa);
      const cr = parseFloat(row.credits);
      if (!isNaN(gpa) && gpa >= 0 && !isNaN(cr) && cr > 0) {
        totalCredits += cr;
        totalPoints += gpa * cr;
        validCount += 1;
        simpleGpaSum += gpa;
      }
    }

    if (validCount === 0) {
      return null;
    }

    const cgpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
    const simpleAvg = validCount > 0 ? simpleGpaSum / validCount : 0;

    let standing = "Academic Probation / Fail";
    if (cgpa >= 3.75) {
      standing = "Outstanding / First Class with Distinction";
    } else if (cgpa >= 3.00) {
      standing = "First Class / Very Good";
    } else if (cgpa >= 2.50) {
      standing = "Second Class";
    } else if (cgpa >= 2.00) {
      standing = "Pass";
    }

    return {
      cgpa,
      simpleAvg,
      totalCredits,
      totalPoints,
      validCount,
      standing,
    };
  }, [semesterRows]);

  // Live Target CGPA Simulation Calculation
  const liveTargetResult = useMemo<TargetSimulationResult | null>(() => {
    const cur = parseFloat(currentCgpaInput);
    const tgt = parseFloat(targetCgpaInput);
    if (isNaN(cur) || isNaN(tgt) || cur <= 0 || tgt <= 0) {
      return null;
    }

    let compCr = 0;
    let remCr = 0;

    if (targetModeType === "syllabus") {
      const compSem = parseInt(completedSemesters, 10) || 6;
      const tgtSem = parseInt(targetMilestone, 10) || 8;
      compCr = getCompletedCredits(department, compSem);
      remCr = getRemainingCredits(department, compSem, tgtSem);
    } else {
      compCr = parseFloat(manualCompletedCr) || 0;
      remCr = parseFloat(manualRemainingCr) || 0;
    }

    const totalCr = compCr + remCr;
    if (remCr <= 0 || totalCr <= 0) {
      return null;
    }

    const currentPoints = cur * compCr;
    const targetPoints = tgt * totalCr;
    const neededPoints = targetPoints - currentPoints;
    const requiredGpa = neededPoints / remCr;

    const maxPoints = currentPoints + 4.0 * remCr;
    const maxPossibleCgpa = maxPoints / totalCr;

    let status: "achieved" | "realistic" | "difficult" | "impossible" = "realistic";
    if (requiredGpa <= 2.0) status = "achieved";
    else if (requiredGpa > 4.0) status = "impossible";
    else if (requiredGpa >= 3.8) status = "difficult";
    else status = "realistic";

    return {
      requiredGpa,
      maxPossibleCgpa,
      isPossible: requiredGpa <= 4.0,
      status,
      completedCredits: compCr,
      remainingCredits: remCr,
      totalCredits: totalCr,
    };
  }, [
    currentCgpaInput,
    targetCgpaInput,
    targetModeType,
    completedSemesters,
    targetMilestone,
    department,
    manualCompletedCr,
    manualRemainingCr,
  ]);

  return (
    <div className="container pt-4 sm:pt-6 pb-12 max-w-5xl mx-auto px-4">
      {/* Main Tabs */}
      <div className="flex justify-center mb-6 sm:mb-8">
        <div className="inline-flex p-1.5 rounded-xl bg-surface-secondary/60 border border-border-brutalist dark:border-border-default shadow-[3px_3px_0px_var(--border-brutalist)] flex-wrap justify-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("calculator")}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg font-mono text-xs sm:text-sm font-bold transition-all ${
              activeTab === "calculator"
                ? "bg-accent-primary text-white shadow-[2px_2px_0px_var(--border-brutalist)] translate-x-[0.5px] translate-y-[0.5px]"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <BookOpen size={16} />
            <span>GPA Calculator</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("semester_cgpa")}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg font-mono text-xs sm:text-sm font-bold transition-all ${
              activeTab === "semester_cgpa"
                ? "bg-accent-primary text-white shadow-[2px_2px_0px_var(--border-brutalist)] translate-x-[0.5px] translate-y-[0.5px]"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <GraduationCap size={16} />
            <span>CGPA Calculator</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("target")}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg font-mono text-xs sm:text-sm font-bold transition-all ${
              activeTab === "target"
                ? "bg-accent-primary text-white shadow-[2px_2px_0px_var(--border-brutalist)] translate-x-[0.5px] translate-y-[0.5px]"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <Target size={16} />
            <span>Target CGPA</span>
          </button>
        </div>
      </div>

      {/* Compact Academic Profile & Quick Fill Bar (ONLY shown on GPA Calculator tab) */}
      {activeTab === "calculator" && (
        <div className="bg-surface-elevated border border-border-brutalist dark:border-border-default rounded-2xl p-4 sm:p-5 mb-8 shadow-[4px_4px_0px_var(--border-brutalist)] flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {/* Academic Info Chips - Only shown after user selects info via Quick Fill */}
            {hasSelectedInfo && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-secondary/70 border border-border-default text-xs font-mono animate-in fade-in duration-200">
                <GraduationCap size={15} className="text-accent-primary shrink-0" />
                <span className="font-bold text-text-primary">
                  {institute === "Mymensingh Engineering College"
                    ? "MEC"
                    : institute === "Sylhet Engineering College"
                    ? "SEC"
                    : institute}
                </span>
                <span className="text-text-muted">•</span>
                <span className="font-semibold text-text-secondary">{department}</span>
                <span className="text-text-muted">•</span>
                <span className="font-semibold text-text-secondary">Sem {semester}</span>
                <span className="text-text-muted hidden sm:inline">•</span>
                <span className="text-text-muted hidden sm:inline">{session}</span>
              </div>
            )}

            {/* Quick Fill Button */}
            <button
              type="button"
              onClick={() => setQuickFillModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-accent-primary-light hover:bg-accent-primary text-text-primary hover:text-white border border-border-brutalist dark:border-border-default font-mono text-xs font-bold shadow-[2px_2px_0px_var(--border-brutalist)] active:translate-x-[1px] active:translate-y-[1px] transition-all"
              title="Open Quick Fill to select institute, department, session and semester"
            >
              <Sparkles size={14} className="text-accent-primary group-hover:text-white" />
              <span>Quick Fill</span>
            </button>
          </div>

          {/* Grading Scale Actions */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <button
              type="button"
              onClick={() => setInfoModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border-default bg-surface-primary hover:bg-surface-elevated font-mono font-bold text-text-primary transition-colors text-xs shadow-xs"
              title="View DU Technology Unit grading scale breakdown"
            >
              <Info size={14} className="text-accent-primary" />
              <span>View Scale</span>
            </button>
            <button
              type="button"
              onClick={() => setCustomModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border-default bg-surface-primary hover:bg-surface-elevated font-mono font-bold text-text-primary transition-colors text-xs shadow-xs"
              title="Customize or apply different grading scale locally"
            >
              <SlidersHorizontal size={14} className="text-text-tertiary" />
              <span>Apply Different Scale</span>
            </button>
          </div>
        </div>
      )}

      {/* Informational Callout when No Courses Found Yet */}
      {activeTab === "calculator" && noCoursesNotice && (
        <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-text-primary flex items-start justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-start gap-2.5">
            <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-600 dark:text-amber-400 block mb-0.5">
                No Pre-Saved Courses Found Yet for {noCoursesNotice.dept} Semester {noCoursesNotice.sem}
              </span>
              <p className="text-text-secondary leading-relaxed">
                {noCoursesNotice.message}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setNoCoursesNotice(null)}
            className="p-1 rounded text-text-tertiary hover:text-text-primary transition-colors"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* TAB 1: CGPA CALCULATOR */}
      {activeTab === "calculator" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Action Bar Above Course Table */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-surface-secondary/40 p-3 sm:p-4 rounded-xl border border-border-default">
            {/* Grade Entry Mode (Letter vs Point) */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] sm:text-xs font-mono font-bold text-text-secondary uppercase">
                Grade Entry Mode:
              </span>
              <div className="inline-flex p-0.5 rounded-lg bg-surface-primary border border-border-default">
                <button
                  type="button"
                  onClick={() => setGradeInputMode("letter")}
                  className={`px-3 py-1 rounded-md text-xs font-mono font-bold transition-all ${
                    gradeInputMode === "letter"
                      ? "bg-accent-primary text-white shadow-xs"
                      : "text-text-tertiary hover:text-text-primary"
                  }`}
                >
                  Letter
                </button>
                <button
                  type="button"
                  onClick={() => setGradeInputMode("point")}
                  className={`px-3 py-1 rounded-md text-xs font-mono font-bold transition-all ${
                    gradeInputMode === "point"
                      ? "bg-accent-primary text-white shadow-xs"
                      : "text-text-tertiary hover:text-text-primary"
                  }`}
                >
                  Point (0-4)
                </button>
              </div>
            </div>

            {/* Reset All Button */}
            <button
              type="button"
              onClick={handleResetAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/30 text-red-500 bg-red-500/5 hover:bg-red-500/10 text-xs font-mono font-bold transition-colors"
              title="Clear all loaded courses and enter custom subjects"
            >
              <RotateCcw size={13} />
              <span>Reset All</span>
            </button>
          </div>

          {/* Courses Table Card */}
          <div className="bg-surface-elevated border border-border-brutalist dark:border-border-default rounded-2xl shadow-[5px_5px_0px_var(--border-brutalist)] overflow-hidden">
            {/* Reset State Banner encouraging Quick Fill */}
            {courses.every((c) => !c.courseCode.trim() && !c.courseName.trim()) && (
              <div className="p-4 bg-accent-primary/10 border-b border-border-default flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2.5 text-text-primary">
                  <div className="w-8 h-8 rounded-lg bg-accent-primary text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <span className="font-bold text-text-primary block text-sm sm:text-xs">
                      Calculator in Initial / Reset State
                    </span>
                    <span className="text-text-secondary text-[11px] sm:text-xs">
                      Click <strong>Quick Fill</strong> to choose your college, department, session, and semester to load official courses from backend, or enter custom courses below.
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setQuickFillModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-accent-primary hover:bg-accent-primary-hover text-white font-mono font-bold text-xs uppercase shadow-[2px_2px_0px_var(--border-brutalist)] active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center gap-1.5 shrink-0"
                >
                  <Sparkles size={13} />
                  <span>Open Quick Fill</span>
                </button>
              </div>
            )}

            {loadingCourses && (
              <div className="p-6 text-center bg-surface-primary/70 backdrop-blur-xs font-mono text-xs text-text-secondary flex items-center justify-center gap-2 border-b border-border-default">
                <Loader2 size={16} className="animate-spin text-accent-primary" />
                <span>Loading official syllabus courses from backend...</span>
              </div>
            )}

            <div className="overflow-x-auto rounded-t-2xl">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-surface-secondary/70 text-text-secondary font-mono font-bold uppercase text-[11px] border-b border-border-default">
                  <tr>
                    <th className="py-2.5 px-3 w-10 text-center">#</th>
                    <th className="py-2.5 px-3 w-32 sm:w-36">Course Code</th>
                    <th className="hidden md:table-cell py-2.5 px-3 w-56 lg:w-64">Course Name</th>
                    <th className="py-2.5 px-3 w-20 sm:w-24 text-center">Credits</th>
                    <th className="py-2.5 px-3 w-36 sm:w-44">
                      {gradeInputMode === "letter" ? "Letter Grade" : "Point (0-4)"}
                    </th>
                    <th className="py-2.5 px-3 w-10 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-default font-medium">
                  {courses.map((course, idx) => (
                    <tr key={course.id} className="hover:bg-surface-secondary/20 transition-colors">
                      <td className="py-2 px-3 text-center font-mono font-bold text-text-tertiary">
                        {idx + 1}
                      </td>

                      {/* Course Code (Clean & Constrained Width) */}
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={course.courseCode}
                          onChange={(e) =>
                            handleCourseChange(course.id, "courseCode", e.target.value)
                          }
                          placeholder={
                            (semester === "7" || semester === "8") && !course.courseCode
                              ? "Optional"
                              : "e.g. CSE-1101"
                          }
                          className="w-full max-w-[140px] py-1.5 px-2.5 text-xs font-mono font-bold rounded border border-border-default bg-surface-primary text-text-primary uppercase tracking-wide focus:border-accent-primary focus:outline-none transition-colors"
                        />

                        {/* Mobile Course Name Input & Suggestions Trigger */}
                        <div className="md:hidden mt-1 relative">
                          <input
                            type="text"
                            value={course.courseName}
                            onFocus={() => {
                              if (semester === "7" || semester === "8") {
                                setActiveSuggestionRowId(course.id);
                                setSuggestionSearch(course.courseName);
                              }
                            }}
                            onChange={(e) => {
                              handleCourseChange(course.id, "courseName", e.target.value);
                              if (semester === "7" || semester === "8") {
                                setActiveSuggestionRowId(course.id);
                                setSuggestionSearch(e.target.value);
                              }
                            }}
                            placeholder={
                              (semester === "7" || semester === "8") && !course.courseName
                                ? "✨ Tap to pick optional..."
                                : "Course name..."
                            }
                            className={`w-full py-1 px-2 text-[11px] font-sans rounded border ${
                              (semester === "7" || semester === "8") && !course.courseName
                                ? "border-accent-primary bg-accent-primary/5 text-text-primary placeholder:text-accent-primary"
                                : "border-border-default bg-surface-primary text-text-primary"
                            }`}
                          />
                        </div>
                      </td>

                      {/* Course Name (Desktop Only, Compact & Proportional) */}
                      <td className="hidden md:table-cell py-2 px-3 relative">
                        <input
                          type="text"
                          value={course.courseName}
                          onFocus={() => {
                            if (semester === "7" || semester === "8") {
                              setActiveSuggestionRowId(course.id);
                              setSuggestionSearch(course.courseName);
                            }
                          }}
                          onChange={(e) => {
                            handleCourseChange(course.id, "courseName", e.target.value);
                            if (semester === "7" || semester === "8") {
                              setActiveSuggestionRowId(course.id);
                              setSuggestionSearch(e.target.value);
                            }
                          }}
                          placeholder={
                            (semester === "7" || semester === "8") && !course.courseName
                              ? "✨ Type or select optional subject..."
                              : "e.g. Calculus"
                          }
                          className={`w-full max-w-[240px] lg:max-w-[270px] py-1.5 px-2.5 text-xs font-sans font-medium rounded border ${
                            (semester === "7" || semester === "8") && !course.courseName
                              ? "border-accent-primary bg-accent-primary/5 text-text-primary placeholder:text-accent-primary"
                              : "border-border-default bg-surface-primary text-text-primary placeholder:text-text-muted"
                          } focus:border-accent-primary focus:outline-none transition-colors truncate`}
                          title={course.courseName}
                        />

                        {/* Optional Subjects Suggestion Popover (ONLY for 7th & 8th Semester) */}
                        {activeSuggestionRowId === course.id &&
                          (semester === "7" || semester === "8") &&
                          optionalSubjects.length > 0 && (
                            <div
                              ref={suggestionContainerRef}
                              className="absolute left-3 top-full mt-1 w-80 bg-surface-primary border border-border-brutalist dark:border-border-default rounded-xl shadow-[4px_4px_0px_var(--border-brutalist)] z-50 overflow-hidden animate-fade-in"
                            >
                              <div className="p-2.5 bg-surface-secondary/90 border-b border-border-default flex items-center justify-between text-[11px] font-mono font-bold text-text-secondary">
                                <span className="flex items-center gap-1.5 text-accent-primary">
                                  <Sparkles size={13} />
                                  Optional Subjects (Sem {semester})
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setActiveSuggestionRowId(null)}
                                  className="text-text-muted hover:text-text-primary p-0.5"
                                >
                                  <X size={13} />
                                </button>
                              </div>
                              <div className="max-h-56 overflow-y-auto divide-y divide-border-default/50 font-sans">
                                {filteredOptionalSubjects.length === 0 ? (
                                  <div className="p-3 text-center text-xs text-text-muted">
                                    No matching optional subject
                                  </div>
                                ) : (
                                  filteredOptionalSubjects.map((opt) => (
                                    <button
                                      key={opt.courseCode}
                                      type="button"
                                      onMouseDown={(e) => {
                                        e.preventDefault();
                                        handleSelectOptionalSubject(course.id, opt);
                                      }}
                                      className="w-full text-left p-2.5 hover:bg-accent-primary/10 transition-colors flex flex-col gap-0.5 group"
                                    >
                                      <div className="flex items-center justify-between">
                                        <span className="font-mono font-bold text-xs text-accent-primary group-hover:underline">
                                          {opt.courseCode}
                                        </span>
                                        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-surface-secondary text-text-secondary border border-border-default">
                                          {opt.courseCredit} Credits
                                        </span>
                                      </div>
                                      <div className="text-xs font-medium text-text-primary">
                                        {opt.courseName}
                                      </div>
                                    </button>
                                  ))
                                )}
                              </div>
                            </div>
                          )}
                      </td>

                      {/* Course Credit */}
                      <td className="py-2 px-3 text-center">
                        <input
                          type="number"
                          step="0.25"
                          min="0"
                          max="10"
                          value={course.courseCredit}
                          onChange={(e) =>
                            handleCourseChange(course.id, "courseCredit", e.target.value)
                          }
                          className="w-full max-w-[80px] mx-auto py-1.5 px-2 text-xs font-mono font-bold text-center rounded border border-border-default bg-surface-primary text-text-primary focus:border-accent-primary focus:outline-none transition-colors"
                        />
                      </td>

                      {/* Grade Input */}
                      <td className="py-2 px-3">
                        {gradeInputMode === "letter" ? (
                          <Select
                            value={course.letterGrade}
                            onChange={(val) =>
                              handleCourseChange(course.id, "letterGrade", val)
                            }
                            options={activeScales.map((s) => ({
                              value: s.letterGrade,
                              label: `${s.letterGrade} (${s.gradePoint.toFixed(2)})`,
                            }))}
                          />
                        ) : (
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="4"
                            value={course.gradePoint}
                            onChange={(e) =>
                              handleCourseChange(course.id, "gradePoint", e.target.value)
                            }
                            placeholder="0.00 - 4.00"
                            className="w-full p-2 text-xs font-mono font-bold text-center rounded border border-border-default bg-surface-primary text-accent-primary"
                          />
                        )}
                      </td>

                      {/* Remove Button */}
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveCourse(course.id)}
                          className="p-1 rounded text-text-tertiary hover:text-red-500 hover:bg-red-500/10 transition-colors"
                          title="Remove this course"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom Add Row Bar */}
            <div className="p-3 border-t border-border-default bg-surface-secondary/40 flex items-center justify-between">
              <button
                type="button"
                onClick={handleAddCourse}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-border-brutalist dark:border-border-default bg-surface-primary text-xs font-mono font-bold text-text-primary shadow-[2px_2px_0px_var(--border-brutalist)] hover:translate-x-[0.5px] hover:translate-y-[0.5px] transition-all"
              >
                <Plus size={14} /> Add Another Course
              </button>

              <span className="text-xs font-mono text-text-secondary font-bold">
                {courses.length} Courses Listed
              </span>
            </div>
          </div>

          {/* Previous Semesters CGPA Collapsible */}
          <div className="bg-surface-elevated border border-border-default rounded-xl p-4">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-mono font-bold text-text-primary">
              <input
                type="checkbox"
                checked={includePrevious}
                onChange={(e) => handleIncludePreviousChange(e.target.checked)}
                className="w-4 h-4 rounded border-border-default text-accent-primary focus:ring-accent-primary"
              />
              <span>Include Previous Semesters to Calculate Cumulative CGPA</span>
            </label>

            {includePrevious && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 pt-3 border-t border-border-default animate-in fade-in">
                <div>
                  <label className="block text-[11px] font-mono font-bold text-text-secondary uppercase mb-1">
                    Completed Credits Before This Semester
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={prevCompletedCredits}
                    onChange={(e) => handlePrevCompletedCreditsChange(e.target.value)}
                    placeholder="e.g. 102.5"
                    className="w-full py-2 px-3 text-sm rounded-md border border-border-default bg-surface-primary font-mono font-bold text-text-primary"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-bold text-text-secondary uppercase mb-1">
                    Previous Cumulative CGPA
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4"
                    value={prevCgpa}
                    onChange={(e) => handlePrevCgpaChange(e.target.value)}
                    placeholder="e.g. 3.45"
                    className="w-full py-2 px-3 text-sm rounded-md border border-border-default bg-surface-primary font-mono font-bold text-text-primary"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Button: Calculate GPA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleCalculateGpa}
              className="w-full sm:w-auto px-8 py-3.5 bg-accent-primary hover:bg-accent-primary-hover text-white font-mono font-black text-sm uppercase rounded-xl border border-border-brutalist dark:border-border-default shadow-[4px_4px_0px_var(--border-brutalist)] active:translate-x-[2px] active:translate-y-[2px] transition-all flex items-center justify-center gap-2.5"
            >
              <Calculator size={18} />
              <span>{calculatedGpaResult ? "Recalculate GPA" : "Calculate GPA"}</span>
            </button>
            <span className="text-xs font-mono text-text-muted">
              {calculatedGpaResult ? "✓ GPA Calculated" : "Click to compute GPA & log calculation"}
            </span>
          </div>

          {!calculatedGpaResult ? (
            /* Pre-Calculation Prompt Card */
            <div className="bg-surface-elevated border border-dashed border-border-default rounded-2xl p-6 sm:p-8 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-accent-primary-light border border-accent-primary/20 flex items-center justify-center text-accent-primary mx-auto mb-2">
                <Calculator size={24} />
              </div>
              <h3 className="font-heading font-black text-base text-text-primary uppercase tracking-tight">
                Ready to Compute Your Semester GPA
              </h3>
              <p className="text-xs font-mono text-text-secondary max-w-md mx-auto">
                Review your course credits and select your grades in the table above, then click <strong>&quot;Calculate GPA&quot;</strong> to reveal your GPA, standing, and credit breakdown.
              </p>
            </div>
          ) : (
            /* Results Display Deck */
            <div
              id="gpa-results-deck"
              className="bg-surface-elevated border border-accent-primary rounded-2xl p-6 sm:p-8 shadow-[6px_6px_0px_var(--accent-primary)] ring-2 ring-accent-primary/20 animate-in fade-in zoom-in-95 duration-200"
            >
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-border-default">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Calculated Result
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const text = `Semester ${semester} GPA: ${calculatedGpaResult.gpa.toFixed(2)} (${pointToLetter(calculatedGpaResult.gpa)}) | Credits: ${calculatedGpaResult.earnedCredits.toFixed(2)}/${calculatedGpaResult.totalCredits.toFixed(2)} | ${institute}`;
                    navigator.clipboard.writeText(text);
                    toast.success("GPA summary copied to clipboard!", { icon: "📋" });
                  }}
                  className="text-xs font-mono font-bold text-accent-primary hover:underline flex items-center gap-1"
                >
                  📋 Copy Summary
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Semester GPA Big Score */}
                <div className="md:col-span-5 text-center md:text-left border-b md:border-b-0 md:border-r border-border-default pb-6 md:pb-0 md:pr-6">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-text-tertiary block mb-1">
                    Semester GPA
                  </span>
                  <div className="text-5xl sm:text-6xl font-black font-heading tracking-tight text-accent-primary mb-2">
                    {calculatedGpaResult.gpa.toFixed(2)}
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-accent-primary-light text-text-primary font-mono font-bold text-xs border border-accent-primary/20">
                    <Award size={13} className="text-accent-primary" />
                    <span>Standing: {pointToLetter(calculatedGpaResult.gpa)}</span>
                  </div>
                </div>

                {/* Breakdown Details */}
                <div className="md:col-span-7 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-xl bg-surface-secondary/40 border border-border-default">
                      <span className="text-[11px] font-mono font-bold text-text-tertiary uppercase block">
                        Registered Credits
                      </span>
                      <span className="text-xl font-bold font-mono text-text-primary">
                        {calculatedGpaResult.totalCredits.toFixed(2)}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-surface-secondary/40 border border-border-default">
                      <span className="text-[11px] font-mono font-bold text-text-tertiary uppercase block">
                        Earned Credits
                      </span>
                      <span className="text-xl font-bold font-mono text-text-primary">
                        {calculatedGpaResult.earnedCredits.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {includePrevious && calculatedGpaResult.cumulativeCredits > 0 && (
                    <div className="p-3.5 rounded-xl bg-accent-primary/10 border border-accent-primary/30 flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-mono font-bold text-accent-primary uppercase block">
                          New Cumulative CGPA
                        </span>
                        <span className="text-xs text-text-secondary">
                          Across {calculatedGpaResult.cumulativeCredits.toFixed(2)} total credits
                        </span>
                      </div>
                      <span className="text-2xl font-black font-heading text-accent-primary">
                        {calculatedGpaResult.cumulativeCgpa.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SEMESTER-WISE CGPA CALCULATOR */}
      {activeTab === "semester_cgpa" && (
        <div className="space-y-8 animate-in fade-in duration-150">
          {/* Quick preset selector & Reset */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-surface-secondary/40 p-4 rounded-xl border border-border-default">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-bold text-text-secondary uppercase">
                Completed Semesters:
              </span>
              <div className="inline-flex gap-1 bg-surface-primary p-1 rounded-lg border border-border-default">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleSetSemestersCount(num)}
                    className={`w-7 h-7 rounded text-xs font-mono font-bold transition-all ${
                      semesterRows.length === num
                        ? "bg-accent-primary text-white shadow-sm"
                        : "text-text-secondary hover:bg-surface-secondary hover:text-text-primary"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetSemesterRows}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/30 text-red-500 bg-red-500/5 hover:bg-red-500/10 text-xs font-mono font-bold transition-colors"
                title="Reset all entered semester GPAs"
              >
                <RotateCcw size={13} /> Reset GPAs
              </button>
              <button
                type="button"
                onClick={handleAddSemesterRow}
                disabled={semesterRows.length >= 8}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-default bg-surface-primary hover:bg-surface-elevated text-xs font-mono font-bold text-text-primary transition-colors disabled:opacity-50"
              >
                <Plus size={13} /> Add Semester
              </button>
            </div>
          </div>

          {/* Grid Layout: Table on Left, Live CGPA Display on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 cols: Table of Semesters */}
            <div className="lg:col-span-7 bg-surface-elevated border border-border-brutalist dark:border-border-default rounded-2xl shadow-[5px_5px_0px_var(--border-brutalist)] overflow-hidden">
              <div className="p-4 bg-surface-secondary/70 border-b border-border-default flex items-center justify-between">
                <div>
                  <h3 className="font-mono font-bold text-sm text-text-primary uppercase flex items-center gap-2">
                    <GraduationCap size={16} className="text-accent-primary" />
                    Semester Breakdown
                  </h3>
                  <p className="text-[11px] text-text-secondary font-mono">
                    Enter your GPA for each completed semester. Credits auto-match {department} syllabus.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold bg-accent-primary/10 text-accent-primary px-2.5 py-1 rounded-md border border-accent-primary/20">
                  {semesterRows.length} Semesters
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-surface-secondary/50 text-text-secondary font-mono font-bold uppercase text-[11px] border-b border-border-default">
                    <tr>
                      <th className="py-3 px-3 w-10 text-center">#</th>
                      <th className="py-3 px-3">Semester</th>
                      <th className="py-3 px-3 w-36 text-center">Semester GPA (0-4)</th>
                      <th className="py-3 px-3 w-28 text-center">Credits</th>
                      <th className="py-3 px-3 w-28 text-center">Points</th>
                      <th className="py-3 px-3 w-10 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-default font-medium">
                    {semesterRows.map((row, idx) => {
                      const gpaVal = parseFloat(row.gpa);
                      const crVal = parseFloat(row.credits);
                      const points = !isNaN(gpaVal) && !isNaN(crVal) && gpaVal >= 0 && crVal > 0 ? (gpaVal * crVal).toFixed(2) : "--";

                      return (
                        <tr key={row.id} className="hover:bg-surface-secondary/20 transition-colors">
                          <td className="py-2.5 px-3 text-center font-mono font-bold text-text-tertiary">
                            {idx + 1}
                          </td>
                          <td className="py-2.5 px-3 font-mono font-bold text-text-primary">
                            Semester {row.semesterNumber}
                            <span className="block text-[10px] text-text-muted font-normal font-sans">
                              {row.semesterNumber === 1
                                ? "1st Sem"
                                : row.semesterNumber === 2
                                ? "2nd Sem"
                                : row.semesterNumber === 3
                                ? "3rd Sem"
                                : `${row.semesterNumber}th Sem`}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              max="4"
                              value={row.gpa}
                              onChange={(e) =>
                                handleSemesterRowChange(row.id, "gpa", e.target.value)
                              }
                              placeholder="e.g. 3.47"
                              className="w-full p-2 text-xs font-mono font-bold text-center rounded border border-border-default bg-surface-primary text-text-primary focus:border-accent-primary focus:outline-none"
                            />
                          </td>
                          <td className="py-2.5 px-3">
                            <input
                              type="number"
                              step="0.25"
                              min="0"
                              max="35"
                              value={row.credits}
                              onChange={(e) =>
                                handleSemesterRowChange(row.id, "credits", e.target.value)
                              }
                              className="w-full p-2 text-xs font-mono font-bold text-center rounded border border-border-default bg-surface-primary text-text-primary focus:border-accent-primary focus:outline-none"
                            />
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono font-bold text-accent-primary">
                            {points}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            {semesterRows.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveSemesterRow(row.id)}
                                className="p-1 rounded text-text-tertiary hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                title="Remove semester"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right 5 cols: Cumulative CGPA Card */}
            <div className="lg:col-span-5 space-y-5">
              {!liveSemesterCgpaResult ? (
                /* Pre-Calculation Prompt Card */
                <div className="bg-surface-elevated border border-dashed border-border-default rounded-2xl p-6 text-center space-y-4 shadow-[4px_4px_0px_var(--border-brutalist)]">
                  <div className="w-12 h-12 rounded-2xl bg-accent-primary-light border border-accent-primary/20 flex items-center justify-center text-accent-primary mx-auto">
                    <GraduationCap size={24} />
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-base text-text-primary uppercase tracking-tight">
                      Live Cumulative CGPA
                    </h3>
                    <p className="text-xs font-mono text-text-secondary mt-1 leading-relaxed">
                      Enter your GPA for each semester in the table. Your cumulative CGPA and academic standing will calculate live automatically as you type.
                    </p>
                  </div>
                </div>
              ) : (
                /* Results Card */
                <div className="bg-surface-elevated border border-accent-primary rounded-2xl p-6 shadow-[5px_5px_0px_var(--accent-primary)] ring-2 ring-accent-primary/20 space-y-5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-border-default pb-3">
                    <span className="text-xs font-mono font-bold uppercase text-text-secondary flex items-center gap-1.5">
                      <Award size={15} className="text-accent-primary" />
                      Overall Cumulative Standing
                    </span>
                    <span className="text-[10px] font-mono text-text-muted">
                      {liveSemesterCgpaResult.validCount} of {semesterRows.length} counted
                    </span>
                  </div>

                  {/* Big CGPA Display */}
                  <div className="text-center py-4 bg-surface-secondary/40 rounded-xl border border-border-default">
                    <span className="text-[11px] font-mono font-bold text-text-secondary uppercase block mb-1">
                      Cumulative CGPA
                    </span>
                    <div className="text-4xl sm:text-5xl font-black font-heading text-text-primary tracking-tight">
                      {liveSemesterCgpaResult.cgpa.toFixed(2)}
                    </div>
                    <div className="text-[11px] font-mono text-text-muted mt-1">
                      Exact: {liveSemesterCgpaResult.cgpa.toFixed(3)}
                    </div>

                    {/* Academic Standing Pill */}
                    <div className="mt-3">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold border bg-accent-primary/10 border-accent-primary/30 text-accent-primary">
                        {liveSemesterCgpaResult.standing}
                      </span>
                    </div>
                  </div>

                  {/* Stat Grid */}
                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-xl bg-surface-secondary/30 border border-border-default">
                      <span className="text-text-secondary text-[11px] block">Total Credits</span>
                      <span className="text-base font-bold text-text-primary">
                        {liveSemesterCgpaResult.totalCredits.toFixed(2)}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-surface-secondary/30 border border-border-default">
                      <span className="text-text-secondary text-[11px] block">Quality Points</span>
                      <span className="text-base font-bold text-text-primary">
                        {liveSemesterCgpaResult.totalPoints.toFixed(2)}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-surface-secondary/30 border border-border-default col-span-2 flex items-center justify-between">
                      <div>
                        <span className="text-text-secondary text-[11px] block">Unweighted Average</span>
                        <span className="text-xs text-text-muted font-sans">
                          Simple average of semester GPAs
                        </span>
                      </div>
                      <span className="text-base font-bold text-text-primary font-mono">
                        {liveSemesterCgpaResult.simpleAvg.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Bridge Button to Target Simulator */}
                  <button
                    type="button"
                    onClick={handleTransferToTargetSimulator}
                    className="w-full py-3 px-4 rounded-xl bg-surface-primary hover:bg-surface-elevated border border-border-brutalist dark:border-border-default text-text-primary text-xs font-mono font-bold shadow-[2px_2px_0px_var(--border-brutalist)] flex items-center justify-center gap-2 hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                  >
                    <Target size={15} className="text-accent-primary" />
                    Simulate Target with this CGPA
                    <ChevronRight size={15} />
                  </button>
                </div>
              )}

              {/* DU/MEC Formula Explainer */}
              <div className="p-4 rounded-xl bg-surface-secondary/30 border border-border-default text-xs space-y-1.5 font-sans">
                <span className="font-mono font-bold text-text-primary text-[11px] uppercase block">
                  How CGPA is Calculated:
                </span>
                <p className="text-text-secondary leading-relaxed font-mono text-[11px]">
                  CGPA = &Sigma; (Semester GPA &times; Semester Credits) &divide; &Sigma; (Semester Credits)
                </p>
                <p className="text-[11px] text-text-muted">
                  Credits are automatically weighted according to the official Dhaka University Technology Unit syllabus.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TARGET CGPA SIMULATOR */}
      {activeTab === "target" && (
        <div className="space-y-8 animate-in fade-in duration-150">
          <div className="bg-surface-elevated border border-border-brutalist dark:border-border-default rounded-2xl p-6 sm:p-8 shadow-[6px_6px_0px_var(--border-brutalist)] space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-default pb-4">
              <div>
                <h3 className="text-lg font-bold font-heading text-text-primary flex items-center gap-2">
                  <Target size={20} className="text-accent-primary" /> Target CGPA Strategy Deck
                </h3>
                <p className="text-xs text-text-secondary">
                  Calculate the exact GPA and letter grades required across future semesters
                </p>
              </div>

              {/* Mode Toggle */}
              <div className="inline-flex p-1 rounded-lg bg-surface-primary border border-border-default text-xs font-mono font-bold">
                <button
                  type="button"
                  onClick={() => handleTargetModeTypeChange("syllabus")}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    targetModeType === "syllabus"
                      ? "bg-accent-primary text-white"
                      : "text-text-tertiary hover:text-text-primary"
                  }`}
                >
                  Syllabus Guided
                </button>
                <button
                  type="button"
                  onClick={() => handleTargetModeTypeChange("manual")}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    targetModeType === "manual"
                      ? "bg-accent-primary text-white"
                      : "text-text-tertiary hover:text-text-primary"
                  }`}
                >
                  Custom Credits
                </button>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {targetModeType === "syllabus" ? (
                <>
                  <div>
                    <label className="block text-xs font-mono font-bold text-text-secondary uppercase mb-1.5">
                      Completed Semesters
                    </label>
                    <Select
                      value={completedSemesters}
                      onChange={handleCompletedSemestersChange}
                      options={[
                        { value: "1", label: "Completed 1st Sem" },
                        { value: "2", label: "Completed 2nd Sem" },
                        { value: "3", label: "Completed 3rd Sem" },
                        { value: "4", label: "Completed 4th Sem" },
                        { value: "5", label: "Completed 5th Sem" },
                        { value: "6", label: "Completed 6th Sem" },
                        { value: "7", label: "Completed 7th Sem" },
                      ]}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-text-secondary uppercase mb-1.5">
                      Target Milestone
                    </label>
                    <Select
                      value={targetMilestone}
                      onChange={handleTargetMilestoneChange}
                      options={targetMilestoneOptions}
                      placeholder="Select milestone..."
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-mono font-bold text-text-secondary uppercase mb-1.5">
                      Completed Credits So Far
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={manualCompletedCr}
                      onChange={(e) => handleManualCompletedCrChange(e.target.value)}
                      placeholder="e.g. 122.5"
                      className="w-full py-2 px-3 text-sm rounded-md border border-border-default bg-surface-primary font-mono font-bold text-text-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-text-secondary uppercase mb-1.5">
                      Remaining Credits
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={manualRemainingCr}
                      onChange={(e) => handleManualRemainingCrChange(e.target.value)}
                      placeholder="e.g. 38.0"
                      className="w-full py-2 px-3 text-sm rounded-md border border-border-default bg-surface-primary font-mono font-bold text-text-primary"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-mono font-bold text-text-secondary uppercase mb-1.5">
                  Current CGPA
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                  value={currentCgpaInput}
                  onChange={(e) => handleCurrentCgpaChange(e.target.value)}
                  placeholder="e.g. 3.45"
                  className="w-full py-2 px-3 text-sm rounded-md border border-border-default bg-surface-primary font-mono font-bold text-text-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-text-secondary uppercase mb-1.5">
                  Desired Target CGPA
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                  value={targetCgpaInput}
                  onChange={(e) => handleTargetCgpaChange(e.target.value)}
                  placeholder="e.g. 3.55"
                  className="w-full py-2 px-3 text-sm rounded-md border border-border-default bg-surface-primary font-mono font-bold text-accent-primary"
                />
              </div>
            </div>

            {/* Target Results Callout */}
            <div className="pt-4 border-t border-border-default">
              {!liveTargetResult ? (
                /* Pre-Simulation Prompt Card */
                <div className="p-6 rounded-2xl bg-surface-secondary/30 border border-dashed border-border-default text-center space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-accent-primary-light border border-accent-primary/20 flex items-center justify-center text-accent-primary mx-auto">
                    <Target size={20} />
                  </div>
                  <h4 className="font-heading font-black text-sm text-text-primary uppercase tracking-tight">
                    Live Target CGPA Simulation
                  </h4>
                  <p className="text-xs font-mono text-text-secondary max-w-md mx-auto">
                    Configure your completed semesters, current CGPA, and desired target CGPA above to instantly reveal your roadmap and required semester GPA.
                  </p>
                </div>
              ) : liveTargetResult.status === "impossible" ? (
                <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/30 space-y-3">
                  <div className="flex items-center gap-2 text-red-500 font-bold font-mono text-sm uppercase">
                    <AlertTriangle size={18} /> Mathematically Impossible
                  </div>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                    To reach <strong>{targetCgpaInput}</strong>, you would need an average GPA of{" "}
                    <strong className="text-red-500 font-mono">
                      {liveTargetResult.requiredGpa.toFixed(2)}
                    </strong>{" "}
                    across your remaining {liveTargetResult.remainingCredits.toFixed(1)} credits, which exceeds the
                    maximum possible grade point of <strong>4.00 (A+)</strong>.
                  </p>
                  <div className="pt-2 border-t border-red-500/20 text-xs font-mono text-text-primary">
                    Maximum obtainable CGPA with straight 4.00s:{" "}
                    <strong className="text-accent-primary text-sm">
                      {liveTargetResult.maxPossibleCgpa.toFixed(2)}
                    </strong>
                  </div>
                </div>
              ) : liveTargetResult.status === "achieved" ? (
                <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold font-mono text-sm uppercase">
                    <CheckCircle2 size={18} /> Target Already Secured
                  </div>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                    Your current CGPA is high enough that maintaining basic pass grades (2.00) will keep your target of{" "}
                    <strong>{targetCgpaInput}</strong> secure!
                  </p>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-surface-secondary/40 border border-border-brutalist dark:border-border-default shadow-[4px_4px_0px_var(--border-brutalist)]">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-5 text-center md:text-left border-b md:border-b-0 md:border-r border-border-default pb-4 md:pb-0 md:pr-4">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-text-tertiary block mb-1">
                        Required Average GPA
                      </span>
                      <div className="text-4xl sm:text-5xl font-black font-heading text-accent-primary mb-2">
                        {liveTargetResult.requiredGpa.toFixed(2)}
                      </div>
                      <span className="text-xs font-mono text-text-secondary">
                        Across {liveTargetResult.remainingCredits.toFixed(1)} remaining credits
                      </span>
                    </div>

                    <div className="md:col-span-7 space-y-3">
                      <div className="text-xs font-mono font-bold uppercase text-text-primary flex items-center gap-1.5">
                        <TrendingUp size={15} className="text-accent-primary" /> Roadmap & Strategy:
                      </div>
                      <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                        To elevate your CGPA from <strong>{currentCgpaInput}</strong> to{" "}
                        <strong className="text-accent-primary">{targetCgpaInput}</strong>, you need to maintain an average of{" "}
                        <strong>{pointToLetter(liveTargetResult.requiredGpa)} ({liveTargetResult.requiredGpa.toFixed(2)})</strong>.
                      </p>
                      <div className="p-2.5 rounded-lg bg-surface-elevated border border-border-default text-xs font-mono text-text-primary">
                        Recommended Grade Mix: Aim for{" "}
                        <strong>{liveTargetResult.requiredGpa >= 3.75 ? "mostly A+ (4.00)" : "at least A (3.75) and A- (3.50)"}</strong>{" "}
                        in major theory courses and straight A+ in sessional labs.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick Fill Modal */}
      <QuickFillModal
        isOpen={quickFillModalOpen}
        onClose={() => setQuickFillModalOpen(false)}
        currentInstitute={institute}
        currentDepartment={department}
        currentSession={session}
        currentSemester={semester}
        availableSessions={availableSessions}
        onApply={handleQuickFillApply}
      />

      {/* Info Modal */}
      <GradingSystemModal
        isOpen={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        scales={activeScales}
      />

      {/* Custom Grading Scale Modal */}
      <CustomGradingSystemModal
        isOpen={customModalOpen}
        onClose={() => setCustomModalOpen(false)}
        currentScales={activeScales}
        onApplyCustomSystem={(scales) => {
          setActiveScales(scales);
        }}
      />
    </div>
  );
}
