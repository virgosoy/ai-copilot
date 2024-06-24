// import { arrToMultiMap } from "~/server/utils/common"

import { RemoteRunnable } from "@langchain/core/runnables/remote";
import { pick } from "~/utils/ObjectUtils";

export default defineEventHandler(async (event) => {

  type ChainInputType = {files:string[], text: string}
  // 请求体
  const body = await readBody<ChainInputType>(event)
  
  const cfg = useRuntimeConfig()
  const remoteChain = new RemoteRunnable<ChainInputType, string, any>({
    url: `${cfg.langserveBaseUrl}/vision-2`,
  });

  const result = await remoteChain.invoke(pick(body, ['files', 'text']))
  return result
})

// 直接上传文件附件方式
// export default defineEventHandler(async (event) => {
//   // 请求体
//   const multiparts = await readMultipartFormData(event) ?? []
//   const multiMap = arrToMultiMap(multiparts, 'name')
//   // 前端 name=files
//   const base64files = multiMap.files?.map(file => file.data.toString('base64')) ?? []
//   const text = multiMap.text?.[0].data.toString('utf-8') ?? ''

//   const cfg = useRuntimeConfig()
//   const remoteChain = new RemoteRunnable<{files:string[], text: string}, string, any>({
//     url: `${cfg.langserveBaseUrl}/vision-2`,
//   });

//   const result = await remoteChain.invoke({
//     files: base64files,
//     text,
//   })
//   return result
// })