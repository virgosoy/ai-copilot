

from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
def init():
    import bs4

    from langchain_community.document_loaders import WebBaseLoader
    loader = WebBaseLoader(
        web_path="https://www.gov.cn/jrzg/2013-10/25/content_2515601.htm",
        bs_kwargs={
        "parse_only": bs4.SoupStrainer(
            class_ = "p1"
        )
      }
    )
    docs = loader.load()

    from langchain.text_splitter import RecursiveCharacterTextSplitter
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )
    splits = text_splitter.split_documents(docs)


    Chroma.from_documents(
        documents=splits,
        embedding=OpenAIEmbeddings(),
        persist_directory='./chroma_db3'
    )
    

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
vectorstore = Chroma(persist_directory="./chroma_db3", embedding_function=OpenAIEmbeddings())

retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 4})

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

if __name__ == "__main__":
    import dotenv
    dotenv.load_dotenv('../../.env')
    init()