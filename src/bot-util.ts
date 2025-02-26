import type { Chat, Message } from "grammy/types"

import { ADMIN_ID } from "./environment"
import { bot } from "./setup"
import { cutoffWithNotice } from "./util"
import { bold, code, mention } from "./constants"

export const deleteMessage = (message: Message) => {
	return bot.api.deleteMessage(message.chat.id, message.message_id)
}

export const errorMessage = (chat: Chat, error?: string) => {
	if (chat.type !== "private") return

	let message = bold("An error occurred.")
	if (error) message += `\n\n${code(cutoffWithNotice(error))}`

	const tasks = [bot.api.sendMessage(chat.id, message, { parse_mode: "HTML" })]

	let adminMessage = `Error in chat ${mention("user", chat.id)}`
	if (error) adminMessage += `\n\n${code(cutoffWithNotice(error))}`

	console.error("Error in chat", chat.id, error)

	if (chat.id !== ADMIN_ID) {
		tasks.push(
			bot.api.sendMessage(ADMIN_ID, adminMessage, { parse_mode: "HTML" }),
		)
	}

	return Promise.all(tasks)
}
