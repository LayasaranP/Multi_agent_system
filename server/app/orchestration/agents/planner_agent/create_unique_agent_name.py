def create_unique_agent_name(
    *,
    original_name: str,
    index: int,
    seen_names: set[str],
) -> str:
    normalized = "".join(
        char.lower() if char.isalpha() else ""
        for char in original_name
    ).strip(" ")

    if not normalized:
        normalized = f"subagent_{index}"

    candidate = normalized
    suffix = 2

    while candidate in seen_names:
        candidate = f"{normalized}_{suffix}"
        suffix += 1

    seen_names.add(candidate)

    return candidate