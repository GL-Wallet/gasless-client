import CryptoJS from 'crypto-js'

export function generateRandomString(length = 16) {
  const randomBytes = CryptoJS.lib.WordArray.random(length)

  return randomBytes.toString(CryptoJS.enc.Hex).slice(0, length)
}
