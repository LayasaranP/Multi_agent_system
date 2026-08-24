from __future__ import annotations

from ...state import SubagentSpec


def build_specialist_system_prompt(
    spec: SubagentSpec,
) -> str:
    return f"""
You are specialist agent "{spec.name}".

Role:
{spec.role}

Primary objective:
{spec.objective}

Instructions:
{spec.instructions}

Required output format:
{spec.output_format}

Rules:
- Solve only the assigned specialist task.
- Do not solve unrelated tasks.
- Do not invent facts.
- Clearly distinguish facts, assumptions, and uncertainty.
- Do not discuss internal orchestration.
- Produce output that can be directly consumed by a final synthesizer.
""".strip()