import { FilePenLine, Fingerprint, KeyRound, Wallet2 } from 'lucide-react';

import { ROUTES } from '@/shared/constants/routes';
import { LinkItem } from '@/shared/ui/link-item';
import { SwitchItem } from '@/shared/ui/switch-item';

import { useSettingsItems } from '../model/useSettingsItems';

export const AppSettingsItems = () => {
  const { isBiometryEnabled, handleSwitchBiometry } = useSettingsItems();

  return (
    <div className="space-y-4">
      <LinkItem
        title="Edit wallet name"
        description="Customize"
        href={ROUTES.WALLET_UPDATE}
        icon={<Wallet2 className="size-5" />}
        className="bg-transparent"
      />

      <SwitchItem
        title="Use biometrics"
        checked={isBiometryEnabled}
        onCheckedChange={handleSwitchBiometry}
        icon={<Fingerprint className="size-5" />}
        className="bg-transparent"
      />

      <LinkItem
        title="Backup mnemonic"
        href={ROUTES.BACKUP_MNEMONIC}
        icon={<FilePenLine className="size-5" />}
        className="bg-transparent"
      />

      <LinkItem
        title="Backup private key"
        href={ROUTES.BACKUP_PRIVATE_KEY}
        icon={<KeyRound className="size-5" />}
        className="bg-transparent"
      />
    </div>
  );
};
