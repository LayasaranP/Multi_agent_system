from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path, status

from app.core.schema.user_skill_schema import GetUserSkills
from app.services.skill_service.get_user_skills import GetUserSkillService


get_skills_router = APIRouter(
    prefix="/api/v1/users",
    tags=["Users"],
)


def get_user_skill_service() -> GetUserSkillService:
    return GetUserSkillService()


@get_skills_router.get(
    "/{user_id}/skills",
    response_model=GetUserSkills,
    status_code=status.HTTP_200_OK,
)
def get_user_skills(
    user_id: Annotated[
        str,
        Path(
            ...,
            min_length=1,
            description="The user's unique ID",
        ),
    ],
    service: Annotated[
        GetUserSkillService,
        Depends(get_user_skill_service),
    ],
) -> GetUserSkills:
    try:
        skill_details = service.get_user_skills(
            user_id=user_id,
        )

        if skill_details is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User skills not found",
            )

        return skill_details

    except HTTPException:
        raise

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc
