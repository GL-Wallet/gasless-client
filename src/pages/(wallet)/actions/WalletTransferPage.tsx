import { PrepareBatch } from '@/features/Batch'
import { WalletTransferForm } from '@/features/wallet-actions/transfer'
import { WalletManagerDrawer } from '@/features/wallet-setup'
import { AVAILABLE_TOKENS } from '@/shared/enums/tokens'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'

// Wrap WalletTransferForm with React.memo
const MemoizedWalletTransferForm = memo(WalletTransferForm)

export function WalletTransferPage(props: { token?: string }) {
  const { t } = useTranslation()

  const token = props.token ?? AVAILABLE_TOKENS.USDT

  return (
    <div className="relative flex-1 flex flex-col gap-6">
      <div className="flex justify-center">
        <WalletManagerDrawer />
      </div>
      <Tabs defaultValue="single" className="flex-1">
        <TabsList className="w-full">
          <TabsTrigger value="single" className="w-full text-sm px-2">{t('transfer.tabs.single')}</TabsTrigger>
          <TabsTrigger value="multiple" className="w-full text-sm px-2">{t('transfer.tabs.multiple')}</TabsTrigger>
        </TabsList>

        <TabsContent value="single" className="h-[90%]">
          <MemoizedWalletTransferForm token={token} />
        </TabsContent>

        <TabsContent value="multiple" className="h-[90%]">
          <PrepareBatch />
        </TabsContent>
      </Tabs>

    </div>
  )
}
