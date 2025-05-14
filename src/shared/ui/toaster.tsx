import { Toaster as BaseToaster } from 'react-hot-toast'

export function Toaster() {
  return <BaseToaster toastOptions={{ style: { background: '#000000', color: '#ffffff' } }} />
}
