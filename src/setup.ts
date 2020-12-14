import { existsSync, createWriteStream, copyFileSync } from "fs"
import { join } from "path"
import { platform } from "os"
import axios from "axios"

const winDL = "https://yt-dl.org/latest/youtube-dl.exe"
const unixDL = "https://yt-dl.org/latest/youtube-dl"

const ytdlExist = (): Promise<void> =>
  new Promise(async (res) => {
    let path = join(__dirname, "../youtube-dl.exe")
    let url = winDL

    if (platform() !== "win32") {
      path = join(__dirname, "../youtube-dl")
      url = unixDL
    }

    if (!existsSync(path)) {
      console.log("youtube-dl not found, downloading...")
      const file = createWriteStream(path)
      const response = await axios.get(url, {
        responseType: "stream",
      })
      response.data.pipe(file)
      file.on("close", res)
    } else res()
  })

const cloneDotEnv = async () => {
  const path = join(__dirname, "../.env")
  if (!existsSync(path)) {
    console.log(".env file not found, copying...")
    copyFileSync(join(__dirname, "../.env.example"), join(__dirname, "../.env"))
  }
  return
}

const setup = async () => {
  await ytdlExist()
  await cloneDotEnv()
  if (!process.env.BOT_TOKEN) {
    console.log("BOT_TOKEN required, please include it in the .env file.")
    process.exit()
  }
}

export default setup
