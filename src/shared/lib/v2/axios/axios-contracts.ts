import type { AxiosResponse } from 'axios'
import type { ZodType } from 'zod'
import { AxiosValidationError } from './axios-errors'

export class AxiosContracts {
  public static requestContract<Data>(schema: ZodType<Data>, data: Data) {
    const validation = schema.safeParse(data)

    if (validation.error) {
      throw new AxiosValidationError(undefined, undefined, undefined, validation.error.errors)
    }

    return validation.data
  }

  public static responseContract<Data>(schema: ZodType<Data>) {
    return (response: AxiosResponse<Data>) => {
      const validation = schema.safeParse(response.data)

      if (validation.error) {
        throw new AxiosValidationError(response.config, response.request, response, validation.error.errors)
      }

      return validation.data as Data
    }
  }
}
