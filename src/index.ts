import { Telegraf, Markup } from "telegraf"
import strings from "./strings"
import { FormatsEntity } from "./youtube-dl.d"
import type * as ytdl from "ytdl-core"
import setup from "./setup"
import youtubeDL from "./youtube-dl"
import ytdlCore from "./ytdl-core"
import chalk from "chalk"
import got from "got"

!(async () => {
  const token = process.env.BOT_TOKEN || process.argv[2]

  const isDev = Boolean(process.env.DEV_LOG)
  const log = (...t: any[]) =>
    isDev ? console.log(...t.map(a => (typeof a === "string" ? chalk.gray(a) : a))) : null

  await setup()

  const tg = new Telegraf(token)

  const youtubeRegex = /(?:youtube|youtu.be)+(?:.*?)(?:^|\/|v=)([a-z0-9_-]{11})(?:.*)?/i
  const tiktokRegex = /tiktok\.com/i
  const urlRegex = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])?/

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

  tg.use(async ({ message, chat, callbackQuery, reply }, next) => {
    if (callbackQuery) return await next()
    const name = `@${chat?.username}` || `${chat?.first_name} ${chat?.last_name}`
    console.log(`[${name}](${message?.message_id}) ${message?.text}`)

    const text = message?.text || ""
    log(tiktokRegex.test(text))
    if (!youtubeRegex.test(text) && !tiktokRegex.test(text))
      reply(strings.unsupported(urlRegex.exec(text)?.[2] || text))
    await next()
  })

  tg.start(({ reply, chat }) => {
    reply(strings.start(chat?.username || ""))
  })

  tg.hears(youtubeRegex, async ({ reply, message }, next) => {
    try {
      if (!message || !message.text) return

      let videoID: string = youtubeRegex.exec(message.text)?.[1] || ""

      let initialReply = videoID
      if (cachedDownloads[videoID]) initialReply = cachedDownloads[videoID].title || ""

      const { message_id, chat } = await reply(strings.formatSelection(initialReply), {
        ...audioVideoSelector,
        reply_to_message_id: message.message_id,
      })

      if (
        !cachedDownloads[videoID] ||
        Number(cachedDownloads[videoID].expire) < +Date.now()
      ) {
        log("not cached, downloading.")
        cachedDownloads[videoID] = { loading: true }
        const start = +new Date()

        ytdlCore.getFormats(videoID).then(formats => {
          console.log(
            `[@${chat.username}](${message?.message_id}) ytdl-core took ${
              +new Date() - start
            }ms to get video info`
          )
          if (initialReply === videoID && !cachedDownloads[videoID].onload) {
            log("user didn't select format yet.")
            tg.telegram.editMessageText(
              chat.id,
              message_id,
              "",
              strings.formatSelection(formats.title),
              audioVideoSelector
            )
          } else if (typeof cachedDownloads[videoID].onload === "function") {
            log("user already selected format, resolving waiting promise.")
            const cached = cachedDownloads[videoID]
            if (cached.onload) cached.onload(formats)
          }

          cachedDownloads[videoID] = formats
        })
      }

      await next()
    } catch (err) {
      log("hears err", err)
    }
  })

  tg.hears(tiktokRegex, async ({ message, reply, replyWithVideo }) => {
    try {
      if (!message?.text) throw new Error("error parsing message")

      const url = new URL(message.text)
      const download = url.toString()
      const response = await reply(strings.downloading(`from ${url.hostname}`))

      const info = await youtubeDL.info(download)
      const format = info.formats?.[0]
      if (!format) throw new Error("no downloadable format found")
      const removeHashtags = (str: string) =>
        str.replace(/#\w+/g, "").replace(/\s{2,}/g, "")

      const video = got.stream(format.url, {
        headers: { ...format.http_headers },
      })

      await replyWithVideo(
        {
          source: video,
          filename: filename(removeHashtags(info.description)),
        },
        {
          caption: removeHashtags(info.description),
          reply_to_message_id: message.message_id,
          supports_streaming: true,
        }
      )
      await tg.telegram.deleteMessage(response.chat.id, response.message_id)
    } catch (err) {
      console.log(err)
      reply(`couldn't download, ${err}`)
    }
  })

  tg.action(
    ["video", "audio"],
    async (
      { callbackQuery, answerCbQuery, replyWithAudio, replyWithVideo, reply },
      next
    ) => {
      try {
        const type: "video" | "audio" = callbackQuery?.data as "video" | "audio"
        const replyTo = callbackQuery?.message?.reply_to_message
        if (!replyTo) throw new Error("no replyTo message")

        const videoID = youtubeRegex.exec(replyTo.text || "")?.[1] || ""
        answerCbQuery(strings.downloading(type))
        const { chat, message_id } = replyTo

        tg.telegram.editMessageText(
          callbackQuery?.message?.chat.id,
          callbackQuery?.message?.message_id,
          "",
          strings.downloading(type)
        )

        if (
          !cachedDownloads[videoID] ||
          !cachedDownloads[videoID].title ||
          Number(cachedDownloads[videoID].expire) < +Date.now()
        ) {
          if (cachedDownloads[videoID]?.loading) {
            log("video already loading, waiting..")
            await new Promise(res => {
              cachedDownloads[videoID].onload = res
            })
            log("done waiting.")
          } else {
            log(
              `[@${chat.username}](${message_id}) https://youtu.be/${videoID} not downloading, starting new dl`
            )
            cachedDownloads[videoID] = await ytdlCore.getFormats(videoID)
            log(`done downloading ${videoID}.`)
          }
        }

        const dl = cachedDownloads[videoID]
        try {
          if (type === "video") {
            await replyWithVideo(
              {
                url: dl?.[type]?.url || "",
                filename: filename(dl.title || ""),
              },
              {
                caption: dl.title,
                reply_to_message_id: replyTo.message_id,
                supports_streaming: true,
              }
            )
          } else if (type === "audio") {
            await replyWithAudio(
              {
                url: dl?.[type]?.url || "",
                filename: `${filename(dl.title || "")}.mp3`,
              },
              {
                reply_to_message_id: replyTo.message_id,
              }
            )
          }
        } catch (err) {
          reply(
            strings.uploadFailed(
              dl?.[type]?.url || "",
              new Date(dl?.expire || 0).toLocaleString()
            ),
            {
              parse_mode: "Markdown",
              reply_to_message_id: replyTo.message_id,
            }
          )
        }

        tg.telegram.deleteMessage(
          callbackQuery?.message?.chat.id || "",
          callbackQuery?.message?.message_id || 0
        )

        await next()
      } catch (err) {
        log("action err", err)
      }
    }
  )

  await tg.launch()
  console.log("telegram-ytdl bot running")

  // Enable graceful stop
  process.once("SIGINT", () => tg.stop("SIGINT" as any))
  process.once("SIGTERM", () => tg.stop("SIGTERM" as any))
})()
