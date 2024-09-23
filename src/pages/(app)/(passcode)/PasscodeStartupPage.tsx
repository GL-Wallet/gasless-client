import { AnimatedSubscribeButton } from '@/shared/magicui/animated-subscribe-button';
import { CheckIcon, ChevronRightIcon } from 'lucide-react';
import { PasscodeRequired, useAuth } from '@/kernel/auth';
import { navigate } from 'wouter/use-browser-location';
import { useSignOut } from '@/features/wallet-setup';
import { ROUTES } from '@/shared/constants/routes';
import { useSettingsStore } from '@/entities/settings';
import { Button } from '@/shared/ui/button';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/shared/ui/alert-dialog';

export const PasscodeStartupPage = () => {
  const isBiometryEnabled = useSettingsStore((store) => store.isBiometryEnabled);
  const { _actualPasscode, _onPasscodeSuccess } = useAuth();

  const { signOut } = useSignOut();

  const handleReset = async () => {
    signOut();
    navigate(ROUTES.WALLET_SETUP);
  };

  const handleSuccess = (passcode: string) => {
    _onPasscodeSuccess(passcode);
  };

  return (
    <div className="relative h-full flex flex-col justify-center items-center space-y-8">
      <PasscodeRequired
        isBiometryEnabled={isBiometryEnabled}
        actualPasscode={_actualPasscode}
        onPasscodeSuccess={handleSuccess}
      />

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="w-full" variant={'outline'}>
            Sign Out
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="max-w-[90%] rounded-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out of All Wallets?</AlertDialogTitle>
            <AlertDialogDescription>
              This will erase keys to all wallets. Make sure you have backed up your recovery phrases.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AnimatedSubscribeButton
              buttonColor="#000000"
              buttonTextColor="#ffffff"
              subscribeStatus={false}
              className="w-full"
              onClick={() => handleReset()}
              initialText={
                <span className="group inline-flex items-center">
                  Sign out{' '}
                  <ChevronRightIcon className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              }
              changeText={
                <span className="group inline-flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4" />
                  Signed Out{' '}
                </span>
              }
            />
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
