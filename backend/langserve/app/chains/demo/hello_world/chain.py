
from langchain_openai import ChatOpenAI

from langchain.prompts import ChatPromptTemplate

_model = ChatOpenAI()

_prompt = ChatPromptTemplate.from_messages([
  ("system", "You are a helpful assistant."),
  ("human", "{input}"),
])

chain = _prompt | _model