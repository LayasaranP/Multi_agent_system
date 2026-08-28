"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-4 ring-8 ring-blue-500/5">
        <Icon icon="solar:ghost-bold-duotone" size={36} />
      </div>
      <h1 className="text-3xl font-bold tracking-tight">404 — Page Not Found</h1>
      <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm">
        The workspace path or resource you requested could not be located.
      </p>
      <div className="flex items-center gap-3 mt-6">
        <Link href="/app">
          <Button size="sm" leftIcon="solar:home-2-bold">
            Back to Workspace
          </Button>
        </Link>
        <Link href="/">
          <Button size="sm" variant="outline">
            Home Page
          </Button>
        </Link>
      </div>
    </div>
  );
}
