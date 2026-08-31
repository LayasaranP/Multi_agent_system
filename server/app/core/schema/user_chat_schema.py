# schemas/chat.py

from __future__ import annotations

from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    role: Literal["user", "assistant", "system", "tool"]
    content: Any


class ChatCreate(BaseModel):
    title: str | None = None
    messages: list[ChatMessage] = Field(default_factory=list)


class ChatUpdate(BaseModel):
    title: str | None = None
    messages: list[ChatMessage] | None = None


class ChatResponse(BaseModel):
    id: str
    title: str | None = None
    messages: list[ChatMessage]
    created_at: datetime
    updated_at: datetime


class ChatListResponse(BaseModel):
    chats: list[ChatResponse]
    total: int


class DeleteChatResponse(BaseModel):
    message: str
    chat_id: str