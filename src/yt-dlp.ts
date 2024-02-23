import type { YtDLPInfo } from "./types/yt-dlp"

export const parseYtDlpInfo = (info: string) => {
  const parsed = JSON.parse(info) as YtDLPInfo

  if (!parsed.requested_downloads) throw new Error("No downloads available")
  if (parsed.requested_downloads.length === 0) throw new Error("No downloads available")

  return parsed
}
