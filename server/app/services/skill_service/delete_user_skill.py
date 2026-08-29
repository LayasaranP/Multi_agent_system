"""
Service for deleting a user-specific skill from MongoDB.

This module provides the `UserSkillDeleteService` class, which exposes
methods for deleting a specific skill belonging to a user from the
`user_skill` collection.
"""

from pymongo.errors import PyMongoError

from app.core.config.database_config import get_database


class UserSkillDeleteService:
    """
    Service responsible for deleting user-specific skill records.

    The service connects to the application's configured MongoDB database
    and uses the `user_skill` collection to delete a skill belonging to
    a specific user.
    """

    def __init__(self):
        """
        Initialize the user skill delete service.

        Establishes access to the configured database and selects the
        `user_skill` collection.
        """
        self.db = get_database()
        self.collection = self.db["user_skill"]

    def delete_user_skill(
        self,
        user_id: str,
        skill_id: str,
    ) -> bool:
        """
        Delete a specific skill belonging to a specific user.

        Args:
            user_id: Unique identifier of the user.
            skill_id: Unique identifier of the skill.

        Returns:
            `True` if the skill was deleted successfully;
            `False` if no matching skill was found.

        Raises:
            ValueError: If `user_id` or `skill_id` is empty or not provided.
            RuntimeError: If a MongoDB error occurs while deleting the record.
        """
        if not user_id:
            raise ValueError("user_id is required")

        if not skill_id:
            raise ValueError("skill_id is required")

        try:
            result = self.collection.delete_one(
                {
                    "user_id": user_id,
                    "skill_id": skill_id,
                }
            )

            return result.deleted_count == 1

        except PyMongoError as exc:
            raise RuntimeError("Failed to delete user skill") from exc
