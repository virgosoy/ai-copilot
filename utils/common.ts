
/**
 * 文件转 base64 字符串
 * @version 1.0.0.240619
 */
export async function getBase64FromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      // result 含有前缀如 data:image/jpeg;base64, 其中的 `base64,` 是固定的之后就是 base64 编码。
      // 见：https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader/readAsDataURL
      // const base64 = result?.split('base64,')[1]
      const base64Index = result.indexOf('base64,') + 7 // 'base64,'.length
      const base64 = result.substring(base64Index)
      resolve(base64)
    }
    reader.readAsDataURL(file)
  })
}

/**
 * 获取文件的数据 url，即文件 转 dataURL
 * @version 1.0.0.240619
 */
export async function getDataUrlFromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = function(){
      resolve(reader.result as string)
    }
    reader.readAsDataURL(file)
  })
}

/**
 * dataURL 转 base64
 * @version 1.0.0.240619
 */
export function getBase64FromDataUrl(dataUrl: string): string {
  const base64Index = dataUrl.indexOf('base64,') + 7 // 'base64,'.length
  const base64 = dataUrl.substring(base64Index)
  return base64
}