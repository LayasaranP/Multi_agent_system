from datetime import datetime, timezone

from pydantic import BaseModel, Field

from typing import List

# Input Schema

class StoreUserSkill(BaseModel):
    user_id: str = Field(..., description="Unique ID of the user")
    skill_name: str = Field(..., description="Name of the skill")
    skill_instructions: str = Field(..., description="Instructions for the skill")
    is_active: bool = Field(True, description="Whether the skill is active")
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

class DeleteSkill(BaseModel):
    user_id: str = Field(..., description="Unique ID of the user")
    skill_id: str = Field(..., description="Unique ID of the skill")



# Output Schema

class StoreUserSkillResponse(BaseModel):
    id: int
    user_id: int
    skill_name: str

class GetUserSkill(BaseModel):
    user_id: str = Field(..., description="Unique ID of the user")
    skill_name: str = Field(..., description="Name of the skill")
    skill_instructions: str = Field(..., description="Instructions for the skill")
    is_active: bool = Field(True, description="Whether the skill is active")
    created_at: datetime = Field(
            default_factory=lambda: datetime.now(timezone.utc)
    )

class GetUserSkills(BaseModel):
    user_skills: List[GetUserSkill]