from src.gemini.gemini_service import GeminiService
from src.vector_store.chromadb_service import ChromaDBService
from src.data_processing.embedding_generator import EmbeddingGenerator

class QATool:
    """Question and Answer tool using RAG (Retrieval Augmented Generation)"""
    
    def __init__(self):
        self.gemini = GeminiService()
        self.chromadb = ChromaDBService()
        self.embedding_gen = EmbeddingGenerator()
    
    def answer_question(self, question: str) -> str:
        """Answer a question based on document content"""
        
        # Generate embedding for the question
        query_embedding = self.embedding_gen.generate_query_embedding(question)
        
        if not query_embedding:
            return "Error generating query embedding for the question"
        
        # Retrieve relevant chunks from ChromaDB
        results = self.chromadb.query_similar(query_embedding, n_results=5)
        
        if not results or not results['documents']:
            return "I don't have enough information to answer this question."
        
        # Get retrieved documents
        retrieved_docs = results['documents'][0]
        
        # Create prompt for Gemini
        prompt = f"""Based on the following context, answer this question: {question}

Instructions:
- Provide a clear and concise answer
- Use only information from the context provided
- If the context doesn't contain the answer, say so
- Cite specific details when possible

Question: {question}"""
        
        answer = self.gemini.generate_with_context(prompt, retrieved_docs)
        return answer
    
    def get_multiple_answers(self, questions: list) -> dict:
        """Answer multiple questions at once"""
        answers = {}
        for question in questions:
            answers[question] = self.answer_question(question)
        return answers
