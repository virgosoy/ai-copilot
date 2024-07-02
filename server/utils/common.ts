
/**
 * 数组 转 MultiMap（即 `{K: V[]}`）
 * @param arr 数组
 * @param key 产生的 MultiMap 的 key 值
 * @returns MultiMap
 * @version 1.0.0.240409
 */
export function arrToMultiMap<T, K extends keyof T, NK extends T[K] & (string | number)>(arr: T[], key: K){
  const result = {} as Record<NK, T[]>
  arr.forEach(item => {
    (result[item[key] as NK] ??= []).push(item)
  })
  return result
}

import type { MultiPartData } from 'h3'
/**
 * MultiPartData[] 转 FormData 
 * @param multiparts 
 * @version 1.0.0.240429
 */
export function multipartsToFormData(multiparts: MultiPartData[]){
  const formData = new FormData()
  const decoder = new TextDecoder('utf-8')
  multiparts.forEach(part => {
    if(part.filename){
      const file = new File([part.data], part.filename, { type: part.type })
      formData.append(part.name!, file)
    }else{
      formData.append(part.name!, decoder.decode(part.data))
    }
  })
  return formData
}

import { RemoteRunnable } from "@langchain/core/runnables/remote";
import type { RunnableConfig } from '@langchain/core/runnables'
// import type { H3Event } from 'h3'

/**
 * 使用 RemoteRunnable \
 * 需要在初始化上下文中使用，以获取 useRuntimeConfig
 * @param event H3Event
 * @param runnableUrl 例如 playground 是 http://xxx/my-runnable/playground，则此值为 my-runnable
 * @returns -
 * @version 2024-06-28
 * @since 2024-06-28
 * @example
 * ```ts
 * // /server/api/my-runnable.post.ts
 * import { useRemoteRunnable } from "~/server/utils/common";
 * 
 * export default defineEventHandler(async (event) => {
 *   type ChainInputType = { text: string }
 *   const body = await readBody<ChainInputType>(event)
 *   // ★
 *   const remoteChain = useRemoteRunnable<ChainInputType, string>("my-runnable")
 *   const result = await remoteChain.invoke(body)
 *   return result
 * })
 * ```
 */
export function useRemoteRunnable<
  RunInput = any, 
  RunOutput = any, 
  CallOptions extends RunnableConfig = RunnableConfig
>(
  runnableUrl: string
){
  const cfg = useRuntimeConfig()
  const remoteChain = new RemoteRunnable<RunInput, RunOutput, CallOptions>({
    url: `${cfg.langserveBaseUrl}/${runnableUrl}`,
  });
  return remoteChain
}



import type { IterableReadableStream } from '@langchain/core/utils/stream'

/**
 * 结合 remoteRunnable 的 stream 方法的返回值，将结果返回给客户端 \
 * 根据 stream 方法的返回结果，模拟直接 http 调用服务端 url 的返回结果。
 * @param sse useSseServer 的返回值
 * @param result remoteRunnable 的 stream 方法的返回值
 * @since 2024-07-02
 * @version 2024-07-02
 * @example
 * ```ts
 * const result = await remoteRunnable.stream(..)
 * const sse = useSseServer(event.node)
 * await sseReturn(sse, result)
 * // 结束
 * ```
 */
export async function sseReturn<T>(sse: any, result: IterableReadableStream<T>){
  let isFirst = true
  for await (const chunk of result) {
    console.log(chunk)
    if(isFirst){
      isFirst = false
      sse.send('metadata', JSON.stringify(chunk))
    }else{
      sse.send('data', JSON.stringify(chunk))
    }
  }
  sse.close({event: 'end'})
}