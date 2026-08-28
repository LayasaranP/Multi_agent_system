import React from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";

export default function PrivacyPolicyPage() {
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
          <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-xs text-slate-400">Last updated: August 28, 2026</p>
        </div>

        <div className="prose dark:prose-invert text-xs sm:text-sm space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            At Apex Agents (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), we take your privacy and data security seriously. This Privacy Policy details how we handle personal data, workspace credentials, integration tokens, and file inputs.
          </p>

          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 pt-2">
            1. Zero Training on Customer Data
          </h3>
          <p>
            We strictly enforce that your uploaded documents, private messages, spreadsheet rows, and external tool data are never used to train foundation models without explicit written consent.
          </p>

          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 pt-2">
            2. Token Encryption & Third-Party Permissions
          </h3>
          <p>
            OAuth access tokens for Google Drive, Gmail, Figma, and other integrated plugins are securely encrypted at rest utilizing AES-256 and never transmitted to untrusted client runtimes.
          </p>

          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 pt-2">
            3. Data Retention & Erasure
          </h3>
          <p>
            You maintain full sovereignty over your workspace data. You may delete conversations, custom skills, or your entire organization account at any time via the Workspace Settings menu.
          </p>
        </div>
      </div>
    </div>
  );
}
