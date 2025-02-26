import { downloadFromInfo, getInfo } from "@resync-tv/yt-dlp"
import { InputFile } from "grammy"
import { deleteMessage, errorMessage } from "./bot-util"
import { cobaltMatcher, cobaltResolver } from "./cobalt"
import { link, t, tiktokArgs } from "./constants"
import {
	ADMIN_ID,
	ALLOW_GROUPS,
	cookieArgs,
	WHITELISTED_IDS,
} from "./environment"
import { getThumbnail, urlMatcher } from "./media-util"
import { Queue } from "./queue"
import { bot } from "./setup"
import { translateText } from "./translate"
import { Updater } from "./updater"
import { chunkArray, removeHashtagsMentions } from "./util"

const queue = new Queue()
const updater = new Updater()

bot.use(async (ctx, next) => {
	if (ctx.chat?.type === "private") {
		return await next()
	}

	const isGroup = ["supergroup", "group"].includes(ctx.chat?.type ?? "")
	if (ALLOW_GROUPS && isGroup) {
		return await next()
	}
})

//? filter out messages from non-whitelisted users
bot.on("message:text", async (ctx, next) => {
	if (WHITELISTED_IDS.length === 0) return await next()
	if (WHITELISTED_IDS.includes(ctx.from?.id)) return await next()

	const deniedResponse = await ctx.replyWithHTML(t.deniedMessage, {
		link_preview_options: { is_disabled: true },
	})

	await Promise.all([
		(async () => {
			if (ctx.from.language_code && ctx.from.language_code !== "en") {
				const translated = await translateText(
					t.deniedMessage,
					ctx.from.language_code,
				)
				if (translated === t.deniedMessage) return
				await bot.api.editMessageText(
					ctx.chat.id,
					deniedResponse.message_id,
					translated,
					{ parse_mode: "HTML", link_preview_options: { is_disabled: true } },
				)
			}
		})(),
		(async () => {
			const forwarded = await ctx.forwardMessage(ADMIN_ID, {
				disable_notification: true,
			})
			await bot.api.setMessageReaction(
				forwarded.chat.id,
				forwarded.message_id,
				[{ type: "emoji", emoji: "🖕" }],
			)
		})(),
	])
})

bot.on("message:text", async (ctx, next) => {
	if (updater.updating === false) return await next()

	const maintenanceNotice = await ctx.replyWithHTML(t.maintenanceNotice)
	await updater.updating

	await deleteMessage(maintenanceNotice)
	await next()
})

bot.on("message:text").on("::url", async (ctx, next) => {
	const [url] = ctx.entities("url")
	if (!url) return await next()

	const processingMessage = await ctx.replyWithHTML(t.processing, {
		disable_notification: true,
	})

	if (ctx.chat.id !== ADMIN_ID) {
		ctx
			.forwardMessage(ADMIN_ID, { disable_notification: true })
			.then(async (forwarded) => {
				await bot.api.setMessageReaction(
					forwarded.chat.id,
					forwarded.message_id,
					[{ type: "emoji", emoji: "🤝" }],
				)
			})
	}

	const useCobaltResolver = async () => {
		try {
			const resolved = await cobaltResolver(url.text)

			if (resolved.status === "error") {
				throw resolved.error
			}

			if (resolved.status === "picker") {
				const photos = chunkArray(
					10,
					resolved.picker
						.filter((p) => p.type === "photo")
						.map((p) => ({
							type: "photo" as const,
							media: p.url,
						})),
				)

				for (const chunk of photos) {
					await bot.api.sendMediaGroup(ctx.chat.id, chunk)
				}

				return true
			}

			if (resolved.status === "redirect") {
				await ctx.replyWithHTML(link("Resolved content URL", resolved.url))
				return true
			}
		} catch (error) {
			console.error("Error resolving with cobalt", error)
		}
	}

	queue.add(async () => {
		try {
			const isTiktok = urlMatcher(url.text, "tiktok.com")
			const isYouTubeMusic = urlMatcher(url.text, "music.youtube.com")
			const useCobalt = cobaltMatcher(url.text)
			const additionalArgs = isTiktok ? tiktokArgs : []

			if (useCobalt) {
				if (await useCobaltResolver()) return
			}

			// -----------------------------------------------------------------------------

			const info = await getInfo(url.text, [
				"-f",
				"b",
				"--no-playlist",
				...(await cookieArgs()),
				...additionalArgs,
			])

			const [download] = info.requested_downloads ?? []
			if (!download || !download.url) throw new Error("No download available")

			const title = removeHashtagsMentions(info.title)

			if (download.vcodec !== "none" && !isYouTubeMusic) {
				let video: InputFile | string

				if (isTiktok) {
					const stream = downloadFromInfo(info, "-")
					video = new InputFile(stream.stdout, title)
				} else {
					video = new InputFile({ url: download.url }, title)
				}

				await ctx.replyWithVideo(video, {
					caption: title,
					supports_streaming: true,
					duration: info.duration,
					reply_parameters: {
						message_id: ctx.message?.message_id,
						allow_sending_without_reply: true,
					},
				})
			} else if (download.acodec !== "none") {
				const stream = downloadFromInfo(info, "-", [
					"-x",
					"--audio-format",
					"mp3",
				])
				const audio = new InputFile(stream.stdout)

				await ctx.replyWithAudio(audio, {
					caption: title,
					performer: info.uploader,
					title: info.title,
					thumbnail: getThumbnail(info.thumbnails),
					duration: info.duration,
					reply_parameters: {
						message_id: ctx.message?.message_id,
						allow_sending_without_reply: true,
					},
				})
			} else {
				if (await useCobaltResolver()) return
				throw new Error("No download available")
			}
		} catch (error) {
			if (await useCobaltResolver()) return
			return error instanceof Error
				? errorMessage(ctx.chat, error.message)
				: errorMessage(ctx.chat, `Couldn't download ${url}`)
		} finally {
			await deleteMessage(processingMessage)
		}
	})
})

bot.on("message:text", async (ctx) => {
	const response = await ctx.replyWithHTML(t.urlReminder)

	if (ctx.from.language_code && ctx.from.language_code !== "en") {
		const translated = await translateText(
			t.urlReminder,
			ctx.from.language_code,
		)
		if (translated === t.urlReminder) return
		await bot.api.editMessageText(
			ctx.chat.id,
			response.message_id,
			translated,
			{ parse_mode: "HTML", link_preview_options: { is_disabled: true } },
		)
	}
})
