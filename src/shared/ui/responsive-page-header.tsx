import { ComponentProps } from 'react';

import { cn } from '../lib/utils';
import { PageHeader } from './page-header';

export const ResponsivePageHeader = ({ className, ...props }: ComponentProps<typeof PageHeader>) => {
  return (
    <div className={cn('h-1/6 w-full flex justify-center items-center', className)}>
      <PageHeader {...props} />
    </div>
  );
};
