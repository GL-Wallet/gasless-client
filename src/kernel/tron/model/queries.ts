import { TRONGRID_BASE_API_URL } from '@/shared/constants'

import axios from 'axios'

export async function getTrxBalance(address: string): Promise<number> {
  try {
    const res = (await axios.get(`${TRONGRID_BASE_API_URL}/accounts/${address}`)).data.data?.at(0)

    const trxBalance = res.balance / 1e6

    return trxBalance
  }
  catch {
    return 0
  }
}
