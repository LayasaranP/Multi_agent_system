"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Task } from "@/lib/types";
import { useAppStore } from "@/lib/store/app-store";
import { formatDate } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const router = useRouter();
  const { createConversation, skills, plugins } = useAppStore();

  const statusColors = {
    draft: "secondary",
    queued: "outline",
    running: "warning",
    completed: "success",
    failed: "destructive",
    cancelled: "secondary",
  } as const;

  const priorityColors = {
    low: "text-slate-500 bg-slate-100 dark:bg-slate-800",
    medium: "text-blue-600 bg-blue-500/10",
    high: "text-amber-600 bg-amber-500/10",
    urgent: "text-red-600 bg-red-500/10",
  };

  const handleContinueInChat = () => {
    const newConvo = createConversation(`Task: ${task.title}`, task.skillIds, task.pluginIds);
    router.push(`/app/chat/${newConvo.id}`);
  };

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 p-5 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all group">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <Badge variant={statusColors[task.status]} className="capitalize text-[10px]">
            {task.status}
          </Badge>

          <span
            className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${priorityColors[task.priority]}`}
          >
            {task.priority}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {task.title}
        </h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {task.description}
        </p>

        {/* Progress Bar */}
        <div className="mt-4 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Execution Progress</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {task.progress}%
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                task.status === "completed"
                  ? "bg-emerald-500"
                  : task.status === "failed"
                  ? "bg-red-500"
                  : "bg-blue-600"
              }`}
              style={{ width: `${task.progress}%` }}
            />
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-4">
          {task.skillIds?.map((sid) => {
            const s = skills.find((item) => item.id === sid);
            if (!s) return null;
            return (
              <span
                key={sid}
                className="inline-flex items-center gap-1 rounded bg-blue-500/10 px-2 py-0.5 text-[9px] font-semibold text-blue-600 dark:text-blue-400"
              >
                <Icon icon={s.icon} size={11} />
                {s.name}
              </span>
            );
          })}
          {task.pluginIds?.map((pid) => {
            const p = plugins.find((item) => item.id === pid);
            if (!p) return null;
            return (
              <span
                key={pid}
                className="inline-flex items-center gap-1 rounded bg-purple-500/10 px-2 py-0.5 text-[9px] font-semibold text-purple-600 dark:text-purple-400"
              >
                <Icon icon={p.icon} size={11} />
                {p.name}
              </span>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs">
        <span className="text-[11px] text-slate-400">
          {task.dueDate ? `Due ${task.dueDate}` : `Created ${formatDate(task.createdAt)}`}
        </span>

        <div className="flex items-center gap-2">
          <Button
            size="xs"
            variant="ghost"
            onClick={handleContinueInChat}
            leftIcon="solar:chat-round-line-bold-duotone"
          >
            Chat
          </Button>

          <Link href={`/app/tasks/${task.id}`}>
            <Button size="xs" variant="primary">
              View Result
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
