from src.gemini.gemini_service import GeminiService
from src.vector_store.chroma_store import ChromaStore

class SocraticTutor:
    """Provide hints and guiding questions instead of direct answers"""
    
    def __init__(self):
        self.gemini = GeminiService()
        self.vector_store = ChromaStore()
        
    def get_guidance(self, question: str, document_name: str) -> str:
        """Generate a Socratic response using document context"""
        
        # Fetch relevant context to ensure the hint is accurate to the material
        relevant_chunks = self.vector_store.search(
            question,
            document_name,
            n_results=3
        )
        
        prompt = f"""You are a Socratic AI Tutor. The student has asked the following question about their study material:
        
        Question: "{question}"
        
        YOUR TASK:
        DO NOT give the direct answer to the question. Instead, use the provided context to:
        1. Acknowledge what they are trying to understand.
        2. Provide a helpful conceptual hint or point them toward the right concept found in the text.
        3. Ask a thought-provoking follow-up question that guides them to figure out the answer themselves.
        
        RULES:
        - Be encouraging, supportive, and educational.
        - Output clean, readable plain text or simple markdown.
        - Keep the response relatively concise (2-3 short paragraphs maximum).
        
        Provide your Socratic guidance now:"""
        
        # Generate the Socratic guidance
        response = self.gemini.generate_with_context(prompt, relevant_chunks)
        return response