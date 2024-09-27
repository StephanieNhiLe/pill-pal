import pytest
from unittest.mock import MagicMock
from services.PineconeVectorDB import PineconeVectorDB
from services.PrescriptionProcessing import PrescriptionUploader

@pytest.fixture
def pinecone_db():
    mock_db = MagicMock(spec=PineconeVectorDB)
    mock_db.get_vector_store.return_value = MagicMock()
    return mock_db

@pytest.fixture
def uploader(pinecone_db):
    return PrescriptionUploader(pinecone_db)

def test_store_prescription_vector(uploader):
    prescription_data = {
        "patient_name": "John Doe",
        "doctor_name": "Dr. Smith",
        "date": "2023-10-01",
        "notes": "Take one pill daily",
        "id": "12345"  
    }

    uploader.store_prescription_vector(prescription_data)
    uploader.vector_store.upsert.assert_called_once()

def test_retrieve_prescription(uploader):
    query = "John Doe prescription"

    uploader.vector_store.query.return_value = [
        {"id": "1", "score": 0.9, "metadata": {"patient_name": "John Doe"}}
    ]

    results = uploader.retrieve_prescription(query)

    uploader.vector_store.query.assert_called_once_with([0.1, 0.2, 0.3], top_k=5)  

    assert results == [
        {"id": "1", "score": 0.9, "metadata": {"patient_name": "John Doe"}}
    ]