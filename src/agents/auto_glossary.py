import json
from src.gemini.gemini_service import GeminiService
from src.vector_store.chroma_store import ChromaStore

class AutoGlossaryExtractor:
    """Extracts key terms and definitions into a structured JSON dictionary"""
    
    def __init__(self):
        self.gemini = GeminiService()
        self.vector_store = ChromaStore()
        
    def generate_glossary(self, document_name: str) -> dict:
        # 1. Search for definition-heavy chunks
        relevant_chunks = self.vector_store.search(
            "definitions key terms concepts meaning glossary", 
            document_name, 
            n_results=5
        )
        
        if not relevant_chunks:
            return {"Notice": "No content found to extract glossary terms."}
            
        # 2. Strict JSON Prompt
        prompt = """Extract 8 to 12 highly important key terms and their definitions from the provided text.
        
        CRITICAL INSTRUCTIONS:
        - Output the result ONLY as a valid JSON dictionary.
        - Do not include markdown formatting, bullet points, or conversational text.
        - The keys should be the Term, and the values should be the Definition.
        
        Example format:
        {
            "Algorithm": "A step-by-step procedure for solving a problem.",
            "Neural Network": "A series of algorithms that endeavors to recognize underlying relationships."
        }
        
        Extract the glossary now:"""
        
        response = self.gemini.generate_with_context(prompt, relevant_chunks)
        return self._parse_glossary(response)
        
    def _parse_glossary(self, response: str) -> dict:
        """Aggressively clean the AI response using Python's raw_decode"""
        try:
            # Strip out markdown code blocks
            cleaned = response.replace('```json', '').replace('```', '').strip()
            
            # Find where the actual JSON dictionary begins
            start_idx = cleaned.find('{')
            
            if start_idx == -1:
                raise ValueError("No JSON dictionary found in the response.")
                
            # Read exactly one valid JSON object and ignore trailing garbage
            decoder = json.JSONDecoder()
            glossary_data, _ = decoder.raw_decode(cleaned[start_idx:])
            
            return glossary_data
            
        except json.JSONDecodeError as e:
            print(f"Glossary Parse Error: {e}\nRaw Response: {response[:150]}...")
            return {"Error": "The AI formatted the glossary incorrectly. Please try regenerating."}
            
        except Exception as e:
            print(f"Unexpected parsing error: {e}")
            return {"Error": f"An unexpected error occurred: {str(e)}"}