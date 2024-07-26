
import type { LangServeOfNuxtApiReq } from "~/server/utils/common";


export default defineEventHandler(async (event) => {
  const req = await readBody<LangServeOfNuxtApiReq>(event)
  const t = useLangServeTransfer(event)
  return t.fetch('local-knowledge-rag-local-text-chat', req.runnableMethod, req.body)
})