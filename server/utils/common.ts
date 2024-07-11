
/**
 * 数组 转 MultiMap（即 `{K: V[]}`）
 * @param arr 数组
 * @param key 产生的 MultiMap 的 key 值
 * @returns MultiMap
 * @author doc-snippet
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
 * @author doc-snippet
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
 * // ★
 * await sseReturnByStream(sse, result)
 * // 结束
 * ```
 */
export async function sseReturnByStream<T>(
  sse: any, 
  result: IterableReadableStream<T>
){
  let isFirst = true
  for await (const chunk of result) {
    // console.debug('[sseReturn]', chunk)
    if(isFirst){
      isFirst = false
      sse.send('metadata', JSON.stringify(chunk))
    }else{
      sse.send('data', JSON.stringify(chunk))
    }
  }
  sse.close({event: 'end'})
}

import type { RunLogPatch } from '@langchain/core/tracers/log_stream'

/**
 * 结合 remoteRunnable 的 streamLog 方法的返回值，将结果返回给客户端 \
 * 根据 streamLog 方法的返回结果，模拟直接 http 调用服务端 url 的返回结果。
 * @param sse useSseServer 的返回值
 * @param result remoteRunnable 的 streamLog 方法的返回值
 * @since 2024-07-03
 * @version 2024-07-03
 * @example
 * ```ts
 * const result = remoteRunnable.streamLog(..)
 * const sse = useSseServer(event.node)
 * // ★
 * await sseReturnByStreamLog(sse, result)
 * // 结束
 * ```
 */
export async function sseReturnByStreamLog(
  sse: any, 
  result: AsyncGenerator<RunLogPatch>
){
  for await (const chunk of result) {
    sse.send('data', JSON.stringify(chunk))
  }
  sse.close({event: 'end'})
}

/**
 * ofetch 传入的 body 类型
 */
type OfetchBody = BodyInit | Record<string, any> | null | undefined
type RunnableMethod = 'invoke' | 'stream' | 'stream_log'
type LangServeReq<
  RunInput extends OfetchBody, 
  CallOptions extends RunnableConfig,
> = { 
  input: RunInput, config?: CallOptions 
}
/**
 * @template RunInput runnable 的输入，对应 LangServe 请求体的 input 的值类型
 * @template CallOptions runnable 的配置项，对应 LangServe 请求体的 config 的值类型
 */
export type LangServeTransferReq<
  RunInput extends OfetchBody = any, 
  CallOptions extends RunnableConfig = any,
> = {
  runnableUrl: string,
  runnableMethod: RunnableMethod,
  body: LangServeReq<RunInput, CallOptions>
}

/**
 * RunnableConfig 的子类，用泛型方便指定配置项的具体类型
 * @version 2024-07-11
 * @since 2024-07-11
 * @example
 * ```ts
 * type ChainConfig = BaseRunnableConfig<{
 *   "model_provider": "openai" | "anthropic"
 * }>
 * // 一般用于传递到需要用到 runnable 配置的地方，如 LangServeTransferReq<unknown, ChainConfig>
 * ```
 */
export interface BaseRunnableConfig<C extends Record<string, any>> extends RunnableConfig {
  configurable: C
}

/**
 * 使用 LangServe 中转器
 * @param event H3Event
 * @returns 中转工具
 * @version 2024-07-10
 * @since 2024-07-08
 * @example
 * ```ts
 * type ChainInputType = {
 *   messages: string
 * }
 * // 请求体
 * const body = await readBody<ChainInputType>(event)
 * const t = useLangServeTransfer(event)
 * return t.fetch<ChainInputType, string>('my-runnable', 'stream_log', {
 *   input: body
 * })
 * ```
 */
export function useLangServeTransfer(event: H3Event) {
  const cfg = useRuntimeConfig()

  function url(
    runnableUrl: string, 
    runnableMethod: RunnableMethod
  ){
    return `${cfg.langserveBaseUrl}/${runnableUrl}/${runnableMethod}`
  }

  type FetchResult<RM extends RunnableMethod, RunOutput> = {
    invoke: RunOutput
    stream: ReadableStream<Uint8Array>
    stream_log: ReadableStream<Uint8Array>
  }[RM]
  
  async function fetch<
    RunInput extends BodyInit | Record<string, any> | null | undefined = any, 
    RunOutput = any, 
    CallOptions extends RunnableConfig = RunnableConfig,
    RM extends RunnableMethod = RunnableMethod
  >(
    runnableUrl: string, 
    runnableMethod: RM,
    body: LangServeTransferReq<RunInput, CallOptions>['body'],
  ): Promise<FetchResult<RM, RunOutput>> {
    switch(runnableMethod){
      case 'invoke':
        return $fetch<RunOutput>(url(runnableUrl, runnableMethod), {
          method: 'POST',
          body: body,
        }) satisfies Promise<RunOutput> as Promise<FetchResult<RM, RunOutput>>
      case 'stream':
      case 'stream_log':
        setSseResHeader(event)
        return $fetchSse<RunOutput>(url(runnableUrl, runnableMethod), {
          method: 'POST',
          body: body,
        }) satisfies Promise<ReadableStream<Uint8Array>> as Promise<FetchResult<RM, RunOutput>>
      default:
        const _exhaustiveCheck: never = runnableMethod;
        return _exhaustiveCheck;
    }
  }

  return {
    // url,
    fetch,
  }
}

import type { ReadableStream } from 'node:stream/web'
import type { NitroFetchRequest, NitroFetchOptions } from 'nitropack'
/**
 * 获取 SSE，返回 ReadableStream<Uint8Array>
 * @author doc-snippet
 * @version 0.1.0.240705
 */
async function $fetchSse<
  T = unknown, 
  R extends NitroFetchRequest = NitroFetchRequest, 
  O extends NitroFetchOptions<R> = NitroFetchOptions<R>
>(request: R, opts ?: O){
  return $fetch<T, R>(request, {
    ...opts,
    responseType: 'stream'
  }) as Promise<ReadableStream<Uint8Array>>
}

import type { H3Event } from 'h3'
function setSseResHeader(event: H3Event){
  const res = event.node.res
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });
}