export function isEqual<T>(v1: T, v2: T): boolean {
  return JSON.stringify(v1) === JSON.stringify(v2)
}
