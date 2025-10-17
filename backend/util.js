/**
 * Returns a random number between min and max (inclusive)
 * @param {number} min - The minimum value
 * @param {number} max - The maximum value
 * @returns {number} A random number between min and max
 */
export function getRandomInRange(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Returns a promise that resolves after the specified number of seconds
 * @param {number} seconds - The number of seconds to wait
 * @returns {Promise} A promise that resolves after the specified delay
 */
export function wait(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000))
}
