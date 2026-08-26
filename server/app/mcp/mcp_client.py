from mcp.auth_tool import Composio
from google import genai
from google.genai import types

session = composio.create(user_id="user_123", toolkits=['FIGMA'])
tools = session.tools()

config = types.GenerateContentConfig(tools=tools)
chat = client.chats.create(model="gemini-2.5-flash", config=config)

response = chat.send_message(
    "Check my canva account list the designs."
)
print(response.text)