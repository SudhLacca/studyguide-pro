import chromadb
from chromadb.config import Settings
from typing import List, Dict, Any
from config import Config

class ChromaStore:
    """Handle ChromaDB vector storage"""
    
    def __init__(self):
        self.client = chromadb.PersistentClient(
            path=Config.CHROMA_DB_PATH,
            settings=Settings(
                anonymized_telemetry=False,
                allow_reset=True
            )
        )
        self.collection = self.client.get_or_create_collection(
            name="study_documents",
            metadata={"hnsw:space": "cosine"}
        )
    
    def add_documents(self, embedded_chunks: List[Dict[str, Any]], document_name: str):
        """Add embedded chunks to ChromaDB"""
        ids = [chunk['chunk_id'] for chunk in embedded_chunks]
        embeddings = [chunk['embedding'] for chunk in embedded_chunks]
        documents = [chunk['content'] for chunk in embedded_chunks]
        metadatas = [{'document': document_name} for _ in embedded_chunks]
        
        self.collection.add(
            ids=ids,
            embeddings=embeddings,
            documents=documents,
            metadatas=metadatas
        )
    
    def search(self, query: str, document_name: str, n_results: int = 5) -> List[str]:
        """Search for relevant chunks"""
        from src.data_processing.embedding_generator import EmbeddingGenerator
        
        embedder = EmbeddingGenerator()
        query_embedding = embedder.generate_query_embedding(query)
        
        if query_embedding is None:
            return []
        
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results,
            where={"document": document_name}
        )
        
        return results['documents'][0] if results['documents'] else []
    
    def delete_document(self, document_name: str):
        """Delete all chunks for a document"""
        self.collection.delete(where={"document": document_name})
