
import { DynamicStructuredTool, DynamicTool } from "langchain/tools";
import { WebBrowser } from "langchain/tools/webbrowser";
import { z } from 'zod'
export function createBaiduWebSearchTool({ model, embeddings }: ConstructorParameters<typeof WebBrowser>[0]){
  return new DynamicTool({
    name: "baidu_web_search",
    description: `在您需要使用百度搜索引擎搜索网页的时候很有用。输入应为一个逗号分隔的列表，格式为"搜索关键字","您想要在页面上查找的内容或留空以获取摘要"。`,
    // schema: z.string().describe('搜索关键词'),
    func: async (query: string) => {
      const browserTool = new WebBrowser({ model, embeddings })
      const a = Array.from(query)
      if(a[0]===`'`){
        a.splice(1, 0, 'https://www.baidu.com/s?wd=')
      }else{
        a.splice(0, 0, 'https://www.baidu.com/s?wd=')
      }
      const q = a.join('')
      return browserTool.invoke(q)
      // const res = await $fetch(`https://www.baidu.com/s?wd=${query}`, {
      //   headers: {
      //     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      //     'Referer': 'https://www.baidu.com/baidu.html?from=noscript',
      //   },
      // });
      // // const text = await res.text();
      // return res as string;
    },
  })
}

import { PuppeteerWebBaseLoader } from "langchain/document_loaders/web/puppeteer";

export function createPuppeteerWebTool(){
  return new DynamicTool({
    name: "puppeteer_web_search",
    description: `在您需要读取动态网页的内容时很有用。输入为一个有效的带协议的 http URL。`,
    func: async (query: string) => {
      const loader = new PuppeteerWebBaseLoader(query);
      const docs = await loader.load();
      return docs.reduce((acc, doc) => {
        acc += doc.pageContent;
        return acc;
      }, "")
    },
  })
}