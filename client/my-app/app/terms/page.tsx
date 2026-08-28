import React from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white font-bold">
              <Icon icon="solar:atom-bold" size={20} />
            </div>
            <span className="text-base font-bold">Apex Agents</span>
          </Link>
          <Link href="/login" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
            Go to App →
          </Link>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
          <p className="text-xs text-slate-400">Last updated: August 28, 2026</p>
        </div>

        <div className="prose dark:prose-invert text-xs sm:text-sm space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            Welcome to Apex Agents. By accessing or utilizing our platform, skills marketplace, integrations hub, or autonomous execution engine, you agree to be bound by these Terms of Service.
          </p>

          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 pt-2">
            1. Authorized Use of Autonomous Agents
          </h3>
          <p>
            You agree not to configure autonomous scheduled agents or skills for deceptive scraping, automated spamming, unauthorized network intrusion, or violations of third-party API service terms.
          </p>

          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 pt-2">
            2. Intellectual Property & AI Generation Ownership
          </h3>
          <p>
            You retain all right, title, and ownership interest in and to the outputs, presentation decks, code files, spreadsheets, and custom skills generated through your queries.
          </p>

          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 pt-2">
            3. Service Level & Operational Availability
          </h3>
          <p>
            We strive for 99.9% uptime for scheduled background agent cron executions. In the event of upstream model provider downtime, automated retries are conducted according to exponential backoff.
          </p>
        </div>
      </div>
    </div>
  );
}
