import { Button } from './button';
import { MouseEvent } from 'react';
import { PropsWithClassname } from '@/shared/types/react';
import { ScanLine } from 'lucide-react';
import { initQRScanner } from '@telegram-apps/sdk-react';

type Props = {
  setValue(value: string): void;
  size?: number;
};

export const QrScannerButton = ({ setValue, size = 5, className }: PropsWithClassname<Props>) => {
  const qrScanner = initQRScanner();

  const handleScan = async (e: MouseEvent) => {
    e.preventDefault();

    try {
      const valueFromQRCode = await qrScanner.open();
      if (typeof valueFromQRCode === 'string') {
        setValue(valueFromQRCode);
      }
    } catch (error) {
      console.error('Error scanning QR code:', error);
    } finally {
      qrScanner.close();
    }
  };

  return (
    <Button onClick={handleScan} variant={'ghost'} size={'icon'} className={className}>
      <ScanLine className={`size-${size}`} />
    </Button>
  );
};
