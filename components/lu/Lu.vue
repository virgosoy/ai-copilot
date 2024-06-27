<script setup lang="ts">
// 作为所有组件排布的 demo
const messages = ref<BaseMessageJsonObj[]>([])

</script>

<template>
  <div>
    <LuHistoryMessages :messages></LuHistoryMessages>
    <!-- human current content -->
    <LuHumanMessage>
      <!-- slot -->
    </LuHumanMessage>
  </div>
</template>
