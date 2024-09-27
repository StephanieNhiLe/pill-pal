# services/PrescriptionProcessing.py

from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import CharacterTextSplitter
from .PineconeVectorDB import PineconeVectorDB

class PrescriptionUploader:
    def __init__(self, pinecone_db: PineconeVectorDB):
        self.vector_store = pinecone_db.get_vector_store()

    def upload_prescription(self, file_path):
        loader = TextLoader(file_path)
        documents = loader.load()
        text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
        chunks = text_splitter.split_documents(documents)
        self.vector_store.add_documents(chunks)
        return len(chunks)

    def store_prescription_vector(self, prescription_data):
        vector = self.vectorize(prescription_data)
        self.vector_store.upsert([(prescription_data['id'], vector)])

    def retrieve_prescription(self, query):
        vector = self.vectorize(query)
        results = self.vector_store.query(vector, top_k=5)
        return results

    def vectorize(self, data):
        return [0.1, 0.2, 0.3] 