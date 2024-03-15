# 定义参数
ARG NODE_VERSION=20.11.1

# 基于镜像node版本
# FROM node:20.11.1
# FROM node:20.11.1-slim
FROM node:${NODE_VERSION}

# 设置环境变量
# ENV NODE_ENV=production

WORKDIR /app

# 复制依赖文件
# COPY pnpm-lock.yaml package.json ./

# 容器内运行命令
# RUN npm i -g pnpm
# RUN pnpm i

# 复制当前目录到容器内
COPY . .

# RUN pnpm prisma generate
# RUN pnpm build

# 暴露端口3000
EXPOSE 3000

# 运行程序
CMD ["node", ".output/server/index.mjs"]