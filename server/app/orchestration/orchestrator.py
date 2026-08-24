from __future__ import annotations

from collections.abc import AsyncIterator
from typing import Any

from .orchestrator_config import create_agent_config, create_llm
from .workflow import execute_workflow


async def run_dynamic_subagents(
    user_prompt: str,
    *,
    model: str = "openai:gpt-5.5",
    model_provider: str,
    api_key: str,
    max_subagents: int = 2,
    max_iterations: int = 2,
    concurrency: int = 2,
    tools: list[Any] | None = None,
) -> AsyncIterator[dict]:
    config = create_agent_config(
        model=model,
        model_provider=model_provider,
        api_key=api_key,
        max_subagents=max_subagents,
        max_iterations=max_iterations,
        concurrency=concurrency,
        tools=tools,
    )

    llm = create_llm(config)

    try:
        async for event in execute_workflow(
            user_prompt=user_prompt,
            llm=llm,
            config=config,
        ):
            yield event

    except Exception as exc:
        yield {
            "type": "error",
            "error": str(exc),
        }