import type { ParseModeFlavor } from "@grammyjs/parse-mode"

import { hydrateReply } from "@grammyjs/parse-mode"
import express from "express"
import { Bot, Context, webhookCallback } from "grammy"

const PORT = process.env.TELEGRAM_WEBHOOK_PORT
if (!PORT) throw new Error("environment variable TELEGRAM_WEBHOOK_PORT is missing")

const WEBHOOK_URL = process.env.TELEGRAM_WEBHOOK_URL
if (!WEBHOOK_URL) throw new Error("environment variable TELEGRAM_WEBHOOK_URL is missing")

const TELEGRAM_API_ROOT = process.env.TELEGRAM_API_ROOT
if (!TELEGRAM_API_ROOT) throw new Error("environment variable TELEGRAM_API_ROOT is missing")

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
if (!TELEGRAM_BOT_TOKEN) throw new Error("environment variable TELEGRAM_BOT_TOKEN is missing")

export const bot = new Bot<ParseModeFlavor<Context>>(TELEGRAM_BOT_TOKEN, {
  client: { apiRoot: TELEGRAM_API_ROOT },
  botInfo: undefined,
})

bot.use(async (ctx, next) => {
  if (ctx.chat?.type === "private") await next()
  else return
})

bot.use(hydrateReply)

export const server = express()

server.use(express.json())
server.use(webhookCallback(bot, "express"))

console.log(`Starting bot with root ${TELEGRAM_API_ROOT}...`)
server.listen(PORT, async () => {
  await bot.api.setWebhook(WEBHOOK_URL)
  console.log(`Webhook set to ${WEBHOOK_URL}`)

  const me = await bot.api.getMe()
  console.log(`Bot started as @${me.username} on :${PORT}`)
})
