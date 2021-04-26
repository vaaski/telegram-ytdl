import { URL } from "url"
import * as ytdl from "ytdl-core"
import { FilteredFormat } from "../types"

export interface YTDLFilteredFormats extends FilteredFormat {
  video: ytdl.videoFormat
  audio: ytdl.videoFormat
}

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

    return { video, audio, expire, title }
  }

  getFormats = async (src: string): Promise<FilteredFormat> => {
    return this.filterFormats(await this.info(src))
  }
}
