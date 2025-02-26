import { stat } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))

const getVariable = (key: string, defaultValue?: string) => {
	const value = process.env[key]

	if (value) return value
	if (defaultValue !== undefined) return defaultValue

	throw new Error(`Environment variable ${key} is not set`)
}

export const YTDL_AUTOUPDATE =
	getVariable("YTDL_AUTOUPDATE", "true") !== "false"
export const WEBHOOK_PORT = getVariable("TELEGRAM_WEBHOOK_PORT")
export const WEBHOOK_URL = getVariable("TELEGRAM_WEBHOOK_URL")
export const API_ROOT = getVariable("TELEGRAM_API_ROOT")
export const BOT_TOKEN = getVariable("TELEGRAM_BOT_TOKEN")
export const ADMIN_ID = Number.parseInt(getVariable("ADMIN_ID"))
export const WHITELISTED_IDS = getVariable("WHITELISTED_IDS", "")
	.split(",")
	.map((id) => Number.parseInt(id))
	.filter((id) => !Number.isNaN(id))
export const ALLOW_GROUPS = getVariable("ALLOW_GROUPS", "false") !== "false"
export const OPENAI_API_KEY = getVariable("OPENAI_API_KEY", "")
export const COBALT_INSTANCE_URL = getVariable("COBALT_INSTANCE_URL", "")

export const COOKIE_FILE = resolve(__dirname, "../storage/cookies.txt")
export const cookieArgs = async () => {
	try {
		const stats = await stat(COOKIE_FILE)
		if (stats.isFile()) {
			return ["--cookies", COOKIE_FILE]
		}
	} catch {}

	return []
}
