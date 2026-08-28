"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore } from "@/lib/store/app-store";
import { useToast } from "@/components/ui/toast";

export default function CreateAgentPage() {
  const router = useRouter();
  const toast = useToast();
  const { addAgent, skills, plugins } = useAppStore();

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedPlugins, setSelectedPlugins] = useState<string[]>([]);

  // Schedule friendly state
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [dayOfWeek, setDayOfWeek] = useState("Monday");
  const [timeOfDay, setTimeOfDay] = useState("09:00");
  const [timezone, setTimezone] = useState("Asia/Kolkata");

  // Notifications state
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyInApp, setNotifyInApp] = useState(true);
  const [notifyGmail, setNotifyGmail] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleSkill = (id: string) => {
    setSelectedSkills((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const togglePlugin = (id: string) => {
    setSelectedPlugins((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const computedSchedule =
    frequency === "daily"
      ? `Every day at ${timeOfDay}`
      : frequency === "weekly"
      ? `Every ${dayOfWeek} at ${timeOfDay}`
      : `Monthly on the 1st at ${timeOfDay}`;

  const handleCreateAgent = (status: "active" | "draft") => {
    if (!name.trim() || !instructions.trim()) {
      toast.error("Please provide both an agent name and system instructions.");
      return;
    }

    setIsSubmitting(true);
    const newAgent = addAgent({
      name: name.trim(),
      description: description.trim() || "Automated scheduled workflow.",
      instructions: instructions.trim(),
      status,
      schedule: computedSchedule,
      timezone,
      skillIds: selectedSkills,
      pluginIds: selectedPlugins,
      notifications: {
        email: notifyEmail,
        inApp: notifyInApp,
        gmail: notifyGmail,
      },
    });

    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(
        status === "active"
          ? `Agent "${newAgent.name}" activated!`
          : `Agent "${newAgent.name}" saved as draft.`
      );
      router.push(`/app/agents/${newAgent.id}`);
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/app/agents" className="hover:text-slate-600 dark:hover:text-slate-200">
          Scheduled Agents
        </Link>
        <span>/</span>
        <span className="text-slate-700 dark:text-slate-300 font-medium">Create Agent Wizard</span>
      </div>

      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Create Scheduled Agent
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Automate repetitive research, reporting, and operational jobs on a reliable cadence.
        </p>

        {/* Step indicator */}
        <div className="flex items-center justify-between mt-6 overflow-x-auto no-scrollbar py-1">
          {[
            { num: 1, label: "Define" },
            { num: 2, label: "Skills" },
            { num: 3, label: "Plugins" },
            { num: 4, label: "Schedule" },
            { num: 5, label: "Alerts" },
            { num: 6, label: "Review" },
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-2 shrink-0">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  step === s.num
                    ? "bg-blue-600 text-white ring-4 ring-blue-500/20"
                    : step > s.num
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                }`}
              >
                {step > s.num ? "✓" : s.num}
              </span>
              <span
                className={`text-xs font-medium ${
                  step === s.num
                    ? "text-blue-600 dark:text-blue-400 font-semibold"
                    : "text-slate-400"
                }`}
              >
                {s.label}
              </span>
              {s.num < 6 && <div className="h-0.5 w-6 sm:w-12 bg-slate-200 dark:bg-slate-800 mx-1" />}
            </div>
          ))}
        </div>
      </div>

      {/* Wizard Steps Container */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 shadow-sm">
        {/* Step 1: Define Agent */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                1. Define Agent Persona & Objective
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Give your agent a recognizable name and explicit execution guidelines.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Agent Name *
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Weekly Competitor Pricing Tracker"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Short Description
              </label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly state what this recurring automation executes..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Instructions & Operational Prompts *
              </label>
              <Textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={5}
                placeholder="Every Monday morning, search top 5 competitor sites for pricing tier updates, summarize shifts into a 3-bullet brief, and draft an outbound email digest..."
              />
            </div>
          </div>
        )}

        {/* Step 2: Select Skills */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                2. Select Specialized Skills
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Choose which skills the agent can run during its autonomous lifecycle.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
              {skills.map((skill) => {
                const isSelected = selectedSkills.includes(skill.id);
                return (
                  <div
                    key={skill.id}
                    onClick={() => toggleSkill(skill.id)}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "border-blue-600 bg-blue-500/10 dark:bg-blue-950/20"
                        : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850"
                    }`}
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                      <Icon icon={skill.icon} size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {skill.name}
                        </span>
                        <div
                          className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? "bg-blue-600 border-blue-600 text-white"
                              : "border-slate-300 dark:border-slate-700"
                          }`}
                        >
                          {isSelected && <Icon icon="solar:check-read-bold" size={10} />}
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                        {skill.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Select Plugins */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                3. Connect Required Plugins
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Grant external tool access for input document reading or output distribution.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
              {plugins.map((plugin) => {
                const isSelected = selectedPlugins.includes(plugin.id);
                return (
                  <div
                    key={plugin.id}
                    onClick={() => togglePlugin(plugin.id)}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "border-purple-600 bg-purple-500/10 dark:bg-purple-950/20"
                        : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850"
                    }`}
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                      <Icon icon={plugin.icon} size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {plugin.name}
                        </span>
                        <div
                          className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? "bg-purple-600 border-purple-600 text-white"
                              : "border-slate-300 dark:border-slate-700"
                          }`}
                        >
                          {isSelected && <Icon icon="solar:check-read-bold" size={10} />}
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                        {plugin.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Schedule */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                4. Schedule Execution Cadence
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Set human-friendly schedule parameters without writing complicated cron syntax.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(["daily", "weekly", "monthly"] as const).map((freq) => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => setFrequency(freq)}
                  className={`p-3 rounded-xl border text-xs font-semibold capitalize transition-all ${
                    frequency === freq
                      ? "border-blue-600 bg-blue-500/10 text-blue-600 dark:text-blue-400"
                      : "border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  {freq}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {frequency === "weekly" && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Day of the Week
                  </label>
                  <select
                    value={dayOfWeek}
                    onChange={(e) => setDayOfWeek(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-slate-100"
                  >
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((d) => (
                      <option key={d} value={d}>
                        Every {d}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Time of Day
                </label>
                <Input
                  type="time"
                  value={timeOfDay}
                  onChange={(e) => setTimeOfDay(e.target.value)}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Timezone
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs text-slate-900 dark:text-slate-100"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST - UTC+05:30)</option>
                  <option value="America/New_York">America/New_York (EST - UTC-05:00)</option>
                  <option value="America/Los_Angeles">America/Los_Angeles (PST - UTC-08:00)</option>
                  <option value="Europe/London">Europe/London (GMT - UTC+00:00)</option>
                  <option value="Europe/Berlin">Europe/Berlin (CET - UTC+01:00)</option>
                </select>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 text-xs flex items-center justify-between">
              <span className="text-slate-500">Summary Schedule:</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {computedSchedule} ({timezone})
              </span>
            </div>
          </div>
        )}

        {/* Step 5: Notifications */}
        {step === 5 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                5. Notification Channels
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Determine how and where the agent dispatches completed summaries and alerts.
              </p>
            </div>

            <div className="space-y-2">
              <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Icon icon="solar:letter-bold-duotone" size={20} className="text-blue-500" />
                  <div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      Email Notification
                    </p>
                    <p className="text-[11px] text-slate-400">Send an executive summary to your account email</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Icon icon="solar:bell-bing-bold-duotone" size={20} className="text-purple-500" />
                  <div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      In-App Notification Drawer
                    </p>
                    <p className="text-[11px] text-slate-400">Display alerts in your workspace topbar</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifyInApp}
                  onChange={(e) => setNotifyInApp(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Icon icon="logos:google-gmail" size={20} />
                  <div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      Gmail Distribution List
                    </p>
                    <p className="text-[11px] text-slate-400">Dispatch automated report directly via Gmail API</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifyGmail}
                  onChange={(e) => setNotifyGmail(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>
        )}

        {/* Step 6: Review & Activate */}
        {step === 6 && (
          <div className="space-y-5">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                6. Review & Activate Agent
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Verify the automated configuration before launching your scheduled agent.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Agent Name:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{name || "Untitled"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Cadence:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{computedSchedule}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Timezone:</span>
                <span className="text-slate-700 dark:text-slate-300">{timezone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Assigned Skills:</span>
                <span className="text-slate-700 dark:text-slate-300">{selectedSkills.length} selected</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Connected Plugins:</span>
                <span className="text-slate-700 dark:text-slate-300">{selectedPlugins.length} active</span>
              </div>
            </div>

            <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-200/40 dark:border-blue-900/40 text-xs text-blue-700 dark:text-blue-300 flex items-start gap-2">
              <Icon icon="solar:info-circle-bold" size={16} className="shrink-0 mt-0.5" />
              <span>
                Once activated, this agent will automatically wake up at the scheduled time, run the skills, and dispatch outputs according to your notification settings.
              </span>
            </div>
          </div>
        )}

        {/* Wizard Footer Controls */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={step === 1}
            onClick={() => setStep((s) => Math.max(1, s - 1))}
          >
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {step < 6 ? (
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  if (step === 1 && (!name.trim() || !instructions.trim())) {
                    toast.error("Please fill in Agent Name and Instructions.");
                    return;
                  }
                  setStep((s) => Math.min(6, s + 1));
                }}
                rightIcon="solar:alt-arrow-right-linear"
              >
                Next Step
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  isLoading={isSubmitting}
                  onClick={() => handleCreateAgent("draft")}
                >
                  Save Draft
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  isLoading={isSubmitting}
                  onClick={() => handleCreateAgent("active")}
                  leftIcon="solar:bolt-circle-bold"
                >
                  Activate Agent
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
