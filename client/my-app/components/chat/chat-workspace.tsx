"use client";

import React, { useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/icon";
import { ChatComposer } from "./chat-composer";
import { ChatMessages } from "./chat-messages";
import { useAppStore } from "@/lib/store/app-store";
import { Attachment } from "@/lib/types";

interface ChatWorkspaceProps {
  conversationId?: string;
}

export function ChatWorkspace({ conversationId }: ChatWorkspaceProps) {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    user,
    conversations,
    activeConversationId,
    createConversation,
    messages,
    sendMessage,
    isGenerating,
    stopGeneration,
    toggleLikeMessage,
    skills,
    composerSkillIds,
    toggleComposerSkill,
  } = useAppStore();

  const currentId = conversationId || activeConversationId;
  const currentConvo = conversations.find((c) => c.id === currentId);
  const currentMessages = useMemo(() => {
    return currentId && messages[currentId] ? messages[currentId] : [];
  }, [currentId, messages]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages, isGenerating]);

  const handleSendMessage = async (content: string, attachments: Attachment[]) => {
    let targetConvoId = currentId;

    if (!targetConvoId) {
      // Create new conversation
      const newConvo = createConversation(
        content.slice(0, 36) + (content.length > 36 ? "..." : "")
      );
      targetConvoId = newConvo.id;
      router.push(`/app/chat/${newConvo.id}`);
    }

    await sendMessage(targetConvoId, content, attachments);
  };

  const handleSuggestionClick = (prompt: string, skillId?: string) => {
    if (skillId && !composerSkillIds.includes(skillId)) {
      toggleComposerSkill(skillId);
    }
    handleSendMessage(prompt, []);
  };

  const suggestions = [
    {
      title: "Build a React Component",
      prompt: "Build a responsive SaaS pricing calculator component using React and Tailwind CSS with monthly/yearly toggle.",
      skillId: "skill_frontend",
      icon: "solar:code-bold-duotone",
      category: "Frontend",
    },
    {
      title: "Analyze Sales Spreadsheets",
      prompt: "Analyze our Q3 enterprise sales spreadsheet, find anomalies in margin growth, and summarize the top accounts.",
      skillId: "skill_excel",
      icon: "solar:chart-2-bold-duotone",
      category: "Data Analyst",
    },
    {
      title: "Create Investor Pitch Deck",
      prompt: "Create a 10-slide Series A pitch deck outline for our AI productivity platform including unit economics.",
      skillId: "skill_ppt",
      icon: "solar:presentation-graph-bold-duotone",
      category: "Design",
    },
    {
      title: "Summarize PDF Research",
      prompt: "Summarize this technical PDF into five executive insights with key citations and implications.",
      skillId: "skill_pdf",
      icon: "solar:document-text-bold-duotone",
      category: "Documents",
    },
  ];

  return (
    <div className="relative flex flex-col h-[calc(100vh-3.5rem)] max-w-5xl mx-auto w-full px-4 sm:px-6">
      {/* Active Conversation Context Header */}
      {currentConvo && (
        <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800/80 text-xs shrink-0">
          <div className="flex items-center gap-2 truncate">
            <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">
              {currentConvo.title}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500 font-mono text-[11px]">
              {currentConvo.selectedModel || "Claude 3.7 Sonnet"}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {currentConvo.activeSkillIds && currentConvo.activeSkillIds.length > 0 && (
              <div className="hidden sm:flex items-center gap-1">
                {currentConvo.activeSkillIds.map((sid) => {
                  const s = skills.find((item) => item.id === sid);
                  if (!s) return null;
                  return (
                    <span
                      key={sid}
                      className="inline-flex items-center gap-1 rounded bg-blue-500/10 px-2 py-0.5 text-[10px] text-blue-600 dark:text-blue-400 font-medium"
                    >
                      <Icon icon={s.icon} size={12} />
                      {s.name}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Messages or Empty Welcome State */}
      <div className="flex-1 overflow-y-auto pr-1">
        {currentMessages.length > 0 ? (
          <>
            <ChatMessages
              messages={currentMessages}
              userName={user.name}
              onRegenerate={() => {
                const lastUser = [...currentMessages].reverse().find((m) => m.role === "user");
                if (lastUser && currentId) {
                  sendMessage(currentId, lastUser.content, lastUser.attachments);
                }
              }}
              onLikeToggle={(msgId, isLike) => {
                if (currentId) toggleLikeMessage(currentId, msgId, isLike);
              }}
            />
            <div ref={messagesEndRef} />
          </>
        ) : (
          /* Empty Chat Welcome State */
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 py-8 max-w-2xl mx-auto">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 mb-4 ring-8 ring-blue-500/5">
              <Icon icon="solar:atom-bold" size={32} />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              What can I help you accomplish today?
            </h2>

            <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md">
              Ask anything, select domain skills, connect your tools, or orchestrate autonomous scheduled agents.
            </p>

            {/* Suggested Prompts Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 w-full text-left">
              {suggestions.map((item) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => handleSuggestionClick(item.prompt, item.skillId)}
                  className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 hover:border-blue-500 dark:hover:border-blue-500/80 hover:shadow-md transition-all group text-left cursor-pointer"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0 group-hover:scale-105 transition-transform">
                    <Icon icon={item.icon} size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 uppercase font-mono">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                      {item.prompt}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Persistent Bottom Composer */}
      <div className="pt-2 pb-4 shrink-0">
        <ChatComposer
          onSendMessage={handleSendMessage}
          isGenerating={isGenerating}
          onStop={stopGeneration}
        />
        <div className="flex items-center justify-center gap-4 mt-2 text-[10px] text-slate-400 text-center">
          <span>Apex AI models can make mistakes. Verify important financial or legal output.</span>
        </div>
      </div>
    </div>
  );
}
