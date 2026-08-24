from __future__ import annotations

from langchain_core.messages import HumanMessage

from ...state import Evaluation
from .evaluator_prompts import build_evaluator_prompt
from .evaluator_results import format_specialist_results, get_successful_results


async def evaluate_results(
    *,
    llm,
    user_prompt: str,
    results: list[dict],
) -> Evaluation:
    successful_results = get_successful_results(results)

    evidence = format_specialist_results(
        successful_results
    )

    prompt = build_evaluator_prompt(
        user_prompt=user_prompt,
        evidence=evidence,
    )

    evaluator = llm.with_structured_output(Evaluation)

    return await evaluator.ainvoke(
        [HumanMessage(content=prompt)]
    )


def create_evaluator_feedback(
    evaluation: Evaluation,
) -> str:
    feedback = (
        evaluation.correction_instructions
        + evaluation.missing_information
    )

    return "\n".join(feedback)