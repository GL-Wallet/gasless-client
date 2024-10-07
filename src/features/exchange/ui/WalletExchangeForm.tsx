import { ArrowDown, Check, ChevronRight, Wallet2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
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
    .min(10, { message: 'exchange.error.youMustEnterAtLeast' })
    .positive({ message: 'exchange.error.amountMustBePositive' })
});

type FormFields = z.infer<typeof formSchema>;

export function WalletExchangeForm() {
  const [exchangeInfo, setExchangeInfo] = useState<ExchangeInfoResponse | null>(null);
  const [isDrawerOpened, setIsDrawerOpened] = useState(false);

  const { t } = useTranslation();

  const { exchange } = useExchange();
  const wallet = useWallet();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0
    }
  });

  const receive =
    exchangeInfo && form.watch('amount') > 0 ? (form.watch('amount') - exchangeInfo.fee) * exchangeInfo?.rate : 0;

  useEffect(() => {
    api.exchangeInfo().then((res) => setExchangeInfo(res));
  }, []);

  const handleSubmit = (values: FormFields) => {
    if (!exchangeInfo) return;

    const balance = wallet.balances[AVAILABLE_TOKENS.USDT as keyof typeof wallet.balances];

    if (values.amount > balance) {
      form.setError('amount', {
        type: 'manual',
        message: t('exchange.error.insufficientBalance', { token: AVAILABLE_TOKENS.USDT })
      });
      toast.error(t('exchange.error.notEnoughBalance'));
      return;
    }

    form.clearErrors('amount');
    setIsDrawerOpened(true);
  };

  const handleSign = async () => {
    const amount = +form.getValues('amount');
    if (!exchangeInfo || amount < exchangeInfo?.minAmount) return;

    await exchange(amount);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="h-full flex flex-col justify-between w-full">
        <div className="space-y-2">
          <div className="relative w-full flex flex-col bg-secondary/50 border dark:border-neutral-600 p-4 rounded-lg">
            <TokenAmountInput
              form={form}
              label={t('exchange.send')}
              balances={wallet.balances}
              token={AVAILABLE_TOKENS.USDT}
            />

            <div className="text-neutral-500 bg-secondary/40 border border-neutral-300 dark:text-neutral-400 dark:bg-neutral-800 dark:border-neutral-500 absolute bottom-[-30px] right-8 w-fit rounded-full p-2">
              <ArrowDown />
            </div>
          </div>

          <Receive balances={wallet.balances} token={AVAILABLE_TOKENS.TRX} receive={receive} />

          <div className="relative w-full flex flex-col justify-between gap-2 bg-secondary/50 border p-4 rounded-lg">
            <div className="w-full flex items-center justify-between">
              <span>{t('exchange.fee.trx')}</span>
              <Check className="size-5 text-green-400" />
            </div>

            <div className="w-full flex items-center justify-between">
              <span className="text-md">{t('exchange.fee.usdt')}:</span>
              <span className="text-md">
                {exchangeInfo?.fee} {AVAILABLE_TOKENS.USDT}
              </span>
            </div>

            <Separator className="mt-2" />

            <div className="w-full flex items-center justify-between">
              <span className="text-lg">{t('exchange.total')}:</span>
              <span className="text-md">
                {form.getValues('amount') > 0 ? (
                  <>
                    {+form.watch('amount')} {AVAILABLE_TOKENS.USDT}
                  </>
                ) : (
                  '-'
                )}
              </span>
            </div>
          </div>
        </div>

        <Button className="dark:text-white bg-secondary/80 dark:border-neutral-500" variant={'outline'} type="submit">
          {t('exchange.button.buy')}
        </Button>

        <TransactionDrawer
          handleSign={handleSign}
          onClose={() => setIsDrawerOpened(false)}
          isOpen={isDrawerOpened}
          values={{ amount: form.watch('amount') }}
          token={AVAILABLE_TOKENS.USDT}
          walletAddress={wallet.address}
          receive={receive}
        />
      </form>
    </Form>
  );
}

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
}) => {
  return (
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
          <FormMessage tOptions={{ value: 10 }} />
        </FormItem>
      )}
    />
  );
};

const Receive = ({ balances, token, receive }: { balances: Balances; token: AVAILABLE_TOKENS; receive: number }) => {
  const { t } = useTranslation();

  return (
    <div className="w-full flex flex-col space-y-4 bg-secondary/50 border dark:border-neutral-600 p-4 pt-8 rounded-lg">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">{t('exchange.receive')}</span>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {t('exchange.balance')}: {balances[token]}
            </span>
          </div>
        </div>

        <div>
          <div className="flex items-center relative space-x-1">
            <h3 className="text-center text-2xl primary-gradient">{token}</h3>
            <ChevronRight className="text-muted-foreground size-4" />
            <p className="pl-5 text-xl  truncate w-52">
              <FormattedNumber number={receive} />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const TransactionDrawer = ({
  token,
  isOpen,
  onClose,
  values,
  walletAddress,
  handleSign,
  receive
}: {
  token: string;
  isOpen: boolean;
  onClose: () => void;
  values?: FormFields;
  walletAddress: string;
  handleSign: () => void;
  receive: number;
}) => {
  const { t } = useTranslation();

  return (
    <Drawer open={isOpen} onClose={onClose}>
      <DrawerContent className="px-6 h-fit">
        <DrawerHeader>
          <DrawerTitle className="text-2xl primary-gradient">{t('exchange.title')}</DrawerTitle>
        </DrawerHeader>

        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center space-y-2">
            <h3 className="font-bold text-xl mt-2 space-x-2">
              <span>{values?.amount}</span>
              <span>{token}</span>
            </h3>
            <ArrowDown />
            <h3 className="flex items-center font-bold text-xl mt-2 space-x-2">
              <span>
                <FormattedNumber number={receive} />
              </span>
              <span>{AVAILABLE_TOKENS.TRX}</span>
            </h3>
          </div>
          <div className="flex flex-col items-center mt-6">
            <ExchangeAlert title={t('exchange.wallet')} description={walletAddress} />
          </div>
        </div>

        <DrawerFooter className="space-y-2 mt-10">
          <ShinyButton text={t('exchange.button.sign')} onClick={handleSign} />
          <DrawerClose asChild>
            <Button variant="outline" onClick={onClose}>
              {t('exchange.button.reject')}
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

const ExchangeAlert: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <Alert>
    <Wallet2 className="h-4 w-4" />
    <AlertTitle>{title}</AlertTitle>
    <AlertDescription>{truncateString(description, 14)}</AlertDescription>
  </Alert>
);
