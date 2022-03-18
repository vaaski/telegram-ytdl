import { platform } from "os"
import { join } from "path"
import jetpack from "fs-jetpack"
import got from "got"
import { promisify } from "util"
import { chmod } from "fs"
import stream from "stream"

import { logger } from "./util"
const log = logger("setup")

interface PlatformBinaries {
  URL: string
  filename: string
}
const BINARIES: Partial<Record<NodeJS.Platform, PlatformBinaries>> = {
  win32: {
    URL: "https://github.com/mikf/gallery-dl/releases/latest/download/gallery-dl.exe",
    filename: "gallery-dl.exe",
  },
  linux: {
    URL: "https://github.com/mikf/gallery-dl/releases/latest/download/gallery-dl.bin",
    filename: "gallery-dl",
  },
}

const BIN_PATH = join(__dirname, "..", "bin")

const pipeline = promisify(stream.pipeline)
const chmodPromise = promisify(chmod)

const linuxPermissions = (filePath: string) => chmodPromise(filePath, "755")

/**
 * Ensure the existence of the binaries and/or download/update them.
 * @returns path to the binary
 */
const ensureGalleryDL = async (): Promise<string> => {
  const downloadUrl = BINARIES[platform()]?.URL
  const filename = BINARIES[platform()]?.filename

  if (!downloadUrl || !filename) throw Error("unsupported platform")

  jetpack.dir(BIN_PATH)
  const filePath = join(BIN_PATH, filename)
  if (jetpack.exists(filePath)) {
    log(`found binary at ${filePath}`)

    return filePath
  }

  log("downloading binary")
  await pipeline(got.stream(downloadUrl), jetpack.createWriteStream(filePath))

  if (platform() === "linux") await linuxPermissions(filePath)
  return filePath
}

const cloneDotEnv = async () => {
  const path = join(__dirname, "../.env")

  if (!jetpack.exists(path)) {
    console.log(".env file not found, copying example...")
    await jetpack.copyAsync(join(__dirname, "../.env.example"), path)
  }
}

export default async () => {
  const galleryDLPath = await ensureGalleryDL()

  const BOT_TOKEN = process.env.BOT_TOKEN
  if (!BOT_TOKEN) {
    await cloneDotEnv()

    console.log("BOT_TOKEN required, please include it in the .env file.")
    return process.exit(1)
  }

  return { BOT_TOKEN, galleryDLPath }
}
