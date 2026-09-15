import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)


def ask_ai(prompt: str) -> str:
    response = client.responses.create(
        model="gpt-5.6-luna",
        input=prompt
    )

    return response.output_text