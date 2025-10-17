import { getRandomInRange, wait } from "./util.js"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000"

;(async () => {
  while (true) {
    process.stdout.write(".")
    let result = await fetch(BACKEND_URL + "/queue/get")
    const queues = await result.json()
    for (const queue of queues) {
      await fetch(BACKEND_URL + "/queue/status", { method: "POST", body: JSON.stringify({ req_url: queue.req_url }), headers: { "Content-Type": "application/json" } })
      await wait(getRandomInRange(0.1, 0.5))
    }
    let v = getRandomInRange(5, 6)
    await wait(v)
  }
})()
