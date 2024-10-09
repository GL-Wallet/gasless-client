import '@/shared/lib/i18n';

import { Buffer } from 'buffer';
import { createRoot } from 'react-dom/client';

import { App } from './App';

if (typeof globalThis.Buffer === 'undefined') {
  globalThis.Buffer = Buffer;
}

createRoot(document.getElementById('root')!).render(<App />);
