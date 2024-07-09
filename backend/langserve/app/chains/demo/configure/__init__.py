
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import ConfigurableField
from langchain_openai import ChatOpenAI

model = ChatOpenAI(temperature=0).configurable_fields(
    temperature=ConfigurableField(
        id="llm_temperature",
        name="LLM Temperature",
        description="The temperature of the LLM",
    )
)

model.invoke("pick a random number")

chain = model

# -----------------------------------------------

from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import ConfigurableField
from langchain_openai import ChatOpenAI

llm = ChatAnthropic(
    model="claude-3-haiku-20240307", temperature=0
).configurable_alternatives(
    # 这为该字段赋予了一个ID
    # 在配置结束可运行时，我们可以使用此ID来配置该字段
    ConfigurableField(id="llm"),
    # 这将设置一个默认密钥。
    # 如果我们指定此密钥，则将使用上面初始化的默认LLM（ChatAnthropic）。
    default_key="anthropic",
    # 这添加了一个新选项，名称为`openai`，等于`ChatOpenAI()`。
    openai=ChatOpenAI(),
    # 这将添加一个新选项，名称为`gpt4`，等同于`ChatOpenAI(model="gpt-4")`。
    gpt4=ChatOpenAI(model="gpt-4"),
    # 您可以在这里添加更多配置选项
)
prompt = PromptTemplate.from_template("Tell me a joke about {topic}")
chain1 = prompt | llm


# 默认情况下，它将调用Anthropic。
# chain.invoke({"topic": "bears"})

# 我们可以使用`.with_config(configurable={"llm": "openai"})`来指定要使用的llm
# chain.with_config(configurable={"llm": "openai"}).invoke({"topic": "bears"})

# 如果我们使用`default_key`，那么它将使用默认值。
# chain.with_config(configurable={"llm": "anthropic"}).invoke({"topic": "bears"})



prompt = PromptTemplate.from_template(
    "Tell me a joke about {topic}"
).configurable_alternatives(
    # 这为该字段赋予了一个ID
    # 在配置结束可运行时，我们可以使用此ID来配置该字段
    ConfigurableField(id="prompt"),
    # 这将设置一个默认键。
    # 如果我们指定了这个键，将使用上面初始化的默认LLM（ChatAnthropic）。
    default_key="joke",
    # 这添加了一个名为`poem`的新选项
    poem=PromptTemplate.from_template("Write a short poem about {topic}"),
    # 您可以在这里添加更多配置选项
)

chain2 = prompt | llm

# 我们可以配置它用OpenAI写一首诗。
# chain.with_config(configurable={"prompt": "poem", "llm": "openai"}).invoke(
#     {"topic": "bears"}
# )

# 如果我们想要的话，我们总是可以只配置一个。
# chain.with_config(configurable={"llm": "openai"}).invoke({"topic": "bears"})