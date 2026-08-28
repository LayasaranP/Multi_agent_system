export type PlanType = "Free" | "Pro" | "Team";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  timezone: string;
  plan: PlanType;
  role?: string;
  company?: string;
}

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  status: "uploading" | "completed" | "error";
}

export interface ToolExecution {
  id: string;
  name: string;
  skillOrPlugin?: string;
  icon?: string;
  status: "pending" | "running" | "completed" | "failed";
  stepDescription: string;
  input?: string;
  output?: string;
  durationMs?: number;
  timestamp: string;
}

export interface Message {
  id: string;
  conversationId: string;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  createdAt: string;
  attachments?: Attachment[];
  toolExecutions?: ToolExecution[];
  status?: "idle" | "streaming" | "completed" | "error";
  liked?: boolean;
  disliked?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  pinned?: boolean;
  archived?: boolean;
  selectedModel?: string;
  activeSkillIds?: string[];
  activePluginIds?: string[];
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  category: "Documents" | "Design" | "Data" | "Productivity" | "Custom";
  icon: string;
  isBuiltIn: boolean;
  enabled: boolean;
  author?: string;
  version?: string;
  instructions?: string;
  requiredPlugins?: string[];
  allowedFileTypes?: string[];
  examplePrompts?: string[];
  usageCount?: number;
  rating?: number;
}

export interface Plugin {
  id: string;
  name: string;
  description: string;
  category: "Productivity" | "Maps" | "Commerce" | "Design" | "Research" | "Jobs";
  icon: string;
  connected: boolean;
  accountEmail?: string;
  permissions: string[];
  lastSynced?: string;
  documentationUrl?: string;
}

export interface AgentExecution {
  id: string;
  agentId: string;
  status: "completed" | "running" | "failed";
  startedAt: string;
  duration: string;
  toolsUsed: string[];
  output: string;
  error?: string;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  status: "active" | "paused" | "draft";
  schedule: string;
  timezone: string;
  instructions: string;
  skillIds: string[];
  pluginIds: string[];
  notifications: {
    email: boolean;
    inApp: boolean;
    gmail: boolean;
  };
  lastRun?: string;
  nextRun?: string;
  successRate?: number;
  executions?: AgentExecution[];
}

export interface TaskStep {
  id: string;
  title: string;
  description: string;
  status: "pending" | "running" | "completed" | "failed";
  timestamp: string;
}

export interface TaskOutput {
  title: string;
  format: "markdown" | "code" | "table";
  content: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "draft" | "queued" | "running" | "completed" | "failed" | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  dueDate?: string;
  skillIds?: string[];
  pluginIds?: string[];
  progress: number;
  createdAt: string;
  updatedAt: string;
  steps: TaskStep[];
  output?: TaskOutput;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "task_completed" | "agent_completed" | "agent_failed" | "plugin_connected" | "skill_published" | "system";
  createdAt: string;
  read: boolean;
  link?: string;
}

export interface SearchResult {
  type: "conversation" | "message" | "skill" | "plugin" | "agent" | "task";
  id: string;
  title: string;
  subtitle: string;
  matchedSnippet?: string;
  date?: string;
  url: string;
  category?: string;
  icon?: string;
}
