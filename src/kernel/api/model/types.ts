export interface TransferInfoResponse {
  address: string
  fee: number
  optimization: boolean
}

export interface ExchangeInfoResponse {
  rate: number
  minAmount: number
  fee: number
  balance: number
  optimization: boolean
}

export interface ExchangeResponse {
  txid: string
}

export interface TransferResponse {
  txid: string
}

export interface ClaimRewardResponse {
  txid: string
  amount: number
}
