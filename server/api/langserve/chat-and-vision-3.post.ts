
import { RemoteRunnable } from "@langchain/core/runnables/remote";
// import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { BaseMessageJsonObj } from "~/utils/common";

export default defineEventHandler(async (event) => {
  
  type ChainInputType = {
    messages: Array<BaseMessageJsonObj>
  }
  // 请求体
  const body = await readBody<ChainInputType>(event)
  const cfg = useRuntimeConfig()
  const remoteChain = new RemoteRunnable<ChainInputType, string, any>({
    url: `${cfg.langserveBaseUrl}/chat-and-vision-3`,
  });

  const result = await remoteChain.invoke(body)
  return result
})

























