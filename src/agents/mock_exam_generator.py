import json
from src.gemini.gemini_service import GeminiService
from src.vector_store.chroma_store import ChromaStore

class MockExamGenerator:
    """Generate multiple-choice mock exams from document content"""
    
    def __init__(self):
        self.gemini = GeminiService()
        self.vector_store = ChromaStore()
    
    def generate_exam(self, document_name: str, num_questions: int = 5) -> list:
        """Generate a structured multiple choice exam"""
        
        # Retrieve comprehensive context representing the whole document
        relevant_chunks = self.vector_store.search(
            "comprehensive overview core concepts important facts",
            document_name,
            n_results=10
        )
        
        if not relevant_chunks:
            return [{"error": "No content found to generate exam."}]
            
        prompt = f"""Generate an ADVANCED, university-level multiple-choice exam with exactly {num_questions} questions based on the provided content.
        
        CRITICAL FORMAT & COMPLEXITY REQUIREMENTS:
        - DO NOT ask basic definition questions.
        - Questions MUST be scenario-based or analytical.
        - The 4 options (A, B, C, D) must be highly plausible.
        - Specify the correct option letter.
        - The explanation must be a detailed analysis.
        - OUTPUT ONLY A VALID JSON ARRAY. NO conversational text before or after.
        
        Example JSON format:
        [
          {{
            "question": "Sample Question?",
            "options": {{
              "A": "Option 1",
              "B": "Option 2",
              "C": "Option 3",
              "D": "Option 4"
            }},
            "correct_answer": "B",
            "explanation": "Because..."
          }}
        ]
        
        Generate {num_questions} complex questions now:"""
        
        response = self.gemini.generate_with_context(prompt, relevant_chunks)
        return self._parse_exam(response, num_questions)
        
    def _parse_exam(self, response: str, num_questions: int) -> list:
        """Aggressively clean the AI response using Python's raw_decode"""
        try:
            # 1. Strip out markdown code blocks if the AI added them
            cleaned = response.replace('```json', '').replace('```', '').strip()
            
            # 2. Find where the actual JSON structure begins
            start_array = cleaned.find('[')
            start_object = cleaned.find('{')
            
            valid_starts = [idx for idx in (start_array, start_object) if idx != -1]
            if not valid_starts:
                raise ValueError("No JSON structures found in the response.")
                
            start_idx = min(valid_starts)
            
            # 3. The Magic Bullet: raw_decode reads exactly one valid JSON object/array
            # and completely ignores any chatty garbage text that comes after it!
            decoder = json.JSONDecoder()
            exam_data, _ = decoder.raw_decode(cleaned[start_idx:])
            
            # 4. Standardize the output format
            if isinstance(exam_data, dict):
                # If it nested the array (e.g., {"questions": [...]})
                for key, val in exam_data.items():
                    if isinstance(val, list):
                        return val[:num_questions]
                return [exam_data]
                
            return exam_data[:num_questions]
            
        except json.JSONDecodeError as e:
            error_snippet = response[:150] + "..." if len(response) > 150 else response
            print(f"JSON Parse Error: {e}\nRaw Response: {error_snippet}")
            return [{"error": "The AI generated malformed data. Please try clicking 'Create Exam' again."}]
            
        except Exception as e:
            print(f"Unexpected parsing error: {e}")
            return [{"error": f"An unexpected error occurred during exam generation: {str(e)}"}]