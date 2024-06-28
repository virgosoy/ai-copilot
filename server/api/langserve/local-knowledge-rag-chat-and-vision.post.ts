
import { useRemoteRunnable } from "~/server/utils/common";
import { BaseMessageJsonObj, HumanMessageJsonObj } from "~/utils/common";

export default defineEventHandler(async (event) => {

  type ChainInputType = {
    historyMessages: BaseMessageJsonObj[],
    currentMessage: HumanMessageJsonObj,
  }
  
  const body = await readBody<ChainInputType>(event)
  const remoteChain = useRemoteRunnable<ChainInputType, string>(
    "local-knowledge-rag-chat-and-vision")
  const result = await remoteChain.invoke(body)
  return result
})