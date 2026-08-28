"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: string;
  rightIcon?: string;
  onRightIconClick?: () => void;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, leftIcon, rightIcon, onRightIconClick, error, disabled, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative flex items-center w-full">
          {leftIcon && (
            <span className="absolute left-3 text-slate-400 dark:text-slate-500 pointer-events-none flex items-center">
              <Icon icon={leftIcon} size={16} />
            </span>
          )}
          <input
            ref={ref}
            disabled={disabled}
            className={cn(
              "w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
              leftIcon && "pl-9",
              rightIcon && "pr-9",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <button
              type="button"
              onClick={onRightIconClick}
              disabled={disabled}
              className={cn(
                "absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors",
                !onRightIconClick && "pointer-events-none"
              )}
            >
              <Icon icon={rightIcon} size={16} />
            </button>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
