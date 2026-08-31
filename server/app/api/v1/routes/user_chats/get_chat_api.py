from fastapi import APIRouter, HTTPException, status

from app.core.schema.user_chat_schema import ChatResponse
from app.services.user_chat_service.get_chat import get_chat


router = APIRouter(
    prefix="/chats",
    tags=["Chats"],
)


@router.get(
    "/{chat_id}",
    response_model=ChatResponse,
)
def get_chat_api(
    chat_id: str,
) -> ChatResponse:
    chat = get_chat(chat_id)

    if chat is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat not found",
        )

    return chat