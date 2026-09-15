import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY is not set in .env")

client = genai.Client(api_key=api_key)


def ask_ai(prompt: str, response_schema=None) -> str:

    if response_schema:

        interaction = client.interactions.create(
            model="gemini-3.5-flash-lite",
            input=prompt,
            response_format={
                "type": "text",
                "mime_type": "application/json",
                "schema": response_schema
            }
        )

    else:

        interaction = client.interactions.create(
            model="gemini-3.5-flash-lite",
            input=prompt
        )

    return interaction.output_text