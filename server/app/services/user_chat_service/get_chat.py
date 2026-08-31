from bson import ObjectId

from app.core.config.database_config import get_chats_collection
from app.core.schema.user_chat_schema import ChatCreate, ChatMessage, ChatResponse


def get_chat(chat_id: str) -> ChatResponse | None:
    collection = get_chats_collection()

    if not ObjectId.is_valid(chat_id):
        return None

    document = collection.find_one(
        {
            "_id": ObjectId(chat_id),
        }
    )

    if document is None:
        return None

    return ChatResponse(
        id=str(document["_id"]),
        title=document.get("title"),
        messages=[
            ChatMessage.model_validate(message)
            for message in document.get("messages", [])
        ],
        created_at=document["created_at"],
        updated_at=document["updated_at"],
    )