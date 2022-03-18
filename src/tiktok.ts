import type { ExtendedContext } from "../types"
import type Downloader from "./downloader"
import type Notifier from "./notify"
import type { Telegraf } from "telegraf"

import { filenameify, removeHashtags } from "./util"
import strings from "./strings"
import { MAX_FILENAME_LENGTH } from "./constants"

import { logger } from "./util"
const log = logger("tiktok")

export default async (
  ctx: ExtendedContext,
  bot: Telegraf<ExtendedContext>,
  downloader: Downloader,
  notifier: Notifier
) => {
  const reply = await ctx.replyWithHTML(strings.downloading("from tiktok"))

  try {
    const download = await downloader.any(ctx.tiktok ?? "")
    const format = download.formats.find(format => format.format_note === "Direct video")
    const description = removeHashtags(download.videoDetails.description ?? "")
    const filename = filenameify(description).slice(0, MAX_FILENAME_LENGTH)

    if (!format) throw Error("no downloadable format found")

    const { url } = format
    const file = { url, filename }

    log(file)

    ctx.replyWithVideo(file, {
      caption: description,
      reply_to_message_id: ctx.message?.message_id,
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
