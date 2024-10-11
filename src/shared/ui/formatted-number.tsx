import { FormattedNumber as BaseFormattedNumber } from 'react-intl';

export const FormattedNumber = ({ number }: { number: string | number | undefined }) => {
  if (!number) {
    return 0;
  }

  return (
    <BaseFormattedNumber
      value={parseFloat(number as string)}
      style="decimal"
      minimumFractionDigits={0}
      maximumFractionDigits={2}
      maximumSignificantDigits={5}
      useGrouping={true}
      roundingMode={'trunc'}
    />
  );
};
