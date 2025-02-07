// prettier-ignore
const ESCAPE_MAP = new Set([
	"_",
	"*",
	"[",
	"]",
	"(",
	")",
	"~",
	"`",
	">",
	"<",
	"#",
	"+",
	"-",
	"=",
	"|",
	"{",
	"}",
	".",
	"!",
])
export const escapeHTML = (text: string) => {
	return [...text]
		.map((char) => {
			if (ESCAPE_MAP.has(char)) return `\\${char}`
			return char
		})
		.join("")
}

const CODE_ESCAPE_MAP = new Map([
	["`", "\\`"],
	["\\", "\\\\"],
	["<", "&lt;"],
	[">", "&gt;"],
	["&", "&amp;"],
])
export const escapeCode = (text: string) => {
	return [...text]
		.map((char) => {
			if (CODE_ESCAPE_MAP.has(char)) return CODE_ESCAPE_MAP.get(char)
			return char
		})
		.join("")
}

export const bold = (text: string) => `<b>${text}</b>`
export const italic = (text: string) => `<i>${text}</i>`
export const code = (text: string) => `<code>${escapeCode(text)}</code>`
export const pre = (text: string) => `<pre>${escapeCode(text)}</pre>`
export const underline = (text: string) => `<u>${text}</u>`
export const strikethrough = (text: string) => `<s>${text}</s>`
export const link = (text: string, url: string) =>
	`<a href="${url}">${text}</a>`
export const quote = (text: string) => `<blockquote>${text}</blockquote>`
export const mention = (text: string, user_id: number) =>
	`<a href="tg://user?id=${user_id}">${text}</a>`

export const t = {
	urlReminder: "You need to send an URL to download stuff.",
	maintenanceNotice:
		"Bot is currently under maintenance, it'll return shortly.",
	processing: "Processing...",
	deniedMessage: [
		bold("This bot is private."),
		"",
		"It costs money to run this and unfortunately it doesn't grow on trees.",
		`This bot is open source, so you can always ${link("host it yourself", "https://github.com/vaaski/telegram-ytdl#hosting")}.`,
		"",
		bold(
			`As an alternative I recommend checking out ${link(
				"yt-dlp",
				"https://github.com/yt-dlp/yt-dlp",
			)}, the command line tool that powers this bot or ${link(
				"cobalt",
				"https://cobalt.tools",
			)}, a web-based social media content downloader (not affiliated with this bot).`,
		),
		"",
		`${bold(
			"Do not",
		)} try to contact me to get whitelisted, I will not accept anyone I don't know personally.`,
	].join("\n"),
	cutoffNotice:
		"\n\n[...]\n\nThis message was cut off due to the Telegram Message character limit. View the full output in the logs.",
}

// https://github.com/yt-dlp/yt-dlp/issues/9506#issuecomment-2053987537
export const tiktokArgs = [
	"--extractor-args",
	"tiktok:api_hostname=api16-normal-c-useast1a.tiktokv.com;app_info=7355728856979392262",
]
