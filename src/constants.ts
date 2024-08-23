import { bold, link } from "./bot-util"

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
}

// https://github.com/yt-dlp/yt-dlp/issues/9506#issuecomment-2053987537
export const tiktokArgs = [
	"--extractor-args",
	"tiktok:api_hostname=api16-normal-c-useast1a.tiktokv.com;app_info=7355728856979392262",
]
