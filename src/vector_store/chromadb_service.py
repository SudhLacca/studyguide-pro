import chromadb
from chromadb.config import Settings
from typing import List, Dict, Any
import uuid
from config import Config

class ChromaDBService:
    """Manage ChromaDB vector store operations"""
    
    def __init__(self):
        self.client = chromadb.PersistentClient(path=Config.CHROMA_DB_PATH)
        self.collection = None
    
    def create_collection(self, collection_name: str = "study_documents"):
        """Create or get a collection"""
        try:
            self.collection = self.client.get_or_create_collection(
                name=collection_name,
                metadata={"hnsw:space": "cosine"}
            )
            return self.collection
        except Exception as e:
            print(f"Error creating collection: {str(e)}")
            return None
    
    def add_chunks(self, chunks: List[Dict[str, Any]], collection_name: str = "study_documents"):
        """Add embedded chunks to ChromaDB"""
        if not self.collection:
            self.create_collection(collection_name)
        
        try:
            ids = [str(uuid.uuid4()) for _ in chunks]
            embeddings = [chunk['embedding'] for chunk in chunks]
            documents = [chunk['content'] for chunk in chunks]
            metadatas = [chunk['metadata'] for chunk in chunks]
            
            self.collection.add(
                ids=ids,
                embeddings=embeddings,
                documents=documents,
                metadatas=metadatas
            )
            return True
        except Exception as e:
            print(f"Error adding chunks to ChromaDB: {str(e)}")
            return False
    
    def query_similar(self, query_embedding: List[float], n_results: int = 5, 
                     collection_name: str = "study_documents"):
        """Query ChromaDB for similar chunks"""
        if not self.collection:
            self.create_collection(collection_name)
        
        try:
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=n_results
            )
            return results
        except Exception as e:
            print(f"Error querying ChromaDB: {str(e)}")
            return None
    
    def get_all_documents(self, collection_name: str = "study_documents"):
        """Get all documents from collection"""
        if not self.collection:
            self.create_collection(collection_name)
        
        try:
            results = self.collection.get()
            return results
        except Exception as e:
            print(f"Error getting documents: {str(e)}")
            return None
    
    def delete_collection(self, collection_name: str = "study_documents"):
        """Delete a collection"""
        try:
            self.client.delete_collection(name=collection_name)
            self.collection = None
            return True
        except Exception as e:
            print(f"Error deleting collection: {str(e)}")
            return False
