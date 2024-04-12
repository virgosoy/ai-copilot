import { AutoGPT } from "langchain/experimental/autogpt";
import { ReadFileTool, WriteFileTool } from "langchain/tools";
import { InMemoryFileStore } from "langchain/stores/file/in_memory";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { SerpAPI } from "@langchain/community/tools/serpapi";
import { WebBrowser } from "langchain/tools/webbrowser";

export default defineEventHandler(async (event) => {
  // 请求体
  const body = await readBody<any>(event)
  
  
  const model = new DefaultChatOpenAI({ modelName: 'gpt-4-turbo-preview', temperature: 0, verbose: true })
  const embeddings = new DefaultOpenAIEmbeddings()
  const webBrowserTool = new WebBrowser({ model, embeddings });
  
  const store = new InMemoryFileStore();

  const tools = [
    new ReadFileTool({ store }),
    new WriteFileTool({ store }),
    webBrowserTool,
    // new SerpAPI(process.env.SERPAPI_API_KEY, {
    //   location: "San Francisco,California,United States",
    //   hl: "en",
    //   gl: "us",
    // }),
  ];

  const vectorStore = new MemoryVectorStore(new OpenAIEmbeddings());

  const autogpt = AutoGPT.fromLLMAndTools(
    model,
    tools,
    {
      memory: vectorStore.asRetriever(),
      aiName: "Tom",
      aiRole: "Assistant",
    },
  );

  const result = await autogpt.run([body.input]);

  return {
    output: result
  }
})