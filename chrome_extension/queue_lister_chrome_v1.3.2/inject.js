const OriginalXHR = window.XMLHttpRequest
let trackUrl = []
let domain = "https://" + location.hostname
window.XMLHttpRequest = function () {
  const xhr = new OriginalXHR()

  // Store the original methods
  const originalOpen = xhr.open
  const originalSend = xhr.send

  // Store URL and method for later use, status url
  let requestUrl = ""

  xhr.open = function (method, url) {
    requestUrl = url
    // Call original open with all arguments
    return originalOpen.apply(xhr, arguments)
  }

  xhr.send = function (data) {
    if (!trackUrl.includes(requestUrl) && data && data?.includes("isClientRedayToRedirect") && data.includes("targetUrl")) {
      trackUrl.push(domain + requestUrl)
      let span = document.querySelector("#queueIdLinkURL")
      if (span && span.innerText.includes("&q=")) {
        window.postMessage({ req_url: domain + requestUrl, req_body: data, original_queue_url: span.innerText }, "*")
      }
    }
    // Modify data if needed
    const modifiedData = data // Replace with your modification logic

    // Call original send with modified data
    return originalSend.call(xhr, modifiedData)
  }

  return xhr
}
