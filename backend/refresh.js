import { getRandomInRange, wait } from "./util.js"

// const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000"
const BACKEND_URL = process.env.BACKEND_URL || "https://javiqueuelist.cloud/api"

;(async () => {
  while (true) {
    try {
      let result = await fetch(BACKEND_URL + "/queue/get")
      const queues = await result.json()
      let startAt = Date.now()
      let n = 0 
      for (const queue of queues) {
        console.log(queue.req_url);
        
        try { 
          let result = await fetch(BACKEND_URL + "/queue/status", { method: "POST", body: JSON.stringify({ req_url: queue.req_url }), headers: { "Content-Type": "application/json" } })
          console.log(result) 
          await wait(getRandomInRange(0.05, 0.07))
          // console.log('Done...', n++);
        } catch (error) {
          console.log(error)
        }
      }
      // console.log("total time ms:", Date.now() - startAt)

      // let v = getRandomInRange(2, 4)
      // await wait(v)
    } catch (error) {
      console.log(error)
    }
  }
})()
