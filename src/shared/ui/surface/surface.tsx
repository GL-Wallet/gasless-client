import styles from './styles.module.css';
import { cn } from '@/shared/lib/utils';
import { PropsWithChildren } from 'react';

export const Surface = ({ children, className }: PropsWithChildren<{ className?: string }>) => {
  return (
    <div className={cn(styles.outer, className)}>
      <div className={styles.card}>{children}</div>
    </div>
  );
};
