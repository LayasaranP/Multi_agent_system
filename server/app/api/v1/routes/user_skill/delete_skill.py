from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path, status

from app.services.skill_service.delete_user_skill import UserSkillDeleteService


delete_skill_router = APIRouter(
    prefix="/api/v1/users",
    tags=["Users"],
)


def get_user_skill_delete_service() -> UserSkillDeleteService:
    return UserSkillDeleteService()


@delete_skill_router.delete(
    "/{user_id}/skills/{skill_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_user_skill(
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
        UserSkillDeleteService,
        Depends(get_user_skill_delete_service),
    ],
) -> None:
    try:
        deleted = service.delete_user_skill(
            user_id=user_id,
            skill_id=skill_id,
        )

        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User skill not found",
            )

    except HTTPException:
        raise

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc
