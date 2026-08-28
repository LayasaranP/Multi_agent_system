"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { useAppStore } from "@/lib/store/app-store";
import { useToast } from "@/components/ui/toast";

export function OnboardingModal() {
  const toast = useToast();
  const { isOnboardingOpen, setIsOnboardingOpen, skills, plugins, connectPlugin } = useAppStore();

  const [step, setStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    "Development",
    "Productivity",
  ]);
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([
    "skill_frontend",
    "skill_pdf",
  ]);
  const [connectedPluginIds, setConnectedPluginIds] = useState<string[]>([
    "plugin_google_drive",
  ]);

  if (!isOnboardingOpen) return null;

  const interestsList = [
    { label: "Development", icon: "solar:code-bold-duotone" },
    { label: "Productivity", icon: "solar:check-circle-bold-duotone" },
    { label: "Design & UX", icon: "solar:palette-round-bold-duotone" },
    { label: "Data & Analytics", icon: "solar:chart-2-bold-duotone" },
    { label: "Marketing", icon: "solar:megaphone-bold-duotone" },
    { label: "Operations", icon: "solar:settings-bold-duotone" },
  ];

  const handleToggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleToggleSkill = (skillId: string) => {
    setSelectedSkillIds((prev) =>
      prev.includes(skillId) ? prev.filter((id) => id !== skillId) : [...prev, skillId]
    );
  };

  const handleTogglePlugin = (pluginId: string) => {
    setConnectedPluginIds((prev) => {
      const exists = prev.includes(pluginId);
      if (exists) {
        return prev.filter((id) => id !== pluginId);
      } else {
        connectPlugin(pluginId);
        return [...prev, pluginId];
      }
    });
  };

  const handleFinish = () => {
    setIsOnboardingOpen(false);
    toast.success("Workspace configured successfully! Welcome aboard.");
  };

  return (
    <Modal
      isOpen={isOnboardingOpen}
      onClose={() => setIsOnboardingOpen(false)}
      size="lg"
      hideCloseButton
    >
      <div className="space-y-6">
        {/* Step indicator */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">
              {step}
            </span>
            <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
              {step === 1 && "Welcome & Select Focus"}
              {step === 2 && "Enable AI Skills"}
              {step === 3 && "Connect Key Plugins"}
              {step === 4 && "Ready to Launch"}
            </span>
          </div>
          <span className="text-xs text-slate-400">Step {step} of 4</span>
        </div>

        {/* Step 1: Interests */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="text-center py-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 mb-3">
                <Icon icon="solar:atom-bold" size={28} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Welcome to Apex AI Workspace
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Select your primary domains so we can customize your skills, plugins, and agent templates.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
              {interestsList.map((item) => {
                const selected = selectedInterests.includes(item.label);
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleToggleInterest(item.label)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      selected
                        ? "border-blue-600 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold"
                        : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <Icon icon={item.icon} size={22} className="mb-1.5" />
                    <span className="text-xs">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Skills */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Choose Specialized AI Skills
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Skills give your assistant deep analytical and creative capabilities.
              </p>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {skills.slice(0, 5).map((skill) => {
                const isSelected = selectedSkillIds.includes(skill.id);
                return (
                  <div
                    key={skill.id}
                    onClick={() => handleToggleSkill(skill.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "border-blue-600 bg-blue-500/5 dark:bg-blue-950/20"
                        : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-blue-500">
                        <Icon icon={skill.icon} size={20} />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                          {skill.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{skill.description}</p>
                      </div>
                    </div>

                    <div
                      className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "border-slate-300 dark:border-slate-700"
                      }`}
                    >
                      {isSelected && <Icon icon="solar:check-read-bold" size={12} />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Plugins */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Connect External Tools
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Grant the AI permission to access files, calendars, and communications safely.
              </p>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {plugins.slice(0, 5).map((plug) => {
                const isConnected = plug.connected || connectedPluginIds.includes(plug.id);
                return (
                  <div
                    key={plug.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-800">
                        <Icon icon={plug.icon} size={20} />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                          {plug.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{plug.description}</p>
                      </div>
                    </div>

                    <Button
                      size="xs"
                      variant={isConnected ? "outline" : "primary"}
                      onClick={() => handleTogglePlugin(plug.id)}
                    >
                      {isConnected ? "Connected ✓" : "Connect"}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Finished */}
        {step === 4 && (
          <div className="text-center py-6 space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 ring-8 ring-emerald-500/5">
              <Icon icon="solar:check-circle-bold" size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Your Workspace is Fully Primed!
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You can now ask questions, attach files, invoke specialized skills, schedule recurring agents, and execute multi-step tasks.
            </p>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsOnboardingOpen(false)}
          >
            Skip for now
          </Button>

          <div className="flex items-center gap-2">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setStep((s) => s - 1)}
              >
                Back
              </Button>
            )}

            {step < 4 ? (
              <Button
                type="button"
                size="sm"
                onClick={() => setStep((s) => s + 1)}
                rightIcon="solar:alt-arrow-right-linear"
              >
                Continue
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                onClick={handleFinish}
                leftIcon="solar:rocket-bold-duotone"
              >
                Enter Workspace
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
