import type { ExtendedContext } from "../types"
import type Downloader from "./downloader"
import type Notifier from "./notify"
import type { Telegraf } from "telegraf"
import type { GalleryDLOutput } from "/$/GalleryDL"

import execa from "execa"
import { filenameify, removeHashtags } from "./util"
import strings from "./strings"
import { INSTAGRAM_TV_REGEX, MAX_FILENAME_LENGTH } from "./constants"

import { logger } from "./util"
const log = logger("instagram")

const INSTAGRAM_USERNAME = process.env.INSTAGRAM_USERNAME ?? ""
const INSTAGRAM_PASSWORD = process.env.INSTAGRAM_PASSWORD ?? ""
const isLoggedIn = INSTAGRAM_USERNAME && INSTAGRAM_PASSWORD
if (isLoggedIn) log("instagram logged in")

const login = ["-u", INSTAGRAM_USERNAME, "-p", INSTAGRAM_PASSWORD]

const getFormats = (data: GalleryDLOutput[]) => {
  const videos: string[] = []
  const images: string[] = []
  const mediaObjects = data.filter(item => item[0] === 3)
  const [maybeMetadata] = data.filter(item => item[0] === 2)
  const metadata = maybeMetadata[1]
  if (!metadata || typeof metadata === "string") throw "could not parse metadata"

  for (const [, , obj] of mediaObjects) {
    if (obj?.video_url) videos.push(obj.video_url)
    else if (obj?.display_url) images.push(obj.display_url)
  }

  if (videos.length === 0 && images.length === 0) throw "no downloadable media found"

  return { videos, images, metadata }
}

export default async (
  ctx: ExtendedContext,
  bot: Telegraf<ExtendedContext>,
  downloader: Downloader,
  notifier: Notifier,
  galleryDLPath: string
) => {
  const reply = await ctx.replyWithHTML(strings.downloading("from instagram"))
  const url = downloader.filterURL(ctx.instagram ?? "")
  if (!url) throw "no instagram url found"

  const isIGTV = INSTAGRAM_TV_REGEX.test(url)

  try {
    // TODO: update @resync/yt-dl to support logging in
    if (isIGTV) {
      const download = await downloader.any(url)
      const [format] = download.formats
      const description = removeHashtags(download.videoDetails.description ?? "")
      const filename = filenameify(description).slice(0, MAX_FILENAME_LENGTH)

      if (!format) throw "no downloadable format found"

      const file = { url: format.url, filename }
      log(file)

      ctx.replyWithVideo(file, {
        caption: description,
        reply_to_message_id: ctx.message?.message_id,
        supports_streaming: true,
      })
    } else {
      let args = ["-g", url]

      if (isLoggedIn) args = ["-j", ...login, url]

      const { stdout, stderr } = await execa(galleryDLPath, args)
      log(stdout, stderr)

      const parsed = JSON.parse(stdout) as GalleryDLOutput[]
      const formats = getFormats(parsed)
      const description = removeHashtags(formats.metadata.description)
      const filename = filenameify(description).slice(0, MAX_FILENAME_LENGTH)

      for (const video of formats.videos) {
        const file = { url: video, filename }
        ctx.replyWithVideo(file, {
          reply_to_message_id: ctx.message?.message_id,
          supports_streaming: true,
        })
      }

      for (const image of formats.images) {
        const file = { url: image, filename }
        ctx.replyWithPhoto(file, {
          reply_to_message_id: ctx.message?.message_id,
        })
      }
    }
  } catch (error: any) {
    log(error)
    notifier.error(error)
    ctx.reply(strings.error(), { disable_web_page_preview: true })
  } finally {
    bot.telegram.deleteMessage(reply.chat.id, reply.message_id)
  }
}
