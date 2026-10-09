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
  FolderGit2,
  GraduationCap,
  KeyRound,
  BarChart3,
  Clock,
  Globe,
  Activity,
  Building2,
  Image as ImageIcon,
  UserCheck,
} from "lucide-react";

export interface MenuItem {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  href?: string;
  badge?: string;
  dotColor?: string;
}

export interface MenuSection {
  title: string;
  items: MenuItem[];
}

export const ADMIN_MENU_SECTIONS: MenuSection[] = [
  {
    title: "Overview",
    items: [
      {
        key: "overview",
        label: "Platform Overview",
        icon: LayoutDashboard,
        iconColor: "text-indigo-400",
        href: "/dashboard",
      },
      {
        key: "visual-overview",
        label: "Visual Overview",
        icon: BarChart3,
        iconColor: "text-emerald-400",
        href: "/dashboard/visual-overview",
      },
    ],
  },
  {
    title: "People",
    items: [
      {
        key: "members",
        label: "Members Management",
        icon: Users,
        iconColor: "text-sky-400",
        href: "/dashboard/members",
      },
      {
        key: "alumni",
        label: "Alumni Management",
        icon: GraduationCap,
        iconColor: "text-amber-400",
        href: "/dashboard/alumni",
      },
      {
        key: "advisors",
        label: "Advisor Directory",
        icon: UserCheck,
        iconColor: "text-indigo-400",
        href: "/dashboard/advisors",
      },
      {
        key: "roles-and-permissions",
        label: "Roles & Permissions",
        icon: KeyRound,
        iconColor: "text-orange-400",
        dotColor: "bg-amber-400",
        href: "/dashboard/roles-and-permissions",
      },
    ],
  },
  {
    title: "Content",
    items: [
      {
        key: "manage-events",
        label: "Events & Forms",
        icon: Calendar,
        iconColor: "text-rose-400",
        href: "/dashboard/manage-events",
      },
      {
        key: "manage-projects",
        label: "Projects Management",
        icon: FolderGit2,
        iconColor: "text-amber-300",
        href: "/dashboard/manage-projects",
      },
      {
        key: "manage-certificates",
        label: "Certificates",
        icon: Award,
        iconColor: "text-teal-400",
        href: "/dashboard/manage-certificates",
      },
      {
        key: "blogs",
        label: "Blog Management",
        icon: BookOpen,
        iconColor: "text-orange-400",
        href: "/dashboard/blogs",
      },
      {
        key: "page-editor",
        label: "Page Editor",
        icon: FileCode,
        iconColor: "text-slate-300",
        href: "/dashboard/page-editor",
      },
      {
        key: "media",
        label: "Cloudinary Media",
        icon: ImageIcon,
        iconColor: "text-purple-400",
        href: "/dashboard/media",
      },
    ],
  },
  {
    title: "Insights",
    items: [
      {
        key: "analytics",
        label: "Site & API Analytics",
        icon: Activity,
        iconColor: "text-amber-400",
        href: "/dashboard/analytics",
      },
      {
        key: "institute-analytics",
        label: "Utilities Analytics",
        icon: Building2,
        iconColor: "text-pink-400",
        href: "/dashboard/institute-analytics",
      },
      {
        key: "activity-log",
        label: "Activity Log",
        icon: Clock,
        iconColor: "text-sky-400",
        href: "/dashboard/activity-log",
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        key: "administration",
        label: "Administration",
        icon: ShieldCheck,
        iconColor: "text-emerald-400",
        href: "/dashboard/administration",
      },
      {
        key: "utilities",
        label: "Utility Catalog",
        icon: BookOpen,
        iconColor: "text-indigo-400",
        href: "/dashboard/utilities",
      },
      {
        key: "assets",
        label: "Assets & Inventory",
        icon: HardHat,
        iconColor: "text-amber-400",
        href: "/dashboard/assets",
      },
      {
        key: "sponsors",
        label: "Sponsors & Partners",
        icon: DollarSign,
        iconColor: "text-emerald-400",
        href: "/dashboard/sponsors",
      },
      {
        key: "messages",
        label: "Contact Messages",
        icon: MessageSquare,
        iconColor: "text-sky-400",
        href: "/dashboard/messages",
      },
    ],
  },
];

export const MODERATOR_MENU_SECTIONS: MenuSection[] = [
  {
    title: "Overview",
    items: [
      {
        key: "overview",
        label: "Platform Overview",
        icon: LayoutDashboard,
        iconColor: "text-indigo-400",
        href: "/dashboard",
      },
      {
        key: "visual-overview",
        label: "Visual Overview",
        icon: BarChart3,
        iconColor: "text-emerald-400",
        href: "/dashboard/visual-overview",
      },
    ],
  },
  {
    title: "People",
    items: [
      {
        key: "members",
        label: "Members Management",
        icon: Users,
        iconColor: "text-sky-400",
        href: "/dashboard/members",
      },
      {
        key: "alumni",
        label: "Alumni Management",
        icon: GraduationCap,
        iconColor: "text-amber-400",
        href: "/dashboard/alumni",
      },
      {
        key: "advisors",
        label: "Advisor Directory",
        icon: UserCheck,
        iconColor: "text-indigo-400",
        href: "/dashboard/advisors",
      },
    ],
  },
  {
    title: "Content",
    items: [
      {
        key: "manage-events",
        label: "Events & Forms",
        icon: Calendar,
        iconColor: "text-rose-400",
        href: "/dashboard/manage-events",
      },
      {
        key: "manage-projects",
        label: "Projects Management",
        icon: FolderGit2,
        iconColor: "text-amber-300",
        href: "/dashboard/manage-projects",
      },
      {
        key: "manage-certificates",
        label: "Certificates",
        icon: Award,
        iconColor: "text-teal-400",
        href: "/dashboard/manage-certificates",
      },
      {
        key: "blogs",
        label: "Blog Management",
        icon: BookOpen,
        iconColor: "text-orange-400",
        href: "/dashboard/blogs",
      },
      {
        key: "page-editor",
        label: "Page Editor",
        icon: FileCode,
        iconColor: "text-slate-300",
        href: "/dashboard/page-editor",
      },
    ],
  },
  {
    title: "Insights",
    items: [
      {
        key: "analytics",
        label: "Site & API Analytics",
        icon: Activity,
        iconColor: "text-amber-400",
        href: "/dashboard/analytics",
      },
      {
        key: "institute-analytics",
        label: "Utilities Analytics",
        icon: Building2,
        iconColor: "text-pink-400",
        href: "/dashboard/institute-analytics",
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        key: "administration",
        label: "Administration",
        icon: ShieldCheck,
        iconColor: "text-emerald-400",
        href: "/dashboard/administration",
      },
      {
        key: "utilities",
        label: "Utility Catalog",
        icon: BookOpen,
        iconColor: "text-indigo-400",
        href: "/dashboard/utilities",
      },
      {
        key: "assets",
        label: "Assets & Inventory",
        icon: HardHat,
        iconColor: "text-amber-400",
        href: "/dashboard/assets",
      },
      {
        key: "sponsors",
        label: "Sponsors & Partners",
        icon: DollarSign,
        iconColor: "text-emerald-400",
        href: "/dashboard/sponsors",
      },
      {
        key: "messages",
        label: "Contact Messages",
        icon: MessageSquare,
        iconColor: "text-sky-400",
        href: "/dashboard/messages",
      },
    ],
  },
];

export const ADVISOR_MENU_SECTIONS: MenuSection[] = [
  {
    title: "Overview",
    items: [
      {
        key: "overview",
        label: "Club Overview",
        icon: LayoutDashboard,
        iconColor: "text-indigo-400",
        href: "/dashboard",
      },
      {
        key: "visual-overview",
        label: "Visual Overview",
        icon: BarChart3,
        iconColor: "text-emerald-400",
        href: "/dashboard/visual-overview",
      },
    ],
  },
  {
    title: "Insights",
    items: [
      {
        key: "analytics",
        label: "Site & API Analytics",
        icon: Activity,
        iconColor: "text-amber-400",
        href: "/dashboard/analytics",
      },
      {
        key: "institute-analytics",
        label: "Utilities Analytics",
        icon: Building2,
        iconColor: "text-pink-400",
        href: "/dashboard/institute-analytics",
      },
    ],
  },
  {
    title: "People",
    items: [
      {
        key: "members",
        label: "Member Directory",
        icon: Users,
        iconColor: "text-sky-400",
        href: "/dashboard/members",
      },
      {
        key: "alumni",
        label: "Alumni Directory",
        icon: GraduationCap,
        iconColor: "text-amber-400",
        href: "/dashboard/alumni",
      },
      {
        key: "advisors",
        label: "Advisor Directory",
        icon: UserCheck,
        iconColor: "text-indigo-400",
        href: "/dashboard/advisors",
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        key: "assets",
        label: "Assets & Inventory",
        icon: HardHat,
        iconColor: "text-amber-400",
        href: "/dashboard/assets",
      },
    ],
  },
];

export const MEMBER_MENU_SECTIONS: MenuSection[] = [
  {
    title: "Overview",
    items: [
      { key: "activity", label: "My Activity", icon: LayoutDashboard, iconColor: "text-indigo-400", href: "/dashboard/activity" },
    ],
  },
  {
    title: "Activities & Skills",
    items: [
      { key: "certificates", label: "Certificates", icon: ClipboardCheck, iconColor: "text-teal-400", href: "/dashboard/certificates" },
      { key: "events", label: "Upcoming Events", icon: Calendar, iconColor: "text-rose-400", href: "/dashboard/events" },
      { key: "cp-arena", label: "CP Arena", icon: Code2, iconColor: "text-emerald-400", href: "/dashboard/cp-arena" },
      { key: "projects", label: "Projects", icon: Layers, iconColor: "text-amber-400", href: "/dashboard/projects" },
    ],
  },
  {
    title: "Account",
    items: [
      { key: "profile", label: "Profile Settings", icon: User, iconColor: "text-sky-400", href: "/dashboard/profile" },
    ],
  },
];

export function getDashboardMenuSections(role?: string, clubRole?: string): MenuSection[] {
  const r = String(role || "member").toLowerCase();
  const cr = String(clubRole || "").toLowerCase();

  if (r === "advisor" || cr === "advisor") {
    return ADVISOR_MENU_SECTIONS;
  }
  if (r === "admin") {
    return ADMIN_MENU_SECTIONS;
  }
  if (r === "moderator" || r === "executive" || cr === "executive") {
    return MODERATOR_MENU_SECTIONS;
  }
  return MEMBER_MENU_SECTIONS;
}

export interface DashboardMenuConfig {
  member: MenuItem[];
  admin: MenuItem[];
  moderator: MenuItem[];
  executive: MenuItem[];
  advisor: MenuItem[];
  [key: string]: MenuItem[];
}

export const DASHBOARD_MENU: DashboardMenuConfig = {
  member: MEMBER_MENU_SECTIONS.flatMap((s) => s.items),
  admin: ADMIN_MENU_SECTIONS.flatMap((s) => s.items),
  moderator: MODERATOR_MENU_SECTIONS.flatMap((s) => s.items),
  executive: MODERATOR_MENU_SECTIONS.flatMap((s) => s.items),
  advisor: ADVISOR_MENU_SECTIONS.flatMap((s) => s.items),
  alumni: MEMBER_MENU_SECTIONS.flatMap((s) => s.items),
  guest: MEMBER_MENU_SECTIONS.flatMap((s) => s.items),
};
