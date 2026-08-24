from __future__ import annotations

from collections.abc import AsyncIterator

from .orchestrator_config import AgentConfig
from .graph import build_graph
from .state import GraphState
from .agents.synthesizer_agent.synthesizer_agent import create_final_agent
from .agents.synthesizer_agent.synthesizer_streaming import stream_final_response
from .utils import (
    create_evaluation_event,
    create_event,
    create_plan_event,
    create_subagent_result_event,
)


async def execute_workflow(
    *,
    user_prompt: str,
    llm,
    config: AgentConfig,
) -> AsyncIterator[dict]:
    graph = build_graph(
        llm=llm,
        config=config,
    )

    yield create_event(
        "planning",
        content="Planning dynamic specialist agents...",
    )

    state = await invoke_graph(
        graph=graph,
        user_prompt=user_prompt,
    )

    yield create_plan_event(
        state["plan"]
    )

    for result in state.get("results", []):
        yield create_subagent_result_event(result)

    evaluation = state.get("evaluation")

    if evaluation:
        yield create_evaluation_event(
            evaluation
        )

    final_agent = create_final_agent(
        llm=llm,
        config=config,
        user_prompt=user_prompt,
        plan=state["plan"],
        results=state.get("results", []),
        evaluation=evaluation,
    )

    yield create_event(
        "final_start"
    )

    async for event in stream_final_response(
        agent=final_agent,
        user_prompt=user_prompt,
    ):
        yield event


async def invoke_graph(
    *,
    graph,
    user_prompt: str,
) -> GraphState:
    initial_state: GraphState = {
        "user_prompt": user_prompt,
        "results": [],
        "iteration": 0,
        "feedback": "",
    }

    result = await graph.ainvoke(
        initial_state
    )

    return result