import { CircleAlert, LucideArrowDown, Wallet2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import toast from 'react-hot-toast';
import { TronWeb } from 'tronweb';
import { navigate } from 'wouter/use-browser-location';
import { z } from 'zod';

import { getPrivateKey, useWallet } from '@/entities/wallet';
import { api, TransferInfoResponse } from '@/kernel/api';
import { useAuth } from '@/kernel/auth';
import { Balances } from '@/kernel/tron/model/types';
import { ROUTES } from '@/shared/constants/routes';
import { AVAILABLE_TOKENS } from '@/shared/enums/tokens.ts';
import ShinyButton from '@/shared/magicui/shiny-button';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
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
      message: 'Invalid TRC20 address format.'
    })
    .refine((address) => TronWeb.isAddress(address), {
      message: 'Invalid TRC20 address: Address does not exist on the TRON network.'
    }),
  amount: z.coerce
    .number()
    .min(0.1, { message: 'You must enter at least 0.1 token to send.' })
    .positive({ message: 'Amount must be a positive number.' })
});

type FormFields = z.infer<typeof formSchema>;

type Props = {
  token: string;
};

export const WalletTransferForm = ({ token }: Props) => {
  const { transferUsdt } = useTrc20Transfer();
  const { transferTrx } = useTrxTransfer();

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<FormFields>();
  const [transferInfo, setTransferInfo] = useState<TransferInfoResponse | null>(null);
  const [prevFee, setPrevFee] = useState<number | null>(null);

  const { authenticate } = useAuth();
  const wallet = useWallet();

  const form = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: '',
      amount: 0
    }
  });

  const receiver = form.getValues('address');

  const isUsdtToken = token === AVAILABLE_TOKENS.USDT;
  const isOptimizationEnabled = transferInfo?.optimization === true || transferInfo?.optimization === undefined;

  const fetchTransferInfo = useCallback(async (address: string) => {
    const res = await api.transferInfo(address);
    setTransferInfo(res);
  }, []);

  const fetchTransferPrevFee = useCallback(async (address: string) => {
    const privateKey = getPrivateKey();
    if (!privateKey) return;

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
        toast.error('Wait for the fee to load');
        return false;
      }

      if (values.amount + BANDWIDTH_COST > balance) {
        console.log(values.amount + BANDWIDTH_COST, balance)
        form.setError('amount', { type: 'manual', message: `Insufficient ${token} balance.` });
        toast.error('Not enough balance.');
        return false;
      }

      if (isUsdtToken && wallet.balances.TRX < transferInfo?.fee) {
        toast.error('Insufficient TRX balance.');
        return false;
      }

      if (values.address === wallet.address) {
        form.setError('address', { type: 'manual', message: 'Cannot use your own address.' });
        toast.error('Cannot use your own address.');
        return false;
      }

      form.clearErrors('amount');
      return true;
    },
    [form, isUsdtToken, token, transferInfo?.fee, wallet]
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

  const handleTransaction = useCallback(
    async (address: string, amount: number, passcode: string): Promise<string | undefined> => {
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
            optimization: transferInfo.optimization
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

  const processTransaction = useCallback(
    async (passcode: string) => {
      if (!formValues?.address || !formValues.amount) return;

      try {
        const transactionId = await handleTransaction(formValues.address, formValues.amount, passcode);
        navigateToTransactionResult(transactionId);
      } catch (error) {
        console.error(`Transaction processing error:`, error);
        navigateToTransactionResult(undefined);
      }
    },
    [formValues, handleTransaction]
  );

  const navigateToTransactionResult = (transactionId?: string) => {
    const resultRoute = transactionId
      ? urlJoin(ROUTES.TRANSACTION_RESULT, transactionId)
      : urlJoin(ROUTES.TRANSACTION_RESULT, 'no-txid');
    navigate(resultRoute);
  };

  const handleAuthenticateAndSign = async () => {
    const passcode = await authenticate();
    if (passcode) {
      await processTransaction(passcode);
    }
  };

  const renderReducedFee = () => {
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="h-full flex flex-col justify-between">
        <div className="space-y-2">
          <div className="relative py-3 px-3 bg-secondary/40 border dark:border-neutral-700 rounded-lg space-y-4">
            <AddressInput form={form} />

            <TokenAmountInput form={form} balances={wallet.balances} token={token} />
          </div>

          {isUsdtToken && <TrxPurchaseLink need={transferInfo?.fee} balances={wallet.balances} />}

          <div className="flex flex-col gap-4 py-4 px-3 bg-secondary/40 border dark:border-neutral-700 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-md">Available withdraw:</span>
              <span className="text-md">
                {wallet.balances[token as keyof typeof wallet.balances]} {token}
              </span>
            </div>

            {isUsdtToken && isOptimizationEnabled && (
              <div className="flex items-center justify-between">
                <span>Fee:</span>
                <div className="text-md space-x-1">
                  <span>{renderReducedFee()}</span>
                </div>
              </div>
            )}

            {transferInfo?.optimization === false && (
              <div className="flex items-center space-x-1 text-muted-foreground">
                <CircleAlert className="size-4" />
                <span className="text-sm">Gas Optimization Temporarily disabled</span>
              </div>
            )}

            <Separator className="mt-2" />

            <div className="flex items-center justify-between">
              <span className="text-lg">Total:</span>
              <span className="text-lg">
                {form.watch('amount')} {token}
              </span>
            </div>
          </div>
        </div>

        <Button className="dark:text-white bg-secondary/80 dark:border-neutral-500" variant={'outline'} type="submit">
          Send
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

// Address input component
const AddressInput = ({ form }: { form: UseFormReturn<FormFields> }) => (
  <FormField
    control={form.control}
    name="address"
    render={({ field }) => (
      <FormItem>
        <FormLabel className="text-lg primary-gradient">Send To</FormLabel>
        <FormControl>
          <div className="relative">
            <Input {...field} placeholder="Address" className="h-14 bg-transparent pr-12 text-[12px]" />
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

// Token amount input component
const TokenAmountInput: React.FC<{ form: UseFormReturn<FormFields>; balances: Balances; token: string }> = ({
  form,
  balances,
  token
}) => (
  <FormField
    control={form.control}
    name="amount"
    render={({ field }) => (
      <FormItem>
        <FormLabel className="text-lg primary-gradient">Amount</FormLabel>
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
        <FormMessage />
      </FormItem>
    )}
  />
);

// Transaction drawer component
const TransactionDrawer: React.FC<{
  token: string;
  isOpen: boolean;
  onClose: () => void;
  values?: FormFields;
  walletAddress: string;
  onSign: () => void;
}> = ({ token, isOpen, onClose, values, walletAddress, onSign }) => (
  <Drawer open={isOpen} onClose={onClose}>
    <DrawerContent className="px-6 h-fit">
      <DrawerHeader>
        <DrawerTitle>Confirm Transaction</DrawerTitle>
      </DrawerHeader>
      <div className="flex flex-col items-center">
        <h2 className="text-2xl primary-gradient">Send</h2>
        <h3 className="font-bold text-xl mt-2 space-x-2">
          <span>{values?.amount}</span>
          <span>{token}</span>
        </h3>
        <div className="flex flex-col items-center mt-12">
          <TransactionAlert title="From" description={walletAddress} />
          <LucideArrowDown className="my-4" />
          <TransactionAlert title="To" description={values?.address ?? ''} />
        </div>
      </div>
      <DrawerFooter className="space-y-2 mt-10">
        <ShinyButton text="Sign" onClick={onSign} />
        <DrawerClose asChild>
          <Button variant="outline" onClick={onClose}>
            Reject
          </Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
);

// Transaction alert component
const TransactionAlert: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <Alert>
    <Wallet2 className="h-4 w-4" />
    <AlertTitle>{title}</AlertTitle>
    <AlertDescription>{truncateString(description, 14)}</AlertDescription>
  </Alert>
);
