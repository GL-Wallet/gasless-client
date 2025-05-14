export function normalizeNumber(value: number): number {
  return Number.isNaN(value) ? 0 : value
}
