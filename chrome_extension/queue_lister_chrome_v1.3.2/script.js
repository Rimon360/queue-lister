;(async function () {
  // init websocket
  try {
    const title = document.querySelector(".container h2")

    async function set(k, v) {
      await chrome.storage.local.set({ [k]: v })
    }
    async function get(k) {
      return (await chrome.storage.local.get(k))[k] || ""
    }
    async function wait(s) {
      return new Promise((rs) => {
        setTimeout(() => {
          rs()
        }, s * 1000)
      })
    }
    async function sendToServer(msg) {
      fetch("http://localhost:8000/queue/add", {
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          req_url:
            "https://oneboxtm.queue-it.net/spa-api/queue/oneboxtm/rmchampions2526/79208912-2fd2-4759-a079-0811ea20334d/status?cid=es-ES&l=Real%20Madrid%20Responsive-2022&seid=81a7eff0-162d-bba3-e694-e9e698606729&sets=1760643471001",
          req_body:
            '{"targetUrl":"https://tickets.realmadrid.com/realmadrid_champions/select/2590482?viewCode=V_1027","customUrlParams":"","layoutVersion":177799491714,"layoutName":"Real Madrid Responsive-2022","isClientRedayToRedirect":true,"isBeforeOrIdle":false}',
        }),
        method: "POST",
      })
        .then((r) => r.json())
        .then((r) => {
          console.log(r)
        })
    }

    let win_id = 0
    async function openProfile(url) {
      await chrome.windows.create(
        {
          url: url,
          incognito: true,
          focused: true,
          width: 500, // Set width
          height: 600, // Set height
          left: 0,
          top: 0,
        },
        (n_win) => {
          // allow private mode
          win_id = n_win.id
        },
      )
    }
    let id = []
    const inputText = document.querySelector("#inputText")
    const toggleBtn = document.querySelector("#toggleBtn")
    const reload = document.querySelector("#reload")

    let timeout
    inputText.oninput = function () {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        set("queue_url", inputText.value)
      }, 200)
    }

    load()
    async function load() {
      let text = await get("queue_url")
      inputText.value = text
    }

    toggleBtn.onclick = async function () {
      this.innerText = "Starting..."
      let urls = (await get("queue_url")).split(",")
      let url = urls[0]
      let count = 0
      id = []
      while (true) {
        if (!url.trim()) continue
        await openProfile(url)
        count++
        this.innerText = `Running (${count})`
        await new Promise((rs) => {
          chrome.runtime.onMessage.addListener((m, s, sr) => {
            if (m.ref == "r_url") {
              if (!id.includes(m.id)) {
                // sendToServer(m.id)
              }
              id.push(m.id)
              rs()
            } else if (m.ref == "r_skip") {
              rs()
            }
            sr()
          })
        })
        chrome.windows.remove(win_id)
        await wait(2) // 4s was
      }
    }

    reload.onclick = () => {
      location.reload()
    }

    // handle auto click

    chrome.runtime.onMessage.addListener((m, s, sr) => {
      // if (m.ref == "r_click") {
      //   if (socket.OPEN) {
      //     socket.send("R_CLICK");
      //   } else {
      //     console.log("Websocket closed.. refresh the page or check the server");
      //   }
      // }
      sr()
    })
  } catch (error) {
    alert("Something wrong happend")
    console.log(error)
  }
})()
