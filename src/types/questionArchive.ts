export interface QuestionArchiveItem {
  _id: string;
  title: string;
  department: string;
  semester: number;
  year: number;
  session?: string;
  examType: string;
  courseCode: string;
  courseName: string;
  course?: {
    _id: string;
    courseCode: string;
    courseName: string;
    courseCredit?: string;
    department?: string;
    semester?: number;
  } | null;
  fileUrl: string;
  filePublicId?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: "pdf" | "image" | "document";
  mimeType?: string;
  description?: string;
  tags?: string[];
  status: "published" | "draft" | "archived";
  downloadCount: number;
  viewCount: number;
  uploadedBy?: {
    _id: string;
    fullName?: string;
    studentId?: string;
    email?: string;
    role?: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionFiltersData {
  departments: string[];
  years: number[];
  semesters: number[];
  examTypes: string[];
  fileTypes?: string[];
  courses: Array<{
    courseCode: string;
    courseName: string;
    department: string;
    semester: number;
    courseCredit?: string;
  }>;
  stats: {
    totalQuestions: number;
    totalPdfs?: number;
    totalImages?: number;
  };
}

export interface QuestionArchiveResponse {
  success: boolean;
  count: number;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  data: QuestionArchiveItem[];
}
