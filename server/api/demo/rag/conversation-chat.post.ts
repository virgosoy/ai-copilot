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
import { AIMessage, BaseMessage, HumanMessage, coerceMessageLikeToMessage } from "langchain/schema"

export default defineEventHandler(async (event) => {
  // 请求体
  const body = await readBody<{ input: string, chatHistory:[string, string][]}>(event)
  
  // const retriever = vectorStore.asRetriever({ k: 3, searchType: 'similarity', verbose: true })
  const retriever = ScoreThresholdRetriever.fromVectorStore(
    vectorStore, {
      minSimilarityScore: 0.8,
      maxK: 100,
      kIncrement: 2,
      verbose: true,
    }
  )

  const condenseQuestionPrompt = ChatPromptTemplate.fromMessages([
    new MessagesPlaceholder('chat_history'),
    ['user', '{input}'],
    // ['system', 'Given the above conversation, generate a search query to look up in order to get information relevant to the conversation.'],
    // ['user', 'Given the above conversation, generate a search query to look up in order to get information relevant to the conversation. \nThe language of the search query should be consistent with the conversation.'],
    ['user', '根据以上对话，以我的口吻总结一个完整的问题。不要加其他修饰。'],
  ])
  
  
  const answerPrompt = ChatPromptTemplate.fromMessages<{context: string, input: string}>([
    ['system', `Answer the question based only on the following context. Do not answer irrelevant content, if you cannot find the context, then answer "I don't know".

Context:
{context}`],
    ['user', '{input}'],
  ])

  const model = new DefaultChatOpenAI({modelName: 'gpt-4-0125-preview', temperature: 0, verbose: true })
  const condenseQuestionChain = RunnableSequence.from<{input: string, chatHistory: any[]}, string>([
    {
      input: o => o.input,
      chat_history: o => o.chatHistory,
    },
    condenseQuestionPrompt,
    model,
    new StringOutputParser(),
  ])

  const chain = RunnableSequence.from([
    {
      context: o => retriever.pipe(log('retriever')).pipe(formatDocumentsAsString).invoke(o.input),
      input: condenseQuestionChain,
    },
    answerPrompt,
    model,
    new StringOutputParser(),
  ])

  const result = await chain.invoke({
    input: body.input,
    chatHistory: body.chatHistory.map(messageLike => coerceMessageLikeToMessage(messageLike)),
  })

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