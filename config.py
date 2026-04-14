import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Groq API (for both embeddings and text generation)
    GROQ_API_KEY = os.getenv('GROQ_API_KEY')
    GROQ_EMBEDDING_MODEL = "llama-3.1-8b-instant"  # Using text model for embeddings
    GROQ_GENERATION_MODEL = "llama-3.1-8b-instant"  # Text generation model
    
    # File paths
    UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER', './data/uploads')
    CHROMA_DB_PATH = os.getenv('CHROMA_DB_PATH', './data/chroma_db')
    RESULT_FOLDER = os.getenv('RESULT_FOLDER', './data/result')
    
    # Chunking settings
    CHUNK_SIZE = int(os.getenv('CHUNK_SIZE', 1000))
    CHUNK_OVERLAP = int(os.getenv('CHUNK_OVERLAP', 200))
    
    # File size limit
    MAX_FILE_SIZE_MB = int(os.getenv('MAX_FILE_SIZE_MB', 50))
    
    @staticmethod
    def create_folders():
        """Create necessary folders if they don't exist"""
        os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
        os.makedirs(Config.CHROMA_DB_PATH, exist_ok=True)
        os.makedirs(Config.RESULT_FOLDER, exist_ok=True)

# Create folders on import
Config.create_folders()
