from __future__ import annotations

from ...state import SubagentSpec


def create_success_result(
    *,
    spec: SubagentSpec,
    content: str,
) -> dict:
    return {
        "agent": spec.name,
        "role": spec.role,
        "objective": spec.objective,
        "answer": content,
        "status": "success",
    }


def create_failure_result(
    *,
    spec: SubagentSpec,
    error: Exception,
) -> dict:
    return {
        "agent": spec.name,
        "role": spec.role,
        "objective": spec.objective,
        "answer": "",
        "status": "error",
        "error": str(error),
    }