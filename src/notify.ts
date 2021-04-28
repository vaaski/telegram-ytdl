import type { ExtendedContext } from "../types"

import { Telegraf } from "telegraf"
import { bold, code } from "./util"

const ADMIN_CHAT = process.env.ADMIN_CHAT || ""

export default class Notifier {
  private bot: Telegraf<ExtendedContext>
  private chat_id = ADMIN_CHAT
  private extra = {
    parse_mode: "HTML" as const,
    disable_notification: true,
  }

  constructor(bot: Telegraf<ExtendedContext>) {
    this.bot = bot
  }

  notify(text: string): void {
    if (!this.chat_id) return

    this.bot.telegram.sendMessage(this.chat_id, text, this.extra)
  }

  unsupported(text: string): void {
    this.notify(`${bold("unsupported:")} ${text}`)
  }

  error(text: Error): void {
    this.notify(`${bold("error:")} ${code(JSON.stringify(text, null, 2))}`)
  }
}
