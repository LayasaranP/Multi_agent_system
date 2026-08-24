from __future__ import annotations


def get_successful_results(
    results: list[dict],
) -> list[dict]:
    return [
        result
        for result in results
        if result.get("status") == "success"
    ]


def format_specialist_results(
    results: list[dict],
) -> str:
    if not results:
        return "No successful specialist output."

    return "\n\n".join(
        f"### Agent: {result['agent']}\n"
        f"Role: {result['role']}\n"
        f"Objective: {result['objective']}\n\n"
        f"{result['answer']}"
        for result in results
    )