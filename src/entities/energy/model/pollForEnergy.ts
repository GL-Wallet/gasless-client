import { POLLING_INTERVAL_MS, POLLING_TIMEOUT_MS } from '../constants';

export const pollForEnergy = async (
  checkFunction: (address: string, privateKey: string) => Promise<number>,
  address: string,
  privateKey: string,
  accountEnergy: number,
  requiredEnergy: number,
  intervalMs: number = POLLING_INTERVAL_MS,
  timeoutMs: number = POLLING_TIMEOUT_MS
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const intervalId = setInterval(async () => {
      try {
        const energy = await checkFunction(address, privateKey);
        // The user can stake TRX and so all the time the energy is replenished, additional check is needed
        if (energy >= (accountEnergy + requiredEnergy - 10)) {
          clearInterval(intervalId);
          resolve(true);
        }
      } catch (error) {
        clearInterval(intervalId);
        reject(new Error(`Error checking energy: ${error}`));
      }
    }, intervalMs);

    setTimeout(() => {
      clearInterval(intervalId);
      reject(new Error('Polling timed out'));
    }, timeoutMs);
  });
};
