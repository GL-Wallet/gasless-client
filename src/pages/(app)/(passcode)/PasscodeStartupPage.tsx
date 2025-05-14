import { useAppSettingsStore } from '@/entities/app-settings'
import { useSignOut } from '@/features/wallet-setup'
import { PasscodeRequired, useAuth } from '@/kernel/auth'

import { ROUTES } from '@/shared/constants/routes'
import { AnimatedSubscribeButton } from '@/shared/magicui/animated-subscribe-button'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/ui/alert-dialog'
import { Button } from '@/shared/ui/button'
import { CheckIcon, ChevronRightIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { navigate } from 'wouter/use-browser-location'

export function PasscodeStartupPage() {
  const isBiometryEnabled = useAppSettingsStore(store => store.isBiometryEnabled)
  const { _passcodeHash, _onPasscodeSuccess } = useAuth()

  const { t } = useTranslation()

  const { signOut } = useSignOut()

  const handleReset = () => {
    // temporary
    // await api.unsubscribeAll();

    signOut()
    navigate(ROUTES.WALLET_SETUP)
  }

  const handleSuccess = (passcode: string) => {
    _onPasscodeSuccess(passcode)
  }

  return (
    <div className="relative flex-1 flex flex-col justify-between items-center space-y-8">
      <PasscodeRequired
        isBiometryEnabled={isBiometryEnabled}
        passcodeHash={_passcodeHash}
        onPasscodeSuccess={handleSuccess}
      />

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="w-full" variant="outline">
            {t('setting.signOut.button.signOut')}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="max-w-[90%] rounded-md">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('setting.signOut.modal.title')}</AlertDialogTitle>
            <AlertDialogDescription>{t('setting.signOut.modal.description')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('setting.signOut.modal.button.cancel')}</AlertDialogCancel>

            <AnimatedSubscribeButton
              buttonColor="#000000"
              buttonTextColor="#ffffff"
              subscribeStatus={false}
              className="w-full"
              onClick={() => handleReset()}
              initialText={(
                <span className="group inline-flex items-center">
                  {t('setting.signOut.modal.button.signOut.initial')}
                  <ChevronRightIcon className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              )}
              changeText={(
                <span className="group inline-flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4" />
                  {t('setting.signOut.modal.button.signOut.confirm')}
                </span>
              )}
            />
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
