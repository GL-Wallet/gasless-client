import type { ButtonHTMLAttributes } from 'react'
import type { PropsWithClassname } from '../types/react'
import { CheckCheck, Copy } from 'lucide-react'

import { useTranslation } from 'react-i18next'
import { useCopyToClipboard } from '../hooks/useCopyToClipboard'
import { cn } from '../lib/utils'
import { Button } from './button'

type Props = {
  value?: string
} & ButtonHTMLAttributes<HTMLButtonElement>

export function CopyToClipboardButton({ value, className, ...props }: PropsWithClassname<Props>) {
  const { copy, isCopied } = useCopyToClipboard()

  const { t } = useTranslation()

  return (
    <Button onClick={() => value && copy(value)} variant="outline" className={cn('w-full', className)} {...props}>
      {isCopied ? <CheckCheck className="size-5 mr-2" /> : <Copy className="size-5 mr-2" />}
      <span>{t('shared.copyToClipbard')}</span>
    </Button>
  )
}
