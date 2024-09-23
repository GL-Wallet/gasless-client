import { Button } from '@/shared/ui/button';
import { PropsWithChildren } from 'react';

export const SubmitButton = ({ children }: PropsWithChildren) => {
  return (
    <Button className="dark:text-white bg-secondary/80 dark:border-neutral-500" variant={'outline'} type="submit">
      {children}
    </Button>
  );
};
