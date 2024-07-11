
import { sseReturnByStream } from "~/server/utils/common";
// import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { BaseMessageJsonObj } from "~/utils/common";

/**
 * @deprecated 2024-07-09 使用 chat-and-vision-3-stream-or-log.post.ts
 */
export default defineEventHandler(async (event) => {
  
  type ChainInputType = {
    messages: Array<BaseMessageJsonObj>
  }
  // 请求体
  const body = await readBody<ChainInputType>(event)

  const remoteChain = useRemoteRunnable<ChainInputType, string>("chat-and-vision-3")

  const result = await remoteChain.stream(body)

  const sse = useSseServer(event.node)
  await sseReturnByStream(sse, result)

  // return result
})

























