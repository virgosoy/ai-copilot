<script setup lang="ts">
import { useMarkdown } from '~/composables/useMarkdown';

defineProps<{
  messages: BaseMessageJsonObj[]
}>()

const markdown = useMarkdown()
</script>

<template>
  <!-- History Messages -->
  <template v-for="message in messages">
    <LuHumanMessage v-if="message.type === 'human'">
      <template v-for="content in message.content.toSorted(comparatorOfEnum('type', ['image_url', 'text']))">
        <img v-if="content.type === 'image_url'" 
          :src="content.image_url.url"/>
        <div v-else v-html="markdown.render(content.text)"></div>
      </template>
    </LuHumanMessage>
    <LuAiMessage v-if="message.type === 'ai'">
      <div v-html="markdown.render(message.content)"></div>
    </LuAiMessage>
  </template>
</template>
