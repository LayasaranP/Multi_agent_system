"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Icon } from "@/components/ui/icon";
import { useAppStore } from "@/lib/store/app-store";

interface PluginPickerDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PluginPickerDialog({ isOpen, onClose }: PluginPickerDialogProps) {
  const { plugins, composerPluginIds, toggleComposerPlugin } = useAppStore();
  const [search, setSearch] = useState("");

  const filteredPlugins = plugins.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Select Plugins & Integrations"
      description="Connect live external data sources to this conversation."
      size="md"
    >
      <div className="space-y-3 pt-1">
        <Input
          leftIcon="solar:magnifer-line-duotone"
          placeholder="Search plugins..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
        />

        <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
          {filteredPlugins.map((plugin) => {
            const isSelected = composerPluginIds.includes(plugin.id);
            return (
              <div
                key={plugin.id}
                onClick={() => toggleComposerPlugin(plugin.id)}
                className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? "border-blue-600 bg-blue-500/10 dark:bg-blue-950/30"
                    : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                    <Icon icon={plugin.icon} size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {plugin.name}
                      </span>
                      {plugin.connected ? (
                        <span className="rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.2 text-[9px] font-medium">
                          Connected
                        </span>
                      ) : (
                        <span className="rounded bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.2 text-[9px]">
                          Available
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {plugin.description}
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
            href="/app/plugins"
            onClick={onClose}
            className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
          >
            <Icon icon="solar:plug-circle-bold-duotone" size={14} />
            Manage all integrations
          </Link>
          <span className="text-slate-400">
            {composerPluginIds.length} active
          </span>
        </div>
      </div>
    </Modal>
  );
}
