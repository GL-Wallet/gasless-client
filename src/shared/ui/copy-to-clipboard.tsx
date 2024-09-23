import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import { CheckCheck, Copy } from 'lucide-react';

type Props = {
  value: string;
  size?: number;
};

export const CopyToClipboard = ({ value, size = 5 }: Props) => {
  const { copy, isCopied } = useCopyToClipboard();

  return !isCopied ? (
    <Copy className={`size-${size}`} onClick={() => copy(value)} />
  ) : (
    <CheckCheck className={`size-${size}`} />
  );
};
