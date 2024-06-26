
import { RemoteRunnable } from "@langchain/core/runnables/remote";
import { HumanMessage } from '@langchain/core/messages'

export default defineEventHandler(async (event) => {
  // chain 的 input 类型
  type ChainInputType = { messages: HumanMessage[] }
  // 请求体
  const body = await readBody<ChainInputType>(event)
  const cfg = useRuntimeConfig()
  const remoteChain = new RemoteRunnable<ChainInputType, string, any>({
    url: `${cfg.langserveBaseUrl}/chat-and-vision-2`,
  });

  const result = await remoteChain.invoke({
    messages: [new HumanMessage({content: 'hello'})]
  })
  return result
})