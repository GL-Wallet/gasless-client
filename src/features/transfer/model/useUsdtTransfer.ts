import { getPrivateKeyFromPasscode, useWallet } from '@/entities/wallet';
import { tronService } from '@/kernel/tron';
import { useCallback } from 'react';
import { api } from '@/kernel/api';

type TransferTrc20Props = {
  recipientAddress: string;
  depositAddress: string;
  transferAmount: number;
  transactionFee: number;
  userPasscode: string;
  optimization: boolean;
};

export const useTrc20Transfer = () => {
  const wallet = useWallet();

  const transferUsdt = useCallback(
    async ({
      recipientAddress,
      depositAddress,
      transferAmount,
      transactionFee,
      userPasscode,
      optimization
    }: TransferTrc20Props) => {
      try {
        const privateKey = getPrivateKeyFromPasscode(wallet.encryptedMnemonic, userPasscode);
        const accountEnergy = await tronService.getAccountEnergy(wallet.address, privateKey);

        const requiredEnergy = await api.getEnergyRequirementsByAddress(recipientAddress);

        if (accountEnergy >= requiredEnergy - 10 || !optimization) {
          return tronService.sendUsdt(recipientAddress, transferAmount, privateKey);
        }

        const signedUsdtTransaction = await tronService.createAndSignTrc20Transaction(
          recipientAddress,
          transferAmount,
          privateKey
        );
        const signedTrxTransaction = await tronService.createAndSignTrxTransaction(
          depositAddress,
          transactionFee,
          privateKey
        );

        return (await api.transfer({ signedTrxTransaction, signedUsdtTransaction })).txid;
      } catch (error) {
        console.error('Error transferring TRC-20 token:', error);
        throw error;
      }
    },
    [wallet.address, wallet.encryptedMnemonic]
  );

  return {
    transferUsdt
  };
};