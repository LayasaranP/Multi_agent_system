"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { label: "Profile", href: "/app/settings/profile", icon: "solar:user-bold-duotone" },
    { label: "Account & Security", href: "/app/settings/account", icon: "solar:shield-keyhole-bold-duotone" },
    { label: "Appearance", href: "/app/settings/appearance", icon: "solar:palette-round-bold-duotone" },
    { label: "Connected Integrations", href: "/app/settings/integrations", icon: "solar:plug-circle-bold-duotone" },
    { label: "Notifications", href: "/app/settings/notifications", icon: "solar:bell-bing-bold-duotone" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Workspace Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal profile, security preferences, theme, and integration authorizations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors",
                  isActive
                    ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850 hover:text-slate-900 dark:hover:text-slate-200"
                )}
              >
                <Icon icon={item.icon} size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Content Pane */}
        <div className="md:col-span-3">{children}</div>
      </div>
    </div>
  );
}
