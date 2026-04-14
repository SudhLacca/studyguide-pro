from typing import List, Dict, Any
from config import Config

class TextChunker:
    """Split text into chunks for processing"""
    
    def __init__(self):
        self.chunk_size = Config.CHUNK_SIZE
        self.chunk_overlap = Config.CHUNK_OVERLAP
    
    def chunk_text(self, text: str, document_name: str) -> List[Dict[str, Any]]:
        """Split text into overlapping chunks"""
        chunks = []
        words = text.split()
        
        # Calculate number of words per chunk
        words_per_chunk = self.chunk_size // 5  # Rough estimate: 5 chars per word
        overlap_words = self.chunk_overlap // 5
        
        start = 0
        chunk_id = 0
        
        while start < len(words):
            end = start + words_per_chunk
            chunk_words = words[start:end]
            chunk_text = ' '.join(chunk_words)
            
            chunks.append({
                'chunk_id': f"{document_name}_chunk_{chunk_id}",
                'content': chunk_text,
                'document': document_name,
                'start_index': start
            })
            
            start = end - overlap_words
            chunk_id += 1
            
            # Break if we've reached the end
            if end >= len(words):
                break
        
        return chunks
