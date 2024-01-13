import type { ExtraEditMessageText, ExtraReplyMessage } from "telegraf/typings/telegram-types"
import type { ExtendedContext } from "../types"

import debug from "debug"
import { Telegraf } from "telegraf"

import {
  AUDIO_VIDEO_KEYBOARD,
  YOUTUBE_REGEX,
  TIKTOK_REGEX,
  INSTAGRAM_REGEX,
} from "./constants"
import setup from "./setup"
import strings from "./strings"
import Downloader from "./downloader"
import actionHandler from "./actionHandler"
import Notifier from "./notify"
import tiktok from "./tiktok"
import instagram from "./instagram"

!(async () => {
  const log = debug("telegram-ytdl")
  const { BOT_TOKEN, galleryDLPath } = await setup()

  const bot = new Telegraf<ExtendedContext>(BOT_TOKEN)
  const downloader = new Downloader(log)
  const notifier = new Notifier(bot)

  //? initial filter and provide the name to the ctx
  bot.use(async (ctx, next) => {
    if (ctx.from?.is_bot) return

    const username = ctx.from?.username ?? ""
    const first_name = ctx.from?.first_name ?? ""
    const last_name = ctx.from?.last_name ?? ""

    let name = `@${username} - ${first_name} ${last_name}`
    name = `<a href="tg://user?id=${ctx.from?.id}">🔗</a> ${name}`

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

    const youtube = YOUTUBE_REGEX.exec(text)?.[1] ?? ""
    if (youtube) {
      ctx.youtube = text
      return next()
    }

    const tiktok = TIKTOK_REGEX.test(text)
    if (tiktok) {
      ctx.tiktok = text
      if (ctx.tiktok) return next()
    }

    const instagram = INSTAGRAM_REGEX.test(text)
    if (instagram) {
      ctx.instagram = text
      if (ctx.instagram) return next()
    }

    if (ctx.chat.type !== "private") return

    notifier.unsupported(messageLog)
    return ctx.replyWithHTML(strings.unsupported())
  })

  //? initial reply
  bot.on("text", async ctx => {
    notifier.notify(`${ctx.name} ${ctx.message?.text}`)

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

    if (ctx.tiktok) tiktok(ctx, bot, downloader, notifier)
    if (ctx.instagram) instagram(ctx, bot, downloader, notifier, galleryDLPath)
  })

  actionHandler(bot, downloader, log.extend("actionHandler"))

  await bot.launch()
  console.log("bot launched")
})()
