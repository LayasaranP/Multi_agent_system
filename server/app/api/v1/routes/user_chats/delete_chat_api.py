from fastapi import APIRouter, HTTPException, status

from app.core.schema.user_chat_schema import DeleteChatResponse
from app.services.user_chat_service.delete_chat import delete_chat


router = APIRouter(
    prefix="/chats",
    tags=["Chats"],
)


@router.delete(
    "/{chat_id}",
    response_model=DeleteChatResponse,
)
def delete_chat_api(
    chat_id: str,
) -> DeleteChatResponse:
    deleted = delete_chat(chat_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat not found",
        )

    return DeleteChatResponse(
        message="Chat deleted successfully",
        chat_id=chat_id,
    )