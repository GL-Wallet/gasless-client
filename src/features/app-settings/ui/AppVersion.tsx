import { useEffect, useState } from 'react';

import { version } from '../../../../package.json';

export const AppVersion = () => {
  const [count, setCount] = useState(0);

  const handleInitEruda = () => {
    import('eruda').then((eruda) => eruda.default.init());
  };

  const handleHideEruda = () => {
    import('eruda').then((eruda) => eruda.default.destroy());
  };

  useEffect(() => {
    if (count === 3) {
      handleInitEruda();
    }
    if (count === 6) {
      handleHideEruda();
      setCount(0);
    }
  }, [count]);

  return (
    <p onClick={() => setCount((prev) => prev + 1)} className="text-sm text-muted-foreground">
      App version: {version}
    </p>
  );
};
