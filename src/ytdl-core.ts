import { URL } from "url"
import * as ytdl from "ytdl-core"

const ytdlCore = {
  info: async (src: string) => await ytdl.getInfo(src),
  filterFormats: ({ formats, videoDetails: { title } }: ytdl.videoInfo) => {
    const video = formats
      .filter(({ hasVideo, hasAudio }) => hasVideo && hasAudio)
      .sort((a, b) => b.width - a.width)[0]
    const audio = formats
      .filter(({ hasVideo, hasAudio, container }) => !hasVideo && hasAudio && container === "mp4")
      .sort((a, b) => b.audioBitrate - a.audioBitrate)[0]
    const expire = Number(new URL(video.url).searchParams.get("expire")) * 1e3

    return { video, audio, expire, title }
  },
  getFormats: async (src: string) => {
    return ytdlCore.filterFormats(await ytdlCore.info(src))
  },
}

export default ytdlCore
