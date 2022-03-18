import type { Context } from "telegraf"

export interface FormatMedia {
  url: string
  overSize: boolean
}

export interface FilteredFormat {
  video: FormatMedia
  audio: FormatMedia
  expire: number
  title: string
}

interface ExtendedContext extends Context {
  name: string
  youtube?: string
  tiktok?: string
  instagram?: string
}
