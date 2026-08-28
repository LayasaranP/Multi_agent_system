import React from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "warning" | "destructive" | "purple" | "blue";
  icon?: string;
}

export function Badge({
  className,
  variant = "default",
  icon,
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20",
    secondary: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700",
    outline: "border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300",
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
    destructive: "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20",
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20",
    blue: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium tracking-tight select-none",
        variants[variant],
        className
      )}
      {...props}
    >
      {icon && <Icon icon={icon} size={13} className="shrink-0" />}
      {children}
    </span>
  );
}
