import type { z } from 'zod'
import type { FeesDepositAddressDtoSchema, FeesRangeDtoSchema } from './fee.contracts'

export type FeesRangeDto = z.infer<typeof FeesRangeDtoSchema>
export type FeesDepositAddressDto = z.infer<typeof FeesDepositAddressDtoSchema>
