from pinecone import Pinecone, ServerlessSpec
import os
from dotenv import load_dotenv

load_dotenv()


def create_index() -> None:

    pc = Pinecone(
        api_key=os.environ.get("PINECONE_API_KEY")
    )

    if pc.has_index(os.environ.get("PINECONE_INDEX_NAME")):
        print(
            f"Index already exists: "
            f"{os.environ.get("PINECONE_INDEX_NAME")}"
        )
        return

    pc.create_index(
        name=os.environ.get("PINECONE_INDEX_NAME"),
        dimension=os.environ.get("EMBEDDING_DIMENSION"),
        metric="cosine",
        spec=ServerlessSpec(
            cloud="aws",
            region="us-east-1",
        ),
        deletion_protection="enabled",
    )

    print(
        f"Created index: "
        f"{os.environ.get("PINECONE_INDEX_NAME")}"
    )
    