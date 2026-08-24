from __future__ import annotations


def build_specialist_task(
    *,
    user_prompt: str,
    feedback: str,
) -> str:
    return f"""
Original user request:

{user_prompt}

Additional evaluator feedback from a previous iteration:

{feedback or "None"}

Complete your assigned specialist task based on the original request.
""".strip()