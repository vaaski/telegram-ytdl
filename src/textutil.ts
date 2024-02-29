export const removeHashtagsMentions = (text?: string) => {
  if (!text) return

  return text.replaceAll(/[#@][\w0-\\]+/g, "").trim()
}
