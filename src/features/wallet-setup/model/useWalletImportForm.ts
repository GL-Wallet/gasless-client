import { useQRScanner } from '@telegram-apps/sdk-react';
import { navigate } from 'wouter/use-browser-location';
import { zodResolver } from '@hookform/resolvers/zod';
import { ROUTES } from '@/shared/constants/routes';
import { useImportWallet } from './useImportWallet';
import { importWalletFormSchema } from './schema';
import { tronService } from '@/kernel/tron';
import { useForm } from 'react-hook-form';
import { useCallback } from 'react';
import { z } from 'zod';

const SeedPhraseLength = 12;

export const useWalletImportForm = () => {
  const { importWallet } = useImportWallet();
  const qrScanner = useQRScanner();

  const form = useForm<z.infer<typeof importWalletFormSchema>>({
    resolver: zodResolver(importWalletFormSchema),
    defaultValues: {
      seedPhrase: ''
    }
  });

  const handleSubmit = useCallback(
    async (values: z.infer<typeof importWalletFormSchema>) => {
      const { seedPhrase } = values;

      if (seedPhrase.trim().split(' ').length !== SeedPhraseLength) {
        form.setError('seedPhrase', { message: 'Wrong seed phrase.' });
        return;
      }

      try {
        await importWallet(seedPhrase.trim());
        navigate(ROUTES.HOME);
      } catch {
        form.setError('seedPhrase', { message: 'Wrong seed phrase.' });
      }
    },
    [form, importWallet]
  );

  const handleQRCodeScanned = useCallback(
    (valueFromQRCode: string) => {
      const wallet = tronService.restoreWallet(valueFromQRCode);
      const mnemonic = wallet?.mnemonic?.phrase;

      if (mnemonic) {
        form.setValue('seedPhrase', mnemonic);
      }
    },
    [form]
  );

  const handleOpenQRScanner = useCallback(async () => {
    try {
      const valueFromQRCode = await qrScanner.open();
      if (typeof valueFromQRCode === 'string') {
        handleQRCodeScanned(valueFromQRCode);
      }
    } catch (error) {
      console.error('Error scanning QR code:', error);
    } finally {
      qrScanner.close();
    }
  }, [qrScanner, handleQRCodeScanned]);

  return {
    form,
    onSubmit: form.handleSubmit(handleSubmit),
    handleOpenQRScanner
  };
};
