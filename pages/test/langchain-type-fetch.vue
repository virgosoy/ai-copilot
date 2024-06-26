
<script setup lang="ts">

import { HumanMessage } from '@langchain/core/messages'

const m = new HumanMessage({ content: 'hello' })

onMounted(() => {
  $fetch('/api/test/langchain-type-fetch', {
    body: {
      messages: [m]
    },
    method: 'post',
  })
})
</script>

<template>
  <div>
    
  </div>
</template>
