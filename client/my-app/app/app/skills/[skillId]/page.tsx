"use client";

import React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store/app-store";
import { useToast } from "@/components/ui/toast";

export default function SkillDetailPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const skillId = params?.skillId as string;

  const {
    skills,
    toggleSkillEnabled,
    deleteSkill,
    plugins,
    toggleComposerSkill,
    composerSkillIds,
    createConversation,
  } = useAppStore();

  const skill = skills.find((s) => s.id === skillId);

  if (!skill) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <Icon icon="solar:danger-circle-bold" size={48} className="text-red-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold">Skill Not Found</h2>
        <p className="text-sm text-slate-500 mt-1">
          The skill you are looking for does not exist or has been removed.
        </p>
        <Link href="/app/skills" className="mt-4 inline-block">
          <Button size="sm">Back to Marketplace</Button>
        </Link>
      </div>
    );
  }

  const handleUseSkill = (prompt?: string) => {
    if (!composerSkillIds.includes(skill.id)) {
      toggleComposerSkill(skill.id);
    }
    const newConvo = createConversation(
      prompt ? prompt.slice(0, 32) + "..." : `Chat with ${skill.name}`,
      [skill.id]
    );
    router.push(`/app/chat/${newConvo.id}`);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this custom skill?")) {
      deleteSkill(skill.id);
      toast.success("Skill deleted");
      router.push("/app/skills");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/app/skills" className="hover:text-slate-600 dark:hover:text-slate-200">
          Skills Marketplace
        </Link>
        <span>/</span>
        <span className="text-slate-700 dark:text-slate-300 font-medium">{skill.name}</span>
      </div>

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-8 ring-blue-500/5 shrink-0">
            <Icon icon={skill.icon} size={36} />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {skill.name}
              </h1>
              <Badge variant={skill.isBuiltIn ? "default" : "purple"}>
                {skill.isBuiltIn ? "Built-in" : "Custom"}
              </Badge>
              <Badge variant="outline">{skill.category}</Badge>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl leading-relaxed">
              {skill.description}
            </p>

            <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
              <span>Author: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{skill.author || "Core AI"}</strong></span>
              <span>•</span>
              <span>Version: <strong className="text-slate-700 dark:text-slate-300 font-semibold">v{skill.version || "1.0.0"}</strong></span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Icon icon="solar:star-bold" size={13} className="text-amber-400" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {skill.rating ? skill.rating.toFixed(1) : "5.0"}
                </span>
                <span>({skill.usageCount || 0} runs)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 shrink-0 sm:w-44">
          <Button
            size="sm"
            onClick={() => handleUseSkill()}
            leftIcon="solar:play-circle-bold"
            className="w-full shadow-sm"
          >
            Use Skill
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              toggleSkillEnabled(skill.id);
              toast.info(skill.enabled ? "Skill disabled" : "Skill enabled");
            }}
            leftIcon={skill.enabled ? "solar:pause-circle-line-duotone" : "solar:play-circle-line-duotone"}
          >
            {skill.enabled ? "Enabled ✓" : "Enable Skill"}
          </Button>

          {!skill.isBuiltIn && (
            <Button
              size="sm"
              variant="destructive"
              onClick={handleDelete}
              leftIcon="solar:trash-bin-trash-line-duotone"
            >
              Delete Skill
            </Button>
          )}
        </div>
      </div>

      {/* Main Grid: Prompts & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Example Prompts */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
              <Icon icon="solar:chat-round-dots-bold-duotone" size={18} className="text-blue-500" />
              Example Prompts
            </h3>
            <div className="space-y-2.5">
              {skill.examplePrompts && skill.examplePrompts.length > 0 ? (
                skill.examplePrompts.map((prompt, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-blue-500/60 transition-all group"
                  >
                    <p className="text-xs text-slate-700 dark:text-slate-300 pr-3 leading-relaxed">
                      &quot;{prompt}&quot;
                    </p>
                    <Button
                      size="xs"
                      variant="secondary"
                      onClick={() => handleUseSkill(prompt)}
                      rightIcon="solar:alt-arrow-right-linear"
                      className="shrink-0"
                    >
                      Run
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">No prompt templates configured.</p>
              )}
            </div>
          </div>

          {/* System Instructions / Prompt */}
          {skill.instructions && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
                <Icon icon="solar:code-file-bold-duotone" size={18} className="text-blue-500" />
                Underlying System Directives
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-mono bg-slate-50 dark:bg-slate-950/80 p-3.5 rounded-xl border border-slate-100 dark:border-slate-850 whitespace-pre-wrap leading-relaxed">
                {skill.instructions}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Dependencies & Specs */}
        <div className="space-y-6">
          {/* Required Plugins */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 space-y-3">
            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Connected Plugins
            </h4>
            {skill.requiredPlugins && skill.requiredPlugins.length > 0 ? (
              <div className="space-y-2">
                {skill.requiredPlugins.map((pid) => {
                  const p = plugins.find((item) => item.id === pid);
                  if (!p) return null;
                  return (
                    <div
                      key={pid}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Icon icon={p.icon} size={16} />
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {p.name}
                        </span>
                      </div>
                      <Badge variant={p.connected ? "success" : "outline"} className="text-[9px]">
                        {p.connected ? "Connected" : "Requires Connect"}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400">Zero external plugins required. Self-contained.</p>
            )}
          </div>

          {/* Allowed File Types */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 space-y-3">
            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Compatible File Formats
            </h4>
            {skill.allowedFileTypes && skill.allowedFileTypes.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {skill.allowedFileTypes.map((ext) => (
                  <span
                    key={ext}
                    className="font-mono text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold"
                  >
                    {ext}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">Accepts all text, docs, and conversational inputs.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
