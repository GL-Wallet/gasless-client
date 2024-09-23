import { cn } from '../lib/utils';
import { PageHeader } from './page-header';
import { ComponentProps } from 'react';

export const ResponsivePageHeader = ({ className, ...props }: ComponentProps<typeof PageHeader>) => {
  return (
    <div className={cn('h-1/6 flex justify-center items-center', className)}>
      <PageHeader {...props} />
    </div>
  );
};
