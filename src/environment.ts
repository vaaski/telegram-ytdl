const getVariable = (key: string) => {
  const value = process.env[key]

  if (value) return value

  throw new Error(`Environment variable ${key} is not set`)
}

export const WEBHOOK_PORT = getVariable("TELEGRAM_WEBHOOK_PORT")
export const WEBHOOK_URL = getVariable("TELEGRAM_WEBHOOK_URL")
export const API_ROOT = getVariable("TELEGRAM_API_ROOT")
export const BOT_TOKEN = getVariable("TELEGRAM_BOT_TOKEN")
export const ADMIN_ID = Number.parseInt(getVariable("ADMIN_ID"))
export const WHITELISTED_IDS = getVariable("WHITELISTED_IDS")
  .split(",")
  .map((id) => Number.parseInt(id))
