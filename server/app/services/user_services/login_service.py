from fastapi import HTTPException, status

from app.core.config.database_config import get_users_collection
from app.core.schema.user_details import (
    LoginRequest,
    UserResponse,
)
from app.core.config.security_config import verify_password


class LoginService:

    @staticmethod
    def login(data: LoginRequest) -> UserResponse:
        # Get users collection
        users_collection = get_users_collection()

        # -----------------------------
        # 1. Normalize input
        # -----------------------------
        email = str(data.email).strip().lower()
        password = data.password

        # -----------------------------
        # 2. Validate input
        # -----------------------------
        if not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email is required",
            )

        if not password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password is required",
            )

        # -----------------------------
        # 3. Find user
        # -----------------------------
        user = users_collection.find_one(
            {"email": email}
        )

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )

        # -----------------------------
        # 4. Verify password
        # -----------------------------
        is_password_valid = verify_password(
            password,
            user["password"],
        )

        if not is_password_valid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )

        # -----------------------------
        # 5. Return logged-in user
        # -----------------------------
        return UserResponse(
            id=str(user["_id"]),
            name=user["name"],
            email=user["email"],
        )
