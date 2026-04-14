from config import Config
import os
from datetime import datetime

class OutputFormatter:
    """Format and save different types of outputs"""
    
    def __init__(self):
        self.result_folder = Config.RESULT_FOLDER
    
    def save_summary(self, summary: str, filename: str = None) -> str:
        """Save summary to a text file"""
        if not filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"summary_{timestamp}.txt"
        
        filepath = os.path.join(self.result_folder, filename)
        
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write("=" * 50 + "\n")
                f.write("DOCUMENT SUMMARY\n")
                f.write("=" * 50 + "\n\n")
                f.write(summary)
                f.write("\n\n" + "=" * 50 + "\n")
                f.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
                f.write("=" * 50 + "\n")
            return filepath
        except Exception as e:
            print(f"Error saving summary: {str(e)}")
            return None
    
    def save_flashcards(self, flashcards: list, filename: str = None) -> str:
        """Save flashcards to a text file"""
        if not filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"flashcards_{timestamp}.txt"
        
        filepath = os.path.join(self.result_folder, filename)
        
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write("=" * 50 + "\n")
                f.write("FLASHCARDS\n")
                f.write("=" * 50 + "\n\n")
                
                for idx, card in enumerate(flashcards, 1):
                    if 'error' in card:
                        f.write(f"Error: {card['error']}\n")
                        continue
                    
                    f.write(f"Card {idx}:\n")
                    f.write("-" * 40 + "\n")
                    f.write(f"Q: {card.get('question', 'N/A')}\n\n")
                    f.write(f"A: {card.get('answer', 'N/A')}\n")
                    f.write("-" * 40 + "\n\n")
                
                f.write("=" * 50 + "\n")
                f.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
                f.write("=" * 50 + "\n")
            return filepath
        except Exception as e:
            print(f"Error saving flashcards: {str(e)}")
            return None
    
    def save_qa(self, qa_pairs: dict, filename: str = None) -> str:
        """Save Q&A pairs to a text file"""
        if not filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"qa_{timestamp}.txt"
        
        filepath = os.path.join(self.result_folder, filename)
        
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write("=" * 50 + "\n")
                f.write("QUESTIONS AND ANSWERS\n")
                f.write("=" * 50 + "\n\n")
                
                for question, answer in qa_pairs.items():
                    f.write(f"Q: {question}\n")
                    f.write("-" * 40 + "\n")
                    f.write(f"A: {answer}\n")
                    f.write("=" * 50 + "\n\n")
                
                f.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
                f.write("=" * 50 + "\n")
            return filepath
        except Exception as e:
            print(f"Error saving Q&A: {str(e)}")
            return None
    
    def save_study_guide(self, summary: str, flashcards: list, filename: str = None) -> str:
        """Save a complete study guide with summary and flashcards"""
        if not filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"study_guide_{timestamp}.txt"
        
        filepath = os.path.join(self.result_folder, filename)
        
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write("*" * 60 + "\n")
                f.write(" " * 20 + "STUDY GUIDE\n")
                f.write("*" * 60 + "\n\n")
                
                # Summary section
                f.write("=" * 50 + "\n")
                f.write("SUMMARY\n")
                f.write("=" * 50 + "\n\n")
                f.write(summary)
                f.write("\n\n")
                
                # Flashcards section
                f.write("=" * 50 + "\n")
                f.write("FLASHCARDS FOR REVIEW\n")
                f.write("=" * 50 + "\n\n")
                
                for idx, card in enumerate(flashcards, 1):
                    if 'error' in card:
                        continue
                    
                    f.write(f"Card {idx}:\n")
                    f.write("-" * 40 + "\n")
                    f.write(f"Q: {card.get('question', 'N/A')}\n\n")
                    f.write(f"A: {card.get('answer', 'N/A')}\n")
                    f.write("-" * 40 + "\n\n")
                
                f.write("*" * 60 + "\n")
                f.write(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
                f.write("*" * 60 + "\n")
            return filepath
        except Exception as e:
            print(f"Error saving study guide: {str(e)}")
            return None
