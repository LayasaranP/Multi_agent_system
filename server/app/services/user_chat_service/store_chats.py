from datetime import datetime, timezone

from app.core.config.database_config import get_chats_collection
from app.core.schema.user_chat_schema import ChatCreate, ChatMessage, ChatResponse


def create_chat(payload: ChatCreate) -> ChatResponse:
    collection = get_chats_collection()

    now = datetime.now(timezone.utc)

    document = {
        "title": payload.title,
        "messages": [
            message.model_dump(mode="json")
            for message in payload.messages
        ],
        "created_at": now,
        "updated_at": now,
    }

    result = collection.insert_one(document)

    return ChatResponse(
        id=str(result.inserted_id),
        title=document["title"],
        messages=[
            ChatMessage.model_validate(message)
            for message in document["messages"]
        ],
        created_at=document["created_at"],
        updated_at=document["updated_at"],
    )