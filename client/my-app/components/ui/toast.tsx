"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: string;
  title?: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: {
    success: (message: string, title?: string) => void;
    error: (message: string, title?: string) => void;
    info: (message: string, title?: string) => void;
    warning: (message: string, title?: string) => void;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (type: ToastType, message: string, title?: string) => {
      const id = `toast_${Date.now()}_${Math.random()}`;
      const newToast: ToastItem = { id, type, message, title };
      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        removeToast(id);
      }, 4000);
    },
    [removeToast]
  );

  const toast = {
    success: (message: string, title?: string) => addToast("success", message, title),
    error: (message: string, title?: string) => addToast("error", message, title),
    info: (message: string, title?: string) => addToast("info", message, title),
    warning: (message: string, title?: string) => addToast("warning", message, title),
  };

  const icons: Record<ToastType, string> = {
    success: "solar:check-circle-bold",
    error: "solar:danger-circle-bold",
    info: "solar:info-circle-bold",
    warning: "solar:shield-warning-bold",
  };

  const colors: Record<ToastType, string> = {
    success: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    error: "text-red-500 bg-red-500/10 border-red-500/20",
    info: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    warning: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="alert"
            className={cn(
              "pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg backdrop-blur-md bg-white/95 dark:bg-slate-900/95 transition-all duration-200 animate-in slide-in-from-bottom-3",
              colors[t.type]
            )}
          >
            <Icon icon={icons[t.type]} size={20} className="shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              {t.title && (
                <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  {t.title}
                </h4>
              )}
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed break-words">
                {t.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 transition-colors"
            >
              <Icon icon="solar:close-circle-line-duotone" size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      success: (message: string, title?: string) => {
        if (typeof window !== "undefined") console.log("[Toast Success]", title, message);
      },
      error: (message: string, title?: string) => {
        if (typeof window !== "undefined") console.error("[Toast Error]", title, message);
      },
      info: (message: string, title?: string) => {
        if (typeof window !== "undefined") console.info("[Toast Info]", title, message);
      },
      warning: (message: string, title?: string) => {
        if (typeof window !== "undefined") console.warn("[Toast Warning]", title, message);
      },
    };
  }
  return context.toast;
}
