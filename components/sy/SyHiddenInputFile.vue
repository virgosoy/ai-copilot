
<script setup lang="ts">
/**
 * @version 0.1.0.240619
 * @example
 * ```ts
 * const fileComp = ref<InstanceType<typeof SyHiddenInputFile>>()
 * ```
 * ```html
 * <SyHiddenInputFile ref="fileComp" @fileSelect="handleFileSelected" />
 * ```
 */

defineOptions({
  inheritAttrs: false
})
const props = defineProps<{
  modelValue?: boolean
}>()
const emit = defineEmits<{
  (e: 'fileSelect', ev: {event: Event, files: FileList}): void
}>()

const fileDom = ref<HTMLInputElement>()

async function handleFileChange(event: Event){
  const fileDom = event.target as HTMLInputElement
  const files = fileDom.files
  if(!files || files.length === 0){
    // 无选择文件
    return
  }
  emit('fileSelect', {event: event, files})
  // 可让多次选择同一文件如果也可触发 onchange
  // 此代码可能会再触发一次当前方法，但由于无文件不会继续执行
  fileDom.value = ''
}

/**
 * 弹出选择文件
 */
function popupFileSelector() {
  fileDom.value?.click()
}

defineExpose({
  popupFileSelector
})
</script>

<template>
  <input ref="fileDom" class="hidden" type="file" size="sm" multiple @change="handleFileChange" />
</template>
