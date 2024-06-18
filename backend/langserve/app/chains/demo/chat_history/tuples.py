# https://github.com/langchain-ai/langserve/blob/main/examples/widgets/chat/tuples/server.py

"""Endpoint shows off available playground widgets."""
import base64
from json import dumps
from typing import Any, Dict, List, Tuple

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from langchain.pydantic_v1 import BaseModel, Field
from langchain_community.document_loaders.parsers.pdf import PDFMinerParser
from langchain_core.document_loaders import Blob
from langchain_core.messages import (
    AIMessage,
    BaseMessage,
    FunctionMessage,
    HumanMessage,
)
from langchain_core.runnables import RunnableLambda, RunnableParallel
from langchain_openai import ChatOpenAI

from langserve import CustomUserType


# Example 1: Chat Widget
# This shows how to create a chat widget.


class ChatHistory(CustomUserType):
    chat_history: List[Tuple[str, str]] = Field(
        ...,
        examples=[[("a", "aa")]],
        extra={"widget": {"type": "chat", "input": "question", "output": "answer"}},
    )
    question: str


def _format_to_messages(input: ChatHistory) -> List[BaseMessage]:
    """Format the input to a list of messages."""
    history = input.chat_history
    user_input = input.question

    messages = []

    for human, ai in history:
        messages.append(HumanMessage(content=human))
        messages.append(AIMessage(content=ai))
    messages.append(HumanMessage(content=user_input))
    return messages


model = ChatOpenAI()
chat_model = RunnableParallel({"answer": (RunnableLambda(_format_to_messages) | model)})

chain1 = chat_model.with_types(input_type=ChatHistory)

# Example 2: Chat Widget with History
# This one isn't hooked up toa model. It just shows that FunctionMessages can be used
# surfaced as well in the playground.


class ChatHistoryMessage(BaseModel):
    chat_history: List[BaseMessage] = Field(
        ...,
        extra={"widget": {"type": "chat", "input": "location"}},
    )
    location: str


def chat_message_bot(input: Dict[str, Any]) -> List[BaseMessage]:
    """Bot that repeats the question twice.
    重复问题两次的机器人。
    """
    return [
        AIMessage(
            content="",
            additional_kwargs={
                "function_call": {
                    "name": "get_weather",
                    "arguments": dumps({"location": input["location"]}),
                }
            },
        ),
        FunctionMessage(name="get_weather", content='{"value": 32}'),
        AIMessage(content=f"Weather in {input['location']}: 32"),
    ]

chain2 = RunnableLambda(chat_message_bot).with_types(input_type=ChatHistoryMessage)

# Example 3: File Processing Widget


class FileProcessingRequest(BaseModel):
    file: bytes = Field(..., extra={"widget": {"type": "base64file"}})
    num_chars: int = 100


def process_file(input: Dict[str, Any]) -> str:
    """Extract the text from the first page of the PDF."""
    content = base64.decodebytes(input["file"])
    blob = Blob(data=content)
    documents = list(PDFMinerParser().lazy_parse(blob))
    content = documents[0].page_content
    return content[: input["num_chars"]]

chain3 = RunnableLambda(process_file).with_types(input_type=FileProcessingRequest)