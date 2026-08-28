"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/empty-state";
import { PluginCard } from "@/components/plugins/plugin-card";
import { PluginConnectModal } from "@/components/plugins/plugin-connect-modal";
import { useAppStore } from "@/lib/store/app-store";
import { Plugin } from "@/lib/types";

export default function PluginsPage() {
  const { plugins } = useAppStore();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null);

  const categories = [
    { id: "all", label: "All Integrations", count: plugins.length },
    { id: "Productivity", label: "Productivity", count: plugins.filter((p) => p.category === "Productivity").length },
    { id: "Design", label: "Design", count: plugins.filter((p) => p.category === "Design").length },
    { id: "Maps", label: "Maps", count: plugins.filter((p) => p.category === "Maps").length },
    { id: "Commerce", label: "Commerce", count: plugins.filter((p) => p.category === "Commerce").length },
    { id: "Research", label: "Research", count: plugins.filter((p) => p.category === "Research").length },
    { id: "Jobs", label: "Jobs", count: plugins.filter((p) => p.category === "Jobs").length },
  ];

  const filteredPlugins = plugins.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      activeCategory === "all" || p.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Plugins & Integrations
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Connect your favorite tools and external services to allow the AI to search files, query metrics, and automate workflows safely.
        </p>
      </div>

      {/* Filter Bar */}
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
            placeholder="Search plugins..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      {filteredPlugins.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {filteredPlugins.map((plugin) => (
            <PluginCard
              key={plugin.id}
              plugin={plugin}
              onConnectClick={(p) => setSelectedPlugin(p)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="solar:plug-circle-bold-duotone"
          title="No plugins found"
          description="We couldn't find any plugins matching your current category filter or search query."
        />
      )}

      {/* Connect Modal */}
      <PluginConnectModal
        plugin={selectedPlugin}
        isOpen={!!selectedPlugin}
        onClose={() => setSelectedPlugin(null)}
      />
    </div>
  );
}
