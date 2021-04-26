import setup from "./setup"
import debug from "debug"
import { Context, Telegraf } from "telegraf"
import { AUDIO_VIDEO_KEYBOARD, YOUTUBE_REGEX, TIKTOK_REGEX, URL_REGEX } from "./constants"
import strings from "./strings"

interface ExtendedContext extends Context {
  name: string
  youtube?: string
  tiktok?: string
}

!(async () => {
  const log = debug("telegram-ytdl")
  const BOT_TOKEN = await setup()

  const bot = new Telegraf<ExtendedContext>(BOT_TOKEN)

  bot.use(async (ctx, next) => {
    const name = `@${ctx.from?.username}` || `${ctx.from?.first_name} ${ctx.from?.last_name}`
    ctx.name = name

    next()
  })

  bot.on("text", async (ctx, next) => {
    const text = ctx.message?.text
    log(`[${ctx.name}](${ctx.message?.message_id}) ${text}`)

    const youtube = YOUTUBE_REGEX.exec(text)?.[1] || ""
    if (youtube) {
      ctx.youtube = youtube
      return next()
    }

    const tiktok = TIKTOK_REGEX.test(text)
    if (tiktok) {
      ctx.tiktok = URL_REGEX.exec(text)?.[0]
      if (ctx.tiktok) return next()
    }

    return ctx.reply(strings.unsupported())
  })

  bot.command("start", ctx => {
    ctx.reply(strings.start(ctx.name), { parse_mode: "HTML" })
  })
  bot.telegram.setMyCommands([{ command: "start", description: strings.startDescription() }])

  bot.on("text", ctx => {
    if (ctx.youtube) {
      ctx.reply(strings.formatSelection(ctx.youtube), { reply_markup: AUDIO_VIDEO_KEYBOARD })
    }

    if (ctx.tiktok) {
      ctx.reply(strings.downloading("from tiktok"))
    }
  })

  await bot.launch()
  console.log("bot launched")
})()
