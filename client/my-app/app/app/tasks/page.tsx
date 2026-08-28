"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/empty-state";
import { TaskCard } from "@/components/tasks/task-card";
import { useAppStore } from "@/lib/store/app-store";

export default function TasksPage() {
  const { tasks, setIsTaskModalOpen } = useAppStore();
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { id: "all", label: "All Tasks", count: tasks.length },
    { id: "running", label: "In Progress", count: tasks.filter((t) => t.status === "running").length },
    { id: "completed", label: "Completed", count: tasks.filter((t) => t.status === "completed").length },
    { id: "queued", label: "Queued", count: tasks.filter((t) => t.status === "queued").length },
    { id: "failed", label: "Failed", count: tasks.filter((t) => t.status === "failed").length },
  ];

  const filteredTasks = tasks.filter((t) => {
    if (activeTab === "all") return true;
    return t.status === activeTab;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Task Execution Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Delegate complex research, document generation, and multi-tool jobs to autonomous background routines.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsTaskModalOpen(true)}
          leftIcon="solar:add-circle-bold"
        >
          Create Task
        </Button>
      </div>

      {/* Filter Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Grid */}
      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="solar:checklist-minimalistic-bold-duotone"
          title="No tasks found"
          description="There are no tasks matching this filter. Start a new background job with the AI."
          actionLabel="Create Task"
          actionIcon="solar:add-circle-bold"
          onAction={() => setIsTaskModalOpen(true)}
        />
      )}
    </div>
  );
}
