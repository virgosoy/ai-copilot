
import { BaseRunnableConfig, LangServeTransferReq, sseReturnByStream } from "~/server/utils/common";
// import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { BaseMessageJsonObj } from "~/utils/common";
import { useLangServeTransfer } from "~/server/utils/common";


type ChainInputType = {
  messages: Array<BaseMessageJsonObj>
}
type ChainConfig = BaseRunnableConfig<{
  "model_provider": "openai" | "anthropic" | "ollama"
}>
export type Body = Omit<
  LangServeTransferReq<ChainInputType, ChainConfig>,
'runnableUrl'>

export default defineEventHandler<{body: Body}>(async (event) => {

  // 请求体
  const body = await readBody(event)

  const t = useLangServeTransfer(event)
  return t.fetch<ChainInputType, string, ChainConfig>(
    'chat-and-vision-config-model-2', body.runnableMethod, body.body
  )
})
