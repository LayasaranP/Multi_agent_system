"use client";

import React, { useState } from "react";
import { cn, formatTime } from "@/lib/utils";
import { Icon } from "@/components/ui/icon";
import { ToolExecutionCard } from "./tool-execution-card";
import { Message } from "@/lib/types";
import { useToast } from "@/components/ui/toast";

interface ChatMessagesProps {
  messages: Message[];
  userName?: string;
  onRegenerate?: () => void;
  onLikeToggle?: (messageId: string, isLike: boolean) => void;
}

export function ChatMessages({
  messages,
  userName = "Layasaran",
  onRegenerate,
  onLikeToggle,
}: ChatMessagesProps) {
  const toast = useToast();
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    toast.success("Code block copied");
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  // Helper to render markdown-like content cleanly without requiring heavy extra dependencies
  const renderFormattedContent = (content: string, messageId: string) => {
    if (!content) return null;

    // Split by code blocks first
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith("```")) {
        // Extract language and code
        const firstLineEnd = part.indexOf("\n");
        const lang = part.slice(3, firstLineEnd).trim() || "plaintext";
        const code = part.slice(firstLineEnd + 1, -3);
        const codeBlockId = `${messageId}_code_${index}`;

        return (
          <div
            key={index}
            className="my-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-100 overflow-hidden font-mono text-xs shadow-md"
          >
            <div className="flex items-center justify-between px-3.5 py-1.5 bg-slate-950/80 border-b border-slate-800 text-[11px] text-slate-400">
              <span className="font-semibold text-slate-300 uppercase tracking-wider">
                {lang}
              </span>
              <button
                type="button"
                onClick={() => handleCopyCode(code, codeBlockId)}
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                <Icon
                  icon={copiedCodeId === codeBlockId ? "solar:check-circle-bold" : "solar:copy-linear"}
                  size={13}
                />
                <span>{copiedCodeId === codeBlockId ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <pre className="p-3.5 overflow-x-auto leading-relaxed text-[12px] selection:bg-blue-600/30">
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      // Format markdown lines: headings, tables, bullet points, bold
      const lines = part.split("\n");
      const formattedLines: React.ReactNode[] = [];
      let inTable = false;
      let tableRows: string[][] = [];

      lines.forEach((line, lIdx) => {
        // Table line detection
        if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
          if (!inTable) inTable = true;
          // Skip divider rows like | :--- | :--- |
          if (!line.includes("---")) {
            const cells = line
              .split("|")
              .slice(1, -1)
              .map((c) => c.trim());
            tableRows.push(cells);
          }
          return;
        } else if (inTable) {
          // Flush table
          inTable = false;
          formattedLines.push(
            <div key={`table_${lIdx}`} className="my-3 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                {tableRows.length > 0 && (
                  <thead className="bg-slate-50 dark:bg-slate-900/60 font-semibold text-slate-700 dark:text-slate-200">
                    <tr>
                      {tableRows[0].map((th, hIdx) => (
                        <th key={hIdx} className="px-3 py-2 text-left">
                          {th}
                        </th>
                      ))}
                    </tr>
                  </thead>
                )}
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-950/40">
                  {tableRows.slice(1).map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="px-3 py-2 text-slate-600 dark:text-slate-300">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
          tableRows = [];
        }

        // Headings
        if (line.startsWith("### ")) {
          formattedLines.push(
            <h3 key={lIdx} className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-3 mb-1.5">
              {line.replace("### ", "")}
            </h3>
          );
        } else if (line.startsWith("## ")) {
          formattedLines.push(
            <h2 key={lIdx} className="text-base font-bold text-slate-900 dark:text-slate-100 mt-4 mb-2">
              {line.replace("## ", "")}
            </h2>
          );
        } else if (line.startsWith("# ")) {
          formattedLines.push(
            <h1 key={lIdx} className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-4 mb-2">
              {line.replace("# ", "")}
            </h1>
          );
        } else if (line.startsWith("* ") || line.startsWith("- ")) {
          // Bullet point
          formattedLines.push(
            <li key={lIdx} className="ml-4 list-disc text-slate-700 dark:text-slate-300 my-0.5 leading-relaxed">
              {renderInlineStyles(line.slice(2))}
            </li>
          );
        } else if (/^\d+\.\s/.test(line)) {
          // Numbered list
          formattedLines.push(
            <li key={lIdx} className="ml-4 list-decimal text-slate-700 dark:text-slate-300 my-0.5 leading-relaxed">
              {renderInlineStyles(line.replace(/^\d+\.\s/, ""))}
            </li>
          );
        } else if (line.trim() === "") {
          formattedLines.push(<div key={lIdx} className="h-2" />);
        } else {
          formattedLines.push(
            <p key={lIdx} className="text-slate-700 dark:text-slate-300 my-1 leading-relaxed">
              {renderInlineStyles(line)}
            </p>
          );
        }
      });

      // Catch pending table at end of part
      if (inTable && tableRows.length > 0) {
        formattedLines.push(
          <div key="table_end" className="my-3 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900/60 font-semibold text-slate-700 dark:text-slate-200">
                <tr>
                  {tableRows[0].map((th, hIdx) => (
                    <th key={hIdx} className="px-3 py-2 text-left">{th}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-950/40">
                {tableRows.slice(1).map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-3 py-2 text-slate-600 dark:text-slate-300">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }

      return <React.Fragment key={index}>{formattedLines}</React.Fragment>;
    });
  };

  // Helper for bold and inline code styling
  const renderInlineStyles = (text: string) => {
    // Process **bold** and `code`
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((seg, i) => {
      if (seg.startsWith("**") && seg.endsWith("**")) {
        return (
          <strong key={i} className="font-semibold text-slate-900 dark:text-slate-100">
            {seg.slice(2, -2)}
          </strong>
        );
      }
      if (seg.startsWith("`") && seg.endsWith("`")) {
        return (
          <code
            key={i}
            className="rounded bg-slate-100 dark:bg-slate-800/90 px-1.5 py-0.5 font-mono text-[11px] text-blue-600 dark:text-blue-400 border border-slate-200/60 dark:border-slate-800"
          >
            {seg.slice(1, -1)}
          </code>
        );
      }
      return seg;
    });
  };

  return (
    <div className="space-y-6 py-4">
      {messages.map((message) => {
        const isUser = message.role === "user";

        return (
          <div
            key={message.id}
            className={cn(
              "flex gap-3 text-xs sm:text-sm animate-in fade-in duration-150",
              isUser ? "justify-end" : "justify-start"
            )}
          >
            {/* Assistant Avatar */}
            {!isUser && (
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white font-bold shrink-0 shadow-sm mt-0.5">
                <Icon icon="solar:atom-bold" size={18} />
              </div>
            )}

            {/* Bubble */}
            <div
              className={cn(
                "group relative max-w-[88%] sm:max-w-[78%] rounded-2xl p-4 transition-all",
                isUser
                  ? "bg-blue-600 text-white rounded-br-sm shadow-sm"
                  : "border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 rounded-bl-sm shadow-sm"
              )}
            >
              {/* Message Attachments if user */}
              {isUser && message.attachments && message.attachments.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {message.attachments.map((att) => (
                    <span
                      key={att.id}
                      className="inline-flex items-center gap-1 rounded-md bg-white/20 px-2 py-0.5 text-xs text-white"
                    >
                      <Icon icon="solar:paperclip-2-bold" size={12} />
                      <span className="truncate max-w-[120px]">{att.name}</span>
                    </span>
                  ))}
                </div>
              )}

              {/* Collapsible Tool Execution Cards if assistant */}
              {!isUser && message.toolExecutions && message.toolExecutions.length > 0 && (
                <div className="mb-3 space-y-1">
                  {message.toolExecutions.map((tool) => (
                    <ToolExecutionCard key={tool.id} tool={tool} />
                  ))}
                </div>
              )}

              {/* Message Content */}
              <div className="prose-sm max-w-none break-words">
                {isUser ? (
                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                ) : (
                  <div>
                    {renderFormattedContent(message.content, message.id)}
                    {message.status === "streaming" && (
                      <span className="inline-block h-4 w-1.5 bg-blue-500 animate-pulse ml-0.5 align-middle" />
                    )}
                  </div>
                )}
              </div>

              {/* Assistant Message Actions Toolbar */}
              {!isUser && message.status !== "streaming" && (
                <div className="flex items-center gap-2 pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/60 text-slate-400">
                  <button
                    type="button"
                    onClick={() => handleCopyText(message.content)}
                    className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    title="Copy full message"
                  >
                    <Icon icon="solar:copy-linear" size={14} />
                  </button>

                  {onLikeToggle && (
                    <>
                      <button
                        type="button"
                        onClick={() => onLikeToggle(message.id, true)}
                        className={cn(
                          "p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
                          message.liked
                            ? "text-emerald-500 font-bold"
                            : "hover:text-slate-600 dark:hover:text-slate-200"
                        )}
                        title="Good response"
                      >
                        <Icon icon="solar:like-bold" size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onLikeToggle(message.id, false)}
                        className={cn(
                          "p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
                          message.disliked
                            ? "text-red-500 font-bold"
                            : "hover:text-slate-600 dark:hover:text-slate-200"
                        )}
                        title="Needs improvement"
                      >
                        <Icon icon="solar:dislike-bold" size={14} />
                      </button>
                    </>
                  )}

                  {onRegenerate && (
                    <button
                      type="button"
                      onClick={onRegenerate}
                      className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                      title="Regenerate response"
                    >
                      <Icon icon="solar:restart-linear" size={14} />
                    </button>
                  )}

                  <span className="text-[10px] text-slate-400 ml-auto">
                    {formatTime(message.createdAt)}
                  </span>
                </div>
              )}
            </div>

            {/* User Avatar */}
            {isUser && (
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs shrink-0 mt-0.5">
                {userName ? userName[0] : "U"}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
