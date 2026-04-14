import ollama
import sys

print("Testing Ollama connection with lightweight models...")

try:
    # Test embedding with all-minilm
    print("\n1. Testing embeddings (all-minilm)...")
    response = ollama.embeddings(
        model='all-minilm',
        prompt='This is a test'
    )
    print("✅ Embedding test passed!")
    print(f"   Embedding dimension: {len(response['embedding'])}")
except Exception as e:
    print(f"❌ Embedding test failed: {str(e)}")
    sys.exit(1)

try:
    # Test generation with gemma:2b
    print("\n2. Testing text generation (gemma:2b)...")
    response = ollama.generate(
        model='gemma:2b',
        prompt='Say hello in one sentence'
    )
    print("✅ Generation test passed!")
    print(f"   Response: {response['response'][:100]}")
except Exception as e:
    print(f"❌ Generation test failed: {str(e)}")
    sys.exit(1)

print("\n🎉 All tests passed! Ollama is working correctly with lightweight models.")
