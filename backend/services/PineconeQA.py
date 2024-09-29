from .PineconeVectorDB import PineconeVectorDB
from langchain_openai import ChatOpenAI
from langchain.chains import RetrievalQA

class PineconeQA:
    def __init__(self, pinecone_db: PineconeVectorDB, openai_key):
        self.vector_store = pinecone_db.get_vector_store()
        self.llm = ChatOpenAI(
            api_key=openai_key,
            model_name="gpt-3.5-turbo",
            temperature=0.0,
        )
        self.qa_chain = RetrievalQA.from_chain_type(
            llm=self.llm,
            chain_type="stuff",
            retriever=self.vector_store.as_retriever()
        )

    def ask_question(self, question: str) -> str:
        try:
            response = self.qa_chain.run(question)
            return response
        except Exception as e:
            print(f"Error processing question: {str(e)}")
            return "I'm sorry, I couldn't process that question. Please try again."