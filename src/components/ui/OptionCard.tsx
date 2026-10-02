"use client";

import React from "react";
import Link from "next/link";

/**
 * ============================================================================
 * Canonical Option Card (Dropdown / Popover / Context Menu) Design System
 * ============================================================================
 * Standardized template for all option cards, popovers, and menu cards across the application.
 *
 * Visual Rules:
 * 1. Outer Container:
 *    - Light theme: `border border-black` (1px solid black)
 *    - Dark theme: `dark:border-border-default` (1px solid default border)
 *    - Background: `bg-surface-elevated`
 *    - Radius: `rounded-xl` (12px)
 *    - Shadow: `shadow-[4px_4px_0px_var(--accent-primary)]` (4px solid accent neo-brutalist shadow)
 *    - Animation: `animate-in fade-in zoom-in-95 duration-150`
 *    - Overflow: `overflow-hidden`
 * 2. Header (`OptionCardHeader`):
 *    - Background: `bg-surface-secondary`
 *    - Border bottom: `border-b border-black/10 dark:border-border-default`
 *    - Title: `font-heading text-xs font-bold text-text-primary`
 *    - Badge: `font-mono text-[10px] font-bold px-2 py-0.5 rounded-md`
 * 3. Options (`OptionCardItem`):
 *    - Padding: `px-3.5 py-2`
 *    - Typography: `text-xs font-semibold text-text-secondary hover:text-text-primary`
 *    - Hover background: `hover:bg-surface-secondary dark:hover:bg-white/5`
 *    - Danger variant: `text-rose-600 dark:text-rose-400 hover:bg-rose-500/10`
 * 4. Dividers (`OptionCardDivider`):
 *    - Separator line: `my-1 border-t border-black/10 dark:border-border-default`
 * ============================================================================
 */

export interface OptionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  id?: string;
  role?: string;
  style?: React.CSSProperties;
}

export function OptionCard({
  children,
  className = "",
  id,
  role = "menu",
  style,
  ...rest
}: OptionCardProps) {
  return (
    <div
      id={id}
      role={role}
      style={style}
      className={`min-w-[240px] bg-surface-elevated border border-black dark:border-border-default rounded-xl shadow-[4px_4px_0px_var(--accent-primary)] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150 ${className}`.trim()}
      {...rest}
    >
      {children}
    </div>
  );
}

export interface OptionCardHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}

export function OptionCardHeader({
  title,
  subtitle,
  badge,
  className = "",
}: OptionCardHeaderProps) {
  return (
    <div
      className={`px-3.5 py-2.5 bg-surface-secondary border-b border-black/10 dark:border-border-default flex items-center justify-between gap-2.5 select-none ${className}`.trim()}
    >
      <div className="min-w-0 flex-1">
        <div className="font-heading text-xs font-bold text-text-primary truncate">
          {title}
        </div>
        {subtitle && (
          <div className="text-[11px] text-text-secondary truncate mt-0.5">
            {subtitle}
          </div>
        )}
      </div>
      {badge && <div className="flex-shrink-0">{badge}</div>}
    </div>
  );
}

export interface OptionCardListProps {
  children: React.ReactNode;
  className?: string;
}

export function OptionCardList({
  children,
  className = "",
}: OptionCardListProps) {
  return (
    <div className={`py-1 flex flex-col ${className}`.trim()}>
      {children}
    </div>
  );
}

export interface OptionCardItemProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  variant?: "default" | "danger";
  active?: boolean;
  badge?: React.ReactNode;
  className?: string;
  role?: string;
}

export function OptionCardItem({
  children,
  icon,
  href,
  onClick,
  variant = "default",
  active = false,
  badge,
  className = "",
  role = "menuitem",
}: OptionCardItemProps) {
  const isDanger = variant === "danger";

  const itemClasses = `w-full flex items-center justify-between gap-2.5 px-3.5 py-2 text-xs font-semibold transition-colors duration-150 cursor-pointer select-none text-left no-underline ${
    isDanger
      ? "text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 dark:hover:bg-rose-500/15"
      : active
      ? "bg-accent-primary-light text-text-primary dark:bg-accent-primary/20 dark:text-white font-bold"
      : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary dark:hover:bg-white/5"
  } ${className}`.trim();

  const content = (
    <>
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        {icon && (
          <span
            className={`inline-flex items-center text-[1.1em] flex-shrink-0 ${
              isDanger ? "text-rose-600 dark:text-rose-400" : "text-text-secondary"
            }`}
          >
            {icon}
          </span>
        )}
        <span className="truncate">{children}</span>
      </div>
      {badge && <span className="flex-shrink-0">{badge}</span>}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={itemClasses} onClick={onClick} role={role}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={itemClasses} onClick={onClick} role={role}>
      {content}
    </button>
  );
}

export function OptionCardDivider({ className = "" }: { className?: string }) {
  return (
    <div
      className={`my-1 border-t border-black/10 dark:border-border-default ${className}`.trim()}
    />
  );
}

export interface OptionCardSectionProps {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function OptionCardSection({
  title,
  action,
  children,
  className = "",
}: OptionCardSectionProps) {
  return (
    <div className={`px-3.5 py-2 ${className}`.trim()}>
      {(title || action) && (
        <div className="flex items-center justify-between pb-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-text-tertiary select-none">
          {title && <span>{title}</span>}
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
