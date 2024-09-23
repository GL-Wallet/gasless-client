import { useEffect } from 'react';

export const useEffectOnce = (cb: () => void) => {
  useEffect(() => {
    cb();
  }, [cb]);
};
