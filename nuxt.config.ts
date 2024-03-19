// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@nuxtjs/i18n',
  ],
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
