import { ENERGY_REQUIRED_FOR_USDT_TRANSFER } from '@/entities/energy/constants';
import { getPrivateKeyFromPasscode, useWallet } from '@/entities/wallet';
import { TransferTransactionPayloadDTO } from './types';
import { useUserStore } from '@/entities/user';
import { tronService } from '@/kernel/tron';
import { useCallback } from 'react';
import { api } from '@/kernel/api';

type TransferTrc20Props = {
  recipientAddress: string;
  depositAddress: string;
  transferAmount: number;
  transactionFee: number;
  userPasscode: string;
};

export const useTrc20Transfer = () => {
  const wallet = useWallet();
  const user = useUserStore((store) => store.user);

  const transferUsdt = useCallback(
    async ({ recipientAddress, depositAddress, transferAmount, transactionFee, userPasscode }: TransferTrc20Props) => {
      try {
        const privateKey = getPrivateKeyFromPasscode(wallet.encryptedMnemonic, userPasscode);
        const accountEnergy = await tronService.getAccountEnergy(wallet.address, privateKey);

        // temporary need request from backend
        const isRecipientHasUsdt = (await tronService.getBalances(recipientAddress, privateKey)).USDT > 0;
        const requiredEnergy = isRecipientHasUsdt
          ? ENERGY_REQUIRED_FOR_USDT_TRANSFER
          : ENERGY_REQUIRED_FOR_USDT_TRANSFER * 2;

        if (accountEnergy >= requiredEnergy - 10) {
          return tronService.sendUsdt(recipientAddress, transferAmount, privateKey);
        }

        if (!user) return;

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

        const transferData: TransferTransactionPayloadDTO = {
          signedTrxTransaction,
          signedUsdtTransaction
        };

        // temporary
        return (await api.transfer({ transactionPayload: transferData, userId: user.id })).txid;
      } catch (error) {
        console.error('Error transferring TRC-20 token:', error);
        throw error;
      }
    },
    [user, wallet.address, wallet.encryptedMnemonic]
  );

  return {
    transferUsdt
  };
};
