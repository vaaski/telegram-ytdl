export const removeHashtagsMentions = (text?: string) => {
	if (!text) return

	return text.replaceAll(/[#@]\S+/g, "").trim()
}
