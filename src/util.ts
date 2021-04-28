import got from "got"

export const getContentLength = async (url: string): Promise<number> => {
  const data = await got.head(url)

  return parseInt(data.headers["content-length"] ?? "0")
}

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
