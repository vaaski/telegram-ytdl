import type { FilteredFormat } from "../types"

import debug from "debug"
import { getVideoID } from "ytdl-core"
import youtubeDL from "./youtube-dl"
import ytdlCore from "./ytdl-core"
import { URL_REGEX } from "./constants"
import { yt_dl } from "@resync-tv/yt-dl"

export interface CachedDownload {
  [key: string]: FilteredFormat | Promise<FilteredFormat>
}

export default class Downloader {
  private cachedYTDLCore: CachedDownload = {}
  private ytdlCore = new ytdlCore()
  private youtubeDL = new youtubeDL()
  private log

  constructor(logger: debug.Debugger) {
    this.log = logger.extend("downloader")
  }

  filterURL(text: string): string {
    const url = URL_REGEX.exec(text)?.[0]
    if (!url) throw Error(`no url found in ${text}`)

    return url
  }

  youtube = async (text: string): Promise<FilteredFormat> => {
    const url = this.filterURL(text)
    const id = getVideoID(url)
    const log = this.log.extend(id)

    if (this.cachedYTDLCore[id]) {
      log(`found cached youtube video`)
      const cached = await this.cachedYTDLCore[id]

      if (cached.expire > Date.now()) {
        log(`cached video hasn't expired`)
        return cached
      }
    }

    log(`downloading fresh`)
    this.cachedYTDLCore[id] = this.ytdlCore.getFormats(id)
    return await this.cachedYTDLCore[id]
  }

  any = async (text: string): Promise<yt_dl.VideoInfo> => {
    const url = this.filterURL(text)

    this.log(url)
    return await this.youtubeDL.info(url)
  }
}
