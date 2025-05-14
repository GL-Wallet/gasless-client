import type { ComponentType } from 'react'
import { Redirect } from 'wouter'

export function withConditionalRoute<P extends object>(Component: ComponentType<P>, condition: boolean, redirectTo: string) {
  return (props: P) => {
    return condition ? <Component {...props} /> : <Redirect href={redirectTo} />
  }
}
