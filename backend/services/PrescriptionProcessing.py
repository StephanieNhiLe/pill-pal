from langchain_community.document_loaders import TextLoader, PyPDFLoader
from langchain_community.document_loaders.image import UnstructuredImageLoader
from langchain_text_splitters import CharacterTextSplitter
from .PineconeVectorDB import PineconeVectorDB
import os

class PrescriptionUploader:
    def __init__(self, pinecone_db: PineconeVectorDB):
        self.vector_store = pinecone_db.get_vector_store()

    def upload_prescription(self, file_path):
        file_extension = os.path.splitext(file_path)[1].lower()
        
        if file_extension == '.txt':
            loader = TextLoader(file_path)
        elif file_extension == '.pdf':
            loader = PyPDFLoader(file_path)
        elif file_extension in ['.png', '.jpg', '.jpeg']:
            loader = UnstructuredImageLoader(file_path)
            print("Unstructured Image Loader")
        else:
            raise ValueError(f"Unsupported file type: {file_extension}")

        try:
            documents = loader.load()
        except Exception as e:
            print(f"Failed to load file {file_path}: {str(e)}")
            raise ValueError("Error Processing File") from e

        text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
        chunks = text_splitter.split_documents(documents)

        for chunk in chunks:
            chunk.metadata['source'] = file_path
            chunk.metadata['file_type'] = file_extension

        self.vector_store.add_documents(chunks)
        return len(chunks)

    def delete_all_prescriptions(self):
        self.vector_store.delete(delete_all=True)
        return True
    
    def delete_prescription(self, file_path):
        loader = TextLoader(file_path)
        documents = loader.load()
        text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
        chunks = text_splitter.split_documents(documents)
        self.vector_store.delete(chunks)
        return len(chunks)

