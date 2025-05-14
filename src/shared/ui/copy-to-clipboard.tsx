import { CheckCheck, Copy } from 'lucide-react'
import { useCallback } from 'react' // Import useCallback

import { useCopyToClipboard } from '../hooks/useCopyToClipboard'

interface Props {
  value: string
  size?: number
}

export function CopyToClipboard({ value, size = 5 }: Props) {
  const { copy, isCopied } = useCopyToClipboard()

  // Memoize the copy function
  const handleCopy = useCallback(() => {
    copy(value)
  }, [copy, value])

  return !isCopied
    ? (
        <Copy className={`size-${size}`} onClick={handleCopy} />
      )
    : (
        <CheckCheck className={`size-${size}`} />
      )
}
