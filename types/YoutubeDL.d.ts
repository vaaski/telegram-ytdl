export interface YoutubeDL {
  is_live: null
  channel: string
  formats: Format[]
  format: string
  vcodec: string
  requested_subtitles: null
  like_count: number
  channel_url: string
  id: string
  uploader_id: string
  view_count: number
  description: string
  fulltitle: string
  fps: number
  webpage_url_basename: string
  width: number
  format_id: string
  uploader_url: string
  stretched_ratio: null
  title: string
  age_limit: number
  abr: number
  vbr: number
  thumbnail: string
  resolution: null
  categories: string[]
  display_id: string
  playlist_index: null
  extractor_key: string
  playlist: null
  thumbnails: Thumbnail[]
  duration: number
  average_rating: number
  height: number
  tags: string[]
  extractor: string
  uploader: string
  webpage_url: string
  channel_id: string
  upload_date: string
  requested_formats: Format[]
  dislike_count: number
  ext: YoutubeDLEXT
  acodec: Acodec
  _filename: string
  subtitles?: Subtitles
  automatic_captions?: { [key: string]: AutomaticCaption[] }
  artist?: string
  alt_title?: string
  album?: string
  track?: string
  creator?: string
}

export enum Acodec {
  Mp4A402 = "mp4a.40.2",
  None = "none",
  Opus = "opus",
}

export interface AutomaticCaption {
  ext: AutomaticCaptionEXT
  url: string
}

export enum AutomaticCaptionEXT {
  Srv1 = "srv1",
  Srv2 = "srv2",
  Srv3 = "srv3",
  Ttml = "ttml",
  Vtt = "vtt",
}

export enum YoutubeDLEXT {
  M4A = "m4a",
  Mp4 = "mp4",
  Webm = "webm",
}

export interface Format {
  http_headers: HTTPHeaders
  url: string
  format: string
  vcodec: string
  height: number | null
  abr?: number
  downloader_options?: DownloaderOptions
  width: number | null
  quality: number
  format_id: string
  tbr: number
  acodec: Acodec
  filesize: number | null
  asr: number | null
  container?: Container
  ext: YoutubeDLEXT
  fps: number | null
  format_note: string
  protocol: Protocol
  vbr?: number
}

export enum Container {
  M4ADash = "m4a_dash",
  Mp4Dash = "mp4_dash",
  WebmDash = "webm_dash",
}

export interface DownloaderOptions {
  http_chunk_size: number
}

export interface HTTPHeaders {
  "User-Agent": string
  "Accept-Charset": AcceptCharset
  Accept: Accept
  "Accept-Language": AcceptLanguage
  "Accept-Encoding": AcceptEncoding
}

export enum Accept {
  TextHTMLApplicationXHTMLXMLApplicationXMLQ09Q08 = "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

export enum AcceptCharset {
  ISO88591UTF8Q07Q07 = "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
}

export enum AcceptEncoding {
  GzipDeflate = "gzip, deflate",
}

export enum AcceptLanguage {
  EnUsEnQ05 = "en-us,en;q=0.5",
}

export enum Protocol {
  HTTPS = "https",
}

export interface Subtitles {
  de?: AutomaticCaption[]
}

export interface Thumbnail {
  id: string
  url: string
  resolution: string
  width: number
  height: number
}
