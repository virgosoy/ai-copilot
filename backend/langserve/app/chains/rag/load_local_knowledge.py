

import os
from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings.openai import OpenAIEmbeddings

def init():
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



if __name__ == "__main__":
    import dotenv
    dotenv.load_dotenv('../../.env')
    init()