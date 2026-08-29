from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path, status

from app.core.schema.user_skill_schema import GetUserSkill
from app.services.skill_service.get_specific_user_skill import (
    UserSkillSpecificService,
)


get_skills_router = APIRouter(
    prefix="/api/v1/users",
    tags=["Users"],
)


def get_user_specific_skill_service() -> UserSkillSpecificService:
    return UserSkillSpecificService()


@get_skills_router.get(
    "/{user_id}/skills/{skill_id}",
    response_model=GetUserSkill,
    status_code=status.HTTP_200_OK,
)
def get_user_skill(
    user_id: Annotated[
        str,
        Path(
            ...,
            min_length=1,
            description="The user's unique ID",
        ),
    ],
    skill_id: Annotated[
        str,
        Path(
            ...,
            min_length=1,
            description="The skill's unique ID",
        ),
    ],
    service: Annotated[
        UserSkillSpecificService,
        Depends(get_user_specific_skill_service),
    ],
) -> GetUserSkill:
    try:
        skill_details = service.get_user_skill(
            user_id=user_id,
            skill_id=skill_id,
        )

        if skill_details is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User skill not found",
            )

        return skill_details

    except HTTPException:
        raise

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc