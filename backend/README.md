# Backend for Future-data-hack

## How to run:
1. Get into the director using:
```
cd backend
```
2. Install dependencies:
```
pip install -r requirements.txt
```
3. on terminal run the following command to save pinecone api key into env
    - I've also added os code to add it while run time, haven't tested it out.
```
export PINECONE_API_KEY=<PINECONE_API_KEY>
```
5. Install tesseract for image processing.
    - If you use macOS (why?)
```
brew install tesseract
```
- If you use Linux (why? get some help.)
```
sudo apt-get install tesseract-ocr
```
4. Start backend
```
fastapi dev app.py
```