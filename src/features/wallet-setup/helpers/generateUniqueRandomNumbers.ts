import { getRandomNumber } from '@/shared/utils/getRandomNumber'

export function generateUniqueRandomNumbers(count: number, from: number, to: number) {
  const numbers = new Set<number>()

  while (numbers.size < count) {
    numbers.add(getRandomNumber(from, to))
  }

  return Array.from(numbers)
}
