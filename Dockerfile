# 定义参数
ARG NODE_VERSION=20.11.1

# 基于镜像node版本
# FROM node:20.11.1
# FROM node:20.11.1-slim
FROM node:${NODE_VERSION}-slim

# 设置环境变量
# ENV NODE_ENV=production

# 在Dockerfile 中设置工作目录，以便为随后的 ADD、COPY、CMD、ENTRYPOINT 或 RUN 指令指定一个工作目录。
WORKDIR /app

# 复制依赖文件（前者相对当前目录，后者相对于工作目录）
COPY pnpm-lock.yaml package.json ./

# 容器内运行命令（相对于工作目录）
RUN npm i -g pnpm
RUN pnpm i

# 复制当前目录到容器内（前者相对当前目录，后者相对于工作目录）
COPY . .

# RUN pnpm prisma generate
RUN pnpm build

# 暴露端口3000
EXPOSE 3000

# 运行程序（相对于工作目录）
CMD ["node", ".output/server/index.mjs"]