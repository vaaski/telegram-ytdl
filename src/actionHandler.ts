import type { Telegraf } from "telegraf"
import type debug from "debug"

import strings from "./strings"

import type { ExtendedContext } from "../types"
import type { CallbackQuery, Message } from "typegram"
import type Downloader from "./downloader"
import { filenameify } from "./util"

export default (
  bot: Telegraf<ExtendedContext>,
  downloader: Downloader,
  log: debug.Debugger
): void => {
  //? util function because telegraf types are wrong
  const getCallbackReplyToText = (callbackQuery: CallbackQuery) => {
    // @ts-expect-error the types seem to be bad
    return callbackQuery.message?.reply_to_message as Message.TextMessage
  }

  //? handle click on audio and video buttons
  const actionHandler = (type: "audio" | "video") => async (ctx: ExtendedContext) => {
    if (!ctx.callbackQuery) throw Error("no callbackQuery found")

    const { text, message_id } = getCallbackReplyToText(ctx.callbackQuery)
    if (!text) throw Error("no text in callbackQuery reply-to message")

    const { message } = ctx.callbackQuery
    if (!message?.chat.id || !message?.message_id) throw Error("message has no ids")

    ctx.answerCbQuery(strings.downloading(`as ${type}`))
    bot.telegram.deleteMessage(message.chat.id, message.message_id)

    const media = await downloader.youtube(text)

    if (media[type].overSize) {
      log(`${type} is too large`)
      // TODO implement expiring links in shr.li
      const short = `<a href="${media[type].url}">direct link</a>`
      return ctx.replyWithHTML(strings.overSize(type, short))
    }

    const file = {
      url: media[type].url,
      filename: filenameify(media.title),
    }

    const extra = {
      reply_to_message_id: message_id,
      allow_sending_without_reply: true,
    }

    if (type === "video") {
      return ctx.replyWithVideo(file, {
        ...extra,
        caption: media.title,
        supports_streaming: true,
      })
    }

    if (type === "audio") {
      log("audio", file, extra)
      return ctx.replyWithAudio(file, extra)
    }
  }

  bot.action("audio", actionHandler("audio"))
  bot.action("video", actionHandler("video"))
}
