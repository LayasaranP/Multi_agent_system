"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Icon } from "@/components/ui/icon";
import { useAppStore } from "@/lib/store/app-store";

interface SkillPickerDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SkillPickerDialog({ isOpen, onClose }: SkillPickerDialogProps) {
  const { skills, composerSkillIds, toggleComposerSkill } = useAppStore();
  const [search, setSearch] = useState("");

  const filteredSkills = skills.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Select Skills for This Prompt"
      description="Equip the assistant with domain-specific skills for your current prompt."
      size="md"
    >
      <div className="space-y-3 pt-1">
        <Input
          leftIcon="solar:magnifer-line-duotone"
          placeholder="Search skills..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
        />

        <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
          {filteredSkills.map((skill) => {
            const isSelected = composerSkillIds.includes(skill.id);
            return (
              <div
                key={skill.id}
                onClick={() => toggleComposerSkill(skill.id)}
                className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? "border-blue-600 bg-blue-500/10 dark:bg-blue-950/30"
                    : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                    <Icon icon={skill.icon} size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {skill.name}
                      </span>
                      <span className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 text-[9px] text-slate-500 uppercase">
                        {skill.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {skill.description}
                    </p>
                  </div>
                </div>

                <div
                  className={`h-4 w-4 rounded border flex items-center justify-center shrink-0 ml-2 ${
                    isSelected
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-slate-300 dark:border-slate-700"
                  }`}
                >
                  {isSelected && <Icon icon="solar:check-read-bold" size={10} />}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          <Link
            href="/app/skills/new"
            onClick={onClose}
            className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
          >
            <Icon icon="solar:add-circle-bold" size={14} />
            Create custom skill
          </Link>
          <span className="text-slate-400">
            {composerSkillIds.length} selected
          </span>
        </div>
      </div>
    </Modal>
  );
}
