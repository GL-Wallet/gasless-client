import { CircleAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { SpinnerLoader } from '@/shared/ui/spinner-loader/spinner-loader';

export const TransactionInProgress = () => {
  const { t } = useTranslation();

  return (
    <div className="relative h-full flex flex-col items-center">
      <Alert className="top-5">
        <CircleAlert className="h-4 w-4" />
        <AlertTitle>{t("transaction.progress.title")}</AlertTitle>
        <AlertDescription>{t("transaction.progress.description")}</AlertDescription>
      </Alert>

      <div className="grow flex items-center">
        <SpinnerLoader />
      </div>
    </div>
  );
};
