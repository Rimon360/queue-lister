import { getRandomInRange, wait } from "./util.js"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000/api"
// const BACKEND_URL = process.env.BACKEND_URL || "https://javiqueuelist.cloud/api"
while (true) {
  try {
    const result = await fetch(BACKEND_URL + "/queue/get")
    const queues = await result.json()

    if (queues.length === 0) {
      await new Promise((rs) => setTimeout(rs, 2000))
      continue
    }
    let started_at = Date.now()

    await Promise.all(
      queues.map(async (queue) => {
        try {
          await wait(.2)
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
          console.error("Queue failed:", queue.req_url, error)
        }
      }),
    )
    let ended_at = Date.now()
    let diff = ended_at - started_at 
    if (diff < 2000) {
      // wait atleast 2 seconds before next call
      await wait((2000 - diff) / 1000)
      console.log(`Awaited: ${Date.now() - started_at}`);
      
    }
  } catch (error) {
    console.error(error)
  }
}
