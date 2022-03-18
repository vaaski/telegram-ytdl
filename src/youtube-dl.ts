import type { VideoInfo } from "@resync-tv/yt-dl/types"
import type { FilteredFormat } from "../types"
import type { yt_dl } from "@resync-tv/yt-dl"

import { URL } from "url"

import { TELEGRAM_BOT_LIMIT } from "./constants"

import YT_DL, { adapters, ensureBinaries } from "@resync-tv/yt-dl"
import { once } from "./util"

import { logger } from "./util"
const log = logger("youtube-dl")

const ytdlpAdapter = new adapters.ytdlp()
const ytdl = new YT_DL([ytdlpAdapter.getInfo], "fallback")

const ensureBinariesOnce = once(() => {
  log("ensuring binaries")
  return ensureBinaries(true)
})

export default class youtubeDL {
  info = async (src: string): Promise<yt_dl.VideoInfo> => {
    ensureBinariesOnce()
    return await ytdl.getInfo(src)
  }

  filterFormats = (videoInfo: VideoInfo): FilteredFormat => {
    const { formats, videoDetails } = videoInfo
    if (!formats) throw new Error("no formats found")

    const [video] = formats.filter(({ hasVideo, hasAudio }) => hasVideo && hasAudio).reverse()
    const [audio] = formats.filter(({ hasVideo, hasAudio }) => !hasVideo && hasAudio).reverse()

    const expire = Number(new URL(video.url).searchParams.get("expire")) * 1e3

    return {
      video: {
        ...video,
        overSize: (video?.filesize ?? 0) >= TELEGRAM_BOT_LIMIT,
      },
      audio: {
        ...audio,
        overSize: (audio?.filesize ?? 0) >= TELEGRAM_BOT_LIMIT,
      },
      title: videoDetails.title,
      expire,
    }
  }

  getFormats = async (src: string): Promise<FilteredFormat> => {
    return this.filterFormats(await this.info(src))
  }
}
