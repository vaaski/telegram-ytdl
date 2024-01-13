import type { ParseModeFlavor } from "@grammyjs/parse-mode"

import { Bot, Context } from "grammy"
import { hydrateReply } from "@grammyjs/parse-mode"

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
if (!TELEGRAM_BOT_TOKEN) throw new Error("TELEGRAM_BOT_TOKEN is missing")

export const bot = new Bot<ParseModeFlavor<Context>>(TELEGRAM_BOT_TOKEN)

bot.use(hydrateReply)
