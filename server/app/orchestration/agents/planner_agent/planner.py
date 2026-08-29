from __future__ import annotations

from langchain_core.messages import HumanMessage
from langsmith import traceable

from .build_planner_prompt import build_planner_prompt
from .normalize_plan import normalize_plan

from ...orchestrator_config import AgentConfig
from ...state import Plan

async def create_execution_plan(
    *,
    llm,
    config: AgentConfig,
    user_prompt: str,
    feedback: str = "",
) -> Plan:
    prompt = build_planner_prompt(
        user_prompt=user_prompt,
        feedback=feedback,
        max_subagents=config.max_subagents,
    )

    planner = llm.with_structured_output(Plan)

    plan = await planner.ainvoke(
        [HumanMessage(content=prompt)]
    )

    return normalize_plan(
        plan=plan,
        max_subagents=config.max_subagents,
    )





