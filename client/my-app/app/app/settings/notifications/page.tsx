"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export default function NotificationsSettingsPage() {
  const toast = useToast();
  const [taskComplete, setTaskComplete] = useState(true);
  const [agentComplete, setAgentComplete] = useState(true);
  const [agentFailure, setAgentFailure] = useState(true);
  const [marketingUpdates, setMarketingUpdates] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Notification preferences updated");
    }, 300);
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 space-y-6">
      <div>
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
          Notification Preferences
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Select which lifecycle events dispatch email alerts and push messages.
        </p>
      </div>

      <div className="space-y-3">
        <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
              Task Completed Alerts
            </h4>
            <p className="text-[11px] text-slate-500">
              Receive a notification when an autonomous background task finishes executing.
            </p>
          </div>
          <input
            type="checkbox"
            checked={taskComplete}
            onChange={(e) => setTaskComplete(e.target.checked)}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
        </label>

        <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
              Scheduled Agent Run Digests
            </h4>
            <p className="text-[11px] text-slate-500">
              Receive summarized run reports whenever recurring cron agents complete.
            </p>
          </div>
          <input
            type="checkbox"
            checked={agentComplete}
            onChange={(e) => setAgentComplete(e.target.checked)}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
        </label>

        <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
              Agent Execution Failure Warnings
            </h4>
            <p className="text-[11px] text-slate-500">
              Immediately notify if an API quota expires or a connector fails.
            </p>
          </div>
          <input
            type="checkbox"
            checked={agentFailure}
            onChange={(e) => setAgentFailure(e.target.checked)}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
        </label>

        <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
          <div>
            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
              Product & Model Changelog
            </h4>
            <p className="text-[11px] text-slate-500">
              Receive notifications about newly supported frontier models and tools.
            </p>
          </div>
          <input
            type="checkbox"
            checked={marketingUpdates}
            onChange={(e) => setMarketingUpdates(e.target.checked)}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
        </label>
      </div>

      <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
        <Button size="sm" isLoading={isSaving} onClick={handleSave} leftIcon="solar:diskette-bold">
          Save Preferences
        </Button>
      </div>
    </div>
  );
}
