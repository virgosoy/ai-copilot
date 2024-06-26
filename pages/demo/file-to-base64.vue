<script setup lang="ts">
import { asyncMap } from '~/utils/PromiseUtils'
import { getBase64FromFile } from '~/utils/common'


const input = ref<HTMLInputElement>()
const base64Files = ref<string[]>([])
onMounted(() => {
  input.value?.addEventListener('change', async (e) => {
    const files = (e.target as HTMLInputElement).files
    if(files){
      base64Files.value = await asyncMap(
        Array.from(files), 
        file => getBase64FromFile(file),
        true,
      )
      console.log(base64Files.value)
    }
  })
})

</script>

<template>
  <div>
    <input ref="input" type="file" >
    <textarea v-for="base64 in base64Files" :value="base64" readonly></textarea>
  </div>
</template>
