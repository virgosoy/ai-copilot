

from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings

from langchain.prompts.prompt import PromptTemplate

prompt_template_str = """
你是问答任务的助手。使用以下检索到的上下文来回答问题。如果你不知道答案，就说你不知道。最多使用三个句子并保持答案简洁。
问题: {question}
上下文: {context}
答案:
"""
prompt_template = PromptTemplate.from_template(prompt_template_str)

from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
persist_directory="./chroma_db4"
vectorstore = Chroma(persist_directory=persist_directory, 
                     embedding_function=OpenAIEmbeddings())

# retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 4})
retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 10})
# retriever = vectorstore.as_retriever(search_type="similarity_score_threshold", search_kwargs={"k": 10, "score_threshold": 0.7})

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

from langchain_core.runnables import RunnablePassthrough
from langchain_openai.chat_models import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser

chain = (
    {"context": retriever | format_docs, "question": RunnablePassthrough()}
    | prompt_template
    | ChatOpenAI(model="gpt-4-turbo")
    | StrOutputParser()
)