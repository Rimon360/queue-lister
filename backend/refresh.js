import { getRandomInRange, wait } from "./util.js"

// const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000/api"
const BACKEND_URL = process.env.BACKEND_URL || "https://javiqueuelist.cloud/api"
processQueue()
async function processQueue(queues, concurrency = 20) {
  let index = 0

  async function worker() {
    while (true) {
      const i = index++

      if (i >= queues.length) return

      const queue = queues[i]

      try {
        await fetch(BACKEND_URL + "/queue/status", {
          method: "POST",
          body: JSON.stringify({
            req_url: queue.req_url,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        })
      } catch (error) {
        console.error("Failed:", queue.req_url, error)
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, queues.length) }, worker))
}
