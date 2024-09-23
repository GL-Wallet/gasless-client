import { decryptAndGetWallet, tronService } from '@/kernel/tron';
import { navigate } from 'wouter/use-browser-location';
import { ROUTES } from '@/shared/constants/routes';
import { urlJoin } from '@/shared/utils/urlJoin';
import { useWallet } from '@/entities/wallet';
import { useAuth } from '@/kernel/auth';
import { api } from '@/kernel/api';

export const useExchange = () => {
  const { authenticate } = useAuth();
  const wallet = useWallet();

  const exchange = async (amount: number, fee: number) => {
    try {
      const passcode = await authenticate({ redirectTo: ROUTES.TRANSACTION_IN_PROGRESS });

      const { privateKey } = decryptAndGetWallet(wallet.encryptedMnemonic, passcode);
      const { address } = await api.transferInfo();

      const amountWithFee = amount + fee;

      const signedTx = await tronService.createAndSignTrc20Transaction(address, amountWithFee, privateKey);
      const { txid } = await api.exchange(signedTx);

      navigate(urlJoin(ROUTES.TRANSACTION_RESULT, txid));
    } catch (e) {
      navigate(urlJoin(ROUTES.TRANSACTION_RESULT, 'no-txid'));
    }
  };

  return {
    exchange
  };
};
