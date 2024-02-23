import type { Chat, Message } from "grammy/types"
import { bot } from "./setup"

export const bold = (text: string) => `<b>${text}</b>`
export const italic = (text: string) => `<i>${text}</i>`
export const code = (text: string) => `<code>${text}</code>`
export const pre = (text: string) => `<pre>${text}</pre>`
export const underline = (text: string) => `<u>${text}</u>`
export const strikethrough = (text: string) => `<s>${text}</s>`
export const link = (text: string, url: string) => `<a href="${url}">${text}</a>`
export const quote = (text: string) => `<blockquote>${text}</blockquote>`
export const mention = (text: string, user_id: number) =>
  `<a href="tg://user?id=${user_id}">${text}</a>`

export const deleteMessage = (message: Message) => {
  return bot.api.deleteMessage(message.chat.id, message.message_id)
}

export const errorMessage = (chat: Chat, error?: string) => {
  let message = bold("An error occurred.")
  if (error) message += `\n\n${code(error)}`

  return bot.api.sendMessage(chat.id, message, { parse_mode: "HTML" })
}
