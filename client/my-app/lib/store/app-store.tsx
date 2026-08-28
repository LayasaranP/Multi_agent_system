"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  User,
  Conversation,
  Message,
  Skill,
  Plugin,
  Agent,
  Task,
  Notification,
  Attachment,
  ToolExecution,
} from "@/lib/types";
import {
  MOCK_USER,
  MOCK_CONVERSATIONS,
  MOCK_MESSAGES,
  MOCK_SKILLS,
  MOCK_PLUGINS,
  MOCK_AGENTS,
  MOCK_TASKS,
  MOCK_NOTIFICATIONS,
} from "@/lib/mock-data";

interface AppContextType {
  user: User;
  updateUser: (updates: Partial<User>) => void;
  // Conversations
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  createConversation: (initialTitle?: string, skillIds?: string[], pluginIds?: string[]) => Conversation;
  renameConversation: (id: string, newTitle: string) => void;
  pinConversation: (id: string) => void;
  archiveConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  // Messages
  messages: Record<string, Message[]>;
  sendMessage: (conversationId: string, content: string, attachments?: Attachment[]) => Promise<void>;
  toggleLikeMessage: (conversationId: string, messageId: string, isLike: boolean) => void;
  isGenerating: boolean;
  stopGeneration: () => void;
  // Composer selections
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  composerSkillIds: string[];
  toggleComposerSkill: (skillId: string) => void;
  clearComposerSkills: () => void;
  composerPluginIds: string[];
  toggleComposerPlugin: (pluginId: string) => void;
  clearComposerPlugins: () => void;
  // Skills
  skills: Skill[];
  addCustomSkill: (skill: Omit<Skill, "id" | "isBuiltIn" | "usageCount" | "rating">) => Skill;
  toggleSkillEnabled: (id: string) => void;
  deleteSkill: (id: string) => void;
  // Plugins
  plugins: Plugin[];
  connectPlugin: (id: string, accountEmail?: string) => void;
  disconnectPlugin: (id: string) => void;
  // Agents
  agents: Agent[];
  addAgent: (agent: Omit<Agent, "id" | "lastRun" | "executions" | "successRate">) => Agent;
  toggleAgentStatus: (id: string) => void;
  runAgentNow: (id: string) => void;
  deleteAgent: (id: string) => void;
  // Tasks
  tasks: Task[];
  createTask: (task: Omit<Task, "id" | "progress" | "createdAt" | "updatedAt" | "steps">) => Task;
  updateTaskStatus: (id: string, status: Task["status"]) => void;
  deleteTask: (id: string) => void;
  // Notifications
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadCount: number;
  // Modals & UI
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isTaskModalOpen: boolean;
  setIsTaskModalOpen: (open: boolean) => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: "app_user_v1",
  CONVERSATIONS: "app_convos_v1",
  MESSAGES: "app_messages_v1",
  SKILLS: "app_skills_v1",
  PLUGINS: "app_plugins_v1",
  AGENTS: "app_agents_v1",
  TASKS: "app_tasks_v1",
  NOTIFICATIONS: "app_notifs_v1",
  MODEL: "app_selected_model_v1",
};

function getSaved<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(() => getSaved(STORAGE_KEYS.USER, MOCK_USER));
  const [conversations, setConversations] = useState<Conversation[]>(() =>
    getSaved(STORAGE_KEYS.CONVERSATIONS, MOCK_CONVERSATIONS)
  );
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>(() =>
    getSaved(STORAGE_KEYS.MESSAGES, MOCK_MESSAGES)
  );
  const [skills, setSkills] = useState<Skill[]>(() => getSaved(STORAGE_KEYS.SKILLS, MOCK_SKILLS));
  const [plugins, setPlugins] = useState<Plugin[]>(() => getSaved(STORAGE_KEYS.PLUGINS, MOCK_PLUGINS));
  const [agents, setAgents] = useState<Agent[]>(() => getSaved(STORAGE_KEYS.AGENTS, MOCK_AGENTS));
  const [tasks, setTasks] = useState<Task[]>(() => getSaved(STORAGE_KEYS.TASKS, MOCK_TASKS));
  const [notifications, setNotifications] = useState<Notification[]>(() =>
    getSaved(STORAGE_KEYS.NOTIFICATIONS, MOCK_NOTIFICATIONS)
  );

  const [selectedModel, setSelectedModel] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(STORAGE_KEYS.MODEL) || "Claude 3.7 Sonnet";
    }
    return "Claude 3.7 Sonnet";
  });

  const [composerSkillIds, setComposerSkillIds] = useState<string[]>([]);
  const [composerPluginIds, setComposerPluginIds] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Sync to localStorage on state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PLUGINS, JSON.stringify(plugins));
  }, [plugins]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(agents));
  }, [agents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MODEL, selectedModel);
  }, [selectedModel]);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  }, []);

  // Conversation Actions
  const createConversation = useCallback(
    (initialTitle = "New Conversation", skillIds: string[] = [], pluginIds: string[] = []) => {
      const newConvo: Conversation = {
        id: `conv_${Date.now()}`,
        title: initialTitle,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        pinned: false,
        archived: false,
        selectedModel,
        activeSkillIds: skillIds.length > 0 ? skillIds : composerSkillIds,
        activePluginIds: pluginIds.length > 0 ? pluginIds : composerPluginIds,
      };

      setConversations((prev) => [newConvo, ...prev]);
      setActiveConversationId(newConvo.id);
      setMessages((prev) => ({ ...prev, [newConvo.id]: [] }));
      return newConvo;
    },
    [selectedModel, composerSkillIds, composerPluginIds]
  );

  const renameConversation = useCallback((id: string, newTitle: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: newTitle, updatedAt: new Date().toISOString() } : c))
    );
  }, []);

  const pinConversation = useCallback((id: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, pinned: !c.pinned, updatedAt: new Date().toISOString() } : c))
    );
  }, []);

  const archiveConversation = useCallback((id: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, archived: !c.archived, updatedAt: new Date().toISOString() } : c))
    );
  }, []);

  const deleteConversation = useCallback((id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    setMessages((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    setActiveConversationId((current) => (current === id ? null : current));
  }, []);

  // Composer pills toggle
  const toggleComposerSkill = useCallback((skillId: string) => {
    setComposerSkillIds((prev) =>
      prev.includes(skillId) ? prev.filter((id) => id !== skillId) : [...prev, skillId]
    );
  }, []);

  const clearComposerSkills = useCallback(() => {
    setComposerSkillIds([]);
  }, []);

  const toggleComposerPlugin = useCallback((pluginId: string) => {
    setComposerPluginIds((prev) =>
      prev.includes(pluginId) ? prev.filter((id) => id !== pluginId) : [...prev, pluginId]
    );
  }, []);

  const clearComposerPlugins = useCallback(() => {
    setComposerPluginIds([]);
  }, []);

  // Message & Realistic AI Streaming simulation
  const sendMessage = useCallback(
    async (conversationId: string, content: string, attachments: Attachment[] = []) => {
      const userMsgId = `msg_u_${Date.now()}`;
      const userMessage: Message = {
        id: userMsgId,
        conversationId,
        role: "user",
        content,
        createdAt: new Date().toISOString(),
        attachments: attachments.length > 0 ? attachments : undefined,
      };

      setMessages((prev) => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), userMessage],
      }));

      // Update conversation title if default
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === conversationId) {
            const isDefault = c.title === "New Conversation" || c.title.startsWith("New Chat");
            const newTitle = isDefault ? content.slice(0, 36) + (content.length > 36 ? "..." : "") : c.title;
            return { ...c, title: newTitle, updatedAt: new Date().toISOString() };
          }
          return c;
        })
      );

      setIsGenerating(true);
      const controller = new AbortController();
      setAbortController(controller);

      // Create assistant placeholder message
      const assistantMsgId = `msg_a_${Date.now()}`;
      const initialAssistantMessage: Message = {
        id: assistantMsgId,
        conversationId,
        role: "assistant",
        content: "",
        createdAt: new Date().toISOString(),
        status: "streaming",
        toolExecutions: [],
      };

      setMessages((prev) => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), initialAssistantMessage],
      }));

      try {
        const toolsToRun: ToolExecution[] = [];
        const lowerPrompt = content.toLowerCase();

        if (composerSkillIds.includes("skill_pdf") || lowerPrompt.includes("pdf")) {
          toolsToRun.push({
            id: `t_${Date.now()}_1`,
            name: "PDF Intelligence Parser",
            skillOrPlugin: "PDF Intelligence",
            icon: "solar:document-text-bold-duotone",
            status: "running",
            stepDescription: "Scanning pages, extracting tables & text hierarchy...",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          });
        }

        if (composerSkillIds.includes("skill_excel") || lowerPrompt.includes("excel") || lowerPrompt.includes("data") || lowerPrompt.includes("sheet")) {
          toolsToRun.push({
            id: `t_${Date.now()}_2`,
            name: "Excel & Data Analyst Engine",
            skillOrPlugin: "Excel & Data Analyst",
            icon: "solar:chart-2-bold-duotone",
            status: "running",
            stepDescription: "Loading spreadsheet rows & calculating weighted margins...",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          });
        }

        if (composerPluginIds.includes("plugin_google_drive") || lowerPrompt.includes("drive") || lowerPrompt.includes("file")) {
          toolsToRun.push({
            id: `t_${Date.now()}_3`,
            name: "Google Drive Connector",
            skillOrPlugin: "Google Drive",
            icon: "logos:google-drive",
            status: "running",
            stepDescription: "Locating matching documents in workspace directory...",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          });
        }

        if (toolsToRun.length > 0) {
          for (let i = 0; i < toolsToRun.length; i++) {
            if (controller.signal.aborted) break;
            const currentTool = { ...toolsToRun[i], status: "running" as const };

            setMessages((prev) => {
              const currentList = prev[conversationId] || [];
              return {
                ...prev,
                [conversationId]: currentList.map((m) =>
                  m.id === assistantMsgId
                    ? {
                        ...m,
                        toolExecutions: [...(m.toolExecutions || []), currentTool],
                      }
                    : m
                ),
              };
            });

            await new Promise((r) => setTimeout(r, 600));

            setMessages((prev) => {
              const currentList = prev[conversationId] || [];
              return {
                ...prev,
                [conversationId]: currentList.map((m) =>
                  m.id === assistantMsgId
                    ? {
                        ...m,
                        toolExecutions: (m.toolExecutions || []).map((t) =>
                          t.id === currentTool.id
                            ? {
                                ...t,
                                status: "completed" as const,
                                stepDescription: "Completed in 480ms. Extracted relevant domain context.",
                              }
                            : t
                        ),
                      }
                    : m
                ),
              };
            });
          }
        }

        let fullResponse = "";
        if (lowerPrompt.includes("pitch deck") || lowerPrompt.includes("presentation") || lowerPrompt.includes("ppt")) {
          fullResponse = `I have drafted a high-impact presentation structure for your review:\n\n### 1. Executive Summary & Problem\n* Enterprise knowledge workers waste 3.4+ hours daily navigating fragmented applications.\n* Disjointed tools lead to cognitive friction, high churn, and communication silos.\n\n### 2. The Solution Architecture\n* **Unified AI Workspace:** Integrated prebuilt skills (PDF, Excel, Frontend) with verified external plugins.\n* **Autonomous Agents:** Cron-like scheduled workflows executing operations autonomously.\n\n### 3. Traction Metrics\n| Metric | Prior Quarter | Target Quarter | Growth |\n| :--- | :--- | :--- | :--- |\n| **ARR** | $2.4M | $4.8M | **+100%** |\n| **Net Retention** | 128% | 136% | **+8%** |\n| **Daily Active Users** | 18,400 | 45,000 | **+144%** |\n\n*Would you like me to export these slides into Canva or generate speaker notes for your pitch?*`;
        } else if (lowerPrompt.includes("code") || lowerPrompt.includes("component") || lowerPrompt.includes("landing page") || lowerPrompt.includes("frontend")) {
          fullResponse = `Here is a production-ready, accessible React component crafted with modern Tailwind classes:\n\n\`\`\`tsx\nimport React from "react";\n\ninterface MetricCardProps {\n  label: string;\n  value: string;\n  change: string;\n  positive: boolean;\n}\n\nexport function MetricCard({ label, value, change, positive }: MetricCardProps) {\n  return (\n    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-5 shadow-sm transition hover:shadow-md">\n      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>\n      <div className="mt-2 flex items-baseline justify-between">\n        <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{value}</h3>\n        <span className={\`text-xs font-semibold px-2 py-0.5 rounded-full \${positive ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}\`}>\n          {change}\n        </span>\n      </div>\n    </div>\n  );\n}\n\`\`\`\n\n### Key Highlights\n* Fully responsive and supports instant dark/light theme switching.\n* Implements accessible text hierarchy and high-contrast color tokens.`;
        } else {
          fullResponse = `I analyzed your request: "${content}".\n\nBased on your selected workspace parameters and connected integrations, here are the key takeaways:\n\n1. **Synthesized Analysis:** Everything has been cross-referenced with your active workspace context.\n2. **Actionable Recommendations:**\n   * Prioritize the highest-leverage operational tasks first.\n   * Schedule an autonomous agent to monitor this workflow continuously.\n3. **Available Next Steps:**\n   * Click **Create Task** to convert this insight into an ongoing execution.\n   * Export or share the output directly to Gmail or Google Drive.`;
        }

        const chunkSize = 25;
        for (let i = 0; i < fullResponse.length; i += chunkSize) {
          if (controller.signal.aborted) break;
          const chunk = fullResponse.slice(0, i + chunkSize);
          setMessages((prev) => {
            const currentList = prev[conversationId] || [];
            return {
              ...prev,
              [conversationId]: currentList.map((m) =>
                m.id === assistantMsgId ? { ...m, content: chunk, status: "streaming" as const } : m
              ),
            };
          });
          await new Promise((r) => setTimeout(r, 20));
        }

        setMessages((prev) => {
          const currentList = prev[conversationId] || [];
          return {
            ...prev,
            [conversationId]: currentList.map((m) =>
              m.id === assistantMsgId ? { ...m, content: fullResponse, status: "completed" as const } : m
            ),
          };
        });
      } catch (err: unknown) {
        if ((err as Error)?.name !== "AbortError") {
          setMessages((prev) => {
            const currentList = prev[conversationId] || [];
            return {
              ...prev,
              [conversationId]: currentList.map((m) =>
                m.id === assistantMsgId
                  ? {
                      ...m,
                      content: "An unexpected error occurred while generating the response. Please retry.",
                      status: "error" as const,
                    }
                  : m
              ),
            };
          });
        }
      } finally {
        setIsGenerating(false);
        setAbortController(null);
      }
    },
    [composerSkillIds, composerPluginIds]
  );

  const stopGeneration = useCallback(() => {
    if (abortController) {
      abortController.abort();
      setIsGenerating(false);
      setAbortController(null);
    }
  }, [abortController]);

  const toggleLikeMessage = useCallback((conversationId: string, messageId: string, isLike: boolean) => {
    setMessages((prev) => {
      const currentList = prev[conversationId] || [];
      return {
        ...prev,
        [conversationId]: currentList.map((m) => {
          if (m.id === messageId) {
            return isLike ? { ...m, liked: !m.liked, disliked: false } : { ...m, disliked: !m.disliked, liked: false };
          }
          return m;
        }),
      };
    });
  }, []);

  // Skills
  const addCustomSkill = useCallback((skillData: Omit<Skill, "id" | "isBuiltIn" | "usageCount" | "rating">) => {
    const newSkill: Skill = {
      ...skillData,
      id: `skill_custom_${Date.now()}`,
      isBuiltIn: false,
      usageCount: 0,
      rating: 5.0,
    };
    setSkills((prev) => [newSkill, ...prev]);

    const notif: Notification = {
      id: `notif_${Date.now()}`,
      title: "Skill Published",
      message: `Custom skill "${newSkill.name}" was successfully published to your workspace.`,
      type: "skill_published",
      createdAt: new Date().toISOString(),
      read: false,
      link: `/app/skills/${newSkill.id}`,
    };
    setNotifications((prev) => [notif, ...prev]);

    return newSkill;
  }, []);

  const toggleSkillEnabled = useCallback((id: string) => {
    setSkills((prev) => prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s)));
  }, []);

  const deleteSkill = useCallback((id: string) => {
    setSkills((prev) => prev.filter((s) => s.id !== id));
  }, []);

  // Plugins
  const connectPlugin = useCallback((id: string, accountEmail = "layasaran@enterprise.ai") => {
    setPlugins((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              connected: true,
              accountEmail,
              lastSynced: "Just now",
            }
          : p
      )
    );

    const matched = plugins.find((p) => p.id === id);
    const notif: Notification = {
      id: `notif_${Date.now()}`,
      title: "Plugin Connected",
      message: `${matched ? matched.name : "Integration"} connected successfully.`,
      type: "plugin_connected",
      createdAt: new Date().toISOString(),
      read: false,
      link: "/app/plugins",
    };
    setNotifications((prev) => [notif, ...prev]);
  }, [plugins]);

  const disconnectPlugin = useCallback((id: string) => {
    setPlugins((prev) =>
      prev.map((p) => (p.id === id ? { ...p, connected: false, accountEmail: undefined, lastSynced: undefined } : p))
    );
  }, []);

  // Agents
  const addAgent = useCallback((agentData: Omit<Agent, "id" | "lastRun" | "executions" | "successRate">) => {
    const newAgent: Agent = {
      ...agentData,
      id: `agent_${Date.now()}`,
      lastRun: undefined,
      nextRun: "Scheduled per cron window",
      successRate: 100,
      executions: [],
    };
    setAgents((prev) => [newAgent, ...prev]);
    return newAgent;
  }, []);

  const toggleAgentStatus = useCallback((id: string) => {
    setAgents((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const newStatus = a.status === "active" ? "paused" : "active";
          return { ...a, status: newStatus };
        }
        return a;
      })
    );
  }, []);

  const runAgentNow = useCallback((id: string) => {
    setAgents((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const newExec = {
            id: `exec_${Date.now()}`,
            agentId: id,
            status: "completed" as const,
            startedAt: new Date().toISOString(),
            duration: "24s",
            toolsUsed: ["Automated Scanner", "Gmail API", "PDF Intelligence"],
            output: `Autonomous run completed at ${new Date().toLocaleTimeString()}. Generated scheduled executive report and sent email notifications.`,
          };
          return {
            ...a,
            lastRun: new Date().toISOString(),
            executions: [newExec, ...(a.executions || [])],
          };
        }
        return a;
      })
    );

    const notif: Notification = {
      id: `notif_${Date.now()}`,
      title: "Agent Execution Finished",
      message: "Manual run of agent completed successfully.",
      type: "agent_completed",
      createdAt: new Date().toISOString(),
      read: false,
      link: `/app/agents/${id}`,
    };
    setNotifications((prev) => [notif, ...prev]);
  }, []);

  const deleteAgent = useCallback((id: string) => {
    setAgents((prev) => prev.filter((a) => a.id !== id));
  }, []);

  // Tasks
  const createTask = useCallback((taskData: Omit<Task, "id" | "progress" | "createdAt" | "updatedAt" | "steps">) => {
    const newTask: Task = {
      ...taskData,
      id: `task_${Date.now()}`,
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      steps: [
        {
          id: "step_init",
          title: "Task Queued",
          description: "Registered parameters, assigned skills and connected tools",
          status: "completed",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
        {
          id: "step_exec",
          title: "Execution in progress",
          description: "Orchestrating autonomous domain routines...",
          status: "running",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ],
    };

    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  }, []);

  const updateTaskStatus = useCallback((id: string, status: Task["status"]) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status,
              progress: status === "completed" ? 100 : status === "running" ? 50 : t.progress,
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Notifications
  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        user,
        updateUser,
        conversations,
        activeConversationId,
        setActiveConversationId,
        createConversation,
        renameConversation,
        pinConversation,
        archiveConversation,
        deleteConversation,
        messages,
        sendMessage,
        toggleLikeMessage,
        isGenerating,
        stopGeneration,
        selectedModel,
        setSelectedModel,
        composerSkillIds,
        toggleComposerSkill,
        clearComposerSkills,
        composerPluginIds,
        toggleComposerPlugin,
        clearComposerPlugins,
        skills,
        addCustomSkill,
        toggleSkillEnabled,
        deleteSkill,
        plugins,
        connectPlugin,
        disconnectPlugin,
        agents,
        addAgent,
        toggleAgentStatus,
        runAgentNow,
        deleteAgent,
        tasks,
        createTask,
        updateTaskStatus,
        deleteTask,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        unreadCount,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isTaskModalOpen,
        setIsTaskModalOpen,
        isOnboardingOpen,
        setIsOnboardingOpen,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppStore must be used within an AppProvider");
  }
  return context;
}
