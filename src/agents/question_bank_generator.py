import json
from src.gemini.gemini_service import GeminiService
from src.vector_store.chroma_store import ChromaStore

class QuestionBankGenerator:
    """Generates a structured question bank with different difficulty levels and model answers."""
    
    def __init__(self):
        self.gemini = GeminiService()
        self.vector_store = ChromaStore()
        
    def generate_question_bank(self, document_name: str, specific_topic: str = None) -> list:
        # Fetch relevant content
        query = f"comprehensive details {specific_topic}" if specific_topic else "comprehensive overview core concepts important facts"
        relevant_chunks = self.vector_store.search(query, document_name, n_results=10)
        
        if not relevant_chunks:
            return [{"error": "No content found to generate question bank."}]
            
        prompt = f"""Act as a university professor and create a comprehensive Question Bank based on the provided text.
        {"Focus specifically on: " + specific_topic if specific_topic else "Cover the entire document."}
        
        CRITICAL INSTRUCTIONS:
        - Divide the questions into 3 sections: "Section A: Short Answer (Easy)", "Section B: Conceptual (Medium)", and "Section C: Analytical/Case-Study (Hard)".
        - Generate 3 questions per section (9 questions total).
        - Provide a highly detailed "Model Answer" for every single question.
        - OUTPUT ONLY A VALID JSON ARRAY. No conversational text.
        
        Example JSON format:
        [
          {{
            "section_name": "Section A: Short Answer (Easy)",
            "questions": [
              {{
                "question": "What is the definition of...",
                "model_answer": "The definition is..."
              }}
            ]
          }},
          {{
            "section_name": "Section B: Conceptual (Medium)",
            "questions": [
               ...
            ]
          }}
        ]
        
        Generate the Question Bank now:"""
        
        response = self.gemini.generate_with_context(prompt, relevant_chunks)
        return self._parse_json_response(response)
        
    def _parse_json_response(self, response: str) -> list:
        """Aggressively clean the AI response using Python's raw_decode"""
        try:
            cleaned = response.replace('```json', '').replace('```', '').strip()
            
            start_array = cleaned.find('[')
            start_object = cleaned.find('{')
            
            valid_starts = [idx for idx in (start_array, start_object) if idx != -1]
            if not valid_starts:
                raise ValueError("No JSON structures found.")
                
            start_idx = min(valid_starts)
            decoder = json.JSONDecoder()
            data, _ = decoder.raw_decode(cleaned[start_idx:])
            
            # If AI wrapped the array in a dict, extract it
            if isinstance(data, dict):
                for key, val in data.items():
                    if isinstance(val, list):
                        return val
                return [data]
                
            return data
            
        except Exception as e:
            print(f"JSON Parse Error: {e}")
            return [{"error": "The AI generated malformed data. Please try again."}]