import { Toaster as BaseToaster } from 'react-hot-toast';

export const Toaster = () => {
  return <BaseToaster toastOptions={{ style: { background: '#000000', color: '#ffffff' } }} />;
};
