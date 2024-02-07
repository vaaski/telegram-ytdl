import type { ParseModeFlavor } from "@grammyjs/parse-mode"

import { Bot, Context } from "grammy"
import { hydrateReply } from "@grammyjs/parse-mode"

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
if (!TELEGRAM_BOT_TOKEN) throw new Error("TELEGRAM_BOT_TOKEN is missing")

const TELEGRAM_API_ROOT = process.env.TELEGRAM_API_ROOT ?? "http://127.0.0.1:8081"
if (!TELEGRAM_API_ROOT) throw new Error("TELEGRAM_API_ROOT is missing")

export const bot = new Bot<ParseModeFlavor<Context>>(TELEGRAM_BOT_TOKEN, {
  client: { apiRoot: TELEGRAM_API_ROOT },
  botInfo: undefined,
})

bot.use(hydrateReply)
