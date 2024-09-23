import { useAuthStore } from '@/kernel/auth/model/store';
import { useBiometry } from '@/shared/hooks/useBiometry';
import { useAppSettingsStore } from '@/entities/app-settings';

export const useSettingsItems = () => {
  const { isEnabled, requestAccess, updateToken } = useBiometry();

  const { isBiometryEnabled, updateSettings } = useAppSettingsStore((store) => ({
    isBiometryEnabled: store.isBiometryEnabled,
    updateSettings: store.updateSettings
  }));

  const { encryptedPasscode } = useAuthStore();

  const handleSwitchBiometry = async (checked: boolean) => {
    if (!isEnabled) await requestAccess();

    await updateToken(checked ? encryptedPasscode : null);

    updateSettings({ isBiometryEnabled: checked });
  };

  return {
    isBiometryEnabled,
    handleSwitchBiometry
  };
};
