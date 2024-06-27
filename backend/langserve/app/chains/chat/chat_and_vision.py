


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



from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
# Declare a chain
prompt = ChatPromptTemplate.from_messages(
    [
        ("system", "You are a helpful, professional assistant named Cob."),
        MessagesPlaceholder(variable_name="messages"),
    ]
)

from langchain.pydantic_v1 import BaseModel
class InputChat(BaseModel):
    """Input for the chat endpoint."""
    messages: list[HumanMessage | AIMessage | SystemMessage] = Field(
        ...,
        description="The chat messages representing the current conversation.",
    )
    
chain2 = (
    prompt
    | ChatOpenAI(model="gpt-4-turbo")
).with_types(
    input_type=InputChat
)

from langchain_core.output_parsers import StrOutputParser

chain3 = (
    prompt
    | ChatOpenAI(model="gpt-4-turbo")
    | StrOutputParser()
).with_types(
    input_type=InputChat
)

# chain2 = (
#     RunnableLambda(
#         lambda x: x
#     )
# ).with_types(
#     input_type=InputChat
# )