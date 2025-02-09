import { COBALT_INSTANCE_URL } from "./environment"

export const checkCobaltInstance = async () => {
	try {
		const infoRequest = await fetch(COBALT_INSTANCE_URL)
		if (infoRequest.status !== 200) {
			throw new Error("Invalid cobalt instance url")
		}

		return (await infoRequest.json()) as CobaltInfo
	} catch {}

	return false
}

const cobaltInstanceInfo = await checkCobaltInstance()
if (cobaltInstanceInfo) {
	console.log(
		`Cobalt instance found, version ${cobaltInstanceInfo.cobalt.version}`,
	)
}

const cobaltRegexes = [
	// tiktok photo slides
	/^(?:https:\/\/)?(?:www\.)?tiktok\.com\/@\w+\/photo\/\d+.*/,

	// instagram posts
	// /^(?:https:\/\/)?(?:www\.)?instagram\.com\/p\/.+$/,
]

export const cobaltMatcher = (url: string) => {
	if (!cobaltInstanceInfo) return false
	return cobaltRegexes.findIndex((regex) => regex.test(url)) > -1
}

export const cobaltResolver = async (url: string) => {
	const infoRequest = await fetch(COBALT_INSTANCE_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: JSON.stringify({ url }),
	})

	return (await infoRequest.json()) as CobaltResolved
}

// -----------------------------------------------------------------------------

export type CobaltResolved =
	| {
			status: "picker"
			audio?: string
			audioFilename?: string
			picker: {
				type: "photo" | "video" | "gif"
				url: string
				thumb?: string
			}[]
	  }
	| {
			status: "error"
			error: {
				code: string
				context?: {
					service?: string
					limit?: number
				}
			}
	  }
	| {
			status: "redirect" | "tunnel"
			url: string
			filename: string
	  }

export type CobaltInfo = {
	cobalt: {
		version: string
		url: string
		startTime: string
		durationLimit: number
		services: string[]
	}
	git: {
		branch: string
		commit: string
		remote: string
	}
}
