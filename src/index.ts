import { webhookCallback } from "grammy"
import { bot } from "./bot"
import { bold } from "./textutil"
import express from "express"

const PORT = process.env.TELEGRAM_WEBHOOK_PORT ?? 3000
if (!PORT) throw new Error("TELEGRAM_WEBHOOK_PORT is missing")

const WEBHOOK_URL = process.env.TELEGRAM_WEBHOOK_URL ?? ""
if (!WEBHOOK_URL) throw new Error("TELEGRAM_WEBHOOK_URL is missing")

const TELEGRAM_API_ROOT = process.env.TELEGRAM_API_ROOT ?? "http://127.0.0.1:8081"
if (!TELEGRAM_API_ROOT) throw new Error("TELEGRAM_API_ROOT is missing")

const app = express()
app.use(express.json())

app.use(webhookCallback(bot, "express"))

bot.use(async (ctx, next) => {
  if (ctx.chat?.type === "private") await next()
  else return
})

bot.on("message:text", async (ctx) => {
  await ctx.replyWithHTML(
    [
      bold("The Bot is currently down for maintenance."),
      "",
      "In the meantime, I recommend checking out yt-dlp, the command line tool that powers this bot.",
      "github.com/yt-dlp/yt-dlp",
    ].join("\n"),
    {
      link_preview_options: { is_disabled: true },
    }
  )
})

console.log(`Starting bot with root ${TELEGRAM_API_ROOT}...`)
app.listen(PORT, async () => {
  await bot.api.setWebhook(WEBHOOK_URL)
  console.log(`Webhook set to ${WEBHOOK_URL}`)

  const me = await bot.api.getMe()
  console.log(`Bot started as @${me.username} on :${PORT}`)
})
