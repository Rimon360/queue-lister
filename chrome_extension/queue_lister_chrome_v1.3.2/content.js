;(async () => {
  let countInterval = 0
  let countTotalTime = 0

  window.addEventListener("message", (message) => {
    if (!message.data.req_url) return
    let data = message.data

    // r_skip makes the options page close this window, and closing it destroys the
    // incognito cookie store that bg.js needs to read — so hold the skip until the
    // send has come back. the timeout keeps the harvester moving if bg.js goes away.
    let skipped = false
    const skip = () => {
      if (skipped) return
      skipped = true
      chrome.runtime.sendMessage({ ref: "r_skip" }, handleCallback)
    }
    const failsafe = setTimeout(skip, 15000)

    chrome.runtime.sendMessage({ ref: "sendToServer", req_url: data.req_url, req_body: data.req_body, original_queue_url: data.original_queue_url }, (res) => {
      clearTimeout(failsafe)
      handleCallback()
      if (res && res.ok === false) console.warn("[queue-lister] not added:", res.reason || res.status)
      skip()
    })
  })

  while (true) {
    countInterval++
    countTotalTime++
    if (ifCloudFlare()) {
      // && countInterval > 4
      countInterval = 0
      await solveCap()
    } else if (countTotalTime > 30) {
      // if 30 seconds has passed but no queue id fount then move to next one;
      chrome.runtime.sendMessage({ ref: "r_skip" }, handleCallback)
      break
    }
    await wait(1)
  }
})()

function handleCallback() {
  if (chrome.runtime.lastError) {
    console.log(chrome.runtime.lastError.message)
  }
}
async function solveCap() {
  let capResInput = document.querySelector('input[name="cf-turnstile-response"]')
  if (capResInput?.value != "") return true // cap is solved automatically
  await new Promise((rs) => {
    let { x, y, width, height } = capResInput.parentElement.getBoundingClientRect()

    x = x + 25
    y = y + height / 2
    chrome.runtime.sendMessage({ ref: "solveCap", x, y }, (res) => {
      rs(res)
    })
  })
  return true
}
function ifCloudFlare() {
  let cloudflareLink = document.querySelector('div[role="contentinfo"] a')?.href
  if (cloudflareLink && cloudflareLink.includes("cloudflare.com")) {
    chrome.runtime.sendMessage({ ref: "r_click" }, handleCallback)
    // setTimeout(() => {
    // }, 1000);
    return true
  }
  return false
}

async function wait(s) {
  return new Promise((rs) => {
    setTimeout(() => {
      rs()
    }, s * 1000)
  })
}
