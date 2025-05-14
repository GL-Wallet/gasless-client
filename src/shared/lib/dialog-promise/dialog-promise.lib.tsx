import type { ReactNode } from 'react'
import { useDialogControllerStore } from './dialog-promise.model'

export type ResolveCallback<TResult> = TResult extends void
  ? () => void
  : (result: TResult) => void
export type RejectCallback = () => void

export interface PromiseComponentProps<
  TResult,
  TArgs extends Record<string, unknown> | undefined = undefined,
> {
  resolve: ResolveCallback<TResult>
  reject: RejectCallback
  args: TArgs
}

export function createDialogPromiser<
  // eslint-disable-next-line ts/no-unnecessary-type-constraint
  TResult extends unknown = void,
  TArgs extends Record<any, any> | undefined = undefined,
>({
  Component,
}: {
  Component: (props: PromiseComponentProps<TResult, TArgs>) => ReactNode
}) {
  const usePromise = () => {
    const {
      openDialog,
      closeDialog,
      addOnCloseListener,
      removeOnCloseListener,
    } = useDialogControllerStore()

    return (args: TArgs) => {
      return new Promise<TResult>((resolvePromise, rejectPromise) => {
        const reject = () => {
          removeOnCloseListener(reject)
          // eslint-disable-next-line prefer-promise-reject-errors
          rejectPromise()
          closeDialog()
        }

        const resolve = (result: TResult) => {
          removeOnCloseListener(reject)
          resolvePromise(result)
          closeDialog()
        }

        addOnCloseListener(reject)
        openDialog(
          <Component
            args={args}
            resolve={resolve as ResolveCallback<TResult>}
            reject={reject}
          />,
        )
      })
    }
  }

  const promise = () => {
    const {
      openDialog,
      closeDialog,
      addOnCloseListener,
      removeOnCloseListener,
    } = useDialogControllerStore.getState()

    return (args: TArgs) => {
      return new Promise<TResult>((resolvePromise, rejectPromise) => {
        const reject = () => {
          removeOnCloseListener(reject)
          // eslint-disable-next-line prefer-promise-reject-errors
          rejectPromise()
          closeDialog()
        }

        const resolve = (result: TResult) => {
          removeOnCloseListener(reject)
          resolvePromise(result)
          closeDialog()
        }

        addOnCloseListener(reject)
        openDialog(
          <Component
            args={args}
            resolve={resolve as ResolveCallback<TResult>}
            reject={reject}
          />,
        )
      })
    }
  }

  type UsePromiseType = TArgs extends undefined
    ? () => () => Promise<TResult>
    : () => (args: TArgs) => Promise<TResult>

  return { usePromise: usePromise as UsePromiseType, promise: promise as UsePromiseType }
}
