import copyToClipboard from 'copy-to-clipboard';
import { useState } from 'react';

export const useCopyToClipboard = () => {
  const [isCopied, setIsCopied] = useState(false);

  const copy = async (value: string, timeout = 1000) => {
    setIsCopied(true);

    try {
      await navigator.clipboard.writeText(value);
    } catch {
      copyToClipboard(value);
    }

    setTimeout(() => {
      setIsCopied(false);
    }, timeout);
  };

  return {
    isCopied,
    copy
  };
};
