
import { sseReturnByStreamLog } from "~/server/utils/common";
// import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { BaseMessageJsonObj } from "~/utils/common";

export default defineEventHandler(async (event) => {
  
  type ChainInputType = {
    messages: Array<BaseMessageJsonObj>
  }
  // 请求体
  const body = await readBody<ChainInputType>(event)

  const remoteChain = useRemoteRunnable<ChainInputType, string>("chat-and-vision-3")

  const result = remoteChain.streamLog(body)

  const sse = useSseServer(event.node)
  await sseReturnByStreamLog(sse, result)

  // return result
})

























