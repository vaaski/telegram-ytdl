type GenericFunction = (...parameters: unknown[]) => unknown

export class Queue {
	private queue: GenericFunction[] = []
	private running = false

	private run = async (executor: GenericFunction) => {
		try {
			await executor()
		} catch (error) {
			console.log(error)
		}
	}
	private bump = async () => {
		if (this.running) return
		this.running = true

		while (this.queue.length > 0) {
			const nextUp = this.queue.shift()
			if (!nextUp) break

			await this.run(nextUp)
		}

		this.running = false
	}

	add = <F extends GenericFunction>(executor: F) => {
		this.queue.push(executor)
		this.bump()
	}
}
