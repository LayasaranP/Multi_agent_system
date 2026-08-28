import {
  User,
  Skill,
  Plugin,
  Agent,
  Task,
  Conversation,
  Message,
  Notification,
} from "@/lib/types";

export const MOCK_USER: User = {
  id: "usr_101",
  name: "Layasaran P",
  email: "layasaran@enterprise.ai",
  avatarUrl: "",
  timezone: "Asia/Kolkata",
  plan: "Pro",
  role: "Senior AI Engineer & Lead",
  company: "Apex Synthetics",
};

export const MOCK_SKILLS: Skill[] = [
  {
    id: "skill_pdf",
    name: "PDF Intelligence",
    description: "Read, summarize, analyze, extract, and transform PDF documents with OCR and table preservation.",
    category: "Documents",
    icon: "solar:document-text-bold-duotone",
    isBuiltIn: true,
    enabled: true,
    author: "Core AI",
    version: "2.4.0",
    instructions: "Parse the PDF, extract textual hierarchies, summarize executive insights, and cite page numbers.",
    requiredPlugins: ["plugin_google_drive"],
    allowedFileTypes: [".pdf"],
    examplePrompts: [
      "Summarize this PDF into five executive-level insights.",
      "Extract all financial tables from this annual report into markdown.",
      "Compare these two PDF contracts and highlight liability differences.",
    ],
    usageCount: 1420,
    rating: 4.9,
  },
  {
    id: "skill_ppt",
    name: "PPT Deck Architect",
    description: "Create and analyze professional slide decks, outlines, speaker notes, and presentation scripts.",
    category: "Design",
    icon: "solar:presentation-graph-bold-duotone",
    isBuiltIn: true,
    enabled: true,
    author: "Core AI",
    version: "1.9.2",
    instructions: "Design modern 10-12 slide pitch decks with bold value statements, key metrics, and storytelling arcs.",
    requiredPlugins: ["plugin_canva", "plugin_figma"],
    allowedFileTypes: [".pptx", ".pdf"],
    examplePrompts: [
      "Create a 10-slide seed pitch deck outline for our AI workflow tool.",
      "Transform this strategy memo into speaker notes for an all-hands call.",
      "Analyze this presentation deck and provide constructive design critiques.",
    ],
    usageCount: 890,
    rating: 4.8,
  },
  {
    id: "skill_docx",
    name: "DOCX Writer & Editor",
    description: "Create, edit, summarize, and format complex Word documents with formal executive styling.",
    category: "Documents",
    icon: "solar:file-text-bold-duotone",
    isBuiltIn: true,
    enabled: true,
    author: "Core AI",
    version: "2.1.0",
    instructions: "Draft comprehensive reports with nested numbered headings, executive summaries, and formal tone.",
    allowedFileTypes: [".docx", ".doc", ".txt"],
    examplePrompts: [
      "Draft a formal enterprise SLA agreement with standard escalation tiers.",
      "Summarize this product requirements document for the engineering lead.",
      "Proofread and enhance the clarity of this executive memo.",
    ],
    usageCount: 650,
    rating: 4.7,
  },
  {
    id: "skill_excel",
    name: "Excel & Data Analyst",
    description: "Analyze spreadsheets, create nested formulas, clean messy datasets, and generate statistical charts.",
    category: "Data",
    icon: "solar:chart-2-bold-duotone",
    isBuiltIn: true,
    enabled: true,
    author: "DataLab AI",
    version: "3.0.1",
    instructions: "Perform exploratory data analysis, calculate CAGR/MoM growth, and write Excel formulas (INDEX/MATCH, XLOOKUP, LAMBDA).",
    requiredPlugins: ["plugin_google_drive"],
    allowedFileTypes: [".xlsx", ".xls", ".csv"],
    examplePrompts: [
      "Analyze this Excel file and identify revenue anomalies across Q1-Q3.",
      "Generate an Excel formula to calculate cumulative churn by cohort.",
      "Clean this CSV with inconsistent date and phone number formats.",
    ],
    usageCount: 2340,
    rating: 5.0,
  },
  {
    id: "skill_frontend",
    name: "Frontend Designer & Coder",
    description: "Generate modern, production-ready React, Tailwind, and TypeScript web interfaces.",
    category: "Design",
    icon: "solar:code-bold-duotone",
    isBuiltIn: true,
    enabled: true,
    author: "DesignOps",
    version: "4.1.0",
    instructions: "Produce accessible, responsive Tailwind CSS components with clean state management, subtle transitions, and high contrast.",
    requiredPlugins: ["plugin_figma"],
    allowedFileTypes: [".tsx", ".jsx", ".html", ".css"],
    examplePrompts: [
      "Build a modern SaaS pricing calculator card with monthly/yearly toggle.",
      "Design an interactive command palette modal with keyboard navigation.",
      "Review this React component for accessibility and performance bottlenecks.",
    ],
    usageCount: 3120,
    rating: 4.95,
  },
  {
    id: "skill_canva",
    name: "Canva Creative Engine",
    description: "Compose social banners, thumbnails, marketing collateral, and slide layouts using Canva designs.",
    category: "Design",
    icon: "solar:palette-round-bold-duotone",
    isBuiltIn: true,
    enabled: true,
    author: "Creative Labs",
    version: "1.5.0",
    instructions: "Organize visual hierarchies for social platforms, adherence to dimension ratios, and eye-catching color palettes.",
    requiredPlugins: ["plugin_canva"],
    allowedFileTypes: [".png", ".jpg", ".svg"],
    examplePrompts: [
      "Generate creative layout concepts for a LinkedIn product launch carousel.",
      "Create banner dimensions and color recommendations for YouTube tech channel.",
      "Prepare seasonal promo post ideas with typography pairing guidance.",
    ],
    usageCount: 450,
    rating: 4.6,
  },
  {
    id: "skill_brand",
    name: "Brand Guidelines Guardian",
    description: "Audit and generate brand assets following strict typography, color harmony, and voice rules.",
    category: "Productivity",
    icon: "solar:shield-check-bold-duotone",
    isBuiltIn: true,
    enabled: true,
    author: "Brand Team",
    version: "2.0.0",
    instructions: "Verify brand voice tone (confident, authoritative, crisp), verify hex codes, and prevent off-brand styling.",
    allowedFileTypes: [".pdf", ".docx"],
    examplePrompts: [
      "Audit this copy against our brand tone of voice guidelines.",
      "Generate an official color palette specification with WCAG AAA contrast pairs.",
      "Write standard social media bio variations adhering to our brand identity.",
    ],
    usageCount: 520,
    rating: 4.85,
  },
];

export const MOCK_PLUGINS: Plugin[] = [
  {
    id: "plugin_google_drive",
    name: "Google Drive",
    description: "Search workspace files, read spreadsheets, docs, and organize drive assets seamlessly.",
    category: "Productivity",
    icon: "logos:google-drive",
    connected: true,
    accountEmail: "layasaran@enterprise.ai",
    permissions: ["Read and download files", "Search folder metadata", "Upload generated documents"],
    lastSynced: "5 mins ago",
    documentationUrl: "https://support.google.com/drive",
  },
  {
    id: "plugin_gmail",
    name: "Gmail",
    description: "Draft outbound emails, search message threads, and trigger automated digests.",
    category: "Productivity",
    icon: "logos:google-gmail",
    connected: true,
    accountEmail: "layasaran@enterprise.ai",
    permissions: ["Read email threads", "Send emails on your behalf", "Manage draft labels"],
    lastSynced: "12 mins ago",
    documentationUrl: "https://support.google.com/mail",
  },
  {
    id: "plugin_google_calendar",
    name: "Google Calendar",
    description: "Inspect upcoming meetings, schedule AI agent execution windows, and prevent booking overlaps.",
    category: "Productivity",
    icon: "logos:google-calendar",
    connected: true,
    accountEmail: "layasaran@enterprise.ai",
    permissions: ["View calendar events", "Create meeting appointments"],
    lastSynced: "1 hour ago",
    documentationUrl: "https://support.google.com/calendar",
  },
  {
    id: "plugin_google_maps",
    name: "Google Maps",
    description: "Geocode locations, query business places, compute transit times, and analyze local markets.",
    category: "Maps",
    icon: "logos:google-maps",
    connected: false,
    permissions: ["Search places and businesses", "Calculate driving distances and routes"],
    documentationUrl: "https://developers.google.com/maps",
  },
  {
    id: "plugin_shopify",
    name: "Shopify",
    description: "Query inventory levels, analyze store revenue metrics, and draft product catalog listings.",
    category: "Commerce",
    icon: "logos:shopify",
    connected: false,
    permissions: ["Read product catalog", "Analyze orders and revenue data"],
    documentationUrl: "https://help.shopify.com",
  },
  {
    id: "plugin_figma",
    name: "Figma",
    description: "Inspect design components, extract token values, export vector assets, and inspect wireframes.",
    category: "Design",
    icon: "logos:figma",
    connected: true,
    accountEmail: "layasaran@enterprise.ai",
    permissions: ["Read file frames and components", "Export image slices and styles"],
    lastSynced: "3 hours ago",
    documentationUrl: "https://help.figma.com",
  },
  {
    id: "plugin_canva",
    name: "Canva",
    description: "Access your design templates, export presentation assets, and sync brand kit colors.",
    category: "Design",
    icon: "simple-icons:canva",
    connected: true,
    accountEmail: "layasaran@enterprise.ai",
    permissions: ["Read brand kit palettes", "Export project previews"],
    lastSynced: "Yesterday",
    documentationUrl: "https://www.canva.com",
  },
  {
    id: "plugin_indeed",
    name: "Indeed",
    description: "Monitor candidate applications, query hiring salary benchmarks, and scan active job listings.",
    category: "Jobs",
    icon: "simple-icons:indeed",
    connected: false,
    permissions: ["Search job postings", "Retrieve talent salary averages"],
    documentationUrl: "https://indeed.com",
  },
  {
    id: "plugin_deepwiki",
    name: "DeepWiki",
    description: "Query specialized academic research, technical documentation, and patent registries.",
    category: "Research",
    icon: "solar:book-bookmark-bold-duotone",
    connected: false,
    permissions: ["Query technical articles", "Search peer-reviewed repositories"],
    documentationUrl: "https://deepwiki.ai",
  },
];

export const MOCK_AGENTS: Agent[] = [
  {
    id: "agent_competitor_research",
    name: "Weekly Competitor Intelligence",
    description: "Scrapes competitor pricing changes, product releases, and writes an executive report.",
    status: "active",
    schedule: "Every Monday at 09:00 AM",
    timezone: "Asia/Kolkata",
    instructions: "Research competitor pricing adjustments, recent press releases, and key leadership shifts. Compile a 500-word brief and send via Gmail.",
    skillIds: ["skill_pdf", "skill_brand"],
    pluginIds: ["plugin_gmail", "plugin_google_drive"],
    notifications: { email: true, inApp: true, gmail: true },
    lastRun: "2026-08-25T09:00:00Z",
    nextRun: "2026-09-01T09:00:00Z",
    successRate: 98.4,
    executions: [
      {
        id: "exec_1",
        agentId: "agent_competitor_research",
        status: "completed",
        startedAt: "2026-08-25T09:00:00Z",
        duration: "42s",
        toolsUsed: ["Web Search", "PDF Intelligence", "Gmail API"],
        output: "Discovered 2 pricing tier updates in SaaS competitors. Sent synthesized PDF report to leadership distribution list.",
      },
      {
        id: "exec_2",
        agentId: "agent_competitor_research",
        status: "completed",
        startedAt: "2026-08-18T09:00:00Z",
        duration: "38s",
        toolsUsed: ["Web Search", "Gmail API"],
        output: "No major price alterations detected. Cataloged 4 feature announcements.",
      },
    ],
  },
  {
    id: "agent_sales_summary",
    name: "Daily Sales Summary Digest",
    description: "Aggregates daily pipeline wins, newly closed enterprise deals, and highlights pipeline churn.",
    status: "active",
    schedule: "Every day at 06:00 PM",
    timezone: "Asia/Kolkata",
    instructions: "Query sales spreadsheets from Google Drive, calculate daily MRR velocity, and send a summary email.",
    skillIds: ["skill_excel"],
    pluginIds: ["plugin_google_drive", "plugin_gmail"],
    notifications: { email: true, inApp: true, gmail: false },
    lastRun: "2026-08-27T18:00:00Z",
    nextRun: "2026-08-28T18:00:00Z",
    successRate: 100,
    executions: [
      {
        id: "exec_3",
        agentId: "agent_sales_summary",
        status: "completed",
        startedAt: "2026-08-27T18:00:00Z",
        duration: "19s",
        toolsUsed: ["Excel & Data Analyst", "Google Drive API"],
        output: "Daily closed revenue: $38,400 across 3 enterprise accounts. Zero contract cancellations.",
      },
    ],
  },
  {
    id: "agent_marketing_deck",
    name: "Monday Marketing Deck Refresher",
    description: "Refreshes weekly growth charts and compiles the slide deck for the marketing sprint call.",
    status: "paused",
    schedule: "Every Monday at 08:00 AM",
    timezone: "Asia/Kolkata",
    instructions: "Extract web traffic metrics, update conversion charts, and export updated slide presentation.",
    skillIds: ["skill_ppt", "skill_excel"],
    pluginIds: ["plugin_canva", "plugin_figma"],
    notifications: { email: false, inApp: true, gmail: false },
    lastRun: "2026-08-11T08:00:00Z",
    nextRun: "Paused",
    successRate: 94.0,
    executions: [
      {
        id: "exec_4",
        agentId: "agent_marketing_deck",
        status: "completed",
        startedAt: "2026-08-11T08:00:00Z",
        duration: "55s",
        toolsUsed: ["Canva", "PPT Deck Architect"],
        output: "Generated 8-slide presentation draft in Google Drive folder 'Marketing Sprint Sync'.",
      },
    ],
  },
  {
    id: "agent_inbox_cleanup",
    name: "Weekly Inbox Review & Task Sync",
    description: "Parses unanswered high-priority client emails and turns action items into workspace tasks.",
    status: "active",
    schedule: "Every Friday at 05:00 PM",
    timezone: "Asia/Kolkata",
    instructions: "Scan Gmail priority inbox for client requests needing turnaround in 48 hours. Generate prioritized task tickets.",
    skillIds: ["skill_docx"],
    pluginIds: ["plugin_gmail"],
    notifications: { email: true, inApp: true, gmail: false },
    lastRun: "2026-08-21T17:00:00Z",
    nextRun: "2026-08-28T17:00:00Z",
    successRate: 96.2,
    executions: [],
  },
];

export const MOCK_TASKS: Task[] = [
  {
    id: "task_investor_deck",
    title: "Create investor pitch presentation",
    description: "Synthesize Q3 financial reports into a 10-slide venture capital presentation deck with traction metrics.",
    status: "completed",
    priority: "high",
    dueDate: "2026-08-30",
    skillIds: ["skill_ppt", "skill_excel"],
    pluginIds: ["plugin_google_drive", "plugin_figma"],
    progress: 100,
    createdAt: "2026-08-27T10:00:00Z",
    updatedAt: "2026-08-27T10:14:00Z",
    steps: [
      {
        id: "s1",
        title: "Task initiated",
        description: "Task parameters and skill configuration registered",
        status: "completed",
        timestamp: "10:00 AM",
      },
      {
        id: "s2",
        title: "Retrieved Q3 financials",
        description: "Extracted ARR ($4.2M) and net retention (134%) from Google Drive",
        status: "completed",
        timestamp: "10:04 AM",
      },
      {
        id: "s3",
        title: "Generated narrative outline",
        description: "Structured problem, market size ($18B TAM), technology moat, and unit economics",
        status: "completed",
        timestamp: "10:09 AM",
      },
      {
        id: "s4",
        title: "Built slide artifacts",
        description: "Formatted presentation with speaker notes and charts",
        status: "completed",
        timestamp: "10:14 AM",
      },
    ],
    output: {
      title: "Series A Investor Deck — Master Narrative",
      format: "markdown",
      content: `## Series A Pitch Deck: Autonomous AI Workflow Platform

### Slide 1: Executive Hook
* **Headline:** Enterprise Work Is Broken by Context Switching.
* **Subhead:** Autonomous agents that orchestrate skills, tools, and recurring operations.

### Slide 2: The Core Problem
* Knowledge workers lose 3.8 hours/day context switching between docs, spreadsheets, and chat.
* Existing LLM wrappers lack persistent scheduling and external plugin execution integrity.

### Slide 3: Our Solution
* Unified workspace integrating specialized domain skills (PDF, Excel, Code) with 20+ plugins.
* Autonomous cron-like agents executing end-to-end tasks with zero human babysitting.

### Slide 4: Market Opportunity & Unit Economics
| Metric | Current Value | Target (12 Mo) |
| :--- | :--- | :--- |
| **Annual Recurring Revenue (ARR)** | $4.2M | $14.5M |
| **Net Revenue Retention (NRR)** | 134% | 140% |
| **Gross Margin** | 82% | 84% |
| **CAC Payback Period** | 6.2 Months | 5.0 Months |

### Slide 5: Next Milestones
1. Enterprise self-serve plugin registry.
2. SOC2 Type II certification rollout.
3. Multi-agent collaborative reasoning swarms.`,
    },
  },
  {
    id: "task_feedback_analysis",
    title: "Analyze customer feedback and NPS anomalies",
    description: "Scan through 1,200 qualitative survey responses from recent onboarding cohorts and categorize pain points.",
    status: "running",
    priority: "medium",
    dueDate: "2026-08-29",
    skillIds: ["skill_excel"],
    pluginIds: ["plugin_google_drive"],
    progress: 65,
    createdAt: "2026-08-28T14:00:00Z",
    updatedAt: "2026-08-28T14:22:00Z",
    steps: [
      {
        id: "s1",
        title: "Loaded survey responses",
        description: "1,240 rows ingested from Google Drive spreadsheet",
        status: "completed",
        timestamp: "2:00 PM",
      },
      {
        id: "s2",
        title: "Sentiment clustering",
        description: "Grouped feedback into: Integrations, Response Speed, Billing, and UX",
        status: "completed",
        timestamp: "2:12 PM",
      },
      {
        id: "s3",
        title: "Synthesizing top recommendations",
        description: "Drafting priority impact matrix for product roadmap",
        status: "running",
        timestamp: "2:22 PM",
      },
    ],
  },
  {
    id: "task_clean_data",
    title: "Clean and normalize marketing CRM spreadsheet",
    description: "Remove duplicate lead emails, normalize country codes, and validate domain domains against MX records.",
    status: "queued",
    priority: "low",
    dueDate: "2026-09-02",
    skillIds: ["skill_excel"],
    pluginIds: ["plugin_google_drive"],
    progress: 0,
    createdAt: "2026-08-28T16:00:00Z",
    updatedAt: "2026-08-28T16:00:00Z",
    steps: [],
  },
  {
    id: "task_landing_page",
    title: "Build product landing page UI components",
    description: "Generate responsive Next.js and Tailwind marketing section components matching brand guidelines.",
    status: "completed",
    priority: "high",
    dueDate: "2026-08-28",
    skillIds: ["skill_frontend", "skill_brand"],
    pluginIds: ["plugin_figma"],
    progress: 100,
    createdAt: "2026-08-26T11:00:00Z",
    updatedAt: "2026-08-26T11:45:00Z",
    steps: [
      {
        id: "s1",
        title: "Read Figma component tokens",
        description: "Imported color variables and typography scales",
        status: "completed",
        timestamp: "11:05 AM",
      },
      {
        id: "s2",
        title: "Built Hero and Feature sections",
        description: "Rendered interactive preview cards and responsive layout",
        status: "completed",
        timestamp: "11:30 AM",
      },
      {
        id: "s3",
        title: "Passed accessibility check",
        description: "WCAG AAA color contrast and semantic HTML verified",
        status: "completed",
        timestamp: "11:45 AM",
      },
    ],
    output: {
      title: "Landing Page Component Specs",
      format: "code",
      content: `// Reusable SaaS Hero Component verified with high-contrast Tailwind classes
export function HeroBanner() {
  return (
    <section className="relative overflow-hidden pt-24 pb-16 px-6 lg:px-8">
      <div className="mx-auto max-w-5xl text-center">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/20 mb-6">
          Next-Gen AI Productivity Platform
        </span>
        <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-foreground">
          One workspace for every <span className="text-blue-500">task, skill & agent</span>.
        </h1>
      </div>
    </section>
  );
}`,
    },
  },
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "conv_landing_page",
    title: "Build a landing page for my startup",
    createdAt: "2026-08-28T16:30:00Z",
    updatedAt: "2026-08-28T17:15:00Z",
    pinned: true,
    selectedModel: "Claude 3.7 Sonnet",
    activeSkillIds: ["skill_frontend", "skill_brand"],
    activePluginIds: ["plugin_figma"],
  },
  {
    id: "conv_sales_sheet",
    title: "Analyze Q3 sales spreadsheet",
    createdAt: "2026-08-28T11:20:00Z",
    updatedAt: "2026-08-28T12:05:00Z",
    pinned: false,
    selectedModel: "GPT-4o",
    activeSkillIds: ["skill_excel"],
    activePluginIds: ["plugin_google_drive"],
  },
  {
    id: "conv_pitch_deck",
    title: "Create a pitch deck for investors",
    createdAt: "2026-08-27T09:15:00Z",
    updatedAt: "2026-08-27T10:30:00Z",
    pinned: true,
    selectedModel: "Gemini 2.0 Flash",
    activeSkillIds: ["skill_ppt"],
    activePluginIds: ["plugin_canva"],
  },
  {
    id: "conv_research_paper",
    title: "Summarize this research paper",
    createdAt: "2026-08-24T14:10:00Z",
    updatedAt: "2026-08-24T14:40:00Z",
    pinned: false,
    selectedModel: "Claude 3.7 Sonnet",
    activeSkillIds: ["skill_pdf"],
  },
  {
    id: "conv_brand_guide",
    title: "Create a brand guideline document",
    createdAt: "2026-08-22T08:00:00Z",
    updatedAt: "2026-08-22T08:50:00Z",
    pinned: false,
    selectedModel: "GPT-4o",
    activeSkillIds: ["skill_brand", "skill_docx"],
  },
  {
    id: "conv_market_research",
    title: "Research competitors in my market",
    createdAt: "2026-08-15T15:30:00Z",
    updatedAt: "2026-08-15T16:20:00Z",
    pinned: false,
    selectedModel: "DeepSeek R1",
    activeSkillIds: ["skill_pdf"],
    activePluginIds: ["plugin_google_drive"],
  },
];

export const MOCK_MESSAGES: Record<string, Message[]> = {
  conv_landing_page: [
    {
      id: "msg_1",
      conversationId: "conv_landing_page",
      role: "user",
      content: "I need to build a high-converting, modern SaaS landing page for our new AI agent platform. It should have a clean hero section, feature showcase, and interactive UI preview.",
      createdAt: "2026-08-28T16:30:00Z",
    },
    {
      id: "msg_2",
      conversationId: "conv_landing_page",
      role: "assistant",
      content: "I've structured a complete, production-ready landing page layout that balances minimalism with bold, trustworthy typography. Here is what I am executing:\n\n1. **Inspecting Brand Tokens** from your linked Figma project.\n2. **Activating Frontend Design skill** for accessible, responsive Tailwind primitives.\n3. **Composing Interactive Preview Cards** to showcase real-time skill and agent activity.",
      createdAt: "2026-08-28T16:30:10Z",
      toolExecutions: [
        {
          id: "t_1",
          name: "Inspect Figma Tokens",
          skillOrPlugin: "Figma",
          icon: "logos:figma",
          status: "completed",
          stepDescription: "Imported 12 brand color hex values and font scale hierarchy",
          durationMs: 420,
          timestamp: "4:30 PM",
        },
        {
          id: "t_2",
          name: "Execute Frontend Design Skill",
          skillOrPlugin: "Frontend Design",
          icon: "solar:code-bold-duotone",
          status: "completed",
          stepDescription: "Generated semantic hero, trusted integrations grid, and pricing matrix",
          durationMs: 890,
          timestamp: "4:30 PM",
        },
      ],
      liked: true,
    },
    {
      id: "msg_3",
      conversationId: "conv_landing_page",
      role: "user",
      content: "Make sure dark mode has deep slate surfaces instead of harsh black, and add a subtle glowing border around the product preview mockup.",
      createdAt: "2026-08-28T16:35:00Z",
    },
    {
      id: "msg_4",
      conversationId: "conv_landing_page",
      role: "assistant",
      content: `Excellent direction. Harsh black (#000000) causes eye fatigue and crushes visual depth. Instead, I've used an obsidian slate palette (\`#080c14\` background with \`#0d1524\` layered surface cards).

### Updated Hero Visual Architecture

\`\`\`tsx
// Sleek preview container with subtle gradient border
<div className="relative mx-auto mt-12 max-w-6xl rounded-2xl border border-white/10 bg-slate-900/60 p-2 shadow-2xl backdrop-blur-xl">
  <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-blue-500/25 to-transparent pointer-events-none" />
  <div className="relative rounded-xl overflow-hidden bg-slate-950/80 border border-white/5">
    {/* Interactive Chat & Agent Preview */}
  </div>
</div>
\`\`\`

Here are the key design rules applied:
* **Typography:** Tight tracking (\`-0.025em\`) on large headings, relaxed line height on explanatory copy.
* **Interactive Micro-actions:** Subtle 150ms transitions on button hovers and card borders.
* **Accessible Contrast:** AAA rated color pairings in both light and dark themes.`,
      createdAt: "2026-08-28T16:35:12Z",
      toolExecutions: [
        {
          id: "t_3",
          name: "Brand Tone & Color Verification",
          skillOrPlugin: "Brand Guidelines Guardian",
          icon: "solar:shield-check-bold-duotone",
          status: "completed",
          stepDescription: "Contrast verified at 9.4:1 ratio for slate surfaces",
          durationMs: 310,
          timestamp: "4:35 PM",
        },
      ],
    },
  ],
  conv_sales_sheet: [
    {
      id: "msg_s1",
      conversationId: "conv_sales_sheet",
      role: "user",
      content: "Please inspect our Q3 Revenue spreadsheet in Google Drive and identify our top performing tier.",
      createdAt: "2026-08-28T11:20:00Z",
    },
    {
      id: "msg_s2",
      conversationId: "conv_sales_sheet",
      role: "assistant",
      content: "I connected to your Google Drive and analyzed `Q3_Enterprise_Sales_2026.xlsx`.\n\n### Key Revenue Findings:\n* **Enterprise Tier** accounted for **68.4% ($2.87M)** of total quarterly revenue.\n* **Growth Rate:** The Pro tier showed the fastest quarter-over-quarter expansion at **+44% MoM**.\n* **Churn Rate:** Zero churn detected in multi-year Enterprise accounts.",
      createdAt: "2026-08-28T11:20:25Z",
      toolExecutions: [
        {
          id: "t_s1",
          name: "Connect to Google Drive",
          skillOrPlugin: "Google Drive",
          icon: "logos:google-drive",
          status: "completed",
          stepDescription: "Located Q3_Enterprise_Sales_2026.xlsx (4.8 MB)",
          durationMs: 510,
          timestamp: "11:20 AM",
        },
        {
          id: "t_s2",
          name: "Excel & Data Analyst Engine",
          skillOrPlugin: "Excel & Data Analyst",
          icon: "solar:chart-2-bold-duotone",
          status: "completed",
          stepDescription: "Aggregated 4,120 transaction rows and computed weighted margin",
          durationMs: 1100,
          timestamp: "11:20 AM",
        },
      ],
    },
  ],
};

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "notif_1",
    title: "Task Completed",
    message: "Create investor pitch presentation completed with 10 slides and metrics.",
    type: "task_completed",
    createdAt: "2026-08-28T14:30:00Z",
    read: false,
    link: "/app/tasks/task_investor_deck",
  },
  {
    id: "notif_2",
    title: "Agent Finished Run",
    message: "Weekly Competitor Intelligence synthesized 2 updates and sent report to Gmail.",
    type: "agent_completed",
    createdAt: "2026-08-28T09:00:42Z",
    read: false,
    link: "/app/agents/agent_competitor_research",
  },
  {
    id: "notif_3",
    title: "Plugin Connected",
    message: "Figma was successfully authorized with your enterprise workspace.",
    type: "plugin_connected",
    createdAt: "2026-08-27T16:20:00Z",
    read: true,
    link: "/app/plugins",
  },
  {
    id: "notif_4",
    title: "System Update",
    message: "Model selector now supports Claude 3.7 Sonnet with extended thinking tokens.",
    type: "system",
    createdAt: "2026-08-26T10:00:00Z",
    read: true,
  },
];
