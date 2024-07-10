
import { useLangServeTransfer } from "~/server/utils/common";
// import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { BaseMessageJsonObj } from "~/utils/common";

export default defineEventHandler(async (event) => {
  
  type ChainInputType = {
    messages: Array<BaseMessageJsonObj>
  }
  // 请求体
  const body = await readBody<ChainInputType>(event)

  // const remoteChain = useRemoteRunnable<ChainInputType, string>("chat-and-vision-3")

  // const result = remoteChain.streamLog(body)

  const t = useLangServeTransfer(event)
  return t.fetch<ChainInputType>('chat-and-vision-3', 'stream_log', {
    input: body
  })

  // const url = t.url('chat-and-vision-3', 'stream_log')
  
  // const res = event.node.res
  // res.writeHead(200, {
  //   'Content-Type': 'text/event-stream',
  //   'Cache-Control': 'no-cache',
  //   'Connection': 'keep-alive',
  // });

  // const stream =  await $fetchSse(url, {
  //   method: 'POST',
  //   body: {
  //     input: body
  //   }
  // })

  // return stream



  // const sse = useSseServer(event.node)

  // const result = await t.fetch<ChainInputType, string>('chat-and-vision-3', 'stream_log', {
  //   input: body
  // })

  // const sse = useSseServer(event.node)
  // await sseReturnByStreamLog(sse, result)

  // return result
})























