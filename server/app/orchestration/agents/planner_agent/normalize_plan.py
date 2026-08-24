from ...state import Plan, SubagentSpec
from .create_unique_agent_name import create_unique_agent_name

def normalize_plan(
    *,
    plan: Plan,
    max_subagents: int,
) -> Plan:
    specs = plan.subagents[:max_subagents]

    normalized_specs: list[SubagentSpec] = []
    seen_names: set[str] = set()

    for index, spec in enumerate(specs, start=1):
        name = create_unique_agent_name(
            original_name=spec.name,
            index=index,
            seen_names=seen_names,
        )

        normalized_specs.append(
            spec.model_copy(
                update={"name": name}
            )
        )

    plan.subagents = normalized_specs

    return plan