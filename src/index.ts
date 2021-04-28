import debug from "debug"
import { Telegraf } from "telegraf"

import setup from "./setup"
import { AUDIO_VIDEO_KEYBOARD, YOUTUBE_REGEX, TIKTOK_REGEX, URL_REGEX } from "./constants"
import strings from "./strings"
import Downloader from "./downloader"

import type { ExtraEditMessageText, ExtraReplyMessage } from "telegraf/typings/telegram-types"
import type { ExtendedContext } from "../types"
import actionHandler from "./actionHandler"

!(async () => {
  const log = debug("telegram-ytdl")
  const BOT_TOKEN = await setup()

  const bot = new Telegraf<ExtendedContext>(BOT_TOKEN)
  const downloader = new Downloader(log)

  //? initial filter and provide the name to the ctx
  bot.use(async (ctx, next) => {
    if (ctx.from?.is_bot) return

    const name = `@${ctx.from?.username}` || `${ctx.from?.first_name} ${ctx.from?.last_name}`
    ctx.name = name

    next()
  })

  //? extend the context
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
      await downloader.youtube(ctx.youtube)
    }

    if (ctx.tiktok) {
      ctx.replyWithHTML(strings.downloading("from tiktok"))
    }
  })

  actionHandler(bot, downloader, log.extend("actionHandler"))

  bot.command("start", ctx => {
    ctx.replyWithHTML(strings.start(ctx.name))
  })
  bot.telegram.setMyCommands([{ command: "start", description: strings.startDescription() }])

  await bot.launch()
  console.log("bot launched")
})()
