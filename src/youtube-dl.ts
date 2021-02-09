import { URL } from "url"
import execa from "execa"
import { join } from "path"
import { YoutubeDL } from "./youtube-dl.d"

const youtubeDL = {
  info: async (src: string): Promise<YoutubeDL> => {
    const { stdout } = await execa(join(__dirname, "../youtube-dl"), ["-j", src])
    return JSON.parse(stdout)
  },
  filterFormats: ({ formats, title }: YoutubeDL) => {
    if (!formats) throw new Error("no formats found")
    const video = formats
      .filter(({ vcodec, acodec }) => vcodec !== "none" && acodec !== "none")
      .reverse()[0]
    const audio = formats
      .filter(({ vcodec, acodec }) => vcodec === "none" && acodec !== "none")
      .reverse()[0]
    const expire = Number(new URL(video.url).searchParams.get("expire")) * 1e3

    return { video, audio, expire, title }
  },
  getFormats: async (src: string) => {
    return youtubeDL.filterFormats(await youtubeDL.info(src))
  },
}

export default youtubeDL
