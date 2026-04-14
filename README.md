# 📚 AI-Powered Study Guide Generator

A comprehensive, interactive learning platform designed to transform static study materials into dynamic educational experiences. This project leverages Retrieval-Augmented Generation (RAG) and Large Language Models (LLMs) to provide students with automated summaries, interactive flashcards, mock exams, and personalized tutoring.

## 🚀 Key Features

* **Multi-Format Ingestion**: Support for PDF, DOCX, and TXT files.
* **Semantic Search**: Uses `all-MiniLM-L6-v2` Sentence Transformers for accurate context retrieval.
* **Interactive Flashcards**: AI-powered active recall with strict answer validation.
* **🎓 Mock Exam Simulator**: Generates full multiple-choice exams with detailed explanations.
* **🦉 Socratic Tutor Mode**: A specialized mode that provides hints and guiding questions instead of direct answers to promote deeper learning.
* **🧠 Concept Simplifier**: Explains complex jargon at different comprehension levels (from 5-year-old to College student).
* **🗺️ Visual Concept Mapping**: Automatically generates Mermaid.js flowcharts to visualize topic hierarchies.
* **📚 Auto-Glossary**: Extracts and defines key terms and acronyms found in the text.

## 🛠️ Technical Stack

* **Frontend**: Streamlit
* **LLM Inference**: Groq API (Llama 3.1 8B)
* **Embeddings**: Sentence-Transformers (Local)
* **Vector Database**: ChromaDB (Persistent)
* **Parsing**: PyPDF2, python-docx

## 📋 Prerequisites

- Python 3.9+
- Groq API Key
- Sufficient disk space for local embedding models

## ⚙️ Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <your-repo-link>
   cd Study_Guide