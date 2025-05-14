import type { BatchInputFormValues } from '../Batch.typings'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { TronWeb } from 'tronweb'
import { BatchInputFormValuesSchema } from '../Batch.typings'

interface Props {
  onSubmit: (values: BatchInputFormValues) => void
}

interface TxLike {
  address: string
  amount: number
}

interface TxLikeInvalid {
  address: any
  amount: any
}

export function usePrepareBatch({ onSubmit }: Props) {
  const form = useForm<BatchInputFormValues>({
    resolver: zodResolver(BatchInputFormValuesSchema),
    defaultValues: {
      value: '',
    },
  })

  const processBatchInput = (value: string) => {
    const lines = value.split('\n')
    const keyValuePairs = lines.map(line => line.split(/\s+/))
    const parsedKeyValuePairs = keyValuePairs.map(([key, value]) => [key, Number(value?.replace(',', '.'))])

    const valid: TxLike[] = []
    const invalid: TxLikeInvalid[] = []

    for (const [key, value] of parsedKeyValuePairs) {
      if (!key && !value) {
        continue
      }

      const isValidAddress = TronWeb.isAddress(key)
      const isValidNumber
        = typeof value === 'number'
          && !Number.isNaN(value)
          && value > 0

      if (isValidAddress && isValidNumber) {
        valid.push({
          address: key as string,
          amount: +value,
        })
      }
      else {
        invalid.push({
          address: key,
          amount: value,
        })
      }
    }

    return { valid, invalid }
  }

  const submit = form.handleSubmit(onSubmit)

  return { form, submit, processBatchInput }
}
