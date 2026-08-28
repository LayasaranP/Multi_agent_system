"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "link";
  size?: "xs" | "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  leftIcon?: string;
  rightIcon?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none cursor-pointer";

    const variants = {
      primary:
        "bg-blue-600 hover:bg-blue-500 text-white shadow-sm hover:shadow active:bg-blue-700",
      secondary:
        "bg-slate-100 hover:bg-slate-200 text-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100",
      outline:
        "border border-slate-200 hover:bg-slate-100/70 text-slate-800 dark:border-slate-800 dark:hover:bg-slate-800/60 dark:text-slate-200",
      ghost:
        "hover:bg-slate-100 text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800/70",
      destructive:
        "bg-red-600 hover:bg-red-500 text-white shadow-sm active:bg-red-700",
      link: "text-blue-600 dark:text-blue-400 underline-offset-4 hover:underline p-0 h-auto",
    };

    const sizes = {
      xs: "text-xs px-2.5 py-1 gap-1.5 h-7",
      sm: "text-xs px-3 py-1.5 gap-1.5 h-8",
      md: "text-sm px-4 py-2 gap-2 h-9.5",
      lg: "text-base px-5 py-2.5 gap-2.5 h-11",
      icon: "h-9 w-9 p-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <Icon icon="solar:spinner-line-duotone" className="animate-spin text-current" size={16} />
        ) : leftIcon ? (
          <Icon icon={leftIcon} size={16} />
        ) : null}
        {children}
        {!isLoading && rightIcon && <Icon icon={rightIcon} size={16} />}
      </button>
    );
  }
);

Button.displayName = "Button";
