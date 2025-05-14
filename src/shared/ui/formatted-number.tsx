import numeral from 'numeral'

export function FormattedNumber({ number }: { number: string | number | undefined }) {
  if (!number) {
    return 0
  }
  const value = Number.parseFloat(number as string)

  return numeral(value).format('0,0.[0000]').replace(/,/g, ' ')
}
