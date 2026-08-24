from __future__ import annotations

from typing import Any


def create_event(
    event_type: str,
    **data: Any,
) -> dict[str, Any]:
    return {
        "type": event_type,
        **data,
    }


def create_plan_event(
    plan,
) -> dict[str, Any]:
    return create_event(
        "plan",
        agents=[
            {
                "name": spec.name,
                "role": spec.role,
                "objective": spec.objective,
            }
            for spec in plan.subagents
        ],
    )


def create_subagent_result_event(
    result: dict,
) -> dict[str, Any]:
    return create_event(
        "subagent_result",
        agent=result["agent"],
        role=result["role"],
        status=result["status"],
        content=result.get("answer", ""),
    )


def create_evaluation_event(
    evaluation,
) -> dict[str, Any]:
    return create_event(
        "evaluation",
        passed=evaluation.passed,
        score=evaluation.score,
        strengths=evaluation.strengths,
        weaknesses=evaluation.weaknesses,
        missing_information=evaluation.missing_information,
    )