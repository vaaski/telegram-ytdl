import { Bot } from "grammy"

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
if (!TELEGRAM_BOT_TOKEN) throw new Error("TELEGRAM_BOT_TOKEN is missing")

const bot = new Bot(TELEGRAM_BOT_TOKEN)

bot.on("message", (ctx) => ctx.reply("Hi there!"))

bot.start()
