from fastapi import FastAPI
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

# region 添加路由
from .chains.hello_world.chain import chain
add_routes(app, chain, path="/hello-world")

# endregion

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
