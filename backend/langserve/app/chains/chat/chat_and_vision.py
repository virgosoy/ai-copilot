


from langchain.pydantic_v1 import Field
from langchain_openai import ChatOpenAI
from langserve import CustomUserType
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage, BaseMessage
from langchain_core.runnables import RunnableParallel, RunnableLambda


class ChatHistory(CustomUserType):
    chat_history: list[HumanMessage | AIMessage | SystemMessage] = Field(
        # ...,
        # examples=[[("a", "aa")]],
        extra={"widget": {"type": "chat", "input": "question", "output": "answer"}},
    )
    question: str


def _format_to_messages(input: ChatHistory) -> list[BaseMessage]:
    """Format the input to a list of messages."""
    history = input.chat_history
    user_input = input.question

    messages = []

    for msg in history:
        messages.append(msg)
    messages.append(HumanMessage(content=user_input))
    return messages


model = ChatOpenAI()
chat_model = RunnableParallel({"answer": (RunnableLambda(_format_to_messages) | model)})

chain1 = chat_model.with_types(input_type=ChatHistory)
