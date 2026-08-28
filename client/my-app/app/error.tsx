"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Workspace Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 mb-4 ring-8 ring-red-500/5">
        <Icon icon="solar:danger-triangle-bold" size={36} />
      </div>
      <h2 className="text-2xl font-bold tracking-tight">Something went wrong</h2>
      <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md">
        An unhandled exception occurred in this workspace segment. Our automated diagnostics have recorded the issue.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Button size="sm" onClick={() => reset()} leftIcon="solar:restart-bold">
          Try Again
        </Button>
        <Link href="/app">
          <Button size="sm" variant="outline">
            Return to Workspace
          </Button>
        </Link>
      </div>
    </div>
  );
}
