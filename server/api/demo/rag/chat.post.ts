// import { RunnableSequence } from 'langchain/runnables'
import { vectorStore } from "~/server/utils/demo-rag-common"
import { PromptTemplate, ChatPromptTemplate, MessagesPlaceholder } from '@langchain/core/prompts'
import { createRetrieverTool } from 'langchain/tools/retriever'
import { AgentExecutor, createOpenAIFunctionsAgent } from 'langchain/agents'
import { ChatOpenAI } from '@langchain/openai'
import { RunnablePassthrough, RunnableSequence } from '@langchain/core/runnables'
import { formatDocumentsAsString } from 'langchain/util/document'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { ScoreThresholdRetriever } from "langchain/retrievers/score_threshold"

export default defineEventHandler(async (event) => {
  // 请求体
  const body = await readBody<{ input: string}>(event)
  
  // const retriever = vectorStore.asRetriever({ k: 3, searchType: 'similarity', verbose: true })
  const retriever = ScoreThresholdRetriever.fromVectorStore(
    vectorStore, {
      minSimilarityScore: 0.8,
      maxK: 100,
      kIncrement: 2,
      verbose: true,
    }
  )

  const prompt = PromptTemplate.fromTemplate(`Answer the following question based only on the provided context:

<context>
{context}
</context>

Question: {question}`);


  const chain = RunnableSequence.from([
    {
      context: retriever.pipe(log('retriever')).pipe(formatDocumentsAsString),
      question: new RunnablePassthrough<string>(),
    },
    prompt,
    new DefaultChatOpenAI({modelName: 'gpt-4-turbo-preview', temperature: 0, verbose: true }),
    new StringOutputParser(),
  ])

  const result = await chain.invoke(body.input)

  // const agentPrompt = ChatPromptTemplate.fromMessages([
  //   ['system', 'You are a helpful assistant'],
  //   new MessagesPlaceholder({
  //     variableName: 'chat_history',
  //     optional: true,
  //   }),
  //   ['human', '{input}'],
  //   new MessagesPlaceholder('agent_scratchpad')
  // ])

  // const retrieverTool = createRetrieverTool(retriever, {
  //   name: 'RAG_search',
  //   description: 'Useful for when you need to answer questions about the context.',
  // })

  // const tools = [retrieverTool]
  
  // const agent = await createOpenAIFunctionsAgent({
  //   llm: new ChatOpenAI(),
  //   prompt: agentPrompt,
  //   tools,
  // })

  // const agentExecutor = AgentExecutor.fromAgentAndTools({
  //   agent,
  //   tools,
  // })

  // const result = await agentExecutor.invoke({
  //   input: body.input,
  // })

  return {
    output: result
  }
})

function log<T>(tag?: string){
  return (v: T) => {
    console.log(`[${tag ?? 'log'}]`, v)
    return v
  }
}