/* eslint-disable react/no-nested-component-definitions */
import type { Wallet } from '@/entities/wallet'
import { useWalletStore } from '@/entities/wallet'
import { cn } from '@/shared/lib/utils'
import AnimatedShinyText from '@/shared/magicui/animated-shiny-text'

import { Avatar } from '@/shared/ui/avatar'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/shared/ui/drawer'
import { Separator } from '@/shared/ui/separator'
import { Check, ChevronDown, Wallet2, X } from 'lucide-react'
import React, { memo, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { AddWalletDrawer } from './AddWalletDrawer'

const MemoizedAddWalletDrawer = memo(AddWalletDrawer)

export function WalletManagerDrawer() {
  const [isOpened, setIsOpened] = useState(false)

  const { t } = useTranslation()

  const { walletName, activeIndex, addresses, setActiveWallet } = useWalletStore(store => ({
    walletName: store.addresses[store.activeIndex].name,
    activeIndex: store.activeIndex,
    addresses: store.addresses,
    setActiveWallet: store.setActiveWallet,
  }))

  const memoizedWalletName = useMemo(() => walletName, [walletName]) // Memoize walletName

  const handleOpenDrawer = useCallback(() => setIsOpened(true), []) // Memoize the function
  const handleCloseDrawer = () => setIsOpened(false)

  const handleSelectWallet = (idx: number) => {
    handleCloseDrawer()
    setActiveWallet(idx)
  }

  const MemoizedDrawerTrigger = React.memo(({ onClick, walletName }: { onClick: () => void, walletName: string }) => (
    <DrawerTrigger onClick={onClick} className="outline-none w-fit">
      <div
        className={cn(
          'group rounded-full bg-transparent border border-neutral-300 dark:border-input dark:bg-card/40 text-md transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800',
        )}
      >
        <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
          <span className="flex items-center space-x-2">
            <Wallet2 className="size-5" />
            <span>{walletName}</span>
          </span>
          <ChevronDown className="ml-1 size-5 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
        </AnimatedShinyText>
      </div>
    </DrawerTrigger>
  ))

  return (
    <Drawer open={isOpened} onOpenChange={setIsOpened}>
      <MemoizedDrawerTrigger onClick={handleOpenDrawer} walletName={memoizedWalletName!} />

      <DrawerContent className="min-h-[50%] px-4 pb-8#37373790">
        <DrawerClose className="absolute top-4 right-4" asChild onClick={handleCloseDrawer}>
          <X className="text-muted-foreground" />
        </DrawerClose>

        <DrawerHeader>
          <DrawerTitle>{t('wallet.manager.title')}</DrawerTitle>
        </DrawerHeader>

        <div className="space-y-2 rounded-xl border border-input py-2">
          {addresses.map((wallet, idx) => (
            <WalletItem
              wallet={wallet}
              isActive={activeIndex === idx}
              isLast={idx === addresses.length - 1}
              onClick={() => handleSelectWallet(idx)}
              key={idx}
            />
          ))}
        </div>

        <DrawerFooter className="px-0">
          <MemoizedAddWalletDrawer />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function WalletItem({
  wallet,
  isActive,
  isLast,
  onClick,
}: {
  wallet: Wallet
  isActive: boolean
  isLast: boolean
  onClick: () => void
}) {
  return (
    <>
      <div className="flex items-center justify-between w-full px-6 py-2" onClick={() => onClick()}>
        <div className="flex items-center space-x-4">
          <Avatar className="flex items-center justify-center bg-secondary">
            <Wallet2 className="size-5" />
          </Avatar>

          <span>{wallet.name}</span>
        </div>

        <div className="flex space-x-2">{isActive && <Check className="h-4 w-4" />}</div>
      </div>
      {!isLast && <Separator />}
    </>
  )
}
