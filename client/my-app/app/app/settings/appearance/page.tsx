"use client";

import React, { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { useTheme } from "@/components/theme-provider";
import { useToast } from "@/components/ui/toast";

export default function AppearanceSettingsPage() {
  const toast = useToast();
  const { theme, setTheme } = useTheme();
  const [density, setDensity] = useState<"comfortable" | "compact">("comfortable");

  const themes = [
    {
      id: "light" as const,
      name: "Light Theme",
      desc: "Clean, high-contrast daylight surfaces.",
      icon: "solar:sun-2-bold-duotone",
    },
    {
      id: "dark" as const,
      name: "Dark Theme (Default)",
      desc: "Deep obsidian slate with reduced eye fatigue.",
      icon: "solar:moon-stars-bold-duotone",
    },
    {
      id: "system" as const,
      name: "Sync with OS",
      desc: "Automatically adapts to your operating system preference.",
      icon: "solar:display-bold-duotone",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 space-y-6">
      <div>
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
          Interface & Visual Theme
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Select an aesthetic that matches your workspace preferences.
        </p>
      </div>

      {/* Theme Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {themes.map((t) => {
          const isSelected = theme === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setTheme(t.id);
                toast.success(`Theme updated to ${t.name}`);
              }}
              className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? "border-blue-600 bg-blue-500/10 dark:bg-blue-950/20 ring-2 ring-blue-500/20"
                  : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-blue-500">
                  <Icon icon={t.icon} size={20} />
                </div>
                {isSelected && (
                  <Icon icon="solar:check-circle-bold" size={18} className="text-blue-600" />
                )}
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                {t.name}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {t.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Workspace Density */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
        <div>
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
            Workspace Density
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Adjust message padding and list spacing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {(["comfortable", "compact"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => {
                setDensity(mode);
                toast.info(`Density set to ${mode}`);
              }}
              className={`px-4 py-2 rounded-xl border text-xs font-semibold capitalize transition-all ${
                density === mode
                  ? "border-blue-600 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                  : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
