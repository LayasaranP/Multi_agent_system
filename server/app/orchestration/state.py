from __future__ import annotations

import operator
from typing import Annotated, TypedDict

from pydantic import BaseModel, Field


class SubagentSpec(BaseModel):
    name: str = Field(
        description="Short unique identifier for the specialist."
    )
    role: str = Field(
        description="The specialist's role."
    )
    objective: str = Field(
        description="The exact problem this specialist must solve."
    )
    instructions: str = Field(
        description="Detailed instructions for this specialist."
    )
    output_format: str = Field(
        default="Concise factual analysis with evidence and caveats."
    )


class Plan(BaseModel):
    subagents: list[SubagentSpec] = Field(
        min_length=1,
        description="Specialist agents needed to solve the request.",
    )
    synthesis_strategy: str = Field(
        description="How specialist outputs should be combined."
    )


class Evaluation(BaseModel):
    passed: bool
    score: float = Field(ge=0.0, le=1.0)
    strengths: list[str] = Field(default_factory=list)
    weaknesses: list[str] = Field(default_factory=list)
    missing_information: list[str] = Field(default_factory=list)
    correction_instructions: list[str] = Field(default_factory=list)


class GraphState(TypedDict, total=False):
    user_prompt: str
    plan: Plan
    results: Annotated[list[dict], operator.add]
    evaluation: Evaluation
    feedback: str
    iteration: int