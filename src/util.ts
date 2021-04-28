import got from "got"

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

// interface shortenerResponse {
//   slug: string
//   target: string
// }

// export const shortURL = async (target: string): Promise<string> => {
//   try {
//     const json = { target }
//     const data = (await got
//       .post("https://shr.li/@/create", { json, timeout: 2000 })
//       .json()) as shortenerResponse

//     return `https://shr.li/${data.slug}`
//   } catch (error) {
//     return target
//   }
// }
