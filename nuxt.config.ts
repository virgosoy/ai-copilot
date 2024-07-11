// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@nuxtjs/i18n',
  ],
  runtimeConfig: {
    openaiApiKey: process.env.OPENAI_API_KEY,
    openaiBaseUrl: process.env.OPENAI_BASE_URL,
    ollamaBaseUrl: process.env.OLLAMA_BASE_URL,
    langserveBaseUrl: process.env.LANGSERVE_BASE_URL,
  },
  ui: {
    icons: [
      // 'heroicons', 
      'carbon',
    ],
  },
  i18n: {
    locales: [{
      code: 'zh-CN',
      file: 'zh-CN.json',
    },{
      code: 'en',
      file: 'en.json',
    }],
    defaultLocale: 'zh-CN',
    lazy: true, // 使用延迟加载翻译
    langDir: 'locales', // 翻译文件夹目录
    // no_prefix 路由策略
    strategy: 'no_prefix',
  },
})
