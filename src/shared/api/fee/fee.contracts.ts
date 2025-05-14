import { z } from 'zod'

export const FeesRangeDtoSchema = z.object({
  asset: z.string(),
  network: z.string(),
  unit: z.string(),
  minFee: z.number(),
  maxFee: z.number(),
  networkMinFee: z.number(),
  networkMaxFee: z.number(),
})

export const FeesDepositAddressDtoSchema = z.object({
  asset: z.string(),
  network: z.string(),
  address: z.string(),
})
