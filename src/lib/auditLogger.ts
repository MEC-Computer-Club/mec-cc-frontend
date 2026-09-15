export type AdminActionType =
  | "CREATE"
  | "UPDATE"
  | "STATUS_CHANGE"
  | "DELETE"
  | "APPROVE"
  | "REJECT"
  | "PUBLISH";

export type AdminTargetType = "ASSET" | "MEMBER" | "EVENT" | "PAGE" | "SYSTEM";

export interface LogDiffItem {
  field: string;
  previousValue: string | number | null | undefined;
  newValue: string | number | null | undefined;
}

export interface AdminLogEntry {
  id: string;
  timestamp: string; // ISO string
  formattedDate: string; // e.g. "23/03/2024 14:32"
  actorName: string; // e.g. "Nasir"
  actorEmail?: string;
  actorRole: "admin" | "moderator";
  action: AdminActionType;
  targetType: AdminTargetType;
  targetTitle: string; // e.g. "TP-Link Archer Router" or "Akram Hossain"
  description: string; // e.g. "Nasir modified asset: router status returned. Previous version was 'In Use'."
  diff?: LogDiffItem[];
  metadata?: Record<string, any>;
}

const STORAGE_KEY = "mec_cc_admin_activity_logs";

export const INITIAL_ADMIN_LOGS: AdminLogEntry[] = [
  {
    id: "log-101",
    timestamp: "2024-03-24T17:35:00Z",
    formattedDate: "24/03/2024, 05:35 PM",
    actorName: "Nasir",
    actorEmail: "nasir.mec@gmail.com",
    actorRole: "admin",
    action: "STATUS_CHANGE",
    targetType: "ASSET",
    targetTitle: "Epson Full HD Multimedia Projector",
    description: "Nasir modified asset: Epson Projector status returned to CSE Seminar Lab. Previous version was In Use.",
    diff: [
      { field: "Status", previousValue: "In Use", newValue: "Returned" },
      { field: "Return Date", previousValue: "Pending", newValue: "2024-03-24" },
      { field: "Location", previousValue: "Club Room 302", newValue: "CSE Seminar Lab (Returned)" },
    ],
  },
  {
    id: "log-102",
    timestamp: "2024-03-23T14:15:00Z",
    formattedDate: "23/03/2024, 02:15 PM",
    actorName: "Nasir",
    actorEmail: "nasir.mec@gmail.com",
    actorRole: "admin",
    action: "APPROVE",
    targetType: "MEMBER",
    targetTitle: "Akram Hossain",
    description: "Nasir has accepted a member named Akram into Competitive Programming Wing.",
    diff: [
      { field: "Membership Status", previousValue: "Pending Approval", newValue: "Active Member" },
      { field: "Assigned Wing", previousValue: "None", newValue: "Competitive Programming" },
      { field: "Batch", previousValue: "N/A", newValue: "12th Batch (CSE)" },
    ],
  },
  {
    id: "log-103",
    timestamp: "2024-03-10T11:00:00Z",
    formattedDate: "10/03/2024, 11:00 AM",
    actorName: "Tanvir",
    actorEmail: "tanvir.mec@gmail.com",
    actorRole: "moderator",
    action: "CREATE",
    targetType: "ASSET",
    targetTitle: "Epson Full HD Multimedia Projector",
    description: "Tanvir [Moderator] logged borrowed equipment: Epson Multimedia Projector from CSE Seminar Lab for Hackathon.",
    diff: [
      { field: "Quantity", previousValue: "0", newValue: "1" },
      { field: "Borrowed From", previousValue: "N/A", newValue: "CSE Seminar Lab" },
      { field: "Due Date", previousValue: "N/A", newValue: "2024-03-25" },
    ],
  },
  {
    id: "log-104",
    timestamp: "2024-02-15T16:20:00Z",
    formattedDate: "15/02/2024, 04:20 PM",
    actorName: "Nasir",
    actorEmail: "nasir.mec@gmail.com",
    actorRole: "admin",
    action: "CREATE",
    targetType: "EVENT",
    targetTitle: "Intra-MEC Programming Contest 2024",
    description: "Nasir has created an event 'Intra-MEC Programming Contest 2024' with 4 divisions and registration portal.",
    diff: [
      { field: "Event State", previousValue: "Draft", newValue: "Published & Open" },
      { field: "Capacity", previousValue: "0", newValue: "120 contestants" },
    ],
  },
  {
    id: "log-105",
    timestamp: "2024-02-14T15:45:00Z",
    formattedDate: "14/02/2024, 03:45 PM",
    actorName: "Tanvir",
    actorEmail: "tanvir.mec@gmail.com",
    actorRole: "moderator",
    action: "CREATE",
    targetType: "ASSET",
    targetTitle: "Arduino Uno R3 Starter Kits & Sensor Packs",
    description: "Tanvir [Moderator] added new club owned asset: 5x Arduino Uno R3 kits assigned to Robotics Team Lead.",
    diff: [
      { field: "Quantity", previousValue: "0", newValue: "5 Sets" },
      { field: "Custodian", previousValue: "N/A", newValue: "Robotics Team Lead" },
      { field: "Estimated Value", previousValue: "N/A", newValue: "৳ 8,500" },
    ],
  },
  {
    id: "log-106",
    timestamp: "2024-01-10T09:30:00Z",
    formattedDate: "10/01/2024, 09:30 AM",
    actorName: "Nasir",
    actorEmail: "nasir.mec@gmail.com",
    actorRole: "admin",
    action: "PUBLISH",
    targetType: "PAGE",
    targetTitle: "Competitive Programming Hub",
    description: "Nasir published a page 'Competitive Programming Hub' with MEC live ranklist and problem roadmap.",
    diff: [
      { field: "Status", previousValue: "Draft", newValue: "Live" },
      { field: "Route", previousValue: "N/A", newValue: "/cp-hub" },
    ],
  },
  {
    id: "log-107",
    timestamp: "2024-01-15T10:15:00Z",
    formattedDate: "15/01/2024, 10:15 AM",
    actorName: "Nasir",
    actorEmail: "nasir.mec@gmail.com",
    actorRole: "admin",
    action: "CREATE",
    targetType: "ASSET",
    targetTitle: "TP-Link Archer Dual-Band Gigabit Router",
    description: "Nasir borrowed TP-Link Archer Router from CSE Dept Office & Server Room for Club Room 302.",
    diff: [
      { field: "Status", previousValue: "Dept Store", newValue: "In Use (Club Room 302)" },
      { field: "Borrowed By", previousValue: "None", newValue: "Nasir (President)" },
    ],
  },
];

export function getAdminLogs(): AdminLogEntry[] {
  if (typeof window === "undefined") {
    return INITIAL_ADMIN_LOGS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ADMIN_LOGS));
      return INITIAL_ADMIN_LOGS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_ADMIN_LOGS;
  } catch (err) {
    console.error("Failed to read admin logs from localStorage:", err);
    return INITIAL_ADMIN_LOGS;
  }
}

export function logAdminActivity(entry: Omit<AdminLogEntry, "id" | "timestamp" | "formattedDate">): AdminLogEntry {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const day = pad(now.getDate());
  const month = pad(now.getMonth() + 1);
  const year = now.getFullYear();
  let hours = now.getHours();
  const minutes = pad(now.getMinutes());
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const formattedDate = `${day}/${month}/${year}, ${pad(hours)}:${minutes} ${ampm}`;

  const newRecord: AdminLogEntry = {
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: now.toISOString(),
    formattedDate,
    ...entry,
  };

  if (typeof window !== "undefined") {
    try {
      const current = getAdminLogs();
      const updated = [newRecord, ...current];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      // Dispatch a custom event so any open log pages re-render in real time
      window.dispatchEvent(new CustomEvent("mec-admin-log-updated", { detail: newRecord }));
    } catch (err) {
      console.error("Failed to persist admin log entry:", err);
    }
  }

  return newRecord;
}
