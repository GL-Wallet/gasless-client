import { ENERGY_REQUIRED_FOR_USDT_TRANSFER } from '../constants';
import { getPrivateKey, useWallet } from '@/entities/wallet';
import { pollForEnergy } from './pollForEnergy';
import { tronService } from '@/kernel/tron';
import { api } from '@/kernel/api';

export const useEnergyRequest = () => {
  const wallet = useWallet();
  const privateKey = getPrivateKey();

  const getRequiredValues = (isLowCost: boolean) => ({
    requiredEnergy: isLowCost ? ENERGY_REQUIRED_FOR_USDT_TRANSFER : ENERGY_REQUIRED_FOR_USDT_TRANSFER * 2
  });

  const requestEnergy = async <T>(callback: () => Promise<T>, receiverAddress: string): Promise<T | undefined> => {
    if (!privateKey) return;

    try {
      const receiverBalances = await tronService.getBalances(receiverAddress, privateKey);
      const accountEnergy = await tronService.getAccountEnergy(wallet.address, privateKey);

      // need an accurate check that the recipient's account will not require a high level of energy.
      const isLowCost = receiverBalances.USDT > 0;
      const { requiredEnergy } = getRequiredValues(isLowCost);

      const { address, fee } = await api.transferInfo();
      const requiredTrx = isLowCost ? fee : fee * 2;

      if (accountEnergy >= requiredEnergy) {
        return await callback();
      } else if (wallet.balances.TRX >= requiredTrx) {
        await tronService.sendTrx(address, requiredTrx, privateKey);

        try {
          const success = await pollForEnergy(
            tronService.getAccountEnergy,
            wallet.address,
            privateKey,
            accountEnergy,
            requiredEnergy
          );
          if (success) {
            return await callback();
          }
        } catch (error) {
          console.error('Polling failed:', error);
        }
      }
    } catch (error) {
      console.error('Error in reduceFees:', error);
      return undefined;
    }
  };

  return { requestEnergy };
};
