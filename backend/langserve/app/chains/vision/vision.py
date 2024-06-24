# https://github.com/langchain-ai/langserve/blob/main/examples/file_processing/server.py
import base64
from typing import List, Tuple

from langchain.pydantic_v1 import Field
from langchain_community.document_loaders.parsers.pdf import PDFMinerParser
from langchain_core.document_loaders import Blob
from langchain_core.runnables import RunnableLambda, RunnableSequence

from langchain_community.chat_models import ChatOpenAI
from langserve import CustomUserType

from ...util.message import img_message

# 注意：继承自CustomUserType而不是BaseModel，
# 否则服务器将解码为字典而不是pydantic模型。
class FileProcessingRequest(CustomUserType):
    """请求包括一个Base64编码的文件。"""

    # 额外字段用于指定操场UI的小部件。
    file: str = Field(..., extra={"widget": {"type": "base64file"}})
    text: str

class FileProcessReq2(CustomUserType):
    files: List[str] = Field(
        extra={"widget": {"type": "base64file"}})
    text: str
    
class FileProcessReq3(CustomUserType):
    file: str = Field( 
        None,
        extra={"widget": {"type": "base64file"}})
    files: List[str] = Field(
        extra={"widget": {"type": "base64file"}})
    chat_history: str = Field(
        None,
        examples=[[("a", "aa")]],
        extra={"widget": {"type": "chat", "input": "question", "output": "answer"}},
    )
    chat_history2: List[str] = Field(
        examples=[[("a", "aa")]],
        extra={"widget": {"type": "chat", "input": "question", "output": "answer"}},
    )
    text2: list[str]
    text: str = Field(None)

# from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

model = ChatOpenAI(temperature=0, 
                    model="gpt-4-turbo", 
                    max_tokens=1024)

chain = (
    {
        "base64_images": lambda x: [x.file],
        "text": lambda x: x.text
    }
    | RunnableLambda(lambda x: [img_message(**x)])
    | model
    | StrOutputParser()
).with_types(input_type=FileProcessingRequest)

chain2 = (
    {
        "base64_images": lambda x: x.files,
        "text": lambda x: x.text
    }
    | RunnableLambda(lambda x: [img_message(**x)])
    | model
    | StrOutputParser()
).with_types(input_type=FileProcessReq2)

chain3 = (
    {
        "base64_images": lambda x: x.files,
        "text": lambda x: x.text
    }
    | RunnableLambda(lambda x: [img_message(**x)])
    | model
    | StrOutputParser()
).with_types(input_type=FileProcessReq3)
