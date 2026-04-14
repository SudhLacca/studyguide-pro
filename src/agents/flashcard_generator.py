from src.gemini.gemini_service import GeminiService
from src.vector_store.chromadb_service import ChromaDBService
from src.data_processing.embedding_generator import EmbeddingGenerator
import json

class FlashcardGenerator:
    """Generate flashcards from document content"""
    
    def __init__(self):
        self.gemini = GeminiService()
        self.chromadb = ChromaDBService()
        self.embedding_gen = EmbeddingGenerator()
    
    def generate_flashcards(self, num_cards: int = 10, topic: str = None) -> list:
        """Generate flashcards from document content"""
        
        # Create query based on topic
        if topic:
            query = f"Generate flashcards about {topic}"
        else:
            query = "Generate flashcards covering main concepts"
        
        # Generate query embedding
        query_embedding = self.embedding_gen.generate_query_embedding(query)
        
        if not query_embedding:
            return [{"error": "Could not generate query embedding"}]
        
        # Retrieve relevant chunks
        results = self.chromadb.query_similar(query_embedding, n_results=10)
        
        if not results or not results['documents']:
            return [{"error": "No documents found to generate flashcards"}]
        
        retrieved_docs = results['documents'][0]
        
        # Create prompt for flashcard generation
        prompt = f"""Generate exactly {num_cards} flashcards from the following content.

Format requirements:
- Each flashcard should have a "question" and an "answer"
- Questions should test understanding, not just memorization
- Answers should be clear and concise
- Return the response as a valid JSON array like this:
[
  {{"question": "What is...", "answer": "..."}},
  {{"question": "How does...", "answer": "..."}}
]

Generate {num_cards} flashcards now:"""
        
        response = self.gemini.generate_with_context(prompt, retrieved_docs)
        
        # Parse the response
        try:
            # Try to extract JSON from response
            flashcards = self._parse_flashcards(response)
            return flashcards[:num_cards]  # Ensure we return exactly num_cards
        except Exception as e:
            print(f"Error parsing flashcards: {str(e)}")
            return [{"error": f"Could not parse flashcards: {str(e)}"}]
    
    def _parse_flashcards(self, response: str) -> list:
        """Parse flashcards from Gemini response"""
        try:
            # Try direct JSON parsing
            flashcards = json.loads(response)
            return flashcards
        except:
            # If direct parsing fails, try to extract JSON from markdown
            import re
            json_match = re.search(r'\[[\s\S]*\]', response)
            if json_match:
                json_str = json_match.group(0)
                flashcards = json.loads(json_str)
                return flashcards
            else:
                # If all else fails, create a basic structure
                return [{"question": "Parse Error", "answer": response}]
