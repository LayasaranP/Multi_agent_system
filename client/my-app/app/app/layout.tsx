"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { MobileDrawer, MobileBottomBar } from "@/components/layout/mobile-nav";
import { CommandPalette } from "@/components/layout/command-palette";
import { OnboardingModal } from "@/components/layout/onboarding-modal";
import { TaskCreatorModal } from "@/components/tasks/task-creator-modal";
import { AppProvider } from "@/lib/store/app-store";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <AppProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
        {/* Desktop Persistent Sidebar */}
        <Sidebar />

        {/* Mobile Drawer */}
        <MobileDrawer
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Workspace Column */}
        <div className="flex flex-1 flex-col h-full min-w-0 overflow-hidden">
          <Topbar onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

          {/* Scrollable Work Area */}
          <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
            {children}
          </main>
        </div>

        {/* Mobile Bottom Navigation */}
        <MobileBottomBar />

        {/* Global Modals */}
        <CommandPalette />
        <OnboardingModal />
        <TaskCreatorModal />
      </div>
    </AppProvider>
  );
}
