from fastapi import APIRouter

from app.core.schema.user_chat_schema import ChatListResponse
from app.services.user_chat_service.get_chats import get_all_chats


router = APIRouter(
    prefix="/chats",
    tags=["Chats"],
)


@router.get(
    "",
    response_model=ChatListResponse,
)
def get_all_chats_api() -> ChatListResponse:
    chats = get_all_chats()

    return ChatListResponse(
        chats=chats,
        total=len(chats),
    )