import { BaseDocumentLoader } from "langchain/document_loaders/base"
import { CSVLoader } from "langchain/document_loaders/fs/csv"
import { DocxLoader } from "langchain/document_loaders/fs/docx"
import { TextLoader } from "langchain/document_loaders/fs/text"
import type { MultiPartData } from 'h3'
import { EPubLoader } from "langchain/document_loaders/fs/epub"
import { JSONLinesLoader, JSONLoader } from "langchain/document_loaders/fs/json"
import { PDFLoader } from "langchain/document_loaders/fs/pdf"
import { PPTXLoader } from "langchain/document_loaders/fs/pptx"
import { MemoryVectorStore } from "langchain/vectorstores/memory"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { vectorStore } from "~/server/utils/demo-rag-common"

export default defineEventHandler(async (event) => {

  const formData = await readMultipartFormData(event)
  if(!formData){
    return
  }
  const multiMap = arrToMultiMap(formData, 'name')

  const docs = (await Promise.all(multiMap.file.map(file => loadFile(file)))).flat()

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  })
  const allSplits = await textSplitter.splitDocuments(docs)

  await vectorStore.addDocuments(allSplits)
})

/**
 * 数组 转 MultiMap（即 `{K: V[]}`）
 * @param arr 数组
 * @param key 产生的 MultiMap 的 key 值
 * @returns MultiMap
 * @version 1.0.0.240409
 */
function arrToMultiMap<T, K extends keyof T, NK extends T[K] & (string | number)>(arr: T[], key: K){
  const result = {} as Record<NK, T[]>
  arr.forEach(item => {
    (result[item[key] as NK] ??= []).push(item)
  })
  return result
}

const extMapLoader = {
  csv: CSVLoader,
  docx: DocxLoader,
  // epub: EPubLoader,
  json: JSONLoader,
  // jsonl: JSONLinesLoader,
  md: TextLoader,
  txt: TextLoader,
  log: TextLoader,
  pdf: PDFLoader,
  // pptx: PPTXLoader,
}

/**
 * 加载文件为 Document 列表
 * @param multipartData 
 * @returns Document 列表
 */
async function loadFile(multipartData: MultiPartData){
  const fileName = multipartData.filename
  const ext = (fileName?.match(/\.(\w+)$/)?.[1] || 'txt').toLowerCase()
  
  const Loader = extMapLoader[ext as keyof typeof extMapLoader]
  if(!Loader){
    throw createError({
      statusCode: 400,
      statusMessage: `unsupport file type is ${ext}`,
    })
  }
  const blob = new Blob([multipartData.data], { type: multipartData.type })
  const loader = new Loader(blob)
  const docs = await loader.load()
  docs.forEach((doc) => {
    doc.metadata.filename ??= fileName
  })
  return docs
}