"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";
import { useAppStore } from "@/lib/store/app-store";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileDrawer({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const { user, conversations, setActiveConversationId } = useAppStore();

  if (!isOpen) return null;

  const navItems = [
    { label: "AI Chat", href: "/app", icon: "solar:chat-round-line-bold-duotone" },
    { label: "Skills", href: "/app/skills", icon: "solar:magic-stick-3-bold-duotone" },
    { label: "Plugins", href: "/app/plugins", icon: "solar:plug-circle-bold-duotone" },
    { label: "Agents", href: "/app/agents", icon: "solar:cpu-bolt-bold-duotone" },
    { label: "Tasks", href: "/app/tasks", icon: "solar:checklist-minimalistic-bold-duotone" },
    { label: "Settings", href: "/app/settings/profile", icon: "solar:settings-bold-duotone" },
  ];

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative z-10 w-72 max-w-[85vw] bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full shadow-2xl animate-in slide-in-from-left duration-200">
        <div className="flex h-14 items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white font-bold">
              <Icon icon="solar:atom-bold" size={20} />
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-white">Apex Agents</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <Icon icon="solar:close-circle-line-duotone" size={20} />
          </button>
        </div>

        {/* Links */}
        <div className="p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href === "/app" && pathname.startsWith("/app/chat"));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors",
                  isActive
                    ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >
                <Icon icon={item.icon} size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto px-3 py-2 border-t border-slate-100 dark:border-slate-800">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">
            Recent Chats
          </div>
          <div className="space-y-1">
            {conversations.slice(0, 8).map((c) => (
              <Link
                key={c.id}
                href={`/app/chat/${c.id}`}
                onClick={() => {
                  setActiveConversationId(c.id);
                  onClose();
                }}
                className="block truncate px-2.5 py-1.5 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {c.title}
              </Link>
            ))}
          </div>
        </div>

        {/* User */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xs">
              {user.name ? user.name[0] : "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                {user.name}
              </p>
              <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MobileBottomBar() {
  const pathname = usePathname();

  const items = [
    { label: "Chat", href: "/app", icon: "solar:chat-round-line-bold-duotone" },
    { label: "Skills", href: "/app/skills", icon: "solar:magic-stick-3-bold-duotone" },
    { label: "Plugins", href: "/app/plugins", icon: "solar:plug-circle-bold-duotone" },
    { label: "Agents", href: "/app/agents", icon: "solar:cpu-bolt-bold-duotone" },
    { label: "Tasks", href: "/app/tasks", icon: "solar:checklist-minimalistic-bold-duotone" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden flex items-center justify-around border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg px-2 py-1.5 shadow-lg">
      {items.map((item) => {
        const isActive =
          item.href === "/app"
            ? pathname === "/app" || pathname.startsWith("/app/chat")
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center py-1 px-3 rounded-lg text-[10px] transition-colors",
              isActive
                ? "text-blue-600 dark:text-blue-400 font-semibold"
                : "text-slate-500 dark:text-slate-400"
            )}
          >
            <Icon icon={item.icon} size={20} className="mb-0.5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
