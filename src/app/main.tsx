import { createRoot } from 'react-dom/client';
import { Buffer } from 'buffer';
import { App } from './App';

// temporary
import('eruda').then((eruda) => {
  eruda.default.init();
});

if (typeof globalThis.Buffer === 'undefined') {
  globalThis.Buffer = Buffer;
}

createRoot(document.getElementById('root')!).render(<App />);
