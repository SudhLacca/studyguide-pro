from typing import List, Dict, Any
from sentence_transformers import SentenceTransformer

class EmbeddingGenerator:
    """Generate true semantic embeddings using local Sentence Transformers"""
    
    def __init__(self):
        # This downloads (on first run) and loads a highly efficient local embedding model
        # It maps sentences & paragraphs to a 384 dimensional dense vector space.
        try:
            self.model = SentenceTransformer('all-MiniLM-L6-v2')
        except Exception as e:
            print(f"Failed to load SentenceTransformer model: {str(e)}")
            self.model = None
    
    def _text_to_embedding(self, text: str) -> List[float]:
        """Convert text to a semantic embedding vector"""
        if not self.model:
            raise RuntimeError("Embedding model is not initialized.")
            
        try:
            # .encode() creates the semantic vector, .tolist() converts it for ChromaDB
            embedding = self.model.encode(text)
            return embedding.tolist()
        except Exception as e:
            print(f"Error creating embedding: {str(e)}")
            # Return a zero vector of the correct dimension as a safe fallback
            return [0.0] * 384
    
    def generate_embeddings(self, chunks: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Generate true semantic embeddings for all document chunks"""
        embedded_chunks = []
        
        for idx, chunk in enumerate(chunks):
            try:
                embedding = self._text_to_embedding(chunk['content'])
                
                chunk_with_embedding = {
                    **chunk,
                    'embedding': embedding
                }
                embedded_chunks.append(chunk_with_embedding)
                
                print(f"Processed chunk {idx + 1}/{len(chunks)}")
                
            except Exception as e:
                print(f"Error generating embedding for chunk {chunk['chunk_id']}: {str(e)}")
                continue
        
        return embedded_chunks
    
    def generate_query_embedding(self, query: str) -> List[float]:
        """Generate a semantic embedding for a user search query"""
        try:
            return self._text_to_embedding(query)
        except Exception as e:
            print(f"Error generating query embedding: {str(e)}")
            return None