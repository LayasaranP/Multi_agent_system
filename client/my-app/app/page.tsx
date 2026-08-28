"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/theme-provider";
import { MOCK_SKILLS, MOCK_AGENTS } from "@/lib/mock-data";

export default function LandingPage() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("yearly");

  const navLinks = [
    { label: "Product", href: "#features" },
    { label: "Skills", href: "#skills" },
    { label: "Plugins", href: "#plugins" },
    { label: "Agents", href: "#agents" },
    { label: "Pricing", href: "#pricing" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-600/20 font-sans">
      {/* 1. Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20">
              <Icon icon="solar:atom-bold" size={22} />
            </div>
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
              Apex Agents
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-600 dark:text-slate-300">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
              className="rounded-lg p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Icon
                icon={
                  resolvedTheme === "dark"
                    ? "solar:sun-2-bold-duotone"
                    : "solar:moon-stars-bold-duotone"
                }
                size={18}
              />
            </button>

            <Link href="/login" className="hidden sm:inline-block">
              <Button size="xs" variant="ghost">
                Sign In
              </Button>
            </Link>

            <Link href="/app">
              <Button size="xs" variant="primary" rightIcon="solar:alt-arrow-right-linear">
                Get Started Free
              </Button>
            </Link>

            {/* Mobile hamburger */}
            <button
              type="button"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 md:hidden"
              aria-label="Toggle menu"
            >
              <Icon icon={mobileNavOpen ? "solar:close-circle-bold" : "solar:hamburger-menu-linear"} size={22} />
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileNavOpen && (
          <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileNavOpen(false)}
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 py-1"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex gap-2">
              <Link href="/login" className="flex-1">
                <Button size="sm" variant="outline" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup" className="flex-1">
                <Button size="sm" variant="primary" className="w-full">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <Icon icon="solar:stars-bold" size={14} />
            <span>Introducing Apex Autonomous Platform 2.0</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.1]">
            One workspace for every{" "}
            <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 bg-clip-text text-transparent">
              task, skill, and AI agent.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Chat with frontier AI, orchestrate specialized domain skills (PDF, Excel, Frontend), connect your cloud apps, and schedule recurring background agents that get real work completed.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/signup">
              <Button size="lg" className="shadow-lg shadow-blue-500/25 px-7" rightIcon="solar:alt-arrow-right-linear">
                Get Started Free
              </Button>
            </Link>
            <Link href="/app">
              <Button size="lg" variant="outline" leftIcon="solar:play-circle-bold-duotone">
                Explore Live Workspace
              </Button>
            </Link>
          </div>

          {/* 3. Polished Product UI Mockup Preview */}
          <div className="relative mx-auto mt-14 max-w-5xl rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-2 sm:p-3 shadow-2xl backdrop-blur-xl">
            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950 flex flex-col h-[520px] text-left">
              {/* Mock Topbar */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/70 text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <span className="ml-3 font-semibold text-slate-700 dark:text-slate-300">
                    Q4 Competitor Analysis & Pitch Deck
                  </span>
                  <Badge variant="default" className="text-[9px]">
                    Claude 3.7 Sonnet
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                  <span>Connected: Google Drive, Canva</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                </div>
              </div>

              {/* Mock Workspace Body */}
              <div className="flex flex-1 overflow-hidden">
                {/* Mock Mini Sidebar */}
                <div className="hidden sm:flex flex-col w-48 border-r border-slate-100 dark:border-slate-800/70 bg-slate-50/50 dark:bg-slate-950/40 p-2 space-y-1 text-xs">
                  <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
                    Pinned Chats
                  </div>
                  <div className="rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2.5 py-1.5 font-medium truncate">
                    Build landing page
                  </div>
                  <div className="rounded-lg px-2.5 py-1.5 text-slate-500 dark:text-slate-400 truncate">
                    Analyze Q3 spreadsheet
                  </div>
                  <div className="rounded-lg px-2.5 py-1.5 text-slate-500 dark:text-slate-400 truncate">
                    Create investor pitch
                  </div>
                </div>

                {/* Mock Messages Feed */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="rounded-2xl rounded-br-sm bg-blue-600 text-white p-3 max-w-md">
                      Analyze our Q3 sales spreadsheet from Google Drive, identify our highest-margin tier, and draft a 5-slide pitch narrative.
                    </div>
                  </div>

                  {/* Assistant Message with Tool Cards */}
                  <div className="flex justify-start items-start gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white shrink-0 font-bold text-xs">
                      <Icon icon="solar:atom-bold" size={16} />
                    </div>
                    <div className="rounded-2xl rounded-bl-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-3.5 max-w-xl space-y-2">
                      {/* Tool step cards */}
                      <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-2 flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-2">
                          <Icon icon="logos:google-drive" size={14} />
                          <span className="font-semibold text-slate-700 dark:text-slate-300">Google Drive:</span>
                          <span className="text-slate-400">Parsed Q3_Sales_Report.xlsx (4.8 MB)</span>
                        </div>
                        <span className="text-emerald-500 font-bold">Completed ✓</span>
                      </div>

                      <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-2 flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-2">
                          <Icon icon="solar:chart-2-bold-duotone" size={14} className="text-blue-500" />
                          <span className="font-semibold text-slate-700 dark:text-slate-300">Excel Data Engine:</span>
                          <span className="text-slate-400">Identified Enterprise tier at 82% margin</span>
                        </div>
                        <span className="text-emerald-500 font-bold">Completed ✓</span>
                      </div>

                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed pt-1">
                        Here is your executive analysis: Enterprise contracts drove **$2.87M** of Q3 ARR with **zero churn**. I have composed your 5-slide outline with investor traction charts.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mock Composer */}
              <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/90">
                <div className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 px-3 py-2 text-xs text-slate-400">
                  <span>Ask anything or type a prompt...</span>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 text-[10px] font-semibold">
                      Skill: PPT Architect
                    </span>
                    <div className="h-6 w-6 rounded bg-blue-600 text-white flex items-center justify-center">
                      <Icon icon="solar:plain-bold" size={12} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Trusted & Integrated Services Strip */}
      <section className="border-y border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/30 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">
            Deep Native Integrations with Your Everyday Tools
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-80 hover:opacity-100 transition-opacity">
            {[
              { name: "Google Drive", icon: "logos:google-drive" },
              { name: "Gmail", icon: "logos:google-gmail" },
              { name: "Google Calendar", icon: "logos:google-calendar" },
              { name: "Google Maps", icon: "logos:google-maps" },
              { name: "Shopify", icon: "logos:shopify" },
              { name: "Figma", icon: "logos:figma" },
              { name: "Canva", icon: "simple-icons:canva" },
              { name: "Indeed", icon: "simple-icons:indeed" },
              { name: "DeepWiki", icon: "solar:book-bookmark-bold-duotone" },
            ].map((tool) => (
              <div key={tool.name} className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                <Icon icon={tool.icon} size={20} />
                <span>{tool.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Core Platform Features */}
      <section id="features" className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
              Comprehensive Platform Architecture
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Engineered for Real Knowledge Work
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Stop toggling between disconnected AI wrappers. Apex unifies chat, tools, specialized skills, and recurring agents under one roof.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Domain Skills Marketplace",
                desc: "Prebuilt capabilities for parsing PDFs, crafting slide decks, cleaning spreadsheets, and writing frontend code.",
                icon: "solar:magic-stick-3-bold-duotone",
              },
              {
                title: "Verified Plugin Connectors",
                desc: "Safely connect Google Drive, Gmail, Figma, and Shopify without ever exposing tokens to untrusted client code.",
                icon: "solar:plug-circle-bold-duotone",
              },
              {
                title: "Autonomous Scheduled Agents",
                desc: "Set and forget cron workflows. Automatically research competitors every Monday and email digests to your inbox.",
                icon: "solar:cpu-bolt-bold-duotone",
              },
              {
                title: "Asynchronous Tasks Engine",
                desc: "Delegate complex, multi-stage assignments and monitor live execution timelines from kickoff to artifact export.",
                icon: "solar:checklist-minimalistic-bold-duotone",
              },
              {
                title: "Searchable Persistent History",
                desc: "Full-text indexed conversation archive. Search message transcripts, code snippets, and citations in milliseconds.",
                icon: "solar:magnifer-line-duotone",
              },
              {
                title: "Custom Skill Authoring",
                desc: "Design internal skills tailored to your team's exact brand rules, regulatory guidelines, and system directives.",
                icon: "solar:code-bold-duotone",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 shadow-sm hover:border-blue-500/60 transition-all group"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-105 transition-transform">
                  <Icon icon={f.icon} size={26} />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {f.title}
                </h4>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Skills Showcase */}
      <section id="skills" className="py-16 sm:py-24 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Specialized Capabilities
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mt-1">
                Predefined Skills Ready on Day One
              </h3>
            </div>
            <Link href="/app/skills">
              <Button size="sm" variant="outline" rightIcon="solar:alt-arrow-right-linear">
                View All Skills
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {MOCK_SKILLS.slice(0, 6).map((skill) => (
              <div
                key={skill.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <Icon icon={skill.icon} size={22} />
                  </div>
                  <Badge variant="default" className="text-[10px]">
                    {skill.category}
                  </Badge>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {skill.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {skill.description}
                </p>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-850 text-[11px] text-slate-600 dark:text-slate-300 italic border border-slate-100 dark:border-slate-800">
                  &quot;{skill.examplePrompts?.[0]}&quot;
                </div>
                <Link href="/app">
                  <Button size="xs" variant="primary" className="w-full mt-2">
                    Use Skill
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Agents Showcase */}
      <section id="agents" className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
              Autonomous Workflows
            </span>
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Scheduled AI Agents That Work While You Sleep
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Configure recurring routines without engineering setup. The agent awakens, runs reasoning routines, searches files, and delivers insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_AGENTS.map((agent) => (
              <div
                key={agent.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 shadow-sm space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      <Icon icon="solar:cpu-bolt-bold-duotone" size={22} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {agent.name}
                      </h4>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {agent.schedule}
                      </span>
                    </div>
                  </div>
                  <Badge variant="success" className="capitalize text-[10px]">
                    {agent.status}
                  </Badge>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {agent.description}
                </p>

                <div className="rounded-xl bg-slate-50 dark:bg-slate-850 p-3 text-xs space-y-1.5 border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span>Last Run: {agent.lastRun ? "Completed successfully" : "Never"}</span>
                    <span>Success: {agent.successRate || 100}%</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Instructions: &quot;{agent.instructions.slice(0, 75)}...&quot;
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Pricing Section */}
      <section id="pricing" className="py-16 sm:py-24 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
              Transparent Plans
            </span>
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Scale Your Productivity
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Choose the plan tailored to your execution scale. Upgrade or downgrade anytime.
            </p>

            {/* Toggle */}
            <div className="inline-flex items-center rounded-xl bg-slate-200/80 dark:bg-slate-800 p-1 text-xs mt-4">
              <button
                type="button"
                onClick={() => setBillingPeriod("monthly")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  billingPeriod === "monthly"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingPeriod("yearly")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  billingPeriod === "yearly"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500"
                }`}
              >
                Yearly (Save 20%)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-6">
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">Free</h4>
                <p className="text-xs text-slate-500 mt-1">For individuals exploring AI capabilities.</p>
                <div className="mt-4">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white">$0</span>
                  <span className="text-xs text-slate-400"> / month</span>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <Icon icon="solar:check-read-bold" size={14} className="text-emerald-500" />
                  <span>Unlimited basic chat queries</span>
                </li>
                <li className="flex items-center gap-2">
                  <Icon icon="solar:check-read-bold" size={14} className="text-emerald-500" />
                  <span>Core prebuilt skills (PDF, DOCX)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Icon icon="solar:check-read-bold" size={14} className="text-emerald-500" />
                  <span>3 connected tool plugins</span>
                </li>
                <li className="flex items-center gap-2">
                  <Icon icon="solar:check-read-bold" size={14} className="text-emerald-500" />
                  <span>Community support</span>
                </li>
              </ul>

              <Link href="/signup">
                <Button size="sm" variant="outline" className="w-full">
                  Start Free
                </Button>
              </Link>
            </div>

            {/* Pro */}
            <div className="relative rounded-2xl border-2 border-blue-600 bg-white dark:bg-slate-900 p-6 space-y-6 shadow-xl">
              <div className="absolute -top-3 right-6 rounded-full bg-blue-600 text-white text-[10px] font-bold px-2.5 py-0.5 uppercase tracking-wider">
                Most Popular
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">Pro</h4>
                <p className="text-xs text-slate-500 mt-1">For professionals and autonomous builders.</p>
                <div className="mt-4">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                    {billingPeriod === "yearly" ? "$24" : "$29"}
                  </span>
                  <span className="text-xs text-slate-400"> / month</span>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <Icon icon="solar:check-read-bold" size={14} className="text-emerald-500" />
                  <span>Access Claude 3.7 & GPT-4o models</span>
                </li>
                <li className="flex items-center gap-2">
                  <Icon icon="solar:check-read-bold" size={14} className="text-emerald-500" />
                  <span>All specialized skills + custom skill authoring</span>
                </li>
                <li className="flex items-center gap-2">
                  <Icon icon="solar:check-read-bold" size={14} className="text-emerald-500" />
                  <span>10 active scheduled agents with cron triggers</span>
                </li>
                <li className="flex items-center gap-2">
                  <Icon icon="solar:check-read-bold" size={14} className="text-emerald-500" />
                  <span>Unlimited connected plugins</span>
                </li>
                <li className="flex items-center gap-2">
                  <Icon icon="solar:check-read-bold" size={14} className="text-emerald-500" />
                  <span>Priority task execution queue</span>
                </li>
              </ul>

              <Link href="/signup">
                <Button size="sm" variant="primary" className="w-full">
                  Upgrade to Pro
                </Button>
              </Link>
            </div>

            {/* Team */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-6">
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">Team / Enterprise</h4>
                <p className="text-xs text-slate-500 mt-1">For organizations requiring collaborative agents.</p>
                <div className="mt-4">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                    {billingPeriod === "yearly" ? "$64" : "$79"}
                  </span>
                  <span className="text-xs text-slate-400"> / seat / mo</span>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <Icon icon="solar:check-read-bold" size={14} className="text-emerald-500" />
                  <span>Shared skills & agent library</span>
                </li>
                <li className="flex items-center gap-2">
                  <Icon icon="solar:check-read-bold" size={14} className="text-emerald-500" />
                  <span>Role-based access control & audit logs</span>
                </li>
                <li className="flex items-center gap-2">
                  <Icon icon="solar:check-read-bold" size={14} className="text-emerald-500" />
                  <span>Unlimited concurrent autonomous agents</span>
                </li>
                <li className="flex items-center gap-2">
                  <Icon icon="solar:check-read-bold" size={14} className="text-emerald-500" />
                  <span>Dedicated account manager & 99.9% SLA</span>
                </li>
              </ul>

              <Link href="/signup">
                <Button size="sm" variant="outline" className="w-full">
                  Contact Enterprise
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Final Call to Action */}
      <section className="py-20 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Turn your ideas into completed work.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Join thousands of professionals and engineers accelerating work with specialized AI skills and autonomous background agents.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link href="/signup">
              <Button size="lg" variant="primary" rightIcon="solar:alt-arrow-right-linear">
                Start Free
              </Button>
            </Link>
            <Link href="/app">
              <Button size="lg" variant="outline">
                Explore Workspace
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 10. Comprehensive Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white font-bold">
                <Icon icon="solar:atom-bold" size={18} />
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-white">Apex Agents</span>
            </div>
            <p className="text-slate-500 max-w-sm">
              The unified workspace for AI chat, domain skills, external integrations, and autonomous recurring agents.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Platform</h4>
            <ul className="space-y-1.5 text-slate-500 dark:text-slate-400">
              <li><Link href="/app" className="hover:underline">AI Chat</Link></li>
              <li><Link href="/app/skills" className="hover:underline">Skills Marketplace</Link></li>
              <li><Link href="/app/plugins" className="hover:underline">Integrations Hub</Link></li>
              <li><Link href="/app/agents" className="hover:underline">Scheduled Agents</Link></li>
              <li><Link href="/app/tasks" className="hover:underline">Task Execution</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Resources</h4>
            <ul className="space-y-1.5 text-slate-500 dark:text-slate-400">
              <li><a href="#features" className="hover:underline">Features</a></li>
              <li><a href="#pricing" className="hover:underline">Pricing</a></li>
              <li><Link href="/privacy" className="hover:underline">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:underline">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Connect</h4>
            <div className="flex items-center gap-3 text-slate-400">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-slate-600 dark:hover:text-slate-200">
                <Icon icon="mdi:github" size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-slate-600 dark:hover:text-slate-200">
                <Icon icon="mdi:twitter" size={20} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-slate-600 dark:hover:text-slate-200">
                <Icon icon="mdi:linkedin" size={20} />
              </a>
              <a href="https://discord.com" target="_blank" rel="noreferrer" className="hover:text-slate-600 dark:hover:text-slate-200">
                <Icon icon="ic:baseline-discord" size={20} />
              </a>
            </div>
            <p className="text-slate-400 mt-4 text-[11px]">© 2026 Apex Agents Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
