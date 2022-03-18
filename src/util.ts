import got from "got"
import debug from "debug"

const log = debug("telegram-ytdl")
export const logger = (namespace: string): debug.Debugger => log.extend(namespace)

export const getContentLength = async (url: string): Promise<number> => {
  const data = await got.head(url)

  return parseInt(data.headers["content-length"] ?? "0")
}

export const filenameify = (str: string): string =>
  str.replace(/[^a-z0-9]/gi, "_").toLowerCase()

export const removeHashtags = (str: string): string =>
  str.replace(/#[\w\u00F0-\u02AF]+/g, "").replace(/\s{2,}/g, "")

export const bold = (s: string): string => `<b>${s}</b>`
export const code = (s: string): string => `<code>${s}</code>`

export const once = <A extends any[], R, T>(
  fn: (this: T, ...arg: A) => R
): ((this: T, ...arg: A) => R | undefined) => {
  let done = false
  return function (this: T, ...args: A) {
    return done ? void 0 : ((done = true), fn.apply(this, args))
  }
}

// interface shortenerResponse {
//   slug: string
//   target: string
// }

// export const shortURL = async (target: string): Promise<string> => {
//   try {
//     const json = { target }
//     const data = (await got
//       .post("https://shr.li./create", { json, timeout: 2000 })
//       .json()) as shortenerResponse

//     return `https://shr.li/${data.slug}`
//   } catch (error) {
//     return target
//   }
// }
