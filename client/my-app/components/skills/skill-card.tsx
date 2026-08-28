"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skill } from "@/lib/types";
import { useAppStore } from "@/lib/store/app-store";

interface SkillCardProps {
  skill: Skill;
}

export function SkillCard({ skill }: SkillCardProps) {
  const router = useRouter();
  const { toggleComposerSkill, composerSkillIds, createConversation } = useAppStore();

  const handleUseSkill = () => {
    if (!composerSkillIds.includes(skill.id)) {
      toggleComposerSkill(skill.id);
    }
    const newConvo = createConversation(`Chat with ${skill.name}`, [skill.id]);
    router.push(`/app/chat/${newConvo.id}`);
  };

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 p-5 shadow-sm hover:border-blue-500/60 dark:hover:border-blue-500/60 hover:shadow-md transition-all duration-200 group">
      <div>
        {/* Top meta */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
            <Icon icon={skill.icon} size={24} />
          </div>

          <div className="flex items-center gap-1.5">
            <Badge
              variant={skill.isBuiltIn ? "default" : "purple"}
              className="text-[10px]"
            >
              {skill.isBuiltIn ? "Built-in" : "Custom"}
            </Badge>
            <span className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              {skill.category}
            </span>
          </div>
        </div>

        {/* Name & Description */}
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {skill.name}
        </h3>
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {skill.description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-3 mt-4 text-[11px] text-slate-400">
          <div className="flex items-center gap-1">
            <Icon icon="solar:star-bold" size={13} className="text-amber-400" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {skill.rating ? skill.rating.toFixed(1) : "5.0"}
            </span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Icon icon="solar:users-group-two-rounded-bold-duotone" size={13} />
            <span>{skill.usageCount || 0} uses</span>
          </div>
          {skill.version && (
            <>
              <span>•</span>
              <span>v{skill.version}</span>
            </>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80">
        <Button
          size="xs"
          variant="primary"
          onClick={handleUseSkill}
          leftIcon="solar:play-circle-bold"
          className="flex-1"
        >
          Use Skill
        </Button>
        <Link href={`/app/skills/${skill.id}`} className="flex-1">
          <Button size="xs" variant="outline" className="w-full">
            Details
          </Button>
        </Link>
      </div>
    </div>
  );
}
