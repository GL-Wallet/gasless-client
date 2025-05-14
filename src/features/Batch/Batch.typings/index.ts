import { z } from 'zod'

export const BatchInputFormValuesSchema = z.object({
  value: z.string(),
})

export type BatchInputFormValues = z.infer<typeof BatchInputFormValuesSchema>
