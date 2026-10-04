export type AdminActionType =
  | "CREATE"
  | "UPDATE"
  | "STATUS_CHANGE"
  | "DELETE"
  | "APPROVE"
  | "REJECT"
  | "PUBLISH"
  | "ROOM_OPEN"
  | "ROOM_CLOSE"
  | "ROLE_CHANGE"
  | "EXPORT";

export type AdminTargetType =
  | "ASSET"
  | "MEMBER"
  | "EVENT"
  | "PAGE"
  | "INVITATION"
  | "CLUB_ROOM"
  | "CERTIFICATE"
  | "SYSTEM";

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

export const INITIAL_ADMIN_LOGS: AdminLogEntry[] = [];

export function getAdminLogs(): AdminLogEntry[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Failed to read admin logs from localStorage:", err);
    return [];
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
