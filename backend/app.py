from typing import Optional
from fastapi import FastAPI, File, UploadFile
from pydantic import BaseModel
from services.PineconeVectorDB import PineconeVectorDB
from services.PrescriptionProcessing import PrescriptionUploader
from services.PineconeQA import PineconeQA
import os 

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
qa = PineconeQA(pinecone_db, OPENAI_API_KEY)

class Prescription(BaseModel):
    patient_name: str
    doctor_name: str
    date: str
    notes: Optional[str] = None

class QuestionRequest(BaseModel):
    question: str

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/add-prescription")
async def add_prescription(file: UploadFile = File(...)):
    try:
        # Save the uploaded file temporarily
        file_path = f"temp_{file.filename}"
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)

        # Check if the file was saved correctly
        if not os.path.exists(file_path):
            raise ValueError(f"File {file_path} could not be saved.")

        # Try to upload the prescription and process the file
        chunks = uploader.upload_prescription(file_path)
        return {
            "message": "Prescription Uploaded Successfully",
            "chunks": chunks
        }, 201
    
    except Exception as e:
        print(f"Error while processing file: {str(e)}")
        return {"message": "Error Processing File"}, 400
    
    finally:
        # Clean up the temporary file
        if os.path.exists(file_path):
            os.remove(file_path)

# TODO: Add a route to get info about prescription drugs

# TODO: add a route to ask questions about prescription drugs
@app.post("/ask-question")
async def ask_question(request: QuestionRequest):
    try:
        response = qa.ask_question(request.question)
        return {"response": response}
    except Exception as e:
        print(f"Error while processing question: {str(e)}")
        return {"message": "Error Processing Question"}, 400

# TODO: Add a route to get info about over-the-counter drugs
# TODO: Add a route to get info about how to take a prescription drug


# For testing purposes only
@app.post("/delete-prescriptions")
async def delete_prescriptions():
    uploader.delete_all_prescriptions()
    return {"message": "All Prescriptions Deleted"}