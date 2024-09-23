import { useCopyToClipboard } from '@/shared/hooks/useCopyToClipboard';
import { CheckCheck, Clipboard, EyeOff } from 'lucide-react';
import { PropsWithClassname } from '@/shared/types/react';
import ShinyButton from '@/shared/magicui/shiny-button';
import { useSeedPhrase } from '../model/useSeedPhrase';
import { navigate } from 'wouter/use-browser-location';
import { ROUTES } from '@/shared/constants/routes';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';
import { useState } from 'react';

export const SeedPhrase = ({ className }: PropsWithClassname) => {
  const [isShowMask, setIsShowMask] = useState(true);
  const [isDisabled, setIsDisabled] = useState(true);
  const { copy, isCopied } = useCopyToClipboard();

  const seedPhrase = useSeedPhrase();

  if (!seedPhrase) return null;

  const handleHideMask = () => {
    setIsShowMask(false);
    setIsDisabled(false);
  };

  return (
    <div className="relative grow flex flex-col justify-between space-y-3">
      <div className="grow flex flex-col justify-center space-y-3">
        <div className={cn('relative flex flex-wrap gap-2 justify-center h-fit w-fit', className)}>
          {seedPhrase?.map((word, idx) => (
            <div
              className="text-base flex items-center justify-center rounded-md border px-1 h-12 flex-shrink-0 min-w-[30%] max-w-fit whitespace-nowrap"
              key={idx}
            >
              {idx + 1}. {word}
            </div>
          ))}
          <Mask isShowMask={isShowMask} onClick={handleHideMask} />
        </div>
      </div>

      <div className="w-full space-y-4">
        <Button
          onClick={() => copy(seedPhrase.join(' '))}
          variant={'outline'}
          className="w-full space-x-2 hover:bg-transparent"
          disabled={isDisabled}
        >
          {!isCopied ? <Clipboard className="size-5" /> : <CheckCheck className="size-5" />}
          <span>{!isCopied ? 'Copy to clipboard' : 'Copied'}</span>
        </Button>

        <ShinyButton
          onClick={() => navigate(ROUTES.SEED_PHRASE_CONFIRMATION)}
          disabled={isDisabled}
          animate={false}
          text="Continue"
          className="w-full"
        />
      </div>
    </div>
  );
};

const Mask = ({ isShowMask, onClick }: { isShowMask: boolean; onClick: () => void }) => {
  return (
    isShowMask && (
      <div
        onClick={onClick}
        className="absolute flex flex-col justify-center items-center top-0 bottom-0 right-0 left-0 rounded-xl border bg-black/95"
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
