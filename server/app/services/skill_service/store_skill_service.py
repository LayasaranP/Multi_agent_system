"""Service for managing user-specific skills and their instructions."""

from pymongo.errors import PyMongoError
from app.core.config.database_config import get_database


class UserSkillStoreService:
    """Provide operations for storing and retrieving user skills."""

    def __init__(self):
        """Initialize the user skill service and ensure the collection exists.

        Args:
            db: A PyMongo database instance used to store user skills.
        """
        self.db = get_database()
        self.collection_name = "user_skill"

        if self.collection_name not in self.db.list_collection_names():
            self.db.create_collection(self.collection_name)

        self.collection = self.db[self.collection_name]

    def add_user_skill(
        self,
        user_id: str,
        skill_name: str,
        skill_instructions: str | None = None
    ) -> dict:
        """Add a skill for a user if it does not already exist.

        Args:
            user_id: Unique identifier of the user.
            skill_name: Name of the skill to add.
            skill_instructions: Optional instructions associated with the skill.

        Returns:
            A dictionary containing a status message and the stored skill data.

        Raises:
            ValueError: If `user_id` or `skill_name` is not provided.
            RuntimeError: If the skill cannot be stored in MongoDB.
        """
        if not user_id:
            raise ValueError("user_id is required")

        if not skill_name:
            raise ValueError("skill_name is required")

        existing_skill = self.collection.find_one({
            "user_id": user_id,
            "skill_name": skill_name
        })

        if existing_skill:
            return {
                "message": "Skill already exists for this user",
                "data": {
                    **existing_skill,
                    "_id": str(existing_skill["_id"])
                }
            }

        document = {
            "user_id": user_id,
            "skill_name": skill_name
        }

        if skill_instructions is not None:
            document["skill_instructions"] = skill_instructions

        try:
            result = self.collection.insert_one(document)

            document["_id"] = str(result.inserted_id)

            return {
                "message": f"{skill_name} skill added successfully",
                "data": document
            }

        except PyMongoError as exc:
            raise RuntimeError("Failed to store user skill") from exc
