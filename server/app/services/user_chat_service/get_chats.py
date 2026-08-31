from typing import Any

from app.core.config.database_config import get_chats_collection
from app.core.schema.user_chat_schema import ChatCreate, ChatMessage, ChatResponse


def get_all_chats() -> list[ChatResponse]:
    collection = get_chats_collection()

    documents = (
        collection.find(
            {},
            {
                "title": 1,
                "messages": 1,
                "created_at": 1,
                "updated_at": 1,
            },
        )
        .sort("updated_at", -1)
    )

    chats: list[ChatResponse] = []

    for document in documents:
        chats.append(
            ChatResponse(
                id=str(document["_id"]),
                title=document.get("title"),
                messages=[
                    ChatMessage.model_validate(message)
                    for message in document.get("messages", [])
                ],
                created_at=document["created_at"],
                updated_at=document["updated_at"],
            )
        )

    return chats