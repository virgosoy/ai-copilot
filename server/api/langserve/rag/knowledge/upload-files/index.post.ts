import { arrToMultiMap, multipartsToFormData } from "~/server/utils/common"

export default defineEventHandler(async (event) => {
  // 请求体
  const multiparts = await readMultipartFormData(event) ?? []
  const multiMap = arrToMultiMap(multiparts, 'name')
  // 前端 name=files
  multiMap.files.forEach(file => {
    console.log(file)
  })

  const config = useRuntimeConfig()

  const result = await $fetch(`${config.langserveBaseUrl}/upload-files`, {
    method: 'POST',
    body: multipartsToFormData(multiparts),
  })
  return result
})