import { ArrowDown, Check, ChevronRight, Wallet2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { useWallet } from '@/entities/wallet';
import { api, ExchangeInfoResponse } from '@/kernel/api';
import { Balances } from '@/kernel/tron';
import { AVAILABLE_TOKENS } from '@/shared/enums/tokens';
import ShinyButton from '@/shared/magicui/shiny-button';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import { Button } from '@/shared/ui/button';
import {
	Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle
} from '@/shared/ui/drawer';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shared/ui/form';
import { FormattedNumber } from '@/shared/ui/formatted-number';
import { Input } from '@/shared/ui/input';
import { Separator } from '@/shared/ui/separator';
import { truncateString } from '@/shared/utils/truncateString';
import { zodResolver } from '@hookform/resolvers/zod';

import { useExchange } from '../model/useExchange';

const formSchema = z.object({
  amount: z.coerce
    .number()
    .min(0.1, { message: 'You must enter at least 10 token to send.' })
    .positive({ message: 'Amount must be a positive number.' })
});

type FormFields = z.infer<typeof formSchema>;

export function WalletExchangeForm() {
  const [exchangeInfo, setExchangeInfo] = useState<ExchangeInfoResponse | null>(null);
  const [isDrawerOpened, setIsDrawerOpened] = useState(false);

  const { exchange } = useExchange();
  const wallet = useWallet();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0
    }
  });

  useEffect(() => {
    api.exchangeInfo().then((res) => setExchangeInfo(res));
  }, []);

  const handleSubmit = (values: FormFields) => {
    const balance = wallet.balances[AVAILABLE_TOKENS.USDT as keyof typeof wallet.balances];
    if (values.amount > balance) {
      form.setError('amount', { type: 'manual', message: 'Insufficient balance.' });
      toast.error('Not enough balance.');
      return;
    }

    form.clearErrors('amount');
    setIsDrawerOpened(true);
  };

  const handleSign = async () => {
    const amount = +form.getValues('amount');
    if (!exchangeInfo || amount < exchangeInfo?.minAmount) return;

    await exchange(amount, exchangeInfo.fee);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="h-full flex flex-col justify-between w-full">
        <div className="space-y-2">
          <div className="relative w-full flex flex-col bg-secondary/50 border dark:border-neutral-600 p-4 rounded-lg">
            <TokenAmountInput form={form} label="Send" balances={wallet.balances} token={AVAILABLE_TOKENS.USDT} />

            <div className="text-neutral-500 bg-secondary/40 border border-neutral-300 dark:text-neutral-400 dark:bg-neutral-800 dark:border-neutral-500 absolute bottom-[-30px] right-8 w-fit rounded-full p-2">
              <ArrowDown />
            </div>
          </div>

          <Receive
            form={form}
            label="Send"
            balances={wallet.balances}
            token={AVAILABLE_TOKENS.TRX}
            rate={exchangeInfo?.rate}
          />

          <div className="relative w-full flex flex-col justify-between gap-2 bg-secondary/50 border p-4 rounded-lg">
            <div className="w-full flex items-center justify-between">
              <span>Zero TRX Fee</span>
              <Check className="size-5 text-green-400" />
            </div>

            <div className="w-full flex items-center justify-between">
              <span className="text-md">{AVAILABLE_TOKENS.USDT} Fee:</span>
              <span className="text-md">
                {exchangeInfo?.fee} {AVAILABLE_TOKENS.USDT}
              </span>
            </div>

            <Separator className="mt-2" />

            <div className="w-full flex items-center justify-between">
              <span className="text-lg">Total:</span>
              <span className="text-md">
                {form.getValues('amount') > 0
                  ? exchangeInfo && `${+form.watch('amount') + exchangeInfo.fee} ${AVAILABLE_TOKENS.USDT}`
                  : '-'}
              </span>
            </div>
          </div>
        </div>

        <Button className="dark:text-white bg-secondary/80 dark:border-neutral-500" variant={'outline'} type="submit">
          Buy
        </Button>

        <TransactionDrawer
          handleSign={handleSign}
          onClose={() => setIsDrawerOpened(false)}
          isOpen={isDrawerOpened}
          values={{ amount: form.watch('amount') }}
          token={AVAILABLE_TOKENS.USDT}
          walletAddress={wallet.address}
          exchangeInfo={exchangeInfo}
        />
      </form>
    </Form>
  );
}

const Receive = ({
  form,
  balances,
  token,
  rate
}: {
  form: UseFormReturn<FormFields>;
  label: string;
  balances: Balances;
  token: AVAILABLE_TOKENS;
  rate: number | undefined;
}) => {
  return (
    <div className="w-full flex flex-col space-y-4 bg-secondary/50 border dark:border-neutral-600 p-4 pt-8 rounded-lg">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Receive</span>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Balance: {balances[token]}</span>
          </div>
        </div>

        <div>
          <div className="flex items-center relative space-x-1">
            <h3 className="text-center text-2xl primary-gradient">{token}</h3>
            <ChevronRight className="text-muted-foreground size-4" />
            <p className="pl-5 text-xl  truncate w-52">
              <FormattedNumber number={rate && +form.watch('amount') * rate} />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const TokenAmountInput = ({
  form,
  label,
  balances,
  token
}: {
  form: UseFormReturn<FormFields>;
  label: string;
  balances: Balances;
  token: AVAILABLE_TOKENS;
}) => (
  <FormField
    control={form.control}
    name="amount"
    render={({ field }) => (
      <FormItem>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">{label}</span>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Balance: {balances[token]}</span>
            <div
              className="text-sm dark:text-white"
              onClick={() => {
                form.setValue('amount', balances[token as keyof typeof balances]);
              }}
            >
              MAX
            </div>
          </div>
        </div>

        <FormControl>
          <div className="flex items-center relative">
            <h3 className="text-center text-2xl primary-gradient">{token}</h3>
            <ChevronRight className="text-muted-foreground" />
            <Input
              {...field}
              className="bg-transparent h-12 text-xl border-none"
              type="number"
              min="0"
              inputMode="decimal"
              pattern="[0-9]*"
              step="any"
              // temporary
              onFocus={(e) => {
                const value = e.target.value;
                if (+value === 0) {
                  form.setValue('amount', value.replace(/^0+/, '') as unknown as number);
                }
              }}
            />
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

const TransactionDrawer = ({
  token,
  isOpen,
  onClose,
  values,
  walletAddress,
  handleSign,
  exchangeInfo
}: {
  token: string;
  isOpen: boolean;
  onClose: () => void;
  values?: FormFields;
  walletAddress: string;
  handleSign: () => void;
  exchangeInfo: ExchangeInfoResponse | null;
}) => (
  <Drawer open={isOpen} onClose={onClose}>
    <DrawerContent className="px-6 h-fit">
      <DrawerHeader>
        <DrawerTitle className="text-2xl primary-gradient">Exchange</DrawerTitle>
      </DrawerHeader>

      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center space-y-2">
          <h3 className="font-bold text-xl mt-2 space-x-2">
            <span>{values?.amount}</span>
            <span>{token}</span>
          </h3>
          <ArrowDown />
          <h3 className="flex items-center font-bold text-xl mt-2 space-x-2">
            <p>{values?.amount && exchangeInfo ? <FormattedNumber number={values.amount * exchangeInfo.rate} /> : 0}</p>
            <span>{AVAILABLE_TOKENS.TRX}</span>
          </h3>
        </div>
        <div className="flex flex-col items-center mt-6">
          <ExchangeAlert title="Wallet" description={walletAddress} />
        </div>
      </div>

      <DrawerFooter className="space-y-2 mt-10">
        <ShinyButton text="Sign" onClick={handleSign} />
        <DrawerClose asChild>
          <Button variant="outline" onClick={onClose}>
            Reject
          </Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
);

const ExchangeAlert: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <Alert>
    <Wallet2 className="h-4 w-4" />
    <AlertTitle>{title}</AlertTitle>
    <AlertDescription>{truncateString(description, 14)}</AlertDescription>
  </Alert>
);
