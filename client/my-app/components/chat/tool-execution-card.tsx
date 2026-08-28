"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";
import { ToolExecution } from "@/lib/types";

interface ToolExecutionCardProps {
  tool: ToolExecution;
}

export function ToolExecutionCard({ tool }: ToolExecutionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusIcons = {
    pending: "solar:clock-circle-line-duotone",
    running: "solar:spinner-line-duotone",
    completed: "solar:check-circle-bold",
    failed: "solar:danger-circle-bold",
  };

  const statusColors = {
    pending: "text-slate-400 bg-slate-100 dark:bg-slate-800",
    running: "text-blue-500 bg-blue-500/10 animate-spin",
    completed: "text-emerald-500 bg-emerald-500/10",
    failed: "text-red-500 bg-red-500/10",
  };

  return (
    <div className="rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/50 overflow-hidden text-xs my-2 transition-all">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between p-2.5 cursor-pointer hover:bg-slate-100/60 dark:hover:bg-slate-800/40 select-none"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={cn("flex h-6 w-6 items-center justify-center rounded-md shrink-0", statusColors[tool.status])}>
            <Icon icon={statusIcons[tool.status]} size={14} />
          </div>

          {tool.icon && (
            <Icon icon={tool.icon} size={15} className="shrink-0 text-slate-500" />
          )}

          <div className="truncate">
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {tool.name}
            </span>
            <span className="mx-1.5 text-slate-400">•</span>
            <span className="text-slate-500 dark:text-slate-400 truncate">
              {tool.stepDescription}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-2">
          {tool.durationMs && (
            <span className="text-[10px] text-slate-400 font-mono">
              {tool.durationMs}ms
            </span>
          )}
          <Icon
            icon={isExpanded ? "solar:alt-arrow-up-linear" : "solar:alt-arrow-down-linear"}
            size={13}
            className="text-slate-400"
          />
        </div>
      </div>

      {isExpanded && (
        <div className="px-3 pb-3 pt-1 border-t border-slate-200/60 dark:border-slate-800/60 space-y-2 bg-white/50 dark:bg-slate-950/40 font-mono text-[11px]">
          <div>
            <span className="text-slate-400">Context Source: </span>
            <span className="text-slate-700 dark:text-slate-300 font-medium">
              {tool.skillOrPlugin || "Autonomous Core"}
            </span>
          </div>
          <div>
            <span className="text-slate-400">Status: </span>
            <span
              className={cn(
                "capitalize font-medium",
                tool.status === "completed" ? "text-emerald-500" : "text-blue-500"
              )}
            >
              {tool.status}
            </span>
          </div>
          <div>
            <span className="text-slate-400">Timestamp: </span>
            <span className="text-slate-600 dark:text-slate-400">{tool.timestamp}</span>
          </div>
        </div>
      )}
    </div>
  );
}
