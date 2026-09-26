export interface SyllabusCourse {
  courseCode: string;
  courseName: string;
  courseCredit: string;
  semester: number;
  department: "CSE" | "EEE" | "CE";
  session?: string;
  isElective?: boolean;
}

export interface GradeScale {
  minMarks: number;
  maxMarks: number;
  letterGrade: string;
  gradePoint: number;
  remarks?: string;
}

export const DEFAULT_GRADING_SCALES: GradeScale[] = [
  { minMarks: 80, maxMarks: 100, letterGrade: "A+", gradePoint: 4.00, remarks: "Outstanding" },
  { minMarks: 75, maxMarks: 79.99, letterGrade: "A", gradePoint: 3.75, remarks: "Excellent" },
  { minMarks: 70, maxMarks: 74.99, letterGrade: "A-", gradePoint: 3.50, remarks: "Very Good" },
  { minMarks: 65, maxMarks: 69.99, letterGrade: "B+", gradePoint: 3.25, remarks: "Good" },
  { minMarks: 60, maxMarks: 64.99, letterGrade: "B", gradePoint: 3.00, remarks: "Satisfactory" },
  { minMarks: 55, maxMarks: 59.99, letterGrade: "B-", gradePoint: 2.75, remarks: "Above Average" },
  { minMarks: 50, maxMarks: 54.99, letterGrade: "C+", gradePoint: 2.50, remarks: "Average" },
  { minMarks: 45, maxMarks: 49.99, letterGrade: "C", gradePoint: 2.25, remarks: "Below Average" },
  { minMarks: 40, maxMarks: 44.99, letterGrade: "D", gradePoint: 2.00, remarks: "Pass" },
  { minMarks: 0, maxMarks: 39.99, letterGrade: "F", gradePoint: 0.00, remarks: "Fail" },
];

export const DU_TECH_UNIT_INSTITUTES = [
  { value: "Mymensingh Engineering College", label: "Mymensingh Engineering College (MEC)" },
  { value: "Sylhet Engineering College", label: "Sylhet Engineering College (SEC)" },
  { value: "Faridpur Engineering College", label: "Faridpur Engineering College (FEC)" },
  { value: "Barishal Engineering College", label: "Barishal Engineering College (BEC)" },
  { value: "National Institute of Textile Engineering and Research", label: "National Institute of Textile Engineering and Research (NITER)" },
  { value: "Shyamoli Textile Engineering College", label: "Shyamoli Textile Engineering College" },
];

export function isDuTechUnitAffiliated(instituteName?: string): boolean {
  if (!instituteName) return true; // Default MEC / DU unit
  const lower = instituteName.toLowerCase().trim();
  return (
    lower.includes("mymensingh") ||
    lower.includes("mec") ||
    lower.includes("sylhet") ||
    lower.includes("sec") ||
    lower.includes("dhaka") ||
    lower.includes("technology unit") ||
    lower.includes("faridpur") ||
    lower.includes("fec") ||
    lower.includes("barishal") ||
    lower.includes("bec") ||
    lower.includes("niter") ||
    lower.includes("nittr") ||
    lower.includes("shyamoli") ||
    lower.includes("shaymoli")
  );
}

export const ALL_DEPARTMENTS = [
  { value: "CSE", label: "Computer Science & Engineering (CSE)" },
  { value: "EEE", label: "Electrical & Electronic Engineering (EEE)" },
  { value: "CE", label: "Civil Engineering (CE)" },
];

export function getAvailableDepartmentsForCollege(collegeName: string) {
  const lower = (collegeName || "").toLowerCase().trim();
  // Barishal Engineering College (BEC) does NOT have CSE
  if (lower.includes("barishal") || lower.includes("bec")) {
    return [
      { value: "EEE", label: "Electrical & Electronic Engineering (EEE)" },
      { value: "CE", label: "Civil Engineering (CE)" },
    ];
  }
  // NITER and Shyamoli do NOT have Civil Engineering (CE)
  if (
    lower.includes("niter") ||
    lower.includes("nittr") ||
    lower.includes("shyamoli") ||
    lower.includes("shaymoli")
  ) {
    return [
      { value: "CSE", label: "Computer Science & Engineering (CSE)" },
      { value: "EEE", label: "Electrical & Electronic Engineering (EEE)" },
    ];
  }
  // Mymensingh (MEC), Sylhet (SEC), Faridpur (FEC), etc. have CSE, EEE, CE
  return ALL_DEPARTMENTS;
}

export const SYLLABUS_COURSES: SyllabusCourse[] = [
  // ================= CSE COURSES =================
  // Semester 1
  { courseCode: "CSE-1101", courseName: "Fundamentals of Computers and Computing", courseCredit: "2.0", semester: 1, department: "CSE", session: "2021-22" },
  { courseCode: "CSE-1102", courseName: "Discrete Mathematics", courseCredit: "3.0", semester: 1, department: "CSE", session: "2021-22" },
  { courseCode: "EEE-1103", courseName: "Electrical Circuits", courseCredit: "3.0", semester: 1, department: "CSE", session: "2021-22" },
  { courseCode: "CHE-1104", courseName: "Chemistry", courseCredit: "3.0", semester: 1, department: "CSE", session: "2021-22" },
  { courseCode: "MATH-1105", courseName: "Differential and Integral Calculus", courseCredit: "3.0", semester: 1, department: "CSE", session: "2021-22" },
  { courseCode: "SS-1106", courseName: "Government and Public Administration", courseCredit: "2.0", semester: 1, department: "CSE", session: "2021-22" },
  { courseCode: "CSE-1111", courseName: "Fundamentals of Computers and Computing Lab", courseCredit: "1.5", semester: 1, department: "CSE", session: "2021-22" },
  { courseCode: "EEE-1113", courseName: "Electrical Circuits Lab", courseCredit: "1.5", semester: 1, department: "CSE", session: "2021-22" },
  { courseCode: "CHE-1114", courseName: "Chemistry Lab", courseCredit: "1.5", semester: 1, department: "CSE", session: "2021-22" },

  // Semester 2
  { courseCode: "CSE-1201", courseName: "Fundamentals of Programming", courseCredit: "3.0", semester: 2, department: "CSE", session: "2021-22" },
  { courseCode: "CSE-1202", courseName: "Digital Logic Design", courseCredit: "3.0", semester: 2, department: "CSE", session: "2021-22" },
  { courseCode: "PHY-1203", courseName: "Physics", courseCredit: "3.0", semester: 2, department: "CSE", session: "2021-22" },
  { courseCode: "MATH-1204", courseName: "Methods of Integration, Differential Equations and Series", courseCredit: "3.0", semester: 2, department: "CSE", session: "2021-22" },
  { courseCode: "ENG-1205", courseName: "Developing English Language Skills", courseCredit: "2.0", semester: 2, department: "CSE", session: "2021-22" },
  { courseCode: "CSE-1211", courseName: "Fundamentals of Programming Lab", courseCredit: "3.0", semester: 2, department: "CSE", session: "2021-22" },
  { courseCode: "CSE-1212", courseName: "Digital Logic Design Lab", courseCredit: "1.5", semester: 2, department: "CSE", session: "2021-22" },
  { courseCode: "PHY-1213", courseName: "Physics Lab", courseCredit: "1.5", semester: 2, department: "CSE", session: "2021-22" },
  { courseCode: "ENG-1215", courseName: "Developing English Language Skills Lab", courseCredit: "1.5", semester: 2, department: "CSE", session: "2021-22" },

  // Semester 3
  { courseCode: "CSE-2101", courseName: "Data Structures and Algorithms", courseCredit: "3.0", semester: 3, department: "CSE", session: "2021-22" },
  { courseCode: "CSE-2102", courseName: "Object Oriented Programming", courseCredit: "3.0", semester: 3, department: "CSE", session: "2021-22" },
  { courseCode: "CSE-2103", courseName: "Digital Electronics and Pulse Technique", courseCredit: "3.0", semester: 3, department: "CSE", session: "2021-22" },
  { courseCode: "EEE-2104", courseName: "Electronic Devices and Circuits", courseCredit: "3.0", semester: 3, department: "CSE", session: "2021-22" },
  { courseCode: "MATH-2105", courseName: "Linear Algebra", courseCredit: "3.0", semester: 3, department: "CSE", session: "2021-22" },
  { courseCode: "SS-2106", courseName: "Bangladesh Studies", courseCredit: "2.0", semester: 3, department: "CSE", session: "2021-22" },
  { courseCode: "CSE-2111", courseName: "Data Structures and Algorithms Lab", courseCredit: "1.5", semester: 3, department: "CSE", session: "2021-22" },
  { courseCode: "CSE-2112", courseName: "Object Oriented Programming Lab", courseCredit: "1.5", semester: 3, department: "CSE", session: "2021-22" },
  { courseCode: "CSE-2113", courseName: "Digital Electronics and Pulse Technique Lab", courseCredit: "1.5", semester: 3, department: "CSE", session: "2021-22" },
  { courseCode: "EEE-2114", courseName: "Electronic Devices and Circuits Lab", courseCredit: "0.75", semester: 3, department: "CSE", session: "2021-22" },

  // Semester 4
  { courseCode: "CSE-2201", courseName: "Database Management Systems-I", courseCredit: "3.0", semester: 4, department: "CSE", session: "2021-22" },
  { courseCode: "CSE-2202", courseName: "Design and Analysis of Algorithms-I", courseCredit: "3.0", semester: 4, department: "CSE", session: "2021-22" },
  { courseCode: "CSE-2203", courseName: "Data and Telecommunication", courseCredit: "3.0", semester: 4, department: "CSE", session: "2021-22" },
  { courseCode: "CSE-2204", courseName: "Computer Architecture and Organization", courseCredit: "3.0", semester: 4, department: "CSE", session: "2021-22" },
  { courseCode: "CSE-2205", courseName: "Introduction to Mechatronics", courseCredit: "2.0", semester: 4, department: "CSE", session: "2021-22" },
  { courseCode: "CSE-2211", courseName: "Database Management Systems-I Lab", courseCredit: "1.5", semester: 4, department: "CSE", session: "2021-22" },
  { courseCode: "CSE-2212", courseName: "Design and Analysis of Algorithms-I Lab", courseCredit: "1.5", semester: 4, department: "CSE", session: "2021-22" },
  { courseCode: "CSE-2213", courseName: "Data and Telecommunication Lab", courseCredit: "0.75", semester: 4, department: "CSE", session: "2021-22" },
  { courseCode: "CSE-2216", courseName: "Application Development Lab", courseCredit: "1.5", semester: 4, department: "CSE", session: "2021-22" },

  // Semester 5
  { courseCode: "CSE-3101", courseName: "Computer Networking", courseCredit: "3.0", semester: 5, department: "CSE", session: "2021-22" },
  { courseCode: "CSE-3102", courseName: "Software Engineering", courseCredit: "3.0", semester: 5, department: "CSE", session: "2021-22" },
  { courseCode: "CSE-3103", courseName: "Microprocessor and Microcontroller", courseCredit: "3.0", semester: 5, department: "CSE", session: "2021-22" },
  { courseCode: "CSE-3104", courseName: "Database Management Systems-II", courseCredit: "3.0", semester: 5, department: "CSE", session: "2021-22" },
  { courseCode: "MATH-3105", courseName: "Multivariable Calculus and Geometry", courseCredit: "3.0", semester: 5, department: "CSE", session: "2021-22" },
  { courseCode: "CSE-3111", courseName: "Computer Networking Lab", courseCredit: "1.5", semester: 5, department: "CSE", session: "2021-22" },
  { courseCode: "CSE-3112", courseName: "Software Engineering Lab", courseCredit: "0.75", semester: 5, department: "CSE", session: "2021-22" },
  { courseCode: "CSE-3113", courseName: "Microprocessor and Assembly Language Lab", courseCredit: "1.5", semester: 5, department: "CSE", session: "2021-22" },
  { courseCode: "CSE-3116", courseName: "Microcontroller Lab", courseCredit: "0.75", semester: 5, department: "CSE", session: "2021-22" },

  // Semester 6
  { courseCode: "CSE-3201", courseName: "Operating Systems", courseCredit: "3.0", semester: 6, department: "CSE", session: "2021-22" },
  { courseCode: "CSE-3202", courseName: "Numerical Methods", courseCredit: "3.0", semester: 6, department: "CSE", session: "2021-22" },
  { courseCode: "CSE-3203", courseName: "Design and Analysis of Algorithms-II", courseCredit: "3.0", semester: 6, department: "CSE", session: "2021-22" },
  { courseCode: "CSE-3204", courseName: "Formal Language, Automata and Computability", courseCredit: "3.0", semester: 6, department: "CSE", session: "2021-22" },
  { courseCode: "STAT-3205", courseName: "Introduction to Probability and Statistics", courseCredit: "3.0", semester: 6, department: "CSE", session: "2021-22" },
  { courseCode: "CSE-3211", courseName: "Operating Systems Lab", courseCredit: "1.5", semester: 6, department: "CSE", session: "2021-22" },
  { courseCode: "CSE-3212", courseName: "Numerical Methods Lab", courseCredit: "0.75", semester: 6, department: "CSE", session: "2021-22" },
  { courseCode: "CSE-3216", courseName: "Software Design Patterns Lab", courseCredit: "1.5", semester: 6, department: "CSE", session: "2021-22" },
  { courseCode: "ENG-3217", courseName: "Technical Writing and Presentation Lab", courseCredit: "0.75", semester: 6, department: "CSE", session: "2021-22" },

  // Semester 7
  { courseCode: "CSE-4101", courseName: "Artificial Intelligence", courseCredit: "3.0", semester: 7, department: "CSE", session: "2021-22" },
  { courseCode: "CSE-4102", courseName: "Mathematical and Statistical Analysis for Engineers", courseCredit: "3.0", semester: 7, department: "CSE", session: "2021-22" },
  { courseCode: "SS-4103", courseName: "Entrepreneurship for IT Business", courseCredit: "2.0", semester: 7, department: "CSE", session: "2021-22" },
  { courseCode: "CSE-4125", courseName: "Option-I: Distributed Systems", courseCredit: "3.0", semester: 7, department: "CSE", session: "2021-22", isElective: true },
  { courseCode: "CSE-4126", courseName: "Option-II: Introduction to Data Science", courseCredit: "3.0", semester: 7, department: "CSE", session: "2021-22", isElective: true },
  { courseCode: "CSE-4111", courseName: "Artificial Intelligence Lab", courseCredit: "1.5", semester: 7, department: "CSE", session: "2021-22" },
  { courseCode: "CSE-4155", courseName: "Option-I Lab", courseCredit: "1.5", semester: 7, department: "CSE", session: "2021-22", isElective: true },
  { courseCode: "CSE-4113", courseName: "Internet Programming Lab", courseCredit: "1.5", semester: 7, department: "CSE", session: "2021-22" },
  { courseCode: "CSE-4114", courseName: "Project", courseCredit: "2.0", semester: 7, department: "CSE", session: "2021-22" },

  // Semester 8
  { courseCode: "ECO-4201", courseName: "Economics", courseCredit: "2.0", semester: 8, department: "CSE", session: "2021-22" },
  { courseCode: "CSE-4202", courseName: "Society and Technology", courseCredit: "2.0", semester: 8, department: "CSE", session: "2021-22" },
  { courseCode: "SS-4203", courseName: "Engineering Ethics", courseCredit: "2.0", semester: 8, department: "CSE", session: "2021-22" },
  { courseCode: "CSE-4221", courseName: "Option-III: Machine Learning", courseCredit: "3.0", semester: 8, department: "CSE", session: "2021-22", isElective: true },
  { courseCode: "CSE-4222", courseName: "Option-IV: Cloud Computing", courseCredit: "3.0", semester: 8, department: "CSE", session: "2021-22", isElective: true },
  { courseCode: "CSE-4251", courseName: "Option-III Lab", courseCredit: "1.5", semester: 8, department: "CSE", session: "2021-22", isElective: true },
  { courseCode: "CSE-4214", courseName: "Project", courseCredit: "4.0", semester: 8, department: "CSE", session: "2021-22" },

  // ================= EEE COURSES =================
  // Semester 1
  { courseCode: "EEE-1101", courseName: "Electrical Circuit I", courseCredit: "3.0", semester: 1, department: "EEE", session: "2021-22" },
  { courseCode: "EEE-1102", courseName: "Electrical Circuit I Sessional", courseCredit: "1.5", semester: 1, department: "EEE", session: "2021-22" },
  { courseCode: "CSE-1101", courseName: "Computer Programming", courseCredit: "3.0", semester: 1, department: "EEE", session: "2021-22" },
  { courseCode: "CSE-1102", courseName: "Computer Programming Sessional", courseCredit: "1.5", semester: 1, department: "EEE", session: "2021-22" },
  { courseCode: "CE-1102", courseName: "Computer Aided Engineering Drawing", courseCredit: "1.5", semester: 1, department: "EEE", session: "2021-22" },
  { courseCode: "PHY-1101", courseName: "Electricity and Magnetism, Modern Physics and Mechanics", courseCredit: "3.0", semester: 1, department: "EEE", session: "2021-22" },
  { courseCode: "PHY-1102", courseName: "Electricity and Magnetism, Modern Physics and Mechanics Sessional", courseCredit: "1.5", semester: 1, department: "EEE", session: "2021-22" },
  { courseCode: "MATH-1101", courseName: "Differential & Integral Calculus and Co-ordinate Geometry", courseCredit: "3.0", semester: 1, department: "EEE", session: "2021-22" },
  { courseCode: "GED-1101", courseName: "English for Technical Communication", courseCredit: "3.0", semester: 1, department: "EEE", session: "2021-22" },

  // Semester 2
  { courseCode: "EEE-1201", courseName: "Electrical Circuits II", courseCredit: "3.0", semester: 2, department: "EEE", session: "2021-22" },
  { courseCode: "EEE-1202", courseName: "Electrical Circuits II Sessional", courseCredit: "1.5", semester: 2, department: "EEE", session: "2021-22" },
  { courseCode: "EEE-1203", courseName: "Electrical Properties of Materials", courseCredit: "3.0", semester: 2, department: "EEE", session: "2021-22" },
  { courseCode: "PHY-1201", courseName: "Waves and Oscillations, Optics and Thermal Physics", courseCredit: "3.0", semester: 2, department: "EEE", session: "2021-22" },
  { courseCode: "PHY-1202", courseName: "Waves and Oscillations, Optics and Thermal Physics Sessional", courseCredit: "1.5", semester: 2, department: "EEE", session: "2021-22" },
  { courseCode: "MATH-1201", courseName: "Differential Equations and Complex Variables", courseCredit: "3.0", semester: 2, department: "EEE", session: "2021-22" },
  { courseCode: "CHEM-1201", courseName: "Chemistry", courseCredit: "3.0", semester: 2, department: "EEE", session: "2021-22" },
  { courseCode: "CHEM-1202", courseName: "Chemistry Sessional", courseCredit: "1.5", semester: 2, department: "EEE", session: "2021-22" },
  { courseCode: "GED-1201", courseName: "Bangladesh Studies", courseCredit: "3.0", semester: 2, department: "EEE", session: "2021-22" },

  // Semester 3
  { courseCode: "EEE-2101", courseName: "Electronics I", courseCredit: "3.0", semester: 3, department: "EEE", session: "2021-22" },
  { courseCode: "EEE-2102", courseName: "Electronics I Sessional", courseCredit: "1.5", semester: 3, department: "EEE", session: "2021-22" },
  { courseCode: "EEE-2103", courseName: "Energy Conversion I", courseCredit: "3.0", semester: 3, department: "EEE", session: "2021-22" },
  { courseCode: "EEE-2104", courseName: "Energy Conversion I Sessional", courseCredit: "1.5", semester: 3, department: "EEE", session: "2021-22" },
  { courseCode: "EEE-2108", courseName: "Electrical and Electronic Workshop Practice", courseCredit: "1.5", semester: 3, department: "EEE", session: "2021-22" },
  { courseCode: "ME-2101", courseName: "Basic Mechanical Engineering", courseCredit: "3.0", semester: 3, department: "EEE", session: "2021-22" },
  { courseCode: "ME-2102", courseName: "Basic Mechanical Engineering Sessional", courseCredit: "1.5", semester: 3, department: "EEE", session: "2021-22" },
  { courseCode: "MATH-2101", courseName: "Linear Algebra and Vector Analysis", courseCredit: "3.0", semester: 3, department: "EEE", session: "2021-22" },
  { courseCode: "GED-2101", courseName: "Financial Account & Economic Analysis", courseCredit: "3.0", semester: 3, department: "EEE", session: "2021-22" },

  // Semester 4
  { courseCode: "EEE-2201", courseName: "Electronic II", courseCredit: "3.0", semester: 4, department: "EEE", session: "2021-22" },
  { courseCode: "EEE-2202", courseName: "Electronic II Sessional", courseCredit: "1.5", semester: 4, department: "EEE", session: "2021-22" },
  { courseCode: "EEE-2203", courseName: "Energy Conversion II", courseCredit: "3.0", semester: 4, department: "EEE", session: "2021-22" },
  { courseCode: "EEE-2204", courseName: "Energy Conversion II Sessional", courseCredit: "1.5", semester: 4, department: "EEE", session: "2021-22" },
  { courseCode: "EEE-2205", courseName: "Engineering Electromagnetics", courseCredit: "3.0", semester: 4, department: "EEE", session: "2021-22" },
  { courseCode: "EEE-2208", courseName: "Electrical Services Design", courseCredit: "1.5", semester: 4, department: "EEE", session: "2021-22" },
  { courseCode: "MATH-2201", courseName: "Statistics & Probability", courseCredit: "3.0", semester: 4, department: "EEE", session: "2021-22" },
  { courseCode: "GED-2201", courseName: "Professional Ethics and Moral Thoughts", courseCredit: "3.0", semester: 4, department: "EEE", session: "2021-22" },

  // Semester 5
  { courseCode: "EEE-3101", courseName: "Electrical Measurement & Instrumentation", courseCredit: "3.0", semester: 5, department: "EEE", session: "2021-22" },
  { courseCode: "EEE-3102", courseName: "Electrical Measurement & Instrumentation Sessional", courseCredit: "1.5", semester: 5, department: "EEE", session: "2021-22" },
  { courseCode: "EEE-3103", courseName: "Digital Electronics", courseCredit: "3.0", semester: 5, department: "EEE", session: "2021-22" },
  { courseCode: "EEE-3104", courseName: "Digital Electronics Sessional", courseCredit: "1.5", semester: 5, department: "EEE", session: "2021-22" },
  { courseCode: "EEE-3105", courseName: "Power System I", courseCredit: "3.0", semester: 5, department: "EEE", session: "2021-22" },
  { courseCode: "EEE-3106", courseName: "Power System I Sessional", courseCredit: "1.5", semester: 5, department: "EEE", session: "2021-22" },
  { courseCode: "EEE-3107", courseName: "Power Electronics and Industrial Drives", courseCredit: "3.0", semester: 5, department: "EEE", session: "2021-22" },
  { courseCode: "EEE-3108", courseName: "Power Electronics and Industrial Drives Sessional", courseCredit: "1.5", semester: 5, department: "EEE", session: "2021-22" },
  { courseCode: "GED-3101", courseName: "Engineering Management", courseCredit: "3.0", semester: 5, department: "EEE", session: "2021-22" },

  // Semester 6
  { courseCode: "EEE-3201", courseName: "Communication Engineering Fundamentals", courseCredit: "3.0", semester: 6, department: "EEE", session: "2021-22" },
  { courseCode: "EEE-3202", courseName: "Communication Engineering Fundamentals Sessional", courseCredit: "1.5", semester: 6, department: "EEE", session: "2021-22" },
  { courseCode: "EEE-3203", courseName: "Power System II", courseCredit: "3.0", semester: 6, department: "EEE", session: "2021-22" },
  { courseCode: "EEE-3205", courseName: "Signals and Systems", courseCredit: "3.0", semester: 6, department: "EEE", session: "2021-22" },
  { courseCode: "EEE-3207", courseName: "Numerical Methods", courseCredit: "3.0", semester: 6, department: "EEE", session: "2021-22" },
  { courseCode: "EEE-3208", courseName: "Numerical Methods Sessional", courseCredit: "1.5", semester: 6, department: "EEE", session: "2021-22" },
  { courseCode: "CSE-3201", courseName: "Microprocessor & Microcontroller", courseCredit: "3.0", semester: 6, department: "EEE", session: "2021-22" },
  { courseCode: "CSE-3202", courseName: "Microprocessor & Microcontroller Sessional", courseCredit: "1.5", semester: 6, department: "EEE", session: "2021-22" },

  // Semester 7
  { courseCode: "EEE-4100", courseName: "Project & Thesis", courseCredit: "1.5", semester: 7, department: "EEE", session: "2021-22" },
  { courseCode: "EEE-4101", courseName: "Digital Signal Processing", courseCredit: "3.0", semester: 7, department: "EEE", session: "2021-22" },
  { courseCode: "EEE-4102", courseName: "Digital Signal Processing Sessional", courseCredit: "1.5", semester: 7, department: "EEE", session: "2021-22" },
  { courseCode: "EEE-4103", courseName: "Control System", courseCredit: "3.0", semester: 7, department: "EEE", session: "2021-22" },
  { courseCode: "EEE-4104", courseName: "Control System Sessional", courseCredit: "1.5", semester: 7, department: "EEE", session: "2021-22" },
  { courseCode: "EEE-4105", courseName: "VLSI Circuits and Design", courseCredit: "3.0", semester: 7, department: "EEE", session: "2021-22" },
  { courseCode: "EEE-4106", courseName: "VLSI Circuits and Design Sessional", courseCredit: "1.5", semester: 7, department: "EEE", session: "2021-22" },
  { courseCode: "EEE-4111", courseName: "Renewable Energy (Elective I)", courseCredit: "3.0", semester: 7, department: "EEE", session: "2021-22", isElective: true },
  { courseCode: "EEE-4117", courseName: "Mobile Cellular Communication (Elective II)", courseCredit: "3.0", semester: 7, department: "EEE", session: "2021-22", isElective: true },

  // Semester 8
  { courseCode: "EEE-4200", courseName: "Project & Thesis", courseCredit: "1.5", semester: 8, department: "EEE", session: "2021-22" },
  { courseCode: "EEE-4201", courseName: "Power System Protection", courseCredit: "3.0", semester: 8, department: "EEE", session: "2021-22" },
  { courseCode: "EEE-4202", courseName: "Power System Protection Sessional", courseCredit: "1.5", semester: 8, department: "EEE", session: "2021-22" },
  { courseCode: "EEE-4203", courseName: "Power Plant Engineering and Economy", courseCredit: "3.0", semester: 8, department: "EEE", session: "2021-22" },
  { courseCode: "EEE-4208", courseName: "Industrial Attachment", courseCredit: "1.5", semester: 8, department: "EEE", session: "2021-22" },
  { courseCode: "EEE-4211", courseName: "Smart Grid (Elective III)", courseCredit: "3.0", semester: 8, department: "EEE", session: "2021-22", isElective: true },
  { courseCode: "EEE-4215", courseName: "Optical Fiber Communication (Elective IV)", courseCredit: "3.0", semester: 8, department: "EEE", session: "2021-22", isElective: true },

  // ================= CE COURSES =================
  // Semester 1
  { courseCode: "PHY 101", courseName: "Physical Optics, Heat, Waves and Oscillation", courseCredit: "3.0", semester: 1, department: "CE", session: "2021-22" },
  { courseCode: "PHY 102", courseName: "Physics Sessional", courseCredit: "1.5", semester: 1, department: "CE", session: "2021-22" },
  { courseCode: "Chem 101", courseName: "Chemistry-I", courseCredit: "3.0", semester: 1, department: "CE", session: "2021-22" },
  { courseCode: "Chem 102", courseName: "Inorganic Quantitative Analysis", courseCredit: "1.5", semester: 1, department: "CE", session: "2021-22" },
  { courseCode: "Math 101", courseName: "Differential and Integral Calculus", courseCredit: "3.0", semester: 1, department: "CE", session: "2021-22" },
  { courseCode: "Hum 101", courseName: "English", courseCredit: "2.0", semester: 1, department: "CE", session: "2021-22" },
  { courseCode: "Hum 102", courseName: "Developing English Language Skills", courseCredit: "0.75", semester: 1, department: "CE", session: "2021-22" },
  { courseCode: "CE 101", courseName: "Civil Engineering Drawing-I", courseCredit: "1.5", semester: 1, department: "CE", session: "2021-22" },
  { courseCode: "CE 102", courseName: "Engineering Mechanics", courseCredit: "4.0", semester: 1, department: "CE", session: "2021-22" },

  // Semester 2
  { courseCode: "PHY 201", courseName: "Structure of Matter, Electricity and Magnetism and Modern Physics", courseCredit: "3.0", semester: 2, department: "CE", session: "2021-22" },
  { courseCode: "Chem 201", courseName: "Chemistry-II", courseCredit: "3.0", semester: 2, department: "CE", session: "2021-22" },
  { courseCode: "Hum 201", courseName: "Sociology and Government", courseCredit: "4.0", semester: 2, department: "CE", session: "2021-22" },
  { courseCode: "Math 201", courseName: "Differential Equation and Statistics", courseCredit: "3.0", semester: 2, department: "CE", session: "2021-22" },
  { courseCode: "CE 201", courseName: "Civil Engineering Drawing-II", courseCredit: "1.5", semester: 2, department: "CE", session: "2021-22" },
  { courseCode: "CE 202", courseName: "Surveying", courseCredit: "4.0", semester: 2, department: "CE", session: "2021-22" },
  { courseCode: "CE 203", courseName: "Practical Surveying", courseCredit: "1.5", semester: 2, department: "CE", session: "2021-22" },
  { courseCode: "EEE 201", courseName: "Basic Electricity Sessional", courseCredit: "0.75", semester: 2, department: "CE", session: "2021-22" },

  // Semester 3
  { courseCode: "Hum 301", courseName: "Engineering Economics", courseCredit: "2.0", semester: 3, department: "CE", session: "2021-22" },
  { courseCode: "Math 301", courseName: "Matrix, Vectors and Laplace Transform", courseCredit: "3.0", semester: 3, department: "CE", session: "2021-22" },
  { courseCode: "CE 301", courseName: "Engineering Materials", courseCredit: "4.0", semester: 3, department: "CE", session: "2021-22" },
  { courseCode: "CE 302", courseName: "Details of Constructions", courseCredit: "1.5", semester: 3, department: "CE", session: "2021-22" },
  { courseCode: "CE 303", courseName: "Engineering Geology and Geomorphology", courseCredit: "3.0", semester: 3, department: "CE", session: "2021-22" },
  { courseCode: "CE 304", courseName: "Materials Sessional", courseCredit: "1.5", semester: 3, department: "CE", session: "2021-22" },
  { courseCode: "CE 305", courseName: "Mechanics of Solids-I", courseCredit: "3.0", semester: 3, department: "CE", session: "2021-22" },
  { courseCode: "CE 306", courseName: "Structural Mechanics and Materials Sessional", courseCredit: "1.5", semester: 3, department: "CE", session: "2021-22" },
  { courseCode: "Shop 301", courseName: "Workshop Sessional", courseCredit: "1.5", semester: 3, department: "CE", session: "2021-22" },

  // Semester 4
  { courseCode: "Math 401", courseName: "3-D Co-ordinate Geometry, Fourier Analysis, and Harmonic Functions", courseCredit: "3.0", semester: 4, department: "CE", session: "2021-22" },
  { courseCode: "Hum 401", courseName: "Principles of Accounting", courseCredit: "2.0", semester: 4, department: "CE", session: "2021-22" },
  { courseCode: "CE 401", courseName: "Numerical Methods and Basic Computer Programming", courseCredit: "3.0", semester: 4, department: "CE", session: "2021-22" },
  { courseCode: "CE 402", courseName: "Mechanics of Solids-II", courseCredit: "4.0", semester: 4, department: "CE", session: "2021-22" },
  { courseCode: "CE 403", courseName: "Quantity Surveying", courseCredit: "1.5", semester: 4, department: "CE", session: "2021-22" },
  { courseCode: "CE 404", courseName: "Fluid Mechanics", courseCredit: "4.0", semester: 4, department: "CE", session: "2021-22" },
  { courseCode: "CE 405", courseName: "Fluid Mechanics Sessional", courseCredit: "1.5", semester: 4, department: "CE", session: "2021-22" },
  { courseCode: "CSE 401", courseName: "Computer Programming Sessional", courseCredit: "1.5", semester: 4, department: "CE", session: "2021-22" },

  // Semester 5
  { courseCode: "CE 501", courseName: "Structural Analysis and Design-I", courseCredit: "3.0", semester: 5, department: "CE", session: "2021-22" },
  { courseCode: "CE 502", courseName: "Structural Analysis and Design Sessional-I", courseCredit: "1.5", semester: 5, department: "CE", session: "2021-22" },
  { courseCode: "CE 503", courseName: "Design of Concrete Structures-I", courseCredit: "3.0", semester: 5, department: "CE", session: "2021-22" },
  { courseCode: "CE 504", courseName: "Environmental Engineering-I", courseCredit: "3.0", semester: 5, department: "CE", session: "2021-22" },
  { courseCode: "CE 505", courseName: "Principles of Soil Mechanics", courseCredit: "3.0", semester: 5, department: "CE", session: "2021-22" },
  { courseCode: "CE 506", courseName: "Geotechnical Engineering Sessional-I", courseCredit: "1.5", semester: 5, department: "CE", session: "2021-22" },
  { courseCode: "CE 507", courseName: "Open Channel Flow", courseCredit: "4.0", semester: 5, department: "CE", session: "2021-22" },
  { courseCode: "CE 508", courseName: "Open Channel Flow Sessional", courseCredit: "1.5", semester: 5, department: "CE", session: "2021-22" },

  // Semester 6
  { courseCode: "CE 601", courseName: "Structural Analysis and Design-II", courseCredit: "3.0", semester: 6, department: "CE", session: "2021-22" },
  { courseCode: "CE 602", courseName: "Design of Concrete Structures-II", courseCredit: "4.0", semester: 6, department: "CE", session: "2021-22" },
  { courseCode: "CE 603", courseName: "Concrete Structures Sessional", courseCredit: "1.5", semester: 6, department: "CE", session: "2021-22" },
  { courseCode: "CE 604", courseName: "Principles of Foundation Engineering", courseCredit: "3.0", semester: 6, department: "CE", session: "2021-22" },
  { courseCode: "CE 605", courseName: "Transportation Engineering-I: Transport & Traffic Design", courseCredit: "3.0", semester: 6, department: "CE", session: "2021-22" },
  { courseCode: "CE 606", courseName: "Transportation Engineering Sessional I", courseCredit: "1.5", semester: 6, department: "CE", session: "2021-22" },
  { courseCode: "CE 607", courseName: "Hydrology", courseCredit: "3.0", semester: 6, department: "CE", session: "2021-22" },
  { courseCode: "CE 608", courseName: "Environmental Engineering Sessional", courseCredit: "1.5", semester: 6, department: "CE", session: "2021-22" },

  // Semester 7
  { courseCode: "CE 700", courseName: "Project and Thesis", courseCredit: "1.5", semester: 7, department: "CE", session: "2021-22" },
  { courseCode: "CE 701", courseName: "Environmental Engineering-II", courseCredit: "3.0", semester: 7, department: "CE", session: "2021-22" },
  { courseCode: "CE 702", courseName: "Transportation Engineering-II: Highway Design & Railways", courseCredit: "3.0", semester: 7, department: "CE", session: "2021-22" },
  { courseCode: "CE 703", courseName: "Project Planning and Management", courseCredit: "3.0", semester: 7, department: "CE", session: "2021-22" },
  { courseCode: "CE 704", courseName: "Structural Analysis and Design-III", courseCredit: "4.0", semester: 7, department: "CE", session: "2021-22" },
  { courseCode: "CE 705", courseName: "Structural Analysis and Design Sessional II", courseCredit: "1.5", semester: 7, department: "CE", session: "2021-22" },
  { courseCode: "CE 706", courseName: "Irrigation and Flood Control", courseCredit: "3.0", semester: 7, department: "CE", session: "2021-22" },

  // Semester 8
  { courseCode: "CE 700", courseName: "Project and Thesis", courseCredit: "3.0", semester: 8, department: "CE", session: "2021-22" },
  { courseCode: "CE 801", courseName: "Professional Practice and Communication", courseCredit: "2.0", semester: 8, department: "CE", session: "2021-22" },
  { courseCode: "CE 802", courseName: "Socio-Economic Aspects of Development Projects", courseCredit: "1.5", semester: 8, department: "CE", session: "2021-22" },
  { courseCode: "CE 803", courseName: "Design of Steel Structures (Elective Theory)", courseCredit: "4.0", semester: 8, department: "CE", session: "2021-22", isElective: true },
  { courseCode: "CE 804", courseName: "Structural Analysis and Design Sessional III", courseCredit: "1.5", semester: 8, department: "CE", session: "2021-22", isElective: true },
  { courseCode: "CE 809", courseName: "Solid Hazardous Waste Management (Elective Theory)", courseCredit: "4.0", semester: 8, department: "CE", session: "2021-22", isElective: true },
  { courseCode: "CE 812", courseName: "Design of Water Supply, Sanitation Systems Sessional", courseCredit: "1.5", semester: 8, department: "CE", session: "2021-22", isElective: true },
];

export const TOTAL_DEPARTMENT_CREDITS: Record<string, number> = {
  CSE: 160.50,
  EEE: 162.00,
  CE: 160.00,
};

export const SEMESTER_CREDIT_BREAKDOWN: Record<string, Record<number, number>> = {
  CSE: { 1: 20.50, 2: 21.50, 3: 22.25, 4: 19.25, 5: 19.50, 6: 19.50, 7: 20.50, 8: 17.50 },
  EEE: { 1: 21.00, 2: 22.50, 3: 21.00, 4: 19.50, 5: 21.00, 6: 19.50, 7: 21.00, 8: 16.50 },
  CE: { 1: 20.25, 2: 20.75, 3: 21.00, 4: 20.50, 5: 20.50, 6: 20.50, 7: 19.00, 8: 17.50 },
};

export function getCompletedCredits(dept: string, completedSem: number): number {
  const table = SEMESTER_CREDIT_BREAKDOWN[dept] || SEMESTER_CREDIT_BREAKDOWN.CSE;
  let total = 0;
  for (let s = 1; s <= completedSem && s <= 8; s++) {
    total += table[s] || 0;
  }
  return total;
}

export function getRemainingCredits(dept: string, completedSem: number, targetSem: number = 8): number {
  const table = SEMESTER_CREDIT_BREAKDOWN[dept] || SEMESTER_CREDIT_BREAKDOWN.CSE;
  let total = 0;
  for (let s = completedSem + 1; s <= targetSem && s <= 8; s++) {
    total += table[s] || 0;
  }
  return total;
}
