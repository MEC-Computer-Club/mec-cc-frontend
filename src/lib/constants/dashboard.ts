import {
  LayoutDashboard,
  Users,
  Settings,
  Calendar,
  HardHat,
  DollarSign,
  MessageSquare,
  ClipboardCheck,
  User,
  ShieldCheck,
  FileCode,
  Code2,
  Layers,
  BookOpen,
  Award,
  FileText,
  FolderGit2,
  GraduationCap,
} from "lucide-react";

export interface MenuItem {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface DashboardMenuConfig {
  member: MenuItem[];
  admin: MenuItem[];
  [key: string]: MenuItem[];
}

export const DASHBOARD_MENU: DashboardMenuConfig = {
  member: [
    { key: "activity", label: "My Activity", icon: LayoutDashboard },
    { key: "certificates", label: "Certificates", icon: ClipboardCheck },
    { key: "events", label: "Upcoming Events", icon: Calendar },
    { key: "cp-arena", label: "CP Arena", icon: Code2 },
    { key: "projects", label: "Projects", icon: Layers },
    { key: "profile", label: "Profile Settings", icon: User },
  ],
  admin: [
    { key: "overview", label: "Platform Overview", icon: LayoutDashboard },
    { key: "members", label: "Members Management", icon: Users },
    { key: "manage-events", label: "Events & Forms", icon: Calendar },
    { key: "manage-projects", label: "Projects Management", icon: FolderGit2 },
    { key: "manage-certificates", label: "Certificates", icon: Award },
    { key: "blogs", label: "Blog Management", icon: BookOpen },
    { key: "page-editor", label: "Page Editor", icon: FileCode },
    { key: "roles-and-invitation", label: "Administration", icon: ShieldCheck },
    { key: "utilities", label: "Utilities & Catalog", icon: GraduationCap },
    { key: "assets", label: "Assets & Inventory", icon: HardHat },
    { key: "sponsors", label: "Sponsors & Partners", icon: DollarSign },
    { key: "messages", label: "Contact Messages", icon: MessageSquare },
    { key: "site-settings", label: "Global Settings", icon: Settings },
  ],
  moderator: [
    { key: "overview", label: "Platform Overview", icon: LayoutDashboard },
    { key: "members", label: "Members Management", icon: Users },
    { key: "manage-events", label: "Events & Forms", icon: Calendar },
    { key: "manage-projects", label: "Projects Management", icon: FolderGit2 },
    { key: "manage-certificates", label: "Certificates", icon: Award },
    { key: "blogs", label: "Blog Management", icon: BookOpen },
    { key: "page-editor", label: "Page Editor", icon: FileCode },
    { key: "roles-and-invitation", label: "Administration", icon: ShieldCheck },
    { key: "utilities", label: "Utilities & Catalog", icon: GraduationCap },
    { key: "assets", label: "Assets & Inventory", icon: HardHat },
    { key: "sponsors", label: "Sponsors & Partners", icon: DollarSign },
    { key: "messages", label: "Contact Messages", icon: MessageSquare },
    { key: "site-settings", label: "Global Settings", icon: Settings },
  ],
  alumni: [
    { key: "activity", label: "My Activity", icon: LayoutDashboard },
    { key: "certificates", label: "Certificates", icon: ClipboardCheck },
    { key: "events", label: "Upcoming Events", icon: Calendar },
    { key: "cp-arena", label: "CP Arena", icon: Code2 },
    { key: "projects", label: "Projects", icon: Layers },
    { key: "profile", label: "Profile Settings", icon: User },
  ],
  guest: [
    { key: "activity", label: "My Activity", icon: LayoutDashboard },
    { key: "certificates", label: "Certificates", icon: ClipboardCheck },
    { key: "events", label: "Upcoming Events", icon: Calendar },
    { key: "cp-arena", label: "CP Arena", icon: Code2 },
    { key: "projects", label: "Projects", icon: Layers },
    { key: "profile", label: "Profile Settings", icon: User },
  ],
  executive: [
    { key: "overview", label: "Platform Overview", icon: LayoutDashboard },
    { key: "members", label: "Members Management", icon: Users },
    { key: "manage-events", label: "Events & Forms", icon: Calendar },
    { key: "manage-projects", label: "Projects Management", icon: FolderGit2 },
    { key: "manage-certificates", label: "Certificates", icon: Award },
    { key: "blogs", label: "Blog Management", icon: BookOpen },
    { key: "page-editor", label: "Page Editor", icon: FileCode },
    { key: "roles-and-invitation", label: "Administration", icon: ShieldCheck },
    { key: "assets", label: "Assets & Inventory", icon: HardHat },
    { key: "sponsors", label: "Sponsors & Partners", icon: DollarSign },
    { key: "messages", label: "Contact Messages", icon: MessageSquare },
    { key: "site-settings", label: "Global Settings", icon: Settings },
  ],
};
