"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Agent } from "@/lib/types";
import { useAppStore } from "@/lib/store/app-store";
import { useToast } from "@/components/ui/toast";
import { formatDate } from "@/lib/utils";

interface AgentCardProps {
  agent: Agent;
}

export function AgentCard({ agent }: AgentCardProps) {
  const toast = useToast();
  const { toggleAgentStatus, runAgentNow, skills, plugins } = useAppStore();

  const handleRunNow = () => {
    runAgentNow(agent.id);
    toast.success(`Triggered manual execution for "${agent.name}"`);
  };

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 p-5 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all group">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
            <Icon icon="solar:cpu-bolt-bold-duotone" size={24} />
          </div>

          <Badge
            variant={
              agent.status === "active"
                ? "success"
                : agent.status === "paused"
                ? "warning"
                : "secondary"
            }
            className="capitalize text-[10px]"
          >
            {agent.status}
          </Badge>
        </div>

        {/* Name & Description */}
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {agent.name}
        </h3>
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {agent.description}
        </p>

        {/* Schedule & Timing */}
        <div className="mt-4 rounded-xl bg-slate-50 dark:bg-slate-850 p-2.5 border border-slate-100 dark:border-slate-800 text-[11px] space-y-1">
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
            <Icon icon="solar:clock-circle-bold-duotone" size={14} className="text-blue-500 shrink-0" />
            <span className="truncate">{agent.schedule}</span>
          </div>
          <div className="flex items-center justify-between text-slate-400 text-[10px]">
            <span>Last: {agent.lastRun ? formatDate(agent.lastRun) : "Never"}</span>
            <span>Success: {agent.successRate || 100}%</span>
          </div>
        </div>

        {/* Skills & Plugins tags */}
        <div className="flex flex-wrap gap-1 mt-3">
          {agent.skillIds.map((sid) => {
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
          {agent.pluginIds.map((pid) => {
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

      {/* Actions */}
      <div className="flex items-center gap-2 pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80">
        <Button
          size="xs"
          variant="primary"
          onClick={handleRunNow}
          leftIcon="solar:play-bold"
          className="flex-1"
        >
          Run Now
        </Button>

        <Button
          size="xs"
          variant="outline"
          onClick={() => {
            toggleAgentStatus(agent.id);
            toast.info(agent.status === "active" ? "Agent paused" : "Agent activated");
          }}
          leftIcon={agent.status === "active" ? "solar:pause-bold" : "solar:play-circle-bold"}
        >
          {agent.status === "active" ? "Pause" : "Resume"}
        </Button>

        <Link href={`/app/agents/${agent.id}`}>
          <Button size="xs" variant="ghost" className="px-2">
            <Icon icon="solar:arrow-right-linear" size={14} />
          </Button>
        </Link>
      </div>
    </div>
  );
}
