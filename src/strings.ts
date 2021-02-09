const strings = {
  formatSelection: (video: string) => `download "${video}" as audio or video?`,
  start: (username: string) =>
    `Hello @${username}!\n\nSimply send a YouTube URL to download it as either video or audio.`,
  downloading: (format: string) => `downloading ${format}...`,
  downloaded: (title: string, format: string) => `downloaded ${title} as ${format}`,
  uploadFailed: (url: string, expires: string) =>
    `Upload to Telegram failed, maybe the filesize is over 50MB.\nUse [this direct link](${url}) to download. (expires ${expires})`,
  unsupported: (url: string) => `${url} is not supported.`
}

export default strings
