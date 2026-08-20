/**
 * Returns a random number between min and max (inclusive)
 * @param {number} min - The minimum value
 * @param {number} max - The maximum value
 * @returns {number} A random number between min and max
 */
module.exports.getRandomInRange = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Returns a promise that resolves after the specified number of seconds
 * @param {number} seconds - The number of seconds to wait
 * @returns {Promise} A promise that resolves after the specified delay
 */
module.exports.wait = (seconds) => {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000))
}

module.exports.parseCookie = (setCookieHeader) => {
  return setCookieHeader
    .split(/,\s*(?=[^;,]+=)/)
    .map((cookie) => cookie.split(";")[0].trim())
    .join("; ")
}

module.exports.removeCookieByName = (cookieHeader, names) => {
  const namesSet = new Set(names);

  return cookieHeader
    .split(";")
    .filter(cookie => {
      const cookieName = cookie.trim().split("=")[0];
      return !namesSet.has(cookieName);
    })
    .join("; ");
}
module.exports.getCookieNames = (cookieHeader) => {
  return cookieHeader
    .split(";")
    .map((cookie) => cookie.trim().split("=")[0])
    .filter(Boolean)
}
