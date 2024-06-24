
/**
 * 数组 转 MultiMap（即 `{K: V[]}`）
 * @param arr 数组
 * @param key 产生的 MultiMap 的 key 值
 * @returns MultiMap
 * @version 1.0.0.240409
 */
export function arrToMultiMap<T, K extends keyof T, NK extends T[K] & (string | number)>(arr: T[], key: K){
  const result = {} as Record<NK, T[]>
  arr.forEach(item => {
    (result[item[key] as NK] ??= []).push(item)
  })
  return result
}

import type { MultiPartData } from 'h3'
/**
 * MultiPartData[] 转 FormData 
 * @param multiparts 
 * @version 1.0.0.240429
 */
export function multipartsToFormData(multiparts: MultiPartData[]){
  const formData = new FormData()
  const decoder = new TextDecoder('utf-8')
  multiparts.forEach(part => {
    if(part.filename){
      const file = new File([part.data], part.filename, { type: part.type })
      formData.append(part.name!, file)
    }else{
      formData.append(part.name!, decoder.decode(part.data))
    }
  })
  return formData
}