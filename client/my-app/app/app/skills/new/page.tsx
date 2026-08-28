"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store/app-store";
import { useToast } from "@/components/ui/toast";

export default function CreateSkillPage() {
  const router = useRouter();
  const toast = useToast();
  const { addCustomSkill, plugins } = useAppStore();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<"Documents" | "Design" | "Data" | "Productivity" | "Custom">("Productivity");
  const [selectedIcon, setSelectedIcon] = useState("solar:magic-stick-3-bold-duotone");
  const [instructions, setInstructions] = useState("");
  const [requiredPlugins, setRequiredPlugins] = useState<string[]>([]);
  const [allowedFileTypes, setAllowedFileTypes] = useState(".pdf, .docx, .xlsx");
  const [examplePrompts, setExamplePrompts] = useState<string[]>([
    "Analyze and structure this document according to best practices.",
  ]);
  const [newPromptInput, setNewPromptInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const iconOptions = [
    "solar:magic-stick-3-bold-duotone",
    "solar:code-bold-duotone",
    "solar:chart-2-bold-duotone",
    "solar:document-text-bold-duotone",
    "solar:palette-round-bold-duotone",
    "solar:shield-check-bold-duotone",
    "solar:cpu-bolt-bold-duotone",
    "solar:server-square-bold-duotone",
    "solar:database-bold-duotone",
    "solar:magnifer-bold-duotone",
  ];

  const handleAddPrompt = () => {
    if (newPromptInput.trim()) {
      setExamplePrompts((prev) => [...prev, newPromptInput.trim()]);
      setNewPromptInput("");
    }
  };

  const handleRemovePrompt = (index: number) => {
    setExamplePrompts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTogglePlugin = (pluginId: string) => {
    setRequiredPlugins((prev) =>
      prev.includes(pluginId) ? prev.filter((id) => id !== pluginId) : [...prev, pluginId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim() || !instructions.trim()) {
      toast.error("Please provide skill name, description, and system instructions.");
      return;
    }

    setIsSubmitting(true);
    const newSkill = addCustomSkill({
      name: name.trim(),
      description: description.trim(),
      category,
      icon: selectedIcon,
      enabled: true,
      author: "You",
      version: "1.0.0",
      instructions: instructions.trim(),
      requiredPlugins,
      allowedFileTypes: allowedFileTypes.split(",").map((s) => s.trim()).filter(Boolean),
      examplePrompts: examplePrompts.filter(Boolean),
    });

    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(`Skill "${newSkill.name}" published to workspace!`);
      router.push(`/app/skills/${newSkill.id}`);
    }, 400);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/app/skills" className="hover:text-slate-600 dark:hover:text-slate-200">
          Skills Marketplace
        </Link>
        <span>/</span>
        <span className="text-slate-700 dark:text-slate-300 font-medium">Create Custom Skill</span>
      </div>

      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Create Custom Skill
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Configure system prompts, connect required plugins, and define sample prompts for your team.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Basic Metadata
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Skill Name *
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Legal Contract Auditor"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Short Description *
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain what this skill does in 1-2 sentences..."
                rows={2}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as "Documents" | "Design" | "Data" | "Productivity" | "Custom")}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                >
                  <option value="Documents">Documents</option>
                  <option value="Design">Design</option>
                  <option value="Data">Data & Analytics</option>
                  <option value="Productivity">Productivity</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Pick an Icon
                </label>
                <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setSelectedIcon(icon)}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
                        selectedIcon === icon
                          ? "border-blue-600 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                          : "border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Icon icon={icon} size={18} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* System Instructions */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              System Instructions & Prompt Directives *
            </h3>
            <p className="text-xs text-slate-500">
              Define the AI persona, rules of thumb, formatting expectations, and constraints for this skill.
            </p>
            <Textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="You are an expert contract lawyer. Analyze agreements for indemnification loopholes, IP ownership transfer, and non-standard termination clauses. Always output findings in a markdown table..."
              rows={5}
              required
            />
          </div>

          {/* Required Plugins & File Types */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Dependencies & Constraints
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Required Plugins
              </label>
              <div className="flex flex-wrap gap-2">
                {plugins.map((p) => {
                  const isChecked = requiredPlugins.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleTogglePlugin(p.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-all ${
                        isChecked
                          ? "border-blue-600 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold"
                          : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Icon icon={p.icon} size={15} />
                      <span>{p.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Compatible File Extensions (comma separated)
              </label>
              <Input
                value={allowedFileTypes}
                onChange={(e) => setAllowedFileTypes(e.target.value)}
                placeholder=".pdf, .docx, .txt"
              />
            </div>
          </div>

          {/* Example Prompts */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Sample Prompts
            </h3>

            <div className="flex gap-2">
              <Input
                value={newPromptInput}
                onChange={(e) => setNewPromptInput(e.target.value)}
                placeholder="Add a sample prompt..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddPrompt();
                  }
                }}
              />
              <Button type="button" size="sm" variant="secondary" onClick={handleAddPrompt}>
                Add
              </Button>
            </div>

            <div className="space-y-1.5">
              {examplePrompts.map((p, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-xs"
                >
                  <span className="text-slate-700 dark:text-slate-300">&quot;{p}&quot;</span>
                  <button
                    type="button"
                    onClick={() => handleRemovePrompt(idx)}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <Icon icon="solar:close-circle-line-duotone" size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Link href="/app/skills">
              <Button type="button" variant="outline" size="sm">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              size="sm"
              isLoading={isSubmitting}
              leftIcon="solar:upload-track-2-bold-duotone"
            >
              Publish Skill
            </Button>
          </div>
        </form>

        {/* Real-time Live Preview */}
        <div className="space-y-4">
          <div className="sticky top-20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Live Marketplace Card Preview
              </span>
              <Badge variant="purple" className="text-[10px]">
                Live
              </Badge>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-lg space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Icon icon={selectedIcon} size={24} />
                </div>
                <div className="flex items-center gap-1.5">
                  <Badge variant="purple" className="text-[10px]">
                    Custom
                  </Badge>
                  <span className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-500 uppercase">
                    {category}
                  </span>
                </div>
              </div>

              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {name || "Skill Title"}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3">
                {description || "Provide a short description of the skill and its workflow benefits."}
              </p>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>By You</span>
                <span>v1.0.0</span>
              </div>

              <Button size="xs" className="w-full" disabled>
                Use Skill
              </Button>
            </div>

            {examplePrompts.length > 0 && (
              <div className="mt-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                  Sample Prompts Preview:
                </span>
                <ul className="space-y-1 text-slate-500 dark:text-slate-400 list-disc list-inside">
                  {examplePrompts.slice(0, 2).map((p, i) => (
                    <li key={i} className="truncate">&quot;{p}&quot;</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
