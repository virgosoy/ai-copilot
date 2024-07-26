from fastapi import FastAPI, File, UploadFile
from fastapi.responses import RedirectResponse
from langserve import add_routes

# 环境变量测试
import os
openai_api_base = os.environ["OPENAI_API_BASE"]
print(f'{openai_api_base=}')

app = FastAPI()


@app.get("/")
async def redirect_root_to_docs():
    return RedirectResponse("/docs")


# Edit this to add the chain you want to add
# add_routes(app, NotImplemented)

# region 模板路由

# 模块加载 Chroma 太久，故注释
# from rag_chroma_multi_modal import chain as rag_chroma_multi_modal_chain
# add_routes(app, rag_chroma_multi_modal_chain, path="/rag-chroma-multi-modal")

# from chain_of_note_wiki import chain as chain_of_note_wiki_chain
# add_routes(app, chain_of_note_wiki_chain, path="/chain-of-note-wiki")

# endregion

# region 添加路由
# from .chains.demo.hello_world.chain import chain
# add_routes(app, chain, path="/hello-world")

# from .chains.demo.rag.word import chain
# add_routes(app, chain, path="/word")

# from .chains.demo.rag import chain
# add_routes(app, chain, path="/rag")

# from .chains.demo.rag.xiaofeizhequanyi_demo import chain
# add_routes(app, chain, path="/xiaofeizhequanyi")

# from .chains.demo.rag.pdf import chain
# add_routes(app, chain, path="/pdf")

# from .chains.demo.rag.pdf_and_spacy import chain
# add_routes(app, chain, path="/pdf-and-spacy")

# from .chains.demo.rag.pdf_and_spacy_multi_query import chain
# add_routes(app, chain, path="/pdf-and-spacy-multi-query")

# from .chains.demo.load_document.file_processing import chain
# add_routes(
#     app,
#     chain,
#     config_keys=["configurable"],
#     path="/pdf-file-processing",
# )

# from .chains.demo.chat_history.tuples import chain1, chain2, chain3
# add_routes(
#     app,
#     chain1,
#     config_keys=["configurable"],
#     path="/chat-history-tuples-1"
# )
# add_routes(
#     app,
#     chain2,
#     config_keys=["configurable"],
#     path="/chat-history-tuples-2"
# )
# add_routes(
#     app,
#     chain3,
#     config_keys=["configurable"],
#     path="/chat-history-tuples-3"
# )

# from .chains.vision.vision import chain,chain2,chain3
# add_routes(app, chain, path="/vision")
# add_routes(app, chain2, path="/vision-2")
# add_routes(app, chain3, path="/vision-3")

# from .chains.demo.hello_world.chat_playground import chain
# add_routes(
#     app,
#     chain,
#     path="/chat-playground",
#     enable_feedback_endpoint=True,
#     enable_public_trace_link_endpoint=True,
#     playground_type="chat",
# )

from .chains.chat.chat_and_vision import chain1, chain2, chain3, chain4, chain5
add_routes(app, chain1, path="/chat-and-vision-1")
add_routes(app, chain2, path="/chat-and-vision-2")
add_routes(app, chain3, path="/chat-and-vision-3")
add_routes(app, chain4, path="/chat-and-vision-config-model")
add_routes(app, chain5, path="/chat-and-vision-config-model-2")

from .chains.rag.local_knowledge_rag import chain_text, chain_test_2, chain_vision, chain_chat_and_vision, \
    chain_text_chat, chain_local_text_chat
add_routes(app, chain_text, path="/local-knowledge-rag-text")
add_routes(app, chain_test_2, path="/local-knowledge-rag-test-2")
add_routes(app, chain_vision, path="/local-knowledge-rag-vision")
add_routes(app, chain_chat_and_vision, path="/local-knowledge-rag-chat-and-vision")
add_routes(app, chain_text_chat, path="/local-knowledge-rag-text-chat")
add_routes(app, chain_local_text_chat, path="/local-knowledge-rag-local-text-chat")

# from .chains.demo.configure import chain, chain1, chain2
# add_routes(app, chain, path="/configure")
# add_routes(app, chain1, path="/configure1")
# add_routes(app, chain2, path="/configure2")

# endregion

# region 纯路由
# from .chains.demo.load_document import save_files

# @app.post('/upload-files')
# async def upload_files(files: list[UploadFile]):
#     result = await save_files(files)
#     return result

# from .chains.demo.load_document import load_local_pdf_and_spacy
# @app.get('/load-local-file')
# async def load_local_file():
#     await load_local_pdf_and_spacy()
#     return "success"

# endregion

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
