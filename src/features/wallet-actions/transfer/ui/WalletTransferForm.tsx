/* eslint-disable ts/no-use-before-define */
import type { TransferInfoResponse } from '@/kernel/api'
import type { Balances, TransactionID } from '@/kernel/tron/model/types'
import type { UseFormReturn } from 'react-hook-form'
import { useWallet } from '@/entities/wallet'
import { api } from '@/kernel/api'
import { useAuth } from '@/kernel/auth'
import { ROUTES } from '@/shared/constants/routes'
import { AVAILABLE_TOKENS } from '@/shared/enums/tokens'

import ShinyButton from '@/shared/magicui/shiny-button'
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert'
import { useAlert } from '@/shared/ui/alert/Alert'
import { Button } from '@/shared/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/shared/ui/drawer'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form'
import { FormattedNumber } from '@/shared/ui/formatted-number'
import { Input } from '@/shared/ui/input'
import { QrScannerButton } from '@/shared/ui/qr-scanner-button'
import { Separator } from '@/shared/ui/separator'
import { truncateString } from '@/shared/utils/truncateString'
import { urlJoin } from '@/shared/utils/urlJoin'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { CircleAlert, LucideArrowDown, Wallet2 } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { TronWeb } from 'tronweb'
import { navigate } from 'wouter/use-browser-location'
import { z } from 'zod'
import { useTrxTransfer } from '../model/useTrxTransfer'
import { useTrc20Transfer } from '../model/useUsdtTransfer'
import { TokenPicker } from './TokenPicker'
import { TrxPurchaseLink } from './TrxPurchaseLink'

// Validation schema for form fields
const tronAddressRegex = /^T[1-9A-HJ-NP-Za-km-z]{33}$/

const BANDWIDTH_COST = 0.345
const TRANSACTION_FEE = 13.5

const formSchema = z.object({
  address: z
    .string()
    .refine(address => tronAddressRegex.test(address), {
      message: 'transfer.error.invalidTrc20AddressFormat',
    })
    .refine(address => TronWeb.isAddress(address), {
      message: 'transfer.error.addressNotExist',
    }),
  amount: z.coerce
    .number()
    .positive({ message: 'transfer.error.amountMustBePositive' }),
})

type FormFields = z.infer<typeof formSchema>

interface Props {
  token: string
}

export function WalletTransferForm(props: Props) {
  const [token, setToken] = useState(props.token ?? AVAILABLE_TOKENS.USDT)
  const { transferUsdt } = useTrc20Transfer()
  const { transferTrx } = useTrxTransfer()
  const { authenticate } = useAuth()
  const { t } = useTranslation()
  const wallet = useWallet()
  const alert = useAlert()

  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: '',
      amount: '' as unknown as number,
    },
  })

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)
  const [formValues, setFormValues] = useState<FormFields>()
  const address = form.watch('address')

  const { data: transferInfo } = useQuery({
    queryKey: ['transferInfo', address],
    queryFn: () => {
      return api.transferInfo(address)
    },
    enabled: !!address && TronWeb.isAddress(address),
  })

  const { data: prevFee } = useQuery({
    queryKey: ['previous-fee', address],
    queryFn: async () => {
      const energyCount = await api.getEnergyCountByAddress(address)
      return energyCount * TRANSACTION_FEE
    },
    enabled: !!address && TronWeb.isAddress(address),
  })

  const isUsdtToken = token === AVAILABLE_TOKENS.USDT
  const isOptimizationEnabled = transferInfo?.optimization === true || transferInfo?.optimization === undefined

  const validateTransaction = useCallback(
    (values: FormFields): boolean => {
      const sourceBalance = wallet.balances[token as keyof typeof wallet.balances]
      const feeBalance = wallet.balances.TRX

      if (values.amount > sourceBalance) {
        form.setError('amount', { type: 'manual', message: t('transfer.error.insufficientBalance', { token }) })
        toast.error(t('transfer.error.notEnoughBalance'))
        return false
      }

      if (isUsdtToken && transferInfo?.fee && feeBalance < transferInfo?.fee + BANDWIDTH_COST) {
        toast.error(t('transfer.error.insufficientBalance', { token: 'TRX' }))
        return false
      }

      if (values.address === wallet.address) {
        form.setError('address', { type: 'manual', message: t('transfer.error.cannotUseOwnAddress') })
        toast.error(t('transfer.error.cannotUseOwnAddress'))
        return false
      }

      form.clearErrors('amount')
      return true
    },
    [form, isUsdtToken, t, token, transferInfo?.fee, wallet],
  )

  const handleFormSubmit = useCallback(
    (values: FormFields) => {
      if (validateTransaction(values)) {
        setFormValues(values)
        setIsDrawerOpen(true)
      }
    },
    [validateTransaction],
  )

  const handleAuthenticateAndSign = async () => {
    const passcode = await authenticate()
    if (passcode) {
      if (!formValues?.address || !formValues.amount)
        return

      try {
        const transactionId = await handleProcessTransaction(formValues.address, formValues.amount, passcode)
        navigateToTransactionResult(transactionId)
        processTransferResult(transactionId, formValues.address, formValues.amount, passcode)
      }
      catch (error) {
        console.error(`Transaction processing error:`, error)
        navigateToTransactionResult(undefined)
      }
    }
  }

  const processTransferResult = (
    txid: TransactionID | undefined,
    address: string,
    amount: number,
    passcode: string,
  ) => {
    if (!txid && token === AVAILABLE_TOKENS.USDT) {
      alert.setState({
        title: t('transfer.error.alert.title'),
        description: (
          <span>
            {t('transfer.error.alert.description')}
            {' '}
            <br />
            <span className="text-md font-bold">
              (~
              {prevFee}
              {' '}
              {AVAILABLE_TOKENS.TRX}
              )
            </span>
            ?
          </span>
        ),
      })
      alert.setIsOpen(true)
      alert.setActions({
        async handleContinue() {
          const transactionId = await handleProcessTransaction(address, amount, passcode, false)
          navigateToTransactionResult(transactionId)
        },
      })
    }
  }

  const handleProcessTransaction = useCallback(
    async (address: string, amount: number, passcode: string, optimization?: boolean): Promise<string | undefined> => {
      if (!transferInfo?.address || !transferInfo?.fee)
        return

      switch (token) {
        case AVAILABLE_TOKENS.USDT:
          navigate(ROUTES.TRANSACTION_IN_PROGRESS)

          return await transferUsdt({
            recipientAddress: address,
            depositAddress: transferInfo.address,
            transferAmount: amount,
            transactionFee: transferInfo.fee,
            userPasscode: passcode,
            optimization: optimization ?? transferInfo.optimization,
          })
        case AVAILABLE_TOKENS.TRX:
          return await transferTrx({ recipientAddress: address, transferAmount: amount, userPasscode: passcode })
        default:
          console.error(`Unsupported token: ${token}`)
          return undefined
      }
    },
    [token, transferInfo, transferTrx, transferUsdt],
  )

  const navigateToTransactionResult = useCallback((transactionId?: string) => {
    const resultRoute = transactionId
      ? urlJoin(ROUTES.TRANSACTION_RESULT, transactionId)
      : urlJoin(ROUTES.TRANSACTION_RESULT, 'no-txid')

    navigate(resultRoute)
  }, [])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="h-full flex flex-col justify-between">
        <div className="space-y-2">
          <div className="relative py-3 space-y-4">
            <AddressInput form={form} />

            <TokenAmountInput
              form={form}
              balances={wallet.balances}
              token={token}
              onTokenChange={setToken}
            />
          </div>

          {isUsdtToken && <TrxPurchaseLink need={transferInfo?.fee} balances={wallet.balances} />}

          <div className="flex flex-col gap-4 bg-secondary/50 p-4 rounded-md">
            <div className="flex items-center justify-between">
              <span className="text-sm">
                {t('transfer.available')}
                :
              </span>
              <span className="text-sm">
                {wallet.balances[token as keyof typeof wallet.balances]}
                {' '}
                {token}
              </span>
            </div>

            {isUsdtToken && isOptimizationEnabled && (
              <div className="flex items-center justify-between">
                <span>
                  {t('transfer.fee')}
                  :
                </span>
                <div className="text-md space-x-1">
                  <span>
                    <ReducedFee form={form} transferInfo={transferInfo} prevFee={prevFee} />
                  </span>
                </div>
              </div>
            )}

            {transferInfo?.optimization === false && (
              <div className="flex items-center space-x-1 text-muted-foreground">
                <CircleAlert className="size-4" />
                <span className="text-sm">{t('transfer.optimizationDisabled')}</span>
              </div>
            )}

            <Separator className="mt-2" />

            <div className="flex items-center justify-between">
              <span className="text-lg">
                {t('transfer.total')}
                :
              </span>
              <span className="text-lg">
                {form.watch('amount')}
                {' '}
                {token}
              </span>
            </div>
          </div>
        </div>

        <Button className="dark:text-white bg-secondary/80 dark:border-neutral-500" variant="outline" type="submit">
          {t('transfer.button.send')}
        </Button>

        <TransactionDrawer
          token={token}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          values={formValues}
          walletAddress={wallet.address}
          onSign={handleAuthenticateAndSign}
        />
      </form>
    </Form>
  )
}

function ReducedFee({
  transferInfo,
  prevFee,
  form,
}: {
  transferInfo: TransferInfoResponse | undefined
  prevFee: number | undefined
  form: UseFormReturn<FormFields>
}) {
  if (!transferInfo?.fee || !form.watch('address')) {
    return <span>-</span>
  }

  return (
    <div className="flex items-center space-x-1">
      <span className="text-muted-foreground line-through text-md">
        <FormattedNumber number={prevFee!} />
      </span>
      <span className="flex text-md">
        <FormattedNumber number={transferInfo?.fee + BANDWIDTH_COST} />
        {' '}
        {AVAILABLE_TOKENS.TRX}
      </span>
    </div>
  )
}

// Address input component
function AddressInput({ form }: { form: UseFormReturn<FormFields> }) {
  const { t } = useTranslation()

  return (
    <FormField
      control={form.control}
      name="address"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-lg primary-gradient">
            {t('transfer.sendTo')}
          </FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                {...field}
                placeholder={t('transfer.address')}
                className="h-14 bg-transparent pr-12 text-[12px] dark:border-white/40"
              />
              <QrScannerButton
                setValue={value => form.setValue('address', value)}
                className="absolute top-1/2 -translate-y-1/2 right-1"
                size={7}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

// Token amount input component
const TokenAmountInput: React.FC<{
  form: UseFormReturn<FormFields>
  balances: Balances
  token: string
  onTokenChange: (token: string) => void
}>
  = ({
    form,
    balances,
    token,
    onTokenChange,
  }) => {
    const { t } = useTranslation()

    return (
      <FormField
        control={form.control}
        name="amount"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-lg primary-gradient">
              {t('transfer.amount')}
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  className="bg-transparent h-14 text-lg dark:border-white/40 placeholder:text-sm"
                  type="number"
                  min="0"
                  inputMode="decimal"
                  pattern="[0-9]*"
                  step="any"
                  placeholder="Amount"
                  {...field}
                  // temporary
                  onFocus={(e) => {
                    const value = e.target.value
                    if (+value === 0) {
                      form.setValue('amount', value.replace(/^0+/, '') as unknown as number)
                    }
                  }}
                />
                <div
                  className="absolute top-1/2 right-24 -translate-y-1/2 text-sm dark:text-white text-blue-500"
                  onClick={() => {
                    form.setValue('amount', balances[token as keyof typeof balances])
                  }}
                >
                  MAX
                </div>

                <div
                  className="absolute top-1/2 right-3 -translate-y-1/2"
                >
                  <TokenPicker value={token} onValueChange={onTokenChange} />
                </div>
              </div>
            </FormControl>
            <FormMessage tOptions={{ value: 0.1 }} />
          </FormItem>
        )}
      />
    )
  }

// Transaction drawer component
const TransactionDrawer: React.FC<{
  token: string
  isOpen: boolean
  onClose: () => void
  values?: FormFields
  walletAddress: string
  onSign: () => void
}> = ({ token, isOpen, onClose, values, walletAddress, onSign }) => {
  const { t } = useTranslation()

  return (
    <Drawer open={isOpen} onClose={onClose}>
      <DrawerContent className="px-6 h-fit">
        <DrawerHeader>
          <DrawerTitle>{t('transfer.confirm')}</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col items-center">
          <h2 className="text-2xl primary-gradient">{t('transfer.title')}</h2>
          <h3 className="font-bold text-xl mt-2 space-x-2">
            <span>{values?.amount}</span>
            <span>{token}</span>
          </h3>
          <div className="flex flex-col items-center mt-12">
            <TransactionAlert title={t('transfer.from')} description={walletAddress} />
            <LucideArrowDown className="my-4" />
            <TransactionAlert title={t('transfer.to')} description={values?.address ?? ''} />
          </div>
        </div>
        <DrawerFooter className="space-y-2 mt-10">
          <ShinyButton text={t('transfer.button.sign')} onClick={onSign} />
          <DrawerClose asChild>
            <Button variant="outline" onClick={onClose}>
              {t('transfer.button.reject')}
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

// Transaction alert component
const TransactionAlert: React.FC<{ title: string, description: string }> = ({ title, description }) => (
  <Alert>
    <Wallet2 className="h-4 w-4" />
    <AlertTitle>{title}</AlertTitle>
    <AlertDescription>{truncateString(description, 14)}</AlertDescription>
  </Alert>
)
