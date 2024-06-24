<script setup lang="ts">
import { asyncMap } from '~/utils/PromiseUtils'
import { getBase64FromFile } from '~/utils/common'


const input = ref<HTMLInputElement>()
onMounted(() => {
  input.value?.addEventListener('change', async (e) => {
    const files = (e.target as HTMLInputElement).files
    if(files){
      const base64Files = await asyncMap(
        Array.from(files), 
        file => getBase64FromFile(file),
        true,
      )
      console.log(base64Files)
    }
  })
})

</script>

<template>
  <div>
    <input ref="input" type="file" >
  </div>
</template>
