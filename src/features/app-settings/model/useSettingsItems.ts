import { useAppSettingsStore } from '@/entities/app-settings';
import { useAuthStore } from '@/kernel/auth/model/store';
import { useBiometry } from '@/shared/hooks/useBiometry';

export const useSettingsItems = () => {
  const { isEnabled, requestAccess, updateToken } = useBiometry();

  const { isBiometryEnabled, updateSettings } = useAppSettingsStore((store) => ({
    isBiometryEnabled: store.isBiometryEnabled,
    updateSettings: store.updateSettings
  }));

  const { passcode } = useAuthStore();

  const handleSwitchBiometry = async (checked: boolean) => {
    if (!isEnabled) await requestAccess();

    await updateToken(checked ? passcode : null);

    updateSettings({ isBiometryEnabled: checked });
  };

  return {
    isBiometryEnabled,
    handleSwitchBiometry
  };
};
