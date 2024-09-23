import { PasscodeSetup, useAuth } from '@/kernel/auth';

export const PasscodeSetupPage = () => {
  const { _onPasscodeSuccess } = useAuth();

  return (
    <div className="h-full flex justify-center items-center">
      <PasscodeSetup onPasscodeSuccess={_onPasscodeSuccess} />
    </div>
  );
};
