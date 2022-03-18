import { Markup } from "telegraf"

export const YOUTUBE_REGEX = /(?:youtube|youtu.be)+(?:.*?)(?:^|\/|v=)([a-z0-9_-]{11})(?:.*)?/i
export const TIKTOK_REGEX = /tiktok\.com/i
export const INSTAGRAM_REGEX = /instagram\.com/i
export const INSTAGRAM_TV_REGEX = /instagram\.com\/tv/i
export const URL_REGEX =
  /(http|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/i

export const AUDIO_VIDEO_KEYBOARD = Markup.inlineKeyboard([
  [Markup.button.callback("audio", "audio")],
  [Markup.button.callback("video", "video")],
]).reply_markup

export const TELEGRAM_BOT_LIMIT = 5.243e7
export const MAX_FILENAME_LENGTH = 64
