"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Icon } from "@/components/ui/icon";
import { useAppStore } from "@/lib/store/app-store";
import { useToast } from "@/components/ui/toast";

export function TaskCreatorModal() {
  const router = useRouter();
  const toast = useToast();
  const { isTaskModalOpen, setIsTaskModalOpen, createTask, skills, plugins } = useAppStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium");
  const [dueDate, setDueDate] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedPlugins, setSelectedPlugins] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isTaskModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("Please provide both a task title and prompt description.");
      return;
    }

    setIsSubmitting(true);
    const newTask = createTask({
      title: title.trim(),
      description: description.trim(),
      status: "running",
      priority,
      dueDate: dueDate || undefined,
      skillIds: selectedSkills,
      pluginIds: selectedPlugins,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setIsTaskModalOpen(false);
      setTitle("");
      setDescription("");
      setSelectedSkills([]);
      setSelectedPlugins([]);
      toast.success("Task initiated and scheduled!");
      router.push(`/app/tasks/${newTask.id}`);
    }, 400);
  };

  const toggleSkill = (id: string) => {
    setSelectedSkills((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const togglePlugin = (id: string) => {
    setSelectedPlugins((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  return (
    <Modal
      isOpen={isTaskModalOpen}
      onClose={() => setIsTaskModalOpen(false)}
      title="Create Autonomous Task"
      description="Define an objective for the AI to execute with specialized skills and connected tools."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Task Title *
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Synthesize Q3 Marketing Report & Send to Gmail"
            required
            autoFocus
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Task Prompt & Scope *
          </label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide exact instructions, required format, references, and outcome criteria..."
            rows={3}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Priority
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(["low", "medium", "high", "urgent"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`py-1.5 text-xs rounded-lg border capitalize transition-colors ${
                    priority === p
                      ? "border-blue-600 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold"
                      : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Due Date (Optional)
            </label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        {/* Select Skills */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Assign Skills
          </label>
          <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
            {skills.map((s) => {
              const isSelected = selectedSkills.includes(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleSkill(s.id)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs border transition-all ${
                    isSelected
                      ? "border-blue-600 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold"
                      : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon icon={s.icon} size={14} />
                  <span>{s.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Select Plugins */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Connected Plugins
          </label>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {plugins.map((p) => {
              const isSelected = selectedPlugins.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => togglePlugin(p.id)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs border transition-all ${
                    isSelected
                      ? "border-blue-600 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold"
                      : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon icon={p.icon} size={14} />
                  <span>{p.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsTaskModalOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            isLoading={isSubmitting}
            leftIcon="solar:play-circle-bold"
          >
            Execute Task
          </Button>
        </div>
      </form>
    </Modal>
  );
}
