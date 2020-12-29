import { Telegraf, Markup } from "telegraf"
import strings from "./strings"
import { FormatsEntity } from "./youtube-dl-types"
import type * as ytdl from "ytdl-core"
import setup from "./setup"
// import youtubeDL from "./youtube-dl"
import ytdlCore from "./ytdl-core"
import chalk from "chalk"

!(async () => {
  const token = process.env.BOT_TOKEN || process.argv[2]

  const isDev = Boolean(process.env.DEV_LOG)
  const log = (...t: any[]) =>
    isDev ? console.log(...t.map((a) => (typeof a === "string" ? chalk.gray(a) : a))) : null

  await setup()

  const tg = new Telegraf(token)

  const youtubeRegex = /(?:youtube|youtu.be)+(?:.*?)(?:^|\/|v=)([a-z0-9_-]{11})(?:.*)?/i
  const audioVideoSelector = Markup.inlineKeyboard([
    Markup.callbackButton("audio", "audio"),
    Markup.callbackButton("video", "video"),
  ]).extra()

  const filename = (str: string) => str.replace(/[^a-z0-9]/gi, "_").toLowerCase()

  interface CachedDownloads {
    [key: string]: {
      loading?: Function | boolean
      onload?: Function
      video?: FormatsEntity | ytdl.videoFormat
      audio?: FormatsEntity | ytdl.videoFormat
      expire?: number
      title?: string
    }
  }
  const cachedDownloads: CachedDownloads = {}

  tg.use(async ({ message, chat, callbackQuery }, next) => {
    if (callbackQuery) return await next()
    console.log(`[@${chat?.username}](${message?.message_id}) ${message?.text}`)
    await next()
  })

  tg.start(({ reply, chat }) => {
    reply(strings.start(chat?.username))
  })

  tg.hears(youtubeRegex, async ({ reply, message }, next) => {
    try {
      if (!message || !message.text) return

      let videoID: any = youtubeRegex.exec(message.text)
      if (videoID) videoID = videoID[1]

      let initialReply = videoID
      if (cachedDownloads[videoID]) initialReply = cachedDownloads[videoID].title

      const { message_id, chat } = await reply(strings.formatSelection(initialReply), {
        ...audioVideoSelector,
        reply_to_message_id: message.message_id,
      })

      if (!cachedDownloads[videoID] || cachedDownloads[videoID].expire < +Date.now()) {
        log("not cached, downloading.")
        cachedDownloads[videoID] = { loading: true }
        const start = +new Date()

        ytdlCore.getFormats(videoID).then((formats) => {
          console.log(
            `[@${chat.username}](${message?.message_id}) ytdl-core took ${
              +new Date() - start
            }ms to get video info`,
          )
          if (initialReply === videoID && !cachedDownloads[videoID].onload) {
            log("user didn't select format yet.")
            tg.telegram.editMessageText(
              chat.id,
              message_id,
              null,
              strings.formatSelection(formats.title),
              audioVideoSelector,
            )
          } else if (typeof cachedDownloads[videoID].onload === "function") {
            log("user already selected format, resolving waiting promise.")
            cachedDownloads[videoID].onload(formats)
          }

          cachedDownloads[videoID] = formats
        })
      }

      await next()
    } catch (err) {
      log("hears err", err)
    }
  })


  tg.action(
    ["video", "audio"],
    async ({ callbackQuery, answerCbQuery, replyWithAudio, replyWithVideo, reply }, next) => {
      try {
        const type: "video" | "audio" = callbackQuery.data as "video" | "audio"
        const videoID = youtubeRegex.exec(callbackQuery.message.reply_to_message.text)[1]
        answerCbQuery(strings.downloading(type))
        const { chat, message_id } = callbackQuery.message.reply_to_message

        tg.telegram.editMessageText(
          callbackQuery.message.chat.id,
          callbackQuery.message.message_id,
          null,
          strings.downloading(type),
          null,
        )

        if (
          !cachedDownloads[videoID] ||
          !cachedDownloads[videoID].title ||
          cachedDownloads[videoID].expire < +Date.now()
        ) {
          if (cachedDownloads[videoID]?.loading) {
            log("video already loading, waiting..")
            await new Promise((res) => {
              cachedDownloads[videoID].onload = res
            })
            log("done waiting.")
          } else {
            log(
              `[@${chat.username}](${message_id}) https://youtu.be/${videoID} not downloading, starting new dl`,
            )
            cachedDownloads[videoID] = await ytdlCore.getFormats(videoID)
            log(`done downloading ${videoID}.`)
          }
        }

        const dl = cachedDownloads[videoID]
        try {
          if (type === "video")
            await replyWithVideo(
              {
                url: dl[type].url,
                filename: filename(dl.title),
              },
              {
                caption: dl.title,
                reply_to_message_id: callbackQuery.message.reply_to_message.message_id,
                supports_streaming: true,
              },
            )
          if (type === "audio")
            await replyWithAudio(
              {
                url: dl[type].url,
                filename: `${filename(dl.title)}.mp3`,
              },
              {
                reply_to_message_id: callbackQuery.message.reply_to_message.message_id,
              },
            )
        } catch (err) {
          reply(strings.uploadFailed(dl[type].url, new Date(dl.expire).toLocaleString()), {
            parse_mode: "Markdown",
            reply_to_message_id: callbackQuery.message.reply_to_message.message_id,
          })
        }

        tg.telegram.deleteMessage(callbackQuery.message.chat.id, callbackQuery.message.message_id)

        await next()
      } catch (err) {
        log("action err", err)
      }
    },
  )

  await tg.launch()
  console.log("telegram-ytdl bot running")

  // Enable graceful stop
  process.once("SIGINT", () => tg.stop("SIGINT" as any))
  process.once("SIGTERM", () => tg.stop("SIGTERM" as any))
})()
