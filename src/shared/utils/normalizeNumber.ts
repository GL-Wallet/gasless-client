export function normalizeNumber(value: number): number {
  return isNaN(value) ? 0 : value;
}
