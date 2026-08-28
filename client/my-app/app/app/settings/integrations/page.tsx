"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store/app-store";

export default function IntegrationsSettingsPage() {
  const { plugins, disconnectPlugin } = useAppStore();
  const connected = plugins.filter((p) => p.connected);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Connected Integrations
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage authorized OAuth tokens and active data synchronization pipelines.
          </p>
        </div>

        <Link href="/app/plugins">
          <Button size="xs" variant="primary" leftIcon="solar:add-circle-bold">
            Add Integrations
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {connected.length > 0 ? (
          connected.map((plugin) => (
            <div
              key={plugin.id}
              className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <Icon icon={plugin.icon} size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {plugin.name}
                    </h4>
                    <Badge variant="success" className="text-[9px]">
                      Connected
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Account: {plugin.accountEmail || "layasaran@enterprise.ai"} • Synced: {plugin.lastSynced || "Recently"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => disconnectPlugin(plugin.id)}
                >
                  Disconnect
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-400">
            No external integrations currently connected.
          </div>
        )}
      </div>
    </div>
  );
}
