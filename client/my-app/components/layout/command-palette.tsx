"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";
import { useAppStore } from "@/lib/store/app-store";
import { useTheme } from "@/components/theme-provider";

export function CommandPalette() {
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    createConversation,
    setIsTaskModalOpen,
    conversations,
    skills,
    plugins,
  } = useAppStore();

  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Global hotkey listener (⌘K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen(!isCommandPaletteOpen);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  const actions = useMemo(() => {
    const items = [
      {
        id: "new_chat",
        title: "New AI Chat",
        category: "Actions",
        icon: "solar:chat-round-line-bold-duotone",
        run: () => {
          const c = createConversation("New Chat");
          router.push(`/app/chat/${c.id}`);
        },
      },
      {
        id: "create_task",
        title: "Create Task",
        category: "Actions",
        icon: "solar:checklist-minimalistic-bold-duotone",
        run: () => setIsTaskModalOpen(true),
      },
      {
        id: "create_agent",
        title: "Create Scheduled Agent",
        category: "Actions",
        icon: "solar:cpu-bolt-bold-duotone",
        run: () => router.push("/app/agents/new"),
      },
      {
        id: "create_skill",
        title: "Create Custom Skill",
        category: "Actions",
        icon: "solar:magic-stick-3-bold-duotone",
        run: () => router.push("/app/skills/new"),
      },
      {
        id: "toggle_theme",
        title: `Switch to ${resolvedTheme === "dark" ? "Light" : "Dark"} Mode`,
        category: "Preferences",
        icon: resolvedTheme === "dark" ? "solar:sun-2-bold-duotone" : "solar:moon-stars-bold-duotone",
        run: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
      },
      {
        id: "nav_skills",
        title: "Explore Skills Marketplace",
        category: "Navigation",
        icon: "solar:widget-2-bold-duotone",
        run: () => router.push("/app/skills"),
      },
      {
        id: "nav_plugins",
        title: "Browse Connected Plugins",
        category: "Navigation",
        icon: "solar:plug-circle-bold-duotone",
        run: () => router.push("/app/plugins"),
      },
      {
        id: "nav_tasks",
        title: "View Tasks Execution",
        category: "Navigation",
        icon: "solar:checklist-minimalistic-bold-duotone",
        run: () => router.push("/app/tasks"),
      },
      {
        id: "nav_settings",
        title: "Workspace Settings",
        category: "Navigation",
        icon: "solar:settings-bold-duotone",
        run: () => router.push("/app/settings/profile"),
      },
    ];

    // Add recent conversations
    conversations.slice(0, 4).forEach((c) => {
      items.push({
        id: `convo_${c.id}`,
        title: c.title,
        category: "Conversations",
        icon: "solar:chat-line-linear",
        run: () => router.push(`/app/chat/${c.id}`),
      });
    });

    // Add skills
    skills.slice(0, 3).forEach((s) => {
      items.push({
        id: `skill_${s.id}`,
        title: `Skill: ${s.name}`,
        category: "Skills",
        icon: s.icon,
        run: () => router.push(`/app/skills/${s.id}`),
      });
    });

    // Add plugins
    plugins.slice(0, 3).forEach((p) => {
      items.push({
        id: `plugin_${p.id}`,
        title: `Plugin: ${p.name}`,
        category: "Plugins",
        icon: p.icon,
        run: () => router.push("/app/plugins"),
      });
    });

    return items;
  }, [conversations, skills, plugins, resolvedTheme, createConversation, router, setIsTaskModalOpen, setTheme]);

  const filteredActions = useMemo(() => {
    if (!query.trim()) return actions;
    return actions.filter(
      (a) =>
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.category.toLowerCase().includes(query.toLowerCase())
    );
  }, [actions, query]);

  const handleSelect = useCallback(
    (index: number) => {
      const selected = filteredActions[index];
      if (selected) {
        setIsCommandPaletteOpen(false);
        setQuery("");
        selected.run();
      }
    },
    [filteredActions, setIsCommandPaletteOpen]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredActions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredActions.length) % filteredActions.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSelect(selectedIndex);
    } else if (e.key === "Escape") {
      setIsCommandPaletteOpen(false);
    }
  };

  if (!isCommandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCommandPaletteOpen(false)}
      />

      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden animate-in zoom-in-95"
      >
        {/* Search Input */}
        <div className="flex items-center px-4 border-b border-slate-100 dark:border-slate-800">
          <Icon icon="solar:magnifer-line-duotone" size={18} className="text-slate-400 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            autoFocus
            placeholder="Type a command or search..."
            className="h-12 w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
          />
          <kbd className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2">
          {filteredActions.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching commands or resources found.
            </div>
          ) : (
            filteredActions.map((action, i) => {
              const isSelected = i === selectedIndex;
              return (
                <div
                  key={action.id}
                  onClick={() => handleSelect(i)}
                  onMouseEnter={() => setSelectedIndex(i)}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-3 py-2 text-xs transition-colors cursor-pointer select-none",
                    isSelected
                      ? "bg-blue-600 text-white"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      icon={action.icon}
                      size={16}
                      className={isSelected ? "text-white" : "text-blue-500"}
                    />
                    <span className="font-medium">{action.title}</span>
                  </div>
                  <span
                    className={cn(
                      "text-[10px] uppercase tracking-wider font-semibold",
                      isSelected ? "text-blue-100" : "text-slate-400"
                    )}
                  >
                    {action.category}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 px-4 py-2 text-[10px] text-slate-400 bg-slate-50 dark:bg-slate-950/40">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="font-mono font-semibold">↑</kbd> <kbd className="font-mono font-semibold">↓</kbd> to navigate
            </span>
            <span>
              <kbd className="font-mono font-semibold">↵</kbd> to select
            </span>
          </div>
          <span>Apex Workspace</span>
        </div>
      </div>
    </div>
  );
}
