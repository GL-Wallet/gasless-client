import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { WalletTransferForm } from '@/features/transfer';
import { AVAILABLE_TOKENS } from '@/shared/enums/tokens';
import AnimatedShinyText from '@/shared/magicui/animated-shiny-text';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/shared/ui/select';

// Wrap WalletTransferForm with React.memo
const MemoizedWalletTransferForm = memo(WalletTransferForm);

export const WalletTransferPage = ({ token }: { token?: string }) => {
  const [_token, setToken] = useState(token ?? AVAILABLE_TOKENS.USDT);
  const { t } = useTranslation();

  const title = `${t('transfer.title')} ${token ?? ''}`;

  return (
    <div className="relative h-full flex flex-col space-y-8">
      <div className="w-full flex justify-center items-center">
        <AnimatedShinyText className="mx-0 inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
          <span className="text-3xl">{title}</span>
        </AnimatedShinyText>

        {!token && (
          <Select defaultValue={_token} onValueChange={(v) => setToken(v as AVAILABLE_TOKENS)}>
            <SelectTrigger className="w-fit bg-transparent px-2 h-9">
              <span className="text-xl text-muted-foreground">{_token}</span>
            </SelectTrigger>
            <SelectContent>
              {Object.values(AVAILABLE_TOKENS).map((token, idx) => (
                <SelectItem value={token} key={idx}>
                  {token}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Use MemoizedWalletTransferForm instead of WalletTransferForm */}
      <MemoizedWalletTransferForm token={_token} />
    </div>
  );
};
