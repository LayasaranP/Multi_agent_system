from store_skills.skill_embedding import GeminiEmbeddingService
from store_skills.skill_client import PineconeClient
from typing import Any
import os
from dotenv import load_dotenv

load_dotenv()

class RetrievalService:

    def __init__(self) -> None:

        self.embedding_service = (
            GeminiEmbeddingService()
        )

        self.pinecone = PineconeClient()

    def search(
        self,
        query: str,
        top_k: int = os.environ.get("TOP_K"),
        filter: dict[str, Any] | None = None,
    ) -> list[dict[str, Any]]:

        query_vector = (
            self.embedding_service
            .embed_query(query)
        )

        response = self.pinecone.index.query(
            namespace=os.environ.get("NAMESPACE"),
            vector=query_vector,
            top_k=top_k,
            include_values=False,
            include_metadata=True,
        )

        results = []

        for res in response.matches:
            results.append({
                "name": res.metadata["name"],
                "description": res.metadata["description"],
            })

        return results