import { DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, Drawer, DrawerClose } from '@/shared/ui/drawer';
import { FormControl, FormMessage, FormField, FormItem, Form, FormLabel } from '@/shared/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { truncateString } from '@/shared/utils/truncateString';
import { QrScannerButton } from '@/shared/ui/qr-scanner-button';
import { getPrivateKey, useWallet } from '@/entities/wallet';
import { AVAILABLE_TOKENS } from '@/shared/enums/tokens.ts';
import { useTrc20Transfer } from '../model/useUsdtTransfer';
import { useForm, UseFormReturn } from 'react-hook-form';
import { LucideArrowDown, Wallet2 } from 'lucide-react';
import ShinyButton from '@/shared/magicui/shiny-button';
import { api, TransferInfoResponse } from '@/kernel/api';
import { useTrxTransfer } from '../model/useTrxTransfer';
import { navigate } from 'wouter/use-browser-location';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitButton } from '../../ui/SubmitButton';
import { Balances } from '@/kernel/tron/model/types';
import { ROUTES } from '@/shared/constants/routes';
import { Separator } from '@/shared/ui/separator';
import { urlJoin } from '@/shared/utils/urlJoin';
import { useEffect, useState } from 'react';
import { Button } from '@/shared/ui/button';
import { tronService } from '@/kernel/tron';
import { Input } from '@/shared/ui/input';
import { useAuth } from '@/kernel/auth';
import toast from 'react-hot-toast';
import { TronWeb } from 'tronweb';
import { z } from 'zod';

// Validation schema for form fields
const tronAddressRegex = /^T[1-9A-HJ-NP-Za-km-z]{33}$/;

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
  const [fee, setFee] = useState<number | null>(null);
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

  const receiver = form.watch('address');

  useEffect(() => {
    if (TronWeb.isAddress(receiver)) {
      const privateKey = getPrivateKey();

      tronService.getBalances(receiver, privateKey!).then(({ USDT }) => {
        if (!transferInfo) return;
        const fee = transferInfo.fee;

        if (USDT > 0) {
          setFee(fee);
          // temporary
          setPrevFee(13);
        } else {
          setFee(fee * 2);
          // temporary
          setPrevFee(30);
        }
      });
    }
  }, [receiver, transferInfo]);

  useEffect(() => {
    api.transferInfo().then((res) => setTransferInfo(res));
  }, []);

  const handleFormSubmit = (values: FormFields) => {
    const balance = wallet.balances[token as keyof typeof wallet.balances];

    if (values.amount > balance) {
      form.setError('amount', { type: 'manual', message: 'Insufficient USDT balance.' });
      toast.error('Not enough balance.');
      return;
    }

    if (fee && wallet.balances.TRX < fee) {
      toast.error('Insufficient TRX balance.');
      return;
    }

    if (values.address === wallet.address) {
      form.setError('address', {
        type: 'manual',
        message: 'You cannot enter your own wallet address. Please provide a different address to proceed.'
      });
      toast.error('Cannot use your own address.');
      return;
    }

    form.clearErrors('amount');

    setFormValues(values);
    setIsDrawerOpen(true);
  };

  const processTransaction = async (passcode: string) => {
    const privateKey = getPrivateKey();

    if (!formValues?.address || !formValues.amount || !privateKey) {
      return;
    }

    const { address, amount } = formValues;

    try {
      const handleTransaction = async (): Promise<string | undefined> => {
        if (!transferInfo?.address || !fee) return;

        switch (token) {
          case AVAILABLE_TOKENS.USDT:
            navigate(ROUTES.TRANSACTION_IN_PROGRESS);
            return await transferUsdt({
              recipientAddress: address,
              depositAddress: transferInfo.address,
              transferAmount: amount,
              transactionFee: fee,
              userPasscode: passcode
            });

          case AVAILABLE_TOKENS.TRX:
            return await transferTrx({ recipientAddress: address, transferAmount: amount, userPasscode: passcode });
          default:
            console.error(`Unsupported token: ${token}`);
            return undefined;
        }
      };

      const transactionId = await handleTransaction();

      const resultRoute = transactionId
        ? urlJoin(ROUTES.TRANSACTION_RESULT, transactionId)
        : urlJoin(ROUTES.TRANSACTION_RESULT, 'no-txid');

      navigate(resultRoute);
    } catch {
      navigate(urlJoin(ROUTES.TRANSACTION_RESULT, 'no-txid'));
    }
  };

  const handleAuthenticateAndSign = async () => {
    if (!formValues?.address || !formValues.amount) return;

    const passcode = await authenticate();
    if (passcode) await processTransaction(passcode);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="h-full flex flex-col justify-between">
        <div className="space-y-2">
          <div className="relative py-3 px-3 bg-secondary/40 border dark:border-neutral-700 rounded-lg space-y-4">
            <AddressInput form={form} />

            <TokenAmountInput form={form} balances={wallet.balances} token={token} />
          </div>

          <div className="flex flex-col gap-4 py-4 px-3 bg-secondary/40 border dark:border-neutral-700 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-md">Available withdraw:</span>
              <span className="text-md">
                {wallet.balances[token as keyof typeof wallet.balances]} {token}
              </span>
            </div>

            {token === AVAILABLE_TOKENS.USDT && (
              <div className="flex items-center justify-between">
                <span>Reduced Fee:</span>

                <div className="text-md space-x-1">
                  <span>
                    {fee && form.watch('address') ? (
                      <div className="flex items-center space-x-1">
                        <span className="text-muted-foreground line-through	text-md">{prevFee}</span>
                        <span className="flex text-md">
                          {fee} {AVAILABLE_TOKENS.TRX}
                        </span>
                      </div>
                    ) : (
                      '-'
                    )}
                  </span>
                </div>
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

        <SubmitButton>Send</SubmitButton>

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
