"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn, formatDate } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/theme-provider";
import { useAppStore } from "@/lib/store/app-store";

interface TopbarProps {
  onOpenMobileMenu?: () => void;
}

export function Topbar({ onOpenMobileMenu }: TopbarProps) {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const {
    unreadCount,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setIsTaskModalOpen,
    setIsCommandPaletteOpen,
    selectedModel,
    setSelectedModel,
  } = useAppStore();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);

  const availableModels = [
    { name: "Claude 3.7 Sonnet", provider: "Anthropic", tag: "Thinking" },
    { name: "GPT-4o", provider: "OpenAI", tag: "Omni" },
    { name: "Gemini 2.0 Flash", provider: "Google", tag: "Fast" },
    { name: "DeepSeek R1", provider: "DeepSeek", tag: "Reasoning" },
  ];

  // Derive breadcrumb label
  const getPageTitle = () => {
    if (pathname.startsWith("/app/chat")) return "AI Chat Workspace";
    if (pathname.startsWith("/app/skills/new")) return "Create Custom Skill";
    if (pathname.startsWith("/app/skills")) return "Skills Marketplace";
    if (pathname.startsWith("/app/plugins")) return "Plugins & Integrations";
    if (pathname.startsWith("/app/agents/new")) return "Create Scheduled Agent";
    if (pathname.startsWith("/app/agents")) return "Scheduled Agents";
    if (pathname.startsWith("/app/tasks/new")) return "Create Task";
    if (pathname.startsWith("/app/tasks")) return "Task Execution";
    if (pathname.startsWith("/app/search")) return "Global Search";
    if (pathname.startsWith("/app/settings")) return "Workspace Settings";
    return "AI Chat Workspace";
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 px-4 sm:px-6 backdrop-blur-md">
      {/* Left Title & Mobile Toggle */}
      <div className="flex items-center gap-3">
        {onOpenMobileMenu && (
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="rounded-lg p-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 md:hidden hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Open navigation menu"
          >
            <Icon icon="solar:hamburger-menu-linear" size={20} />
          </button>
        )}

        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {getPageTitle()}
          </span>

          {/* Model badge dropdown in chat view */}
          {pathname.startsWith("/app") && !pathname.startsWith("/app/settings") && (
            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setIsModelMenuOpen(!isModelMenuOpen)}
                className="flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/70 px-2.5 py-0.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                <Icon icon="solar:stars-bold" size={13} className="text-blue-500" />
                <span>{selectedModel}</span>
                <Icon icon="solar:alt-arrow-down-linear" size={11} className="text-slate-400" />
              </button>

              {isModelMenuOpen && (
                <div className="absolute left-0 mt-2 z-40 w-56 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 shadow-2xl animate-in zoom-in-95">
                  <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Select AI Engine
                  </div>
                  {availableModels.map((m) => (
                    <button
                      key={m.name}
                      type="button"
                      onClick={() => {
                        setSelectedModel(m.name);
                        setIsModelMenuOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors text-left",
                        selectedModel === m.name
                          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      )}
                    >
                      <div>
                        <div>{m.name}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{m.provider}</div>
                      </div>
                      <span className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[9px] text-slate-500 font-mono">
                        {m.tag}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Search trigger button */}
        <button
          type="button"
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 px-2.5 py-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          title="Search or Run Command (⌘K)"
        >
          <Icon icon="solar:magnifer-line-duotone" size={15} />
          <span className="hidden sm:inline">Commands</span>
          <kbd className="hidden sm:inline rounded bg-slate-200/60 dark:bg-slate-800 px-1.5 py-0.2 font-mono text-[9px] text-slate-500">
            ⌘K
          </kbd>
        </button>

        {/* Quick Create Task */}
        <Button
          size="xs"
          variant="secondary"
          onClick={() => setIsTaskModalOpen(true)}
          leftIcon="solar:checklist-minimalistic-bold-duotone"
          className="hidden sm:inline-flex"
        >
          Create Task
        </Button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            aria-label="Notifications"
            className="relative rounded-lg p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Icon icon="solar:bell-bing-bold-duotone" size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 z-50 w-80 sm:w-96 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl p-3 animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 px-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    Notifications
                  </h4>
                  {unreadCount > 0 && (
                    <Badge variant="default" className="text-[10px] px-1.5">
                      {unreadCount} new
                    </Badge>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 mt-1">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markNotificationRead(notif.id)}
                    className={cn(
                      "p-2.5 transition-colors cursor-pointer rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50",
                      !notif.read ? "bg-blue-50/40 dark:bg-blue-950/20" : ""
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5">
                        <Icon
                          icon={
                            notif.type === "task_completed"
                              ? "solar:check-circle-bold"
                              : notif.type === "agent_completed"
                              ? "solar:cpu-bolt-bold"
                              : "solar:info-circle-bold"
                          }
                          size={15}
                          className="text-blue-500 shrink-0"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">
                            {notif.title}
                          </p>
                          <span className="text-[10px] text-slate-400">
                            {formatDate(notif.createdAt)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                          {notif.message}
                        </p>
                        {notif.link && (
                          <Link
                            href={notif.link}
                            onClick={() => setIsNotifOpen(false)}
                            className="inline-block mt-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            View details →
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
          className="rounded-lg p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Icon
            icon={
              resolvedTheme === "dark"
                ? "solar:sun-2-bold-duotone"
                : "solar:moon-stars-bold-duotone"
            }
            size={18}
          />
        </button>
      </div>
    </header>
  );
}
