import type { Thumbnail } from "@resync-tv/yt-dlp"
import { InputFile } from "grammy"

export const urlMatcher = (url: string, matcher: string) => {
	const parsed = new URL(url)
	return parsed.hostname.endsWith(matcher)
}

/**
 * Gets a fitting thumbnail for the `sendAudio` method.
 *
 * https://core.telegram.org/bots/api#sendaudio
 */
export const getThumbnail = (thumbnails?: Thumbnail[]) => {
	if (!thumbnails) return undefined

	const MAX_SIZE = 320

	// Thumbnail sizes go from smallest to largest
	const reversed = [...thumbnails].reverse()

	const match = reversed.find((thumbnail) => {
		const { width, height } = thumbnail
		if (!width || !height) return false

		return width <= MAX_SIZE && height <= MAX_SIZE
	})

	if (match) return new InputFile({ url: match.url })
}
