import { ROUTES } from '@/shared/constants/routes'
import ShinyButton from '@/shared/magicui/shiny-button'

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/shared/ui/drawer'
import { LinkItem } from '@/shared/ui/link-item'
import { Import, Plus, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const Actions = [
  {
    title: 'wallet.manager.action.new.title',
    description: 'wallet.manager.action.new.description',
    icon: <Plus className="h-7 w-7" strokeWidth={4} />,
    href: ROUTES.WALLET_CUSTOMIZATION,
  },
  {
    title: 'wallet.manager.action.exists.title',
    description: 'wallet.manager.action.exists.description',
    icon: <Import className="h-7 w-7" />,
    href: ROUTES.WALLET_IMPORT,
  },
]

export function AddWalletDrawer() {
  const { t } = useTranslation()

  return (
    <Drawer>
      <div className="flex justify-center">
        <DrawerTrigger asChild>
          <ShinyButton text={t('wallet.manager.add.button.addWallet')} className="w-full" />
        </DrawerTrigger>
      </div>

      <DrawerContent className="px-4 h-1/2">
        <DrawerClose className="absolute top-4 right-4" asChild>
          <X className="text-muted-foreground" />
        </DrawerClose>

        <DrawerHeader>
          <DrawerTitle>{t('wallet.manager.add.title')}</DrawerTitle>
        </DrawerHeader>

        <div className="space-y-2">
          {Actions.map(({ title, description, icon, href }, idx) => (
            <LinkItem href={href} title={t(title)} description={t(description)} icon={icon} key={idx} />
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
