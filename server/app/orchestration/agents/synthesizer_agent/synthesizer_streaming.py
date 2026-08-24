from __future__ import annotations

from collections.abc import AsyncIterator


async def stream_final_response(
    *,
    agent,
    user_prompt: str,
) -> AsyncIterator[dict]:
    final_text: list[str] = []

    async for chunk in agent.astream(
        {
            "messages": [
                {
                    "role": "user",
                    "content": user_prompt,
                }
            ]
        },
        stream_mode="messages",
        version="v2",
    ):
        if chunk["type"] != "messages":
            continue

        token, metadata = chunk["data"]

        text = getattr(token, "text", None)

        if not text:
            continue

        final_text.append(text)

        yield {
            "type": "token",
            "content": text,
            "metadata": metadata,
        }

    yield {
        "type": "final",
        "content": "".join(final_text),
    }