from __future__ import annotations


def format_all_results(
    results: list[dict],
) -> str:
    if not results:
        return "No specialist output available."

    return "\n\n".join(
        (
            f"### Specialist: {result['agent']}\n"
            f"Role: {result['role']}\n"
            f"Objective: {result['objective']}\n"
            f"Status: {result['status']}\n\n"
            f"{result.get('answer', '')}"
        )
        for result in results
    )