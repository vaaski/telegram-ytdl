FROM node:20-alpine

ARG TELEGRAM_BOT_TOKEN
ARG TELEGRAM_API_ROOT
ARG TELEGRAM_WEBHOOK_PORT
ARG TELEGRAM_WEBHOOK_URL
ARG ADMIN_ID
ARG WHITELISTED_IDS
ARG OPENAI_API_KEY

ENV TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
ENV TELEGRAM_API_ROOT=${TELEGRAM_API_ROOT}
ENV TELEGRAM_WEBHOOK_PORT=${TELEGRAM_WEBHOOK_PORT}
ENV TELEGRAM_WEBHOOK_URL=${TELEGRAM_WEBHOOK_URL}
ENV ADMIN_ID=${ADMIN_ID}
ENV WHITELISTED_IDS=${WHITELISTED_IDS}
ENV OPENAI_API_KEY=${OPENAI_API_KEY}

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --frozen-lockfile

COPY src ./src

RUN apk add python3 ffmpeg
ADD https://github.com/yt-dlp/yt-dlp-nightly-builds/releases/latest/download/yt-dlp /bin/yt-dlp
RUN chmod +x /bin/yt-dlp

EXPOSE ${TELEGRAM_WEBHOOK_PORT}

CMD ["npm", "start"]