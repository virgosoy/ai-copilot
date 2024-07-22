
from langchain_community.chat_models import ChatOpenAI, ChatAnthropic, ChatOllama
from langchain_core.runnables import ConfigurableField
import os

def biz_configurable_model():
    """
    可配置模型。
    前端可以使用 BizConfigModelSelect 组件进行简单设置。
    
    Example:
        .. code-block:: python

            model = confgurable_model()
            chain = prompt | model | StrOutputParser()
    """
    return (ChatOpenAI(model="gpt-4-turbo")
        .configurable_fields(
            model_name=ConfigurableField(
                id="openai_model",
                name="Openai Model",
                description="The model to use for the chat.",
            )
        )
        .configurable_alternatives(
            ConfigurableField(id="model_provider"),
            default_key="openai",
            anthropic=ChatAnthropic(model="claude-3-haiku-20240307")
                .configurable_fields(
                    model=ConfigurableField(
                        id="anthropic_model",
                        name="Anthropic Model",
                        description="The model to use for the chat.",
                    )
                ),
            ollama=ChatOllama(model="qwen2", base_url=os.getenv("OLLAMA_BASE_URL"))
                .configurable_fields(
                    model=ConfigurableField(
                        id="ollama_model",
                        name="Ollama Model",
                        description="The model to use for the chat.",
                    )
                ),
        )
    )