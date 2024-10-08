import { AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { navigate } from 'wouter/use-browser-location';

import { ROUTES } from '@/shared/constants/routes';
import AnimatedShinyText from '@/shared/magicui/animated-shiny-text';
import ShinyButton from '@/shared/magicui/shiny-button';
import { Alert, AlertTitle } from '@/shared/ui/alert';

export const WalletCreationSuccessPage = () => {
  const { t } = useTranslation();

  return (
    <div className="h-full flex flex-col justify-between items-center">
      <div>
        <h3 className="text-2xl text-center font-bold mt-16 primary-gradient">{t('wallet.setup.success.title')}</h3>
        <div className="mt-3 text-muted-foreground max-w-72 space-y-5">
          <div className='space-y-2'>
            <AnimatedShinyText className='text-nowrap'>{t('wallet.setup.success.primaryDescription.1')}</AnimatedShinyText>
            <AnimatedShinyText>{t('wallet.setup.success.primaryDescription.2')}</AnimatedShinyText>
          </div>
          <Alert className="bg-card/20 text-muted-foreground">
            <AlertCircle className="size-4" color="gray" />
            <AlertTitle className="text-[12px]">{t('wallet.setup.success.secondaryDescription')}</AlertTitle>
          </Alert>
        </div>
      </div>

      <ShinyButton
        onClick={() => navigate(ROUTES.HOME)}
        animate={false}
        text={t('wallet.setup.success.button')}
        className="w-full"
      />
    </div>
  );
};
