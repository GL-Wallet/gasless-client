import { QrCode } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import QRCode from 'react-qr-code';

import { Button } from '@/shared/ui/button';
import { CopyToClipboard } from '@/shared/ui/copy-to-clipboard';
import {
	Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerTitle, DrawerTrigger
} from '@/shared/ui/drawer';

interface WalletReceiveDrawerProps {
  address: string;
}

export const WalletReceiveDrawer: React.FC<WalletReceiveDrawerProps> = ({ address }) => {
  const { t } = useTranslation();

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="space-x-2 h-12" variant="ghost" size={'icon'}>
          <QrCode className="size-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="mt-6 flex flex-col items-center space-y-8 px-6 pb-6">
        <DrawerTitle>{t('receive.title')}</DrawerTitle>
        <div className="p-4 border border-input rounded-md bg-transparent">
          <QRCode value={address} size={200} />
        </div>

        <div className="flex space-x-2">
          <p className="text-[13px]">{address}</p>
          <CopyToClipboard value={address} />
        </div>

        <DrawerFooter className="w-full px-0">
          <DrawerClose asChild>
            <Button variant="outline">{t('receive.button.close')}</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
