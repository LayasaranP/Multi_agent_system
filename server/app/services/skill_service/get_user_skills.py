"""
Service for retrieving skills associated with a user from MongoDB.

This module provides the `UserSkillService` class, which retrieves all
skills stored for a specific user from the `user_skill` collection.
"""

from pymongo.errors import PyMongoError

from app.core.config.database_config import get_database


class GetUserSkillService:
    """
    Service responsible for retrieving skills associated with a user.

    The service connects to the application's configured MongoDB database
    and uses the `user_skill` collection to fetch skill names for users.
    """

    def __init__(self):
        """
        Initialize the user skill service.

        Establishes access to the configured database and selects the
        `user_skill` collection.
        """
        self.db = get_database()
        self.collection = self.db["user_skill"]

    def get_user_skills(self, user_id: str) -> list[str]:
        """
        Return all skills stored for a user.

        Args:
            user_id: Unique identifier of the user whose skills are
                being retrieved.

        Returns:
            A list of skill names associated with the specified user.
            Returns an empty list if the user has no stored skills.

        Raises:
            ValueError: If `user_id` is empty or not provided.
            RuntimeError: If a MongoDB error occurs while fetching
                the user's skills.
        """
        if not user_id:
            raise ValueError("user_id is required")

        try:
            documents = self.collection.find(
                {"user_id": user_id},
                {"_id": 0, "skill_name": 1},
            )

            return [
                document["skill_name"]
                for document in documents
            ]

        except PyMongoError as exc:
            raise RuntimeError("Failed to fetch user skills") from exc
