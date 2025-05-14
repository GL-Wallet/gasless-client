import type { BatchDto, BatchesDto, CreateBatchDto, UpdateBatchDto } from './batch.types'
import { AxiosContracts } from '@/shared/lib/v2/axios'
import { router } from 'react-query-kit'
import { api } from '..'
import { BatchDtoSchema, BatchesDtoSchema } from './batch.contracts'

export const batch = router('batch', {
  getBatches: router.query<BatchesDto, unknown>({
    fetcher: () => api.get(`batch`).then(AxiosContracts.responseContract(BatchesDtoSchema)),
  }),
  getBatch: router.query<BatchDto, { batchId: string }>({
    fetcher: ({ batchId }) => api.get(`batch/${batchId}`).then(AxiosContracts.responseContract(BatchDtoSchema)),
  }),
  getRetryableBatch: router.query<BatchDto, { batchId: string }>({
    fetcher: ({ batchId }) => api.get(`batch/retryable/${batchId}`).then(AxiosContracts.responseContract(BatchDtoSchema)),
  }),
  updateBatch: router.mutation<unknown, { batchId: string, signal?: AbortSignal } & UpdateBatchDto>({
    mutationFn: ({ batchId, signal, ...dto }) => api.post(`batch/${batchId}`, dto, { signal }),
  }),
  createBatch: router.mutation<unknown, CreateBatchDto & { signal?: AbortSignal }>({
    mutationFn: ({ signal, ...dto }) => api.post(`batch`, dto, { signal }),
  }),
})
