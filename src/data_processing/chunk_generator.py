from typing import List, Dict, Any
from config import Config

class ChunkGenerator:
    """Generate chunks from document content for embedding"""
    
    def __init__(self, chunk_size: int = None, overlap: int = None):
        self.chunk_size = chunk_size or Config.CHUNK_SIZE
        self.overlap = overlap or Config.CHUNK_OVERLAP
    
    def create_chunks(self, document_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Create chunks from document content"""
        content = document_data.get('content', '')
        
        if not content:
            return []
        
        chunks = self._split_text(content)
        
        # Create chunk objects with metadata
        chunk_objects = []
        for idx, chunk_text in enumerate(chunks):
            chunk_objects.append({
                'chunk_id': idx,
                'content': chunk_text,
                'metadata': {
                    'source_file': document_data.get('filename', 'unknown'),
                    'document_type': document_data.get('type', 'unknown'),
                    'chunk_index': idx,
                    'total_chunks': len(chunks)
                }
            })
        
        return chunk_objects
    
    def _split_text(self, text: str) -> List[str]:
        """Split text into overlapping chunks"""
        chunks = []
        start = 0
        text_length = len(text)
        
        while start < text_length:
            end = start + self.chunk_size
            
            # Get the chunk
            chunk = text[start:end]
            
            # Try to break at sentence or word boundary
            if end < text_length:
                # Look for last period, question mark, or exclamation
                last_sentence = max(
                    chunk.rfind('.'),
                    chunk.rfind('?'),
                    chunk.rfind('!')
                )
                
                if last_sentence > self.chunk_size * 0.5:
                    chunk = chunk[:last_sentence + 1]
                    end = start + last_sentence + 1
                else:
                    # If no sentence boundary, try word boundary
                    last_space = chunk.rfind(' ')
                    if last_space > 0:
                        chunk = chunk[:last_space]
                        end = start + last_space
            
            chunks.append(chunk.strip())
            start = end - self.overlap
        
        return chunks
