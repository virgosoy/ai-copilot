
import { RemoteRunnable } from "@langchain/core/runnables/remote";
// import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { BaseMessageJsonObj } from "~/utils/common";

/**
 * @deprecated 使用 chat-and-vision-2-stream.post.ts
 */
export default defineEventHandler(async (event) => {
  
  type ChainInputType = {
    messages: Array<BaseMessageJsonObj>
  }
  // 请求体
  const body = await readBody<ChainInputType>(event)
  const cfg = useRuntimeConfig()
  const remoteChain = new RemoteRunnable<ChainInputType, any, any>({
    url: `${cfg.langserveBaseUrl}/chat-and-vision-2`,
  });

  const result = await remoteChain.invoke(body)
  return result
})

























