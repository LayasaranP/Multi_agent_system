from bson import ObjectId

from app.core.config.database_config import get_chats_collection


def delete_chat(chat_id: str) -> bool:
    collection = get_chats_collection()

    if not ObjectId.is_valid(chat_id):
        return False

    result = collection.delete_one(
        {
            "_id": ObjectId(chat_id),
        }
    )

    return result.deleted_count > 0