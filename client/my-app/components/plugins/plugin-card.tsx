"use client";

import React from "react";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plugin } from "@/lib/types";

interface PluginCardProps {
  plugin: Plugin;
  onConnectClick: (plugin: Plugin) => void;
}

export function PluginCard({ plugin, onConnectClick }: PluginCardProps) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 p-5 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 shrink-0 border border-slate-100 dark:border-slate-800">
            <Icon icon={plugin.icon} size={24} />
          </div>

          <div className="flex items-center gap-1.5">
            <Badge
              variant={plugin.connected ? "success" : "outline"}
              className="text-[10px]"
            >
              {plugin.connected ? "Connected" : "Available"}
            </Badge>
            <span className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-500 uppercase">
              {plugin.category}
            </span>
          </div>
        </div>

        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          {plugin.name}
        </h3>
        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {plugin.description}
        </p>

        {plugin.connected && (
          <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-2">
            <span className="truncate">{plugin.accountEmail}</span>
            {plugin.lastSynced && (
              <>
                <span>•</span>
                <span className="shrink-0">{plugin.lastSynced}</span>
              </>
            )}
          </div>
        )}
      </div>

      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80">
        <Button
          size="xs"
          variant={plugin.connected ? "outline" : "primary"}
          onClick={() => onConnectClick(plugin)}
          leftIcon={plugin.connected ? "solar:settings-bold-duotone" : "solar:plug-circle-bold"}
          className="w-full"
        >
          {plugin.connected ? "Configure" : "Connect"}
        </Button>
      </div>
    </div>
  );
}
