import type { FeesDepositAddressDto, FeesRangeDto } from './fee.types'
import { AxiosContracts } from '@/shared/lib/v2/axios'
import { router } from 'react-query-kit'
import { api } from '..'
import { FeesDepositAddressDtoSchema, FeesRangeDtoSchema } from './fee.contracts'

export const fee = router('fees', {
  getFeesDepositAddress: router.query<FeesDepositAddressDto, { network: string, asset: string }>({
    fetcher: ({ network, asset }) => api.get(`fees/deposit-address`, { params: { network, asset } })
      .then(AxiosContracts.responseContract(FeesDepositAddressDtoSchema)),
  }),

  getFeesRange: router.query<FeesRangeDto, { network: string, asset: string }>({
    fetcher: ({ network, asset }) => api.get(`fees/range`, { params: { network, asset } })
      .then(AxiosContracts.responseContract(FeesRangeDtoSchema)),
  }),
})
