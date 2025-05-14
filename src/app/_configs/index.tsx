import type { PropsWithChildren } from 'react'
import { MiniAppConfig } from './MiniAppConfig'

export function Configs(props: PropsWithChildren) {
  return <MiniAppConfig>{props.children}</MiniAppConfig>
}
