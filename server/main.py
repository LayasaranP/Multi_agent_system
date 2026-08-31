"""
Multi-Agent System Server — Application Entry Point

Production-ready FastAPI application wiring together authentication,
chat management, skill management, and multi-agent orchestration.
"""

import uvicorn
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config.database_config import close_mongodb

# --- Auth routers ---
from app.api.v1.routes.user_auth.signup_api import router as signup_router
from app.api.v1.routes.user_auth.login_api import router as login_router
from app.api.v1.routes.user_auth.delete_user_api import router as delete_user_router

# --- Chat routers ---
from app.api.v1.routes.user_chats.create_chat_api import router as create_chat_router
from app.api.v1.routes.user_chats.delete_chat_api import router as delete_chat_router
from app.api.v1.routes.user_chats.get_all_chats_api import router as get_all_chats_router
from app.api.v1.routes.user_chats.get_chat_api import router as get_chat_router

# --- Skill routers ---
from app.api.v1.routes.user_skill.add_skill import store_user_skill_router
from app.api.v1.routes.user_skill.delete_skill import delete_skill_router
from app.api.v1.routes.user_skill.get_all_skills import get_skills_router
from app.api.v1.routes.user_skill.get_skill import (
    get_skills_router as get_specific_skill_router,
)

# Load environment variables before app creation
load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application startup and shutdown lifecycle.

    Startup:
        MongoDB connects lazily via lru_cache on first request — no
        explicit initialization needed here.

    Shutdown:
        Closes the MongoDB connection pool to release resources cleanly.
    """
    yield
    close_mongodb()


app = FastAPI(
    title="Multi-Agent System API",
    description="A multi-agent orchestration system powered by LangGraph",
    version="0.1.0",
    lifespan=lifespan,
)

# ---------------------------------------------------------------------------
# Middleware
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: restrict to specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Health Check
# ---------------------------------------------------------------------------


@app.get("/health", tags=["Health"])
async def health_check():
    """Lightweight liveness probe for load balancers and orchestrators."""
    return {"status": "healthy"}


# ---------------------------------------------------------------------------
# Authentication Routes
# ---------------------------------------------------------------------------
app.include_router(signup_router)
app.include_router(login_router)
app.include_router(delete_user_router)

# ---------------------------------------------------------------------------
# Chat Routes
# ---------------------------------------------------------------------------
app.include_router(create_chat_router)
app.include_router(delete_chat_router)
app.include_router(get_all_chats_router)
app.include_router(get_chat_router)

# ---------------------------------------------------------------------------
# Skill Routes
# ---------------------------------------------------------------------------
app.include_router(store_user_skill_router)
app.include_router(delete_skill_router)
app.include_router(get_skills_router)
app.include_router(get_specific_skill_router)

# ---------------------------------------------------------------------------
# Development Server
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
