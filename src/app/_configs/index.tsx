import { MiniAppConfig } from './MiniAppConfig';
import { PropsWithChildren } from 'react';

export const Configs = (props: PropsWithChildren) => {
  return <MiniAppConfig>{props.children}</MiniAppConfig>;
};
