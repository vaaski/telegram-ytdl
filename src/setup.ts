import type { ParseModeFlavor } from "@grammyjs/parse-mode"
import type { Context } from "grammy"

import { hydrateReply } from "@grammyjs/parse-mode"
import express from "express"
import { Bot, webhookCallback } from "grammy"
import { API_ROOT, BOT_TOKEN, WEBHOOK_PORT, WEBHOOK_URL } from "./environment"

export const bot = new Bot<ParseModeFlavor<Context>>(BOT_TOKEN, {
	client: { apiRoot: API_ROOT },
	botInfo: undefined,
})

bot.use(hydrateReply)

export const server = express()

server.use(express.json())
server.use(webhookCallback(bot, "express"))

console.log(`Starting bot with root ${API_ROOT}...`)
server.listen(WEBHOOK_PORT, async () => {
	await bot.api.setWebhook(WEBHOOK_URL)
	console.log(`Webhook set to ${WEBHOOK_URL}`)

	const me = await bot.api.getMe()
	console.log(`Bot started as @${me.username} on :${WEBHOOK_PORT}`)
})
