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