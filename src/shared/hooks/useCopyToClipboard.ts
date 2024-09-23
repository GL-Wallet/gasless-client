import copyToClipboard from 'copy-to-clipboard';
import { useState } from 'react';

export const useCopyToClipboard = () => {
  const [isCopied, setIsCopied] = useState(false);

  const copy = (value: string, timeout = 1000) => {
    setIsCopied(true);

    copyToClipboard(value);

    setTimeout(() => {
      setIsCopied(false);
    }, timeout);
  };

  return {
    isCopied,
    copy
  };
};
