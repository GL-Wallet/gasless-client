import { cn } from '@/shared/lib/utils';
import { PropsWithClassname } from '@/shared/types/react';
import { Mask } from '@/shared/ui/mask';

type Props = {
  seedPhrase: string[] | null;
  onHideMask?: () => void;
};

export const SeedPhrase = ({ seedPhrase, onHideMask, className }: PropsWithClassname<Props>) => {
  if (!seedPhrase) return null;

  return (
    <div className="relative grow flex flex-col justify-center space-y-3">
      <div className={cn('relative h-fit w-fit flex flex-wrap gap-2 justify-center rounded-lg', className)}>
        {seedPhrase?.map((word, idx) => (
          <div
            className="text-base flex items-center justify-center rounded-md border dark:border-neutral-700 dark:bg-secondary/20 px-1 h-12 flex-shrink-0 min-w-[30%] max-w-fit whitespace-nowrap"
            key={idx}
          >
            {idx + 1}. {word}
          </div>
        ))}
        <Mask onHideMask={onHideMask} />
      </div>
    </div>
  );
};
