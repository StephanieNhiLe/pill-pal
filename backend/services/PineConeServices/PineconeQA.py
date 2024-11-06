import ast
import base64
from typing import List, Tuple
from .PineconeVectorDB import PineconeVectorDB
from langchain_openai import ChatOpenAI
from langchain.chains import RetrievalQA
from langchain_community.document_loaders.image import UnstructuredImageLoader
from langchain.schema import HumanMessage, AIMessage
from typing import List, Tuple
from typing import Dict

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
        self.chat_history: List[Tuple[str, str]] = []
        
    def modify_prompt_for_nurse_style(self, question: str) -> str:
            history_context = ""
            if self.chat_history:
                history_context = "Remember our previous conversation. "

            nurse_style_prompt = (
                f"{history_context}You are a friendly and empathetic nurse named Sarah. "
                "Respond to the patient's question in a warm, conversational tone. "
                "Use simple language, show understanding, and offer reassurance. Avoid medical jargon when possible. "
                "If you need to list information, do it naturally as part of the conversation, not in a structured format. "
                "Don't reintroduce yourself if you've already done so in the conversation. "
                f"The patient asks: {question}"
            )
            return nurse_style_prompt
    
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
                            "text": "Analyze this image and provide a brief description of the medication shown."
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

            vision_response = self.image_model.invoke(vision_messages)
            
            # Combine the nursing-style question with the vision model's analysis
            combined_query = self.modify_prompt_for_nurse_style(
                f"{question} The medication in the image appears to be {vision_response.content}"
            )

            # Use the qa_chain to get the final response, incorporating vector store context
            final_response = self.qa_chain.run(combined_query)

            self.chat_history.append((question, final_response))
            return final_response
        except Exception as e:
            print(f"Error processing question: {str(e)}")
            return "I'm sorry, I couldn't process that question. Please try again."
        
    def get_chat_history(self) -> List[Tuple[str, str]]:
        return self.chat_history

    def clear_chat_history(self):
        self.chat_history = []

    def get_medication_list(self, chunks) -> Dict[str, Dict[str, str]]:
        medication_message = [
            HumanMessage(
                content=[
                    {
                        "type": "text", 
                        "text": "Analyze the following chunks and provide a Python dictionary. The keys should be medication names, and the values should be dictionaries containing 'dosage' and 'time' information if available. If dosage or time is not available, use 'Unknown' as the value. Return ONLY this Python dictionary, without any additional text, code formatting, or explanation."
                    },
                    {
                        "type": "text",
                        "text": str(chunks)
                    },
                ]
            )
        ]
        
        response = self.llm.invoke(medication_message)
        print(f"Response from LLM: {response.content}")
        try:
            parsed_response = ast.literal_eval(response.content.strip())
            if not isinstance(parsed_response, dict):
                raise ValueError("Response is not a valid Python dictionary")
            
            # Ensure all medications have 'dosage' and 'time' keys, even if the value is 'Unknown'
            for med, info in parsed_response.items():
                if not isinstance(info, dict):
                    parsed_response[med] = {'dosage': 'Unknown', 'time': 'Unknown'}
                else:
                    parsed_response[med]['dosage'] = info.get('dosage', 'Unknown')
                    parsed_response[med]['time'] = info.get('time', 'Unknown')
            
        except Exception as e:
            print(f"Error parsing medication information: {e}")
            # If parsing fails, try to extract medication names at least
            try:
                medication_names = ast.literal_eval(response.content.strip())
                if isinstance(medication_names, list):
                    parsed_response = {med: {'dosage': 'Unknown', 'time': 'Unknown'} for med in medication_names}
                else:
                    raise ValueError("Unable to extract medication names")
            except:
                parsed_response = {}

        print(f"Parsed Medication Information: {parsed_response}")
        
        return parsed_response