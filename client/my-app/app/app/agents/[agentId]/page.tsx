"use client";

import React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store/app-store";
import { useToast } from "@/components/ui/toast";
import { formatDate } from "@/lib/utils";

export default function AgentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const agentId = params?.agentId as string;

  const {
    agents,
    runAgentNow,
    toggleAgentStatus,
    deleteAgent,
    skills,
    plugins,
  } = useAppStore();

  const agent = agents.find((a) => a.id === agentId);

  if (!agent) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <Icon icon="solar:danger-circle-bold" size={48} className="text-red-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold">Agent Not Found</h2>
        <p className="text-sm text-slate-500 mt-1">The scheduled agent does not exist.</p>
        <Link href="/app/agents" className="mt-4 inline-block">
          <Button size="sm">Back to Agents</Button>
        </Link>
      </div>
    );
  }

  const handleRunNow = () => {
    runAgentNow(agent.id);
    toast.success(`Agent "${agent.name}" run initiated!`);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this agent?")) {
      deleteAgent(agent.id);
      toast.success("Agent deleted");
      router.push("/app/agents");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/app/agents" className="hover:text-slate-600 dark:hover:text-slate-200">
          Scheduled Agents
        </Link>
        <span>/</span>
        <span className="text-slate-700 dark:text-slate-300 font-medium">{agent.name}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-8 ring-blue-500/5 shrink-0">
            <Icon icon="solar:cpu-bolt-bold-duotone" size={32} />
          </div>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {agent.name}
              </h1>
              <Badge
                variant={
                  agent.status === "active"
                    ? "success"
                    : agent.status === "paused"
                    ? "warning"
                    : "secondary"
                }
                className="capitalize text-xs"
              >
                {agent.status}
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              {agent.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button size="sm" onClick={handleRunNow} leftIcon="solar:play-bold">
            Run Now
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              toggleAgentStatus(agent.id);
              toast.info(agent.status === "active" ? "Agent paused" : "Agent activated");
            }}
          >
            {agent.status === "active" ? "Pause" : "Resume"}
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={handleDelete}
            leftIcon="solar:trash-bin-trash-line-duotone"
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4">
          <span className="text-xs text-slate-400">Schedule</span>
          <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 mt-1">{agent.schedule}</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4">
          <span className="text-xs text-slate-400">Timezone</span>
          <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 mt-1">{agent.timezone}</p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4">
          <span className="text-xs text-slate-400">Last Executed</span>
          <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 mt-1">
            {agent.lastRun ? formatDate(agent.lastRun) : "Never"}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4">
          <span className="text-xs text-slate-400">Success Rate</span>
          <p className="text-xs font-bold text-emerald-500 mt-1">{agent.successRate || 100}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Execution History */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Icon icon="solar:history-bold-duotone" size={18} className="text-blue-500" />
              Execution History & Logs
            </h3>
            <span className="text-xs text-slate-400">
              {agent.executions?.length || 0} recorded runs
            </span>
          </div>

          {agent.executions && agent.executions.length > 0 ? (
            <div className="space-y-3">
              {agent.executions.map((exec) => (
                <div
                  key={exec.id}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 space-y-2.5 text-xs shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                      <span className="font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[10px]">
                        {exec.status}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500">{formatDate(exec.startedAt)}</span>
                    </div>
                    <span className="font-mono text-slate-400 text-[11px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      Duration: {exec.duration}
                    </span>
                  </div>

                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-sans bg-slate-50 dark:bg-slate-850/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                    {exec.output}
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-slate-400 text-[11px]">Tools utilized:</span>
                    <div className="flex flex-wrap gap-1">
                      {exec.toolsUsed.map((tool, i) => (
                        <span
                          key={i}
                          className="rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 text-[10px] font-medium"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-400">
              No executions logged yet. Click &quot;Run Now&quot; to test.
            </div>
          )}
        </div>

        {/* Right: Agent Config Overview */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 space-y-3">
            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Instructions & Prompt
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-mono bg-slate-50 dark:bg-slate-850 p-3 rounded-xl border border-slate-100 dark:border-slate-800 whitespace-pre-wrap">
              {agent.instructions}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 space-y-3">
            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Assigned Skills
            </h4>
            <div className="space-y-1.5">
              {agent.skillIds.map((sid) => {
                const s = skills.find((item) => item.id === sid);
                if (!s) return null;
                return (
                  <div
                    key={sid}
                    className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-xs"
                  >
                    <Icon icon={s.icon} size={16} className="text-blue-500" />
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {s.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 space-y-3">
            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Connected Plugins
            </h4>
            <div className="space-y-1.5">
              {agent.pluginIds.map((pid) => {
                const p = plugins.find((item) => item.id === pid);
                if (!p) return null;
                return (
                  <div
                    key={pid}
                    className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-xs"
                  >
                    <Icon icon={p.icon} size={16} />
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {p.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
