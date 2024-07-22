
import { BaseRunnableConfig, LangServeTransferReq, useRemoteRunnable } from "~/server/utils/common";
import { BaseMessageJsonObj, HumanMessageJsonObj } from "~/utils/common";


export default defineEventHandler(async (event) => {
  const req = await readBody<LangServeTransferReq>(event)
  const t = useLangServeTransfer(event)
  return t.fetch('local-knowledge-rag-text-chat', req.runnableMethod, req.body)
})