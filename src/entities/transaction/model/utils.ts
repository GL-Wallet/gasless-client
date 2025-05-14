import type { Transaction, TrxResponse, UsdtResponse } from './types'

import { AVAILABLE_TOKENS } from '@/shared/enums/tokens'

import { TronWeb } from 'tronweb'
import { TRONSCAN_TRANSACTION_BASE_URL } from '../constants'

export function formatDate(date: Date, options: Intl.DateTimeFormatOptions, locales: string = navigator.language) {
  const formatter = new Intl.DateTimeFormat(locales, options)
  return formatter.format(date)
}

export const isSentByWallet = (from: string, walletAddress: string): boolean => from === walletAddress

export function extractTransactionData(response: TrxResponse | UsdtResponse): Transaction | null {
  if ('transaction_id' in response) {
    const { transaction_id, block_timestamp, from, to, value } = response as UsdtResponse
    return {
      txid: transaction_id,
      token: AVAILABLE_TOKENS.USDT,
      amount: +value / 1e6,
      from,
      to,
      timestamp: block_timestamp,
    }
  }
  else if (response?.raw_data?.contract?.at(0)?.parameter?.value.amount) {
    const { txID, block_timestamp, raw_data } = response as TrxResponse
    const contract = raw_data.contract[0]
    const value = contract.parameter.value.amount || 0
    const from = TronWeb.address.fromHex(contract.parameter.value.owner_address)
    const to = TronWeb.address.fromHex(contract.parameter.value.to_address ?? '')

    return {
      txid: txID,
      token: AVAILABLE_TOKENS.TRX,
      amount: value / 1e6,
      from,
      to,
      timestamp: block_timestamp,
    }
  }
  else {
    return null
  }
}

export function getTronscanLink(txid: string | undefined) {
  return [TRONSCAN_TRANSACTION_BASE_URL, txid].join('/')
}

export function getTransactionLink(txid: string | undefined) {
  return [import.meta.env.VITE_GASLESS_TX_BASE_URL, txid].join('/')
}
