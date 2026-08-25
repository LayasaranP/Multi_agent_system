from pinecone import Pinecone
import os
from dotenv import load_dotenv

load_dotenv()

class PineconeClient:

    def __init__(self) -> None:

        self.client = Pinecone(
            api_key=os.environ.get("PINECONE_API_KEY")
        )

        self.index = self.client.Index(
            host=os.environ.get("PINECONE_INDEX_NAME")
        )