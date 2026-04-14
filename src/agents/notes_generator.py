from src.gemini.gemini_service import GeminiService
from src.vector_store.chroma_store import ChromaStore

class NotesGenerator:
    """Generates comprehensive, well-structured study notes from document content."""
    
    def __init__(self):
        self.gemini = GeminiService()
        self.vector_store = ChromaStore()
        
    def generate_notes(self, document_name: str) -> str:
        # Reverted back to 10 chunks to stay safely under Groq's 6000 TPM limit
        relevant_chunks = self.vector_store.search(
            "comprehensive overview core concepts important facts detailed explanations", 
            document_name, 
            n_results=10 
        )
        
        if not relevant_chunks:
            return "No content found. Please ensure the document is uploaded correctly."
            
        prompt = """You are an expert educational designer. Create highly structured, visually pleasing study notes from the provided context. 
        Format this strictly like a premium Notion template or a high-end textbook.
        
        STRICT DESIGN RULES:
        1. EMOJIS: Include a relevant emoji at the start of EVERY Main Heading (##) and Subheading (###).
        2. QUOTE BLOCKS: Use blockquotes (>) for the most critical definitions, formulas, or "Key Takeaways". 
        3. TABLES: Whenever you are comparing two things, listing pros/cons, or showing structured data, you MUST use a Markdown Table.
        4. HIGHLIGHTING: **Bold** all important vocabulary words. Use `code ticks` for specific acronyms or technical terms.
        5. HEAVY BULLET POINTS: Avoid long paragraphs. Use bullet points (-) aggressively to break down complex ideas.
        6. WHITE SPACE: You MUST leave a completely blank empty line before and after every heading, list, table, and paragraph.
        
        Output strictly in Markdown format. Do not include introductory text."""
        
        response = self.gemini.generate_with_context(prompt, relevant_chunks)
        cleaned = response.replace('```markdown', '').replace('```', '').strip()
        return cleaned