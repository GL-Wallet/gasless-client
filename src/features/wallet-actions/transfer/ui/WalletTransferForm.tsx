import { CircleAlert, LucideArrowDown, Wallet2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { TronWeb } from 'tronweb';
import { navigate } from 'wouter/use-browser-location';
import { z } from 'zod';

import { useWallet } from '@/entities/wallet';
import { api, TransferInfoResponse } from '@/kernel/api';
import { useAuth } from '@/kernel/auth';
import { Balances, TransactionID } from '@/kernel/tron/model/types';
import { ROUTES } from '@/shared/constants/routes';
import { AVAILABLE_TOKENS } from '@/shared/enums/tokens.ts';
import ShinyButton from '@/shared/magicui/shiny-button';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { useAlert } from '@/shared/ui/alert/Alert';
import { Button } from '@/shared/ui/button';
import {
	Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle
} from '@/shared/ui/drawer';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { FormattedNumber } from '@/shared/ui/formatted-number';
import { Input } from '@/shared/ui/input';
import { QrScannerButton } from '@/shared/ui/qr-scanner-button';
import { Separator } from '@/shared/ui/separator';
import { truncateString } from '@/shared/utils/truncateString';
import { urlJoin } from '@/shared/utils/urlJoin';
import { zodResolver } from '@hookform/resolvers/zod';

import { useTrxTransfer } from '../model/useTrxTransfer';
import { useTrc20Transfer } from '../model/useUsdtTransfer';
import { TrxPurchaseLink } from './TrxPurchaseLink';

// Validation schema for form fields
const tronAddressRegex = /^T[1-9A-HJ-NP-Za-km-z]{33}$/;

const BANDWIDTH_COST = 0.345;
const TRANSACTION_FEE = 13.5;

const formSchema = z.object({
  address: z
    .string()
    .refine((address) => tronAddressRegex.test(address), {
      message: 'transfer.error.invalidTrc20AddressFormat'
    })
    .refine((address) => TronWeb.isAddress(address), {
      message: 'transfer.error.addressNotExist'
    }),
  amount: z.coerce
    .number()
    .min(0.000001, { message: 'transfer.error.youMustEnterAtLeast' })
    .positive({ message: 'transfer.error.amountMustBePositive' })
});

type FormFields = z.infer<typeof formSchema>;

type Props = {
  token: string;
};

export const WalletTransferForm = ({ token }: Props) => {
  const { transferUsdt } = useTrc20Transfer();
  const { transferTrx } = useTrxTransfer();
  const { authenticate } = useAuth();
  const { t } = useTranslation();
  const wallet = useWallet();
  const alert = useAlert();

  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: '',
      amount: 0
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<FormFields>();
  const [transferInfo, setTransferInfo] = useState<TransferInfoResponse | null>(null);
  const [prevFee, setPrevFee] = useState<number | null>(null);

  const receiver = form.getValues('address');

  const isUsdtToken = token === AVAILABLE_TOKENS.USDT;
  const isTrxToken = token === AVAILABLE_TOKENS.TRX;
  const isOptimizationEnabled = transferInfo?.optimization === true || transferInfo?.optimization === undefined;

  const fetchTransferInfo = useCallback(async (address: string) => {
    const res = await api.transferInfo(address);
    setTransferInfo(res);
  }, []);

  const fetchTransferPrevFee = useCallback(async (address: string) => {
    const energyCount = await api.getEnergyCountByAddress(address);

    setPrevFee(energyCount * TRANSACTION_FEE);
  }, []);

  useEffect(() => {
    const { unsubscribe } = form.watch(({ address }) => {
      if (TronWeb.isAddress(address) && address !== receiver) {
        fetchTransferInfo(address!);
        fetchTransferPrevFee(address!);
      }
    });
    return () => unsubscribe();
  }, [fetchTransferInfo, fetchTransferPrevFee, form, receiver]);

  const validateTransaction = useCallback(
    (values: FormFields): boolean => {
      const balance = wallet.balances[token as keyof typeof wallet.balances];

      if (!transferInfo?.fee) {
        toast.error(t('transfer.error.waitForFeeToLoad'));
        return false;
      }

      if (values.amount > balance) {
        form.setError('amount', { type: 'manual', message: t('transfer.error.insufficientBalance', { token }) });
        toast.error(t('transfer.error.notEnoughBalance'));
        return false;
      }

      if (isUsdtToken && wallet.balances.TRX < transferInfo?.fee) {
        toast.error(t('transfer.error.insufficientBalance', { token: AVAILABLE_TOKENS.TRX }));
        return false;
      }

      if (isTrxToken && wallet.balances.TRX < transferInfo?.fee) {
        toast.error(t('transfer.error.insufficientBalance', { token: AVAILABLE_TOKENS.TRX }));
        return false;
      }

      if (values.address === wallet.address) {
        form.setError('address', { type: 'manual', message: t('transfer.error.cannotUseOwnAddress') });
        toast.error(t('transfer.error.cannotUseOwnAddress'));
        return false;
      }

      form.clearErrors('amount');
      return true;
    },
    [form, isTrxToken, isUsdtToken, t, token, transferInfo?.fee, wallet]
  );

  const handleFormSubmit = useCallback(
    (values: FormFields) => {
      if (validateTransaction(values)) {
        setFormValues(values);
        setIsDrawerOpen(true);
      }
    },
    [validateTransaction]
  );

  const handleAuthenticateAndSign = async () => {
    const passcode = await authenticate();
    if (passcode) {
      if (!formValues?.address || !formValues.amount) return;

      try {
        const transactionId = await handleProcessTransaction(formValues.address, formValues.amount, passcode);
        navigateToTransactionResult(transactionId);
        processTransferResult(transactionId, formValues.address, formValues.amount, passcode);
      } catch (error) {
        console.error(`Transaction processing error:`, error);
        navigateToTransactionResult(undefined);
      }
    }
  };

  const processTransferResult = (
    txid: TransactionID | undefined,
    address: string,
    amount: number,
    passcode: string
  ) => {
    if (!txid && token === AVAILABLE_TOKENS.USDT) {
      alert.setState({
        title: t('transfer.error.alert.title'),
        description: (
          <span>
            {t('transfer.error.alert.description')} <br />
            <span className="text-md font-bold">
              (~{prevFee} {AVAILABLE_TOKENS.TRX})
            </span>
            ?
          </span>
        )
      });
      alert.setIsOpen(true);
      alert.setActions({
        async handleContinue() {
          const transactionId = await handleProcessTransaction(address, amount, passcode, false);
          navigateToTransactionResult(transactionId);
        }
      });
    }
  };

  const handleProcessTransaction = useCallback(
    async (address: string, amount: number, passcode: string, optimization?: boolean): Promise<string | undefined> => {
      if (!transferInfo?.address || !transferInfo?.fee) return;

      switch (token) {
        case AVAILABLE_TOKENS.USDT:
          navigate(ROUTES.TRANSACTION_IN_PROGRESS);

          return await transferUsdt({
            recipientAddress: address,
            depositAddress: transferInfo.address,
            transferAmount: amount,
            transactionFee: transferInfo.fee,
            userPasscode: passcode,
            optimization: optimization ?? transferInfo.optimization
          });
        case AVAILABLE_TOKENS.TRX:
          return await transferTrx({ recipientAddress: address, transferAmount: amount, userPasscode: passcode });
        default:
          console.error(`Unsupported token: ${token}`);
          return undefined;
      }
    },
    [token, transferInfo, transferTrx, transferUsdt]
  );

  const navigateToTransactionResult = useCallback((transactionId?: string) => {
    const resultRoute = transactionId
      ? urlJoin(ROUTES.TRANSACTION_RESULT, transactionId)
      : urlJoin(ROUTES.TRANSACTION_RESULT, 'no-txid');

    navigate(resultRoute);
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="h-full flex flex-col justify-between">
        <div className="space-y-2">
          <div className="relative py-3 px-3 dark:bg-secondary/40 border dark:border-neutral-700 rounded-lg space-y-4">
            <AddressInput form={form} />

            <TokenAmountInput form={form} balances={wallet.balances} token={token} />
          </div>

          {isUsdtToken && <TrxPurchaseLink need={transferInfo?.fee} balances={wallet.balances} />}

          <div className="flex flex-col gap-4 py-4 px-3 dark:bg-secondary/40 border dark:border-neutral-700 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm">{t('transfer.available')}:</span>
              <span className="text-sm">
                {wallet.balances[token as keyof typeof wallet.balances]} {token}
              </span>
            </div>

            {isUsdtToken && isOptimizationEnabled && (
              <div className="flex items-center justify-between">
                <span>{t('transfer.fee')}:</span>
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
              <span className="text-lg">{t('transfer.total')}:</span>
              <span className="text-lg">
                {form.watch('amount')} {token}
              </span>
            </div>
          </div>
        </div>

        <Button className="dark:text-white bg-secondary/80 dark:border-neutral-500" variant={'outline'} type="submit">
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
  );
};

const ReducedFee = ({
  transferInfo,
  prevFee,
  form
}: {
  transferInfo: TransferInfoResponse | null;
  prevFee: number | null;
  form: UseFormReturn<FormFields>;
}) => {
  if (!transferInfo?.fee || !form.watch('address')) {
    return <span>-</span>;
  }

  return (
    <div className="flex items-center space-x-1">
      <span className="text-muted-foreground line-through text-md">
        <FormattedNumber number={prevFee!} />
      </span>
      <span className="flex text-md">
        <FormattedNumber number={transferInfo?.fee + BANDWIDTH_COST} /> {AVAILABLE_TOKENS.TRX}
      </span>
    </div>
  );
};

// Address input component
const AddressInput = ({ form }: { form: UseFormReturn<FormFields> }) => {
  const { t } = useTranslation();

  return (
    <FormField
      control={form.control}
      name="address"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-lg primary-gradient">{t('transfer.sendTo')}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input {...field} placeholder={t('transfer.address')} className="h-14 bg-transparent pr-12 text-[12px]" />
              <QrScannerButton
                setValue={(value) => form.setValue('address', value)}
                className="absolute top-1/2 -translate-y-1/2 right-1"
                size={7}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

// Token amount input component
const TokenAmountInput: React.FC<{ form: UseFormReturn<FormFields>; balances: Balances; token: string }> = ({
  form,
  balances,
  token
}) => {
  const { t } = useTranslation();

  return (
    <FormField
      control={form.control}
      name="amount"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-lg primary-gradient">{t('transfer.amount')}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                className="bg-transparent h-14 text-lg"
                type="number"
                min="0"
                inputMode="decimal"
                pattern="[0-9]*"
                step="any"
                {...field}
                // temporary
                onFocus={(e) => {
                  const value = e.target.value;
                  if (+value === 0) {
                    form.setValue('amount', value.replace(/^0+/, '') as unknown as number);
                  }
                }}
              />
              <div className="absolute top-1/2 right-12 -translate-y-1/2 text-sm text-muted-foreground">{token}</div>
              <div
                className="absolute top-1/2 right-3 -translate-y-1/2 text-sm dark:text-white"
                onClick={() => {
                  form.setValue('amount', balances[token as keyof typeof balances]);
                }}
              >
                MAX
              </div>
            </div>
          </FormControl>
          <FormMessage tOptions={{ value: 0.1 }} />
        </FormItem>
      )}
    />
  );
};

// Transaction drawer component
const TransactionDrawer: React.FC<{
  token: string;
  isOpen: boolean;
  onClose: () => void;
  values?: FormFields;
  walletAddress: string;
  onSign: () => void;
}> = ({ token, isOpen, onClose, values, walletAddress, onSign }) => {
  const { t } = useTranslation();

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
  );
};

// Transaction alert component
const TransactionAlert: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <Alert>
    <Wallet2 className="h-4 w-4" />
    <AlertTitle>{title}</AlertTitle>
    <AlertDescription>{truncateString(description, 14)}</AlertDescription>
  </Alert>
);
