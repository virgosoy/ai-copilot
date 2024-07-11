
import { LangServeTransferReq, sseReturnByStream } from "~/server/utils/common";
// import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { BaseMessageJsonObj } from "~/utils/common";
import { useLangServeTransfer } from "~/server/utils/common";
import { FieldPartial } from "~/server/utils/TsTypeUtils";


type ChainInputType = {
  messages: Array<BaseMessageJsonObj>
}
export type Body = Omit<
  LangServeTransferReq<ChainInputType>,
'runnableUrl'>

/**
 * @deprecated 2024-07-11 使用 chat-and-vision-config-model.post.ts
 */
export default defineEventHandler<{body: Body}>(async (event) => {

  // 请求体
  const body = await readBody(event)

  const t = useLangServeTransfer(event)
  return t.fetch<ChainInputType, string>(
    'chat-and-vision-3', body.runnableMethod, body.body
  )
})
