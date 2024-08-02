# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## 安装 Setup

建议使用 pnpm
```bash
# pnpm 安装：
npm install -g pnpm
```

安装项目所有依赖项
Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install # 或 pnpm i

# yarn
yarn install

# bun
bun install
```

## VSCode Server Debug

Debug 中运行 server: nuxt 配置即可。

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

# 外部服务依赖

后端 langserve 依赖了 unstructured 的 docker。
只有某些导入文件的方法需要，正常运行不用。

搭建见：
https://unstructured-io.github.io/unstructured/installation/docker.html

# TODO:

docx 加载分割的时候区分不了标题，导致回答有些问题时传入的文档包含了其他内容，回答到了不相关的东西。

# ROADMAP

**通用**
* [x] 流式响应
* [x] 中间步骤显示
* [x] 支持图片识别
* [x] 聊天模型切换
* [x] 知识库集合切换 2024-08-01
* [ ] 快速部署
* [ ] 嵌入模型切换 / 知识库切换
* [ ] 模型切换后隐藏/报错不支持的功能，如部分模型不支持视觉识别
* [ ] 企业微信集成

**前端**
- [ ] 存储配置信息
- [ ] 存储聊天记录？

**UX**
- [ ] 长聊天滚动条固定到底部

**python langserve**
- [ ] 带默认环境变量的 OllamaChat 的实现
- [ ] OllamaChat 的视觉识别
- [ ] Ollama 函数调用

**业务**
- [x] 自建的嵌入模型
- [ ] 向量存储快速更新文件
- [ ] 文件翻译
- [ ] 流程制度的问答?


所有 chain 调用均无状态，不存储/读取数据。
数据可以存到本地/数据库，给 chain 调用时再读取数据。
权限也是，可以做拦截器，chain 执行前判断。
