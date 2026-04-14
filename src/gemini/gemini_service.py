from groq import Groq
from typing import List
from config import Config

class GeminiService:
    """Handle text generation using Groq (keeping class name for compatibility)"""
    
    def __init__(self):
        self.client = Groq(api_key=Config.GROQ_API_KEY)
        self.model = "llama-3.1-8b-instant"  # Fast Groq model
    
    def generate_content(self, prompt: str, context: str = "") -> str:
        """Generate content using Groq"""
        try:
            full_prompt = f"Context:\n{context}\n\nTask:\n{prompt}" if context else prompt
            
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a helpful study assistant."},
                    {"role": "user", "content": full_prompt}
                ],
                temperature=0.7,
                max_tokens=1024
            )
            
            return response.choices[0].message.content
        except Exception as e:
            print(f"Error generating content: {str(e)}")
            return f"Error: {str(e)}"
    
    def generate_with_context(self, task: str, retrieved_chunks: List[str]) -> str:
        """Generate content with retrieved context"""
        context = "\n\n".join(retrieved_chunks)
        return self.generate_content(task, context)
