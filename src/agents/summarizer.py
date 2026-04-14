from src.gemini.gemini_service import GeminiService
from src.vector_store.chromadb_service import ChromaDBService
from src.data_processing.embedding_generator import EmbeddingGenerator

class Summarizer:
    """Generate summaries from document content"""
    
    def __init__(self):
        self.gemini = GeminiService()
        self.chromadb = ChromaDBService()
        self.embedding_gen = EmbeddingGenerator()
    
    def summarize_document(self, query: str = "Summarize the main points") -> str:
        """Generate a comprehensive summary"""
        
        # Generate query embedding
        query_embedding = self.embedding_gen.generate_query_embedding(query)
        
        if not query_embedding:
            return "Error generating query embedding"
        
        # Retrieve relevant chunks
        results = self.chromadb.query_similar(query_embedding, n_results=10)
        
        if not results or not results['documents']:
            return "No documents found to summarize"
        
        # Get the retrieved documents
        retrieved_docs = results['documents'][0]
        
        # Generate summary using Gemini
        prompt = """Create a comprehensive summary of the following content. 
        Focus on:
        - Main topics and key concepts
        - Important details and facts
        - Overall structure and flow
        
        Please provide a well-organized summary."""
        
        summary = self.gemini.generate_with_context(prompt, retrieved_docs)
        return summary
    
    def summarize_with_custom_focus(self, focus_area: str) -> str:
        """Generate a summary focused on specific area"""
        query = f"Information about {focus_area}"
        query_embedding = self.embedding_gen.generate_query_embedding(query)
        
        if not query_embedding:
            return "Error generating query embedding"
        
        results = self.chromadb.query_similar(query_embedding, n_results=5)
        
        if not results or not results['documents']:
            return f"No information found about {focus_area}"
        
        retrieved_docs = results['documents'][0]
        prompt = f"Summarize the information specifically related to: {focus_area}"
        
        return self.gemini.generate_with_context(prompt, retrieved_docs)
