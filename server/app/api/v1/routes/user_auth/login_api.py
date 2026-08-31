from fastapi import APIRouter, status

from app.core.schema.user_details import (
    LoginRequest,
    UserResponse,
)
from app.services.user_services.login_service import LoginService

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)

@router.post(
    "/login",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
)
def login(
    data: LoginRequest,
):
    return LoginService.login(data)
