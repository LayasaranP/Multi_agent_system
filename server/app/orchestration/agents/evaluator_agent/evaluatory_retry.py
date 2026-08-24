from __future__ import annotations

from ...orchestrator_config import AgentConfig
from ...state import Evaluation


def should_retry(
    *,
    evaluation: Evaluation | None,
    iteration: int,
    config: AgentConfig,
) -> bool:
    if evaluation is None:
        return True

    if evaluation.passed:
        return False

    if iteration >= config.max_iterations:
        return False

    return True