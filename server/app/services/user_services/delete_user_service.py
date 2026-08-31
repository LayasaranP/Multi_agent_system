from bson import ObjectId
from fastapi import HTTPException, status

from app.core.config.database_config import get_users_collection


class DeleteUserService:

    @staticmethod
    def delete_user(user_id: str) -> dict:
        # Validate MongoDB ObjectId
        if not ObjectId.is_valid(user_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid user ID",
            )

        users_collection = get_users_collection()

        # Delete user
        result = users_collection.delete_one(
            {
                "_id": ObjectId(user_id)
            }
        )

        # User not found
        if result.deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        return {
            "message": "User deleted successfully"
        }
