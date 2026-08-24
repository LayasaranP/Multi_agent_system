from __future__ import annotations

import asyncio

from ...orchestrator_config import AgentConfig
from .specialist_agent import execute_specialist
from ...state import SubagentSpec


async def execute_specialists(
    *,
    specs: list[SubagentSpec],
    user_prompt: str,
    feedback: str,
    llm,
    config: AgentConfig,
) -> list[dict]:
    semaphore = asyncio.Semaphore(config.concurrency)

    tasks = [
        asyncio.create_task(
            execute_specialist(
                spec=spec,
                user_prompt=user_prompt,
                feedback=feedback,
                llm=llm,
                config=config,
                semaphore=semaphore,
            )
        )
        for spec in specs
    ]

    results = await asyncio.gather(*tasks)

    return sorted(
        results,
        key=lambda result: result["agent"],
    )