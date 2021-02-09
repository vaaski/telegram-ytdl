export interface YoutubeDL {
  stretched_ratio?: null
  album?: null
  vcodec: string
  format: string
  series?: null
  playlist_index?: null
  extractor: string
  average_rating: number
  format_id: string
  resolution?: null
  age_limit: number
  width: number
  uploader_id: string
  id: string
  uploader: string
  end_time?: null
  thumbnail: string
  like_count: number
  _filename: string
  annotations?: null
  tags?: string[] | null
  start_time?: null
  alt_title?: null
  automatic_captions: AutomaticCaptionsOrSubtitles
  license?: null
  release_date?: null
  extractor_key: string
  ext: string
  description: string
  chapters?: null
  thumbnails?: ThumbnailsEntity[] | null
  release_year?: null
  fps: number
  height: number
  fulltitle: string
  title: string
  is_live?: null
  vbr?: null
  episode_number?: null
  display_id: string
  dislike_count: number
  track?: null
  channel_id: string
  upload_date: string
  categories?: string[] | null
  view_count: number
  acodec: string
  creator?: null
  requested_subtitles?: null
  abr: number
  requested_formats?: RequestedFormatsEntity[] | null
  subtitles: AutomaticCaptionsOrSubtitles
  formats?: FormatsEntity[] | null
  webpage_url: string
  playlist?: null
  artist?: null
  uploader_url: string
  season_number?: null
  channel_url: string
  duration: number
  webpage_url_basename: string
}
export interface AutomaticCaptionsOrSubtitles {}
export interface ThumbnailsEntity {
  id: string
  height: number
  url: string
  width: number
  resolution: string
}
export interface RequestedFormatsEntity {
  filesize: number
  fps?: number | null
  format_note: string
  height?: number | null
  vcodec: string
  player_url?: null
  url: string
  http_headers: HttpHeaders
  downloader_options: DownloaderOptions
  format_id: string
  width?: number | null
  ext: string
  asr?: number | null
  format: string
  tbr: number
  protocol: string
  acodec: string
  container?: string | null
  abr?: number | null
}
export interface HttpHeaders {
  "Accept-Charset": string
  Accept: string
  "Accept-Encoding": string
  "User-Agent": string
  "Accept-Language": string
}
export interface DownloaderOptions {
  http_chunk_size: number
}
export interface FormatsEntity {
  filesize?: number | null
  fps?: number | null
  format_note: string
  height?: number | null
  vcodec: string
  player_url?: null
  url: string
  http_headers: HttpHeaders
  downloader_options?: DownloaderOptions1 | null
  format_id: string
  width?: number | null
  ext: string
  asr?: number | null
  format: string
  tbr: number
  protocol: string
  acodec: string
  container?: string | null
  abr?: number | null
}
export interface DownloaderOptions1 {
  http_chunk_size: number
}
