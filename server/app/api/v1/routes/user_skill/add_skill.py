from __future__ import annotations

from fastapi import APIRouter, HTTPException, Path, status

from app.core.schema.user_skill_schema import (
    StoreUserSkill,
    StoreUserSkillResponse,
)
from app.services.skill_service.store_skill_service import UserSkillStoreService

store_user_skill_router = APIRouter(
    prefix="/api/v1/users",
    tags=["Users"],
)

# Prefer dependency injection for this in a larger application.
store_skill_service = UserSkillStoreService()


@store_user_skill_router.post(
    "/{user_id}/skills",
    response_model=StoreUserSkillResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a user skill",
)
def create_user_skill(
    user_id: int = Path(..., gt=0, description="The user's unique ID"),
    user_skill: StoreUserSkill = ...,
) -> StoreUserSkillResponse:
    """
    Add a skill to a user.

    The user ID is taken from the URL rather than the request body to
    avoid conflicting sources of truth.
    """
    try:
        created_skill = store_skill_service.add_user_skill(
            user_id=user_id,
            skill_name=user_skill.skill_name,
            user_skill=user_skill.skill_instructions,
        )

        if created_skill is None:

            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create user skill",
            )

        return StoreUserSkillResponse( 
            id=created_skill.id, 
            user_id=created_skill.user_id, 
            skill_name=created_skill.skill_name
            )

    except HTTPException:
        raise

    except ValueError as exc:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

    except Exception as exc:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while creating the user skill",
        ) from exc