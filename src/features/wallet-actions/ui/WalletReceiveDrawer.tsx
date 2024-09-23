import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerTitle, DrawerTrigger } from '@/shared/ui/drawer';
import { CopyToClipboard } from '@/shared/ui/copy-to-clipboard';
import { Button } from '@/shared/ui/button';
import { QrCode } from 'lucide-react';
import QRCode from 'react-qr-code';
import React from 'react';

interface WalletReceiveDrawerProps {
  address: string;
}

export const WalletReceiveDrawer: React.FC<WalletReceiveDrawerProps> = ({ address }) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="space-x-2 h-12" variant="ghost" size={'icon'}>
          <QrCode className="size-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="mt-6 flex flex-col items-center space-y-8 px-6 pb-6">
        <DrawerTitle>Wallet Address</DrawerTitle>
        <div className="p-4 border border-input rounded-md bg-transparent">
          <QRCode value={address} size={200} />
        </div>

        <div className="flex space-x-2">
          <p className="text-[13px]">{address}</p>
          <CopyToClipboard value={address} />
        </div>

        <DrawerFooter className="w-full px-0">
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
