FROM node:22-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g corepack@latest
RUN corepack enable && corepack prepare pnpm@10 --activate
RUN pnpm install --frozen-lockfile

COPY src ./src

RUN apk add python3 ffmpeg
ADD https://github.com/yt-dlp/yt-dlp-nightly-builds/releases/latest/download/yt-dlp /bin/yt-dlp
RUN chmod +x /bin/yt-dlp

EXPOSE ${TELEGRAM_WEBHOOK_PORT}

CMD ["npm", "start"]