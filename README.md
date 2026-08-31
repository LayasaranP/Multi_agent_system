# Multi-Agent System

An end-to-end multi-agent orchestration platform combining an iterative, self-correcting LangGraph backend with a modern Next.js workspace interface.

---

## Overview

The **Multi-Agent System** solves complex, multi-domain tasks by decomposing user requests into specialized subtasks, dispatching them to parallel autonomous specialist agents, evaluating the results against rigorous criteria, and synthesizing a cohesive, high-quality final response.

The project is structured into two core tiers:
1. **Server (`server/`)**: A FastAPI application powered by LangGraph, LangChain, MongoDB, Pinecone vector search, and Composio tool integrations. It implements dynamic subagent planning, concurrent execution with semaphore throttling, evaluator feedback loops with automated retries, and streaming response synthesis.
2. **Client (`client/my-app/`)**: A Next.js 16 (React 19) web application styled with Tailwind CSS v4. It features a conversational workspace, model selection, skill and MCP plugin toggles, task execution tracking, custom skill creation, and dark/light theme support.

---

## Features

- **Dynamic Agent Planning**: Automatically analyzes input prompts and constructs a task-specific execution plan consisting of dynamic specialist agent personas.
- **Concurrent Specialist Execution**: Runs specialist subagents in parallel with configurable concurrency limits (`asyncio.Semaphore`), each targeting bounded objectives.
- **Automated Evaluator & Feedback Loop**: Evaluates specialist outputs against completion criteria, scoring responses and generating targeted correction instructions when iterations fail quality thresholds.
- **Token Streaming Response Synthesis**: Combines specialist findings and evaluation feedback into a streaming response delivered to the caller.
- **Semantic Skill Registry**: Ingests, embeds, and retrieves task-specific skills using Google Gemini embeddings (`gemini-embedding-2-preview`) and Pinecone vector indexes.
- **Modular Prebuilt Skills**: Out-of-the-box domain skill documentation for `brand_guidelines`, `canvas_design`, `docx`, `frontend_design`, `pdf`, `ppt`, and `skill_creator`.
- **MCP & Tool Integration**: Uses Composio to authorize and connect external integrations (e.g., Figma, Canva, Google Drive).
- **Authentication & User Management**: User registration and login powered by Argon2 password hashing (`pwdlib`) and unique email indexing in MongoDB.
- **Chat & History Persistence**: Stores conversations, message structures, and user skills directly in MongoDB.
- **Modern Responsive Client**: Next.js App Router frontend with theme switching, command palette (`Cmd+K`), task progress tracking, and conversational workspaces.

---

## Architecture

The system coordinates between the Next.js user interface, the FastAPI REST API, persistence stores, and the LangGraph multi-agent execution cycle.

```mermaid
flowchart TD
    subgraph Client ["Client (Next.js 16 / React 19)"]
        UI["Chat Workspace & Agent Dashboard"]
        Store["State Management (LocalStorage & Context)"]
        UI <--> Store
    end

    subgraph API ["Server (FastAPI)"]
        Router["API Gateway / Routers"]
        AuthRoute["/auth (Register, Login, Delete)"]
        ChatRoute["/chats (Create, Get, List, Delete)"]
        SkillRoute["/api/v1/users/{id}/skills"]
        HealthRoute["/health"]
        Router --> AuthRoute
        Router --> ChatRoute
        Router --> SkillRoute
        Router --> HealthRoute
    end

    subgraph Orchestration ["LangGraph Orchestration Engine"]
        Planner["Planner Agent\n(Decomposes prompt into SubagentSpecs)"]
        Specialists["Parallel Specialist Agents\n(Async Semaphore Pool)"]
        Evaluator["Evaluator Agent\n(Scores & identifies gaps)"]
        RouterCheck{"Pass or Max Iterations?"}
        Synthesizer["Synthesizer Agent\n(Streams final answer)"]

        Planner --> Specialists
        Specialists --> Evaluator
        Evaluator --> RouterCheck
        RouterCheck -- "Retry with Feedback" --> Planner
        RouterCheck -- "Passed / Terminated" --> Synthesizer
    end

    subgraph Storage ["Databases & External Services"]
        Mongo[("MongoDB\nUsers, Chats, Skills")]
        Pinecone[("Pinecone Vector DB\nSemantic Skill Search")]
        GeminiEmbed["Google Gemini API\nEmbedding Engine"]
        Composio["Composio MCP\nExternal Tool Auth"]
        LLM["LLM Providers\n(OpenAI, Groq, Google GenAI, etc.)"]
    end

    UI -->|"HTTP / REST"| Router
    AuthRoute --> Mongo
    ChatRoute --> Mongo
    SkillRoute --> Mongo
    SkillRoute -.->|"Embeddings & Index"| GeminiEmbed
    GeminiEmbed -.-> Pinecone
    Router --> Orchestration
    Orchestration --> LLM
    Orchestration -.-> Composio
```

### Execution Flow

1. **Planning**: The `planner` node receives the user prompt (and any corrective feedback from prior iterations) and invokes the configured LLM with structured output (`Plan`) to determine required specialist roles, objectives, and synthesis strategy.
2. **Execution**: The `specialists` node executes specialist agents concurrently using an `asyncio.Semaphore` bound by `AgentConfig.concurrency`.
3. **Evaluation**: The `evaluator` node grades the combined evidence, returning a structured score, strengths, weaknesses, and missing information.
4. **Conditional Routing**: If the evaluation fails and the iteration count is under `max_iterations`, control returns to the `planner` with synthesized correction instructions. Otherwise, the graph completes.
5. **Streaming Synthesis**: The `synthesizer_agent` consumes the final graph state and streams the consolidated output back to the consumer.

---

## Tech Stack

### Backend
- **Language**: Python >= 3.12
- **API Framework**: FastAPI 0.141+, Uvicorn 0.52+
- **Agent Orchestration**: LangGraph 0.2+, LangChain 0.3+
- **Model Providers**: `langchain-openai`, `langchain-groq`, `langchain-google-genai`, `google-genai`
- **Observability**: LangSmith 0.11+
- **Vector Database**: Pinecone 5.0+
- **Document Store**: PyMongo 4.17+
- **Tool Integration**: Composio SDK, Boto3
- **Security & Validation**: `pwdlib[argon2]` 0.3.1+, Pydantic v2, `email-validator`
- **Package Management**: `uv` / `pip`

### Frontend
- **Framework**: Next.js 16.3.3 (App Router)
- **UI Library**: React 19.2.8, React DOM 19.2.8
- **Styling**: Tailwind CSS v4, PostCSS, `@tailwindcss/postcss`
- **Icons & Utilities**: `@iconify/react`, `clsx`, `tailwind-merge`
- **Language**: TypeScript 5
- **Linting**: ESLint 9 with `eslint-config-next`

---

## Prerequisites

Before running the application, ensure the following dependencies and runtimes are installed:

- **Python**: Version `3.12` or higher (verified via `.python-version`)
- **Node.js**: Version `20.x` or higher
- **Package Managers**:
  - Python: `uv` (recommended) or `pip`
  - Node.js: `npm` (project includes `package-lock.json`), `pnpm`, or `yarn`
- **Database & Cloud Services**:
  - A running **MongoDB** instance or MongoDB Atlas cluster
  - A **Pinecone** account and vector index (optional for pure chat, required for skill vector ingestion/retrieval)
  - Valid API keys for chosen LLM providers (e.g., **Groq**, **Google Gemini**, or **OpenAI**)

---

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/LayasaranP/Multi_agent_system.git
cd Multi_agent_system
```

### 2. Backend Setup

Navigate to the `server/` directory and set up a virtual environment:

```bash
cd server

# Using uv (recommended)
uv venv
# On Linux/macOS:
source .venv/bin/activate
# On Windows (PowerShell):
.venv\Scripts\Activate.ps1

# Install dependencies
uv pip install -r pyproject.toml
```

Alternatively, using standard Python `venv` and `pip`:

```bash
cd server
python -m venv .venv

# On Linux/macOS:
source .venv/bin/activate
# On Windows (PowerShell):
.venv\Scripts\Activate.ps1

pip install -r requirements.txt
```

### 3. Frontend Setup

In a separate terminal, navigate to the `client/my-app/` directory and install JavaScript dependencies:

```bash
cd client/my-app
npm install
```

---

## Configuration

The backend reads configuration settings from `server/.env`. Create this file inside the `server/` directory:

```bash
cp .env.example .env   # Or create server/.env manually
```

### Environment Variables

| Variable | Purpose | Required | Example / Safe Value |
| :--- | :--- | :--- | :--- |
| `MONGODB_URI` | MongoDB connection string | **Yes** | `mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true&w=majority` |
| `MONGODB_DATABASE` | MongoDB target database name | **Yes** | `multi_agent_system` |
| `USER_COLLECTION_NAME` | Collection name for user accounts | **Yes** | `users` |
| `CHATS_COLLECTION_NAME` | Collection name for chat history | **Yes** | `chats` |
| `PINECONE_API_KEY` | API key for Pinecone vector database | **Yes** | `pcsk_example_key_here` |
| `PINECONE_INDEX_NAME` | Name of the Pinecone vector index | **Yes** | `skills` |
| `PINECONE_INDEX_HOST` | Pinecone index host URL | No | `https://skills-xxxx.svc.pinecone.io` |
| `PINECONE_METRIC` | Distance metric for vector index | No | `cosine` |
| `NAMESPACE` | Pinecone vector namespace | No | `skill_namespace` |
| `TOP_K` | Top results to retrieve during skill vector search | No | `2` |
| `GEMINI_Embedding_API_KEY` | Google Gemini API key for embedding generation | **Yes** | `AIzaSyExampleEmbeddingKey` |
| `EMBEDDING_MODEL` | Embedding model identifier | No | `gemini-embedding-2-preview` |
| `EMBEDDING_DIMENSION` | Dimension of the vector embeddings | No | `1536` |
| `GROQ_API_KEY` | Groq API key for LLM inference | Optional* | `gsk_example_groq_key` |
| `GOOGLE_GENAI_API_KEY` | Google GenAI API key for Gemini LLMs | Optional* | `AQ.ExampleGenAIKey` |
| `COMPOSIO_API_KEY` | Composio API key for tool/MCP authorization | Optional | `ak_example_composio_key` |
| `LANGSMITH_TRACING` | Toggle LangSmith trace instrumentation | No | `True` |
| `LANGSMITH_ENDPOINT` | LangSmith API endpoint | No | `https://api.smith.langchain.com` |
| `LANGSMITH_API_KEY` | LangSmith API key | Optional | `lsv2_pt_example_key` |
| `LANGSMITH_PROJECT` | Project name displayed in LangSmith | No | `multi-agent-system` |

*\* Note: At least one valid LLM API key must be supplied depending on the provider chosen in `AgentConfig`.*

> [!CAUTION]
> Never commit `.env` files containing production secrets to version control. The repository `.gitignore` is configured to ignore `.env`.

---

## Usage

### Running the Backend

Ensure the virtual environment is activated in `server/`:

```bash
cd server
python main.py
```

Or using `uvicorn` directly:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The API server will listen on `http://0.0.0.0:8000`.
- **Health check**: `http://localhost:8000/health`
- **Interactive OpenAPI documentation**: `http://localhost:8000/docs`
- **ReDoc documentation**: `http://localhost:8000/redoc`

### Running the Frontend

Start the Next.js development server from `client/my-app/`:

```bash
cd client/my-app
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## API / CLI Documentation

### Health Check

#### `GET /health`
Liveness probe endpoint.
- **Response** (`200 OK`):
  ```json
  {
    "status": "healthy"
  }
  ```

---

### Authentication (`/auth`)

#### `POST /auth/register`
Creates a new user record with Argon2 password hashing.
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "strongPassword123"
  }
  ```
- **Response** (`201 Created`):
  ```json
  {
    "id": "66d30f40a1b2c3d4e5f60708",
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
  ```

#### `POST /auth/login`
Validates credentials against hashed passwords in MongoDB.
- **Request Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "strongPassword123"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "id": "66d30f40a1b2c3d4e5f60708",
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
  ```

#### `DELETE /auth/user/{user_id}`
Removes a user document by ID.
- **Response** (`200 OK`):
  ```json
  {
    "message": "User deleted successfully"
  }
  ```

---

### Chat Management (`/chats`)

#### `POST /chats`
Creates a new chat session.
- **Request Body**:
  ```json
  {
    "title": "Market Analysis",
    "messages": [
      {
        "role": "user",
        "content": "Analyze competitors in generative AI."
      }
    ]
  }
  ```
- **Response** (`201 Created`):
  ```json
  {
    "id": "66d31150a1b2c3d4e5f60709",
    "title": "Market Analysis",
    "messages": [
      {
        "role": "user",
        "content": "Analyze competitors in generative AI."
      }
    ],
    "created_at": "2026-08-31T10:45:00Z",
    "updated_at": "2026-08-31T10:45:00Z"
  }
  ```

#### `GET /chats`
Retrieves all recorded chat sessions.
- **Response** (`200 OK`):
  ```json
  {
    "chats": [],
    "total": 0
  }
  ```

#### `GET /chats/{chat_id}`
Retrieves a specific chat session by ID.
- **Response** (`200 OK` or `404 Not Found`)

#### `DELETE /chats/{chat_id}`
Deletes a chat session by ID.
- **Response** (`200 OK`):
  ```json
  {
    "message": "Chat deleted successfully",
    "chat_id": "66d31150a1b2c3d4e5f60709"
  }
  ```

---

### User Skills (`/api/v1/users/{user_id}/skills`)

| Method | Path | Status Code | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/users/{user_id}/skills` | `201 Created` | Create and associate a custom skill with instructions |
| `GET` | `/api/v1/users/{user_id}/skills` | `200 OK` | Fetch all skills assigned to the given `user_id` |
| `GET` | `/api/v1/users/{user_id}/skills/{skill_id}` | `200 OK` | Fetch specific skill details |
| `DELETE` | `/api/v1/users/{user_id}/skills/{skill_id}` | `204 No Content` | Delete a specific skill |

---

### Programmatic Multi-Agent Invocation

The orchestration workflow can also be executed programmatically in Python:

```python
import asyncio
from app.orchestration.orchestrator import run_dynamic_subagents

async def main():
    async for event in run_dynamic_subagents(
        user_prompt="Produce a research brief on quantum computing hardware.",
        model="gpt-4o",
        model_provider="openai",
        api_key="your-api-key",
        max_subagents=3,
        max_iterations=2,
        concurrency=3,
    ):
        print(f"Event: {event.get('type')}")
        if event.get("type") == "final_token":
            print(event.get("content"), end="", flush=True)

if __name__ == "__main__":
    asyncio.run(main())
```

---

## Project Structure

```
Multi_agent_system/
├── client/
│   └── my-app/
│       ├── app/                     # Next.js App Router (pages & layouts)
│       │   ├── (auth)/              # Login, signup, and forgot-password routes
│       │   ├── app/                 # Workspace views (agents, chat, plugins, settings, skills, tasks)
│       │   ├── globals.css          # Global styling & Tailwind v4 theme directives
│       │   ├── layout.tsx           # Root HTML layout with ThemeProvider
│       │   └── page.tsx             # Landing / welcome view
│       ├── components/              # Modular UI components
│       │   ├── agents/              # Agent card and configuration UI
│       │   ├── chat/                # Workspace chat composer, message list, skill & plugin modals
│       │   ├── layout/              # Sidebar, topbar, mobile navigation, command palette
│       │   ├── plugins/             # MCP plugin cards and connection modal
│       │   ├── skills/              # Skill management cards
│       │   ├── tasks/               # Task cards and creator modal
│       │   └── ui/                  # Primitives (button, input, modal, badge, tabs, etc.)
│       ├── lib/
│       │   ├── api/                 # Client API layer
│       │   ├── mock-data/           # Seed data for workspace demonstration
│       │   ├── store/               # React Context & LocalStorage state store (app-store.tsx)
│       │   ├── types/               # TypeScript interfaces for agents, skills, and tasks
│       │   └── utils.ts             # Tailwind class merging utility (cn)
│       ├── package.json             # Frontend dependencies & npm scripts
│       └── tsconfig.json            # TypeScript configuration
├── server/
│   ├── app/
│   │   ├── api/v1/routes/           # FastAPI routing modules
│   │   │   ├── user_auth/           # Signup, login, delete user endpoints
│   │   │   ├── user_chats/          # Chat creation, listing, retrieval, deletion
│   │   │   └── user_skill/          # User skill CRUD endpoints
│   │   ├── core/
│   │   │   ├── config/              # MongoDB client pooling & Argon2 password hasher
│   │   │   └── schema/              # Pydantic validation models (user, chat, skill)
│   │   ├── mcp/                     # Composio tool client & authorization wrappers
│   │   ├── orchestration/           # LangGraph dynamic agent workflow
│   │   │   ├── agents/              # Subagents (planner, specialists, evaluator, synthesizer)
│   │   │   ├── graph.py             # StateGraph definition and conditional retry edge
│   │   │   ├── orchestrator.py      # Entrypoint for run_dynamic_subagents
│   │   │   ├── orchestrator_config.py # Provider selection and AgentConfig dataclass
│   │   │   ├── state.py             # TypedDict graph state and Pydantic schemas
│   │   │   └── workflow.py          # Workflow execution and event emission
│   │   ├── services/                # Business logic services (database operations)
│   │   └── skills/                  # Skills subsystem
│   │       ├── prebuilt_skills/     # Domain markdown specifications (pdf, docx, ppt, etc.)
│   │       ├── skill_registry/      # Pinecone & Gemini vector retrieval service
│   │       └── store_skills/        # Pinecone index management & ingestion routines
│   ├── main.py                      # FastAPI application entry point
│   ├── pyproject.toml               # Python project configuration & dependencies
│   ├── requirements.txt             # Pip dependency manifest
│   └── uv.lock                      # Resolved dependency lockfile
└── README.md                        # Project documentation
```

---

## Development

### Frontend Linting

Run ESLint across all TypeScript and React files:

```bash
cd client/my-app
npm run lint
```

### Formatting & Type Checking

To verify TypeScript typings in the client without generating output:

```bash
cd client/my-app
npx tsc --noEmit
```

### Python Development Guidelines

- When adding new endpoints, define routes under `server/app/api/v1/routes/` and mount them in `server/main.py`.
- Ensure all request bodies and query parameters use Pydantic models in `server/app/core/schema/`.
- Use the shared, cached MongoDB client from `server/app/core/config/database_config.py` rather than opening ad-hoc database connections.

---

## Testing

The repository does not currently include an automated unit or integration test suite runner (such as `pytest` or `vitest`).

### Manual API Verification

Verify the backend endpoints using `curl` or PowerShell:

```bash
# 1. Health check
curl -X GET http://localhost:8000/health

# 2. Register a new user
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# 3. User login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Manual Frontend Verification

Verify UI compilation and rendering:

```bash
cd client/my-app
npm run build
```

---

## Build

### Frontend Production Build

Create an optimized production bundle for Next.js:

```bash
cd client/my-app
npm run build
```

To run the production server locally after building:

```bash
npm run start
```

### Backend Packaging

The backend is packaged as a standard Python package defined in `server/pyproject.toml`. You can build distribution wheels using `build`:

```bash
cd server
pip install build
python -m build
```

---

## Deployment

### Backend Deployment

The FastAPI application can be deployed to any Linux/Windows server or container environment supporting Python 3.12+.

Run behind a production ASGI server with multiple worker processes:

```bash
cd server
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Frontend Deployment

The Next.js application can be deployed directly to Vercel, AWS Amplify, or a Node.js server. For standard Node.js hosting:

```bash
cd client/my-app
npm run build
npm run start -p 3000
```

---

## Production Considerations

- **CORS Configuration**: In `server/main.py`, `CORSMiddleware` currently permits all origins (`allow_origins=["*"]`). For production environments, restrict this list to authorized client domain origins.
- **Connection Pooling**: `server/app/core/config/database_config.py` configures MongoDB connection pooling (`maxPoolSize=100`, `minPoolSize=10`) with server selection timeouts. Ensure your database server can accommodate these connection pools under high traffic.
- **Graceful Shutdown**: The FastAPI application uses an `@asynccontextmanager` lifespan handler to call `close_mongodb()` on server termination, releasing active socket connections.
- **Concurrency & Rate Limiting**: Specialist subagent concurrency is bounded per request by `AgentConfig.concurrency` (`asyncio.Semaphore`). Adjust concurrency and `max_subagents` according to your upstream LLM provider tier rate limits.
- **Vector Search Scaling**: Vector ingestion in `SkillIngestionService` batches embeddings and namespaces vectors in Pinecone under `skill_namespace`.

---

## Troubleshooting

### 1. MongoDB Connection Fails (`RuntimeError: Could not connect to MongoDB`)
- **Cause**: Invalid `MONGODB_URI`, missing network whitelist, or wrong credentials in `server/.env`.
- **Solution**: Confirm that your current IP address is whitelisted in MongoDB Atlas Network Access, verify that the URI string is properly URL-encoded, and test connectivity using `mongosh <MONGODB_URI>`.

### 2. Missing Provider API Key (`ValueError: Model api key should be given`)
- **Cause**: The API key corresponding to the requested model provider was not set.
- **Solution**: Ensure `GROQ_API_KEY`, `GOOGLE_GENAI_API_KEY`, or `OPENAI_API_KEY` is present in `server/.env` and exported in the active shell.

### 3. Pinecone Index Connection Errors
- **Cause**: Pinecone index has not been created or the `PINECONE_INDEX_NAME` / `PINECONE_API_KEY` is invalid.
- **Solution**: Run `app/skills/store_skills/skill_config.py` or create the index manually in the Pinecone console using cosine metric and the matching embedding dimension (default `1536`).

### 4. Client Cannot Connect to Backend
- **Cause**: Port mismatch or CORS blocking requests.
- **Solution**: Ensure FastAPI is running on `http://localhost:8000` and that the client's API configuration points to the correct host.

---

## Contributing

1. Fork the repository and create a new feature branch (`git checkout -b feature/my-feature`).
2. Follow existing code conventions:
   - Python: Follow PEP 8 and use type annotations for all function signatures and Pydantic schemas.
   - TypeScript: Maintain strict typing without using `any` unless strictly necessary; adhere to ESLint configurations.
3. Commit your changes with clear, semantic commit messages (`git commit -m "feat: add support for new specialist agent"`).
4. Push to your fork (`git push origin feature/my-feature`) and open a Pull Request against `main`.

---

## License

No license is currently specified for this repository. All rights reserved by the repository owner.

---

## Support / Contact

For bugs, feature requests, and architectural discussions, please open an issue in the repository issue tracker:
- **Repository**: [https://github.com/LayasaranP/Multi_agent_system](https://github.com/LayasaranP/Multi_agent_system)
- **Issues**: [https://github.com/LayasaranP/Multi_agent_system/issues](https://github.com/LayasaranP/Multi_agent_system/issues)
