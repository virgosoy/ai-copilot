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

import { useLangServeStreamLogResultFetch } from '~/utils/common';

function onclick() {
  useLangServeStreamLogResultFetch(
    '/api/langserve/chat-and-vision-3-stream-log-transfer',
    body,
    result,
  )
}
</script>

<template>
  <div>
    <button @click="onclick">click</button>
    <div>
      <div>{{ result?.final_output }}</div>
      <div v-for="log of result?.logs">
        <div>{{ log.start_time }}</div>
        <div>{{ log.final_output }}</div>
      </div>
    </div>
    {{ result }}
  </div>
</template>
