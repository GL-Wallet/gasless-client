import { PropsWithClassname } from '../types/react';
import { cn } from '../lib/utils';
import { ReactNode } from 'react';

type Props = {
  title?: ReactNode;
  description?: ReactNode;
};

export const PageHeader = ({ title, description, className }: PropsWithClassname<Props>) => {
  return (
    <header className={cn('space-y-1 text-center', className)}>
      <h2 className="text-2xl primary-gradient font-bold">{title}</h2>
      <p className="text-base text-muted-foreground">{description}</p>
    </header>
  );
};
