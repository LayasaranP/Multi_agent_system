from google import genai
from google.genai import types
import os
from dotenv import load_dotenv

load_dotenv()


class GeminiEmbeddingService:

    def __init__(self) -> None:
        self.client = genai.Client(
            api_key=os.environ.get("GEMINI_Embedding_API_KEY")
        )

    def embed_documents(
        self,
        texts: list[str],
    ) -> list[list[float]]:

        if not texts:
            return []

        response = self.client.models.embed_content(
            model=os.environ.get("EMBEDDING_MODEL"),
            contents=texts,
            config=types.EmbedContentConfig(
                output_dimensionality=os.environ.get("EMBEDDING_DIMENSION"),
            ),
        )

        if not response.embeddings:
            raise RuntimeError(
                "Gemini returned no embeddings"
            )

        return [
            embedding.values
            for embedding in response.embeddings
        ]

    def embed_query(
        self,
        text: str,
    ) -> list[float]:

        if not text.strip():
            raise ValueError(
                "Query cannot be empty"
            )

        response = self.client.models.embed_content(
            model=os.environ.get("EMBEDDING_MODEL"),
            contents=text,
            config=types.EmbedContentConfig(
                output_dimensionality=os.environ.get("EMBEDDING_DIMENSION"),
            ),
        )

        if not response.embeddings:
            raise RuntimeError(
                "Gemini returned no embedding"
            )

        return response.embeddings[0].values