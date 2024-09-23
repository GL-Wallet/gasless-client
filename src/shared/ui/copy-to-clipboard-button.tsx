import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import { PropsWithClassname } from '../types/react';
import { CheckCheck, Copy } from 'lucide-react';
import { ButtonHTMLAttributes } from 'react';
import { Button } from './button';
import { cn } from '../lib/utils';

type Props = {
  value?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const CopyToClipboardButton = ({ value, className, ...props }: PropsWithClassname<Props>) => {
  const { copy, isCopied } = useCopyToClipboard();

  return (
    <Button onClick={() => value && copy(value)} variant={'outline'} className={cn('w-full', className)} {...props}>
      {isCopied ? <CheckCheck className="size-5 mr-2" /> : <Copy className="size-5 mr-2" />}
      <span>Copy to clipboard</span>
    </Button>
  );
};
