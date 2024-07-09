
/**
 * 文件转 base64 字符串
 * @version 1.0.0.240619
 */
export async function getBase64FromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      // result 含有前缀如 data:image/jpeg;base64, 其中的 `base64,` 是固定的之后就是 base64 编码。
      // 见：https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader/readAsDataURL
      // const base64 = result?.split('base64,')[1]
      const base64Index = result.indexOf('base64,') + 7 // 'base64,'.length
      const base64 = result.substring(base64Index)
      resolve(base64)
    }
    reader.readAsDataURL(file)
  })
}

/**
 * 获取文件的数据 url，即文件 转 dataURL
 * @version 1.0.0.240619
 */
export async function getDataUrlFromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = function(){
      resolve(reader.result as string)
    }
    reader.readAsDataURL(file)
  })
}

/**
 * dataURL 转 base64
 * @version 1.0.0.240619
 */
export function getBase64FromDataUrl(dataUrl: string): string {
  const base64Index = dataUrl.indexOf('base64,') + 7 // 'base64,'.length
  const base64 = dataUrl.substring(base64Index)
  return base64
}

/**
 * 对应的 json 序列化可以通过 LangServe 反序列化成各自的 Message
 * @version 0.1.0.240626
 */
export type BaseMessageJsonObj = SystemMessageJsonObj | AIMessageJsonObj | HumanMessageJsonObj

/**
 * 对应的 json 序列化可以通过 LangServe 反序列化成 SystemMessage
 * @version 0.1.0.240626
 */
export type SystemMessageJsonObj = {
  content: string
  type: 'system'
}

/**
 * 对应的 json 序列化可以通过 LangServe 反序列化成 AIMessage
 * @version 0.1.0.240626
 */
export type AIMessageJsonObj = {
  content: string
  type: 'ai'
}

/**
 * 对应的 json 序列化可以通过 LangServe 反序列化成 HumanMessage
 * @version 0.1.0.240625
 */
export type HumanMessageJsonObj = {
  content: ({
    type: 'text',
    text: string
  } | {
    type: 'image_url'
    image_url: {
      url: string
    }
  })[],
  type: 'human'
}

/**
 * 创建 AI 消息对象
 * @param text 文本内容
 * @returns 
 * @version 0.1.0.240626
 */
export function createAIMessage(text: string): AIMessageJsonObj {
  return {
    content: text,
    type: 'ai'
  } // AIMessage
}

/**
 * 创建图片消息对象，可用于服务端反序列化成 HumanMessage 带图片的消息
 * @param base64Images 
 * @param text 
 * @version 0.1.0.240625
 */
export function createImgMessage(base64Images: string[], text: string): HumanMessageJsonObj{
  const textMessage = {
    type: 'text',
    text,
  } as const
  const imageMessage = base64Images.map(img => {
    return {
      type: 'image_url',
      image_url: {
        url: `data:image/jpeg;base64,${img}`,
      },
    } as const
  })
  return {
    content: [textMessage, ...imageMessage],
    type: 'human'
  } // HumanMessage
}


import type { NitroFetchRequest } from 'nitropack'
import jsonpatch, { type Operation } from 'fast-json-patch'
import type { RunState } from '@langchain/core/tracers/log_stream'

/**
 * 处理 nuxt 后端中转 langserve /stream_log 的响应
 * @param url 
 * @param body 
 * @param streamLogResult 
 * @version 2024-07-08
 * @example
 * ```ts
 * import type { RunState } from '@langchain/core/tracers/log_stream'
 * const result = ref<RunState>()
 * useLangServeStreamLogResultFetch(
 *   '/api/langserve/xxx', // 必须是和 langserve /stream_log 一样的响应类型
 *   body,
 *   result,
 * )
 * ```
 */
export function useLangServeStreamLogResultFetch<Req>(
  url: NitroFetchRequest,
  body: Req,
  streamLogResult: Ref<RunState | undefined>
) {
  const sse = useSseClient<
    {'data': { ops: Operation[]}, 'end': undefined}
  >(url, {
    method: 'POST', 
    body,
    receiveHandlers: [({event, data}) => {
      if(event === 'data') {
        streamLogResult.value = jsonpatch.applyPatch(streamLogResult.value, data.ops, true, false).newDocument
      }
    }],
  })
}

/**
 * 处理 nuxt 后端中转 langserve /stream 的响应
 * 其实和 useSseClient 非常类似，只是对 event data 做了点过滤。
 * @param url 
 * @param body 
 * @param [callback.onData]
 * @param [callback.onEnd]
 * @version 2024-07-09
 * @example
 * ```ts
 * const result = ref('')
 * useLangServeStreamResultCallback<unknown, string>(
 *   '/api/langserve/xxx',
 *   body,{
 *     onData: (data) => {
 *       result.value += data
 *     }
 *   }
 * )
 * ```
 */
export function useLangServeStreamResultCallback<Req, RunOutput>(
  url: NitroFetchRequest,
  body: Req,
  callback?: {
    onData?: (data: RunOutput) => void,
    onEnd?: () => void,
  },
){
  const sse = useSseClient<
    {'data': RunOutput, 'end': undefined}
  >(url, {
    method: 'POST', 
    body,
    receiveHandlers: [({event, data}) => {
      if(event === 'data') {
        callback?.onData?.(data)
      }else if(event === 'end') {
        callback?.onEnd?.()
      }
    }],
  })
}