
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

/**
 * 对应的 json 序列化可以通过 LangServe 反序列化成各自的 Message
 * @version 0.1.0.240626
 */
export type BaseMessageJsonObj = SystemMessageJsonObj | AIMessageJsonObj | HumanMessageJsonObj

/**
 * 对应的 json 序列化可以通过 LangServe 反序列化成 SystemMessage
 * @version 0.1.0.240626
 */
export type SystemMessageJsonObj = {
  content: string
  type: 'system'
}

/**
 * 对应的 json 序列化可以通过 LangServe 反序列化成 AIMessage
 * @version 0.1.0.240626
 */
export type AIMessageJsonObj = {
  content: string
  type: 'ai'
}

/**
 * 对应的 json 序列化可以通过 LangServe 反序列化成 HumanMessage
 * @version 0.1.0.240625
 */
export type HumanMessageJsonObj = {
  content: ({
    type: 'text',
    text: string
  } | {
    type: 'image_url'
    image_url: {
      url: string
    }
  })[],
  type: 'human'
}

/**
 * 创建 AI 消息对象
 * @param text 文本内容
 * @returns 
 * @version 0.1.0.240626
 */
export function createAIMessage(text: string): AIMessageJsonObj {
  return {
    content: text,
    type: 'ai'
  } // AIMessage
}

/**
 * 创建图片消息对象，可用于服务端反序列化成 HumanMessage 带图片的消息
 * @param base64Images 
 * @param text 
 * @version 0.1.0.240625
 */
export function createImgMessage(base64Images: string[], text: string): HumanMessageJsonObj{
  const textMessage = {
    type: 'text',
    text,
  } as const
  const imageMessage = base64Images.map(img => {
    return {
      type: 'image_url',
      image_url: {
        url: `data:image/jpeg;base64,${img}`,
      },
    } as const
  })
  return {
    content: [textMessage, ...imageMessage],
    type: 'human'
  } // HumanMessage
}