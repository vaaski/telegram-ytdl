import type { FilteredFormat } from "../types"

import { URL } from "url"
import * as ytdl_core from "ytdl-core"
import { TELEGRAM_BOT_LIMIT } from "./constants"
import { getContentLength } from "./util"

export default class ytdlCore {
  info = async (src: string): Promise<ytdl_core.videoInfo> => await ytdl_core.getInfo(src)

  filterFormats = async ({
    formats,
    videoDetails: { title },
  }: ytdl_core.videoInfo): Promise<FilteredFormat> => {
    const video = formats
      .filter(({ hasVideo, hasAudio }) => hasVideo && hasAudio)
      .sort((a, b) => (b.width || 0) - (a.width || 0))[0]

    const audio = formats
      .filter(
        ({ hasVideo, hasAudio, container }) => !hasVideo && hasAudio && container === "mp4"
      )
      .sort((a, b) => (b.audioBitrate || 0) - (a.audioBitrate || 0))[0]

    const expire = Number(new URL(video.url).searchParams.get("expire")) * 1e3

    // TODO content-length is undefined, make a HEAD request

    return {
      video: {
        ...video,
        overSize: (await getContentLength(video.url)) >= TELEGRAM_BOT_LIMIT,
      },
      audio: {
        ...audio,
        overSize: (await getContentLength(audio.url)) >= TELEGRAM_BOT_LIMIT,
      },
      expire,
      title,
    }
  }

  getFormats = async (src: string): Promise<FilteredFormat> => {
    return this.filterFormats(await this.info(src))
  }
}
