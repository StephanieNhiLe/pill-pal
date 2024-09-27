from typing import Optional
from fastapi import FastAPI, File, UploadFile
from pydantic import BaseModel
from .services.PineconeVectorDB import PineconeVectorDB
from .services.PrescriptionProcessing import PrescriptionUploader
from langchain import LangChain
from llama_index import LlamaIndex
import requests 

app = FastAPI()

# Create a PineconeVectorDB instance
pinecone_db = PineconeVectorDB("235a04ec-e6c1-41cb-b830-507a96da48a8", "Open-api-key-here", "prescription-index")
# Create an index/initialize the Pinecone index
pinecone_db.create_index()
# Get the vector store
uploader = PrescriptionUploader(pinecone_db)

# Initialize the LLM model
llm = LangChain(model_name="gpt-3.5-turbo")
# or
llm = LlamaIndex(model_name="gpt-3.5-turbo")

class Prescription(BaseModel):
    patient_name: str
    doctor_name: str
    date: str
    notes: Optional[str] = None

def identify_pill(image_url):
    response = requests.get(f"https://rximage.nlm.nih.gov/api/rximage/1/rxnav?url={image_url}")
    return response.json()

def query_prescription(prescription_text):
    response = llm.query(prescription_text)
    return response

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
    
@app.post("/identify-pill")
async def identify_pill_endpoint(image: UploadFile = File(...)):
    try:
        image_url = f"temp_{image.filename}"
        with open(image_url, "wb") as buffer:
            content = await image.read()
            buffer.write(content)
        
        pill_info = identify_pill(image_url)
        return pill_info
    except Exception as e:
        return {"error": str(e)}

@app.post("/query-prescription")
async def query_prescription_endpoint(query: str):
    try:
        results = uploader.retrieve_prescription(query)
        return results
    except Exception as e:
        return {"error": str(e)}
 