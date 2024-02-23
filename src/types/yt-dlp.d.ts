export type YtDLPInfo = {
  id?: string
  title?: string
  formats?: Format[]
  thumbnails?: Thumbnail[]
  thumbnail?: string
  description?: string
  channel_id?: string
  channel_url?: string
  duration?: number
  view_count?: number
  average_rating?: null
  age_limit?: number
  webpage_url?: string
  categories?: string[]
  tags?: string[]
  playable_in_embed?: boolean
  live_status?: string
  release_timestamp?: null
  _format_sort_fields?: string[]
  automatic_captions?: { [key: string]: AutomaticCaption[] }
  subtitles?: Subtitles
  comment_count?: number
  chapters?: null
  heatmap?: null
  like_count?: number
  channel?: string
  channel_follower_count?: number
  uploader?: string
  uploader_id?: string
  uploader_url?: string
  upload_date?: string
  availability?: string
  original_url?: string
  webpage_url_basename?: string
  webpage_url_domain?: string
  extractor?: string
  extractor_key?: string
  playlist?: null
  playlist_index?: null
  display_id?: string
  fulltitle?: string
  duration_string?: string
  release_year?: null
  is_live?: boolean
  was_live?: boolean
  requested_subtitles?: null
  _has_drm?: null
  epoch?: number
  requested_downloads?: RequestedDownload[]
  asr?: number
  filesize?: null
  format_id?: string
  format_note?: string
  source_preference?: number
  fps?: number
  audio_channels?: number
  height?: number
  quality?: number
  has_drm?: boolean
  tbr?: number
  url?: string
  width?: number
  language?: Language
  language_preference?: number
  preference?: null
  ext?: VideoEXTEnum
  vcodec?: string
  acodec?: Acodec
  dynamic_range?: DynamicRange
  downloader_options?: DownloaderOptions
  protocol?: Protocol
  resolution?: string
  aspect_ratio?: number
  filesize_approx?: number
  http_headers?: HTTPHeaders
  video_ext?: VideoEXTEnum
  audio_ext?: Acodec
  vbr?: null
  abr?: null
  format?: string
  _type?: string
  _version?: Version
}

export type Version = {
  version?: string
  current_git_head?: null
  release_git_head?: string
  repository?: string
}

export type Acodec = "none" | "mp4a.40.5" | "opus" | "mp4a.40.2"

export type AutomaticCaption = {
  ext?: AutomaticCaptionEXT
  url?: string
  name?: string
}

export type AutomaticCaptionEXT = "json3" | "srv1" | "srv2" | "srv3" | "ttml" | "vtt"

export type DownloaderOptions = {
  http_chunk_size?: number
}

export type DynamicRange = "SDR"

export type VideoEXTEnum = "none" | "mp4" | "m4a" | "webm" | "mhtml"

export type Format = {
  format_id?: string
  format_note?: string
  ext?: VideoEXTEnum
  protocol?: Protocol
  acodec?: Acodec
  vcodec?: string
  url?: string
  width?: number | null
  height?: number | null
  fps?: number | null
  rows?: number
  columns?: number
  fragments?: Fragment[]
  resolution?: string
  aspect_ratio?: number | null
  http_headers?: HTTPHeaders
  audio_ext?: VideoEXTEnum
  video_ext?: VideoEXTEnum
  vbr?: number | null
  abr?: number | null
  tbr?: number | null
  format?: string
  format_index?: null
  manifest_url?: string
  language?: Language | null
  preference?: null
  quality?: number
  has_drm?: boolean
  source_preference?: number
  __needs_testing?: boolean
  asr?: number | null
  filesize?: number | null
  audio_channels?: number | null
  language_preference?: number
  dynamic_range?: DynamicRange | null
  container?: Container
  downloader_options?: DownloaderOptions
  filesize_approx?: number
}

export type Container = "m4a_dash" | "webm_dash" | "mp4_dash"

export type Fragment = {
  url?: string
  duration?: number
}

export type HTTPHeaders = {
  "User-Agent"?: string
  Accept?: Accept
  "Accept-Language"?: AcceptLanguage
  "Sec-Fetch-Mode"?: SECFetchMode
}

export type Accept = "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"

export type AcceptLanguage = "en-us,en;q=0.5"

export type SECFetchMode = "navigate"

export type Language = "en"

export type Protocol = "mhtml" | "m3u8_native" | "https"

export type RequestedDownload = {
  asr?: number
  format_id?: string
  format_note?: string
  source_preference?: number
  fps?: number
  audio_channels?: number
  height?: number
  quality?: number
  has_drm?: boolean
  tbr?: number
  url?: string
  width?: number
  language?: Language
  language_preference?: number
  ext?: VideoEXTEnum
  vcodec?: string
  acodec?: Acodec
  dynamic_range?: DynamicRange
  downloader_options?: DownloaderOptions
  protocol?: Protocol
  resolution?: string
  aspect_ratio?: number
  filesize_approx?: number
  http_headers?: HTTPHeaders
  video_ext?: VideoEXTEnum
  audio_ext?: Acodec
  format?: string
  _filename?: string
  filename?: string
  __write_download_archive?: boolean
}

export type Subtitles = {}

export type Thumbnail = {
  url?: string
  preference?: number
  id?: string
  height?: number
  width?: number
  resolution?: string
}
