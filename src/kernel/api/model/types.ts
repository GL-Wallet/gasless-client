export type TransferInfoResponse = {
  address: string;
  fee: number;
};

export type ExchangeInfoResponse = {
  rate: number;
  minAmount: number;
  fee: number;
  balance: number;
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
