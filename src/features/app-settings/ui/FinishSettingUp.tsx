import { useWallet, useWalletStore } from '@/entities/wallet';
import { useSettingsItems } from '../model/useSettingsItems';
import { PropsWithClassname } from '@/shared/types/react';
import { SwitchItem } from '@/shared/ui/switch-item';
import { Fingerprint, Wallet2 } from 'lucide-react';
import { ROUTES } from '@/shared/constants/routes';
import { LinkItem } from '@/shared/ui/link-item';
import { cn } from '@/shared/lib/utils';

export const FinishSettingUp = ({ className }: PropsWithClassname) => {
  const { isBiometryEnabled, handleSwitchBiometry } = useSettingsItems();

  const addresses = useWalletStore((store) => store.addresses);
  const wallet = useWallet();

  const defaultWalletName = `Wallet ${addresses.length}`;

  return (
    <div className={cn('w-full space-y-3', className)}>
      <h3 className="primary-gradient text-md font-bold">Finish Setting Up</h3>
      <div className="space-y-4">
        {wallet.name === defaultWalletName && (
          <LinkItem
            title="Edit wallet name"
            description="Customize"
            href={ROUTES.WALLET_UPDATE}
            icon={<Wallet2 className="h-5 w-5" />}
            className="bg-background"
          />
        )}

        {!isBiometryEnabled && (
          <SwitchItem
            title="Use biometrics"
            checked={isBiometryEnabled}
            onCheckedChange={handleSwitchBiometry}
            className="bg-background"
            icon={<Fingerprint className="h-5 w-5" />}
          />
        )}
      </div>
    </div>
  );
};
