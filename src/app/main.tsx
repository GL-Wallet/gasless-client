import '@/shared/lib/i18n';

import { Buffer } from 'buffer';
import { createRoot } from 'react-dom/client';

import { clearCacheData } from '@/shared/utils/clearCache';
import { isActualVersion } from '@/shared/utils/isActualVersion';

import { App } from './App';

createRoot(document.getElementById('root')!).render(<App />);

(async () => {
  if (typeof globalThis.Buffer === 'undefined') {
    globalThis.Buffer = Buffer;
  }

  if (!(await isActualVersion())) {
    clearCacheData();
    window.location.reload();
  }
})();
