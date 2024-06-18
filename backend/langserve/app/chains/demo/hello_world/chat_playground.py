from typing import List, Union
from langchain.pydantic_v1 import BaseModel, Field
from langchain_core.prompts import ChatPromptTemplate,MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
# from langchain_community.chat_models import ChatAnthropic
from langchain_community.chat_models import ChatOpenAI

# Declare a chain
prompt = ChatPromptTemplate.from_messages(
    [
        ("system", "You are a helpful, professional assistant named Cob."),
        MessagesPlaceholder(variable_name="messages"),
    ]
)



class InputChat(BaseModel):
    """Input for the chat endpoint."""

    messages: List[Union[HumanMessage, AIMessage, SystemMessage]] = Field(
        ...,
        description="The chat messages representing the current conversation.",
    )


chain = (
    prompt
    | ChatOpenAI(model="gpt-4-turbo")
    # ChatAnthropic(model="claude-3-sonnet-20240229")
    # ChatAnthropic(model="claude-2")
).with_types(
    input_type=InputChat
)