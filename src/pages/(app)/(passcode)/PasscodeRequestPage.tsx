import { PasscodeRequired, useAuth } from '@/kernel/auth';
import { useSettingsStore } from '@/entities/settings';

export const PasscodeRequestPage = () => {
  const isBiometryEnabled = useSettingsStore(store => store.isBiometryEnabled);
  const {  _actualPasscode, _onPasscodeSuccess } = useAuth();

  return (
    <div className="h-full flex flex-col justify-center items-center space-y-8">
      <PasscodeRequired
        isBiometryEnabled={isBiometryEnabled}
        actualPasscode={_actualPasscode}
        onPasscodeSuccess={_onPasscodeSuccess}
      />
    </div>
  );
};
