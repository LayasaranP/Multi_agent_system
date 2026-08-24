from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from langchain.chat_models import init_chat_model

supported_providers = [
    "anthropic",
    "anthropic_bedrock",
    "azure_ai",
    "azure_openai",
    "baseten",
    "bedrock",
    "bedrock_converse",
    "cohere",
    "deepseek",
    "fireworks",
    "google_anthropic_vertex",
    "google_genai",
    "google_vertexai",
    "groq",
    "huggingface",
    "ibm",
    "langsmith",
    "litellm",
    "meta",
    "mistralai",
    "nvidia",
    "ollama",
    "openai",
    "openrouter",
    "perplexity",
    "together",
    "upstage",
    "xai",
]


@dataclass(frozen=True)
class AgentConfig:
    model: str
    model_provider: str
    api_key: str
    max_subagents: int = 6
    max_iterations: int = 2
    concurrency: int = 6
    tools: tuple[Any, ...] = ()

    def __post_init__(self) -> None:
        if not self.api_key:
            raise ValueError(f"Model api key should be given")
        if self.model_provider not in supported_providers:
            raise ValueError(f"model_provider must be one of {supported_providers}")
        if self.max_subagents < 1:
            raise ValueError("max_subagents must be greater than 1")

        if self.max_iterations < 1:
            raise ValueError("max_iterations must be greater than 1")

        if self.concurrency < 1:
            raise ValueError("concurrency must be greater than 1")


def create_agent_config(
    *,
    model: str,
    model_provider: str,
    api_key: str,
    max_subagents: int,
    max_iterations: int,
    concurrency: int,
    tools: list[Any] | None,
) -> AgentConfig:
    return AgentConfig(
        model=model,
        model_provider=model_provider,
        api_key=api_key,
        max_subagents=max_subagents,
        max_iterations=max_iterations,
        concurrency=concurrency,
        tools=tuple(tools or ()),
    )


def create_llm(config: AgentConfig):
    return init_chat_model(model=config.model, model_provider=config.model_provider, api_key=config.api_key)