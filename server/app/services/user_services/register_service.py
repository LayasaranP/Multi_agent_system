from fastapi import HTTPException, status
from pymongo.errors import DuplicateKeyError

from app.core.config.database_config import get_users_collection
from app.core.schema.user_details import (
    SignupRequest,
    UserResponse,
)
from app.core.config.security_config import hash_password


class RegisterService:

    @staticmethod
    def register(data: SignupRequest) -> UserResponse:
        # Get users collection
        users_collection = get_users_collection()

        # -----------------------------
        # 1. Normalize input
        # -----------------------------
        name = data.name.strip()
        email = str(data.email).strip().lower()
        password = data.password

        # -----------------------------
        # 2. Validate input
        # -----------------------------
        if not name:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Name cannot be empty",
            )

        if not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email is required",
            )

        if len(password) < 8:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password must be at least 8 characters",
            )

        # -----------------------------
        # 3. Check existing user
        # -----------------------------
        existing_user = users_collection.find_one(
            {"email": email}
        )

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered",
            )

        # -----------------------------
        # 4. Hash password
        # -----------------------------
        hashed_password = hash_password(password)

        # -----------------------------
        # 5. Create user document
        # -----------------------------
        user_data = {
            "name": name,
            "email": email,
            "password": hashed_password,
        }

        # -----------------------------
        # 6. Insert into MongoDB
        # -----------------------------
        try:
            result = users_collection.insert_one(user_data)

        except DuplicateKeyError:
            # Handles simultaneous requests
            # attempting to register the same email.
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered",
            )

        # -----------------------------
        # 7. Return user response
        # -----------------------------
        return UserResponse(
            id=str(result.inserted_id),
            name=name,
            email=email,
        )
