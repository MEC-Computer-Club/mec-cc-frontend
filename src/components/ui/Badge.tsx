interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "upcoming" | "past" | "pending" | "active" | "completed" | "info" | "ongoing" | "scheduled" | "cancelled" | "postponed";
  size?: "sm" | "md";
  className?: string;
}

const BADGE_VARIANTS: Record<string, string> = {
  default: "bg-surface-secondary text-text-secondary",
  upcoming: "bg-accent-primary text-accent-primary-text",
  scheduled: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30",
  ongoing: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 font-bold",
  past: "bg-surface-secondary text-text-tertiary",
  completed: "bg-surface-secondary text-text-secondary border border-border-default",
  pending: "bg-accent-primary text-accent-primary-text",
  active: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  info: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  cancelled: "bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30",
  postponed: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30",
};

const BADGE_SIZES: Record<string, string> = {
  sm: "text-[0.65rem] py-1 px-2.5",
  md: "text-xs py-1.5 px-3.5",
};

export function Badge({
  children,
  variant = "default",
  size = "sm",
  className = "",
}: BadgeProps) {
  const variantClass = BADGE_VARIANTS[variant] || BADGE_VARIANTS.default;
  const sizeClass = BADGE_SIZES[size] || BADGE_SIZES.sm;

  return (
    <span
      className={`inline-flex items-center font-mono [font-feature-settings:'liga'_0,'calt'_0] font-medium uppercase tracking-wider rounded-full whitespace-nowrap leading-none ${variantClass} ${sizeClass} ${className}`}
    >
      {children}
    </span>
  );
}
