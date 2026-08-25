from store_skills.skill_embedding import GeminiEmbeddingService
from store_skills.skill_client import PineconeClient
from typing import List
import uuid


class SkillIngestionService:

    def __init__(self) -> None:
        self.embedding_service = GeminiEmbeddingService()
        self.pinecone = PineconeClient()

    def ingest_skill(self, records: List[dict[str, str]]) -> None:
        skill_records = []

        for record in records:
            embedding = self.embedding_service.embed_query(
                record["description"]
            )

            skill_records.append(
                {
                    "id": str(uuid.uuid4()),
                    "values": embedding,
                    "metadata": {
                        "name": record["name"],
                        "description": record["description"],
                        "type": "skill",
                    },
                }
            )
        self.pinecone.index.upsert(
            namespace="skill_namespace",
            vectors=skill_records,
        )