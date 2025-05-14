import { EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export function Mask({ onHideMask }: { onHideMask?: () => void }) {
  const [isShowMask, setIsShowMask] = useState(true)
  const { t } = useTranslation()

  const handleHideMask = () => {
    setIsShowMask(false)
    onHideMask && onHideMask()
  }

  return (
    isShowMask && (
      <div
        onClick={handleHideMask}
        className="absolute flex flex-col justify-center items-center top-0 bottom-0 right-0 left-0 border bg-secondary dark:bg-black/95"
        style={{ borderRadius: 'inherit' }}
      >
        <EyeOff className="h-9 w-9" />
        <div className="mt-2 text-center">
          <h3 className="text-sm font-medium">{t('shared.mask.title')}</h3>
          <p className="text-[12px] text-muted-foreground">{t('shared.mask.description')}</p>
        </div>
      </div>
    )
  )
}
