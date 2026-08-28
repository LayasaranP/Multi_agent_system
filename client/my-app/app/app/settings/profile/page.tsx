"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/lib/store/app-store";
import { useToast } from "@/components/ui/toast";

export default function ProfileSettingsPage() {
  const toast = useToast();
  const { user, updateUser } = useAppStore();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role || "Staff AI Engineer");
  const [company, setCompany] = useState(user.company || "Apex Synthetics");
  const [timezone, setTimezone] = useState(user.timezone);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      updateUser({ name, email, role, company, timezone });
      setIsSaving(false);
      toast.success("Profile updated successfully");
    }, 400);
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 space-y-6">
      <div>
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
          Personal Information
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Update your public profile details and regional workspace preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Avatar */}
        <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xl ring-4 ring-blue-500/20">
            {name ? name[0] : "U"}
          </div>
          <div>
            <Button size="xs" variant="outline" type="button" leftIcon="solar:camera-bold">
              Change Avatar
            </Button>
            <p className="text-[11px] text-slate-400 mt-1">JPG, GIF, or PNG. Max 2MB.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Name
            </label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Role / Title
            </label>
            <Input value={role} onChange={(e) => setRole(e.target.value)} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Organization
            </label>
            <Input value={company} onChange={(e) => setCompany(e.target.value)} />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Preferred Timezone
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
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button type="submit" size="sm" isLoading={isSaving} leftIcon="solar:diskette-bold">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
