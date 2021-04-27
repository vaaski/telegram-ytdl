import setup from "./setup"
import debug from "debug"
import { Context, Telegraf } from "telegraf"
import { AUDIO_VIDEO_KEYBOARD, YOUTUBE_REGEX, TIKTOK_REGEX, URL_REGEX } from "./constants"
import strings from "./strings"
import Downloader from "./downloader"
import { ExtraEditMessageText, ExtraReplyMessage } from "telegraf/typings/telegram-types"
import { CallbackQuery } from "typegram"

interface ExtendedContext extends Context {
  name: string
  youtube?: string
  tiktok?: string
}

const filenameify = (str: string) => str.replace(/[^a-z0-9]/gi, "_").toLowerCase()

!(async () => {
  const log = debug("telegram-ytdl")
  const BOT_TOKEN = await setup()

  const bot = new Telegraf<ExtendedContext>(BOT_TOKEN)
  const downloader = new Downloader(log)

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

  bot.on("text", async ctx => {
    if (ctx.youtube) {
      const extra: ExtraReplyMessage & ExtraEditMessageText = {
        reply_markup: AUDIO_VIDEO_KEYBOARD,
        parse_mode: "HTML",
      }

      ctx.reply(strings.formatSelection(), {
        ...extra,
        reply_to_message_id: ctx.message.message_id,
      })
      await downloader.youtube(ctx.youtube)
    }

    if (ctx.tiktok) {
      ctx.reply(strings.downloading("from tiktok"))
    }
  })

  const getCallbackReplyToText = (callbackQuery: CallbackQuery): string | undefined => {
    // @ts-expect-error the types seem to be bad
    return callbackQuery.message?.reply_to_message?.text as string | undefined
  }

  const actionHandler = (type: "audio" | "video") => async (ctx: Context) => {
    if (!ctx.callbackQuery) throw Error("no callbackQuery found")

    const text = getCallbackReplyToText(ctx.callbackQuery)
    if (!text) throw Error("no text in callbackQuery reply-to message")

    const { message } = ctx.callbackQuery
    if (!message?.chat.id || !message?.message_id) throw Error("message has no ids")

    ctx.answerCbQuery(strings.downloading(`as ${type}`))
    bot.telegram.deleteMessage(message.chat.id, message.message_id)

    const media = await downloader.youtube(text)

    if (media[type].overSize) {
      log(`${type} is too large`)
      return ctx.reply(strings.overSize(type, media[type].url))
    }

    if (type === "video") {
      ctx.replyWithVideo(
        {
          url: media.video.url,
          filename: filenameify(media.title),
        },
        {
          caption: media.title,
          supports_streaming: true,
        }
      )
    }
  }

  bot.action("audio", actionHandler("audio"))
  bot.action("video", actionHandler("video"))

  bot.command("start", ctx => {
    ctx.reply(strings.start(ctx.name), { parse_mode: "HTML" })
  })
  bot.telegram.setMyCommands([{ command: "start", description: strings.startDescription() }])

  await bot.launch()
  console.log("bot launched")
})()
