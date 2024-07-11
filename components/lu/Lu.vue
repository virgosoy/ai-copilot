<script setup lang="ts">
// 作为所有组件排布的 demo
const messages = ref<BaseMessageJsonObj[]>([])
import type { LogEntry } from '@langchain/core/tracers/log_stream'
// 中间步骤，可选
const intermediateStepsOfMessages = ref<(Record<string, LogEntry> | undefined)[]>([])
</script>

<template>
  <div>
    <LuHistoryMessages :messages :intermediateStepsOfMessages></LuHistoryMessages>
    <!-- human current content -->
    <LuHumanMessage>
      <!-- slot -->
    </LuHumanMessage>
  </div>
</template>
