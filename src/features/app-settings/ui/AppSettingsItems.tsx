import { useSettingsItems } from '../model/useSettingsItems';
import { SwitchItem } from '@/shared/ui/switch-item';
import { Fingerprint, Wallet2 } from 'lucide-react';
import { ROUTES } from '@/shared/constants/routes';
import { LinkItem } from '@/shared/ui/link-item';

export const AppSettingsItems = () => {
  const { isBiometryEnabled, handleSwitchBiometry } = useSettingsItems();

  return (
    <div className="space-y-4">
      <LinkItem
        title="Edit wallet name"
        description="Customize"
        href={ROUTES.WALLET_UPDATE}
        icon={<Wallet2 className="h-5 w-5" />}
        className="bg-card dark:bg-transparent shadow-md"
      />

      <SwitchItem
        title="Use biometrics"
        checked={isBiometryEnabled}
        onCheckedChange={handleSwitchBiometry}
        icon={<Fingerprint className="h-5 w-5" />}
        className="bg-card dark:bg-transparent shadow-md"
      />
    </div>
  );
};
