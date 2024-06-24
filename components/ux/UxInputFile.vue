
<script setup lang="ts">
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
</script>

<template>
  <div>
    <UButton @click="fileDom?.click()">上传文件</UButton>
    <input ref="fileDom" class="hidden" type="file" size="sm" multiple @change="handleFileChange" />
  </div>
</template>
