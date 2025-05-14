import { createDialogPromiser } from '@/shared/lib/dialog-promise'
import ShinyButton from '@/shared/magicui/shiny-button'
import { Button } from '@/shared/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/shared/ui/drawer'
import { useTranslation } from 'react-i18next'

export const AskConfirmTx = createDialogPromiser({
  Component({ resolve, reject }) {
    const { t } = useTranslation()

    return (
      <Drawer open={true} onClose={reject}>
        <DrawerContent className="px-6 h-fit">
          <DrawerHeader>
            <DrawerTitle className="pt-4">{t('transfer.confirm')}</DrawerTitle>
          </DrawerHeader>
          <DrawerFooter className="space-y-2 mt-8">
            <ShinyButton text={t('transfer.button.sign')} onClick={resolve} />
            <DrawerClose asChild>
              <Button variant="outline" onClick={reject}>
                {t('transfer.button.reject')}
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  },
})
