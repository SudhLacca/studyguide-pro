📚 AI-Powered Study Guide Generator
A comprehensive, interactive learning platform designed to transform static study materials into dynamic educational experiences. This project leverages Retrieval-Augmented Generation (RAG) and Large Language Models (LLMs) to provide students with automated summaries, interactive flashcards, mock exams, and personalized tutoring.

🚀 Key Features
Multi-Format Ingestion: Support for PDF, DOCX, and TXT files.

Semantic Search: Uses all-MiniLM-L6-v2 Sentence Transformers for accurate context retrieval.

Interactive Flashcards: AI-powered active recall with strict answer validation.

🎓 Mock Exam Simulator: Generates full multiple-choice exams with detailed explanations.

🦉 Socratic Tutor Mode: A specialized mode that provides hints and guiding questions instead of direct answers to promote deeper learning.

🧠 Concept Simplifier: Explains complex jargon at different comprehension levels (from 5-year-old to College student).

🗺️ Visual Concept Mapping: Automatically generates Mermaid.js flowcharts to visualize topic hierarchies.

📚 Auto-Glossary: Extracts and defines key terms and acronyms found in the text.

🛠️ Technical Stack
Frontend: Streamlit

LLM Inference: Groq API (Llama 3.1 8B)

Embeddings: Sentence-Transformers (Local)

Vector Database: ChromaDB (Persistent)

Parsing: PyPDF2, python-docx

📋 Prerequisites
Python 3.9+

Groq API Key (Free to generate)

Sufficient disk space for local embedding models

⚙️ Setup Instructions
Follow these steps to get the project running on your local machine.

1. Clone the repository:

Bash
git clone <your-repo-link>
cd Study_Guide
2. Create a Virtual Environment:
It is highly recommended to use a virtual environment to manage dependencies.

Bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
3. Install Dependencies:
Install all required libraries using the requirements.txt file. (Note: The first run might take a few minutes as it downloads the local embedding model).

Bash
pip install -r requirements.txt
4. Set up Environment Variables:
You need to provide your Groq API key for the LLM to function.

Create a file named exactly .env in the root folder of the project.

Add your API key to the file like this:

Code snippet
GROQ_API_KEY=your_actual_api_key_here
🏃‍♂️ How to Run
Once your setup is complete and your virtual environment is activated, you can start the application using Streamlit:

Bash
streamlit run app.py
(Note: If your main Python file is named differently, replace app.py with your file name, e.g., streamlit run main.py)

The application will automatically open in your default web browser at http://localhost:8501.

💡 Usage Tips
First Upload: The first time you upload a document, the system will chunk the text and generate embeddings. This might take a moment depending on the document size.

Database: Your vectors are stored locally in ChromaDB. You do not need to re-upload documents if you restart the server.
