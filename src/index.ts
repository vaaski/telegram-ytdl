import { getInfo, streamFromInfo } from "@resync-tv/yt-dlp"
import { InputFile } from "grammy"
import { deleteMessage, errorMessage } from "./botutil"
import { deniedMessage, tiktokArgs } from "./constants"
import { ADMIN_ID, WHITELISTED_IDS } from "./environment"
import { getThumbnail, urlMatcher } from "./mediautil"
import { Queue } from "./queue"
import { bot } from "./setup"
import { removeHashtagsMentions } from "./textutil"
import { Updater } from "./updater"

const queue = new Queue()
const updater = new Updater()

bot.use(async (ctx, next) => {
	if (ctx.chat?.type !== "private") return

	await next()
})

//? filter out messages from non-whitelisted users
bot.on("message:text", async (ctx, next) => {
	if (WHITELISTED_IDS.includes(ctx.from?.id)) return await next()

	await ctx.replyWithHTML(deniedMessage, {
		link_preview_options: { is_disabled: true },
	})

	const forwarded = await ctx.forwardMessage(ADMIN_ID, {
		disable_notification: true,
	})
	await bot.api.setMessageReaction(forwarded.chat.id, forwarded.message_id, [
		{ type: "emoji", emoji: "🖕" },
	])
})

bot.on("message:text", async (ctx, next) => {
	if (updater.updating === false) return await next()

	const maintenanceNotice = await ctx.replyWithHTML(
		"Bot is currently under maintenance, it'll return shortly.",
	)
	await updater.updating

	await deleteMessage(maintenanceNotice)
	await next()
})

bot.on("message:text").on("::url", async (ctx, next) => {
	const [url] = ctx.entities("url")
	if (!url) return await next()

	const processingMessage = await ctx.replyWithHTML("Processing...", {
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

	queue.add(async () => {
		try {
			const isTiktok = urlMatcher(url.text, "tiktok.com")
			const isYouTubeMusic = urlMatcher(url.text, "music.youtube.com")
			const additionalArgs = isTiktok ? tiktokArgs : []

			const info = await getInfo(url.text, [
				"-f",
				"b",
				"--no-playlist",
				...additionalArgs,
			])

			const [download] = info.requested_downloads ?? []
			if (!download || !download.url) throw new Error("No download available")

			const title = removeHashtagsMentions(info.title)

			if (download.vcodec !== "none" && !isYouTubeMusic) {
				let video: InputFile | string

				if (isTiktok) {
					const stream = streamFromInfo(info)
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
				const stream = streamFromInfo(info, ["-x", "--audio-format", "mp3"])
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
				throw new Error("No download available")
			}
		} catch (error) {
			return error instanceof Error
				? errorMessage(ctx.chat, error.message)
				: errorMessage(ctx.chat, `Couldn't download ${url}`)
		} finally {
			await deleteMessage(processingMessage)
		}
	})
})

bot.on("message:text", async (ctx) => {
	await ctx.replyWithHTML("You need to send an URL to download stuff.")
})
