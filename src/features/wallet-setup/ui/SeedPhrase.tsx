import { PropsWithClassname } from '@/shared/types/react';
import { cn } from '@/shared/lib/utils';
import { EyeOff } from 'lucide-react';
import { useState } from 'react';

type Props = {
  seedPhrase: string[] | null;
  onHideMask?: () => void;
};

export const SeedPhrase = ({ seedPhrase, onHideMask, className }: PropsWithClassname<Props>) => {
  const [isShowMask, setIsShowMask] = useState(true);

  if (!seedPhrase) return null;

  const handleHideMask = () => {
    setIsShowMask(false);
    onHideMask && onHideMask();
  };

  return (
    <div className="relative grow flex flex-col justify-center space-y-3">
      <div className={cn('relative flex flex-wrap gap-2 justify-center h-fit w-fit', className)}>
        {seedPhrase?.map((word, idx) => (
          <div
            className="text-base flex items-center justify-center rounded-md border dark:border-neutral-700 dark:bg-secondary/20 px-1 h-12 flex-shrink-0 min-w-[30%] max-w-fit whitespace-nowrap"
            key={idx}
          >
            {idx + 1}. {word}
          </div>
        ))}
        <Mask isShowMask={isShowMask} onClick={handleHideMask} />
      </div>
    </div>
  );
};

const Mask = ({ isShowMask, onClick }: { isShowMask: boolean; onClick: () => void }) => {
  return (
    isShowMask && (
      <div
        onClick={onClick}
        className="absolute flex flex-col justify-center items-center top-0 bottom-0 right-0 left-0 rounded-xl border bg-secondary dark:bg-black/95"
      >
        <EyeOff className="h-9 w-9" />
        <div className="mt-2 text-center">
          <h3 className="text-lg font-medium">Tap to reveal your seed phrase</h3>
          <p className="text-sm text-muted-foreground">Make sure no one is watching your screen.</p>
        </div>
      </div>
    )
  );
};
