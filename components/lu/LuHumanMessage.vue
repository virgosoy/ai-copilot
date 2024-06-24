<script setup lang="ts">
const props = withDefaults(defineProps<{
  imagePromptDataUrls?: string[]
  prompt?: string
}>(),{
  imagePromptDataUrls: () => [],
  prompt: ''
})

</script>

<template>
  <!-- human message -->
  <div class="flex flex-row-reverse items-start">
    <img
      class="ml-2 h-8 w-8 rounded-full"
      src="https://dummyimage.com/128x128/363536/ffffff&text=H"
    />
    <div
      class="flex flex-col rounded-b-xl rounded-tl-xl bg-slate-50 p-4 dark:bg-slate-800 sm:max-w-md md:max-w-2xl"
    >
      <slot>
        <img v-for="du in $props.imagePromptDataUrls" :src="du"/>
        <p>{{ $props.prompt }}</p>
      </slot>
    </div>
  </div>
</template>
