<script setup lang="ts">
import { useMarkdown } from '~/composables/useMarkdown';
import type { LogEntry } from '@langchain/core/tracers/log_stream'

defineProps<{
  messages: BaseMessageJsonObj[],
  /** 中间步骤，可选。甚至每个元素也是可选的。数组的顺序必须与 messages 的顺序一致 */
  intermediateStepsOfMessages?: (Record<string, LogEntry> | undefined)[]
}>()

const markdown = useMarkdown()
</script>

<template>
  <!-- History Messages -->
  <template v-for="(message, messageIndex) in $props.messages">
    <LuHumanMessage v-if="message.type === 'human'">
      <template v-for="content in message.content.toSorted(comparatorOfEnum('type', ['image_url', 'text']))">
        <img v-if="content.type === 'image_url'" 
          :src="content.image_url.url"/>
        <div v-else v-html="markdown.render(content.text)"></div>
      </template>
    </LuHumanMessage>
    <LuAiMessage v-if="message.type === 'ai'" :intermediateSteps="$props.intermediateStepsOfMessages?.[messageIndex]">
      <div v-html="markdown.render(message.content)"></div>
    </LuAiMessage>
  </template>
</template>
