from mcp.auth_tool import composio

def get_tools(user_id: str, tool_name: str):
  tools = composio.tools.get(
    user_id=user_id,
    toolkits=[tool_name]
)
  return tools