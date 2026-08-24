from __future__ import annotations


def build_evaluator_prompt(
    *,
    user_prompt: str,
    evidence: str,
) -> str:
    return f"""
You are a strict quality evaluator.

Original user request:
{user_prompt}

Specialist outputs:
{evidence}

Evaluate whether the available specialist outputs are sufficient
to produce a correct and useful final answer.

Evaluate:

- correctness
- completeness
- relevance
- consistency
- unsupported claims
- missing critical information
- unresolved contradictions
- whether another specialist pass is required

A score >= 0.85 should normally pass.

Return a structured evaluation.
""".strip()