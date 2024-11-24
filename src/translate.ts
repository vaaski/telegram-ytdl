import OpenAI from "openai"
import { OPENAI_API_KEY } from "./environment"

import { existsSync } from "node:fs"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))

type Translations = Record<string, Record<string, string>>

const SAVED_TRANSLATION_FILE = resolve(
	__dirname,
	"../storage/saved-translations.json",
)
await mkdir(dirname(SAVED_TRANSLATION_FILE), { recursive: true })
if (!existsSync(SAVED_TRANSLATION_FILE)) {
	console.log("Creating saved translations file")
	await writeFile(SAVED_TRANSLATION_FILE, "{}")
}

const savedTranslations: Translations = JSON.parse(
	await readFile(SAVED_TRANSLATION_FILE, "utf-8"),
)

export const translateText = async (text: string, lang: string) => {
	if (OPENAI_API_KEY === "") return text

	if (savedTranslations[text]?.[lang]) return savedTranslations[text][lang]

	const client = new OpenAI()

	const response = await client.chat.completions.create({
		model: "gpt-4o-mini",
		messages: [
			{
				role: "system",
				content: `Translate text to the following IETF language tag: ${lang}.
					Keep the HTML formatting. Do not add any other text or explanations`,
			},
			{ role: "user", content: text },
		],
		temperature: 0.2,
		max_tokens: 256,
	})

	const translated = response.choices[0]?.message.content

	if (!translated) return text

	if (!savedTranslations[text]) savedTranslations[text] = {}
	savedTranslations[text][lang] = translated

	await writeFile(
		SAVED_TRANSLATION_FILE,
		JSON.stringify(savedTranslations, undefined, 2),
	)

	return translated
}
