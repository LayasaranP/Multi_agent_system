from __future__ import annotations

from langgraph.graph import END, START, StateGraph

from .orchestrator_config import AgentConfig
from .agents.evaluator_agent.evaluator import evaluate_results
from .agents.evaluator_agent.evaluatory_retry import should_retry
from .agents.planner_agent.planner import create_execution_plan
from .state import GraphState
from .agents.sub_agents.specialists import execute_specialists


def build_graph(
    *,
    llm,
    config: AgentConfig,
):
    builder = StateGraph(GraphState)

    builder.add_node(
        "planner",
        create_planner_node(
            llm=llm,
            config=config,
        ),
    )

    builder.add_node(
        "specialists",
        create_specialists_node(
            llm=llm,
            config=config,
        ),
    )

    builder.add_node(
        "evaluator",
        create_evaluator_node(
            llm=llm,
        ),
    )

    builder.add_edge(
        START,
        "planner",
    )

    builder.add_edge(
        "planner",
        "specialists",
    )

    builder.add_edge(
        "specialists",
        "evaluator",
    )

    builder.add_conditional_edges(
        "evaluator",
        create_retry_router(config),
        {
            "retry": "planner",
            "finish": END,
        },
    )

    return builder.compile()


def create_planner_node(
    *,
    llm,
    config: AgentConfig,
):
    async def planner_node(
        state: GraphState,
    ) -> dict:
        plan = await create_execution_plan(
            llm=llm,
            config=config,
            user_prompt=state["user_prompt"],
            feedback=state.get("feedback", ""),
        )

        return {
            "plan": plan,
            "iteration": state.get("iteration", 0) + 1,
            "results": [],
        }

    return planner_node


def create_specialists_node(
    *,
    llm,
    config: AgentConfig,
):
    async def specialists_node(
        state: GraphState,
    ) -> dict:
        results = await execute_specialists(
            specs=state["plan"].subagents,
            user_prompt=state["user_prompt"],
            feedback=state.get("feedback", ""),
            llm=llm,
            config=config,
        )

        return {
            "results": results,
        }

    return specialists_node


def create_evaluator_node(
    *,
    llm,
):
    async def evaluator_node(
        state: GraphState,
    ) -> dict:
        evaluation = await evaluate_results(
            llm=llm,
            user_prompt=state["user_prompt"],
            results=state.get("results", []),
        )

        feedback = create_feedback(evaluation)

        return {
            "evaluation": evaluation,
            "feedback": feedback,
        }

    return evaluator_node


def create_feedback(evaluation) -> str:
    return "\n".join(
        evaluation.correction_instructions
        + evaluation.missing_information
    )


def create_retry_router(config: AgentConfig):
    def router(
        state: GraphState,
    ) -> str:
        retry = should_retry(
            evaluation=state.get("evaluation"),
            iteration=state.get("iteration", 0),
            config=config,
        )

        return "retry" if retry else "finish"

    return router