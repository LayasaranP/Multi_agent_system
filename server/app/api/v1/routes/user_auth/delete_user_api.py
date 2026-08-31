from fastapi import APIRouter, status

from app.services.user_services.delete_user_service import DeleteUserService

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)

@router.delete(
    "/user/{user_id}",
    status_code=status.HTTP_200_OK,
)
def delete_user(user_id: str):
    return DeleteUserService.delete_user(user_id)