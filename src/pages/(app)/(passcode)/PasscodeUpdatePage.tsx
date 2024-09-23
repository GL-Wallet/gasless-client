import { PasscodeUpdate, useAuth } from '@/kernel/auth';

export const PasscodeUpdatePage = () => {
  const { _actualPasscode, _onPasscodeSuccess } = useAuth();

  return (
    <div className="h-full flex justify-center items-center">
      <PasscodeUpdate actualPasscode={_actualPasscode} onPasscodeSuccess={_onPasscodeSuccess} />
    </div>
  );
};
