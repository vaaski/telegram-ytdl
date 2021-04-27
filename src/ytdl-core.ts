import { URL } from "url"
import * as ytdl from "ytdl-core"
import { FilteredFormat } from "../types"
import { TELEGRAM_BOT_LIMIT } from "./constants"

export default class ytdlCore {
  private info = async (src: string): Promise<ytdl.videoInfo> => await ytdl.getInfo(src)

  private filterFormats = ({
    formats,
    videoDetails: { title },
  }: ytdl.videoInfo): FilteredFormat => {
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
        overSize: parseInt(video.contentLength) > TELEGRAM_BOT_LIMIT,
      },
      audio: {
        ...audio,
        overSize: parseInt(audio.contentLength) > TELEGRAM_BOT_LIMIT,
      },
      expire,
      title,
    }
  }

  getFormats = async (src: string): Promise<FilteredFormat> => {
    return this.filterFormats(await this.info(src))
  }
}
