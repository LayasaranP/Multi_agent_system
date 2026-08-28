"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store/app-store";
import { useToast } from "@/components/ui/toast";
import { formatDate } from "@/lib/utils";

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const taskId = params?.taskId as string;

  const { tasks, createConversation, skills, plugins } = useAppStore();
  const task = tasks.find((t) => t.id === taskId);

  const [copied, setCopied] = useState(false);

  if (!task) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <Icon icon="solar:danger-circle-bold" size={48} className="text-red-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold">Task Not Found</h2>
        <p className="text-sm text-slate-500 mt-1">This task does not exist or has been removed.</p>
        <Link href="/app/tasks" className="mt-4 inline-block">
          <Button size="sm">Back to Tasks</Button>
        </Link>
      </div>
    );
  }

  const handleCopyOutput = () => {
    if (task.output?.content) {
      navigator.clipboard.writeText(task.output.content);
      setCopied(true);
      toast.success("Output copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!task.output?.content) return;
    const blob = new Blob([task.output.content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${task.title.toLowerCase().replace(/\s+/g, "_")}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded artifact");
  };

  const handleContinueInChat = () => {
    const convo = createConversation(
      `Task: ${task.title}`,
      task.skillIds,
      task.pluginIds
    );
    router.push(`/app/chat/${convo.id}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/app/tasks" className="hover:text-slate-600 dark:hover:text-slate-200">
          Tasks Execution
        </Link>
        <span>/</span>
        <span className="text-slate-700 dark:text-slate-300 font-medium">{task.title}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {task.title}
            </h1>
            <Badge
              variant={
                task.status === "completed"
                  ? "success"
                  : task.status === "running"
                  ? "warning"
                  : "secondary"
              }
              className="capitalize"
            >
              {task.status}
            </Badge>
            <span className="rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 text-xs font-bold uppercase">
              Priority: {task.priority}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
            {task.description}
          </p>

          <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
            <span>Created: {formatDate(task.createdAt)}</span>
            {task.dueDate && (
              <>
                <span>•</span>
                <span>Due: {task.dueDate}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={handleContinueInChat}
            leftIcon="solar:chat-round-line-bold-duotone"
          >
            Continue in Chat
          </Button>
          {task.output && (
            <Button
              size="sm"
              variant="primary"
              onClick={handleDownload}
              leftIcon="solar:download-minimalistic-bold"
            >
              Export
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Execution Timeline */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Icon icon="solar:round-transfer-vertical-bold-duotone" size={18} className="text-blue-500" />
            Execution Timeline
          </h3>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 space-y-6">
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {task.steps.map((step, idx) => (
                <div key={step.id || idx} className="relative">
                  {/* Step dot */}
                  <span
                    className={`absolute -left-6 top-0.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                      step.status === "completed"
                        ? "bg-emerald-500 text-white ring-4 ring-emerald-500/20"
                        : step.status === "running"
                        ? "bg-blue-600 text-white animate-pulse ring-4 ring-blue-500/20"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-400"
                    }`}
                  >
                    {step.status === "completed" ? "✓" : idx + 1}
                  </span>

                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                        {step.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {step.timestamp}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Configured tools summary */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Active Capabilities
              </span>
              <div className="flex flex-wrap gap-1.5">
                {task.skillIds?.map((sid) => {
                  const s = skills.find((i) => i.id === sid);
                  if (!s) return null;
                  return (
                    <span
                      key={sid}
                      className="inline-flex items-center gap-1 rounded bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-600 dark:text-blue-400"
                    >
                      <Icon icon={s.icon} size={12} />
                      {s.name}
                    </span>
                  );
                })}
                {task.pluginIds?.map((pid) => {
                  const p = plugins.find((i) => i.id === pid);
                  if (!p) return null;
                  return (
                    <span
                      key={pid}
                      className="inline-flex items-center gap-1 rounded bg-purple-500/10 px-2 py-0.5 text-[10px] font-semibold text-purple-600 dark:text-purple-400"
                    >
                      <Icon icon={p.icon} size={12} />
                      {p.name}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Generated Output Document Viewer */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Icon icon="solar:document-text-bold-duotone" size={18} className="text-blue-500" />
              Generated Artifact Output
            </h3>

            {task.output && (
              <div className="flex items-center gap-2">
                <Button
                  size="xs"
                  variant="outline"
                  onClick={handleCopyOutput}
                  leftIcon={copied ? "solar:check-circle-bold" : "solar:copy-linear"}
                >
                  {copied ? "Copied" : "Copy Output"}
                </Button>
                <Button
                  size="xs"
                  variant="secondary"
                  onClick={handleDownload}
                  leftIcon="solar:download-linear"
                >
                  Download .MD
                </Button>
              </div>
            )}
          </div>

          {task.output ? (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-md overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60">
                <div className="flex items-center gap-2">
                  <Icon icon="solar:file-check-bold" size={16} className="text-emerald-500" />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {task.output.title}
                  </span>
                </div>
                <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400">
                  {task.output.format}
                </span>
              </div>

              <div className="p-6 text-xs leading-relaxed overflow-x-auto">
                <pre className="font-mono whitespace-pre-wrap text-slate-800 dark:text-slate-200">
                  {task.output.content}
                </pre>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center text-xs text-slate-400">
              <Icon icon="solar:hourglass-line-duotone" size={36} className="mx-auto mb-2 text-blue-500 animate-spin" />
              <p className="font-semibold text-slate-700 dark:text-slate-300">Task execution in progress...</p>
              <p className="mt-1 text-slate-400">Artifacts and synthesis reports will be rendered here once completed.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
