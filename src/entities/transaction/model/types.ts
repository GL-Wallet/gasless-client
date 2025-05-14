import type { AVAILABLE_TOKENS } from '@/shared/enums/tokens'

export interface TrxResponse {
  txID: string
  block_timestamp: number
  raw_data: {
    contract: Array<{
      parameter: {
        value: {
          amount?: number
          owner_address: string
          to_address?: string
          contract_address?: string
          data?: string
        }
      }
      type: string
    }>
  }
}

export interface UsdtResponse {
  transaction_id: string
  block_timestamp: number
  from: string
  to: string
  value: string
  type: string
  token_info: {
    name: string
    symbol: string
    decimals: number
    address: string
  }
}

export interface Transaction {
  txid: string
  token: AVAILABLE_TOKENS
  amount: number
  from: string
  to: string
  timestamp: number
}
