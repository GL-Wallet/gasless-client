import { SpinnerLoader } from '@/shared/ui/spinner-loader/spinner-loader';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { CircleAlert } from 'lucide-react';

export const TransactionInProgress = () => {
  return (
    <div className="relative h-full flex flex-col items-center">
      <Alert className="top-5">
        <CircleAlert className="h-4 w-4" />
        <AlertTitle>Wait - Processing</AlertTitle>
        <AlertDescription>Your transaction is being processed. Please wait a moment.</AlertDescription>
      </Alert>

      <div className="grow flex items-center">
        <SpinnerLoader />
      </div>
    </div>
  );
};
