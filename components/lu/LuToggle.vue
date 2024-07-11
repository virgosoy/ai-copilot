<script setup lang="ts">
// const props = defineProps<{
//   modelValue?: boolean
// }>()

const modelValue = defineModel<boolean>({ required: true })

</script>

<template>
  <!-- toggle -->
  <div class="px-2 py-2">
    <label class="relative flex cursor-pointer items-center">
      <input type="checkbox" v-model="modelValue" class="peer sr-only" />
      <div
        class="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:border-slate-600 dark:bg-slate-700 dark:peer-focus:ring-blue-800"
      ></div>
      <span class="ml-3 text-sm font-medium text-slate-800 dark:text-slate-200"
        ><slot /></span
      >
    </label>
  </div>
</template>
