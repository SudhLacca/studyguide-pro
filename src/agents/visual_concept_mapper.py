import re
from src.gemini.gemini_service import GeminiService
from src.vector_store.chroma_store import ChromaStore

class VisualConceptMapper:
    """Generate Mermaid.js syntax to create visual mind maps of concepts"""
    
    def __init__(self):
        self.gemini = GeminiService()
        self.vector_store = ChromaStore()
        
    def generate_mindmap(self, document_name: str) -> str:
        """Extract hierarchical concepts and format them as a Mermaid.js graph"""
        
        relevant_chunks = self.vector_store.search(
            "comprehensive overview all main topics subtopics structure",
            document_name,
            n_results=10
        )
        
        if not relevant_chunks:
            return "graph TD\n  A[Error] --> B[No content found to map]"
            
        prompt = """Analyze the provided text and identify the main topic and its subtopics.
        
        Your task is to generate ONLY valid Mermaid.js graph syntax (graph TD).
        
        CRITICAL RULES:
        1. Start with 'graph TD'.
        2. Use the format: ID["Label Text"]
        3. ALWAYS wrap labels in double quotes inside the brackets to prevent syntax errors with special characters.
        4. No special characters like colons, commas, or parentheses allowed outside of the quotes.
        5. Return ONLY the Mermaid code block. No conversational filler.
        
        Example Output:
        graph TD
            A["Machine Learning"] --> B["Supervised Learning"]
            A --> C["Unsupervised Learning"]
            B --> D["Neural Networks"]
        
        Generate the Mermaid syntax now:"""
        
        response = self.gemini.generate_with_context(prompt, relevant_chunks)
        return self._extract_mermaid_syntax(response)
        
    def _extract_mermaid_syntax(self, response: str) -> str:
        """Clean the LLM output and fix common syntax breaking characters"""
        # 1. Strip markdown blocks
        clean_response = response.replace('```mermaid', '').replace('```', '').strip()
        
        # 2. Basic cleanup for common hallucinated characters
        # Replace problematic characters that aren't inside quotes (heuristic)
        lines = clean_response.split('\n')
        fixed_lines = []
        for line in lines:
            if '-->' in line:
                # Ensure the line starts with a valid graph structure
                fixed_lines.append(line)
            elif line.startswith('graph TD'):
                fixed_lines.append(line)
                
        final_code = '\n'.join(fixed_lines)

        # 3. Fallback check
        if not final_code.startswith('graph TD'):
            match = re.search(r'graph TD[\s\S]*', clean_response)
            if match:
                return match.group(0)
            return 'graph TD\n  A["Document Overview"] --> B["Content Processed"]'
            
        return final_code