import base64
from .PineconeVectorDB import PineconeVectorDB
from langchain_openai import ChatOpenAI
from langchain.chains import RetrievalQA
from langchain_community.document_loaders.image import UnstructuredImageLoader
from langchain.schema import HumanMessage, AIMessage

class PineconeQA:
    def __init__(self, pinecone_db: PineconeVectorDB, openai_key):
        self.vector_store = pinecone_db.get_vector_store()
        self.llm = ChatOpenAI(
            api_key=openai_key,
            model_name="gpt-4o",
            temperature=0.0,
        )
        self.image_model: ChatOpenAI = ChatOpenAI(
            temperature=0.5,
            model="gpt-4o-2024-05-13",
            max_tokens=1024,
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
    
    def ask_question_with_med_photo(self, question: str, photo_path: str) -> str:
        try:
            
            with open(photo_path, "rb") as image_file:
                image_data = base64.b64encode(image_file.read()).decode("utf-8")
            
            vision_messages = [
                HumanMessage(
                    content=[
                        {
                            "type": "text", 
                            "text": f"Analyze this image and provide a brief description of the medication shown."
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{image_data}"
                            },
                        },
                    ]
                )
            ]

            # Get the initial response from the vision-capable model
            vision_response = self.image_model.invoke(vision_messages)

            # Combine the original question with the vision model's analysis
            combined_query = f"{question} Context from image: {vision_response.content}"

            # Use the qa_chain to get the final response, incorporating vector store context
            final_response = self.qa_chain.run(combined_query)

            return final_response
        except Exception as e:
            print(f"Error processing question: {str(e)}")
            return "I'm sorry, I couldn't process that question. Please try again."
