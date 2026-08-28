import {
  User,
  Conversation,
  Skill,
  Plugin,
  Agent,
  Task,
  Notification,
} from "@/lib/types";
import {
  MOCK_USER,
  MOCK_CONVERSATIONS,
  MOCK_SKILLS,
  MOCK_PLUGINS,
  MOCK_AGENTS,
  MOCK_TASKS,
  MOCK_NOTIFICATIONS,
} from "@/lib/mock-data";

// Simulated network latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const chatsApi = {
  async list(): Promise<Conversation[]> {
    await delay(120);
    const saved = typeof window !== "undefined" ? localStorage.getItem("app_convos_v1") : null;
    return saved ? JSON.parse(saved) : MOCK_CONVERSATIONS;
  },

  async getById(id: string): Promise<Conversation | null> {
    const list = await this.list();
    return list.find((c) => c.id === id) || null;
  },
};

export const skillsApi = {
  async list(): Promise<Skill[]> {
    await delay(120);
    const saved = typeof window !== "undefined" ? localStorage.getItem("app_skills_v1") : null;
    return saved ? JSON.parse(saved) : MOCK_SKILLS;
  },

  async getById(id: string): Promise<Skill | null> {
    const list = await this.list();
    return list.find((s) => s.id === id) || null;
  },
};

export const pluginsApi = {
  async list(): Promise<Plugin[]> {
    await delay(120);
    const saved = typeof window !== "undefined" ? localStorage.getItem("app_plugins_v1") : null;
    return saved ? JSON.parse(saved) : MOCK_PLUGINS;
  },

  async getById(id: string): Promise<Plugin | null> {
    const list = await this.list();
    return list.find((p) => p.id === id) || null;
  },
};

export const agentsApi = {
  async list(): Promise<Agent[]> {
    await delay(120);
    const saved = typeof window !== "undefined" ? localStorage.getItem("app_agents_v1") : null;
    return saved ? JSON.parse(saved) : MOCK_AGENTS;
  },

  async getById(id: string): Promise<Agent | null> {
    const list = await this.list();
    return list.find((a) => a.id === id) || null;
  },
};

export const tasksApi = {
  async list(): Promise<Task[]> {
    await delay(120);
    const saved = typeof window !== "undefined" ? localStorage.getItem("app_tasks_v1") : null;
    return saved ? JSON.parse(saved) : MOCK_TASKS;
  },

  async getById(id: string): Promise<Task | null> {
    const list = await this.list();
    return list.find((t) => t.id === id) || null;
  },
};

export const usersApi = {
  async getProfile(): Promise<User> {
    await delay(100);
    const saved = typeof window !== "undefined" ? localStorage.getItem("app_user_v1") : null;
    return saved ? JSON.parse(saved) : MOCK_USER;
  },
};

export const notificationsApi = {
  async list(): Promise<Notification[]> {
    await delay(80);
    const saved = typeof window !== "undefined" ? localStorage.getItem("app_notifs_v1") : null;
    return saved ? JSON.parse(saved) : MOCK_NOTIFICATIONS;
  },
};
