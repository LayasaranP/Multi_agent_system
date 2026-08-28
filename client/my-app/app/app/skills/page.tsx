"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/empty-state";
import { SkillCard } from "@/components/skills/skill-card";
import { useAppStore } from "@/lib/store/app-store";

export default function SkillsPage() {
  const router = useRouter();
  const { skills } = useAppStore();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { id: "all", label: "All Skills", count: skills.length },
    { id: "Documents", label: "Documents", count: skills.filter((s) => s.category === "Documents").length },
    { id: "Design", label: "Design", count: skills.filter((s) => s.category === "Design").length },
    { id: "Data", label: "Data & Analysis", count: skills.filter((s) => s.category === "Data").length },
    { id: "Productivity", label: "Productivity", count: skills.filter((s) => s.category === "Productivity").length },
    { id: "custom", label: "Custom Built", count: skills.filter((s) => !s.isBuiltIn).length },
  ];

  const filteredSkills = skills.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      activeCategory === "all" ||
      (activeCategory === "custom" ? !s.isBuiltIn : s.category === activeCategory);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            AI Skills Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Equip your AI assistants with specialized domain capabilities, document parsers, and custom workflows.
          </p>
        </div>

        <Link href="/app/skills/new">
          <Button leftIcon="solar:add-circle-bold" size="sm">
            Create Custom Skill
          </Button>
        </Link>
      </div>

      {/* Controls & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <Tabs
          tabs={categories}
          activeTab={activeCategory}
          onChange={setActiveCategory}
          className="w-full sm:w-auto"
        />

        <div className="w-full sm:w-64">
          <Input
            leftIcon="solar:magnifer-line-duotone"
            placeholder="Search skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Skills Grid */}
      {filteredSkills.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {filteredSkills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="solar:magic-stick-3-bold-duotone"
          title="No skills found"
          description="We couldn't find any skills matching your search criteria or category filter."
          actionLabel="Create Custom Skill"
          actionIcon="solar:add-circle-bold"
          onAction={() => router.push("/app/skills/new")}
        />
      )}
    </div>
  );
}
