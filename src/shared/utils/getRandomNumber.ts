export function getRandomNumber(from: number = 0, to: number = 100) {
  return Math.floor(from + Math.random() * to)
}
