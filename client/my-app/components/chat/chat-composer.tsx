"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { SkillPickerDialog } from "./skill-picker-dialog";
import { PluginPickerDialog } from "./plugin-picker-dialog";
import { useAppStore } from "@/lib/store/app-store";
import { Attachment } from "@/lib/types";

interface ChatComposerProps {
  onSendMessage: (content: string, attachments: Attachment[]) => void;
  isGenerating: boolean;
  onStop: () => void;
  placeholder?: string;
}

export function ChatComposer({
  onSendMessage,
  isGenerating,
  onStop,
  placeholder = "Ask anything, run a skill, or orchestrate an agent...",
}: ChatComposerProps) {
  const {
    skills,
    plugins,
    composerSkillIds,
    toggleComposerSkill,
    composerPluginIds,
    toggleComposerPlugin,
  } = useAppStore();

  const [prompt, setPrompt] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isSkillPickerOpen, setIsSkillPickerOpen] = useState(false);
  const [isPluginPickerOpen, setIsPluginPickerOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [prompt]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if ((!prompt.trim() && attachments.length === 0) || isGenerating) return;

    onSendMessage(prompt.trim(), attachments);
    setPrompt("");
    setAttachments([]);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    const newAttachments: Attachment[] = files.map((f) => ({
      id: `att_${Date.now()}_${Math.random()}`,
      name: f.name,
      size: f.size,
      type: f.type || "file",
      status: "completed",
    }));

    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!e.dataTransfer.files) return;

    const files = Array.from(e.dataTransfer.files);
    const newAttachments: Attachment[] = files.map((f) => ({
      id: `att_${Date.now()}_${Math.random()}`,
      name: f.name,
      size: f.size,
      type: f.type || "file",
      status: "completed",
    }));

    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={cn(
        "relative rounded-2xl border transition-all duration-200 bg-white dark:bg-slate-900/90 shadow-sm",
        isDragging
          ? "border-blue-500 ring-4 ring-blue-500/10 bg-blue-50/20"
          : "border-slate-200 dark:border-slate-800/90 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10"
      )}
    >
      {/* Selected Pills Ribbon */}
      {(composerSkillIds.length > 0 || composerPluginIds.length > 0 || attachments.length > 0) && (
        <div className="flex flex-wrap items-center gap-1.5 p-3 pb-0">
          {/* Skill pills */}
          {composerSkillIds.map((id) => {
            const skill = skills.find((s) => s.id === id);
            if (!skill) return null;
            return (
              <span
                key={id}
                className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 border border-blue-500/20"
              >
                <Icon icon={skill.icon} size={14} />
                <span>{skill.name}</span>
                <button
                  type="button"
                  onClick={() => toggleComposerSkill(id)}
                  className="hover:text-blue-800 dark:hover:text-blue-200 ml-0.5"
                >
                  <Icon icon="solar:close-circle-bold" size={13} />
                </button>
              </span>
            );
          })}

          {/* Plugin pills */}
          {composerPluginIds.map((id) => {
            const plugin = plugins.find((p) => p.id === id);
            if (!plugin) return null;
            return (
              <span
                key={id}
                className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 px-2.5 py-1 text-xs font-semibold text-purple-600 dark:text-purple-400 border border-purple-500/20"
              >
                <Icon icon={plugin.icon} size={14} />
                <span>{plugin.name}</span>
                <button
                  type="button"
                  onClick={() => toggleComposerPlugin(id)}
                  className="hover:text-purple-800 dark:hover:text-purple-200 ml-0.5"
                >
                  <Icon icon="solar:close-circle-bold" size={13} />
                </button>
              </span>
            );
          })}

          {/* Attachment chips */}
          {attachments.map((att) => (
            <span
              key={att.id}
              className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
            >
              <Icon icon="solar:paperclip-2-bold" size={13} className="text-slate-500" />
              <span className="truncate max-w-[120px]">{att.name}</span>
              <span className="text-[10px] text-slate-400">({formatFileSize(att.size)})</span>
              <button
                type="button"
                onClick={() => removeAttachment(att.id)}
                className="hover:text-red-500 ml-0.5"
              >
                <Icon icon="solar:close-circle-bold" size={13} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Main Textarea */}
      <textarea
        ref={textareaRef}
        rows={1}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isGenerating}
        className="w-full bg-transparent px-4 py-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none resize-none max-h-48"
      />

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileChange}
        accept=".pdf,.docx,.doc,.xlsx,.xls,.csv,.pptx,.png,.jpg,.jpeg,.txt,.json,.md"
      />

      {/* Toolbar Controls */}
      <div className="flex items-center justify-between px-3.5 pb-3 pt-1 border-t border-slate-100 dark:border-slate-800/60">
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Attach Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Attach file (PDF, Excel, Docx, Image)"
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Icon icon="solar:paperclip-2-linear" size={16} />
            <span className="hidden sm:inline">Attach</span>
          </button>

          {/* Skill Selector Button */}
          <button
            type="button"
            onClick={() => setIsSkillPickerOpen(true)}
            className={cn(
              "flex items-center gap-1 rounded-lg px-2 py-1 text-xs transition-colors",
              composerSkillIds.length > 0
                ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
          >
            <Icon icon="solar:magic-stick-3-bold-duotone" size={16} />
            <span>Skills</span>
            {composerSkillIds.length > 0 && (
              <span className="rounded-full bg-blue-600 text-white text-[10px] px-1 font-bold">
                {composerSkillIds.length}
              </span>
            )}
          </button>

          {/* Plugin Selector Button */}
          <button
            type="button"
            onClick={() => setIsPluginPickerOpen(true)}
            className={cn(
              "flex items-center gap-1 rounded-lg px-2 py-1 text-xs transition-colors",
              composerPluginIds.length > 0
                ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 font-semibold"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
          >
            <Icon icon="solar:plug-circle-bold-duotone" size={16} />
            <span>Plugins</span>
            {composerPluginIds.length > 0 && (
              <span className="rounded-full bg-purple-600 text-white text-[10px] px-1 font-bold">
                {composerPluginIds.length}
              </span>
            )}
          </button>

          {/* Voice input UI placeholder */}
          <button
            type="button"
            title="Voice input"
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden sm:inline-flex"
          >
            <Icon icon="solar:microphone-3-linear" size={16} />
          </button>
        </div>

        {/* Send or Stop Button */}
        <div>
          {isGenerating ? (
            <Button
              size="xs"
              variant="destructive"
              onClick={onStop}
              leftIcon="solar:stop-circle-bold"
              className="gap-1 px-3"
            >
              Stop
            </Button>
          ) : (
            <button
              type="button"
              disabled={!prompt.trim() && attachments.length === 0}
              onClick={handleSend}
              aria-label="Send prompt"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm hover:bg-blue-500 disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95 cursor-pointer"
            >
              <Icon icon="solar:plain-bold" size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Modals for contextual picker */}
      <SkillPickerDialog
        isOpen={isSkillPickerOpen}
        onClose={() => setIsSkillPickerOpen(false)}
      />
      <PluginPickerDialog
        isOpen={isPluginPickerOpen}
        onClose={() => setIsPluginPickerOpen(false)}
      />
    </div>
  );
}
