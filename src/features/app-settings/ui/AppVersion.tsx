import eruda from 'eruda';
import { useEffect, useState } from 'react';

export const AppVersion = () => {
  const [count, setCount] = useState(0);

  const handleInitEruda = () => {
    eruda.init();
  };

  const handleHideEruda = () => {
    eruda.destroy();
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
      App version: {import.meta.env.VITE_APP_VERSION}
    </p>
  );
};
