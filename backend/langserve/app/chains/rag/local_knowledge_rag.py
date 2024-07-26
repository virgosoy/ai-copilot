

from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings

from langchain_core.prompts import PromptTemplate, MessagesPlaceholder, ChatPromptTemplate

from ...util.message import img_message

prompt_template_str = """
你是问答任务的助手。使用以下检索到的上下文来回答问题。如果你不知道答案，就说你不知道。最多使用三个句子并保持答案简洁。
问题: {question}
上下文: {context}
答案:
"""
prompt_template = PromptTemplate.from_template(prompt_template_str)

from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
import os
persist_directory=os.getenv("LOCAL_RAG_KNOWLEDGE_CHROMA_DB_PATH")
vectorstore = Chroma(persist_directory=persist_directory, 
                     embedding_function=OpenAIEmbeddings())

retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 6})

from langchain_community.embeddings.ollama import OllamaEmbeddings
ollama_persist_directory=os.getenv("LOCAL_RAG_KNOWLEDGE_USE_OLLAMA_CHROMA_DB_PATH")
ollama_vectorstore = Chroma(persist_directory=ollama_persist_directory, 
                     embedding_function=OllamaEmbeddings(model="mxbai-embed-large", base_url=os.getenv("OLLAMA_BASE_URL")))
ollama_retriever = ollama_vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 4})


def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

from langchain_core.runnables import RunnablePassthrough
from langchain_openai.chat_models import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser

model = ChatOpenAI(model="gpt-4-turbo")

chain_text = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt_template
    | model
    | StrOutputParser()
)

from langchain_core.runnables import RunnableLambda

from langserve import CustomUserType
from langchain.pydantic_v1 import Field

class VisionReq(CustomUserType):
    files: list[str] 
        # = Field(
        # extra={"widget": {"type": "base64file"}})
    text: str
    
vision_prompt_template = ChatPromptTemplate.from_messages([
    ('system', '你是问答任务的助手。使用以下检索到的上下文来回答问题。如果你不知道答案，就说你不知道。最多使用三个句子并保持答案简洁。'),
    ('human', '上下文: {context}'),
    MessagesPlaceholder(variable_name="question")
])

question_prompt_template = ChatPromptTemplate.from_messages([
    ('system', '''我输入图片和问题，你把它转为一个纯文本的问题返回。'''),
    MessagesPlaceholder(variable_name="human")
])


from langchain_core.runnables import RunnableParallel

chain_test_2 = (
    RunnableParallel({
        "base64_images": lambda x: x.files,
        "text": lambda x: x.text
    })
    | RunnableLambda(lambda x: [img_message(**x)])
    | {"human": RunnablePassthrough() }
    | question_prompt_template
    | model
    | StrOutputParser()
).with_types(input_type=VisionReq)

chain_vision = (
    RunnableParallel({
        "base64_images": lambda x: x.files,
        "text": lambda x: x.text
    })
    | RunnableLambda(lambda x: [img_message(**x)])
    | {
        "context": { "human": RunnablePassthrough() }
            | question_prompt_template
            | model
            | StrOutputParser()
            | retriever
            | format_docs,
        "question": RunnablePassthrough()
    }
    | vision_prompt_template
    | model
    | StrOutputParser()
    
).with_types(input_type=VisionReq)

from langchain_core.messages import HumanMessage, AIMessage, SystemMessage, BaseMessage
from langchain.pydantic_v1 import BaseModel
class ChatAndVisionReq(CustomUserType):
    historyMessages: list[HumanMessage | AIMessage | SystemMessage] = Field(
        ...,
        description="The chat history messages representing the current conversation.",
    )
    currentMessage: HumanMessage = Field(
        ...,
        description="The current message.",
        extra={"widget": {"type": "chat"}},
    )
    
chat_and_vision_prompt_template = ChatPromptTemplate.from_messages([
    ('system', '你是问答任务的助手。使用以下检索到的上下文来回答问题。如果你不知道答案，就说你不知道。最多使用三个句子并保持答案简洁。'),
    ('human', '上下文: {context}'),
    MessagesPlaceholder(variable_name="history"),
    MessagesPlaceholder(variable_name="question")
])
from operator import itemgetter
chain_chat_and_vision = (
    RunnableParallel({
        "context": { "human": lambda x: [x.currentMessage] }
            | question_prompt_template
            | model
            | StrOutputParser()
            | retriever
            | format_docs,
        "history": lambda x: x.historyMessages,
        "question": lambda x: [x.currentMessage],
    })
    | chat_and_vision_prompt_template
    | model
    | StrOutputParser()
).with_types(input_type=ChatAndVisionReq)


class ChatReq(CustomUserType):
    messages: list[HumanMessage | AIMessage | SystemMessage] = Field(
        ...,
        description="The chat messages representing the current conversation.",
    )


prompt_text_chat = ChatPromptTemplate.from_messages([
    ('system', '你是问答任务的助手。使用以下检索到的上下文来回答问题。如果你不知道答案，就说你不知道。最多使用三个句子并保持答案简洁。'),
    ('system', '上下文: {context}'),
    MessagesPlaceholder(variable_name="messages"),
])

from ...util.message import get_message_string_content

from ...util.model import biz_configurable_model

chain_text_chat = (
    {
        "context": 
            (lambda x: get_message_string_content(x.messages[-1])) 
            | retriever 
            | format_docs, 
        "messages": lambda x: x.messages
    }
    | prompt_text_chat
    | biz_configurable_model()
    | StrOutputParser()
).with_types(input_type=ChatReq)

chain_local_text_chat = (
    {
        "context": 
            (lambda x: get_message_string_content(x.messages[-1])) 
            | ollama_retriever 
            | format_docs, 
        "messages": lambda x: x.messages
    }
    | prompt_text_chat
    | biz_configurable_model()
    | StrOutputParser()
).with_types(input_type=ChatReq)


# chain_chat_and_vision = (
#     RunnableLambda(
#         lambda x: x
#     )
# ).with_types(input_type=ChatAndVisionReq)

