from typing import Optional
from fastapi import FastAPI, File, UploadFile
from pydantic import BaseModel
from services.PineconeVectorDB import PineconeVectorDB
from services.PrescriptionProcessing import PrescriptionUploader

app = FastAPI()

OPENAI_API_KEY = "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"
PINECONE_API_KEY = "235a04ec-e6c1-41cb-b830-507a96da48a8"
PINECONE_INDEX_NAME = "prescription-index"

# Create a PineconeVectorDB instance
pinecone_db = PineconeVectorDB(PINECONE_API_KEY, OPENAI_API_KEY, PINECONE_INDEX_NAME)

# Check if the index exists
if not pinecone_db.check_index_exists():
    # Create an index/initialize the Pinecone index
    pinecone_db.create_index()

# Get the vector store
uploader = PrescriptionUploader(pinecone_db)

class Prescription(BaseModel):
    patient_name: str
    doctor_name: str
    date: str
    notes: Optional[str] = None

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/add-prescription")
async def add_prescription(prescription: Prescription, file: UploadFile = File(...)):
    try:
        file_path = f"temp_{file.filename}"
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        chunks = uploader.upload_prescription(file_path)
        return {
            "message": "Prescription Uploaded Successfully",
            "chunks": chunks
        }, 201
    except:
        return {"message": "Error Processing File"}, 400