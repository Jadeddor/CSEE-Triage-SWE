import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

print("Testing Groq configuration...")

api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    raise ValueError("GROQ_API_KEY is missing in .env")

client = Groq(api_key=api_key)

try:
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": "Say hello in one sentence"}]
    )
    print("✅ Groq is working!")
    print("Response:", response.choices[0].message.content)
except Exception as e:
    print("❌ Groq test failed:", e)
