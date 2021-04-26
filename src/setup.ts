import { platform } from "os"
import { join } from "path"
import { exists, createWriteStream, copyAsync } from "fs-jetpack"
import got from "got"

const winDL = "https://yt-dl.org/latest/youtube-dl.exe"
const unixDL = "https://yt-dl.org/latest/youtube-dl"

const ensureYoutubeDL = (): Promise<void> => {
  return new Promise(res => {
    {
      let path = join(__dirname, "../youtube-dl.exe")
      let url = winDL

      if (platform() !== "win32") {
        path = join(__dirname, "../youtube-dl")
        url = unixDL
      }

      if (!exists(path)) {
        console.log("youtube-dl not found, downloading...")
        const file = createWriteStream(path)
        const response = got.stream(url)
        response.pipe(file).on("close", res)
      } else res()
    }
  })
}

const cloneDotEnv = async () => {
  const path = join(__dirname, "../.env")

  if (!exists(path)) {
    console.log(".env file not found, copying example...")
    await copyAsync(join(__dirname, "../.env.example"), path)
  }
}

export default async (): Promise<string> => {
  await ensureYoutubeDL()
  await cloneDotEnv()

  const BOT_TOKEN = process.env.BOT_TOKEN
  if (!BOT_TOKEN) {
    console.log("BOT_TOKEN required, please include it in the .env file.")
    return process.exit(1)
  }

  return BOT_TOKEN
}
