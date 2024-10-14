import numeral from 'numeral';

export const FormattedNumber = ({ number }: { number: string | number | undefined }) => {
  if (!number) {
    return 0;
  }
  const value = parseFloat(number as string);

  return numeral(value).format('0,0.[0000]').replace(/,/g, ' ');
};
