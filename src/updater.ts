import { updateYTDLP } from "@resync-tv/yt-dlp"
import { Cron } from "croner"
import { YTDL_AUTOUPDATE } from "./environment"

export class Updater {
	public readonly enabled = YTDL_AUTOUPDATE
	public updating: Promise<void> | false = false

	#job: Cron | null = null

	constructor() {
		console.log("Auto-update is", this.enabled ? "enabled" : "disabled")
		if (!this.enabled) return

		this.#job = new Cron("20 4 * * *", this.update)

		console.log("Next update scheduled at", this.#job.nextRun())
	}

	update = async () => {
		this.updating = this.#update()

		await this.updating
		this.updating = false
	}

	async #update() {
		console.log("updating yt-dlp")

		try {
			const result = await updateYTDLP()

			console.log(result.stdout)
			console.log("yt-dlp updated")
		} catch (error) {
			if (error instanceof Error) {
				console.error("yt-dlp update failed")
				console.error(error.message)
			}
		} finally {
			if (this.#job) {
				console.log("Next update scheduled at", this.#job.nextRun())
			}
		}
	}
}
