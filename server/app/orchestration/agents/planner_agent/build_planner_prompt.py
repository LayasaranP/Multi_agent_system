def build_planner_prompt(
    *,
    user_prompt: str,
    feedback: str,
    max_subagents: int,
) -> str:
    return f"""
You are the lead planner for a dynamic multi-agent system.

User request:
{user_prompt}

Previous evaluator feedback:
{feedback or "None"}

Your responsibilities:

1. Decompose the request into independent specialist tasks.
2. Create specialists only when they provide distinct value.
3. Avoid duplicate responsibilities.
4. Prefer tasks that can run independently and in parallel.
5. Make every specialist responsible for one clearly defined objective.
6. Define a strategy for synthesizing the specialist outputs.

Maximum number of specialists:
{max_subagents}

Return a structured execution plan.
""".strip()