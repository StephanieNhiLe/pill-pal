from typing import Optional
from fastapi import FastAPI, File, UploadFile
from pydantic import BaseModel
from .services.PineconeVectorDB import PineconeVectorDB
from .services.PrescriptionProcessing import PrescriptionUploader

app = FastAPI()

# Create a PineconeVectorDB instance
pinecone_db = PineconeVectorDB("235a04ec-e6c1-41cb-b830-507a96da48a8", "Open-api-key-here", "prescription-index")
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