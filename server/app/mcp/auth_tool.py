import os
from composio import Composio
from dotenv import load_dotenv

load_dotenv()

def connect_tools(user_id: str, tool_name: str, provider: str):
  
  composio = Composio(api_key=os.environ.get("COMPOSIO_API_KEY"), provider=provider)
  session = composio.create(user_id=user_id, toolkits=[tool_name])
  
  connection = session.authorize(tool_name)
  
  if connection.redirect_url:
    return connection.redirect_url