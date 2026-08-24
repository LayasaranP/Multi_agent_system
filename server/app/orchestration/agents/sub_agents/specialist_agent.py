from __future__ import annotations

import asyncio

from langchain.agents import create_agent

from ...orchestrator_config import AgentConfig
from .specialist_prompts import build_specialist_system_prompt
from .specialist_results import (
    create_failure_result,
    create_success_result,
)
from .specialist_tasks import build_specialist_task
from .specialist_utils import extract_agent_content
from ...state import SubagentSpec


def create_specialist_agent(
    *,
    spec: SubagentSpec,
    llm,
    config: AgentConfig,
):
    return create_agent(
        model=llm,
        tools=list(config.tools),
        system_prompt=build_specialist_system_prompt(spec),
        name=spec.name,
    )


async def execute_specialist(
    *,
    spec: SubagentSpec,
    user_prompt: str,
    feedback: str,
    llm,
    config: AgentConfig,
    semaphore: asyncio.Semaphore,
) -> dict:
    async with semaphore:
        try:
            agent = create_specialist_agent(
                spec=spec,
                llm=llm,
                config=config,
            )

            result = await agent.ainvoke(
                {
                    "messages": [
                        {
                            "role": "user",
                            "content": build_specialist_task(
                                user_prompt=user_prompt,
                                feedback=feedback,
                            ),
                        }
                    ]
                }
            )

            content = extract_agent_content(result)

            return create_success_result(
                spec=spec,
                content=content,
            )

        except Exception as exc:
            return create_failure_result(
                spec=spec,
                error=exc,
            )