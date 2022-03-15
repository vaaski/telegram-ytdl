import type { ExtraEditMessageText, ExtraReplyMessage } from "telegraf/typings/telegram-types"
import type { ExtendedContext } from "../types"

import debug from "debug"
import { Telegraf } from "telegraf"

import setup from "./setup"
import { AUDIO_VIDEO_KEYBOARD, YOUTUBE_REGEX, TIKTOK_REGEX } from "./constants"
import strings from "./strings"
import Downloader from "./downloader"
import actionHandler from "./actionHandler"
import { filenameify, removeHashtags } from "./util"
import Notifier from "./notify"

!(async () => {
  const log = debug("telegram-ytdl")
  const BOT_TOKEN = await setup()

  const bot = new Telegraf<ExtendedContext>(BOT_TOKEN)
  const downloader = new Downloader(log)
  const notifier = new Notifier(bot)

  //? initial filter and provide the name to the ctx
  bot.use(async (ctx, next) => {
    if (ctx.from?.is_bot) return

    const name = `@${ctx.from?.username}` || `${ctx.from?.first_name} ${ctx.from?.last_name}`
    ctx.name = name

    next()
  })

  //? handle the initial /start command
  bot.command("start", ctx => {
    ctx.replyWithHTML(strings.start(ctx.name))
  })
  bot.telegram.setMyCommands([{ command: "start", description: strings.startDescription() }])

  //? extend the context
  bot.on("text", async (ctx, next) => {
    const text = ctx.message?.text
    const messageLog = `[${ctx.name}](${ctx.message?.message_id}) ${text}`
    log(messageLog)

    const youtube = YOUTUBE_REGEX.exec(text)?.[1] || ""
    if (youtube) {
      ctx.youtube = text
      return next()
    }

    const tiktok = TIKTOK_REGEX.test(text)
    if (tiktok) {
      ctx.tiktok = text
      if (ctx.tiktok) return next()
    }

    if (ctx.chat.type !== "private") return

    notifier.unsupported(messageLog)
    return ctx.replyWithHTML(strings.unsupported())
  })

  //? initial reply
  bot.on("text", async ctx => {
    if (ctx.youtube) {
      const extra: ExtraReplyMessage & ExtraEditMessageText = {
        reply_markup: AUDIO_VIDEO_KEYBOARD,
      }

      ctx.replyWithHTML(strings.formatSelection(), {
        ...extra,
        reply_to_message_id: ctx.message.message_id,
      })
      try {
        await downloader.youtube(ctx.youtube)
      } catch (error: any) {
        log(error)
        notifier.error(error)
        ctx.reply(strings.error(), { disable_web_page_preview: true })
      }
    }

    if (ctx.tiktok) {
      const reply = await ctx.replyWithHTML(strings.downloading("from tiktok"))

      try {
        const download = await downloader.any(ctx.tiktok)
        const format = download.formats.find(format => format.format_note === "Direct video")
        const description = removeHashtags(download.videoDetails.description ?? "")
        const filename = filenameify(description)

        if (!format) throw Error("no downloadable format found")

        const { url } = format
        const file = { url, filename }

        log(file)

        ctx.replyWithVideo(file, {
          caption: description,
          reply_to_message_id: ctx.message.message_id,
          supports_streaming: true,
        })
      } catch (error: any) {
        log(error)
        notifier.error(error)
        ctx.reply(strings.error(), { disable_web_page_preview: true })
      } finally {
        bot.telegram.deleteMessage(reply.chat.id, reply.message_id)
      }
    }
  })

  actionHandler(bot, downloader, log.extend("actionHandler"))

  await bot.launch()
  console.log("bot launched")
})()
