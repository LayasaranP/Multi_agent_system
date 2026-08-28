"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/lib/store/app-store";
import { useToast } from "@/components/ui/toast";
import { Conversation } from "@/lib/types";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const toast = useToast();

  const {
    user,
    conversations,
    activeConversationId,
    setActiveConversationId,
    createConversation,
    renameConversation,
    pinConversation,
    archiveConversation,
    deleteConversation,
    setIsCommandPaletteOpen,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
  } = useAppStore();

  const [editingConvo, setEditingConvo] = useState<{ id: string; title: string } | null>(null);
  const [convoToDelete, setConvoToDelete] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Group conversations by time period
  const groupedConversations = useMemo(() => {
    const now = new Date().getTime();
    const oneDay = 24 * 60 * 60 * 1000;
    const sevenDays = 7 * oneDay;

    const pinned: Conversation[] = [];
    const today: Conversation[] = [];
    const yesterday: Conversation[] = [];
    const previous7Days: Conversation[] = [];
    const older: Conversation[] = [];

    conversations.forEach((convo) => {
      if (convo.pinned) {
        pinned.push(convo);
        return;
      }
      const convoTime = new Date(convo.createdAt).getTime();
      const diff = now - convoTime;

      if (diff < oneDay) {
        today.push(convo);
      } else if (diff < 2 * oneDay) {
        yesterday.push(convo);
      } else if (diff < sevenDays) {
        previous7Days.push(convo);
      } else {
        older.push(convo);
      }
    });

    return { pinned, today, yesterday, previous7Days, older };
  }, [conversations]);

  const navItems = [
    { label: "AI Chat", href: "/app", icon: "solar:chat-round-line-bold-duotone" },
    { label: "Skills", href: "/app/skills", icon: "solar:magic-stick-3-bold-duotone" },
    { label: "Plugins", href: "/app/plugins", icon: "solar:plug-circle-bold-duotone" },
    { label: "Agents", href: "/app/agents", icon: "solar:cpu-bolt-bold-duotone" },
    { label: "Tasks", href: "/app/tasks", icon: "solar:checklist-minimalistic-bold-duotone" },
  ];

  const handleNewChat = () => {
    const convo = createConversation("New Chat");
    router.push(`/app/chat/${convo.id}`);
  };

  const handleSaveRename = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingConvo && editingConvo.title.trim()) {
      renameConversation(editingConvo.id, editingConvo.title.trim());
      setEditingConvo(null);
      toast.success("Conversation renamed");
    }
  };

  const confirmDelete = () => {
    if (convoToDelete) {
      deleteConversation(convoToDelete);
      setConvoToDelete(null);
      toast.success("Conversation deleted");
      if (pathname.includes(convoToDelete)) {
        router.push("/app");
      }
    }
  };

  const renderConvoItem = (convo: Conversation) => {
    const isActive =
      pathname === `/app/chat/${convo.id}` ||
      (pathname === "/app" && activeConversationId === convo.id);

    return (
      <div
        key={convo.id}
        className={cn(
          "group relative flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors select-none cursor-pointer",
          isActive
            ? "bg-blue-600/10 text-blue-600 dark:text-blue-400 font-medium"
            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200"
        )}
      >
        <Link
          href={`/app/chat/${convo.id}`}
          onClick={() => setActiveConversationId(convo.id)}
          className="flex-1 truncate pr-2 flex items-center gap-2"
        >
          {convo.pinned && (
            <Icon
              icon="solar:pin-bold"
              size={12}
              className="text-amber-500 shrink-0 rotate-45"
            />
          )}
          <span className="truncate">{convo.title}</span>
        </Link>

        {/* Actions button */}
        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            aria-label="Conversation actions"
            onClick={(e) => {
              e.stopPropagation();
              setOpenMenuId(openMenuId === convo.id ? null : convo.id);
            }}
            className="rounded p-1 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <Icon icon="solar:menu-dots-bold" size={13} />
          </button>

          {/* Context Dropdown */}
          {openMenuId === convo.id && (
            <div
              className="absolute right-0 top-7 z-30 w-36 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-1 shadow-xl text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => {
                  setEditingConvo({ id: convo.id, title: convo.title });
                  setOpenMenuId(null);
                }}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Icon icon="solar:pen-line-duotone" size={13} />
                Rename
              </button>
              <button
                type="button"
                onClick={() => {
                  pinConversation(convo.id);
                  setOpenMenuId(null);
                  toast.info(convo.pinned ? "Conversation unpinned" : "Conversation pinned");
                }}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Icon icon="solar:pin-bold" size={13} />
                {convo.pinned ? "Unpin" : "Pin"}
              </button>
              <button
                type="button"
                onClick={() => {
                  archiveConversation(convo.id);
                  setOpenMenuId(null);
                  toast.info("Conversation archived");
                }}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Icon icon="solar:archive-line-duotone" size={13} />
                Archive
              </button>
              <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
              <button
                type="button"
                onClick={() => {
                  setConvoToDelete(convo.id);
                  setOpenMenuId(null);
                }}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
              >
                <Icon icon="solar:trash-bin-trash-line-duotone" size={13} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <aside
        className={cn(
          "hidden md:flex flex-col h-screen border-r border-slate-200 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/80 backdrop-blur-xl transition-all duration-200 shrink-0 select-none",
          isSidebarCollapsed ? "w-16" : "w-64 lg:w-72"
        )}
      >
        {/* Top Header */}
        <div className="flex h-14 items-center justify-between px-3.5 border-b border-slate-200/80 dark:border-slate-800/80 shrink-0">
          <Link href="/" className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20 shrink-0">
              <Icon icon="solar:atom-bold" size={20} />
            </div>
            {!isSidebarCollapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white leading-none">
                  Apex Agents
                </span>
                <span className="text-[10px] text-blue-500 font-semibold tracking-wider uppercase mt-0.5">
                  Autonomous AI
                </span>
              </div>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            aria-label="Toggle sidebar"
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
          >
            <Icon
              icon={isSidebarCollapsed ? "solar:sidebar-minimalistic-outline" : "solar:sidebar-minimalistic-line-duotone"}
              size={18}
            />
          </button>
        </div>

        {/* Main Action Buttons */}
        <div className="p-3 space-y-2 shrink-0">
          <Button
            onClick={handleNewChat}
            variant="primary"
            size="sm"
            className="w-full justify-start shadow-sm"
            leftIcon="solar:add-circle-bold"
          >
            {!isSidebarCollapsed && <span>New Chat</span>}
          </Button>

          {!isSidebarCollapsed && (
            <button
              type="button"
              onClick={() => setIsCommandPaletteOpen(true)}
              className="flex w-full items-center justify-between rounded-lg border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 px-3 py-1.5 text-xs text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Icon icon="solar:magnifer-line-duotone" size={14} />
                Search conversations...
              </span>
              <kbd className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-500">
                ⌘K
              </kbd>
            </button>
          )}
        </div>

        {/* Primary Navigation */}
        <nav className="px-2 py-1 space-y-0.5 shrink-0 border-b border-slate-200/60 dark:border-slate-800/60">
          {navItems.map((item) => {
            const isActive =
              item.href === "/app"
                ? pathname === "/app" || pathname.startsWith("/app/chat")
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all select-none",
                  isActive
                    ? "bg-slate-200/80 text-blue-600 dark:bg-slate-800 dark:text-blue-400 font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100"
                )}
              >
                <Icon icon={item.icon} size={18} />
                {!isSidebarCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Chat History Section */}
        {!isSidebarCollapsed && (
          <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4 pr-1">
            {groupedConversations.pinned.length > 0 && (
              <div>
                <div className="px-2 pb-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Pinned
                </div>
                <div className="space-y-0.5">{groupedConversations.pinned.map(renderConvoItem)}</div>
              </div>
            )}

            {groupedConversations.today.length > 0 && (
              <div>
                <div className="px-2 pb-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Today
                </div>
                <div className="space-y-0.5">{groupedConversations.today.map(renderConvoItem)}</div>
              </div>
            )}

            {groupedConversations.yesterday.length > 0 && (
              <div>
                <div className="px-2 pb-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Yesterday
                </div>
                <div className="space-y-0.5">{groupedConversations.yesterday.map(renderConvoItem)}</div>
              </div>
            )}

            {groupedConversations.previous7Days.length > 0 && (
              <div>
                <div className="px-2 pb-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Previous 7 Days
                </div>
                <div className="space-y-0.5">
                  {groupedConversations.previous7Days.map(renderConvoItem)}
                </div>
              </div>
            )}

            {groupedConversations.older.length > 0 && (
              <div>
                <div className="px-2 pb-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Older
                </div>
                <div className="space-y-0.5">{groupedConversations.older.map(renderConvoItem)}</div>
              </div>
            )}

            {conversations.length === 0 && (
              <div className="py-6 text-center text-xs text-slate-400">
                No chat history yet.
              </div>
            )}
          </div>
        )}

        {/* Collapsed spacer */}
        {isSidebarCollapsed && <div className="flex-1" />}

        {/* Footer User & Settings */}
        <div className="p-2.5 border-t border-slate-200/80 dark:border-slate-800/80 shrink-0">
          <Link
            href="/app/settings/profile"
            className={cn(
              "flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-colors",
              isSidebarCollapsed ? "justify-center" : ""
            )}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs ring-2 ring-blue-500/20 shrink-0">
              {user.name ? user.name[0] : "U"}
            </div>

            {!isSidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="truncate text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {user.name}
                  </p>
                  <span className="rounded bg-blue-500/10 px-1.5 py-0.5 text-[9px] font-bold text-blue-600 dark:text-blue-400">
                    {user.plan}
                  </span>
                </div>
                <p className="truncate text-[11px] text-slate-400 dark:text-slate-500">
                  {user.email}
                </p>
              </div>
            )}
          </Link>
        </div>
      </aside>

      {/* Rename Conversation Dialog */}
      <Modal
        isOpen={!!editingConvo}
        onClose={() => setEditingConvo(null)}
        title="Rename Conversation"
        size="sm"
      >
        <form onSubmit={handleSaveRename} className="space-y-4">
          <Input
            value={editingConvo?.title || ""}
            onChange={(e) =>
              setEditingConvo((prev) => (prev ? { ...prev, title: e.target.value } : null))
            }
            autoFocus
            placeholder="Conversation title..."
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setEditingConvo(null)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Modal
        isOpen={!!convoToDelete}
        onClose={() => setConvoToDelete(null)}
        title="Delete Conversation"
        description="Are you sure you want to delete this conversation? This action cannot be undone."
        size="sm"
      >
        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setConvoToDelete(null)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={confirmDelete}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </>
  );
}
