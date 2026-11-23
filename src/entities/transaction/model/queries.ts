import type { AVAILABLE_TOKENS } from '@/shared/enums/tokens'

import type { Transaction, TrxResponse, UsdtResponse } from './types'
import { USDT_CONTRACT_ADDRESS } from '@/kernel/tron/config'
import { TRONGRID_BASE_API_URL, TRONGRID_HEADERS } from '@/shared/constants'

import axios from 'axios'
import { extractTransactionData } from './utils'

function buildUrl(address: string, tokenType: AVAILABLE_TOKENS): string {
  const baseUrl = `${TRONGRID_BASE_API_URL}/accounts/${address}/transactions`
  return tokenType === 'USDT' ? `${baseUrl}/trc20` : baseUrl
}

export async function fetchTransactionList(
  address: string,
  tokenType: AVAILABLE_TOKENS,
  {
    limit,
    ...params
  }: {
    limit?: number
    only_confirmed?: boolean
    only_unconfirmed?: boolean
  } = { limit: 200 },
): Promise<Transaction[]> {
  const url = buildUrl(address, tokenType)
  const { data } = await axios.get<{ data: unknown }>(url, {
    headers: TRONGRID_HEADERS,
    params: {
      limit,
      ...params,
      // Without this filter any TRC-20 (including spam tokens) is listed as USDT.
      ...(tokenType === 'USDT' && { contract_address: USDT_CONTRACT_ADDRESS }),
    },
  })
  const transactions = data.data as (TrxResponse | UsdtResponse)[]

  return transactions
    .map(transaction => extractTransactionData(transaction))
    .filter(t => t !== null)
}
