import Link from "next/link";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  id?: string;
  title?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  style?: React.CSSProperties;
  target?: string;
  rel?: string;
}

const BUTTON_VARIANTS: Record<string, string> = {
  primary:
    "bg-black text-white border-0 hover:not-disabled:bg-neutral-800 hover:not-disabled:shadow-[4px_4px_0px_0px_var(--accent-primary)] dark:bg-white dark:text-black dark:hover:not-disabled:bg-neutral-200 dark:hover:not-disabled:shadow-[4px_4px_0px_0px_var(--accent-primary)] hover:not-disabled:-translate-x-0.5 hover:not-disabled:-translate-y-0.5 active:not-disabled:translate-x-0 active:not-disabled:translate-y-0 active:not-disabled:shadow-none",
  secondary:
    "bg-transparent text-black border border-black hover:not-disabled:bg-neutral-100 hover:not-disabled:shadow-[4px_4px_0px_0px_black] dark:bg-transparent dark:text-white dark:border-white dark:hover:not-disabled:bg-neutral-900 dark:hover:not-disabled:shadow-[4px_4px_0px_0px_white] hover:not-disabled:-translate-x-0.5 hover:not-disabled:-translate-y-0.5 active:not-disabled:translate-x-0 active:not-disabled:translate-y-0 active:not-disabled:shadow-none",
  outline:
    "bg-transparent text-black border border-black hover:not-disabled:bg-neutral-100 hover:not-disabled:shadow-[4px_4px_0px_0px_black] dark:bg-transparent dark:text-white dark:border-white dark:hover:not-disabled:bg-neutral-900 dark:hover:not-disabled:shadow-[4px_4px_0px_0px_white] hover:not-disabled:-translate-x-0.5 hover:not-disabled:-translate-y-0.5 active:not-disabled:translate-x-0 active:not-disabled:translate-y-0 active:not-disabled:shadow-none",
  ghost:
    "bg-transparent text-text-secondary font-semibold hover:not-disabled:text-text-primary hover:not-disabled:bg-surface-secondary",
};

const BUTTON_SIZES: Record<string, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-[48px] px-5 text-base",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  id,
  title,
  fullWidth = false,
  icon,
  style,
  target,
  rel,
}: ButtonProps) {
  const variantClass = BUTTON_VARIANTS[variant] || BUTTON_VARIANTS.primary;
  const sizeClass = BUTTON_SIZES[size] || BUTTON_SIZES.md;
  const widthClass = fullWidth ? "w-full" : "";

  const classes = [
    "inline-flex items-center justify-center gap-2 font-sans font-bold rounded-md cursor-pointer transition-all duration-150 no-underline whitespace-nowrap leading-none focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
    variantClass,
    sizeClass,
    widthClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <Link href={href} className={classes} id={id} title={title} style={style} target={target} rel={rel}>
        {icon && <span className="inline-flex items-center text-[1.1em]">{icon}</span>}
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      id={id}
      title={title}
      style={style}
    >
      {icon && <span className="inline-flex items-center text-[1.1em]">{icon}</span>}
      {children}
    </button>
  );
}
