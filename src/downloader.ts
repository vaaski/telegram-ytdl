import debug from "debug"
import { getVideoID } from "ytdl-core"
import type { FilteredFormat } from "../types"
import ytdlCore from "./ytdl-core"

export interface CachedDownload {
  [key: string]: FilteredFormat | Promise<FilteredFormat>
}

export default class Downloader {
  private cachedYTDLCore: CachedDownload = {}
  private ytdlCore = new ytdlCore()
  private log

  constructor(logger: debug.Debugger) {
    this.log = logger.extend("downloader")
  }

  youtube = async (containingYoutubeID: string): Promise<FilteredFormat> => {
    const id = getVideoID(containingYoutubeID)
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
    this.cachedYTDLCore[id] = this.ytdlCore.getFormats(containingYoutubeID)
    return await this.cachedYTDLCore[id]
  }
}
