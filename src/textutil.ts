export const bold = (text: string) => `<b>${text}</b>`
export const italic = (text: string) => `<i>${text}</i>`
export const code = (text: string) => `<code>${text}</code>`
export const pre = (text: string) => `<pre>${text}</pre>`
export const underline = (text: string) => `<u>${text}</u>`
export const strikethrough = (text: string) => `<s>${text}</s>`
export const link = (text: string, url: string) => `<a href="${url}">${text}</a>`
export const quote = (text: string) => `<blockquote>${text}</blockquote>`
export const mention = (text: string, user_id: number) =>
  `<a href="tg://user?id=${user_id}">${text}</a>`
