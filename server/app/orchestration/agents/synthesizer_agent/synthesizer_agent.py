from __future__ import annotations

from langchain.agents import create_agent

from ...orchestrator_config import AgentConfig
from ...state import Evaluation, Plan
from .synthesizer_prompts import build_synthesis_prompt


def create_final_agent(
    *,
    llm,
    config: AgentConfig,
    user_prompt: str,
    plan: Plan,
    results: list[dict],
    evaluation: Evaluation | None,
):
    system_prompt = build_synthesis_prompt(
        user_prompt=user_prompt,
        plan=plan,
        results=results,
        evaluation=evaluation,
    )

    return create_agent(
        model=llm,
        tools=list(config.tools),
        system_prompt=system_prompt,
        name="final_synthesizer",
    )