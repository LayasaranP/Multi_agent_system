import os
from functools import lru_cache

from pymongo import MongoClient
from pymongo.collection import Collection
from pymongo.errors import PyMongoError, ServerSelectionTimeoutError

from dotenv import load_dotenv

load_dotenv()


@lru_cache(maxsize=1)
def get_mongo_client() -> MongoClient:
    """
    Create and cache a single MongoClient for the application process.

    MongoClient is thread-safe and is intended to be shared rather than
    recreated for every request.
    """
    mongo_uri = os.getenv("MONGODB_URI")
    if not mongo_uri:
        raise RuntimeError("MONGODB_URI environment variable is not set")

    client = MongoClient(
        mongo_uri,
        serverSelectionTimeoutMS=5000,
        connectTimeoutMS=5000,
        socketTimeoutMS=10000,
        maxPoolSize=100,
        minPoolSize=10,
        retryWrites=True,
        retryReads=True,
    )

    try:
        client.admin.command("ping")
    except ServerSelectionTimeoutError as exc:
        client.close()
        raise RuntimeError("Could not connect to MongoDB") from exc
    except PyMongoError as exc:
        client.close()
        raise RuntimeError("MongoDB connection check failed") from exc

    return client


def get_database():
    client = get_mongo_client()

    database_name = os.getenv("MONGODB_DATABASE")
    if not database_name:
        raise RuntimeError("MONGODB_DATABASE environment variable is not set")

    return client[database_name]

USERS_COLLECTION_NAME = os.environ.get("USER_COLLECTION_NAME")

def get_users_collection() -> Collection:
    """
    Return the users collection.

    Creates the collection only if it does not already exist.
    Also ensures that email is unique.
    """

    database = get_database()

    # Check whether collection already exists
    existing_collections = database.list_collection_names()

    if USERS_COLLECTION_NAME not in existing_collections:
        database.create_collection(USERS_COLLECTION_NAME)

    users_collection = database[USERS_COLLECTION_NAME]

    # Make email unique
    users_collection.create_index(
        "email",
        unique=True,
    )

    return users_collection

CHATS_COLLECTION_NAME = os.environ.get("CHATS_COLLECTION_NAME")


def get_chats_collection() -> Collection:
    """
    Return the chats collection.

    Creates the collection only if it does not already exist.
    Also ensures that useful indexes are present.
    """

    database = get_database()

    # Check whether collection already exists
    existing_collections = database.list_collection_names()

    if CHATS_COLLECTION_NAME not in existing_collections:
        database.create_collection(CHATS_COLLECTION_NAME)

    chats_collection = database[CHATS_COLLECTION_NAME]

    # Useful indexes
    chats_collection.create_index(
        [("updated_at", -1)]
    )

    chats_collection.create_index(
        [("created_at", -1)]
    )

    return chats_collection

def close_mongodb() -> None:
    """Close the shared MongoDB client during application shutdown."""
    if get_mongo_client.cache_info().currsize:
        get_mongo_client().close()
        get_mongo_client.cache_clear()

