from fastapi import APIRouter, status

from app.core.schema.user_details import (
    SignupRequest,
    UserResponse,
)
from app.services.user_services.register_service import RegisterService


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(
    data: SignupRequest,
):
    return RegisterService.register(data)
