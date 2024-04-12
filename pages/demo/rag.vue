<script setup lang="ts">
// const router = useRouter()
// const route = useRoute()

const fileDom = ref<HTMLInputElement>()
async function handleFileChange(e: Event){
  const fileDom = e.target as HTMLInputElement
  const files = fileDom.files
  if(!files || files.length === 0){
    // 无选择文件
    return
  }
  const formData = new FormData()
  Array.from(files).forEach(file => {
    formData.append('file', file)
  })
  await $fetch('/api/demo/rag/file-upload', {
    method: 'POST',
    body: formData,
  })
  // 可让多次选择同一文件如果也可触发 onchange
  // 此代码可能会再触发一次当前方法，但由于无文件不会继续执行
  fileDom.value = ''
}

const chatValue = ref('')

const chatResponse = ref('')
async function handleSend(){
  if (!chatValue.value) return
  const res = await $fetch('/api/demo/rag/chat', {
    method: 'POST',
    body: {
      input: chatValue.value,
    },
  })
  chatResponse.value = res.output
}
async function doFileClear(){
  await $fetch('/api/demo/rag/file-clear', {
    method: 'POST',
  })
}
</script>

<template>
  <div class="flex flex-col w-full">
    <!-- 知识库-->
    <div>
      <UButton @click="fileDom?.click()">上传文件</UButton>
      <input ref="fileDom" class="hidden" type="file" size="sm" multiple @change="handleFileChange" />
      <UButton @click="doFileClear" color="red">清除文件</UButton>
    </div>
    <!-- 聊天框 -->
    <div>
      {{ chatResponse }}
    </div>
    <!-- 输入框 -->
    <div>
      <UTextarea v-model="chatValue"></UTextarea>
      <UButton @click="handleSend">发送</UButton>
    </div>
  </div>
</template>

