import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import type { ZodIssue } from 'zod'
import { AxiosError } from 'axios'

export class AxiosValidationError<T = unknown, D = any> extends AxiosError {
  static readonly ERR_BAD_VALIDATION = 'ERR_BAD_VALIDATION'

  constructor(
    config?: InternalAxiosRequestConfig<D>,
    request?: any,
    response?: AxiosResponse<T, D>,
    readonly errors?: ZodIssue[],
  ) {
    super(
      'The provided data does not meet the required criteria.',
      AxiosValidationError.ERR_BAD_VALIDATION,
      config,
      request,
      response,
    )
  }
}
