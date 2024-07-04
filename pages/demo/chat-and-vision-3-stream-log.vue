<script setup lang="ts">

const body = {
        "messages": [
            {
                "content": [
                    {
                        "type": "text",
                        "text": "你好"
                    }
                ],
                "type":"human"
            }
        ]
}

import type { RunState } from '@langchain/core/tracers/log_stream'
// https://github.com/langchain-ai/langserve/blob/050a0cc6743149b98f53da16a3ccc7fd4abed17f/langserve/playground/src/useStreamLog.tsx#L78
// 从上述地址知道是 RunState 类型，并且开始可以是 null（实测也可以是 undefined）
// 注：用 RemoteRunnable 的 streamLog 结果的 chunk.concat(chunk) 得到的是 RunLog 类型，RunLog 的 state 属性才是 RunState 类型。
const result = ref<RunState>()

import jsonpatch, { type Operation } from 'fast-json-patch'

function onclick() {
  const sse = useSseClient<{'data': { ops: Operation[]}, 'end': undefined}>('/api/langserve/chat-and-vision-3-stream-log', {
    method: 'POST', 
    body,
    receiveHandlers: [({event, data}) => {
      if(event === 'data') {
        result.value = jsonpatch.applyPatch(result.value, data.ops, true, false).newDocument
      }
    }],
  })
}
</script>

<template>
  <div>
    <button @click="onclick">click</button>
    {{ result }}
  </div>
</template>
