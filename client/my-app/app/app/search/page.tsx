"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store/app-store";
import { formatDate } from "@/lib/utils";

export default function SearchPage() {
  const { conversations, messages, skills, plugins } = useAppStore();
  const [query, setQuery] = useState("");
  const [selectedSkillFilter, setSelectedSkillFilter] = useState("all");
  const [selectedPluginFilter, setSelectedPluginFilter] = useState("all");

  const results = useMemo(() => {
    if (!query.trim() && selectedSkillFilter === "all" && selectedPluginFilter === "all") {
      // Return recent conversations by default
      return conversations.slice(0, 10).map((c) => ({
        id: c.id,
        title: c.title,
        matchedSnippet: "Recent conversation in your workspace.",
        date: c.updatedAt,
        activeSkillIds: c.activeSkillIds,
        activePluginIds: c.activePluginIds,
      }));
    }

    const lower = query.toLowerCase();
    const matches: Array<{
      id: string;
      title: string;
      matchedSnippet: string;
      date: string;
      activeSkillIds?: string[];
      activePluginIds?: string[];
    }> = [];

    conversations.forEach((convo) => {
      // Check skill and plugin filters
      if (selectedSkillFilter !== "all" && !convo.activeSkillIds?.includes(selectedSkillFilter)) {
        return;
      }
      if (selectedPluginFilter !== "all" && !convo.activePluginIds?.includes(selectedPluginFilter)) {
        return;
      }

      let matchedSnippet = "";

      // Check title match
      if (convo.title.toLowerCase().includes(lower)) {
        matchedSnippet = `Matched conversation title: "${convo.title}"`;
      }

      // Check message contents
      const convoMsgs = messages[convo.id] || [];
      for (const msg of convoMsgs) {
        if (msg.content.toLowerCase().includes(lower)) {
          const idx = msg.content.toLowerCase().indexOf(lower);
          const start = Math.max(0, idx - 40);
          const end = Math.min(msg.content.length, idx + lower.length + 60);
          matchedSnippet = `"...${msg.content.slice(start, end)}..."`;
          break;
        }
      }

      if (matchedSnippet || !query.trim()) {
        matches.push({
          id: convo.id,
          title: convo.title,
          matchedSnippet: matchedSnippet || "Matched filter parameters",
          date: convo.updatedAt,
          activeSkillIds: convo.activeSkillIds,
          activePluginIds: convo.activePluginIds,
        });
      }
    });

    return matches;
  }, [conversations, messages, query, selectedSkillFilter, selectedPluginFilter]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Deep Workspace Search
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Search across conversation titles, full message transcripts, code snippets, and active integrations.
        </p>
      </div>

      {/* Main Search Bar */}
      <div className="space-y-3">
        <Input
          leftIcon="solar:magnifer-line-duotone"
          placeholder="Search conversation text, questions, code, or outputs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          className="h-11 text-sm"
        />

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Skill:</span>
            <select
              value={selectedSkillFilter}
              onChange={(e) => setSelectedSkillFilter(e.target.value)}
              className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300"
            >
              <option value="all">All Skills</option>
              {skills.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Plugin:</span>
            <select
              value={selectedPluginFilter}
              onChange={(e) => setSelectedPluginFilter(e.target.value)}
              className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300"
            >
              <option value="all">All Plugins</option>
              {plugins.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {(query || selectedSkillFilter !== "all" || selectedPluginFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSelectedSkillFilter("all");
                setSelectedPluginFilter("all");
              }}
              className="text-blue-600 dark:text-blue-400 hover:underline ml-auto"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
        <span>Found {results.length} conversation matches</span>
      </div>

      {/* Results List */}
      <div className="space-y-3">
        {results.length > 0 ? (
          results.map((res) => (
            <Link
              key={res.id}
              href={`/app/chat/${res.id}`}
              className="block p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 hover:border-blue-500/60 transition-all group shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {res.title}
                </h3>
                <span className="text-[11px] text-slate-400 shrink-0">
                  {formatDate(res.date)}
                </span>
              </div>

              <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono line-clamp-2 bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-850">
                {res.matchedSnippet}
              </p>

              {/* Skills/Plugins */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {res.activeSkillIds?.map((sid) => {
                  const s = skills.find((i) => i.id === sid);
                  if (!s) return null;
                  return (
                    <Badge key={sid} variant="default" className="text-[9px]">
                      {s.name}
                    </Badge>
                  );
                })}
                {res.activePluginIds?.map((pid) => {
                  const p = plugins.find((i) => i.id === pid);
                  if (!p) return null;
                  return (
                    <Badge key={pid} variant="purple" className="text-[9px]">
                      {p.name}
                    </Badge>
                  );
                })}
              </div>
            </Link>
          ))
        ) : (
          <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-400">
            <Icon icon="solar:magnifer-line-duotone" size={32} className="mx-auto mb-2 text-slate-400" />
            No conversations or messages matched your search parameters.
          </div>
        )}
      </div>
    </div>
  );
}
