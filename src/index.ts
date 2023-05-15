import { Bot } from "grammy"
import { Menu } from "@grammyjs/menu"

if (!process.env.BOT_TOKEN) throw new Error("BOT_TOKEN is not set")

const bot = new Bot(process.env.BOT_TOKEN)

const wait = (t: number): Promise<void> => new Promise(r => setTimeout(r, t))
const downloads = new Map<number, string>()

const menu = new Menu("audio-video-selector")
  .text("video", ctx => {
    const messageID = ctx.callbackQuery.message?.message_id
    if (downloads.has(messageID ?? -1)) {
      return ctx.reply(downloads.get(messageID ?? -1) ?? "no url")
    }
    return ctx.reply(messageID?.toString() ?? "no original message")
  })
  .row()
  .text("audio", ctx => {
    const messageID = ctx.callbackQuery.message?.message_id
    if (downloads.has(messageID ?? -1)) {
      return ctx.reply(downloads.get(messageID ?? -1) ?? "no url")
    }
    return ctx.reply(messageID?.toString() ?? "no original message")
  })

bot.use(menu)

bot.command("start", ctx => ctx.reply(ctx.me.username))
bot.on("::url", async ctx => {
  const initialResponse = await ctx.reply(
    "Processing...\n\nSelect your desired format below",
    { reply_markup: menu }
  )
  const url = ctx.message?.text
  if (!url) return ctx.reply("No url found in message")

  downloads.set(initialResponse.message_id, url)

  await wait(1e3)
  await ctx.api.editMessageText(
    ctx.chat.id,
    initialResponse.message_id,
    "Done!\n\nSelect your desired format below",
    { reply_markup: menu }
  )
})

console.log("Hello, world!")
console.log(process.env.BOT_TOKEN)

bot.start()
