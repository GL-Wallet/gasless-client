import { PropsWithClassname } from '../types/react';
import { cn } from '../lib/utils';

type Props = {
  title?: string;
  description?: string;
};

export const PageHeader = ({ title, description, className }: PropsWithClassname<Props>) => {
  return (
    <header className={cn('space-y-1 text-center', className)}>
      <h2 className="text-2xl primary-gradient font-bold">{title}</h2>
      <p className="text-base text-muted-foreground">{description}</p>
    </header>
  );
};
