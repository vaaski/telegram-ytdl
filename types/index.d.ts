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
