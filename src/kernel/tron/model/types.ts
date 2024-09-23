export type PrivateKey = string;
export type WalletAddress = string;
export type TransactionID = string;
export type Amount = number;

export interface Balances {
  TRX: number;
  USDT: number;
}

export interface TransactionResponse {
  transaction: {
    txID: TransactionID;
  };
}

export type TransferFunction = (to: string, amount: number, passcode: string) => Promise<string | undefined>;
