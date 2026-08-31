from fastapi import APIRouter, status

from app.core.schema.user_chat_schema import ChatCreate, ChatResponse
from app.services.user_chat_service.store_chats import create_chat


router = APIRouter(
    prefix="/chats",
    tags=["Chats"],
)


@router.post(
    "",
    response_model=ChatResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_chat_api(
    payload: ChatCreate,
) -> ChatResponse:
    return create_chat(payload)