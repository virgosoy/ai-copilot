

import os
from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings.openai import OpenAIEmbeddings

def init():
    load_local_knowledge_uni()
    
def load_local_knowledge_use_openai():
    local_rag_knowledge_path = os.getenv("LOCAL_RAG_KNOWLEDGE_PATH")
    loader = PyPDFDirectoryLoader(local_rag_knowledge_path,
                                  extract_images=True)
    docs = loader.load()
    
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=200)
    splits = splitter.split_documents(docs)
    
    persist_directory = os.getenv("LOCAL_RAG_KNOWLEDGE_CHROMA_DB_PATH")
    Chroma.from_documents(
        documents=splits, 
        embedding=OpenAIEmbeddings(), 
        persist_directory=persist_directory)

from langchain_community.embeddings.ollama import OllamaEmbeddings

def load_local_knowledge_use_ollama():
    local_rag_knowledge_path = os.getenv("LOCAL_RAG_KNOWLEDGE_PATH")
    loader = PyPDFDirectoryLoader(local_rag_knowledge_path,
                                  extract_images=True)
    docs = loader.load()
    
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=200)
    splits = splitter.split_documents(docs)
    
    persist_directory = os.getenv("LOCAL_RAG_KNOWLEDGE_USE_OLLAMA_CHROMA_DB_PATH")
    Chroma.from_documents(
        documents=splits, 
        embedding=OllamaEmbeddings(model="mxbai-embed-large", base_url=os.getenv("OLLAMA_BASE_URL")), 
        persist_directory=persist_directory)

def load_local_knowledge_uni():
    _load_local_knowledge_uni('ebs', 'ebs')

def _load_local_knowledge_uni(relative_folder_path: str, collection_name: str):
    """
        :param:relative_folder_path: 环境变量 LOCAL_RAG_KNOWLEDGE_PATH 下的文件夹名称
        :param:collection_name: Chroma 集合名
    """
    local_rag_knowledge_path = os.path.join(os.getenv("LOCAL_RAG_KNOWLEDGE_PATH"), relative_folder_path)
    loader = PyPDFDirectoryLoader(local_rag_knowledge_path,
                                  extract_images=True)
    docs = loader.load()
    
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=200)
    splits = splitter.split_documents(docs)
    
    persist_directory = os.getenv("LOCAL_RAG_KNOWLEDGE_UNI_CHROMA_DB_PATH")
    Chroma.from_documents(
        documents=splits, 
        collection_name=collection_name,
        embedding=OllamaEmbeddings(model="mxbai-embed-large", base_url=os.getenv("OLLAMA_BASE_URL")), 
        persist_directory=persist_directory)

if __name__ == "__main__":
    # 运行这个的时候 pwd 要在 /backend/langserve
    # 然后 vscode 右上角 Run Python File 即可。
    import dotenv
    dotenv.load_dotenv('../../.env')
    init()