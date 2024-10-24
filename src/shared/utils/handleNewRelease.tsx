import { RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

import i18n from '../lib/i18n';

const FILENAME = 'RELEASE';

export const handleNewRelease = async () => {
  const resourceURL = `/${FILENAME}?v=${new Date().getTime().toString()}`;

  try {
    if (typeof window !== 'undefined') {
      const res = await fetch(resourceURL);
      const releaseId = await res.text();

      const releaseIdFromStorage = localStorage.getItem(FILENAME);

      if (releaseId !== releaseIdFromStorage) {
        localStorage.setItem(FILENAME, releaseId);
        if (releaseId) {
          toast(i18n.t('shared.toast.newVersion'), {
            className: 'text-sm border',
            icon: <RefreshCw className="size-4 text-green-400 animate-spin" />
          });

          await new Promise((res) => setTimeout(res, 1000));

          console.log('New release detected. Reloading page');

          window.location.reload(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            true // https://developer.mozilla.org/en-US/docs/Web/API/Location/reload#forceget
          );
        }
      } else {
        console.log('No new release detected.');
      }
    }
  } catch {
    console.error('error', 'An error occurred while verifying release id');
  }
};
