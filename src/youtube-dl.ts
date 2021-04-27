import { URL } from "url"
import execa from "execa"
import { join } from "path"

import { FilteredFormat } from "../types"
import { YoutubeDL } from "../types/YoutubeDL"
import { TELEGRAM_BOT_LIMIT } from "./constants"

export default class youtubeDL {
  private info = async (src: string): Promise<YoutubeDL> => {
    const { stdout } = await execa(join(__dirname, "../youtube-dl"), ["-j", src])
    return JSON.parse(stdout)
  }

  private filterFormats = ({ formats, title }: YoutubeDL): FilteredFormat => {
    if (!formats) throw new Error("no formats found")
    const video = formats
      .filter(({ vcodec, acodec }) => vcodec !== "none" && acodec !== "none")
      .reverse()[0]
    const audio = formats
      .filter(({ vcodec, acodec }) => vcodec === "none" && acodec !== "none")
      .reverse()[0]
    const expire = Number(new URL(video.url).searchParams.get("expire")) * 1e3

    return {
      video: {
        ...video,
        overSize: (video.filesize ?? 0) > TELEGRAM_BOT_LIMIT,
      },
      audio: {
        ...audio,
        overSize: (audio.filesize ?? 0) > TELEGRAM_BOT_LIMIT,
      },
      expire,
      title,
    }
  }

  getFormats = async (src: string): Promise<FilteredFormat> => {
    return this.filterFormats(await this.info(src))
  }
}
