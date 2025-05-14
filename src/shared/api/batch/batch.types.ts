import type { z } from 'zod'
import type { BatchDtoSchema, BatchesDtoSchema, BatchTxDtoSchema, CreateBatchDtoSchema } from './batch.contracts'

export type BatchesDto = z.infer<typeof BatchesDtoSchema>
export type BatchDto = z.infer<typeof BatchDtoSchema>
export type BatchTxDto = z.infer<typeof BatchTxDtoSchema>

export type CreateBatchDto = z.infer<typeof CreateBatchDtoSchema>
export type UpdateBatchDto = z.infer<typeof CreateBatchDtoSchema>
