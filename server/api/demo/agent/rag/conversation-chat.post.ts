// import { RunnableSequence } from 'langchain/runnables'
import { vectorStore } from "~/server/utils/demo-rag-common"
import { PromptTemplate, ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts'
import { createRetrieverTool } from 'langchain/tools/retriever'
import { AgentExecutor, createOpenAIFunctionsAgent, initializeAgentExecutorWithOptions } from 'langchain/agents'
import { ChatOpenAI } from '@langchain/openai'
import { RunnablePassthrough, RunnableSequence } from '@langchain/core/runnables'
import { formatDocumentsAsString } from 'langchain/util/document'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { ScoreThresholdRetriever } from "langchain/retrievers/score_threshold"
import { AIMessage, BaseMessage, HumanMessage, coerceMessageLikeToMessage } from "langchain/schema"
import { Calculator } from "langchain/tools/calculator"
import { WebBrowser } from "langchain/tools/webbrowser";
import { createBaiduWebSearchTool, createPuppeteerWebTool } from "~/server/utils/langchain-tools"

export default defineEventHandler(async (event) => {
  // 请求体
  const body = await readBody<{ input: string, chatHistory:[string, string][]}>(event)
  
  const model = new DefaultChatOpenAI({ modelName: 'gpt-4-turbo-preview', temperature: 0, verbose: true })
  const embeddings = new DefaultOpenAIEmbeddings()
  
  // const retriever = vectorStore.asRetriever({ k: 3, searchType: 'similarity', verbose: true })
  const retriever = ScoreThresholdRetriever.fromVectorStore(
    vectorStore, {
      minSimilarityScore: 0.8,
      maxK: 100,
      kIncrement: 2,
      verbose: true,
    }
  )

  const knowledgeTool = createRetrieverTool(retriever, { 
    name: 'search', 
    // description: 'Search for information in the personal knowledge base. For any information in the personal knowledge base, you must use this tool!'
    description: '在知识库中搜索信息。对于知识库中的任何信息，您必须使用这个工具！',
    verbose: true,
  })

  const webBrowserTool = new WebBrowser({ model, embeddings });

  const baiduWebSearchTool = createBaiduWebSearchTool({ model, embeddings })

  const tools = [
    knowledgeTool, 
    new Calculator(), 
    webBrowserTool, 
    baiduWebSearchTool,
    createPuppeteerWebTool(),
  ]

  const agentPrompt = ChatPromptTemplate.fromMessages([
    // ['system', 'You are a helpful assistant'],
    ['system', '你是一个乐于助人的助手，用户所有的提问都先在知识库中搜索一遍，如果没找到请回答“知识库中找不到相关信息”'],
    new MessagesPlaceholder('chat_history'),
    ['human', '{input}'],
    new MessagesPlaceholder('agent_scratchpad'),
  ])

  const agent = await createOpenAIFunctionsAgent({
    llm: model,
    prompt: agentPrompt,
    tools,
  })

  const agentExecutor = new AgentExecutor({
    agent,
    tools,
    verbose: true,
  })

  const result = await agentExecutor.invoke({ 
    input: body.input, 
    chat_history: body.chatHistory.map(chatMessage => coerceMessageLikeToMessage(chatMessage))
  })

  return {
    output: result.output
  }
})

