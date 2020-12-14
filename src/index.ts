import { Telegraf, Markup } from "telegraf"
import strings from "./strings"
import * as execa from "execa"
import { join } from "path"
import { FormatsEntity, YoutubeDL } from "./youtube-dl"
import { URL } from "url"
import setup from "./setup"

!(async () => {
  await setup()

  const tg = new Telegraf(process.env.BOT_TOKEN)

  const youtubeRegex = /(?:.*?)(?:^|\/|v=)([a-z0-9_-]{11})(?:.*)?/i
  const audioVideoSelector = Markup.inlineKeyboard([
    Markup.callbackButton("audio", "audio"),
    Markup.callbackButton("video", "video"),
  ]).extra()
  const ytdl = async (src: string): Promise<YoutubeDL> => {
    const { stdout } = await execa(join(__dirname, "../youtube-dl"), ["-j", src])
    return JSON.parse(stdout)
  }

  const filterFormats = ({ formats, title }: YoutubeDL) => {
    const video = formats
      .filter(({ vcodec, acodec }) => vcodec !== "none" && acodec !== "none")
      .reverse()[0]
    const audio = formats
      .filter(({ vcodec, acodec }) => vcodec === "none" && acodec !== "none")
      .reverse()[0]
    const expire = Number(new URL(video.url).searchParams.get("expire")) * 1e3

    return { video, audio, expire, title }
  }
  const filename = (str: string) => str.replace(/[^a-z0-9]/gi, "_").toLowerCase()

  interface CachedDownloads {
    [key: string]: { video: FormatsEntity; audio: FormatsEntity; expire: number; title: string }
  }
  const cachedDownloads: CachedDownloads = {}

  tg.use(async (ctx, next) => {
    const start = +new Date()
    await next()
    const ms = +new Date() - start
    console.log(`[@${ctx.chat.username}] response time: ${ms}ms`)
  })

  tg.start(({ reply, chat }) => {
    reply(strings.start(chat.username))
  })

  tg.hears(youtubeRegex, async ({ reply, message }, next) => {
    const videoID = youtubeRegex.exec(message.text)[1]
    let initialReply = videoID
    if (cachedDownloads[videoID]) initialReply = cachedDownloads[videoID].title

    const { message_id, chat } = await reply(strings.formatSelection(initialReply), {
      ...audioVideoSelector,
      reply_to_message_id: message.message_id,
    })

    if (!cachedDownloads[videoID] || cachedDownloads[videoID].expire < +Date.now()) {
      const ytdlResult = await ytdl(videoID)
      cachedDownloads[videoID] = filterFormats(ytdlResult)
    }

    if (initialReply === videoID)
      tg.telegram.editMessageText(
        chat.id,
        message_id,
        null,
        strings.formatSelection(cachedDownloads[videoID].title),
        audioVideoSelector,
      )
    next()
  })

  tg.action(
    ["video", "audio"],
    async ({ callbackQuery, answerCbQuery, replyWithAudio, replyWithVideo, reply }, next) => {
      const type: "video" | "audio" = callbackQuery.data as "video" | "audio"
      answerCbQuery(strings.downloading(type))

      const videoID = youtubeRegex.exec(callbackQuery.message.reply_to_message.text)[1]

      if (!cachedDownloads[videoID] || cachedDownloads[videoID].expire < +Date.now()) {
        const ytdlResult = await ytdl(videoID)
        cachedDownloads[videoID] = filterFormats(ytdlResult)
      }

      try {
        if (type === "video")
          await replyWithVideo(
            {
              url: cachedDownloads[videoID][type].url,
              filename: filename(cachedDownloads[videoID].title),
            },
            {
              caption: cachedDownloads[videoID].title,
              reply_to_message_id: callbackQuery.message.reply_to_message.message_id,
              supports_streaming: true,
            },
          )
        if (type === "audio")
          await replyWithAudio(
            {
              url: cachedDownloads[videoID][type].url,
              filename: filename(cachedDownloads[videoID].title),
            },
            {
              reply_to_message_id: callbackQuery.message.reply_to_message.message_id,
            },
          )
      } catch (err) {
        reply(
          strings.uploadFailed(
            cachedDownloads[videoID][type].url,
            new Date(cachedDownloads[videoID].expire).toLocaleString(),
          ),
          {
            parse_mode: "Markdown",
            reply_to_message_id: callbackQuery.message.reply_to_message.message_id,
          },
        )
      }

      tg.telegram.deleteMessage(callbackQuery.message.chat.id, callbackQuery.message.message_id)

      next()
    },
  )

  await tg.launch()
  console.log("telegram-ytdl bot running")

  // Enable graceful stop
  process.once("SIGINT", () => tg.stop("SIGINT" as any))
  process.once("SIGTERM", () => tg.stop("SIGTERM" as any))
})()
