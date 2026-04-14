from groq import Groq

client = Groq(api_key="your_api_key_here")

print("Testing Groq...")
response = client.chat.completions.create(
    model="llama-3.1-8b-instant",
    messages=[
        {"role": "user", "content": "Say hello in one sentence"}
    ]
)

print("✅ Groq works!")
print(f"Response: {response.choices[0].message.content}")
