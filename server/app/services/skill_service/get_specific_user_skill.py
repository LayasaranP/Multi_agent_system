"""
Service for retrieving user-specific skill information from MongoDB.

This module provides the `UserSkillSpecificService` class, which exposes
methods for fetching a specific skill belonging to a user from the
`user_skill` collection.
"""

from pymongo.errors import PyMongoError

from app.core.config.database_config import get_database


class UserSkillSpecificService:
    """
    Service responsible for retrieving user-specific skill records.

    The service connects to the application's configured MongoDB database
    and uses the `user_skill` collection to fetch skill information for
    individual users.
    """

    def __init__(self):
        """
        Initialize the user skill service.

        Establishes access to the configured database and selects the
        `user_skill` collection.
        """
        self.db = get_database()
        self.collection = self.db["user_skill"]

    def get_user_skill(
        self,
        user_id: str,
        skill_id: str,
    ) -> dict | None:
        """
        Retrieve a specific skill for a specific user.

        Args:
            user_id: Unique identifier of the user.
            skill_name: Name of the skill to retrieve.

        Returns:
            A dictionary containing the skill ID, user ID, and skill name
            when a matching record is found; otherwise, `None`.

        Raises:
            ValueError: If `user_id` or `skill_name` is empty or not provided.
            RuntimeError: If a MongoDB error occurs while fetching the record.
        """
        if not user_id:
            raise ValueError("user_id is required")

        if not skill_id:
            raise ValueError("skill_name is required")

        try:
            document = self.collection.find_one(
                {
                    "user_id": user_id,
                    "skill_name": skill_id,
                }
            )

            if document is None:
                return None

            return {
                "skill_id": document["skill_id"],
                "user_id": document["user_id"],
            }

        except PyMongoError as exc:
            raise RuntimeError("Failed to fetch user skill") from exc
