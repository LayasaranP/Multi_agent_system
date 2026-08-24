from __future__ import annotations

import json
from typing import Any


def extract_agent_content(result: Any) -> str:
    messages = result["messages"]
    final_message = messages[-1]

    if getattr(final_message, "text", None):
        return final_message.text

    content = getattr(final_message, "content", "")

    if isinstance(content, str):
        return content

    return json.dumps(
        content,
        ensure_ascii=False,
        default=str,
    )