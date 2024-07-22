

import type { RunState, LogEntry } from '@langchain/core/tracers/log_stream'
import type { NitroFetchRequest } from 'nitropack'
import type { LangServeTransferReq } from '~/server/utils/common'

type _LangServeTransferReq = Omit<LangServeTransferReq, 'runnableUrl'>

/**
 * 使用中间步骤
 * @returns 
 * @example
 * ```ts
 * const {
 *   isIntermediateSteps, 
 *   intermediateSteps, 
 *   intermediateStepsOfMessages,
 *   fetchLangServeResult,
 * } = useBizIntermediteStep()
 * ```
 * ```html
 * <LuHistoryMessages :messages="messages" :intermediateStepsOfMessages="intermediateStepsOfMessages" />
 * <LuAiMessage :intermediateSteps="intermediateSteps" />
 * 
 * <LuToggle v-model="isIntermediateSteps">Intermediate steps</LuToggle>
 * ```
 */
export function useBizIntermediteStep() {
  const isIntermediateSteps = ref<boolean>(false)
  const intermediateSteps = ref<Record<string, LogEntry>>()
  const intermediateStepsOfMessages = ref<(Record<string, LogEntry> | undefined)[]>([])

  /**
   * 拉取 LangServe 结果，底层是 useLangServeStreamLogResultFetch 和 useLangServeStreamResultFetch
   * @param url 
   * @param langServeReqBody 
   * @param callback 
   */
  function fetchLangServeResult<MyLangServeReqBody extends LangServeTransferReq['body']>(
    url: NitroFetchRequest, 
    langServeReqBody: MyLangServeReqBody,
    callback: {
      /**
       * 
       * @param result 数据结果，data 和 finalOutput 只会有一个，有中间步骤则返回后者，否则返回前者
       * @returns -
       * @example
       * ```ts
       * onData({isIntermediateSteps, data, finalOutput}){
       *    aiResponse.value = isIntermediateSteps ? finalOutput : (aiResponse.value + data)
       * }
       * ```
       * 注意：data 和 finalOutput 在有中间步骤时刚开始也会都为空，因为刚开始的时候中间步骤结果的 final_output 为 null
       */
      onData: (result: {
        isIntermediateSteps: boolean,
        /** 单次响应数据 */
        data?: any, 
        /** 单次响应后合并最终的数据 */
        finalOutput?: any
      }) => void,
      /**
       * @returns currentMessageIndex - 当前消息的索引，为了匹配 intermediateStepsOfMessages
       */
      onEnd: () => {
        /** 当前消息的索引，为了匹配 intermediateStepsOfMessages */
        currentMessageIndex: number
      },
    }
  ){
    if(isIntermediateSteps.value){
      useLangServeStreamLogResultFetch<_LangServeTransferReq>(url,{
        runnableMethod: 'stream_log',
        body: langServeReqBody,
      }, undefined, {
        onData(data) {
          // 刚开始的时候中间步骤结果的 final_output 为 null
          // 虽然可以判断 final_output 有值再触发，但为了以后可能要获取中间步骤的其他数据，暂时不考虑。但其实也可以通过 intermediateSteps 获取
          callback.onData({isIntermediateSteps: true, finalOutput: data.final_output})
          intermediateSteps.value = data.logs
        },
        onEnd() {
          const info = callback.onEnd()
          intermediateStepsOfMessages.value[info.currentMessageIndex] = intermediateSteps.value
          intermediateSteps.value = undefined
        }
      })
    }else{
      useLangServeStreamResultFetch<_LangServeTransferReq>(url, {
        runnableMethod: 'stream',
        body: langServeReqBody,
      },{
        onData(data) {
          callback.onData({isIntermediateSteps: false, data})
        },
        onEnd() {
          callback.onEnd()
        }
      })
    }
  }
  return {
    intermediateSteps,
    isIntermediateSteps,
    intermediateStepsOfMessages,
    fetchLangServeResult,
  }
}