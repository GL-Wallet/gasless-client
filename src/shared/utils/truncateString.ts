export function truncateString(str: string, maxLength: number) {
  if (str.length <= maxLength) {
    return str
  }
  return `${str.slice(0, maxLength - 3)}...${str.slice(str.length - maxLength + 3)}`
}
