import { Button } from '@/shared/ui/button'
import { CopyToClipboard } from '@/shared/ui/copy-to-clipboard'

import { useUtils } from '@telegram-apps/sdk-react'
import { ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface Props {
  userId: string | undefined
}

export function ReferralCard({ userId }: Props) {
  const { t } = useTranslation()
  const utils = useUtils()

  const shareUrl = `${import.meta.env.VITE_APP_SHARE_LINK}?startapp=${userId}`

  const handleShareInvite = () => {
    utils.shareURL(shareUrl, 'Join Gasless Wallet - a decentralized wallet on Tron that reduces gas fees by up to 50%')
  }

  return (
    <div
      className="relative flex flex-col justify-between gap-4 bg-card/60 dark:bg-secondary/60 light-border p-4 h-fit w-full rounded-lg shadow-md"
    >
      <div>
        <h4 className="text-lg font-bold primary-gradient">{t('referral.card.title')}</h4>
        <p className="text-sm primary-gradient">{t('referral.card.description')}</p>
      </div>

      <div className="flex items-center space-x-2">
        <Button onClick={handleShareInvite} className="w-full space-x-2 dark:border-neutral-700" variant="outline">
          <span className="primary-gradient">{t('referral.card.button')}</span>
          <ChevronRight className="size-4 dark:text-white" />
        </Button>
        <Button variant="outline" className="px-4">
          <CopyToClipboard value={shareUrl} size={5} />
        </Button>
      </div>
    </div>
  )
}
