import { FilePenLine, Fingerprint, KeyRound, Wallet2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { ROUTES } from '@/shared/constants/routes';
import { LinkItem } from '@/shared/ui/link-item';
import { SwitchItem } from '@/shared/ui/switch-item';

import { useSettingsItems } from '../model/useSettingsItems';
import { LanguageSelect } from './LanguageSelect';

export const AppSettingsItems = () => {
  const { isBiometryEnabled, handleSwitchBiometry } = useSettingsItems();

  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className='text-lg primary-gradient'>{t("shared.lang.label")}</h3>
        <LanguageSelect className="bg-transparent w-fit" />
      </div>

      <LinkItem
        title={t('setting.editWalletName')}
        href={ROUTES.WALLET_UPDATE}
        icon={<Wallet2 className="size-5" />}
        className="bg-transparent"
      />

      <SwitchItem
        title={t('setting.useBiometrics')}
        checked={isBiometryEnabled}
        onCheckedChange={handleSwitchBiometry}
        icon={<Fingerprint className="size-5" />}
        className="bg-transparent"
      />

      <LinkItem
        title={t('setting.backupMnemonic')}
        href={ROUTES.BACKUP_MNEMONIC}
        icon={<FilePenLine className="size-5" />}
        className="bg-transparent"
      />

      <LinkItem
        title={t('setting.backupPrivateKey')}
        href={ROUTES.BACKUP_PRIVATE_KEY}
        icon={<KeyRound className="size-5" />}
        className="bg-transparent"
      />
    </div>
  );
};
