import { ROUTES } from '@/shared/constants/routes';
import { importWalletFormSchema } from './schema';
import { initQRScanner } from '@telegram-apps/sdk-react';
import { navigate } from 'wouter/use-browser-location';
import { tronService } from '@/kernel/tron';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useImportWallet } from './useImportWallet';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const SeedPhraseLength = 12;

export const useWalletImportForm = () => {
  const { isLoading, importWallet } = useImportWallet();
  const qrScanner = initQRScanner();

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
      if (valueFromQRCode) {
        handleQRCodeScanned(valueFromQRCode);
      }
    } catch (error) {
      console.error('Error scanning QR code:', error);
    } finally {
      qrScanner.close();
    }
  }, [qrScanner, handleQRCodeScanned]);

  return {
    isLoading,
    form,
    onSubmit: form.handleSubmit(handleSubmit),
    handleOpenQRScanner
  };
};
