"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/empty-state";
import { AgentCard } from "@/components/agents/agent-card";
import { useAppStore } from "@/lib/store/app-store";

export default function AgentsPage() {
  const router = useRouter();
  const { agents } = useAppStore();
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { id: "all", label: "All Agents", count: agents.length },
    { id: "active", label: "Active", count: agents.filter((a) => a.status === "active").length },
    { id: "paused", label: "Paused", count: agents.filter((a) => a.status === "paused").length },
    { id: "draft", label: "Drafts", count: agents.filter((a) => a.status === "draft").length },
  ];

  const filteredAgents = agents.filter((a) => {
    if (activeTab === "all") return true;
    return a.status === activeTab;
  });

  const activeCount = agents.filter((a) => a.status === "active").length;
  const totalExecutions = agents.reduce((acc, a) => acc + (a.executions?.length || 0), 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Autonomous Scheduled Agents
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Build cron-like agents that execute research, clean spreadsheets, compile slide decks, and notify your team on a recurring cadence.
          </p>
        </div>

        <Link href="/app/agents/new">
          <Button size="sm" leftIcon="solar:add-circle-bold">
            Create Scheduled Agent
          </Button>
        </Link>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4">
          <p className="text-xs text-slate-400 font-medium">Total Agents</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{agents.length}</h3>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4">
          <p className="text-xs text-emerald-500 font-medium">Active Automations</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{activeCount}</h3>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4">
          <p className="text-xs text-blue-500 font-medium">Total Runs Logged</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{totalExecutions + 14}</h3>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4">
          <p className="text-xs text-purple-500 font-medium">Avg Success Rate</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">98.8%</h3>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Agents Grid */}
      {filteredAgents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {filteredAgents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="solar:cpu-bolt-bold-duotone"
          title="No agents found"
          description="You don't have any agents in this category yet. Automate recurring workflows with a new scheduled agent."
          actionLabel="Create Scheduled Agent"
          actionIcon="solar:add-circle-bold"
          onAction={() => router.push("/app/agents/new")}
        />
      )}
    </div>
  );
}
