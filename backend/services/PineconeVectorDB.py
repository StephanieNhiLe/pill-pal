from pinecone import Pinecone, ServerlessSpec
from langchain_pinecone import PineconeVectorStore
from langchain_openai import OpenAIEmbeddings
import os

class PineconeVectorDB:
    def __init__(self, pinecone_api_key, openai_api_key, index_name):
        os.environ['PINECONE_API_KEY'] = pinecone_api_key
        self.pc = Pinecone(api_key=pinecone_api_key)
        self.index_name = index_name
        self.embeddings = OpenAIEmbeddings(api_key=openai_api_key)

    def create_index(self):
        if self.index_name not in self.pc.list_indexes():
            self.pc.create_index(
                name=self.index_name,
                dimension=1536,
                metric="cosine",
                spec=ServerlessSpec(cloud="aws", region="us-east-1")
            )
    
    def check_index_exists(self):
        try:
            self.pc.describe_index(self.index_name)
            print(f"Index {self.index_name} exists")
            return True
        except Exception:
            return False
    
    def get_vector_store(self):
        return PineconeVectorStore(index_name=self.index_name, embedding=self.embeddings)