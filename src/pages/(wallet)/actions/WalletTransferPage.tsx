import { Select, SelectContent, SelectItem, SelectTrigger } from '@/shared/ui/select';
import AnimatedShinyText from '@/shared/magicui/animated-shiny-text';
import { WalletTransferForm } from '@/features/wallet-actions';
import { AVAILABLE_TOKENS } from '@/shared/enums/tokens';
import { useState } from 'react';

export const WalletTransferPage = ({ token }: { token?: string }) => {
  const [_token, setToken] = useState(token ?? AVAILABLE_TOKENS.USDT);

  const title = `Send ${token ?? ''}`;

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

      <WalletTransferForm token={_token} />
    </div>
  );
};
