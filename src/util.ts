export const removeHashtagsMentions = (text?: string) => {
	if (!text) return

	return text.replaceAll(/[#@]\S+/g, "").trim()
}

export const chunkArray = <T>(chunkSize: number, array: T[]) => {
	const result = []

	for (let i = 0; i < array.length; i += chunkSize) {
		result.push(array.slice(i, i + chunkSize))
	}

	return result
}
