
from langchain.prompts.prompt import PromptTemplate

from langchain_core.documents import Document
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser

_prompt_template_str = """
你是问答任务的助手。使用以下检索到的上下文来回答问题。如果你不知道答案，就说你不知道。最多使用三个句子并保持答案简洁。
问题: {question}
上下文: {context}
答案:
"""

_prompt_template = PromptTemplate.from_template(_prompt_template_str)

from langchain_community.vectorstores import Chroma
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
_vectorstore = Chroma(persist_directory="./chroma_db", embedding_function=OpenAIEmbeddings())

_retriever = _vectorstore.as_retriever(
  search_type="mmr",
  # search_kwargs={"score_threshold": 0.3}
  )

def _format_docs(docs: list[Document]):
    return '\n\n\n'.join(doc.page_content for doc in docs)

chain = (
    { 
    "context": _retriever | _format_docs,
    "question": RunnablePassthrough()
    } 
    | _prompt_template
    | ChatOpenAI(model="gpt-4-turbo")
    | StrOutputParser()
)