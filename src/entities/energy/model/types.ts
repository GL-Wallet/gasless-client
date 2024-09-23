export type RequestEnergyFn = <T>(callback: () => Promise<T>, receiverAddress: string) => Promise<T | undefined>;
