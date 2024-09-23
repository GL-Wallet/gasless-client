export type TransferInfoResponse = {
  address: string;
  fee: number;
  optimization: boolean;
};

export type ExchangeInfoResponse = {
  rate: number;
  minAmount: number;
  fee: number;
  balance: number;
  optimization: boolean;
};

export type ExchangeResponse = {
  txid: string;
};

export type TransferResponse = {
  txid: string;
};

export type ClaimRewardResponse = {
  txid: string;
  amount: number;
};
