// const backend_url = "http://localhost:8000/api"
const backend_url = "https://javiqueuelist.cloud/api"

chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: "options.html" })
})

/* ------------------------------------------------------------------ *
 * cookie capture
 *
 * closing the last incognito window destroys that profile's cookie store,
 * so chrome.cookies can only answer while the queue window is still open —
 * which is exactly when we are racing it. instead, snapshot the Cookie
 * header off the queue-it request as it goes out. by the time the queue id
 * is captured the cookie is already banked, and nothing can take it away.
 * ------------------------------------------------------------------ */

const QUEUE_URLS = ["*://*.queue-it.net/*"]
const COOKIE_TTL = 5 * 60 * 1000

const cookieCache = new Map() // tabId -> { cookie, ts }

function rememberCookie(tabId, cookie) {
  if (tabId == null || tabId < 0 || !cookie) return
  cookieCache.set(tabId, { cookie, ts: Date.now() })
  // mirror into session storage: an mv3 service worker can be torn down and
  // restarted between the request and the send, which would empty the map
  if (chrome.storage && chrome.storage.session) {
    chrome.storage.session.set({ ["qc_" + tabId]: cookie }).catch(() => {})
  }
  for (const [id, v] of cookieCache) {
    if (Date.now() - v.ts > COOKIE_TTL) cookieCache.delete(id)
  }
}

async function recallCookie(tabId) {
  const hit = cookieCache.get(tabId)
  if (hit) return hit.cookie
  if (chrome.storage && chrome.storage.session) {
    try {
      const key = "qc_" + tabId
      const got = await chrome.storage.session.get(key)
      if (got[key]) return got[key]
    } catch (error) {}
  }
  return ""
}

const extraInfo = ["requestHeaders"]
// chrome hides Cookie unless extraHeaders is opted into; firefox has no such
// option and rejects it, so only add it where the enum exists
if (chrome.webRequest.OnBeforeSendHeadersOptions && chrome.webRequest.OnBeforeSendHeadersOptions.EXTRA_HEADERS) {
  extraInfo.push("extraHeaders")
}

chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    if (!details.requestHeaders) return
    const header = details.requestHeaders.find((h) => h.name.toLowerCase() === "cookie")
    if (header && header.value) rememberCookie(details.tabId, header.value)
  },
  { urls: QUEUE_URLS },
  extraInfo
)

// last-resort path, only reachable while the window is still open
async function cookieFromStore(senderTabId, senderIsIncognito) {
  const stores = await chrome.cookies.getAllCookieStores()
  let store = stores.find((st) => st.tabIds && st.tabIds.includes(senderTabId))
  if (!store && senderIsIncognito) {
    // chrome's CookieStore is only { id, tabIds } and has no `incognito` flag,
    // so on chrome the private store is found by elimination; firefox does expose it
    store = stores.find((st) => st.incognito === true) || stores.find((st) => st.id !== "0")
  }
  if (!store) return ""
  const cookies = await chrome.cookies.getAll({ domain: "queue-it.net", storeId: store.id })
  return cookies.map((c) => `${c.name}=${c.value}`).join("; ")
}

let trackDebuggerAdded = []
chrome.runtime.onMessage.addListener((m, s, sr) => {
  if (m.ref == "solveCap") {
    let tabId = s.tab.id
    let { x, y } = m
    if (!trackDebuggerAdded.includes(tabId)) {
      chrome.debugger.attach({ tabId }, "1.3", () => {
        trackDebuggerAdded.push(tabId)
        clickAt(tabId, x, y)
      })
    } else {
      clickAt(tabId, x, y)
    }

    function clickAt(tabId, x, y) {
      chrome.debugger.sendCommand({ tabId }, "Input.dispatchMouseEvent", {
        type: "mousePressed",
        x,
        y,
        button: "left",
        clickCount: 1,
      })
      chrome.debugger.sendCommand({ tabId }, "Input.dispatchMouseEvent", {
        type: "mouseReleased",
        x,
        y,
        button: "left",
        clickCount: 1,
      })
    }
    sr("true")
  } else if (m.ref == "sendToServer") {
    // read the sender off the event synchronously — by the time the awaits below
    // resolve the tab may already be gone
    const senderTabId = s.tab?.id
    const senderIsIncognito = s.tab?.incognito

    ;(async () => {
      if (!m.req_body || !m.req_url) {
        return sr({ ok: false, reason: "missing req_url/req_body" })
      }

      let source = "webRequest"
      let cookie = await recallCookie(senderTabId)
      if (!cookie) {
        source = "cookieStore"
        cookie = await cookieFromStore(senderTabId, senderIsIncognito)
      }

      // never post an empty cookie — /add rejects it with 400
      if (!cookie) {
        console.warn("[queue-lister] no cookie captured for tab", senderTabId, "- skipping")
        return sr({ ok: false, reason: "no cookies" })
      }

      try {
        const r = await fetch(backend_url + "/queue/add", {
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            req_url: m.req_url,
            req_body: m.req_body,
            original_queue_url: m.original_queue_url,
            cookie,
          }),
          method: "POST",
        })
        const body = await r.json().catch(() => null)
        if (!r.ok) console.warn("[queue-lister] /add failed", r.status, body)
        else console.log("[queue-lister] /add", r.status, "via", source, body)
        sr({ ok: r.ok, status: r.status, body })
      } catch (error) {
        console.warn("[queue-lister] /add request error", error)
        sr({ ok: false, reason: String(error) })
      }
    })()

    // keep the message channel open so content.js only closes the window once the
    // POST has come back
    return true
  }
})
