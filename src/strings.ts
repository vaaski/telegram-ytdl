const strings = {
  formatSelection: (video) => `download "${video}" as audio or video?`,
  start: (username) =>
    `Hello @${username}!\n\nSimply send a YouTube URL to download it as either video or audio.`,
  downloading: (format) => `downloading ${format}...`,
  downloaded: (title, format) => `downloaded ${title} as ${format}`,
  uploadFailed: (url, expires) => `Upload to Telegram failed, maybe the filesize is over 50MB.\nUse [this direct link](${url}) to download. (expires ${expires})`,
}

export default strings
