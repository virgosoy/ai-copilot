
import { RemoteRunnable } from "@langchain/core/runnables/remote";
import { pick } from "~/utils/ObjectUtils";

export default defineEventHandler(async (event) => {

  type ChainInputType = {files:string[], text: string}
  // 请求体
  const body = await readBody<ChainInputType>(event)
  
  const cfg = useRuntimeConfig()
  const remoteChain = new RemoteRunnable<ChainInputType, string, any>({
    url: `${cfg.langserveBaseUrl}/local-knowledge-rag-vision`,
  });

  const result = await remoteChain.invoke(pick(body, ['files', 'text']))
  return result
})