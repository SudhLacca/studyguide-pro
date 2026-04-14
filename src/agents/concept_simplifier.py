from src.gemini.gemini_service import GeminiService
from src.vector_store.chroma_store import ChromaStore

class ConceptSimplifier:
    """Simplify complex text based on a target audience difficulty level"""
    
    def __init__(self):
        self.gemini = GeminiService()
        self.vector_store = ChromaStore()
    
    def simplify_text(self, document_name: str, confusing_text: str, level: str) -> str:
        """Simplify the text using document context to ensure factual accuracy"""
        
        # Fetch surrounding context from ChromaDB so the AI doesn't hallucinate definitions
        relevant_chunks = self.vector_store.search(
            confusing_text,
            document_name,
            n_results=3
        )
        
        prompt = f"""You are an expert teacher. The user is struggling to understand the following text from their study material:

"{confusing_text}"

Please explain this concept at the comprehension level of: {level}.

EVALUATION GUIDELINES:
- If the level is 'Explain to a 5-year-old', use extremely simple words and a fun, relatable everyday analogy.
- If the level is 'High Schooler', simplify the heavy jargon but keep the core academic meaning.
- If the level is 'College Student', provide a clear, structured academic explanation.
- If the level is 'Real-world Analogy', focus entirely on comparing it to a common real-world system.
- Keep the explanation concise, engaging, and directly helpful.
- Output only plain text or simple markdown formatting. Do not use complex HTML.

Provide the simplified explanation now:"""
        
        # Generate the explanation using the Groq model
        response = self.gemini.generate_with_context(prompt, relevant_chunks)
        return response