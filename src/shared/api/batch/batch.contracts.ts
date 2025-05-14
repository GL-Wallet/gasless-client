import { z } from 'zod'

export const BatchTxDtoSchema = z.object({
  id: z.string(),
  address: z.string(),
  amount: z.number(),
  status: z.enum(['IDLE', 'PENDING', 'SUCCESS', 'FAILED']).optional(),
})

export const BatchDtoSchema = z.object({
  id: z.string(),
  status: z.enum(['IDLE', 'PENDING', 'SUCCESS', 'FAILED', 'PARTIALLY_COMPLETED']),
  txs: z.array(BatchTxDtoSchema),
})

export const BatchesDtoSchema = z.array(BatchDtoSchema)

export const CreateBatchDtoSchema = z.object({
  feeTx: z.object({}),
  txs: z.array(z.object({})),
})

export const UpdateBatchDtoSchema = z.object({
  feeTx: z.object({}),
  txs: z.array(z.object({ id: z.string() })),
})
